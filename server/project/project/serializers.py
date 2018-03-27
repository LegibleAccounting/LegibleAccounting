from auditlog.models import LogEntry
from django.contrib.auth.models import User, Group

from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name',)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'groups', 'last_login', 'is_active',)
        read_only_fields = ('id', 'last_login',)

    groups = GroupSerializer(many=True)


class WriteUserSerializer(UserSerializer):
    groups = serializers.PrimaryKeyRelatedField(many=True, queryset=Group.objects.all())

    def create(self, validated_data):
        instance = User.objects.create_user(
            validated_data['username'])

        instance.is_active = validated_data.get('is_active', False)

        instance.save()

        groups = validated_data.pop('groups')
        for group in groups:
            instance.groups.add(group)

        return instance

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.is_active = validated_data.get('is_active', instance.is_active)

        instance.save()
        instance.groups.clear()

        groups = validated_data.pop('groups')
        for group in groups:
            instance.groups.add(group)

        return instance


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
