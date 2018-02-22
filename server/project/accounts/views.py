# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from accounts.models import Account
from django.shortcuts import get_object_or_404


def index(request):
    only_active = request.GET.get('active')
    if only_active != '0':
        only_active = True
    else:
        only_active = False
    all_accounts = '{"accounts":['
    count = 0
    for a in Account.objects.all():
        if a.is_active == 't' or not only_active:
            all_accounts += a.get_json() + ","
            count += 1
    if count > 0:
        all_accounts = all_accounts[:-1] + "]}"
    else:
        all_accounts = all_accounts + "]}"
    return HttpResponse(all_accounts, content_type='application/json')


def account(request, account_id):
    a = get_object_or_404(Account, pk=account_id)
    return HttpResponse(a.get_json(), content_type='application/json')

