# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-21 21:43
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_auto_20180221_1639'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 21, 21, 43, 32, 320000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='accounttype',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 21, 21, 43, 32, 319000, tzinfo=utc)),
        ),
    ]
