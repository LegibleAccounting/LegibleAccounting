# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from project.admin import admin_site
from .models import Account, AccountType

admin_site.register(Account)
admin_site.register(AccountType)
