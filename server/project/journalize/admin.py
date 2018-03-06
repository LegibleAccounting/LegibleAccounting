# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.

from .models import Transaction, JournalEntry, Receipt

admin.site.register(JournalEntry)
admin.site.register(Transaction)
admin.site.register(Receipt)
