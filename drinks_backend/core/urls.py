from django.urls import path
from .views import (
    CreateOrderView,
    GetAllOrdersView,
    UpdateOrderStatusView,
    GetProductsView,
    GetOrderByIdView,
)

urlpatterns = [
    # For creating an order (POST request)
    path('api/order/', CreateOrderView.as_view({'post': 'create'}), name='create_order'),

    # For retrieving all orders (GET request)
    path('api/orders/', GetAllOrdersView.as_view({'get': 'list'}), name='get_all_orders'),

    # For retrieving an order by ID (GET request)
    path('api/order/<int:order_id>/', GetOrderByIdView.as_view({'get': 'retrieve'}), name='get_order_by_id'),

    # For updating order status (PATCH or PUT request depending on your use case)
    path('api/order/<int:order_id>/update/', UpdateOrderStatusView.as_view({'patch': 'update'}), name='update_order_status'),

    # For retrieving all products (GET request)
    path('api/products/', GetProductsView.as_view({'get': 'list'}), name='get_products'),
]
