# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-16 02:21
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_auto_20180215_1621'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='id',
        ),
        migrations.RemoveField(
            model_name='journal',
            name='id',
        ),
        migrations.AlterField(
            model_name='account',
            name='account_id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='account',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 16, 2, 21, 44, 945000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='journal',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 16, 2, 21, 44, 946000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='journal',
            name='journal_id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 16, 2, 21, 44, 946000, tzinfo=utc)),
        ),
    ]
