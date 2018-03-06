# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets
from rest_framework.permissions import DjangoModelPermissions

from .models import Journal
from .permissions import LAJournalReadPermission
from .serializers import RetrieveJournalSerializer, CreateJournalSerializer, UpdateJournalSerializer
from django.http.response import HttpResponse
from django.contrib.auth.models import Group


class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = RetrieveJournalSerializer
    permission_classes = (DjangoModelPermissions, LAJournalReadPermission,)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateJournalSerializer
        elif self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UpdateJournalSerializer
        else:
            return super(JournalViewSet, self).get_serializer_class()
