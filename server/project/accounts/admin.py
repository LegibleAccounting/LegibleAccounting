# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import Account


class AccountAdmin(admin.ModelAdmin):
    fieldsets = [('Administrator Values', {'fields': ['account_id', 'account_name', 'priority', 'category', 'date_created']}),
                 ('Manager Values', {'fields': ['is_active', 'starting_value', 'comments']})]


admin.site.register(Account, AccountAdmin)
