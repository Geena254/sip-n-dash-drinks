from rest_framework import serializers
from .models import Customer, Product, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category', 'image_url', 'description']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class OrderItemReadSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class OrderItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    # Use separate serializers for reading and writing
    items = OrderItemWriteSerializer(many=True, write_only=True)
    order_items = OrderItemReadSerializer(source='items', many=True, read_only=True)

    customer = CustomerSerializer(write_only=True)
    customer_details = CustomerSerializer(source='customer', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer', 'customer_details',
            'total', 'delivery_fee', 'tax', 'status',
            'payment_method', 'latitude', 'longitude',
            'items', 'order_items',
            'seen', 'date'
        ]

    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        items_data = validated_data.pop('items')
        customer = Customer.objects.create(**customer_data)
        order = Order.objects.create(customer=customer, **validated_data)

        for item in items_data:
            OrderItem.objects.create(order=order, **item)
            product = item['product']
            product.stock -= item['quantity']
            product.save()

        return order
