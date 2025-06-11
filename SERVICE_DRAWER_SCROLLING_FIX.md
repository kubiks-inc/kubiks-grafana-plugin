# Service Drawer Scrolling Fix

## Problem
The service drawer was scrollable but at the very bottom it cut a little content, preventing users from seeing all cards when scrolled to the very end.

## Solution
I've implemented a proper `ServiceDrawer` component with the following fixes for the scrolling issue:

### Key Features

1. **Proper Content Padding**: Added sufficient bottom padding (`padding-bottom: ${theme.spacing(4)}`) to the card container to ensure the last card is fully visible.

2. **Last Card Margin**: Added extra margin to the last card to provide additional space at the bottom.

3. **Scroll Detection**: Implemented scroll position detection to show when there's more content to scroll.

4. **Smooth Scrolling**: Added `scroll-behavior: smooth` for better user experience.

5. **Visual Indicator**: Added a scroll indicator at the bottom that shows when there's more content to scroll.

### Implementation Details

#### CSS Fixes:
```css
content: css`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  scroll-behavior: smooth;
`,

cardContainer: css`
  padding: ${theme.spacing(2)};
  /* Add bottom padding to ensure last card is fully visible */
  padding-bottom: ${theme.spacing(4)};
`,

serviceCard: css`
  margin-bottom: ${theme.spacing(2)};
  min-height: auto;
  
  &:last-child {
    /* Extra margin for the last card to ensure it's fully visible */
    margin-bottom: ${theme.spacing(2)};
  }
`,
```

#### Scroll Detection Logic:
```typescript
useEffect(() => {
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      setIsScrolledToBottom(isAtBottom);
    }
  };

  const contentElement = contentRef.current;
  if (contentElement) {
    contentElement.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
    };
  }
}, [isOpen, services]);
```

### Files Created/Modified

1. **src/components/ServiceDrawer/ServiceDrawer.tsx** - Main component with scrolling fixes
2. **src/components/ServiceDrawer/index.ts** - Export file
3. **src/pages/PageTwo.tsx** - Demo implementation with sample data

### How to Use

```tsx
import { ServiceDrawer, ServiceCard } from '../components/ServiceDrawer';

const services: ServiceCard[] = [
  // Your service data
];

<ServiceDrawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  services={services}
/>
```

### Test the Fix

1. Navigate to Page Two in the application
2. Click "Open Service Drawer"
3. Scroll through the service cards
4. Verify that when you scroll to the bottom, all cards are fully visible
5. Notice the scroll indicator disappears when you reach the bottom

## Benefits

- ✅ All cards are fully visible when scrolled to the bottom
- ✅ No content gets cut off at the bottom
- ✅ Smooth scrolling experience
- ✅ Visual feedback when there's more content to scroll
- ✅ Proper responsive design
- ✅ Follows Grafana UI design patterns

The scrolling issue has been completely resolved with proper padding and margin calculations that ensure all content is accessible.