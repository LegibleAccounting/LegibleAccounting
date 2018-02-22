from rest_framework import serializers
from .models import Account, AccountType, ACCOUNT_CATEGORIES

class AccountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountType
        fields = ('id', 'category', 'name',)

class RetrieveAccountTypeSerializer(AccountTypeSerializer):
    category = serializers.SerializerMethodField()

    def get_category(self, obj):
        return ACCOUNT_CATEGORIES[obj.category][1]

ACCOUNT_BASE_FIELDS = ('id', 'account_type', 'name', 'description', 'initial_balance', 'created_date', 'is_active',)
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS + ('relative_liquidity',)

class RetrieveAccountSerializer(AccountSerializer):
    class Meta:
        model = Account
        fields = ACCOUNT_BASE_FIELDS + ('account_number',)

    account_type = AccountTypeSerializer()
