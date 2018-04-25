# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group
from project.admin import admin_site

# Register your models here.
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
