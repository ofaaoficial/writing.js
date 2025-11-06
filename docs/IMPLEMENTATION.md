# 📚 Writing.js v2.0 - Implementation Guide

This comprehensive guide will help you implement Writing.js v2.0 in your projects, from basic usage to advanced configurations.

## 📦 Installation & Setup

### 1. Package Installation

```bash
# NPM
npm install writing.js

# Yarn
yarn add writing.js

# PNPM
pnpm add writing.js
```

### 2. Environment Setup

#### Modern Bundlers (Webpack, Vite, Rollup)
```javascript
// ES6 Modules
import { WritingJS, TypeWriter, FadeWriter } from 'writing.js';

// Tree-shaking friendly imports
import { WritingJS } from 'writing.js/core';
import { TypeWriter } from 'writing.js/effects';
```

#### Browser (CDN)
```html
<!-- Full library -->
<script src="https://unpkg.com/writing.js@2.0.0/dist/writing.min.js"></script>

<!-- ES Modules -->
<script type="module">
  import { WritingJS } from 'https://unpkg.com/writing.js@2.0.0/dist/writing.esm.js';
</script>
```

#### Node.js
```javascript
// CommonJS
const { WritingJS } = require('writing.js');

// ES Modules (Node 14+)
import { WritingJS } from 'writing.js';
```

### 3. TypeScript Configuration

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["DOM", "DOM.Iterable", "ES2018"]
  },
  "include": ["src/**/*"]
}
```

#### Type Definitions
```typescript
import type { 
  WritingConfig, 
  WritingState, 
  WritingEvents,
  PerformanceMetrics 
} from 'writing.js';
```

## 🚀 Basic Implementation

### 1. Simple Text Animation

```javascript
import { WritingJS } from 'writing.js';

// Basic setup
const writer = new WritingJS('#my-element', {
    words: ['Hello', 'World', 'Amazing', 'Animations'],
    times: { 
        writer: 100,  // ms between characters
        eraser: 50,   // ms between erasing
        read: 1500    // ms pause before erasing
    }
});

// Start animation
writer.start();
```

### 2. HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Writing.js Demo</title>
</head>
<body>
    <!-- Target element -->
    <h1>Welcome to <span id="animated-text">our website</span>!</h1>
    
    <script type="module">
        import { WritingJS } from 'writing.js';
        
        const writer = new WritingJS('#animated-text', {
            words: ['our website', 'the future', 'innovation', 'success'],
            infinite: true
        });
        
        writer.start();
    </script>
</body>
</html>
```

### 3. Configuration Options

```javascript
const config = {
    // Required: Words to animate
    words: ['Hello', 'World'],
    
    // Optional: Timing configuration
    times: {
        writer: 100,    // Character typing speed (ms)
        eraser: 50,     // Character erasing speed (ms)
        read: 1500      // Pause before erasing (ms)
    },
    
    // Optional: Animation behavior
    infinite: false,        // Loop animation
    pauseOnHover: true,     // Pause when hovering
    
    // Optional: Custom styles
    styles: [
        'color: #007bff',
        'font-weight: bold'
    ]
};
```

## 🎨 Effects Implementation

### 1. TypeWriter Effect

```javascript
import { TypeWriter } from 'writing.js/effects';

const typewriter = new TypeWriter('#element', {
    words: ['Professional', 'Developer', 'Designer'],
    effects: {
        typing: {
            randomSpeed: true,          // Vary typing speed
            speedVariation: 0.3,        // Speed variation amount (0-1)
            pauseOnPunctuation: true,   // Pause on punctuation
            punctuationDelay: 400       // Punctuation pause duration
        },
        errors: {
            enabled: true,              // Enable typing errors
            frequency: 0.08,            // Error frequency (0-1)
            correctionDelay: 800        // Time before correction
        }
    }
});

typewriter.start();
```

### 2. Fade Animation

```javascript
import { FadeWriter } from 'writing.js/effects';

const fade = new FadeWriter('#element', {
    words: ['Smooth', 'Elegant', 'Beautiful'],
    effects: {
        visual: {
            fadeIn: true
        }
    }
});

// Customize fade direction
fade.setFadeDirection('up'); // 'up', 'down', 'left', 'right'
fade.setFadeDuration(800);   // Custom duration in ms

fade.start();
```

### 3. Glitch Effect

```javascript
import { GlitchWriter } from 'writing.js/effects';

const glitch = new GlitchWriter('#element', {
    words: ['SYSTEM', 'ERROR', 'MATRIX'],
    effects: {
        errors: {
            enabled: true,
            frequency: 0.15
        },
        visual: {
            glitch: true,
            shake: true
        }
    }
});

// Customize glitch intensity
glitch.setGlitchIntensity(0.8);  // 0-1 intensity
glitch.setGlitchColors(['#ff0000', '#00ff00', '#0000ff']);

glitch.start();
```

