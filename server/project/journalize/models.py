# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from auditlog.registry import auditlog
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

from accounts.models import Account

JOURNAL_ENTRY_TYPE_CHOICES = (
    (1, 'Regular'),
    (2, 'Adjusting'),
    (3, 'Closing')
)

MANAGEMENT_JOURNAL_ENTRY_TYPES = [3]


class JournalEntry(models.Model):
    class Meta:
        ordering = ['-date', '-date_created']

    entry_type = models.SmallIntegerField(choices=JOURNAL_ENTRY_TYPE_CHOICES)
    date_created = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    is_approved = models.NullBooleanField(blank=True)
    rejection_memo = models.CharField(max_length=200, null=True, blank=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.PROTECT)

    def is_valid(self):
        balance = 0
        for t in self.transactions.all():
            balance += t.get_value()
        return balance == 0

    def __str__(self):
        return "Journal Entry {0:03d}".format(self.pk)


class Transaction(models.Model):
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


def get_upload_path(receipt, filename):
    return 'transaction_{0}/{1}'.format(receipt.of_transaction.pk, filename)

class Receipt(models.Model):
    of_transaction = models.ForeignKey(Transaction, related_name="receipts", on_delete=models.CASCADE)
    file = models.FileField(upload_to=get_upload_path, verbose_name="Receipt File")
    original_filename = models.CharField(max_length=256)

    def __str__(self):
        return "Receipt #{0:} for [{1:}]".format(
            self.pk, self.of_transaction
        )

auditlog.register(JournalEntry)

#         _
# /\___/\/ \
# | O O |  /
# | >u< | |
# |U   U| |
# |     | /
# |M   M|/  0x5352514C


