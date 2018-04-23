from django.contrib.admin import AdminSite

class LegibleAccountingAdminSite(AdminSite):
    site_header = 'Legible Accounting Administration'
    site_title = 'Legible Accounting Site Admin'

admin_site = LegibleAccountingAdminSite(name='legibleaccounting_admin')
