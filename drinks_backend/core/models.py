import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
import random
import string
import time

def generate_random_string(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def generate_order_id():
    timestamp = int(time.time())
    random_part = generate_random_string()
    return f"ORD-{timestamp}-{random_part}"

def get_unique_order_id():
    while True:
        order_id = generate_order_id()
        if not Order.objects.filter(order_id=order_id).exists():
            return order_id

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff')
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','role',]

    class Meta:
        verbose_name_plural ='Users'

    def __str__(self):
        return self.email

class DrinksCategory(models.Model):
    '''Model definition for Drink Categories.'''
    name = models.CharField(default='', max_length=50)
    # image = models.ImageField(upload_to='categories/', default='')
    description = models.TextField()

    def drink_product_count(self):
        return self.drinks.count()

    class Meta:
        '''Meta definition for Drink Categories.'''

        verbose_name = 'Drink Category'
        verbose_name_plural = 'Drink Categories'

    def __str__(self):
        return self.name

class CocktailsCategory(models.Model):
    '''Model definition for Categories.'''
    name = models.CharField(default='', max_length=50)
    # image = models.ImageField(upload_to='categories/', default='')
    description = models.TextField()

    def cocktail_product_count(self):
        return self.cocktails.count()

    class Meta:
        '''Meta definition for Categories.'''

        verbose_name = 'Category'
        verbose_name_plural = 'Cocktail Categories'

    def __str__(self):
        return self.name

class Order(models.Model):
    '''Model definition for Order.'''
    STATUS = (
        ('initiated', 'Initiated'),
        ('delivered', 'Delivered'),
        ('paid', 'Paid'),
        ('updaid', 'Unpaid'),
    )
    PAYMENT_METHODS = (
        ('card', 'Card'),
        ('mpesa', 'MPesa'),
        ('cash', 'Cash')
    )
    order_id = models.CharField(max_length=200, unique=True, editable=False)
    customer = models.ForeignKey('CustomerInfo', on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    products = models.JSONField(default=dict)
    status = models.CharField(max_length=50, choices=STATUS, default='unpaid')
    order_total = models.CharField(max_length=200, default='')
    payment_method = models.CharField(max_length=100, choices=PAYMENT_METHODS,default='m-pesa')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = get_unique_order_id()
        super().save(*args, **kwargs)

    class Meta:
        '''Meta definition for Order.'''
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"{self.customer} Order at {self.created_at}"

class Drinks(models.Model):
    '''Model definition for Drink.'''
    name = models.CharField(default='', max_length=50)
    price = models.DecimalField(default=0, decimal_places=2, max_digits=100)
    description = models.TextField()
    category = models.ForeignKey(DrinksCategory, on_delete=models.CASCADE, related_name='drinks')
    image = models.ImageField(upload_to='products/', default='')

    class Meta:
        '''Meta definition for Drink.'''

        verbose_name = 'Drink'
        verbose_name_plural = 'Drinks'

    def __str__(self):
        return f"{self.name} Details"

class Cocktails(models.Model):
    '''Model definition for Cocktails'''
    title = models.CharField(default='', max_length=50)
    instructions = models.JSONField(default=dict)
    time = models.CharField(default='', max_length=20)
    ingredients = models.JSONField(default=dict)
    description = models.TextField()
    difficulty = models.CharField(default='', max_length=50)
    category = models.ForeignKey(CocktailsCategory, on_delete=models.CASCADE, related_name='cocktails')
    image = models.ImageField(upload_to='products/', default='')
    serve_count = models.CharField(default='', max_length=50)

    class Meta:
        '''Meta definition for Cocktails.'''
        verbose_name = 'Cocktail'
        verbose_name_plural = 'Cocktails'

    def __str__(self):
        return f"{self.title} Details"

class Contact(models.Model):
    '''Model definition for Contact.'''
    name = models.CharField(default='', max_length=50)
    email = models.EmailField(default='', max_length=100)
    subject = models.CharField(default='', max_length=200)
    message = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        '''Meta definition for Contact.'''
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'

    def __str__(self):
        return f'Message from {self.name} subject {self.subject}'

class Offer(models.Model):
    '''Model definition for Offers.'''
    CHOICES = (
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed'),
        ('bogo', 'Bogo'),
    )
    title = models.CharField(default='', max_length=50)
    description = models.TextField(default='')
    category = models.CharField(default='', max_length=50)
    # image = models.ImageField(upload_to='offers/', default='')
    discount = models.CharField(default='', max_length=50)
    code = models.CharField(default='', max_length=50)
    discount_type = models.CharField(default='percentage', choices=CHOICES, max_length=50)
    # start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()

    class Meta:
        '''Meta definition for Offers.'''
        verbose_name = 'Offer'
        verbose_name_plural = 'Offers'

    def __str__(self):
        return f'Offers {self.title} subject {self.end_date}'

class CustomerInfo(models.Model):
    county = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    latitude = models.CharField(max_length=500)
    longitude = models.CharField(max_length=500)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    delivery_area = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"
