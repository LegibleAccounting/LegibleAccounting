# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import DjangoModelPermissions

import django.views
from django.shortcuts import render
from .models import Transaction, Journal, Receipt
from .serializers import JournalSerializer, TransactionSerializer, ReceiptSerializer
from django.http.response import HttpResponse
from django.contrib.auth.models import Group
# Create your views here.


class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer
    manager = None

    permission_classes = (DjangoModelPermissions,)

    def create(self, request, *args, **kwargs):
        return super(JournalViewSet, self).create(request, args, kwargs)

    def update(self, request, pk=None):
        manager_feild_changed = not ((request.POST.get("status") == Journal.objects.get(pk=pk).is_approved
                                      or request.POST.get('status') is None) and
                                     (request.POST.get("rejection_memo") == Journal.objects.get(pk=pk).approval_memo
                                      or request.POST.get("rejection_memo") is None))
        if Group.objects.all().count() > 0 and self.manager is None:
            manager = Group.objects.all().filter(name="Manager").all()[0]
        if not manager_feild_changed or manager in request.user.groups.all():
                if request.POST.get("status") == 'a':
                    if Journal.objects.get(pk=pk).is_valid():
                        return super(JournalViewSet, self).update(request, pk)
                    else:
                        return HttpResponse('Journal is not balanced', status=401)
                else:
                    return super(JournalViewSet, self).update(request, pk)
        return HttpResponse('Unauthorized permissions for journal approval', status=401)

    def get_serializer_class(self):
        if self.request.method != 'GET':
            return super(JournalViewSet, self).get_serializer_class()

        return JournalSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    permission_classes = (DjangoModelPermissions,)

    def get_serializer_class(self):
        if self.request.method != 'GET':
            return super(TransactionViewSet, self).get_serializer_class()

        return TransactionSerializer


class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

    permission_classes = (DjangoModelPermissions,)

    def get_serializer_class(self):
        if self.request.method != 'GET':
            return super(ReceiptViewSet, self).get_serializer_class()

        return ReceiptSerializer


def RecieptGenerator(request):
    return HttpResponse()

