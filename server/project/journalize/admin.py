# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from project.admin import admin_site

# Register your models here.

from .models import Transaction, JournalEntry, Receipt

admin_site.register(JournalEntry)
admin_site.register(Transaction)
admin_site.register(Receipt)
