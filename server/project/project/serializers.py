from auditlog.models import LogEntry
from django.contrib.auth.models import User, Group

from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'groups', 'last_login', 'is_active')

    groups = GroupSerializer(many=True)

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
