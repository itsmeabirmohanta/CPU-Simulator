# Performance & Security Enhancements

This document explains all the performance optimizations, loaders, lazy loading, and security features added to the CPU Simulator.

## Table of Contents
1. [Loader Components](#loader-components)
2. [Lazy Loading](#lazy-loading)
3. [Skeletal Loading](#skeletal-loading)
4. [Security Protocols](#security-protocols)
5. [Performance Optimizations](#performance-optimizations)
6. [Usage Examples](#usage-examples)

## Loader Components

### Simple Loader
A spinning loader component with optional text and customizable sizes.

**Location:** `src/components/Loader.tsx`

**Props:**
- `size?: "sm" | "md" | "lg"` - Size of the loader (default: "md")
- `text?: string` - Optional loading text to display
- `fullScreen?: boolean` - Whether to take up full screen (default: false)

### Usage
```tsx
import Loader from "@/components/Loader";

// Small loader
<Loader size="sm" />

// Medium loader with text
<Loader size="md" text="Loading content..." />

// Full screen loader
<Loader fullScreen text="Please wait..." />
```

## Lazy Loading

### Lazy Component Loading
Code-split and lazy load entire page components with a fallback loader.

**Location:** `src/lib/lazyLoading.ts`

**Features:**
- Automatic code splitting for pages
- Suspense boundaries with fallback UI
- Already integrated in `App.tsx`

### Usage
```tsx
import { lazyLoadComponent } from "@/lib/lazyLoading";

// Already done in App.tsx for all pages:
const SimulatorPage = lazy(() => import("./pages/SimulatorPage"));

// Wrap in Suspense with Loader fallback
<Suspense fallback={<Loader fullScreen text="Loading page..." />}>
  <SimulatorPage />
</Suspense>
```

### Lazy Image Loading
Images load only when they enter the viewport.

**Location:** `src/lib/lazyLoading.ts`

**Usage:**
```tsx
import { LazyImage } from "@/lib/lazyLoading";

<LazyImage
  src="https://example.com/image.jpg"
  alt="My Image"
  className="w-full rounded"
/>
```

### Lazy Div Wrapper
Lazy load any content within a div that appears on scroll.

**Location:** `src/lib/lazyLoading.ts`

**Usage:**
```tsx
import { LazyDiv } from "@/lib/lazyLoading";

<LazyDiv fallback={<Skeleton />}>
  <ExpensiveComponent />
</LazyDiv>
```

### Network Quality Detection
Detect and adapt to user's network speed.

**Location:** `src/lib/lazyLoading.ts`

**Usage:**
```tsx
import { useNetworkQuality } from "@/lib/lazyLoading";

function MyComponent() {
  const quality = useNetworkQuality(); // Returns: "4g" | "3g" | "2g" | "slow-2g"

  if (quality === "2g" || quality === "slow-2g") {
    return <SimplifiedVersion />; // Load simpler version for slow networks
  }

  return <FullVersion />;
}
```

## Skeletal Loading

### Basic Skeleton
Shimmer skeleton loader for various content types.

**Location:** `src/components/Skeleton.tsx`

**Variants:**
- `"text"` - Single line of text
- `"circle"` - Circular skeleton
- `"card"` - Card-sized skeleton
- `"button"` - Button-sized skeleton
- `"avatar"` - Avatar-sized circle

### Usage
```tsx
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonGrid 
} from "@/components/Skeleton";

// Single skeleton
<Skeleton variant="text" />

// Multiple text lines
<SkeletonText count={3} />

// Card skeleton
<SkeletonCard />

// Grid of skeletons
<SkeletonGrid count={6} />
```

### Page Loading Wrapper
Wrapper for pages to easily toggle between loading and loaded states.

**Location:** `src/components/PageLoadingWrapper.tsx`

**Usage:**
```tsx
import PageLoadingWrapper from "@/components/PageLoadingWrapper";
import { SkeletonGrid } from "@/components/Skeleton";

function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    setIsLoading(false);
  }, []);

  return (
    <PageLoadingWrapper 
      isLoading={isLoading} 
      loadingComponent={<SkeletonGrid count={3} />}
    >
      {/* Your actual content */}
    </PageLoadingWrapper>
  );
}
```

## Security Protocols

### Automatic Initialization
All security protocols are automatically initialized in `App.tsx` on component mount.

**Location:** `src/lib/security.ts`

### Features Included:

#### 1. **Security Headers**
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: restrictive settings
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation, microphone, camera disabled
```

#### 2. **CSRF Protection**
```tsx
import { CSRFTokenManager } from "@/lib/security";

// Get CSRF token
const token = CSRFTokenManager.getToken();

// Validate token
const isValid = CSRFTokenManager.validateToken(token);
```

#### 3. **Rate Limiting**
```tsx
import { RateLimiter } from "@/lib/security";

const limiter = new RateLimiter(100, 60000); // 100 requests per minute

if (limiter.isAllowed()) {
  // Make request
} else {
  console.warn("Rate limit exceeded");
  console.log(`Remaining: ${limiter.getRemainingRequests()}`);
}
```

#### 4. **XSS Protection**
```tsx
import { sanitizeHTML } from "@/lib/security";

const safe = sanitizeHTML(userInput);
```

#### 5. **Request Interceptor**
Automatically adds CSRF tokens to all POST/PUT/DELETE requests.

### Global Loading State

Use the `useLoading` hook anywhere in your app to control global loading state.

**Location:** `src/hooks/useLoading.tsx`

**Usage:**
```tsx
import { useLoading } from "@/hooks/useLoading";

function MyComponent() {
  const { isLoading, loadingText, startLoading, stopLoading } = useLoading();

  const handleClick = async () => {
    startLoading("Processing...");
    await someAsyncTask();
    stopLoading();
  };

  return (
    <button onClick={handleClick}>
      {isLoading ? loadingText : "Click me"}
    </button>
  );
}
```

## Performance Optimizations

### 1. **Code Splitting**
Pages are automatically lazy-loaded and code-split:
- `react` bundle
- `router` bundle
- `ui` bundle
- `animations` bundle
- `query` bundle

### 2. **Compression**
- Gzip compression for all assets
- Brotli compression support
- Automatic minification

### 3. **Resource Hints**
- DNS prefetch for external resources
- Preconnect to critical origins
- Link prefetch for routes

### 4. **Caching Strategy**
- React Query caching: 5 minute stale time, 10 minute garbage collection
- Service Worker ready (can be added)
- Browser cache headers

### 5. **Build Optimizations**
- CSS code splitting
- Tree shaking
- Terser minification
- Unused code elimination

## Usage Examples

### Example 1: Lazy Load a Large List
```tsx
import { LazyDiv } from "@/lib/lazyLoading";
import { SkeletonText } from "@/components/Skeleton";

function LargeList() {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <LazyDiv 
          key={index}
          fallback={<SkeletonText count={1} />}
        >
          <ItemComponent item={item} />
        </LazyDiv>
      ))}
    </div>
  );
}
```

### Example 2: Protected API Call
```tsx
import { setupRequestInterceptor } from "@/lib/security";

// Already called in App.tsx
setupRequestInterceptor();

// Use fetch normally - CSRF token added automatically
const response = await fetch("/api/endpoint", {
  method: "POST",
  body: JSON.stringify(data),
});
```

### Example 3: Adaptive Loading for Network Speed
```tsx
import { useNetworkQuality } from "@/lib/lazyLoading";
import Loader from "@/components/Loader";

function SimulatorPage() {
  const quality = useNetworkQuality();

  return (
    <div>
      {quality !== "4g" && (
        <div className="bg-blue-50 p-3 rounded mb-4">
          ⚠️ Slow network detected. Some features may be limited.
        </div>
      )}
      {/* Your component */}
    </div>
  );
}
```

### Example 4: Full Page Loading State
```tsx
import PageLoadingWrapper from "@/components/PageLoadingWrapper";
import { SkeletonCard } from "@/components/Skeleton";
import { useState, useEffect } from "react";

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        setData(await res.json());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLoadingWrapper
      isLoading={isLoading}
      loadingComponent={<SkeletonCard />}
    >
      {data && <YourContent data={data} />}
    </PageLoadingWrapper>
  );
}
```

## Best Practices

1. **Always use Loader or Skeleton while fetching data**
2. **Implement LazyDiv for components below the fold**
3. **Use LazyImage for all images that aren't in the hero section**
4. **Validate all user input with sanitizeHTML**
5. **Check network quality before loading heavy assets**
6. **Use rate limiting for critical API endpoints**
7. **Monitor performance metrics in production**

## Configuration Files Modified

1. **vite.config.ts** - Added compression, security headers, code splitting
2. **package.json** - Added `vite-plugin-compression` dependency
3. **src/App.tsx** - Added lazy loading, security setup, and loading provider
4. **src/main.tsx** - No changes needed
5. **index.html** - No changes needed

## Testing

To test the loaders and lazy loading:

1. **Slow Network Simulation**
   - Open DevTools → Network → Set throttling to "Slow 3G"
   - Navigate between pages to see lazy loading in action

2. **View Bundle Sizes**
   - Run `npm run build`
   - Check dist folder for code split bundles

3. **Security Headers**
   - Open DevTools → Network tab
   - Check response headers on network requests

## Dependencies Added

- **vite-plugin-compression** - For gzip/brotli compression

## Migration Guide

If you have existing pages using direct imports, they will automatically benefit from:
- Code splitting (pages lazy-loaded)
- Security headers
- Compression
- Protection protocols

No changes required to existing page components!
