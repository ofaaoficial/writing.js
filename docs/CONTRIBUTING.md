# 🤝 Contributing to Writing.js v2.0

Welcome to the Writing.js v2.0 project! We're excited to have you contribute to making this library even better. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Contributing Guidelines](#contributing-guidelines)
6. [Testing](#testing)
7. [Performance Guidelines](#performance-guidelines)
8. [Documentation](#documentation)
9. [Submitting Changes](#submitting-changes)
10. [Review Process](#review-process)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat all contributors with respect and kindness
- **Be collaborative**: Work together to improve the project
- **Be inclusive**: Welcome newcomers and diverse perspectives
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Understand that everyone has different experience levels

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- Modern browser for testing
- Basic understanding of TypeScript/JavaScript

### Quick Start

1. Fork the repository
2. Clone your fork locally
3. Install dependencies
4. Create a feature branch
5. Make your changes
6. Test your changes
7. Submit a pull request

```bash
# Clone the repository
git clone https://github.com/yourusername/writing.js.git
cd writing.js

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build the project
npm run build
```

## 🛠️ Development Setup

### Environment Setup

```bash
# Install dependencies
npm install

# Set up development environment
npm run setup

# Start development server with hot reload
npm run dev:watch

# Run tests in watch mode
npm run test:watch

# Run performance benchmarks
npm run bench

# Generate documentation
npm run docs
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "vite serve",
    "dev:watch": "vite serve --watch",
    "build": "vite build",
    "build:types": "tsc --emitDeclarationOnly",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "bench": "vitest bench",
    "lint": "eslint src --ext .ts,.js",
    "lint:fix": "eslint src --ext .ts,.js --fix",
    "format": "prettier --write src/**/*.{ts,js}",
    "docs": "typedoc src --out docs/api",
    "setup": "node scripts/setup.js"
  }
}
```

## 📁 Project Structure

```
writing.js/
├── src/                     # Source code
│   ├── core/               # Core functionality
│   │   ├── WritingJS.ts    # Main class
│   │   └── WritingSequence.ts
│   ├── effects/            # Animation effects
│   │   ├── TypeWriter.ts
│   │   ├── FadeWriter.ts
│   │   └── GlitchWriter.ts
│   ├── utils/              # Utilities
│   │   ├── EventEmitter.ts
│   │   ├── DOMUtils.ts
│   │   └── ValidationUtils.ts
│   ├── types/              # TypeScript definitions
│   │   └── WritingTypes.ts
│   ├── integrations/       # Framework integrations
│   │   ├── useWriting.ts   # React hook
│   │   └── vueDirective.ts # Vue directive
│   └── index.ts           # Main entry point
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── e2e/               # End-to-end tests
│   └── performance/       # Performance tests
├── docs/                   # Documentation
├── examples/              # Usage examples
├── scripts/               # Build scripts
├── dist/                  # Built files
└── playground/            # Interactive playground
```

## 🎯 Contributing Guidelines

### Types of Contributions

1. **Bug Fixes**: Fix existing issues
2. **New Features**: Add new functionality
3. **Performance Improvements**: Optimize existing code
4. **Documentation**: Improve docs and examples
5. **Tests**: Add or improve test coverage
6. **Framework Integrations**: Add new framework support

### Before You Start

1. Check existing issues and pull requests
2. Open an issue to discuss major changes
3. Follow the existing code style
4. Write tests for new functionality
5. Update documentation when needed

### Coding Standards

#### TypeScript/JavaScript

```typescript
// Use meaningful variable names
const animationDuration = 1000; // ✅ Good
const d = 1000; // ❌ Bad

// Use const/let appropriately
const config = { writer: 100 }; // ✅ Immutable
let currentIndex = 0; // ✅ Mutable

// Use proper typing
interface WritingConfig {
    words: string[];
    times?: TimingConfig;
}

// Use JSDoc for documentation
/**
 * Creates a new Writing animation instance
 * @param element - Target DOM element
 * @param config - Animation configuration
 * @returns WritingJS instance
 */
function createWriter(element: HTMLElement, config: WritingConfig): WritingJS {
    // Implementation
}
```

#### Code Style

```typescript
// Class structure
class WritingJS {
    private element: HTMLElement;
    private config: WritingConfig;
    private state: WritingState;
    
    constructor(element: HTMLElement | string, config: WritingConfig) {
        this.element = this.validateElement(element);
        this.config = this.validateConfig(config);
        this.state = this.initializeState();
    }
    
    // Public methods first
    public start(): Promise<void> {
        return this.startAnimation();
    }
    
    public stop(): void {
        this.stopAnimation();
    }
    
    // Private methods after public
    private validateElement(element: HTMLElement | string): HTMLElement {
        // Implementation
    }
    
    private validateConfig(config: WritingConfig): WritingConfig {
        // Implementation
    }
}
```

### Error Handling

```typescript
// Use custom error classes
class WritingError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'WritingError';
    }
}

// Handle errors gracefully
try {
    const writer = new WritingJS(element, config);
    await writer.start();
} catch (error) {
    if (error instanceof WritingError) {
        console.error(`Writing.js Error [${error.code}]: ${error.message}`);
    } else {
        console.error('Unexpected error:', error);
    }
}
```

### Performance Guidelines

```typescript
// Use efficient DOM operations
class DOMUtils {
    private static cache = new WeakMap<HTMLElement, any>();
    
    static getElementMetrics(element: HTMLElement) {
        if (this.cache.has(element)) {
            return this.cache.get(element);
        }
        
        const metrics = {
            width: element.offsetWidth,
            height: element.offsetHeight,
            // ... other metrics
        };
        
        this.cache.set(element, metrics);
        return metrics;
    }
}

// Use requestAnimationFrame for animations
private animate(): void {
    if (!this.isAnimating) return;
    
    this.updateAnimation();
    requestAnimationFrame(() => this.animate());
}

// Debounce expensive operations
private debouncedResize = this.debounce(() => {
    this.handleResize();
}, 100);
```

## 🧪 Testing

### Test Structure

```typescript
// Unit tests
describe('WritingJS', () => {
    let element: HTMLElement;
    let writer: WritingJS;
    
    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });
    
    afterEach(() => {
        writer?.destroy();
        document.body.removeChild(element);
    });
    
    it('should create instance with valid config', () => {
        const config = { words: ['test'] };
        writer = new WritingJS(element, config);
        
        expect(writer).toBeInstanceOf(WritingJS);
        expect(writer.getConfig()).toEqual(expect.objectContaining(config));
    });
    
    it('should start animation', async () => {
        writer = new WritingJS(element, { words: ['test'] });
        const startSpy = vi.spyOn(writer, 'start');
        
        await writer.start();
        
        expect(startSpy).toHaveBeenCalled();
        expect(writer.isAnimating()).toBe(true);
    });
});
```

### Performance Tests

```typescript
// Performance benchmarks
describe('Performance', () => {
    it('should handle 100 concurrent animations', async () => {
        const writers = [];
        const startTime = performance.now();
        
        for (let i = 0; i < 100; i++) {
            const element = document.createElement('div');
            document.body.appendChild(element);
            
            const writer = new WritingJS(element, {
                words: ['test', 'performance'],
                times: { writer: 10, eraser: 5, read: 100 }
            });
            
            writers.push(writer);
        }
        
        await Promise.all(writers.map(w => w.start()));
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        expect(duration).toBeLessThan(1000); // Should complete within 1 second
        
        // Cleanup
        writers.forEach(w => w.destroy());
    });
});
```

### E2E Tests

```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

test('should animate text correctly', async ({ page }) => {
    await page.goto('/examples/basic.html');
    
    const textElement = page.locator('#animated-text');
    await expect(textElement).toBeVisible();
    
    // Start animation
    await page.click('#start-button');
    
    // Wait for animation to begin
    await page.waitForFunction(() => {
        const element = document.querySelector('#animated-text');
        return element && element.textContent !== '';
    });
    
    // Check animation progress
    const text = await textElement.textContent();
    expect(text).toBeTruthy();
});
```

## 📊 Performance Guidelines

### Memory Management

```typescript
// Use WeakMap for element associations
class WritingJS {
    private static instances = new WeakMap<HTMLElement, WritingJS>();
    
    static getInstance(element: HTMLElement): WritingJS | undefined {
        return this.instances.get(element);
    }
    
    constructor(element: HTMLElement, config: WritingConfig) {
        WritingJS.instances.set(element, this);
    }
    
    destroy(): void {
        WritingJS.instances.delete(this.element);
        // Other cleanup
    }
}
```

### Animation Optimization

```typescript
// Batch DOM operations
class AnimationOptimizer {
    private pendingUpdates = new Set<() => void>();
    private rafId: number | null = null;
    
    scheduleUpdate(updateFn: () => void): void {
        this.pendingUpdates.add(updateFn);
        
        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => {
                this.flushUpdates();
            });
        }
    }
    
    private flushUpdates(): void {
        this.pendingUpdates.forEach(updateFn => updateFn());
        this.pendingUpdates.clear();
        this.rafId = null;
    }
}
```

### Benchmarking

```typescript
// Performance measurement utility
class PerformanceMonitor {
    private metrics = new Map<string, number[]>();
    
    measure<T>(name: string, fn: () => T): T {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        
        this.metrics.get(name)!.push(end - start);
        return result;
    }
    
    getAverageTime(name: string): number {
        const times = this.metrics.get(name) || [];
        return times.reduce((sum, time) => sum + time, 0) / times.length;
    }
}
```

## 📚 Documentation

### JSDoc Standards

```typescript
/**
 * Creates a new Writing animation instance
 * 
 * @param element - Target DOM element or CSS selector
 * @param config - Animation configuration options
 * @throws {WritingError} When element is not found or config is invalid
 * @example
 * ```typescript
 * const writer = new WritingJS('#text', {
 *     words: ['Hello', 'World'],
 *     times: { writer: 100, eraser: 50, read: 1500 }
 * });
 * await writer.start();
 * ```
 */
constructor(element: HTMLElement | string, config: WritingConfig) {
    // Implementation
}

/**
 * Starts the typing animation
 * 
 * @returns Promise that resolves when animation starts
 * @emits start - When animation begins
 * @emits error - If animation fails to start
 */
async start(): Promise<void> {
    // Implementation
}
```

### README Updates

When adding new features, update the README.md:

```markdown
## New Feature

Brief description of the feature and its benefits.

### Usage

```javascript
const writer = new WritingJS('#element', {
    // New configuration options
    newFeature: {
        enabled: true,
        option1: 'value1'
    }
});
```

### API Reference

- `newMethod()` - Description of the new method
- `newProperty` - Description of the new property
```

## 🔄 Submitting Changes

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow coding standards
   - Add tests
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues

### Commit Message Convention

We use conventional commits for consistency:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `perf`: Performance improvements
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add error simulation to TypeWriter effect

fix(utils): resolve memory leak in DOMUtils

docs(api): update WritingJS configuration examples

test(integration): add React hook integration tests
```

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Performance tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console warnings/errors
- [ ] Performance impact considered

## Screenshots/GIFs
If applicable, add screenshots or GIFs demonstrating the changes.

## Additional Notes
Any additional information about the changes.
```

## 🔍 Review Process

### Code Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Performance is acceptable

**Code Quality:**
- [ ] Code is readable and maintainable
- [ ] No code duplication
- [ ] Proper abstractions used
- [ ] Follows project patterns

**Testing:**
- [ ] Adequate test coverage
- [ ] Tests are meaningful
- [ ] Tests pass consistently
- [ ] Performance tests included

**Documentation:**
- [ ] JSDoc comments added
- [ ] README updated if needed
- [ ] Examples provided
- [ ] API documentation current

### Review Timeline

- **Initial Review**: Within 2-3 business days
- **Follow-up Reviews**: Within 1 business day
- **Final Approval**: After all requirements met

### After Review

1. **Address feedback** from reviewers
2. **Push updates** to your branch
3. **Request re-review** if needed
4. **Merge** after approval

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** - Contributors section
- **CHANGELOG.md** - Release notes
- **GitHub Releases** - Credit for features
- **Project Documentation** - Special mentions

### Hall of Fame

Outstanding contributors may be featured in our Hall of Fame for:
- Significant feature contributions
- Major performance improvements
- Excellent documentation
- Community support

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and collaboration
- **Email**: Direct contact for sensitive issues

### Resources

- **Documentation**: Comprehensive guides and API reference
- **Examples**: Working code examples
- **Playground**: Interactive testing environment
- **Blog**: Development updates and tutorials

## 🔮 Future Roadmap

### Planned Features

- **3D Text Effects**: Three-dimensional animations
- **AI Integration**: Smart text generation
- **Mobile Optimizations**: Touch-friendly controls
- **Accessibility**: Screen reader support
- **Internationalization**: Multi-language support

### Community Suggestions

We welcome community input on:
- New animation effects
- Framework integrations
- Performance optimizations
- Developer tools
- Documentation improvements

Thank you for contributing to Writing.js v2.0! Your contributions help make this library better for developers worldwide. 🚀