## 🔄 Advanced Features

### 1. Animation Sequences

```javascript
import { WritingSequence } from 'writing.js';

const sequence = new WritingSequence()
    // First animation
    .add('#title', ['Welcome', 'to', 'our', 'platform'], {
        times: { writer: 80, eraser: 40, read: 1000 }
    })
    
    // Wait 500ms
    .wait(500)
    
    // Second animation
    .add('#subtitle', ['Experience', 'the', 'difference'], {
        times: { writer: 60, eraser: 30, read: 1200 }
    })
    
    // Clear first element
    .clearElement('#title')
    
    // Add callback
    .callback(() => {
        console.log('Sequence step completed');
    })
    
    // Run the sequence
    .run();

// Control sequence
sequence.pause();
sequence.resume();
sequence.stop();
```

### 2. Event Handling

```javascript
const writer = new WritingJS('#element', config);

// Animation lifecycle events
writer.on('start', (state) => {
    console.log('Animation started', state);
});

writer.on('complete', (state) => {
    console.log('Animation completed', state);
});

writer.on('pause', (state) => {
    console.log('Animation paused', state);
});

// Character-level events
writer.on('characterWrite', (char, index) => {
    console.log(`Character written: ${char} at position ${index}`);
});

writer.on('wordStart', (word, index) => {
    console.log(`Starting word: ${word} (${index})`);
});

writer.on('wordComplete', (word, index) => {
    console.log(`Completed word: ${word} (${index})`);
});

// Error handling
writer.on('error', (error) => {
    console.error('Animation error:', error);
});
```

### 3. Sound Integration

```javascript
const writer = new WritingJS('#element', {
    words: ['Hello', 'World'],
    effects: {
        sound: {
            enabled: true,
            keySound: '/sounds/keypress.mp3',
            deleteSound: '/sounds/delete.mp3',
            volume: 0.5,
            randomPitch: true
        }
    }
});
```

### 4. Performance Monitoring

```javascript
const writer = new WritingJS('#element', config);

// Get real-time metrics
setInterval(() => {
    const metrics = writer.getMetrics();
    const state = writer.getState();
    
    console.log({
        fps: metrics.averageFPS,
        memoryUsage: metrics.memoryUsage,
        frameDrops: metrics.frameDrops,
        progress: state.progress,
        isRunning: state.isRunning
    });
}, 1000);
```

## 🎮 Interactive Playground

### 1. Basic Playground Setup

```javascript
import { WritingPlayground } from 'writing.js/playground';

const playground = new WritingPlayground({
    container: '#playground-container',
    showControls: true,
    showMetrics: true,
    allowEditing: true,
    exportConfig: true,
    theme: 'dark' // 'light', 'dark', 'auto'
});
```

### 2. Custom Presets

```javascript
const customPreset = {
    name: 'Corporate',
    description: 'Professional business style',
    effect: 'typewriter',
    words: ['Innovation', 'Excellence', 'Success', 'Growth'],
    config: {
        times: { writer: 80, eraser: 40, read: 2000 },
        effects: {
            typing: {
                randomSpeed: false,
                pauseOnPunctuation: true
            }
        },
        styles: [
            'font-family: "Arial", sans-serif',
            'color: #2c3e50',
            'font-weight: 600'
        ]
    }
};

playground.addPreset(customPreset);
```

## 🔧 API Control Methods

### 1. Animation Control

```javascript
const writer = new WritingJS('#element', config);

// Basic controls
writer.start();          // Start animation
writer.stop();           // Stop and reset
writer.pause();          // Pause current state
writer.resume();         // Resume from pause
writer.restart();        // Stop and start again

// Configuration updates
writer.setWords(['new', 'words', 'array']);
writer.setSpeed(50);     // New typing speed
writer.setOptions({      // Update any config
    infinite: true,
    pauseOnHover: false
});
```

### 2. State Management

```javascript
// Check current state
console.log(writer.isAnimating());     // boolean
console.log(writer.getCurrentWord());  // current word string
console.log(writer.getProgress());     // 0-1 progress

// Get detailed state
const state = writer.getState();
console.log({
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    currentWordIndex: state.currentWordIndex,
    currentCharIndex: state.currentCharIndex,
    progress: state.progress,
    elapsedTime: state.elapsedTime
});
```

### 3. Cleanup and Destruction

```javascript
// Proper cleanup (important!)
writer.destroy();

// Or use in lifecycle methods
window.addEventListener('beforeunload', () => {
    writer.destroy();
});

// React useEffect cleanup
useEffect(() => {
    return () => {
        writer.destroy();
    };
}, []);
```

## 🎯 Best Practices

### 1. Performance Optimization

```javascript
// Optimize for performance
const writer = new WritingJS('#element', {
    words: ['fast', 'animations'],
    times: { writer: 30, eraser: 20, read: 800 },
    effects: {
        visual: { fadeIn: false },      // Disable heavy effects
        typing: { randomSpeed: false }   // Disable randomization
    },
    pauseOnHover: false,                // Disable hover detection
    debug: false                        // Disable debug mode
});
```

