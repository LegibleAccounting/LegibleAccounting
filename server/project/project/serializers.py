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
        fields = ('id', 'first_name', 'last_name', 'username', 'groups', 'last_login', 'is_active',)

    groups = GroupSerializer(many=True)

    def create(self, validated_data):
        acc = User(first_name=validated_data['first_name'],
                   last_name=validated_data['last_name'],
                   username=validated_data['username'],
                   is_active=validated_data['is_active'],)

        groups = validated_data.pop('groups')
        for group in groups:
            acc.groups.add(Group.objects.get(pk=group))

        acc.save()
        return acc

    def update(self, instance, validated_data):
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.username = validated_data['username']
        instance.is_active = validated_data['is_active']

        instance.groups.clear()

        groups = validated_data.pop('groups')
        for group in groups:
            instance.groups.add(Group.objects.get(pk=group))

        instance.save()
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
