from auditlog.admin import LogEntryAdmin
from auditlog.models import LogEntry
from django.contrib.admin import AdminSite
from django.contrib.auth.models import Group, User
from django.contrib.auth.admin import GroupAdmin, UserAdmin

class LegibleAccountingAdminSite(AdminSite):
    site_header = 'Legible Accounting Administration'
    site_title = 'Legible Accounting Site Admin'

admin_site = LegibleAccountingAdminSite(name='legibleaccounting_admin')
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
admin_site.register(LogEntry, LogEntryAdmin)
