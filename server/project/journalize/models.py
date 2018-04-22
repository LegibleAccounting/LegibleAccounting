# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from auditlog.registry import auditlog
from django.db import models
from django.contrib.auth.models import User

from accounts.models import Account
from .enums import JournalEntryTypes

MANAGEMENT_JOURNAL_ENTRY_TYPES = [
    JournalEntryTypes.CLOSING
]

class JournalEntryManager(models.Manager):
    def get_by_natural_key(self, date_created, creator_username):
        return self.get(date_created=date_created, creator__username=creator_username)

class JournalEntry(models.Model):
    class Meta:
        ordering = ['-date', '-date_created']

    objects = JournalEntryManager()

    entry_type = models.SmallIntegerField(choices=(
        (JournalEntryTypes.REGULAR, 'Regular'),
        (JournalEntryTypes.ADJUSTING, 'Adjusting'),
        (JournalEntryTypes.CLOSING, 'Closing')
    ))

    date_created = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    is_approved = models.NullBooleanField(blank=True)
    memo = models.CharField(max_length=200, null=True, blank=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.PROTECT)

    def is_valid(self):
        balance = 0
        for t in self.transactions.all():
            balance += t.get_value()
        return balance == 0

    def __str__(self):
        return "Journal Entry {0:03d}".format(self.pk)

    def natural_key(self):
        return (self.date_created,) + self.creator.natural_key()


class TransactionManager(models.Manager):
    def get_by_natural_key(self, journal_entry_date_created, affected_account_name):
        return self.get(journal_entry__date_created=journal_entry_date_created, affected_account__name=affected_account_name)

class Transaction(models.Model):
    class Meta:
        ordering = ['journal_entry__date', 'date']

    objects = TransactionManager()

    affected_account = models.ForeignKey(Account, related_name="transactions", on_delete=models.PROTECT)
    journal_entry = models.ForeignKey(JournalEntry, related_name="transactions", on_delete=models.PROTECT)
    value = models.DecimalField(max_digits=20, decimal_places=2)
    is_debit = models.BooleanField()
    date = models.DateTimeField(auto_now_add=True)

    def get_value(self):
        return self.value * 1 if (self.is_debit == True) else self.value * -1

    def __str__(self):
        is_debit = "DEBIT" if (self.is_debit == True) else "CREDIT"

        return "{0:} - Journal Entry {3:03d} - {1:} - ${2:.2f}".format(
            self.affected_account.name, is_debit, self.value, self.journal_entry.pk if self.journal_entry is not None else -1
        )

    def natural_key(self):
        return (self.journal_entry.date_created,) + self.affected_account.natural_key()

    natural_key.dependencies = ['journalize.journalentry', 'accounts.account']


def get_upload_path(receipt, filename):
    return 'journal_{0}/{1}'.format(receipt.journal_entry.pk, filename)

class Receipt(models.Model):
    journal_entry = models.ForeignKey(JournalEntry, related_name="receipts", on_delete=models.CASCADE)
    file = models.FileField(upload_to=get_upload_path, verbose_name="Receipt File")
    original_filename = models.CharField(max_length=256)

    def __str__(self):
        return "Receipt #{0:} for [{1:}]".format(
            self.pk, self.journal_entry
        )

auditlog.register(JournalEntry)

#         _
# /\___/\/ \
# | O O |  /
# | >u< | |
# |U   U| |
# |     | /
# |M   M|/  0x5351524C

