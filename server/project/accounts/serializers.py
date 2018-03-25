from rest_framework import serializers
from .models import Account, AccountType, TransactionAtTime


class AccountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountType
        fields = ('id', 'category', 'name', 'starting_number',)


class RetrieveAccountTypeSerializer(AccountTypeSerializer):
    category = serializers.SerializerMethodField()

    def get_category(self, obj):
        return obj.get_category_display()


ACCOUNT_BASE_FIELDS = ('id', 'account_type', 'name', 'description', 'initial_balance', 'created_date', 'is_active', 'order',)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS

    def update(self, instance, validated_data):
        if validated_data.get('is_active') is False and instance.get_balance() != 0:
            raise serializers.ValidationError('Accounts with a non-zero balance cannot be disabled.')

        return super(AccountSerializer, self).update(instance, validated_data)


class RetrieveAccountSerializer(AccountSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS + ('account_number', 'balance',)

    account_type = RetrieveAccountTypeSerializer()
    balance = serializers.SerializerMethodField()

    def get_balance(self, obj):
        return '${:,.2f}'.format(obj.get_balance())


class AccountAtTimeSerializer(serializers.Serializer):
    balance = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    journal_entry_id = serializers.IntegerField(read_only=True)
    journal_entry_description = serializers.CharField(read_only=True)
    is_debit = serializers.BooleanField(read_only=True)
    date = serializers.DateField(read_only=True)

    def get_balance(self, obj):
        return '${:,.2f}'.format(obj.balance)

    def get_value(self, obj):
        return '${:,.2f}'.format(obj.value)

    def create(self, validated_data):
        return TransactionAtTime(**validated_data)

    def update(self, instance, validated_data):
        pass


class LedgerAccountSerializer(AccountSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS + ('account_number', 'balance', 'balances')


    account_type = RetrieveAccountTypeSerializer()
    initial_balance = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    balances = AccountAtTimeSerializer(many=True)

    def get_initial_balance(self, obj):
        return '${:,.2f}'.format(obj.initial_balance)

    def get_balance(self, obj):
        return '${:,.2f}'.format(obj.get_balance())
