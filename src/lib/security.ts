/**
 * Security headers configuration
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

/**
 * Initialize security protocols on the client side
 */
export function initializeSecurityProtocols() {
  // Disable right-click context menu in production (optional)
  if (process.env.NODE_ENV === "production") {
    // Uncomment if needed: document.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // Add security meta tags
  const metaTags = [
    { name: "format-detection", content: "telephone=no" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  ];

  metaTags.forEach((tag) => {
    const existing = document.querySelector(`meta[name="${tag.name}"]`);
    if (!existing) {
      const meta = document.createElement("meta");
      meta.setAttribute("name", tag.name);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    }
  });

  // Sanitize console in production
  if (process.env.NODE_ENV === "production") {
    sanitizeConsole();
  }

  // Monitor performance
  monitorPerformance();

  // Enable resource hints
  enableResourceHints();
}

/**
 * Sanitize console output in production
 */
function sanitizeConsole() {
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.debug = noop;
  // Keep error and info for critical issues
}

/**
 * Monitor performance metrics
 */
function monitorPerformance() {
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.info("[Performance]", entry.name, entry.duration);
        });
      });

      observer.observe({
        entryTypes: ["navigation", "resource", "largest-contentful-paint", "first-input", "cumulative-layout-shift"],
      });
    } catch (e) {
      // Performance Observer not supported
    }
  }
}

/**
 * Enable resource hints for performance
 */
function enableResourceHints() {
  const hints = [
    { rel: "dns-prefetch", href: "https://cdn.example.com" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "prefetch", href: "/" },
  ];

  hints.forEach((hint) => {
    const link = document.createElement("link");
    link.rel = hint.rel;
    link.href = hint.href;
    document.head.appendChild(link);
  });
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);

    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  getRemainingRequests(): number {
    return Math.max(0, this.maxRequests - this.timestamps.length);
  }
}

/**
 * XSS protection utility
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

/**
 * CSRF token management
 */
export class CSRFTokenManager {
  private static readonly TOKEN_NAME = "X-CSRF-Token";

  static getToken(): string {
    const token = localStorage.getItem(this.TOKEN_NAME);
    if (!token) {
      const newToken = this.generateToken();
      localStorage.setItem(this.TOKEN_NAME, newToken);
      return newToken;
    }
    return token;
  }

  static generateToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  static validateToken(token: string): boolean {
    const stored = this.getToken();
    return token === stored;
  }
}

/**
 * Request interceptor for security headers
 */
export function setupRequestInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    const [resource, config = {}] = args as [RequestInfo | URL, RequestInit | undefined];
    
    // Add CSRF token to POST requests
    if (config.method === "POST" || config.method === "PUT" || config.method === "DELETE") {
      const headers = config.headers || {};
      if (typeof headers === "object" && !Array.isArray(headers)) {
        (headers as Record<string, string>)["X-CSRF-Token"] = CSRFTokenManager.getToken();
      }
      config.headers = headers;
    }

    // Add security headers
    const secureConfig = {
      ...config,
      credentials: "same-origin" as RequestCredentials,
    };

    return originalFetch.call(window, resource, secureConfig);
  } as typeof fetch;
}

/**
 * Initialize all security and performance features
 */
export function setupProtectionProtocols() {
  initializeSecurityProtocols();
  setupRequestInterceptor();
}
