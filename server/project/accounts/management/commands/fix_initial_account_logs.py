from auditlog.models import LogEntry
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Model

# This management command isn't an ideal solution to fixing initial event logs generated
# by django-auditlog for fixture data. Ideally, the fixture data would be loaded via a
# database migration instead and a follow-up migration would then patch the event log.

ADMINISTRATOR_USERNAME = 'administrator1'
class Command(BaseCommand):
    help = 'Patches account event logs to ensure that any logs that do not have an actor are updated to have a appropriate default actor.'

    def handle(self, *args, **kwargs):
        try:
            administrator_user = User.objects.get_by_natural_key(ADMINISTRATOR_USERNAME)
        except Model.DoesNotExist:
            raise CommandError('No administrator named "%s" exists in the system.' % ADMINISTRATOR_USERNAME)

        LogEntry.objects.filter(
            actor=None, content_type=ContentType.objects.get_by_natural_key('accounts', 'account')
        ).exclude(
            object_repr=ADMINISTRATOR_USERNAME
        ).update(
            actor=administrator_user
        )
