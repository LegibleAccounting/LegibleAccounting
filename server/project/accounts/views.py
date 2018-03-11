from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import DjangoModelPermissions

from rest_framework.decorators import detail_route
from .models import Account, AccountType
from .serializers import AccountSerializer, AccountTypeSerializer, RetrieveAccountSerializer, RetrieveAccountTypeSerializer, LedgerAccountSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class AccountTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccountType.objects.all()
    serializer_class = AccountTypeSerializer

    def get_serializer_class(self):
        if self.request.method != 'GET':
            return super(AccountTypeViewSet, self).get_serializer_class()

        return RetrieveAccountTypeSerializer


class AccountLedgerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Account.objects.all()
    serializer_class = LedgerAccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    filter_backends = (SearchFilter, DjangoFilterBackend,)
    search_fields = ('name', 'description', 'account_type__name',)
    filter_fields = {
        'name': ['icontains'],
        'description': ['icontains'],
        'account_type__category': ['exact'],
        'account_type__name': ['icontains'],
        'is_active': ['exact']
    }
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

# def view_account_ledger(request, accountId, start, end):
#     account = get_object_or_404(Account, pk=accountId)
#     response = "{'id':{0:}, 'account_type':{1:}, 'name':{2:}, 'description':{3:}, 'initial_balance':{4:}, " \
#                "'created_date':{5:}, 'is_active':{6:}, 'order':{7:}, 'account_number':{8:}, " \
#                "'transactions':[{9:}]".format(account.id, account.account_type_id, account.name, account.description,
#                                               account.initial_balance, )
#
#     return HttpResponse(response, content_type='application/json')
