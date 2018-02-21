# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# Create your models here.

from django.db import models
from django.utils import timezone

ACCOUNT_TYPES = (('a', 'Asset'), ('l', 'Liability'), ('e', 'Equity'))
BOOL_TYPES = (('t', 'True'), ('f', 'False'), ('n', 'Null'))


class Account(models.Model):
    account_id = models.IntegerField(primary_key=True)
    account_name = models.CharField(max_length=60, unique=True)
    priority = models.IntegerField(verbose_name="Priority (0 is top)", default=0)
    is_active = models.CharField(max_length=1, choices=BOOL_TYPES, default='t')
    category = models.CharField(max_length=1, choices=ACCOUNT_TYPES, default='a')
    starting_value = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    comments = models.CharField(max_length=200, null=True)
    date_created = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return "{:03}: ".format(self.account_id) + self.account_name + " ${:.2f}".format(self.get_balance())

    def get_side(self):
        return "Left" if (self.category == 'a') else "Right"

    def get_balance(self):
        type_mod = 1 if (self.category == 'a') else -1
        balance = self.starting_value * type_mod
        for t in self.transactions.all():
            if t.from_journal is not None:
                if t.from_journal.is_approved == 't':
                    balance += t.get_value()
        return balance * type_mod if (balance != 0) else 0.00

    def get_json(self):
        return '{{"name":"{0:}", "id":{1:}, "priority":{2:}, "date":"{3:}", "active":{4:}, "value":{5:}}}'.format(self.account_name, self.account_id,
                    self.priority, self.date_created, 1 if self.is_active == 't' else 0, self.get_balance())



