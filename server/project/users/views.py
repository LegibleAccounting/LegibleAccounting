# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User, Group
from project.permissions import LAAuthModelReadPermission
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import DjangoModelPermissions
from .serializers import UserSerializer, WriteUserSerializer, GroupSerializer


# Create your views here.
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    filter_backends = (SearchFilter, OrderingFilter,)
    search_fields = ('username', 'groups__name',)
    ordering_fields = ('username', 'is_active', 'groups__name',)
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer

        return WriteUserSerializer