### 2. Memory Management

```javascript
class AnimationManager {
    constructor() {
        this.writers = new Map();
    }
    
    createWriter(id, element, config) {
        // Clean up existing writer
        if (this.writers.has(id)) {
            this.writers.get(id).destroy();
        }
        
        // Create new writer
        const writer = new WritingJS(element, config);
        this.writers.set(id, writer);
        
        return writer;
    }
    
    destroyWriter(id) {
        if (this.writers.has(id)) {
            this.writers.get(id).destroy();
            this.writers.delete(id);
        }
    }
    
    destroyAll() {
        this.writers.forEach(writer => writer.destroy());
        this.writers.clear();
    }
}
```

### 3. Error Handling

```javascript
try {
    const writer = new WritingJS('#element', config);
    
    writer.on('error', (error) => {
        // Log error for debugging
        console.error('Writing.js Error:', error);
        
        // Fallback behavior
        document.getElementById('element').textContent = 'Static text fallback';
    });
    
    await writer.start();
} catch (error) {
    console.error('Failed to initialize Writing.js:', error);
    // Implement fallback
}
```

### 4. Responsive Design

```javascript
// Adjust based on screen size
const isMobile = window.innerWidth < 768;

const writer = new WritingJS('#element', {
    words: ['responsive', 'design'],
    times: {
        writer: isMobile ? 150 : 100,    // Slower on mobile
        eraser: isMobile ? 100 : 50,
        read: isMobile ? 2000 : 1500
    },
    effects: {
        sound: {
            enabled: !isMobile           // No sound on mobile
        }
    }
});

// Update on resize
window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
        writer.setOptions({
            times: {
                writer: newIsMobile ? 150 : 100,
                eraser: newIsMobile ? 100 : 50,
                read: newIsMobile ? 2000 : 1500
            }
        });
    }
});
```

## 🔍 Debugging & Troubleshooting

### 1. Debug Mode

```javascript
const writer = new WritingJS('#element', {
    words: ['debug', 'mode'],
    debug: true  // Enable debug logging
});

// Monitor performance
setInterval(() => {
    const metrics = writer.getMetrics();
    if (metrics.frameDrops > 10) {
        console.warn('Performance issue detected:', metrics);
    }
}, 5000);
```

### 2. Common Issues

```javascript
// Issue: Element not found
try {
    const writer = new WritingJS('#nonexistent', config);
} catch (error) {
    console.error('Element not found:', error.message);
}

// Issue: Invalid configuration
const config = {
    words: [], // Empty words array
    times: { writer: -1 } // Invalid timing
};

try {
    const writer = new WritingJS('#element', config);
} catch (error) {
    console.error('Invalid config:', error.message);
}

// Issue: Memory leaks
// Always call destroy()
const writers = [];
function createWriters() {
    // Cleanup previous writers
    writers.forEach(w => w.destroy());
    writers.length = 0;
    
    // Create new writers
    for (let i = 0; i < 10; i++) {
        writers.push(new WritingJS(`#element${i}`, config));
    }
}
```

### 3. Browser Compatibility

```javascript
// Feature detection
function isWritingJsSupported() {
    return (
        'requestAnimationFrame' in window &&
        'IntersectionObserver' in window &&
        'Promise' in window
    );
}

if (!isWritingJsSupported()) {
    console.warn('Writing.js may not work properly in this browser');
    // Load polyfills or use fallback
}
```

## 📱 Mobile Considerations

### 1. Touch Optimization

```javascript
const writer = new WritingJS('#element', {
    words: ['mobile', 'friendly'],
    pauseOnHover: false,  // Disable hover on mobile
    effects: {
        sound: {
            enabled: false  // Avoid autoplay issues
        }
    }
});

// Detect touch device
const isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) {
    writer.setOptions({
        times: { 
            writer: 120,  // Slightly slower for readability
            read: 2000    // Longer pause
        }
    });
}
```

### 2. Reduced Motion Support

```javascript
// Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const writer = new WritingJS('#element', {
    words: ['accessible', 'animations'],
    times: {
        writer: prefersReducedMotion.matches ? 0 : 100,  // Instant if reduced motion
        eraser: prefersReducedMotion.matches ? 0 : 50,
        read: prefersReducedMotion.matches ? 500 : 1500
    }
});

// Listen for changes
prefersReducedMotion.addEventListener('change', (e) => {
    writer.setOptions({
        times: {
            writer: e.matches ? 0 : 100,
            eraser: e.matches ? 0 : 50,
            read: e.matches ? 500 : 1500
        }
    });
});
```

This implementation guide provides a comprehensive foundation for using Writing.js v2.0 in any project. The next sections will cover framework-specific integrations and advanced use cases.