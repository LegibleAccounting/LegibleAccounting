# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.

from .models import Transaction, Journal, Receipt

admin.site.register(Journal)
admin.site.register(Transaction)
admin.site.register(Receipt)
