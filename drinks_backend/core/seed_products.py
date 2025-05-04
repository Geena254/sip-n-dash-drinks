from core.models import Product
from decimal import Decimal

products = [
    # --- Beer ---
    {
        "id": 101,
        "name": "White Cap Lager 500ml",
        "price": "2.50",
        "category": "Beer",
        "image_url": "https://greenspoon.co.ke/wp-content/uploads/2023/02/Greenspoon-Kenya-White-Cap-Can.jpg",
        "description": "A refreshing choice for those seeking a balanced and flavorful medium beer experience."
    },
    {
        "id": 102,
        "name": "Tusker Lager 500ml",
        "price": "2.30",
        "category": "Beer",
        "image_url": "https://greenspoon.co.ke/wp-content/uploads/2023/02/Greenspoon-Kenya-Tusker-Lager-Can.jpg",
        "description": "Kenya's iconic lager with a distinctive, refreshing taste."
    },
    {
        "id": 103,
        "name": "Heineken Beer Bottle",
        "price": "3.00",
        "category": "Beer",
        "image_url": "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?fm=jpg&q=60&w=3000",
        "description": "Low-calorie beer perfect for any occasion."
    },

    # --- Wine ---
    {
        "id": 201,
        "name": "Frontera Cabernet Sauvignon",
        "price": "12.00",
        "category": "Wine",
        "image_url": "https://cdn.shopify.com/s/files/1/0871/2640/9530/files/jcell_cabernet_f_375ml_v20-1707408341712.png?v=1715264982",
        "description": "Full-bodied red wine with black cherry and vanilla notes."
    },
    {
        "id": 202,
        "name": "Chardonnay",
        "price": "14.99",
        "category": "Wine",
        "image_url": "https://images.unsplash.com/photo-1569919659476-f0852f6834b7",
        "description": "White wine with apple, pear, and buttery notes."
    },

    # --- Spirits ---
    {
        "id": 301,
        "name": "Johnnie Walker Black Label",
        "price": "38.00",
        "category": "Spirits",
        "image_url": "https://media.istockphoto.com/id/458070783/photo/johnnie-walker-black-label-whiskey.jpg",
        "description": "Iconic blend, the benchmark of deluxe whiskies."
    },
    {
        "id": 302,
        "name": "Jameson Irish Whisky",
        "price": "25.99",
        "category": "Spirits",
        "image_url": "https://media.istockphoto.com/id/534200132/photo/bottle-of-jameson-irish-whiskey.jpg",
        "description": "Smooth whisky with hints of smoke and honey."
    },

    # --- 6 Pack ---
    {
        "id": 401,
        "name": "Tusker Lager 6 Pack",
        "price": "19.99",
        "category": "6 Pack",
        "image_url": "https://soys.co.ke/PImages/DEKQE-0.jpg",
        "description": "Perfect for group enjoyment."
    },
    {
        "id": 402,
        "name": "Heineken Beer 6 Pack",
        "price": "19.99",
        "category": "6 Pack",
        "image_url": "https://asiabrewery.com/cdn/shop/products/Heineken500mlCan.png",
        "description": "Classic Heineken in a 6 pack."
    },

    # --- Cocktails ---
    {
        "id": 501,
        "name": "Classic Mojito",
        "price": "5.00",
        "category": "Cocktails",
        "image_url": "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
        "description": "Mint, lime, and soda cocktail."
    },

    # --- Mixers & More ---
    {
        "id": 601,
        "name": "Craft Cola",
        "price": "0.80",
        "category": "Mixers & More",
        "image_url": "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9",
        "description": "Cola made with natural ingredients."
    },
    {
        "id": 602,
        "name": "Schweppes",
        "price": "0.80",
        "category": "Mixers & More",
        "image_url": "https://www.coca-cola.com/content/dam/onexp/ng/home-image/brands/schweppes/products/ng_schweppes_prod_virgin%20mojito_750x750.jpg",
        "description": "Refreshing non-alcoholic mixer."
    },
]

for p in products:
    Product.objects.update_or_create(
        id=p["id"],
        defaults={
            "name": p["name"],
            "price": Decimal(p["price"]),
            "category": p["category"],
            "description": p["description"],
            "image_url": p["image_url"],
            "stock": 100
        }
    )

print(f"✅ Seeded {len(products)} products successfully.")
