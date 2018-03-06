from rest_framework import serializers
from .models import Journal, Transaction, Receipt
from accounts.serializers import RetrieveAccountSerializer
from project.serializers import UserSerializer


class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ('of_transaction', 'img_url',)

    def create(self, validated_data):
        if validated_data['of_transaction'].from_journal.status == 'i':
            instance = Receipt(**validated_data)
            instance.save()
            return instance
        raise serializers.ValidationError("The transaction has already been approved!")


class RetrieveTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('date', 'affected_account', 'from_journal', 'value', 'charge', 'receipts',)

    affected_account = RetrieveAccountSerializer()


class CreateTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('affected_account', 'value', 'charge',)

    def validate_value(self, value):
        if value <= 0:
            raise serializers.ValidationError('A transaction cannot have a negative value.')

        return value


class RetrieveJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ('date_created', 'date', 'status', 'rejection_memo', 'description', 'creator', 'transactions',)

    transactions = RetrieveTransactionSerializer(many=True)
    creator = UserSerializer()


class CreateJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ('date', 'description', 'transactions',)

    transactions = CreateTransactionSerializer(many=True)

    def validate_transactions(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('There must be at least one transaction in a journal entry.')

        transaction_sum = reduce(lambda accumulated, update:
            accumulated + update['value'] if update['charge'] == 'd' else accumulated - update['value'], value, 0)

        if transaction_sum != 0:
            raise serializers.ValidationError('Transactions must be balanced.')

        return value

    def create(self, validated_data):
        transactions = validated_data.pop('transactions')

        journal = Journal.objects.create(**validated_data)

        for transaction in transactions:
            Transaction.objects.create(from_journal=journal, **transaction)

        return journal


class UpdateJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ('status', 'rejection_memo',)

    def update(self, instance, validated_data):
        if instance.status == 'a' or instance.status == 'd':
            raise serializers.ValidationError('The journal entry has already been approved/denied and can not be changed!')

        if (validated_data.get('status') == 'd' and len(validated_data.get('rejection_memo')) == 0):
            raise serializers.ValidationError('A rejection reason must be provided for denying the journal entry.')

        instance.status = validated_data.get('status')
        instance.rejection_memo = validated_data.get('rejection_memo')
        instance.save()

        return instance
