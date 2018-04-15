from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import DjangoModelPermissions
from django.utils import timezone
from rest_framework.decorators import list_route, detail_route
from .models import Account, AccountType, ACCOUNT_CATEGORIES
from .serializers import AccountSerializer, AccountTypeSerializer, RetrieveAccountSerializer, RetrieveAccountTypeSerializer, LedgerAccountSerializer
from rest_framework.response import Response
from project.utils import format_currency
from journalize.models import JournalEntry, Transaction


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
    def trial_balance(self, request):
        active_accounts = Account.objects.filter(is_active=True)
        nonzero_accounts = []
        debit_total = 0
        credit_total = 0

        for account in active_accounts:
            account_balance = account.get_balance()

            if account_balance != 0:
                nonzero_accounts.append({
                    'account_id': account.pk,
                    'account_number': account.account_number(),
                    'account_name': account.name,
                    'balance': format_currency(account_balance),
                    'is_debit': account.is_debit(),
                })

                if account.is_debit():
                    debit_total += account_balance
                else:
                    credit_total += account_balance

        return Response({
            'accounts': nonzero_accounts,
            'debit_total': format_currency(debit_total),
            'credit_total': format_currency(credit_total),
            'as_of_date': timezone.now()
        })

    @list_route(methods=['get'])
    def income_statement(self, request):
        active_accounts = Account.objects.all().filter(is_active=True)
        expenses = []
        revenues = []
        expenses_total = 0
        revenues_total = 0

        for account in active_accounts:
            account_balance = account.get_balance()
            if account_balance != 0:
                account_summary = {
                    'account_id': account.pk,
                    'account_number': account.account_number(),
                    'account_name': account.name,
                    'balance': format_currency(account_balance),
                    'is_debit': account.is_debit()
                }

                if account.account_type.category == 3:  # 3 is Revenues
                    revenues.append(account_summary)
                    revenues_total += account_balance
                elif account.account_type.category == 4:  # 4 is Expenses
                    expenses.append(account_summary)
                    expenses_total += account_balance

        return Response({
            'expenses': expenses,
            'revenues': revenues,
            'expenses_total': format_currency(expenses_total * -1),
            'revenues_total': format_currency(revenues_total),
            'net_profit': format_currency(revenues_total - expenses_total),
            'as_of_date': timezone.now()
        })

    # Determine the Income Summary / Retained Earnings
    @list_route(methods=['get'])
    def retained_earnings(self, request):
        active_accounts = Account.objects.filter(is_active=True)
        retained_earnings_beginning = 0
        capital = 0
        net_profit = 0
        dividends_total = 0

        for account in active_accounts:
            account_balance = account.get_balance()

            if account.account_type.category == 2:  # Equity Account
                if account.name == 'Retained Earnings':
                    retained_earnings_beginning = account_balance
                elif account.name == "John Addams, Capital":
                    capital = account_balance
                elif account.name != "Income Summary":
                    dividends_total += account_balance
            elif account.account_type.category == 3:  # Revenue Account
                net_profit += account_balance
            elif account.account_type.category == 4:  # Expense Account
                net_profit -= account_balance

        return Response({
            'retained_earnings_beginning': format_currency(retained_earnings_beginning),
            'net_profit': format_currency(net_profit),
            'capital': format_currency(capital),
            'dividends_total': format_currency(dividends_total),
            'retained_earnings_ending': format_currency(retained_earnings_beginning + capital + net_profit - dividends_total)
        })

    @list_route(methods=['get'])
    def balance_sheet(self, request):
        active_accounts = Account.objects.all().filter(is_active=True)
        current_assets = []
        current_assets_total = 0
        noncurrent_assets = []
        noncurrent_assets_total = 0
        current_liabilities = []
        current_liabilities_total = 0
        noncurrent_liabilities = []
        noncurrent_liabilities_total = 0

        expenses_total = 0
        revenues_total = 0
        equity = []
        equity_total = 0
        for account in active_accounts:
            account_balance = account.get_balance()
            if account_balance != 0:
                account_summary = {
                    'account_id': account.pk,
                    'account_number': account.account_number(),
                    'account_name': account.name,
                    'balance': format_currency(account_balance),
                }
                if account.account_type.category == 0:  # 0 is Assets
                    if account.account_type.classification == 1:  # 1 is Current
                        current_assets.append(account_summary)
                        current_assets_total += account_balance
                    else:
                        noncurrent_assets.append(account_summary)
                        noncurrent_assets_total += account_balance
                        
                elif account.account_type.category == 1:  # 1 is Liabilities
                    if account.account_type.classification == 1:  # 1 is Current
                        current_liabilities.append(account_summary)
                        current_liabilities_total += account_balance
                    else:
                        noncurrent_liabilities.append(account_summary)
                        noncurrent_liabilities_total += account_balance

                elif account.account_type.category == 2:  # 2 is Equity
                    equity.append(account_summary)
                    equity_total += account_balance

                elif account.account_type.category == 3:  # 3 is Revenues
                    revenues_total += account_balance

                elif account.account_type.category == 4:  # 4 is Expenses
                    expenses_total += account_balance
                    
        response = {
            'current_assets': current_assets,
            'current_liabilities': current_liabilities,
            'noncurrent_assets': noncurrent_assets,
            'noncurrent_liabilities': noncurrent_liabilities,
            'equity': equity,
            'current_assets_total': format_currency(current_assets_total),
            'noncurrent_assets_total': format_currency(noncurrent_assets_total),
            'current_liabilities_total': format_currency(current_liabilities_total),
            'noncurrent_liabilities_total': format_currency(noncurrent_liabilities_total),
            'equity_total': format_currency(equity_total + revenues_total - expenses_total),  # THIS IS A HACKY SOLUTION DO NOT TRUST
            'cheaty': format_currency( revenues_total - expenses_total)
        }

        return Response(response)


def close_accounts(user):
    active_accounts = Account.objects.all().filter(is_active=True)
    credit_val = 0
    income_account = Account.objects.get_by_natural_key('Income Summary')
    closing_journal = JournalEntry(date=timezone.now(), creator=user, description="Auto-generated closing journal",
                                   entry_type=3, is_approved=True)
    for account in active_accounts:
        closer = Transaction(affected_account=account, journal_entry=closing_journal, value=account.get_balance())
        if account.account_type.category == 3 or account.account_type.category == 4:
            if account.account_type.category == 3:
                closer.is_debit = True
            elif account.account_type.category == 4:
                closer.is_debit = False
            credit_val += closer.get_value()
            closer.save()
    income_adjuster = Transaction(affected_account=income_account, journal_entry=closing_journal, value=abs(credit_val))
    income_adjuster.is_debit = credit_val > 0
    income_adjuster.save()
    closing_journal.save()



