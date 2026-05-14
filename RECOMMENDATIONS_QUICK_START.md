# Quick Start Guide - Product Recommendations

## 🚀 How to Test

### Step 1: Start Your Application
```bash
# Backend
cd backend
python manage.py runserver

# Frontend (in another terminal)
cd frontend
npm run dev
# or
pnpm dev
```

### Step 2: Navigate to a Product
1. Go to `http://localhost:3000/products` (or your product listing page)
2. Click on any product to view its detail page

### Step 3: See Recommendations
The recommendations should appear at the **bottom of the product page** with three sections:
- 🚀 **Upgrade Your Choice** - Higher-priced items in the same category
- ✨ **Great Complements** - Related products from complementary categories
- 🔥 **Trending Now** - Currently trending products

## 🧪 Direct API Testing

Test the recommendations API directly:

```bash
curl "http://localhost:8000/shop/api/recommendations/?product_id=your-product-slug"
```

Replace `your-product-slug` with an actual product ID from your database.

### Example Response:
```json
{
  "upsells": [
    {
      "product_id": "product-1",
      "name": "Premium Product",
      "price": 5000,
      "old_price": 6000,
      "images": [...],
      "ratings": {...},
      "category_name": "Electronics",
      "trending": true,
      "featured": false,
      "deal": true
    }
    // ... more products
  ],
  "complementary": [
    // Similar structure
  ],
  "trending": [
    // Similar structure
  ]
}
```

## 🎨 Customization Tips

### Change Upsell Price Range
**File:** `backend/shop/views.py` (Line ~657-658)
```python
min_price = current_product.price * 1.1  # 10% higher (change this)
max_price = current_product.price * 1.5  # 50% higher (change this)
```

### Change Number of Products Shown
**File:** `backend/shop/views.py`
```python
# Change 6 to your desired number
recommendations['upsells'] = ProductSerializer([p[0] for p in upsells[:6]], ...)
recommendations['complementary'] = ProductSerializer([p[0] for p in comps[:6]], ...)
```

### Add New Category Mappings
**File:** `backend/shop/views.py` (Line ~613-622)
```python
COMPLEMENTARY_CATEGORIES = {
    'your_category': ['product1', 'product2', 'product3'],
    # Add more here
}
```

### Change Section Titles
**File:** `frontend/components/ProductRecommendations.tsx`
```tsx
<RecommendationSection
  title="Your Custom Title"  // Change this
  products={recommendations.upsells}
  sectionKey="upsells"
/>
```

## 🔍 Troubleshooting

### Recommendations Not Showing?
1. **Check if products exist**: Make sure there are products in your database
2. **Check category mappings**: Ensure products are in correct categories
3. **Check console**: Open browser DevTools → Console tab for errors
4. **API response**: Check network tab to see API response from `/api/recommendations/`

### No Complementary Products?
- Add category names to `COMPLEMENTARY_CATEGORIES` mapping
- Ensure product category names match the keys in the mapping (case-insensitive)

### All Showing Trending Only?
- This is normal fallback behavior when not enough upsells/complementary products
- Add more products with `trending=True` or adjust price ranges

## 📱 Test Different Scenarios

### Scenario 1: Upselling Works
1. Go to a product priced at Rs. 1000
2. Should see products priced between Rs. 1100-1500 in same category

### Scenario 2: Complementary Works
1. Go to a "Laptop" product
2. Should see recommendations like "Mouse", "Keyboard", "Monitor"

### Scenario 3: Trending Fallback
1. Go to a niche product
2. If no upsells/complementary exist, should show trending products

## 📊 Performance Tips

The recommendations are:
- ✅ Fetched only once when component mounts
- ✅ Loaded asynchronously (doesn't block page load)
- ✅ Cached in component state
- ✅ Each carousel scrolls independently

## 🎯 Next Steps

1. **Mark Hot Products**: Use admin to set `hot`, `trending`, `featured`, `deal` flags
2. **Add More Categories**: Expand `COMPLEMENTARY_CATEGORIES` mappings
3. **Track Analytics**: Monitor which recommendations users click
4. **Optimize**: A/B test different recommendation algorithms
5. **Personalize**: Eventually add user history-based recommendations

## 💡 Advanced Customization

### Change Scoring Algorithm
Modify `RecommendationsView.get()` method in `backend/shop/views.py` to adjust how products are prioritized:

```python
score = 0
if product.trending:
    score += 4  # Change weights
if product.featured:
    score += 3
if product.best_seller:
    score += 2
if product.deal:
    score += 1
```

### Add New Recommendation Type
1. Add new method to `RecommendationsView`
2. Create new section in `ProductRecommendations` component
3. Return in the response object

---

**Questions?** Check `RECOMMENDATIONS_IMPLEMENTATION.md` for full documentation.
