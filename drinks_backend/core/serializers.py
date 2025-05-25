from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib import admin

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer_name', 'order_total', 'payment_method', 'status', 'created_at')
    readonly_fields = ('products',)

    def customer_name(self, obj):
        return obj.customer.name if obj.customer else "Unknown"

# ================================
# Authentication Token Serializer
# ================================
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # add custom user fields
        token['role'] = user.role
        token['username'] = user.username
        token['email'] = user.email
        
        return token

# ============================
# Category Serializers
# ============================
class DrinksCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='drink_product_count', read_only=True)

    class Meta:
        model = DrinksCategory
        fields = '__all__'


class CocktailsCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='cocktail_product_count', read_only=True)

    class Meta:
        model = CocktailsCategory
        fields = '__all__'

# ============================
# Bulk List Serializers
# ============================
class BulkDrinksSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        return Drinks.objects.bulk_create([Drinks(**item) for item in validated_data])


class BulkCocktailsSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        return Cocktails.objects.bulk_create([Cocktails(**item) for item in validated_data])

# ============================
# Product Serializers
# ============================
class DrinksSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='name',
        queryset=DrinksCategory.objects.all()
    )

    class Meta:
        model = Drinks
        fields = '__all__'
        list_serializer_class = BulkDrinksSerializer


class CocktailsSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='name',
        queryset=CocktailsCategory.objects.all()
    )

    class Meta:
        model = Cocktails
        fields = '__all__'
        list_serializer_class = BulkCocktailsSerializer

# ============================
# Order & Related Serializers
# ============================
class CustomerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerInfo
        fields = ['id', 'name', 'email', 'phone', 'county', 'delivery_area', 'latitude', 'longitude']


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerInfoSerializer()
    items = serializers.SerializerMethodField()
    # date = serializers.DateTimeField(source='created_at', format="%Y-%m-%d %H:%M")
    delivery_area = serializers.CharField(source='customer.delivery_area', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_id',
            'customer',
            'items',
            'status',
            'order_total',
            'payment_method',
            'delivery_area',
            'products',
        ]
        read_only_fields = ['id', 'customer', 'date', 'delivery_area', 'county', 'total']

    def get_items(self, obj):
        return obj.products

    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        customer = CustomerInfo.objects.create(**customer_data)
        return Order.objects.create(customer=customer, **validated_data)

    def update(self, instance, validated_data):
        # Allow PATCHing order status or payment
        customer_data = validated_data.pop('customer', None)
        if customer_data:
            for attr, value in customer_data.items():
                setattr(instance.customer, attr, value)
            instance.customer.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# ============================
# Static Data Serializers
# ============================
class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
