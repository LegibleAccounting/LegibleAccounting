# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from auditlog.registry import auditlog
from django.db import models

NUM_ACCOUNTS_PER_ACCOUNT_TYPE = 100

ACCOUNT_CATEGORIES = (
    (0, 'Asset'),
    (1, 'Liability'),
    (2, 'Equity'),
    (3, 'Revenue'),
    (4, 'Operating Expense')
)


class AccountType(models.Model):
    class Meta:
        ordering = ['liquidity']

    category = models.SmallIntegerField(choices=ACCOUNT_CATEGORIES)
    name = models.CharField(max_length=100, unique=True)
    liquidity = models.PositiveIntegerField(unique=True, verbose_name='liquidity Value (1 represents highest liquidity)')
    created_date = models.DateTimeField(auto_now_add=True, verbose_name='date Created')

    def __str__(self):
        return "{0}: {1}".format(self.liquidity, self.name)

    def is_debit(self):
        return True if (self.category == 0 or self.category == 4) else False

    def starting_number(self):
        return self.liquidity * NUM_ACCOUNTS_PER_ACCOUNT_TYPE


class TransactionAtTime:
    balance = 0
    is_debit = False
    journal_entry_id = None
    journal_entry_description = None
    value = 0

    def __init__(self, balance=0, is_debit=False,journal_entry_id=None,journal_entry_description=None, value=0,date=None):
        self.balance = balance
        self.is_debit = is_debit
        self.journal_entry_id = journal_entry_id
        self.journal_entry_description = journal_entry_description
        self.value = value
        self.date = date



class Account(models.Model):
    class Meta:
        ordering = ['account_type__liquidity', 'order']

    account_type = models.ForeignKey(AccountType, on_delete=models.PROTECT)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(verbose_name='order Relative to Account Type (0 represents highest order)')
    initial_balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    created_date = models.DateTimeField(auto_now_add=True, verbose_name='date Created')
    is_active = models.BooleanField(default=False, verbose_name="active?")

    def __str__(self):
        return 'Account #' + "{:03}: ".format(self.account_number()) + self.name

    def is_debit(self):
        return self.account_type.is_debit()

    def account_number(self):
        return (self.account_type.liquidity * NUM_ACCOUNTS_PER_ACCOUNT_TYPE) + self.order

    def balances(self):
        values = []
        value = self.initial_balance
        transactions = self.transactions.order_by('journal_entry__date').all()
        for t in transactions:
            if t.journal_entry.is_approved:
                value += (t.value * pow(-1, int(self.is_debit() ^ t.is_debit)))
                values.append(TransactionAtTime(balance=value, is_debit=t.is_debit, journal_entry_id=t.journal_entry.id,
                                                journal_entry_description = t.journal_entry.description,
                                                value=t.value, date=t.journal_entry.date))
        return values

    def get_balance(self, as_of=None):
        # TODO: This will be updated to return a calculated balance
        # based on all transactions that have been made to this account.
        value = 0
        for t in self.transactions.all():
            if t.journal_entry.is_approved == True and (as_of is None or as_of >= t.date):
                value += t.get_value()
        value *= 1 if(self.is_debit()) else -1
        return self.initial_balance + value

auditlog.register(Account)

