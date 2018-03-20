from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import DjangoModelPermissions

from rest_framework.decorators import detail_route
from .models import Account, AccountType
from .serializers import AccountSerializer, AccountTypeSerializer, RetrieveAccountSerializer, RetrieveAccountTypeSerializer, LedgerAccountSerializer
from rest_framework.response import Response


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
    ordering_fields = ('name', 'account_type__name', 'account_type__category', 'account_type__liquidity', 'order',)
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

