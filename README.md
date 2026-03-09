# CPU Simulator - Visual Microprocessor Learning Platform

An interactive, visual 8-bit CPU simulator for learning computer architecture. Watch every fetch, decode, and execute cycle animate in real time.

## Features

- **Visual CPU Simulator**: Real-time animation of CPU operations
- **Beginner Mode**: Simplified view with guided walkthrough
- **Advanced Mode**: Register-level control and detailed execution logs
- **Interactive Learning**: Lessons and modules on computer architecture
- **Dark/Light Theme**: Responsive design with theme toggle
- **Performance Optimized**: Code splitting, lazy loading, and compression
- **Secure**: Built-in security headers and CSRF protection

### New Performance & Security Features ✨

- **Loaders & Spinners**: Smooth loading indicators for async operations
- **Skeletal Loading**: Skeleton screens with shimmer effects (multiple variants)
- **Lazy Loading**:
  - Component code splitting
  - Image lazy loading with intersection observer
  - Network-adaptive loading
- **Security Protocols**:
  - Security headers (CSP, HSTS, X-Frame-Options, etc.)
  - CSRF token management
  - XSS protection via HTML sanitization
  - Rate limiting
  - Request interceptor with automatic token injection
- **Performance Optimizations**:
  - Gzip & Brotli compression
  - CSS code splitting
  - Service worker ready
  - React Query caching strategy

For detailed usage, see [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md).

## Quick Start

### Prerequisites

- Node.js & npm (v18+)
- Bun package manager (optional, uses npm by default)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd edu-cpu-sim

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The project will open at `http://localhost:8080` with hot module replacement enabled.

## Development

```sh
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint
```

## Project Structure

```text
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── simulator/       # CPU simulator components
│   ├── learn/           # Learning module components
│   ├── Loader.tsx       # Loading spinner component
│   ├── Skeleton.tsx     # Skeleton loader component
│   └── ...
├── pages/               # Route pages (lazy loaded)
├── hooks/
│   ├── useLoading.tsx   # Global loading state context
│   └── ...
├── lib/
│   ├── cpu.ts           # CPU simulation logic
│   ├── security.ts      # Security protocols & utilities
│   ├── lazyLoading.tsx  # Lazy loading utilities
│   └── ...
└── App.tsx              # Main app with routing & protection setup
```

## Configuration Files

- **vite.config.ts** - Build config with compression & code splitting
- **package.json** - Dependencies (added vite-plugin-compression)
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **eslint.config.js** - ESLint configuration

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Query, React Context
- **Testing**: Vitest
- **Linting**: ESLint

## Performance Metrics

After recent optimizations:

- ✅ Lazy-loaded route components
- ✅ Automatic code splitting (5 bundles)
- ✅ Image lazy loading with intersection observer
- ✅ Gzip & Brotli compression enabled
- ✅ Network-adaptive content loading
- ✅ Loader components for visual feedback
- ✅ Skeletal loading screens

## Security Features

- **CSP Headers**: Restrictive content security policy
- **HSTS**: Enforce HTTPS
- **CSRF Protection**: Automatic token generation & validation
- **XSS Protection**: HTML sanitization utilities
- **Rate Limiting**: Built-in rate limiter for API calls
- **Request Interception**: Auto-inject security headers
- **Permissions Policy**: Disable unnecessary browser features

## Build & Deployment

```sh
# Create production build
npm run build

# Output will be in ./dist/
# The build includes:
# - Gzip compressed assets (.gz)
# - Brotli compressed assets (.br)
# - Code-split bundles
# - Minified CSS & JS
# - Optimized images
```

## Documentation

- [Performance & Security Guide](./PERFORMANCE_GUIDE.md) - Detailed usage guide for all new features
- [Usage Examples](./src/examples/USAGE_EXAMPLES.tsx) - Code examples for common patterns

## Environment Setup

No special environment variables required. The app works out of the box.

Optional optimization: Enable compression in your hosting provider (nginx, Cloudflare, etc.) for even better performance.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is created for educational purposes.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
