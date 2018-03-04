# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-04 20:21
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('description', models.CharField(blank=True, max_length=200)),
                ('order', models.PositiveIntegerField(verbose_name='order Relative to Account Type (0 represents highest order)')),
                ('initial_balance', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='date Created')),
                ('is_active', models.BooleanField(default=False, verbose_name='active?')),
            ],
            options={
                'ordering': ['account_type__liquidity', 'order'],
            },
        ),
        migrations.CreateModel(
            name='AccountType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.SmallIntegerField(choices=[(0, 'Asset'), (1, 'Liability'), (2, 'Equity'), (3, 'Revenue'), (4, 'Operating Expense')])),
                ('name', models.CharField(max_length=100, unique=True)),
                ('liquidity', models.PositiveIntegerField(unique=True, verbose_name='liquidity Value (1 represents highest liquidity)')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='date Created')),
            ],
            options={
                'ordering': ['liquidity'],
            },
        ),
        migrations.AddField(
            model_name='account',
            name='account_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='accounts.AccountType'),
        ),
    ]
