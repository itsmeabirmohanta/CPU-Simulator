# 🖥️ CPU Simulator - Visual Microprocessor Learning Platform

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js&logoColor=white)](https://nodejs.org)

An **interactive, visual 8-bit CPU simulator** for learning computer architecture and microprocessor fundamentals. Watch every fetch, decode, and execute cycle animate in real time with detailed explanations and guided tutorials.

[🚀 Features](#features) • [🎯 Quick Start](#quick-start) • [📚 Documentation](#documentation) • [🔧 Development](#development) • [🤝 Contributing](#contributing)

</div>

---

## 🎯 Features

### 🎓 Educational Core
- **Real-time CPU Animation**: Watch fetch-decode-execute cycles animate in real time
- **Beginner Mode**: Simplified visual interface with guided walkthroughs for newcomers
- **Advanced Mode**: Register-level control, detailed execution logs, and in-depth analysis
- **Interactive Lessons**: Comprehensive modules covering computer architecture fundamentals
- **Guided Tutorials**: Step-by-step instruction with visual overlays and explanations

### 🎨 User Experience
- **Dark & Light Theme**: Responsive design with seamless theme switching
- **Mobile Optimized**: Fully responsive layout that works on all devices
- **Accessibility**: Built with inclusive design principles and semantic HTML
- **Smooth Animations**: Framer Motion powered transitions and visual effects

### ⚡ Performance Features
- **Lazy Loading System**: 
  - Component code splitting with automatic chunking
  - Image lazy loading with intersection observer
  - Network-adaptive loading for slow connections
- **Loading Indicators**: Smooth loaders and skeleton screens with shimmer effects
- **Advanced Optimizations**:
  - Gzip & Brotli compression
  - CSS code splitting
  - React Query intelligent caching
  - Service worker ready

### 🔒 Security & Protection
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **CSRF Protection**: Automatic token management
- **XSS Prevention**: HTML sanitization and content validation
- **Rate Limiting**: Built-in request rate limiting
- **Safe API Calls**: Automatic token injection and request interception

> 📖 **For detailed feature documentation**, see [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md) and [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org))
- **npm** (comes with Node.js) or **Bun** ([Download](https://bun.sh))
- **Git** for version control

### 💻 Installation

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd edu-cpu-sim

# 2. Install dependencies
npm install
# OR use Bun for faster installation
bun install

# 3. Start the development server
npm run dev
# OR
bun dev
```

The application will open at **`http://localhost:5173`** with hot module replacement (HMR) enabled.

### ✅ Verify Installation

After starting the dev server, you should see:
- ✓ The CPU Simulator interface loads
- ✓ Theme toggle works (top-right corner)
- ✓ Console shows no errors
- ✓ Hot module replacement works when you save files

---

## 🔧 Development

### 📝 Available Commands

```bash
# Start development server with HMR
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Run all tests once
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Lint code for style and error issues
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### 🏗️ Project Architecture

```
edu-cpu-sim/
├── 📄 Configuration Files
│   ├── vite.config.ts              # Vite build configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vitest.config.ts            # Test configuration
│   └── tailwind.config.ts          # Tailwind CSS theme
│
├── 📁 src/
│   ├── components/
│   │   ├── 🎨 ui/                  # shadcn/ui components library
│   │   ├── 🖥️  simulator/          # CPU simulator components
│   │   │   ├── BeginnerVisualCPU.tsx
│   │   │   ├── CpuDiagram.tsx
│   │   │   ├── CpuStatePanel.tsx
│   │   │   ├── ExecutionControls.tsx
│   │   │   ├── ExecutionLog.tsx
│   │   │   ├── MemoryViewer.tsx
│   │   │   └── ...
│   │   ├── 📚 learn/               # Educational components
│   │   │   ├── LessonCard.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── GuidedWalkthrough.tsx
│   │   │   └── ...
│   │   ├── Loader.tsx              # Loading spinner
│   │   ├── Skeleton.tsx            # Skeleton loaders
│   │   └── ThemeToggle.tsx         # Dark/light theme switcher
│   │
│   ├── pages/                       # Route pages (lazy loaded)
│   │   ├── Index.tsx               # Landing page
│   │   ├── SimulatorPage.tsx       # CPU simulator page
│   │   ├── LearnPage.tsx           # Learning modules page
│   │   ├── AboutPage.tsx           # About page
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useLoading.tsx          # Global loading state management
│   │   ├── use-mobile.tsx          # Responsive design hook
│   │   └── use-toast.ts            # Toast notifications
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── cpu.ts                  # CPU simulator logic
│   │   ├── curriculum.ts           # Learning content
│   │   ├── lazyLoading.tsx         # Lazy loading utilities
│   │   ├── security.ts             # Security protocols
│   │   └── utils.ts                # General utilities
│   │
│   ├── examples/
│   │   └── USAGE_EXAMPLES.tsx      # Code examples and patterns
│   │
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global styles
│
├── public/
│   └── robots.txt
│
└── 📦 Dependencies (see package.json)
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)** | Comprehensive guide to performance features, lazy loading, security, and best practices |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Technical implementation details of all features |
| **[USAGE_EXAMPLES.tsx](./src/examples/USAGE_EXAMPLES.tsx)** | Real-world code examples and patterns |

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|---------------|
| **Frontend Framework** | React 18.3, TypeScript 5.6 |
| **Build Tool** | Vite 5.4 |
| **Styling** | Tailwind CSS, PostCSS |
| **UI Components** | shadcn/ui, Radix UI |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form, Zod |
| **State Management** | React Query 5.83, React Context |
| **Testing** | Vitest, Node Test Runner |
| **Linting** | ESLint, Prettier |
| **Package Manager** | npm / Bun |

---

## 🎓 How to Use

### Getting Started with the Simulator

1. **Start the Application**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` in your browser.

2. **Choose Your Learning Path**
   - **New to CPU Architecture?** → Start with **Beginner Mode** for guided walkthroughs
   - **Familiar with Concepts?** → Jump to **Advanced Mode** for detailed control

3. **Explore the Interface**
   - **Left Panel**: Visual CPU diagram with registers and state
   - **Center Panel**: Code editor and memory viewer
   - **Right Panel**: Real-time execution logs and explanations
   - **Top Navigation**: Mode switcher, theme toggle, and more

4. **Write and Execute Code**
   - Write assembly or low-level code in the editor
   - Click "Execute" or "Step" to run instructions
   - Watch the CPU state update in real-time
   - Read detailed explanations for each operation

5. **Access Learning Modules**
   - Navigate to **Learn** section from the navbar
   - Complete interactive lessons on computer architecture
   - Test your knowledge with guided exercises

---

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Port 5173 already in use** | Run `npm run dev -- --port 3000` to use a different port |
| **Module not found errors** | Clear `node_modules` and run `npm install` again: `rm -r node_modules && npm install` |
| **Hot reload not working** | Restart the dev server: Press `Ctrl+C` then run `npm run dev` |
| **Build fails with memory error** | Increase Node memory: `NODE_OPTIONS=--max_old_space_size=4096 npm run build` |
| **Tests fail** | Run in watch mode: `npm run test:watch` to debug individual tests |
| **Styles not applying** | Clear Tailwind cache: `rm -r .next` then restart dev server |

### Getting Help

- 📖 Check [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md) for detailed configuration
- 🔍 Search existing issues on GitHub
- 💬 Check browser console for error messages (`F12` or `Ctrl+Shift+I`)
- 🐛 Enable React DevTools for debugging state

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test -- --coverage
```

### Test Files Location

Tests are located in `src/test/` directory:
- `example.test.ts` - Example test cases
- `setup.ts` - Test environment configuration

### Writing Tests

```typescript
// Example test structure
import { describe, it, expect } from 'vitest';

describe('CPU Simulator', () => {
  it('should fetch instruction from memory', () => {
    // Test logic here
    expect(result).toBe(expectedValue);
  });
});
```

---

## 🔐 Security Information

This project includes comprehensive security features:

### Built-in Protections

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **HSTS Headers**: Enforces HTTPS connections
- **CSRF Tokens**: Automatic token management and validation
- **XSS Protection**: HTML sanitization and validation
- **Rate Limiting**: Request throttling to prevent abuse
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.

### Running Securely

The security protocols are automatically initialized in `App.tsx`. No additional configuration needed!

```typescript
// Security is automatically set up:
import { setupProtectionProtocols } from '@/lib/security';
setupProtectionProtocols();
```

---

## 📊 Performance Optimization

### What We've Optimized

✅ **Code Splitting**: Automatic 5-bundle splitting for faster load times
✅ **Compression**: Gzip & Brotli compression for smaller file sizes
✅ **Lazy Loading**: Components load on-demand to reduce initial bundle
✅ **Image Optimization**: Lazy-loaded images with intersection observer
✅ **Caching Strategy**: React Query with intelligent cache invalidation
✅ **CSS Optimization**: CSS code splitting to load only needed styles

### Performance Monitor

The app includes built-in performance monitoring. Check the browser console for:
- Page load time
- API response times
- Component render duration

> See [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md) for advanced optimization configuration

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation if needed

4. **Commit Your Work**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Describe your changes clearly
   - Link any related issues

### Code Style Guidelines

- Use **TypeScript** for type safety
- Follow **Prettier** formatting rules
- Ensure all tests pass: `npm run test`
- Run linter: `npm run lint`
- Use meaningful variable and function names
- Add comments for complex logic

### Reporting Issues

Found a bug? Have a feature suggestion?

1. Check existing issues first
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, browser)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Permission is hereby granted to use, copy, modify, and distribute this software for any purpose.

---

## 🙋 FAQ

### **Q: Can I use this for commercial projects?**
A: Yes! The MIT license permits commercial use.

### **Q: Do I need to be an expert to understand the simulator?**
A: No! Start with Beginner Mode and follow the guided tutorials. The lessons are designed for all skill levels.

### **Q: Can I modify the simulator for my needs?**
A: Absolutely! Fork the repository and make your own modifications.

### **Q: How do I deploy this to production?**
A: Run `npm run build` to create an optimized production bundle in the `dist/` folder. Deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

### **Q: Is there a way to reset my progress?**
A: Browser local storage can be cleared from DevTools. Progress resets when localStorage is cleared.

### **Q: Can I contribute translations?**
A: Yes! We'd love localization contributions. Open an issue to discuss.

---

## 📮 Contact & Support

- 💻 **GitHub Issues**: Report bugs or request features
- 📧 **Email**: [Add contact email if applicable]
- 🐦 **Twitter**: [Add Twitter handle if applicable]
- 💬 **Discussions**: Use GitHub Discussions for questions

---

## 🎉 Acknowledgments

Built with:
- ❤️ React & TypeScript community
- 🎨 shadcn/ui component library
- 🌊 Radix UI primitives
- ✨ Framer Motion animations
- ⚡ Vite build tooling

---

<div align="center">

### Made with ❤️ for Computer Science Learners

**[⬆ Back to top](#-cpu-simulator---visual-microprocessor-learning-platform)**

</div>
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

The project is deployed at [cpusimulator.tech](https://cpusimulator.tech).

## Domain

This project uses **cpusimulator.tech** as its primary domain for accessing the CPU Simulator platform.
