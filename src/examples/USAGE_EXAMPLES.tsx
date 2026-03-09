/**
 * Example implementations of loaders, lazy loading, and security features
 * Copy these patterns into your pages as needed
 */

// ============= EXAMPLE 1: Simple Loading State =============
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import PageLoadingWrapper from "@/components/PageLoadingWrapper";
import { SkeletonCard, SkeletonGrid } from "@/components/Skeleton";

export function ExampleSimpleLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setData({ title: "Sample Data" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLoadingWrapper
      isLoading={isLoading}
      loadingComponent={<SkeletonGrid count={3} />}
    >
      {data && <div>{data.title}</div>}
    </PageLoadingWrapper>
  );
}

// ============= EXAMPLE 2: Lazy Load Images =============
import { LazyImage } from "@/lib/lazyLoading";

export function ExampleLazyImages() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <LazyImage
          key={i}
          src={`https://via.placeholder.com/300?text=Image+${i + 1}`}
          alt={`Image ${i + 1}`}
          className="w-full h-40 object-cover rounded"
        />
      ))}
    </div>
  );
}

// ============= EXAMPLE 3: Adaptive Loading Based on Network =============
import { useNetworkQuality } from "@/lib/lazyLoading";

export function ExampleNetworkAdaptive() {
  const quality = useNetworkQuality();

  return (
    <div>
      {quality !== "4g" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="text-sm font-medium text-yellow-800">
            📡 Network Speed: {quality.toUpperCase()}
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Some features may be limited on slower networks.
          </p>
        </div>
      )}

      {quality === "4g" ? (
        <HighQualitySimulator />
      ) : (
        <LiteSimulator />
      )}
    </div>
  );
}

// ============= EXAMPLE 4: Global Loading State =============
import { useLoading } from "@/hooks/useLoading";

export function ExampleGlobalLoading() {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleAction = async () => {
    startLoading("Processing request...");

    try {
      // Your async action
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      stopLoading();
    }
  };

  return (
    <button
      onClick={handleAction}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {isLoading ? "Processing..." : "Click Me"}
    </button>
  );
}

// ============= EXAMPLE 5: Lazy Load Components Below Fold =============
import { LazyDiv } from "@/lib/lazyLoading";
import { SkeletonText } from "@/components/Skeleton";

export function ExampleLazyComponent() {
  return (
    <div className="space-y-8">
      {/* Hero section - always loaded */}
      <section className="h-screen bg-gradient-to-b from-blue-600 to-blue-400">
        <h1 className="text-4xl font-bold text-white">Welcome</h1>
      </section>

      {/* Content below fold - lazy loaded */}
      <LazyDiv fallback={<SkeletonText count={5} />}>
        <section className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Detailed Info</h2>
          <p>This content loads only when scrolled into view</p>
          {/* Expensive component */}
          <ComplexChart />
        </section>
      </LazyDiv>

      {/* Another lazy loaded section */}
      <LazyDiv fallback={<SkeletonCard />}>
        <section className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">More Content</h2>
          <ExpensiveDataTable />
        </section>
      </LazyDiv>
    </div>
  );
}

// ============= EXAMPLE 6: Protected API Call =============
import { RateLimiter, sanitizeHTML } from "@/lib/security";

const apiLimiter = new RateLimiter(50, 60000); // 50 requests per minute

export function ExampleSecureAPI() {
  const [result, setResult] = useState(null);

  const handleAPICall = async () => {
    if (!apiLimiter.isAllowed()) {
      alert(
        `Rate limited. Remaining attempts: ${apiLimiter.getRemainingRequests()}`
      );
      return;
    }

    try {
      const userInput = document.querySelector("input")?.value || "";
      const sanitized = sanitizeHTML(userInput);

      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // CSRF token automatically added by request interceptor
        },
        body: JSON.stringify({ data: sanitized }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter data" />
      <button onClick={handleAPICall}>Submit Safely</button>
      {result && <p>{JSON.stringify(result)}</p>}
    </div>
  );
}

// ============= EXAMPLE 7: Complete Page with All Features =============
export function ExampleCompletePagePattern() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const quality = useNetworkQuality();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const loadData = async () => {
      startLoading("Loading page content...");
      try {
        // Simulate network delay
        await new Promise((resolve) =>
          setTimeout(resolve, quality === "4g" ? 500 : 2000)
        );
        setData({ items: Array.from({ length: 12 }) });
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };

    loadData();
  }, [quality, startLoading, stopLoading]);

  return (
    <PageLoadingWrapper
      isLoading={isLoading}
      loadingComponent={<SkeletonGrid count={6} />}
    >
      <div className="space-y-6">
        {/* Network quality indicator */}
        {quality !== "4g" && (
          <div className="bg-blue-50 p-4 rounded">
            Network: {quality} - Limited features enabled
          </div>
        )}

        {/* Main content grid with lazy loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items.map((_, i) => (
            <LazyDiv
              key={i}
              fallback={<SkeletonCard />}
              className="bg-white rounded-lg overflow-hidden shadow"
            >
              <LazyImage
                src={`https://via.placeholder.com/400?text=Item+${i + 1}`}
                alt={`Item ${i + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">Item {i + 1}</h3>
                <p className="text-sm text-gray-600">Description</p>
              </div>
            </LazyDiv>
          ))}
        </div>
      </div>
    </PageLoadingWrapper>
  );
}

// Placeholder components
function ComplexChart() {
  return <div className="h-64 bg-gray-200 rounded animate-pulse" />;
}

function ExpensiveDataTable() {
  return <div className="h-96 bg-gray-200 rounded animate-pulse" />;
}

function HighQualitySimulator() {
  return <div className="p-4 bg-blue-100 rounded">High Quality Simulator</div>;
}

function LiteSimulator() {
  return <div className="p-4 bg-blue-50 rounded">Lite Simulator</div>;
}
