# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from auditlog.admin import LogEntryAdmin
from auditlog.models import LogEntry
from project.admin import admin_site

# Register your models here.
admin_site.register(LogEntry, LogEntryAdmin)
