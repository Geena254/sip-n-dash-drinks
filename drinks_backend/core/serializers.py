from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role
        token['username']= user.username
        token['email'] = user.email

        return token

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

class DrinksSerializer(serializers.ModelSerializer):
    # category = DrinksCategorySerializer(read_only=True)
    category = serializers.SerializerMethodField()

    class Meta:
        model = Drinks
        fields = '__all__'

    def get_category(self, obj):
        return obj.category.name if obj.category else None

class CocktailsSerializer(serializers.ModelSerializer):
    # category = CocktailsCategorySerializer(read_only=True)
    category = serializers.SerializerMethodField()

    class Meta:
        model = Cocktails
        fields = '__all__'

    def get_category(self, obj):
        return obj.category.name if obj.category else None

class CustomerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerInfo
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerInfoSerializer()
    # order_id = serializers.CharField(read_only=True)  # View-only

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        customer = CustomerInfo.objects.create(**customer_data)

        # order_id will be generated automatically in the model
        order = Order.objects.create(customer=customer, **validated_data)
        return order


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'