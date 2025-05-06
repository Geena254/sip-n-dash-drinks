from rest_framework import viewsets
from .serializers import *
from .models import *

class DrinksCategoryViewSet(viewsets.ModelViewSet):
    queryset = DrinksCategory.objects.all()
    serializer_class = DrinksCategorySerializer

class CocktailsCategoryViewSet(viewsets.ModelViewSet):
    queryset = CocktailsCategory.objects.all()
    serializer_class = CocktailsCategorySerializer

class DrinksViewSet(viewsets.ModelViewSet):
    queryset = Drinks.objects.all()
    serializer_class = DrinksSerializer

class CocktailsViewSet(viewsets.ModelViewSet):
    queryset = Cocktails.objects.all()
    serializer_class = CocktailsSerializer

class CustomerInfoViewSet(viewsets.ModelViewSet):
    queryset = CustomerInfo.objects.all()
    serializer_class = CustomerInfoSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer