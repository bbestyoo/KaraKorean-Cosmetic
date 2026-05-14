# Sizes Integration Summary

## Overview
Integrated a new `Size` model into the e-commerce backend and connected it with the frontend product page and cart system.

## Backend Changes

### 1. New Size Model (`shop/models.py`)
```python
class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sizes')
    name = models.CharField(max_length=50)  # e.g., XS, S, M, L, XL, XXL
    price_adjustment = models.FloatField(default=0)  # Additional cost for this size
    stock = models.PositiveIntegerField(default=0)  # Stock available for this size

    class Meta:
        unique_together = ['product', 'name']
```

**Features:**
- Store multiple sizes per product
- Support for size-specific pricing adjustments
- Track stock availability per size
- Prevent duplicate sizes for a product

### 2. Updated Cart Model (`cart/models.py`)
- Added `size` field as ForeignKey to `Size` model
- Updated `unique_together` constraint to include size: `['user', 'product', 'color', 'size']`
- Allows cart items to be tracked with specific size+color combinations

### 3. New Serializer (`shop/serializers.py`)
```python
class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name', 'price_adjustment', 'stock']
```

### 4. Updated Product Serializers
- `GetProductSerializer`: Added `sizes` field
- `ProductSerializer`: Added `sizes` field to include sizes in all product API responses

### 5. Django Admin Integration (`shop/admin.py`)
- `SizeInline`: Allows inline editing of sizes when editing a product
- `SizeAdmin`: Standalone Size admin page with import/export support
- Added `SizeInline` to `ProductsAdmin` inlines for convenient management

### 6. Database Migrations
Created two migrations:
- `shop/migrations/0004_size.py`: Creates the Size model
- `cart/migrations/0005_alter_cart_unique_together_cart_size_and_more.py`: Updates Cart model

## Frontend Changes

### 1. Updated Product Page Interface (`frontend/app/products/[id]/page.tsx`)
- Added `Size` interface:
  ```typescript
  interface Size {
    id: number;
    name: string;
    price_adjustment: number;
    stock: number;
  }
  ```
- Updated `Product` interface to include `sizes: Size[]` field

### 2. Size Selection UI
- Changed from hardcoded sizes `['XS', 'S', 'M', 'L', 'XL', 'XXL']` to dynamic backend sizes
- Displays sizes from `product.sizes` API response
- Falls back to default sizes if none are configured
- Shows size-specific pricing adjustments as tooltip
- **Disables out-of-stock sizes** (when `stock === 0`)

### 3. Cart Integration
- Cart items already support size field in `CartContext.tsx`
- Product page correctly passes selected size to cart when adding items

## API Endpoints

The following endpoints now return sizes data:

### Get Single Product
**Endpoint:** `GET /shop/api/{product_id}/`

**Response includes:**
```json
{
  "product_id": "165hzacer-nitro-v-15-in-nepal",
  "name": "165Hz Acer Nitro V 15...",
  "sizes": [
    {
      "id": 1,
      "name": "XS",
      "price_adjustment": 0,
      "stock": 10
    },
    {
      "id": 2,
      "name": "S",
      "price_adjustment": 500,
      "stock": 15
    }
  ],
  ...other fields
}
```

## How to Use

### Adding Sizes to Products (Admin Interface)

1. Go to Django admin: `http://localhost:8000/admin/`
2. Navigate to Products
3. Edit a product
4. Scroll to the "Sizes" inline section
5. Click "Add another Size"
6. Fill in:
   - **Name**: Size identifier (e.g., "M", "Large")
   - **Price adjustment**: Additional cost if applicable (e.g., 500 for larger sizes)
   - **Stock**: Available quantity for this size
7. Save the product

### In the Product Page

1. The product page automatically fetches sizes from the API
2. Users see available sizes as buttons
3. Out-of-stock sizes are disabled
4. Price adjustments are shown on hover
5. Selected size is stored in cart

### In the Cart

1. Cart items include the size information
2. Each size+color combination is treated as a unique cart item
3. Cart API stores size reference for accurate inventory management

## Benefits

✅ **Dynamic Size Management**: Add/modify sizes without code changes
✅ **Size-Specific Stock**: Track inventory per size
✅ **Flexible Pricing**: Support different prices for different sizes
✅ **Better UX**: Disable unavailable sizes automatically
✅ **Cart Accuracy**: Distinguish between size variants in cart
✅ **Admin Integration**: Easy management through Django admin

## Next Steps (Optional)

1. Create a Size resource for import/export functionality
2. Add size-related filters to product list API
3. Add size availability indicators in product listings
4. Create size chart modal component
5. Add size recommendations based on product category

## Files Modified

### Backend
- `/backend/shop/models.py` - Added Size model
- `/backend/shop/serializers.py` - Added SizeSerializer, updated product serializers
- `/backend/shop/admin.py` - Added Size admin configuration
- `/backend/cart/models.py` - Updated Cart model with size field

### Frontend
- `/frontend/app/products/[id]/page.tsx` - Updated UI and added Size interface

### Database
- Created 2 new migrations

## Testing

To verify the integration:

1. **Backend**: Create sizes for a product via Django admin
2. **API**: Call `/shop/api/{product_id}/` and verify sizes in response
3. **Frontend**: Visit product page and confirm sizes are displayed and selectable
4. **Cart**: Add product with different sizes and verify they're stored separately
