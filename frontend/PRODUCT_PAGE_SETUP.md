# Product Page Setup

## Overview
A professional, minimal e-commerce product page built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features dynamic product data from the Django backend with support for colors, sizes, ratings, and shopping cart functionality.

## Features

### Product Page (`/products/[id]`)
- **Professional Design**: Minimal yet stunning layout with smooth animations
- **Dynamic Images**: Main image with thumbnail gallery
- **Color Selection**: Real-time color options from backend
- **Size Selection**: Clothing sizes (variants) from backend
- **Quantity Control**: Increment/decrement quantity selector
- **Pricing**: Display original, discounted, and current price with discount percentage
- **Ratings**: Star ratings with aggregated review statistics
- **Cart Integration**: Add items with selected color and size to cart
- **Responsive**: Mobile and desktop optimized

### Products Listing (`/products`)
- **Product Grid**: 4-column responsive grid
- **Product Cards**: Image preview, ratings, pricing
- **Sorting**: Sort by latest or price (low-to-high, high-to-low)
- **Pagination**: Navigate through product pages
- **Loading States**: Skeleton loading for smooth UX

### Shopping Cart (`/cart`)
- **Cart Display**: View all cart items with details
- **Quantity Management**: Adjust quantities inline
- **Remove Items**: Remove specific product-color-size combinations
- **Order Summary**: Calculate subtotal, shipping, and total
- **Checkout Ready**: Prepared for payment integration

### Navigation
- **Navbar**: Sticky header with logo, navigation links, and cart icon
- **Cart Badge**: Shows total quantity of items in cart
- **Responsive Menu**: Mobile hamburger menu
- **Theme Toggle**: Dark/light mode support

## Project Structure

```
frontend/
├── app/
│   ├── products/
│   │   ├── [id]/
│   │   │   ├── page.tsx (Product detail page)
│   │   │   └── layout.tsx
│   │   ├── page.tsx (Products listing)
│   │   └── layout.tsx
│   ├── cart/
│   │   ├── page.tsx (Shopping cart)
│   │   └── layout.tsx
│   ├── layout.tsx (Root layout)
│   └── globals.css
├── components/
│   ├── Navbar.tsx (Navigation bar)
│   ├── ProductCard.tsx (Product card component)
│   ├── LayoutWrapper.tsx (Layout wrapper)
│   └── ThemeToggle.tsx (Existing theme toggle)
├── hooks/
│   └── useProductAPI.ts (API calls for products)
├── store/
│   └── cartStore.ts (Zustand cart state management)
└── package.json
```

## Backend Integration

### API Endpoints Used

1. **Get All Products**
   ```
   GET /shop/api/?page=1&ordering=price
   ```
   Returns paginated products with images and ratings.

2. **Get Product Details**
   ```
   GET /shop/api/{product_id}/
   ```
   Returns full product data including:
   - Basic info (name, price, category)
   - Images (grouped by color)
   - Colors/Variants (sizes)
   - Ratings with statistics

### Updated Serializers

The backend serializers now include:

- **VariantSerializer**: For sizes/variants
  ```python
  {
    "id": 1,
    "name": "M",
    "additional_price": 0
  }
  ```

- **ColorSerializer**: For color options
  ```python
  {
    "id": 1,
    "name": "Black",
    "hex": "#000000"
  }
  ```

- **Updated ProductSerializer**: Includes variants and colors
  ```python
  {
    "product_id": "...",
    "name": "...",
    "variants": [...],
    "colors": [...],
    ...
  }
  ```

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
pnpm install
```

New packages added:
- `lucide-react`: Icons for UI
- `zustand`: Lightweight state management for cart

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/shop
```

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Key Components

### Navbar
- Sticky navigation with responsive design
- Cart icon with item count badge
- Mobile menu support
- Theme toggle

### ProductCard
- Image preview with hover zoom
- Discount badge
- Star ratings
- Price display with original price strikethrough

### Product Detail Page
- Image gallery with thumbnails
- Color selection (from backend)
- Size/Variant selection (from backend)
- Quantity selector
- Add to cart functionality
- Customer reviews section

### Cart
- Item management (add, remove, update quantity)
- Order summary
- Checkout button ready for integration

## State Management

### Zustand Cart Store
```typescript
useCart() // Access cart state and actions

// Available methods:
- addItem(item)           // Add to cart
- removeItem(id, size, color) // Remove from cart
- updateQuantity(...)     // Update quantity
- clearCart()             // Empty cart
- getTotalPrice()         // Calculate total
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Color Scheme**: Black, white, gray, with accent colors
- **Typography**: Clean, minimal with proper hierarchy
- **Spacing**: Consistent 4px grid system
- **Responsiveness**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## Features Not Implemented (Ready for Addition)

- [ ] User authentication
- [ ] Wishlist functionality
- [ ] Product reviews submission
- [ ] Payment gateway integration (Stripe, Khalti)
- [ ] Order tracking
- [ ] Account pages
- [ ] Product filters (category, brand, price range)

## Performance Optimizations

- Next.js Image component for optimized images
- Server-side rendering where appropriate
- Client-side rendering for interactive elements
- Efficient API calls with pagination
- Lazy loading of product images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Notes

- Colors and sizes are dynamically fetched from the backend
- Default fallback options are provided if backend doesn't have these
- Cart data is stored in Zustand (in-memory, not persisted)
- For persistence, add localStorage integration to cartStore
- CORS must be enabled on Django backend for frontend requests

## Future Enhancements

1. **Cart Persistence**: Save cart to localStorage
2. **Search**: Implement product search functionality
3. **Filters**: Add category and price range filters
4. **Reviews**: Allow users to submit and view reviews
5. **Recommendations**: Show related/recommended products
6. **Wishlist**: Save favorite items
7. **Checkout**: Integrate payment gateway
8. **Analytics**: Track product views and conversions
