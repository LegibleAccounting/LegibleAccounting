# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets
from rest_framework.permissions import DjangoModelPermissions

from .models import JournalEntry
from .permissions import LAJournalEntryReadPermission
from .serializers import RetrieveJournalEntrySerializer, CreateJournalEntrySerializer, UpdateJournalEntrySerializer


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = RetrieveJournalEntrySerializer
    permission_classes = (DjangoModelPermissions, LAJournalEntryReadPermission,)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateJournalEntrySerializer
        elif self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UpdateJournalEntrySerializer
        else:
            return super(JournalEntryViewSet, self).get_serializer_class()
