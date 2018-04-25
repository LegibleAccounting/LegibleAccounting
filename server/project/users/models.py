# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from auditlog.registry import auditlog
from django.contrib.auth.models import User

# Create your models here.
auditlog.register(User)
