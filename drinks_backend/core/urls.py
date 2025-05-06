from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from .views import *
from .serializers import CustomTokenObtainPairSerializer

router = DefaultRouter()
router.register(r'drinks-categories', DrinksCategoryViewSet)
router.register(r'cocktails-categories', CocktailsCategoryViewSet)
router.register(r'drinks', DrinksViewSet)
router.register(r'cocktails', CocktailsViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'offers', OfferViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'customers', CustomerInfoViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    # authentications
    path('api/auth/login/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
