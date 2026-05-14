# Product Recommendations Implementation

## Overview
Added a comprehensive product recommendations system to the product detail page that displays related products based on smart algorithms.

## Features

### 1. **Upselling Recommendations** 🚀
- Shows products in the same category with 10-50% higher price
- Prioritizes by: trending (4 pts) > featured (3 pts) > best_seller (2 pts) > deal (1 pt)
- Displays up to 6 products
- Helps customers upgrade to premium options

### 2. **Complementary Products** ✨
- Cross-category product recommendations based on category mappings
- Includes complementary category pairs:
  - laptop → mouse, keyboard, monitor, headphone, laptop bag, cooling pad
  - smartphone → earphone, headphone, powerbank, mobile case, screen protector
  - desktop → mouse, keyboard, monitor, speaker, webcam
  - camera → memory card, camera bag, tripod, lens
  - gaming → mouse, keyboard, headphone, gaming chair, controller
  - tablet → stylus, tablet case, screen protector, keyboard
  - moms → babies, kids, nursing
  - babies → moms, clothing, toys
- Prioritizes by same score system
- Shows up to 6 products

### 3. **Trending Fallback** 🔥
- If recommendations are less than 10 total, fills with trending products
- Ordered by most recent published date
- Ensures always showing recommendations

## Backend Implementation

### File: `backend/shop/views.py`
**New Class: `RecommendationsView`**
```python
class RecommendationsView(APIView):
    COMPLEMENTARY_CATEGORIES = {...}
    
    def get(self, request):
        # Returns JSON with upsells, complementary, and trending products
```

**URL: `/api/recommendations/?product_id=<product_id>`**

**Response Format:**
```json
{
  "upsells": [Product[], ...],
  "complementary": [Product[], ...],
  "trending": [Product[], ...]
}
```

### File: `backend/shop/urls.py`
**Added URL Pattern:**
```python
path('api/recommendations/', views.RecommendationsView.as_view(), name='recommendations'),
```

## Frontend Implementation

### File: `frontend/components/ProductRecommendations.tsx`
**New Component: `ProductRecommendations`**
- Displays recommendations in three sections
- Each section shows a horizontal scrollable carousel
- Left/right navigation buttons for scrolling
- Product cards include:
  - Product image with hover effect
  - Product name (clamped to 2 lines)
  - Star ratings
  - Price (with old price strikethrough if available)
  - Discount badge
  - Status badges (Trending, Featured, Deal)

### File: `frontend/app/(site)/products/[id]/page.tsx`
**Integration:**
- Imported `ProductRecommendations` component
- Added recommendations section after customer reviews
- Passes `product.product_id` to the component

## UI/UX Features

✅ **Horizontal Scrolling Carousels**
- Smooth scroll animation
- Left/right navigation buttons
- Shows 4 products at once (responsive)

✅ **Beautiful Product Cards**
- High contrast hover effects
- Image scaling on hover
- Clear price display
- Rating stars with count
- Discount percentage badge
- Status badges (Trending, Featured, Deal)

✅ **Responsive Design**
- Mobile-friendly card sizing
- Touch-friendly navigation buttons
- Adapts to all screen sizes

✅ **Performance**
- Lazy loading recommendations
- Only fetches when component mounts
- Clean error handling

## API Usage

**Get Recommendations for a Product:**
```bash
GET /shop/api/recommendations/?product_id=your-product-slug
```

**Parameters:**
- `product_id` (required): The product ID/slug

**Response:**
```json
{
  "upsells": [
    {
      "product_id": "laptop-pro",
      "name": "Laptop Pro 15",
      "price": 85000,
      "old_price": 100000,
      "images": [...],
      "ratings": {...},
      "category_name": "Laptop",
      ...
    }
  ],
  "complementary": [...],
  "trending": [...]
}
```

## Testing

To test the recommendations:

1. **Backend**: Navigate to a product detail page
2. **API Call**: Open browser console and check the network request to:
   ```
   http://localhost:8000/shop/api/recommendations/?product_id=<product-slug>
   ```
3. **Frontend**: Should display three sections if recommendations exist:
   - "🚀 Upgrade Your Choice" (Upsells)
   - "✨ Great Complements" (Complementary)
   - "🔥 Trending Now" (Trending)

## Customization

### Adjust Price Range for Upsells
In `backend/shop/views.py`, modify the `RecommendationsView.get()` method:
```python
min_price = current_product.price * 1.1  # Change 1.1
max_price = current_product.price * 1.5  # Change 1.5
```

### Change Number of Products
```python
recommendations['upsells'] = ProductSerializer(...).data[:6]  # Change 6
```

### Add More Category Mappings
In `COMPLEMENTARY_CATEGORIES`:
```python
'your_category': ['product1', 'product2', 'product3'],
```

## Future Enhancements

- [ ] Add "Recently Viewed" recommendations
- [ ] Personalization based on user browsing history
- [ ] ML-based recommendations
- [ ] A/B testing different recommendation algorithms
- [ ] Analytics tracking for recommendation clicks
- [ ] Wishlist-based recommendations
