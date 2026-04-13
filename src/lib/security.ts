/**
 * ★ Security Module — CPU Simulator
 * Layers: DevTools detection · Frame-busting · XSS / HTML injection guard
 *         CSRF token management · Rate limiting · Request interceptor
 *         Secure storage wrapper · Performance monitoring · Resource hints
 */

// ─── Security Header Recommendations (for server/CDN config reference) ────────
export const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",          // vite dev needs inline; tighten in prod
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",                      // anti-clickjacking
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

// ─── Frame-busting ────────────────────────────────────────────────────────────
function enforceNoFraming(): void {
  try {
    if (window.self !== window.top) {
      // We are inside an iframe — attempt to break out
      window.top!.location.href = window.self.location.href;
    }
  } catch {
    // Cross-origin iframe: top is inaccessible — replace content with warning
    document.documentElement.innerHTML =
      "<body style='background:#000;color:#f00;font-family:monospace;padding:2rem'>" +
      "<h1>⚠ Access Denied</h1><p>This application cannot be embedded in an external frame.</p></body>";
  }
}

// ─── DevTools detection (passive, non-intrusive) ─────────────────────────────
let devToolsOpen = false;

function detectDevTools(): void {
  const threshold = 160;
  const check = () => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const opened = widthDiff > threshold || heightDiff > threshold;
    if (opened !== devToolsOpen) {
      devToolsOpen = opened;
      if (opened && process.env.NODE_ENV === "production") {
        // Emit custom event — UI can respond (e.g. blur sensitive content)
        window.dispatchEvent(new CustomEvent("devtools:open"));
      }
    }
  };
  setInterval(check, 1500);
}

export function isDevToolsOpen(): boolean {
  return devToolsOpen;
}

// ─── Sanitize HTML / XSS guard ───────────────────────────────────────────────
/**
 * Strip all HTML tags from a string (text-node approach — no innerHTML exploit).
 */
export function sanitizeHTML(input: string): string {
  const el = document.createElement("div");
  el.textContent = input;       // safe assignment — no HTML parsing
  return el.innerHTML;          // returns escaped entities
}

/**
 * Strip script-related patterns from a URL (javascript: / data: exploits).
 */
export function sanitizeURL(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:text/html") ||
    trimmed.startsWith("vbscript:")
  ) {
    return "#";
  }
  return url;
}

/**
 * Validate and sanitize arbitrary user-supplied input strings.
 * Removes null bytes, trims surrounding whitespace.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/\0/g, "")           // null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // script tags
    .replace(/on\w+\s*=/gi, "")   // inline event handlers
    .trim();
}

// ─── Secure Storage ───────────────────────────────────────────────────────────
/**
 * Wraps localStorage with a try/catch (storage may be blocked in private mode).
 * Add an optional encode step in production for lightweight obfuscation.
 */
export const SecureStorage = {
  set(key: string, value: unknown): void {
    try {
      const serialised = JSON.stringify(value);
      localStorage.setItem(key, serialised);
    } catch {
      /* storage full or blocked */
    }
  },

  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch { /* blocked */ }
  },
};

// ─── CSRF Token Management ────────────────────────────────────────────────────
const CSRF_TOKEN_KEY = "_xcsrf";

export class CSRFTokenManager {
  static getToken(): string {
    const stored = SecureStorage.get<string>(CSRF_TOKEN_KEY, "");
    if (!stored) {
      const token = this.generateToken();
      SecureStorage.set(CSRF_TOKEN_KEY, token);
      return token;
    }
    return stored;
  }

  static generateToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  static validateToken(token: string): boolean {
    const stored = this.getToken();
    if (!stored || !token) return false;
    // Constant-time compare (mitigate timing attacks)
    if (stored.length !== token.length) return false;
    let diff = 0;
    for (let i = 0; i < stored.length; i++) {
      diff |= stored.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return diff === 0;
  }

  static rotateToken(): string {
    const newToken = this.generateToken();
    SecureStorage.set(CSRF_TOKEN_KEY, newToken);
    return newToken;
  }
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 60, windowMs = 60_000) {
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
    const now = Date.now();
    const active = this.timestamps.filter((t) => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - active.length);
  }

  resetWindow(): void {
    this.timestamps = [];
  }
}

// ─── Request Interceptor ──────────────────────────────────────────────────────
const globalRateLimiter = new RateLimiter(120, 60_000);

export function setupRequestInterceptor(): void {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (resource: RequestInfo | URL, config: RequestInit = {}): Promise<Response> {
    // Rate-gate all outbound requests
    if (!globalRateLimiter.isAllowed()) {
      return Promise.reject(new Error("Rate limit exceeded. Please slow down."));
    }

    const method = (config.method ?? "GET").toUpperCase();
    const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    if (isMutating) {
      const headers = new Headers(config.headers ?? {});
      headers.set("X-CSRF-Token", CSRFTokenManager.getToken());
      headers.set("X-Requested-With", "XMLHttpRequest");
      config = { ...config, headers };
    }

    const secureConfig: RequestInit = {
      ...config,
      credentials: "same-origin",
    };

    return originalFetch(resource, secureConfig);
  };
}

// ─── Security Meta Tags ───────────────────────────────────────────────────────
function injectSecurityMeta(): void {
  const metas: Array<{ name?: string; httpEquiv?: string; content: string }> = [
    { name: "format-detection", content: "telephone=no" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
    { httpEquiv: "X-XSS-Protection", content: "1; mode=block" },
  ];

  metas.forEach(({ name, httpEquiv, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[http-equiv="${httpEquiv}"]`;
    if (!document.querySelector(selector)) {
      const meta = document.createElement("meta");
      if (name) meta.setAttribute("name", name);
      if (httpEquiv) meta.setAttribute("http-equiv", httpEquiv);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  });
}

// ─── Console sanitisation (production) ───────────────────────────────────────
function sanitizeConsole(): void {
  const noop = (): void => { /* suppressed */ };
  console.log = noop;
  console.warn = noop;
  console.debug = noop;
  console.table = noop;
  console.dir = noop;
  // Keep console.error and console.info for critical monitoring
}

// ─── Performance observer ─────────────────────────────────────────────────────
function monitorPerformance(): void {
  if (!("PerformanceObserver" in window)) return;
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint" && entry.duration > 2500) {
          console.info("[Perf] LCP slow:", entry.duration.toFixed(0), "ms");
        }
      });
    });
    observer.observe({ entryTypes: ["navigation", "largest-contentful-paint"] });
  } catch {
    /* not supported */
  }
}

// ─── Resource hints ───────────────────────────────────────────────────────────
function enableResourceHints(): void {
  const hints = [
    { rel: "preconnect", href: "https://fonts.googleapis.com", crossOrigin: "anonymous" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
  ];

  hints.forEach(({ rel, href, crossOrigin }) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    }
  });
}

// ─── Main entry points ────────────────────────────────────────────────────────
export function initializeSecurityProtocols(): void {
  enforceNoFraming();
  injectSecurityMeta();

  if (process.env.NODE_ENV === "production") {
    sanitizeConsole();
    detectDevTools();
  }

  monitorPerformance();
  enableResourceHints();
}

export function setupProtectionProtocols(): void {
  initializeSecurityProtocols();
  setupRequestInterceptor();
}
