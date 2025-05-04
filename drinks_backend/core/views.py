from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrderSerializer, ProductSerializer
from .models import Customer, Product, Order, OrderItem
from .stk_push import initiate_stk_push
from django.utils import timezone
import json

class CreateOrderView(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-date')
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            print("Incoming order data:", data)

            # Validate required fields
            required_fields = ['name', 'email', 'phone', 'address', 'latitude', 'longitude', 'items', 'total']
            missing = [field for field in required_fields if field not in data]
            if missing:
                return Response({'error': f'Missing fields: {", ".join(missing)}'}, status=status.HTTP_400_BAD_REQUEST)

            # Create customer
            customer = Customer.objects.create(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                address=data['address'],
                latitude=data['latitude'],
                longitude=data['longitude']
            )

            # Create order
            order = Order.objects.create(
                customer=customer,
                total=data['total'],
                delivery_fee=data.get('deliveryFee', 0),
                tax=data.get('tax', 0),
                status='Processing',
                date=timezone.now(),
                payment_method=data.get('paymentMethod', 'cash')
            )

            # Handle payment methods
            if data['paymentMethod'] == 'mpesa':
                stk_response = initiate_stk_push(data['phone'], data['total'])
                if not stk_response.get('status') == 'success':
                    return Response({'error': 'MPesa payment failed, try again.'}, status=status.HTTP_400_BAD_REQUEST)
                print("STK Push Response:", stk_response)

            # Add items to order
            for item in data['items']:
                try:
                    product = Product.objects.get(id=item['id'])
                except Product.DoesNotExist:
                    return Response({'error': f'Product with ID {item["id"]} not found'}, status=status.HTTP_400_BAD_REQUEST)

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity']
                )
                product.stock -= item['quantity']
                product.save()

            return Response({'message': 'Order received successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetProductsView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class UpdateOrderStatusView(viewsets.ViewSet):
    def update(self, request, order_id=None):
        try:
            order = Order.objects.get(id=order_id)
            data = request.data

            if 'status' in data:
                order.status = data['status']
            if 'seen' in data:
                order.seen = data['seen']

            order.save()
            return Response({'message': 'Order updated successfully'})

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error updating order: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class GetAllOrdersView(viewsets.ViewSet):
    def list(self, request):
        orders = Order.objects.select_related('customer').prefetch_related('items__product').order_by('-id')
        data = []

        for order in orders:
            items = []
            for item in order.items.all():
                items.append({
                    'product': item.product.name,
                    'quantity': item.quantity,
                    'price': float(item.product.price)
                })

            data.append({
                'order_id': order.id,
                'status': order.status,
                'total': float(order.total),
                'seen': order.seen,
                'date': order.date.strftime('%Y-%m-%d'),
                'customer': {
                    'name': order.customer.name,
                    'email': order.customer.email,
                    'phone': order.customer.phone,
                    'address': order.customer.address
                },
                'items': items
            })

        return Response(data)


class GetOrderByIdView(viewsets.ViewSet):
    def retrieve(self, request, order_id=None):
        try:
            order = Order.objects.select_related('customer').prefetch_related('items__product').get(id=order_id)

            items = []
            for item in order.items.all():
                items.append({
                    'product': item.product.name,
                    'quantity': item.quantity,
                    'price': float(item.product.price)
                })

            data = {
                'order_id': order.id,
                'status': order.status,
                'total': float(order.total),
                'seen': order.seen,
                'date': order.date.strftime('%Y-%m-%d'),
                'customer': {
                    'name': order.customer.name,
                    'email': order.customer.email,
                    'phone': order.customer.phone,
                    'address': order.customer.address
                },
                'items': items
            }

            return Response(data)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
