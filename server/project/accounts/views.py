from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import DjangoModelPermissions

from rest_framework.decorators import detail_route, list_route
from .models import Account, AccountType
from .serializers import AccountSerializer, AccountTypeSerializer, RetrieveAccountSerializer, RetrieveAccountTypeSerializer, LedgerAccountSerializer
from rest_framework.response import Response
from decimal import *
getcontext().prec = 2

class AccountTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccountType.objects.all()
    serializer_class = AccountTypeSerializer

    def get_serializer_class(self):
        if self.request.method != 'GET':
            return super(AccountTypeViewSet, self).get_serializer_class()

        return RetrieveAccountTypeSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    filter_backends = (SearchFilter, DjangoFilterBackend, OrderingFilter,)
    search_fields = ('name', 'description', 'account_type__name',)
    filter_fields = {
        'name': ['icontains'],
        'description': ['icontains'],
        'account_type__category': ['exact'],
        'account_type__name': ['icontains'],
        'is_active': ['exact']
    }
    ordering_fields = ('name', 'account_type__name', 'account_type__category', 'account_type__order', 'order',)
    serializer_class = AccountSerializer
    permission_classes = (DjangoModelPermissions,)

    def get_serializer_class(self):
        if self.request.method != 'GET':
            return super(AccountViewSet, self).get_serializer_class()

        return RetrieveAccountSerializer

    @detail_route(methods=['get'])
    def ledger(self, request, pk=None):
        serializer = LedgerAccountSerializer(Account.objects.get(pk=pk))
        return Response(serializer.data)

    @list_route(methods=['get'])
    #Current Ratio is the current total of assets divided by the current total of liabilities
    def current_ratio(self, request):
        cr = {
            "status" : "",
            "ratio" : 0
        }

        all_accounts = Account.objects.all()
        total_assets = 0
        total_liabilities = 0
        for i in all_accounts:
            if i.account_type.category == 0 and i.account_type.classification == 1:
                total_assets += i.get_balance()
            elif i.account_type.category == 1 and i.account_type.classification == 1:
                total_liabilities += i.get_balance()
        cr["ratio"] = Decimal(total_assets/total_liabilities)
        if cr["ratio"] < 0.02:
            cr["status"] = "red"
        elif cr["ratio"] >= 0.02 and cr["ratio"] <= 0.05:
            cr["status"] = "yellow"
        else:
            cr["status"] = "green"

        return Response(cr)