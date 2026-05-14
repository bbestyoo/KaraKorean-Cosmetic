# Scroll Reveal Animation Integration

## Overview
Implemented a Shopify-style scroll reveal animation system using IntersectionObserver with automatic staggering for child elements and accessibility support.

## Architecture

### Core Files Created

#### 1. `/frontend/lib/animations.ts`
**Purpose**: IntersectionObserver initialization and management

**Key Features**:
- Singleton observer pattern with 0.1 threshold and -50px bottom margin
- Automatic detection of `prefers-reduced-motion` setting
- Listens for system preference changes at runtime
- Staggered child animation support (80ms delay between children)
- Auto-cleanup: unobserves elements after animation completes
- Memory efficient: destroys observer on app unload

**Exports**:
- `initRevealObserver()`: Initialize the global observer
- `observeElement(el)`: Manually observe dynamically added elements
- `unobserveElement(el)`: Stop observing specific element
- `destroyRevealObserver()`: Clean up observer

#### 2. `/frontend/styles/animations.css`
**Purpose**: All animation definitions and keyframes

**Key Animations**:
- `[data-reveal="true"]`: Base hidden state (opacity 0, translateY 30px)
  - Transition: 600ms cubic-bezier(0.16, 1, 0.3, 1)
  - Becomes `reveal-visible` when in viewport
- `[data-reveal-child]`: Child stagger animation
  - Keyframe: 500ms animation with 20px slide-up
  - Each child gets 80ms delay stagger
- `[data-reveal-image]`: Image fade-in utility
  - 400ms ease-out animation for lazy-loaded images
- Media query: `prefers-reduced-motion` disables all animations

**Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for smooth, professional feel

#### 3. `/frontend/hooks/useRevealAnimation.ts`
**Purpose**: Reusable React hook for component-level animation control

**Exports**:
- `useRevealAnimation(options)`: Hook that manages ref, data-attributes, and observer
  - Options: `stagger?: boolean`, `observe?: boolean`
  - Returns: ref to attach to element
- `onImageLoad(event)`: Utility for image fade-in on load

**SSR-Safe**: Uses useRef and useEffect for browser-only execution

#### 4. `/frontend/components/AnimationInitializer.tsx`
**Purpose**: Client-side component that initializes observer globally

**Behavior**:
- Marked as 'use client' for client-side rendering
- Calls `initRevealObserver()` on mount
- Returns null (invisible component)
- Placed in layout.tsx right after CartProvider

## Integration Points

### Layout Integration
**File**: `/frontend/app/layout.tsx`
```tsx
// Added import
import "@/styles/animations.css";
import { AnimationInitializer } from "@/components/AnimationInitializer";

// Added in body
<AnimationInitializer />  // Initializes observer on load
```

### Homepage Animations
**File**: `/frontend/app/page.tsx`

Applied animations to:
1. **Hero Carousel Section**
   ```tsx
   <div data-reveal="true">
     <HeroCarousel />
   </div>
   ```

2. **Category Grid Sections (Mothers & Newborns)**
   ```tsx
   <section data-reveal="true">
     <div data-stagger="true">  {/* Container for staggering */}
       {items.map(item => (
         <div data-reveal-child="true">{/* Each card staggered */}
       ))}
     </div>
   </section>
   ```

3. **Ethos Section**
   ```tsx
   <section data-reveal="true">
   ```

### Checkout Page Animations
**File**: `/frontend/app/checkout/page.tsx`

Applied animations to:
- Main form container: `data-reveal="true"`
- Form sections: `data-stagger="true"` for staggered reveal

### Order Confirmation Animations
**File**: `/frontend/app/order-confirmation/[id]/page.tsx`

Applied animations to:
1. **Main container**: `data-reveal="true"`
2. **Header section**: `data-reveal-child="true"` for staggered header elements
3. **Order info cards**: `data-stagger="true"` for card stagger animation
4. **Individual cards**: `data-reveal-child="true"`
5. **Main content**: `data-reveal="true"` with `data-stagger="true"` for nested sections

## How It Works

### Animation Flow
1. **Page Load**: `AnimationInitializer` calls `initRevealObserver()` on app load
2. **Intersection Detected**: IntersectionObserver detects elements entering viewport
3. **Class Addition**: Adds `reveal-visible` class to matched element
4. **CSS Animation**: Tailwind/CSS handles transition from hidden to visible
5. **Cleanup**: Observer unobserves element after animation completes

### Stagger Animation for Lists
When `data-stagger="true"` is set on a container:
- Observer looks for children with `data-reveal-child="true"`
- Each child gets animated with 80ms stagger delay
- Creates wave effect: first child → second child → third, etc.

### Accessibility
- **prefers-reduced-motion**: All animations disabled for users who prefer reduced motion
- **System listener**: Detects when user changes preference, updates animations in real-time
- **No blocking**: Animations don't affect functionality or performance

## Performance Characteristics

- **IntersectionObserver**: Uses native browser API (highly optimized)
- **Lazy evaluation**: Only processes elements currently in viewport
- **Memory cleanup**: Unobserves after animation to free resources
- **GPU acceleration**: Transform-based animations (translateY) use GPU
- **Debouncing**: No multiple animation triggers for same element

## Usage Examples

### Apply to a Component
```tsx
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

export function MyComponent() {
  const revealRef = useRevealAnimation({ stagger: false });
  
  return <div ref={revealRef}>Content that reveals on scroll</div>;
}
```

### Apply to Images
```tsx
import { onImageLoad } from '@/hooks/useRevealAnimation';

export function ProductImage() {
  return (
    <img
      src="image.jpg"
      onLoad={onImageLoad}
      data-reveal-image="true"
    />
  );
}
```

### Manual Element Observation
```tsx
import { observeElement, unobserveElement } from '@/lib/animations';

const el = document.querySelector('.dynamic-element');
observeElement(el);
// Later...
unobserveElement(el);
```

## Testing Checklist

- [x] Animation system infrastructure created
- [x] AnimationInitializer integrated into layout
- [x] Homepage sections have data-reveal attributes
- [x] Product cards use stagger animation
- [x] Checkout form shows staggered reveals
- [x] Order confirmation displays with progressive reveals
- [ ] Test animations in browser (scroll to trigger)
- [ ] Test with prefers-reduced-motion enabled
- [ ] Verify no layout shifts during animations
- [ ] Test on mobile devices
- [ ] Verify SSR compatibility (no hydration errors)
- [ ] Performance test with DevTools

## Browser Support
- Modern browsers with IntersectionObserver support
- Falls back gracefully in older browsers (elements visible by default)
- CSS supports all modern browsers

## Future Enhancements
- Add parallax scrolling for hero sections
- Implement fade + slide animations for text
- Add fade-in-up for modal reveals
- Implement counter animations for stats
- Add SVG animation support for illustrations
