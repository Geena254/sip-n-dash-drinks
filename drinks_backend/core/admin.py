from django.contrib import admin
from .models import *
admin.site.register(CustomUser)
admin.site.register(CustomerInfo)
admin.site.register(Drinks)
admin.site.register(DrinksCategory)
admin.site.register(Cocktails)
admin.site.register(CocktailsCategory)
admin.site.register(Offer)
admin.site.register(Contact)
