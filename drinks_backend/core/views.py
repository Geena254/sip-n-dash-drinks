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
    @action(detail=False, methods=['post'], url_path='upload-xlsx')
    def upload_xlsx(self, request):
        file = request.FILES.get('file')
        if not file or not file.name.endswith('.xlsx'):
            return Response({"error": "Only .xlsx files allowed"}, status=400)

        try:
            # Read the entire file at once (no chunking for Excel)
            df = pandas.read_excel(file, engine='openpyxl')
            
            # Apply your processing
            df = df.head(2100)  # Limit rows
            df = df.dropna(subset=['name', 'category', 'price'])
            df = df.drop_duplicates(subset=['name'])
            
        except Exception as e:
            return Response({"error": f"Invalid file: {str(e)}"}, status=400)

        # Validate headers
        required_headers = {'name', 'category', 'price'}
        if not required_headers.issubset(df.columns):
            return Response({"error": f"Missing headers: {required_headers}"}, status=400)

        # Process in batches
        batch_size = 100
        errors = []
        created = updated = 0

        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i + batch_size]
            try:
                with transaction.atomic():
                    for index, row in batch.iterrows():
                        try:
                            # Your processing logic here
                            name = str(row['name']).strip()
                            if not name:
                                raise ValueError("Name cannot be empty")

                            price = max(0, float(row['price']))
                            category = str(row['category']).strip()

                            category_obj, _ = DrinksCategory.objects.get_or_create(
                                name=category
                            )

                            _, created_flag = Drinks.objects.update_or_create(
                                name=name,
                                defaults={
                                    'description': str(row.get('description', '')).strip(),
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
                            
            except Exception as e:
                errors.append(f"Batch {i//batch_size + 1} failed: {str(e)}")

        if errors:
            return Response({
                "partial_success": f"Completed with {len(errors)} errors",
                "created": created,
                "updated": updated,
                "errors": errors[:10]  # Limit error response
            }, status=206)
        
        return Response({
            "success": "Upload complete",
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