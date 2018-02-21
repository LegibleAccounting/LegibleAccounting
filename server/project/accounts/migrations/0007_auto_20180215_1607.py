# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-15 21:07
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_auto_20180215_1603'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 15, 21, 7, 37, 759000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='journal',
            name='approval_memo',
            field=models.CharField(default='Enter Memo Here', max_length=200),
        ),
        migrations.AlterField(
            model_name='journal',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 15, 21, 7, 37, 760000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 15, 21, 7, 37, 760000, tzinfo=utc)),
        ),
    ]
