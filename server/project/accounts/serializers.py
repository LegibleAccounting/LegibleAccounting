from rest_framework import serializers
from .models import Account, AccountType


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
        return obj.get_balance()
