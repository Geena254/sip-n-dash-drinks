from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerInfoSerializer()

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        customer = CustomerInfo.objects.create(**customer_data)
        return Order.objects.create(customer=customer, **validated_data)

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
