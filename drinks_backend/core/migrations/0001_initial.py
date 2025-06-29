# Generated by Django 5.2 on 2025-05-25 14:35

import django.contrib.auth.models
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CocktailsCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=50)),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Cocktail Categories',
            },
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=50)),
                ('email', models.EmailField(default='', max_length=100)),
                ('subject', models.CharField(default='', max_length=200)),
                ('message', models.TextField(default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Contact',
                'verbose_name_plural': 'Contacts',
            },
        ),
        migrations.CreateModel(
            name='CustomerInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('county', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('latitude', models.CharField(max_length=500)),
                ('longitude', models.CharField(max_length=500)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=20)),
                ('delivery_area', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='DrinksCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=50)),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name': 'Drink Category',
                'verbose_name_plural': 'Drink Categories',
            },
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=50)),
                ('description', models.TextField(default='')),
                ('category', models.CharField(default='', max_length=50)),
                ('discount', models.CharField(default='', max_length=50)),
                ('code', models.CharField(default='', max_length=50)),
                ('discount_type', models.CharField(choices=[('percentage', 'Percentage'), ('fixed', 'Fixed'), ('bogo', 'Bogo')], default='percentage', max_length=50)),
                ('end_date', models.DateTimeField()),
            ],
            options={
                'verbose_name': 'Offer',
                'verbose_name_plural': 'Offers',
            },
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('username', models.CharField(max_length=50, unique=True)),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('staff', 'Staff')], default='client', max_length=10)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name_plural': 'Users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Cocktails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=50)),
                ('instructions', models.JSONField(default=dict)),
                ('time', models.CharField(default='', max_length=50)),
                ('ingredients', models.JSONField(default=dict)),
                ('description', models.TextField()),
                ('difficulty', models.CharField(default='', max_length=50)),
                ('image', models.ImageField(blank=True, default='', null=True, upload_to='products/')),
                ('serve_count', models.CharField(default='', max_length=50)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cocktails', to='core.cocktailscategory')),
            ],
            options={
                'verbose_name': 'Cocktail',
                'verbose_name_plural': 'Cocktails',
            },
        ),
        migrations.CreateModel(
            name='Drinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=50)),
                ('price', models.IntegerField(default=0)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, default='', null=True, upload_to='products/')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='drinks', to='core.drinkscategory')),
            ],
            options={
                'verbose_name': 'Drink',
                'verbose_name_plural': 'Drinks',
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_id', models.CharField(editable=False, max_length=200, unique=True)),
                ('products', models.JSONField(default=dict)),
                ('status', models.CharField(choices=[('initiated', 'Initiated'), ('delivered', 'Delivered'), ('paid', 'Paid'), ('updaid', 'Unpaid')], default='initiated', max_length=20)),
                ('order_total', models.CharField(default='', max_length=200)),
                ('payment_method', models.CharField(choices=[('card', 'Card'), ('mpesa', 'MPesa'), ('cash', 'Cash')], default='m-pesa', max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='core.customerinfo')),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
    ]
