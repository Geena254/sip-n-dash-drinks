from rest_framework import viewsets
from .serializers import *
from .models import *
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from openpyxl import load_workbook
from rest_framework.permissions import IsAdminUser, AllowAny
import pandas

class DrinksCategoryViewSet(viewsets.ModelViewSet):
    queryset = DrinksCategory.objects.all()
    serializer_class = DrinksCategorySerializer

class CocktailsCategoryViewSet(viewsets.ModelViewSet):
    queryset = CocktailsCategory.objects.all()
    serializer_class = CocktailsCategorySerializer

class DrinksViewSet(viewsets.ModelViewSet):
    queryset = Drinks.objects.all()
    serializer_class = DrinksSerializer

    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        method='post',
        manual_parameters=[
            openapi.Parameter(
                name='file',
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=True,
                description="Upload an .xlsx file with drink data"
            ),
        ],
        # security=[{'Bearer': []}],
        responses={200: openapi.Response("Drinks uploaded successfully")},
    )
    @action(
    detail=False,
    methods=['post'],
    url_path='upload-xlsx',
    permission_classes=[AllowAny],  # Only admins
    )
    def upload_xlsx(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            df = pandas.read_excel(file)
        except Exception as e:
            return Response({"error": f"Invalid file format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate headers
        required_headers = {'name', 'description', 'category', 'price'}
        if not required_headers.issubset(df.columns):
            return Response(
                {"error": f"Missing headers. Required: {required_headers}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        created, updated = 0, 0
        errors = []

        with transaction.atomic():  # All operations succeed or fail together
            for index, row in df.iterrows():
                try:
                    name = str(row['name']).strip()
                    if not name:
                        raise ValueError("Name cannot be empty")

                    description = str(row.get('description', '')).strip()
                    category_name = str(row['category']).strip()
                    
                    try:
                        price = max(0, int(float(row['price'])))  # Handle decimals and negative
                    except (ValueError, TypeError):
                        price = 0

                    # Get or create category
                    category_instance, _ = DrinksCategory.objects.get_or_create(
                        name=category_name
                    )

                    # Update or create drink
                    _, created_flag = Drinks.objects.update_or_create(
                        name=name,
                        defaults={
                            'description': description,
                            'price': price,
                            'category': category_instance,
                        }
                    )

                    if created_flag:
                        created += 1
                    else:
                        updated += 1

                except Exception as e:
                    errors.append(f"Row {index+2}: {str(e)}")  # +2 for header + 1-index

        if errors:
            return Response({
                "partial_success": f"Completed with {len(errors)} errors",
                "created": created,
                "updated": updated,
                "errors": errors[:10]  # Return first 10 errors
            }, status=status.HTTP_206_PARTIAL_CONTENT)
        
        return Response({
            "success": "Drinks upload complete",
            "created": created,
            "updated": updated
        })

class CocktailsViewSet(viewsets.ModelViewSet):
    queryset = Cocktails.objects.all()
    serializer_class = CocktailsSerializer

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

class CustomerInfoViewSet(viewsets.ModelViewSet):
    queryset = CustomerInfo.objects.all()
    serializer_class = CustomerInfoSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @swagger_auto_schema(
        operation_description="Update the status of an order",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['Initiated', 'Paid', 'Unpaid', 'Delivered'],
                    description='The new status of the order'
                ),
            },
            required=['status'],
        ),
        responses={
            200: OrderSerializer,
            400: 'Bad Request',
            404: 'Not Found'
        }
    )
    @action(detail=True, methods=['patch'], url_path='update')
    def update_status(self, request, pk=None):
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)