from fastapi import APIRouter
from typing import List
from models.product import Product

router = APIRouter()

PRODUCTS = [
    Product(id=1, name="Kente Print Shirt", price=45.00, description="Men's vibrant authentic kente print shirt, handwoven in Ghana. Bold geometric patterns. Available S–XXL.", category="clothing"),
    Product(id=2, name="Kente Wrap Dress", price=65.00, description="Elegant women's wrap dress in traditional kente fabric. Striking colors, flowy silhouette.", category="clothing"),
    Product(id=3, name="Kente Dashiki", price=38.00, description="Classic Ghanaian dashiki in rich kente patterns. Unisex cut, perfect for everyday wear or special occasions.", category="clothing"),
    Product(id=4, name="Kente Bow Tie & Pocket Square Set", price=28.00, description="Matching bow tie and pocket square handcrafted from authentic kente cloth. A statement accessory.", category="clothing"),
    Product(id=5, name="Kelewele Spice Mix", price=8.99, description="Traditional Ghanaian seasoning for spiced fried plantains. Bold ginger and pepper blend. 4 oz.", category="food"),
    Product(id=6, name="Shito Pepper Sauce", price=11.50, description="Ghana's beloved hot black pepper sauce — rich, smoky, and deeply savory. 8 oz jar.", category="food"),
    Product(id=7, name="Groundnut Paste", price=9.75, description="Authentic Ghanaian peanut butter. Smooth, natural, no additives. Straight from the source. 12 oz jar.", category="food"),
    Product(id=8, name="Plantain Chips", price=5.99, description="Crispy sun-dried plantain chips, lightly salted. A West African classic snack. 6 oz bag.", category="food"),
]


@router.get("/api/products", response_model=List[Product])
def get_products():
    return PRODUCTS
