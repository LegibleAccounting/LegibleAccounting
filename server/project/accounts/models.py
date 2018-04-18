# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from auditlog.registry import auditlog
from django.db import models

from project.utils import format_currency

NUM_ACCOUNTS_PER_ACCOUNT_TYPE = 100

ACCOUNT_CATEGORIES = (
    (0, 'Asset'),
    (1, 'Liability'),
    (2, 'Equity'),
    (3, 'Revenue'),
    (4, 'Operating Expense')
)

ACCOUNT_CLASSIFICATIONS = (
    (0, ''),
    (1, 'Current'), # NOTE: "Current" is synonymous with "Short-Term"
    (2, 'Long-Term') # NOTE: "Long-Term" is synonymous with "Non-Current"
)

class AccountTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

class AccountType(models.Model):
    class Meta:
        ordering = ['order']

    objects = AccountTypeManager()

    category = models.SmallIntegerField(choices=ACCOUNT_CATEGORIES)
    classification = models.SmallIntegerField(choices=ACCOUNT_CLASSIFICATIONS)
    name = models.CharField(max_length=100, unique=True)
    order = models.PositiveIntegerField(unique=True, verbose_name='order Value (1 represents highest order)')
    created_date = models.DateTimeField(auto_now_add=True, verbose_name='date Created')

    def __str__(self):
        return "{0}: {1}".format(self.order, self.name)

    def natural_key(self):
        return (self.name,)

    def is_debit(self):
        return True if (self.category == 0 or self.category == 4) else False

    def starting_number(self):
        return self.order * NUM_ACCOUNTS_PER_ACCOUNT_TYPE

class AccountManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

class Account(models.Model):
    class Meta:
        ordering = ['account_type__order', 'order']

    objects = AccountManager()

    account_type = models.ForeignKey(AccountType, on_delete=models.PROTECT)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(verbose_name='order Relative to Account Type (0 represents highest order)')
    initial_balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    created_date = models.DateTimeField(auto_now_add=True, verbose_name='date Created')
    is_active = models.BooleanField(default=False, verbose_name="active?")

    def __str__(self):
        return 'Account #' + "{:03}: ".format(self.account_number()) + self.name

    def natural_key(self):
        return (self.name,)

    def is_debit(self):
        return self.account_type.is_debit() and self.name.find("Depreciation") is -1

    def account_number(self):
        return (self.account_type.order * NUM_ACCOUNTS_PER_ACCOUNT_TYPE) + self.order

    def get_transaction_history(self):
        transactions = []
        post_balance = self.initial_balance
        for t in self.transactions.all():
            if t.journal_entry.is_approved:
                post_balance += (t.value * pow(-1, int(self.is_debit() ^ t.is_debit)))
                transactions.append({
                    'balance': format_currency(post_balance),
                    'is_debit': t.is_debit,
                    'journal_entry_id': t.journal_entry.id,
                    'date': t.journal_entry.date,
                    'journal_entry_description': t.journal_entry.description,
                    'value': format_currency(t.value)
                })

        return transactions

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
