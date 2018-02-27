from rest_framework import serializers
from .models import Account, AccountType

class AccountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountType
        fields = ('id', 'category', 'name', 'starting_number')

class RetrieveAccountTypeSerializer(AccountTypeSerializer):
    category = serializers.SerializerMethodField()

    def get_category(self, obj):
        return obj.get_category_display()

ACCOUNT_BASE_FIELDS = ('id', 'account_type', 'name', 'description', 'initial_balance', 'created_date', 'is_active', 'relative_liquidity')
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS

class RetrieveAccountSerializer(AccountSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS + ('account_number',)

    account_type = RetrieveAccountTypeSerializer()
