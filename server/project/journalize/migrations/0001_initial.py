# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-09 15:16
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import journalize.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='JournalEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_type', models.SmallIntegerField(choices=[(1, 'Regular'), (2, 'Adjusting'), (3, 'Closing')])),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date', models.DateField()),
                ('is_approved', models.NullBooleanField()),
                ('rejection_memo', models.CharField(blank=True, max_length=200, null=True)),
                ('description', models.CharField(blank=True, max_length=200, null=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=journalize.models.get_upload_path, verbose_name='Receipt File')),
                ('original_filename', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.DecimalField(decimal_places=2, max_digits=20)),
                ('is_debit', models.BooleanField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('affected_account', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='transactions', to='accounts.Account')),
                ('journal_entry', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='transactions', to='journalize.JournalEntry')),
            ],
        ),
        migrations.AddField(
            model_name='receipt',
            name='of_transaction',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receipts', to='journalize.Transaction'),
        ),
    ]