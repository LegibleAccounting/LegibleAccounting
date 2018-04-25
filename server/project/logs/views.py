# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from auditlog.models import LogEntry
from project.permissions import LAAuthModelReadPermission
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import DjangoModelPermissions
from .serializers import LogEntrySerializer

# Create your views here.
class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.filter(actor__is_staff=False)
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('actor__username', 'object_repr', 'timestamp',)
    ordering_fields = ('actor__username', 'object_repr', 'timestamp',)
    serializer_class = LogEntrySerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)
