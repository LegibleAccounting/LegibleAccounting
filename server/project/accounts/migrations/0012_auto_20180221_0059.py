# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-21 00:59
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_auto_20180220_1950'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 21, 0, 59, 21, 223321, tzinfo=utc)),
        ),
    ]
