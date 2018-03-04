from rest_framework import serializers
from .models import Journal, Transaction, Receipt


ACCOUNT_BASE_FIELDS = ('date_created', 'status', 'rejection_memo', 'transactions')


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


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('effected_account', 'from_journal', 'value', 'charge', 'receipts')

    def create(self, validated_data):
        if validated_data['from_journal'].status == 'i':
            instance = Transaction(
                effected_account=validated_data['effected_account'], from_journal=validated_data['from_journal'],
                value=validated_data['value'], charge=validated_data['charge']
            )
            instance.save()
            return instance
        raise serializers.ValidationError("The journal has already been approved!")


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ACCOUNT_BASE_FIELDS

    def create(self, validated_data):
        j = Journal(status='i', approval_memo=None)
        j.save()
        return j

    def update(self, instance, validated_data):
        if instance.status == 'a' or instance.status == 'd':
            raise serializers.ValidationError("The journal has already been approved/denied and can not be changed!")
        instance.status = validated_data.get('status')
        instance.approval_memo = validated_data.get('rejection_memo')
        valid_transactions = instance.transactions.all()
        for transaction in validated_data.get('transactions'):
            if transaction.from_journal is None:
                valid_transactions.append(transaction)
        instance.transactions = valid_transactions
        instance.save()
        return instance
#   transactions = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Transaction.objects.all())

# class RetrieveJournalSerializer(JournalSerializer):
#     class Meta:
#         model = Journal
#         fields = ACCOUNT_BASE_FIELDS



#
# class RetrieveTransactionSerializer(TransactionSerializer):
#     effected_account = AccountSerializer()
#     from_journal = JournalSerializer()


