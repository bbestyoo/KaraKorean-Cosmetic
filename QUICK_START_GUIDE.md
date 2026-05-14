# Quick Start Guide

## Backend Setup

### 1. Verify Models
Your existing models already support sizes (Variants) and colors (Color model).

### 2. Update Serializers ✅
The serializers have been updated to include:
- `VariantSerializer` for sizes
- `ColorSerializer` for colors
- Updated `ProductSerializer` and `GetProductSerializer` to include variants and colors

### 3. Verify URLs
The backend URLs are already set up correctly:
- `/shop/api/` - Get all products
- `/shop/api/{product_id}/` - Get product details

### 4. CORS Configuration
Make sure your Django `INSTALLED_APPS` includes `corsheaders` and `CORS_ALLOWED_ORIGINS` includes your frontend URL:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create Environment File
Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/shop
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Pages
- **Products Listing**: http://localhost:3000/products
- **Product Detail**: http://localhost:3000/products/{product_id}
- **Shopping Cart**: http://localhost:3000/cart
- **Home**: http://localhost:3000

---

## File Structure Created

### Frontend Files Added/Modified

**New Pages:**
- `/app/products/page.tsx` - Products listing page
- `/app/products/[id]/page.tsx` - Product detail page
- `/app/cart/page.tsx` - Shopping cart page

**New Components:**
- `/components/Navbar.tsx` - Navigation bar with cart
- `/components/ProductCard.tsx` - Reusable product card
- `/components/LayoutWrapper.tsx` - Layout wrapper
- `/components/Navbar.tsx` - Updated navbar with cart badge

**New Hooks:**
- `/hooks/useProductAPI.ts` - API calls for products

**New Store:**
- `/store/cartStore.ts` - Zustand cart state management

**New Layouts:**
- `/app/products/layout.tsx` - Products layout
- `/app/products/[id]/layout.tsx` - Product detail layout
- `/app/cart/layout.tsx` - Cart layout

**Backend Files Modified:**
- `/backend/shop/serializers.py` - Added VariantSerializer, ColorSerializer, and updated ProductSerializers

---

## API Response Format

### Get Products List
```json
{
  "links": {
    "next": "...",
    "previous": null
  },
  "count": 100,
  "total_pages": 5,
  "current_page": 1,
  "results": [
    {
      "product_id": "black-shirt",
      "name": "Black Shirt",
      "category": "Shirts",
      "price": 2000,
      "old_price": 3000,
      "before_deal_price": null,
      "stock": 50,
      "images": [...],
      "ratings": {...},
      "variants": [
        {"id": 1, "name": "XS", "additional_price": 0},
        {"id": 2, "name": "S", "additional_price": 0},
        ...
      ],
      "colors": [
        {"id": 1, "name": "Black", "hex": "#000000"},
        {"id": 2, "name": "White", "hex": "#FFFFFF"},
        ...
      ]
    }
  ]
}
```

### Get Product Detail
```json
{
  "product_id": "black-shirt",
  "name": "Black Shirt",
  "category": "Shirts",
  "price": 2000,
  "old_price": 3000,
  "before_deal_price": null,
  "stock": 50,
  "images": [
    {
      "image": "http://localhost:8000/media/shop/images/...",
      "color": 1,
      "color_name": "Black",
      "hex": "#000000"
    }
  ],
  "ratings": {
    "stats": {
      "total_ratings": 42,
      "rating_dict": {5: 30, 4: 8, 3: 2, 2: 1, 1: 1},
      "avg_rating": 4.5
    },
    "data": [...]
  },
  "variants": [
    {"id": 1, "name": "XS", "additional_price": 0},
    ...
  ],
  "colors": [
    {"id": 1, "name": "Black", "hex": "#000000"},
    ...
  ]
}
```

---

## Cart Functionality

### How Cart Works
1. User selects size, color, and quantity
2. Clicks "Add to Cart"
3. Item is added to Zustand store
4. Cart icon shows updated count
5. User can view/manage cart at `/cart`

### Current Implementation
- **Storage**: In-memory (Zustand)
- **Persistence**: Not implemented (for next phase)

### To Add Persistence
Add to `cartStore.ts`:
```typescript
// Save to localStorage
const useCart = create<CartStore>(
  (set, get) => ({
    // ... store logic
  }),
  {
    name: 'cart-store',
  }
);
```

---

## Customization

### Change API Base URL
Update in environment or component:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';
```

### Change Default Sizes/Colors
If backend doesn't have variants/colors, fallback is used in ProductPage:
```typescript
// Default fallback sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Default fallback colors
const colors = ['Black', 'White', 'Navy', 'Gray'];
```

### Customize Styling
All components use Tailwind CSS. Modify classes directly in component files or update `globals.css`.

### Change Pagination
In `/app/products/page.tsx`:
```typescript
// Update items per page
const params = new URLSearchParams({
  page: currentPage.toString(),
  page_size: '20',  // Add this
});
```

---

## Testing

### Manual Testing Checklist
- [ ] Navigate to `/products` - should show product grid
- [ ] Click on a product - should load product detail page
- [ ] Select size and color - should highlight selection
- [ ] Adjust quantity - should update counter
- [ ] Add to cart - should show success message
- [ ] Check cart icon - should show updated count
- [ ] Navigate to `/cart` - should show cart items
- [ ] Remove item from cart - should remove and update total
- [ ] Adjust quantity in cart - should update total
- [ ] Click "Continue Shopping" - should navigate to products

### API Testing
```bash
# Get all products
curl http://localhost:8000/shop/api/

# Get specific product
curl http://localhost:8000/shop/api/{product_id}/
```

---

## Troubleshooting

### Issue: Products not loading
**Solution**: 
- Check backend is running on `http://localhost:8000`
- Verify CORS is configured
- Check browser console for errors
- Ensure products exist in database

### Issue: Sizes/Colors not showing
**Solution**:
- Verify Variant and Color models have data in admin
- Check serializer is correctly returning `variants` and `colors`
- Test API endpoint directly

### Issue: Images not loading
**Solution**:
- Check `MEDIA_URL` and `MEDIA_ROOT` in Django settings
- Ensure images are uploaded correctly
- Verify image URLs are accessible

### Issue: Cart not persisting on reload
**Solution**:
- This is expected (in-memory store)
- Add localStorage persistence to cartStore if needed

---

## Next Steps

1. **Add Checkout**: Integrate with Khalti or Stripe
2. **User Accounts**: Allow users to login and save orders
3. **Inventory**: Track stock and prevent overselling
4. **Reviews**: Allow customers to submit reviews
5. **Wishlist**: Let users save favorite items
6. **Search**: Implement product search functionality
7. **Filters**: Add category and price filters
8. **Admin Dashboard**: Build product management interface

---

## Support

For issues or questions:
1. Check API responses in browser DevTools
2. Verify backend is running and accessible
3. Check Django error logs
4. Review React console for errors
5. Ensure all packages are installed: `npm install`

Happy selling! 🚀
