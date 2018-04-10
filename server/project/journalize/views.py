# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.response import Response

from .models import JournalEntry, MANAGEMENT_JOURNAL_ENTRY_TYPES
from .permissions import LAJournalEntryReadPermission
from .serializers import RetrieveJournalEntrySerializer, CreateJournalEntrySerializer, UpdateJournalEntrySerializer


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    filter_backends = (SearchFilter, DjangoFilterBackend,)
    search_fields = ('date', 'description', 'creator__username',)
    filter_fields = {
        'date': ['range'],
        'description': ['icontains'],
        'creator__username': ['icontains'],
        'is_approved': ['exact']
    }
    serializer_class = RetrieveJournalEntrySerializer
    permission_classes = (DjangoModelPermissions, LAJournalEntryReadPermission,)

    def options(self, request, *args, **kwargs):
        meta = self.metadata_class()
        data = meta.determine_metadata(request, self)
        if not request.user.groups.filter(name='Manager').exists():
            data['actions']['POST']['entry_type']['choices'] = [item for item in data['actions']['POST']['entry_type']['choices'] if item['value'] not in MANAGEMENT_JOURNAL_ENTRY_TYPES]

        return Response(data)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateJournalEntrySerializer
        elif self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UpdateJournalEntrySerializer
        else:
            return super(JournalEntryViewSet, self).get_serializer_class()
