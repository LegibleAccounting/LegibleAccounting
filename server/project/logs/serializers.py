from auditlog.models import LogEntry
from rest_framework import serializers
from users.serializers import UserSerializer

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = ('actor', 'object_repr', 'action', 'timestamp', 'changes',)

    actor = UserSerializer()
    action = serializers.SerializerMethodField()
    changes = serializers.SerializerMethodField()

    def get_action(self, obj):
        return obj.get_action_display()

    def get_changes(self, obj):
        return obj.changes_dict
