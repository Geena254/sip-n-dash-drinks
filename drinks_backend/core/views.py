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
from django.db import transaction
import pandas
import logging

logger = logging.getLogger(__name__)

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
                description="Upload a CSV file with drink data"
            ),
        ],
        responses={
            200: openapi.Response("Drinks uploaded successfully"),
            206: openapi.Response("Partial success (some rows failed)"),
            400: openapi.Response("Invalid file format or missing headers")
        },
    )
    @action(detail=False, methods=['post'], url_path='upload-csv')
    def upload_csv(self, request):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not file.name.endswith('.csv'):
            return Response({"error": "Only CSV files are allowed"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Read CSV in chunks to handle large files
            chunks = pandas.read_csv(
                file,
                chunksize=500,  # Process 500 rows at a time
                dtype={'price': str},  # Handle price as string initially
                on_bad_lines='skip'  # Skip malformed rows
            )
            df = pandas.concat(chunks)
            
            # Basic validation
            df = df.dropna(subset=['name', 'category', 'price'])
            df = df.drop_duplicates(subset=['name'])
            
        except Exception as e:
            logger.error(f"CSV read failed: {str(e)}")
            return Response({"error": f"Invalid CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate required headers
        required_headers = {'name', 'category', 'price'}
        if missing := required_headers - set(df.columns):
            return Response({"error": f"Missing headers: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        created = updated = 0

        # Process in smaller batches for reliability
        batch_size = 100
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i + batch_size]
            try:
                with transaction.atomic():
                    for index, row in batch.iterrows():
                        try:
                            # Validate and process each row
                            name = str(row['name']).strip()
                            if not name:
                                raise ValueError("Name cannot be empty")
                            
                            # Handle price conversion
                            try:
                                price_str = str(row['price']).replace(',', '').strip()
                                price = max(0, float(price_str))
                            except (ValueError, TypeError):
                                raise ValueError(f"Invalid price: {row['price']}")
                            
                            category = str(row['category']).strip()
                            if not category:
                                raise ValueError("Category cannot be empty")

                            # Get or create category
                            category_obj, _ = DrinksCategory.objects.get_or_create(
                                name=category[:50]  # Ensure max_length compliance
                            )

                            # Update or create drink
                            _, created_flag = Drinks.objects.update_or_create(
                                name=name[:100],  # Ensure max_length
                                defaults={
                                    'description': str(row.get('description', ''))[:255],
                                    'price': price,
                                    'category': category_obj,
                                }
                            )
                            
                            if created_flag:
                                created += 1
                            else:
                                updated += 1
                                
                        except Exception as e:
                            errors.append(f"Row {index+2}: {str(e)}")
                            logger.warning(f"Row error: {e}")
                            
            except Exception as e:
                errors.append(f"Batch {i//batch_size + 1} failed: {str(e)}")
                logger.error(f"Batch failed: {e}")

        if errors:
            return Response({
                "partial_success": True,
                "created": created,
                "updated": updated,
                "error_count": len(errors),
                "sample_errors": errors[:5]  # Return first 5 errors only
            }, status=status.HTTP_206_PARTIAL_CONTENT)
        
        return Response({
            "success": True,
            "created": created,
            "updated": updated
        }, status=status.HTTP_200_OK)

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