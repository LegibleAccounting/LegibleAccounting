from decimal import *
from django.db.models import Model
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from journalize.models import JournalEntry, Transaction
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import AllowAny, DjangoModelPermissions
from rest_framework.response import Response
from project.utils import format_currency, format_percent
from .models import Account, AccountType, ACCOUNT_CATEGORIES
from .permissions import LAAccountsClosingPermission
from .serializers import AccountSerializer, AccountTypeSerializer, RetrieveAccountSerializer, RetrieveAccountTypeSerializer, LedgerAccountSerializer

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

    #Current Ratio is the current total of assets divided by the current total of liabilities
    @list_route(methods=['get'])
    def current_ratio(self, request):
        cr = {
            "status" : "",
            "ratio" : 0
        }

        active_accounts = Account.objects.filter(is_active=True)
        total_assets = 0
        total_liabilities = 0

        for i in active_accounts:
            if i.account_type.category == 0 and i.account_type.classification == 1:
                total_assets += i.get_balance()
            elif i.account_type.category == 1 and i.account_type.classification == 1:
                total_liabilities += i.get_balance()

        cr["ratio"] = 0
        if (total_liabilities != 0):
            cr["ratio"] = Decimal(total_assets / total_liabilities)

        if cr["ratio"] < 0.02:
            cr["status"] = "red"
        elif cr["ratio"] >= 0.02 and cr["ratio"] <= 0.05:
            cr["status"] = "yellow"
        else:
            cr["status"] = "green"

        cr["ratio"] = format_percent(cr["ratio"] * 100)

        return Response(cr)

    @list_route(methods=['get'])
    def return_on_assets(self, request):
        ratio = 0
        status = ""
        net_profit = 0
        total_assets = 0
        active_accounts = Account.objects.filter(is_active=True)

        for account in active_accounts:
            account_balance = account.get_balance()
            if account.account_type.category == 0:  # 0 is Asset
                total_assets += account_balance
            elif account.account_type.category == 3:  # 3 is Revenues
                net_profit += account_balance
            elif account.account_type.category == 4:  # 4 is Expenses
                net_profit -= account_balance

        output = 0
        if total_assets != 0:
            output = Decimal(net_profit / total_assets)

        if output < 0.05:
            status = "red"
        elif output >= 0.05 and output < 0.1:
            status = "yellow"
        else:
            status = "green"

        output = format_percent(output * 100)

        return Response({
            'ratio': output,
            'status': status
        })

    @list_route(methods=['get'])
    def return_on_equity(self, request):
        ratio = 0
        status = ""
        net_profit = 0
        total_equity = 0
        active_accounts = Account.objects.filter(is_active=True)

        for account in active_accounts:
            account_balance = account.get_balance()
            if account.account_type.category == 2:  # 2 is Equity
                total_equity += account_balance
            elif account.account_type.category == 3:  # 3 is Revenues
                net_profit += account_balance
            elif account.account_type.category == 4:  # 4 is Expenses
                net_profit -= account_balance

        output = 0
        if total_equity != 0:
            output = Decimal(net_profit / total_equity)

        if output < 0.05:
            status = "red"
        elif output >= 0.05 and output < 0.1:
            status = "yellow"
        else:
            status = "green"

        output = format_percent(output * 100)

        return Response({
            'ratio': output,
            'status': status
        })

    @list_route(methods=['get'])
    def net_profit_margin(self, request):
        ratio = 0
        status = ""
        net_profit = 0
        total_sales = 0
        active_accounts = Account.objects.filter(is_active=True)

        for account in active_accounts:
            account_balance = account.get_balance()
            if account.account_type.category == 3:  # 3 is Revenue. TODO make sure it is correct to use all revenues for this
                total_sales += account_balance
                net_profit += account_balance
            elif account.account_type.category == 4:  # 4 is Expenses
                net_profit -= account_balance

        output = 0
        if total_sales != 0:
            output = Decimal(net_profit / total_sales)

        if output < 0.05:
            status = "red"
        elif output >= 0.05 and output < 0.1:
            status = "yellow"
        else:
            status = "green"

        output = format_percent(output * 100)

        return Response({
            'ratio': output,
            'status': status
        })

    @list_route(methods=['get'])
    def asset_turnover(self, request):
        ratio = 0
        status = ""
        total_assets = 0
        total_sales = 0
        active_accounts = Account.objects.filter(is_active=True)

        for account in active_accounts:
            account_balance = account.get_balance()
            if account.account_type.category == 0:  # 0 is Assets
                total_assets += account_balance
            elif account.account_type.category == 3:  # 3 is Revenue. TODO make sure it is correct to use all revenues for this
                total_sales += account_balance

        output = 0
        if total_assets != 0:
            output = Decimal(total_sales / total_assets)

        if output < 0.03:
            status = "red"
        elif output >= 0.03 and output < 0.07:
            status = "yellow"
        else:
            status = "green"

        output = format_percent(output * 100)

        return Response({
            'ratio': output,
            'status': status
        })

    @list_route(methods=['get'])
    def quick_ratio(self, request):
        ratio = 0
        status = ""
        total_assets = 0
        total_liabilities = 0
        total_inventory = 0
        active_accounts = Account.objects.filter(is_active=True)

        for account in active_accounts:
            account_balance = account.get_balance()
            if account.account_type.category == 0 and account.account_type.classification == 1:  # 0 is Assets
                total_assets += account_balance
                if account.account_type.name == "Inventories":
                    total_inventory += account_balance

            elif account.account_type.category == 1 and account.account_type.classification == 1:  # 1 is Liabilities
                total_liabilities += account_balance

        output = 0
        if total_liabilities != 0:
            output = Decimal((total_assets - total_inventory) / total_liabilities)

        if output < 0.02:
            status = "red"
        elif output >= 0.02 and output < 0.04:
            status = "yellow"
        else:
            status = "green"

        output = format_percent(output * 100)

        return Response({
            'ratio': output,
            'status': status
        })

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
        active_accounts = Account.objects.filter(is_active=True)
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

    @list_route(methods=['get'])
    def retained_earnings(self, request):
        active_accounts = Account.objects.filter(is_active=True)
        retained_earnings_beginning = 0
        net_profit = 0
        dividends_total = 0

        for account in active_accounts:
            account_balance = account.get_balance()

            if account.account_type.category == 2:  # Equity Account
                if account.name == 'Retained Earnings':
                    retained_earnings_beginning = account_balance
                elif 'Drawing' in account.name:
                        # or account.name == "Paid in Capital in Excess of Par/Stated Value--Common Stock" \
                        # or account.name == 'Paid in Capital in Excess of Par/Stated Value--Preferred Stock' \
                        # or account.name == 'Paid in Capital from Sale of Treasury Stock':
                    # NOTE: We are only accounting for business owner equity here, not shareholders equity.
                    dividends_total += account_balance
            elif account.account_type.category == 3:  # Revenue Account
                net_profit += account_balance
            elif account.account_type.category == 4:  # Expense Account
                net_profit -= account_balance

        return Response({
            'retained_earnings_beginning': format_currency(retained_earnings_beginning),
            'net_profit': format_currency(net_profit),
            'dividends_paid': format_currency(dividends_total),
            'retained_earnings_ending': format_currency(retained_earnings_beginning + net_profit - dividends_total),
            'as_of_date': timezone.now()
        })

    @list_route(methods=['get'])
    def balance_sheet(self, request):
        active_accounts = Account.objects.filter(is_active=True)
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

            if account.is_contra:
                # Since we are calculating total valuation for each category/classification
                # of account, we need to make sure that the balances of any contra
                # accounts are subtracted from the totals.
                account_balance = account_balance * -1

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

        #Part of Cheaty Method
        if revenues_total - expenses_total != 0:
            equity.append({
                'account_id': 0,
                'account_number': 0,
                'account_name': 'Income Estimation',
                'balance': format_currency(revenues_total - expenses_total),
            })
        #####################
        hacky_equity_total = equity_total + revenues_total - expenses_total # THIS IS A HACKY SOLUTION DO NOT TRUST
        asset_total = current_assets_total + noncurrent_assets_total
        liability_total = equity_total + current_liabilities_total + noncurrent_liabilities_total + revenues_total - expenses_total
        response = {
            'current_assets': current_assets,
            'current_liabilities': current_liabilities,
            'noncurrent_assets': noncurrent_assets,
            'noncurrent_liabilities': noncurrent_liabilities,
            'equity': equity,
            'current_assets_total': format_currency(current_assets_total) if current_assets_total is not 0 else None,
            'noncurrent_assets_total': format_currency(noncurrent_assets_total) if noncurrent_assets_total is not 0 else None,
            'current_liabilities_total': format_currency(current_liabilities_total) if current_liabilities_total is not 0 else None,
            'noncurrent_liabilities_total': format_currency(noncurrent_liabilities_total) if noncurrent_liabilities_total is not 0 else None,
            'equity_total': format_currency(hacky_equity_total) if hacky_equity_total is not 0 else None,
            'asset_total': format_currency(asset_total),
            'liability_total': format_currency(liability_total),
            'as_of_date': timezone.now()
        }

        return Response(response)

    @list_route(methods=['post'], permission_classes=[LAAccountsClosingPermission])
    def close_accounts(self, request):
        accounts = Account.objects.filter(is_active=True, account_type__category__in=[2, 3, 4])
        income_value = 0
        debits = []
        credits = []
        has_income_adjustment = False

        closing_journal = JournalEntry(date=timezone.now(), creator=request.user, description="Auto-generated closing journal",
                                       entry_type=3, is_approved=True)
        closing_journal.save()

        for account in accounts:
            balance = account.get_balance();
            if balance == 0:
                # No need to close an account that does not have a balance
                continue

            closer = Transaction(affected_account=account, journal_entry=closing_journal, is_debit=not account.is_debit(),
                                 value=abs(balance))

            if account.account_type.category == 3 or account.account_type.category == 4:
                has_income_adjustment = True

                if closer.is_debit:
                    debits.append(closer)
                else:
                    credits.append(closer)

                income_value += closer.get_value()

            elif account.account_type.category == 2 and "Drawing" in account.name:
                # NOTE: We are only accounting for business owner equity here, not shareholders equity.
                try:
                    equity_adjuster = Account.objects.get_by_natural_key(account.name.replace("Drawing", "Capital"))

                    if not equity_adjuster.is_active:
                        equity_adjuster.is_active = True
                        equity_adjuster.save()

                except Model.DoesNotExist:
                    closing_journal.delete()

                    return Response({
                        'message': 'The Drawing account "%s" does not have a corresponding Capital account to adjust. No accounts were closed.' % \
                            account.name }, status=403)

                debits.append(Transaction(affected_account=equity_adjuster, journal_entry=closing_journal,
                                          value=abs(balance), is_debit=True))
                credits.append(closer)

        if not len(debits) and not len(credits):
            closing_journal.delete()
            return Response({ 'message': 'Account have already been closed.' }, status=200)

        if has_income_adjustment:
            try:
                income_account = Account.objects.get_by_natural_key('Retained Earnings')

                if not income_account.is_active:
                    income_account.is_active = True
                    income_account.save()

            except Model.DoesNotExist:
                closing_journal.delete()

                return Response({
                    'message': 'There is no acccount named "Retaining Earnings". No accounts were closed.'
                }, status=403)

            income_adjuster = Transaction(affected_account=income_account, journal_entry=closing_journal, value=abs(income_value))
            income_adjuster.is_debit = income_value < 0  # if income_value is positive, it debits the Retained Earnings else credits

            if income_adjuster.is_debit:
                debits.append(income_adjuster)
            else:
                credits.append(income_adjuster)

        transaction_list = debits + credits
        for transaction in transaction_list:
            transaction.save()

        return Response({'message': 'Accounts have been closed.'}, status=200)
