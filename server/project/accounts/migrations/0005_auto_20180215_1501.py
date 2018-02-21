# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-15 20:01
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20180215_1459'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 15, 20, 1, 0, 428000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='account',
            name='is_active',
            field=models.CharField(choices=[('t', 'True'), ('f', 'False'), ('n', 'Null')], default='t', max_length=1),
        ),
        migrations.AlterField(
            model_name='journal',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 15, 20, 1, 0, 429000, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2018, 2, 15, 20, 1, 0, 429000, tzinfo=utc)),
        ),
    ]
