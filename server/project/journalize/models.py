# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

from accounts.models import Account

CHARGE_TYPES = (('d', 'Debit'), ('c', 'Credit'))
JOURNAL_STATUS_TYPES = (('a', 'Approved'), ('d', 'Denied'), ('s', 'Submitted'), ('i', 'Initial'))


class Journal(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    status = models.CharField(max_length=1, choices=JOURNAL_STATUS_TYPES, default='i')
    rejection_memo = models.CharField(max_length=200, null=True, blank=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.PROTECT)

    def is_valid(self):
        balance = 0
        for t in self.transactions.all():
            balance += t.get_value()
        return balance == 0

    def __str__(self):
        return "Journal {0:03d} {1:}".format(self.pk, "Valid" if self.is_valid() else "Invalid")

    def get_json(self):
        return '{{"id":{0}, "approved":{1}, "memo":{2}, "dateCreated":"{3}"}}'.format(
            self.pk, self.status, self.rejection_memo, self.date_created
        )


class Transaction(models.Model):
    effected_account = models.ForeignKey(Account, related_name="transactions")
    from_journal = models.ForeignKey(Journal, related_name="transactions", null=True)
    value = models.DecimalField(max_digits=20, decimal_places=2)
    charge = models.CharField(max_length=1, choices=CHARGE_TYPES)
    date = models.DateTimeField(auto_now_add=True)

    def get_value(self):
        return self.value * 1 if (self.charge == 'd') else self.value * -1

    def __str__(self):
        charge = "DEBIT" if (self.charge == 'd') else "CREDIT"

        return "{0:} - Journal {3:03d} - {1:} - ${2:.2f}".format(
            self.effected_account.name, charge, self.value, self.from_journal.pk if self.from_journal is not None else -1
        )

    def get_json(self):
        return '{{"account": {0}, "journal": {1}, "value":{2}, "charge":{3}, "date":"{4}"}}'.format(
            self.effected_account.account_number(), self.from_journal.pk, self.value, self.charge, self.date
        )


class Receipt(models.Model):
    of_transaction = models.ForeignKey(Transaction, related_name="receipts", on_delete=models.CASCADE)
    img = models.FileField(verbose_name="Receipt Image")

    def __str__(self):
        return "Receipt #{0:} for [{1:}]".format(
            self.pk, self.of_transaction
        )

#         _
# /\___/\/ \
# | O O |  /
# | >u< | |
# |U   U| |
# |     | /
# |M   M|/  0x5352514C


