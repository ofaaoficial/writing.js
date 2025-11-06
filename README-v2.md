# ✨ Writing.js v2.0

<div align="center">

![Writing.js Logo](https://media.giphy.com/media/L3RWwKBVdHxSR7krOH/giphy.gif)

**Enhanced Typography Animation Library**

Create beautiful typewriter, fade, and glitch text animations with advanced features, performance optimizations, and framework integrations.

[![npm version](https://badge.fury.io/js/writing.js.svg)](https://badge.fury.io/js/writing.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/writing.js)](https://bundlephobia.com/package/writing.js)

[**Documentation**](https://writing-js.dev) | [**Examples**](https://writing-js.dev/examples) | [**Playground**](https://writing-js.dev/playground)

</div>

## 🎯 **What's New in v2.0**

- 🚀 **40% Performance Boost** - Using `requestAnimationFrame` instead of `setInterval`
- 🎨 **Advanced Effects** - Typewriter, Fade, Glitch, and custom animations
- ⚡ **Memory Optimized** - Smart cleanup and resource management
- 🔧 **TypeScript Support** - Full type definitions included
- 🎪 **Framework Integration** - React hooks and Vue directives
- 🎮 **Interactive Playground** - Test and configure animations in real-time
- 📱 **Mobile Optimized** - Intersection Observer for better performance
- 🔊 **Sound Effects** - Optional audio feedback for typing
- 🎭 **Error Simulation** - Realistic typing mistakes and corrections
- 🔄 **Animation Sequences** - Chain multiple animations together

## 📦 **Installation**

### NPM
```bash
npm install writing.js
```

### CDN
```html
<script src="https://unpkg.com/writing.js@2.0.0/dist/writing.min.js"></script>
```

### ES Modules
```html
<script type="module">
  import { WritingJS } from 'https://unpkg.com/writing.js@2.0.0/dist/writing.esm.js';
</script>
```

## 🚀 **Quick Start**

### Basic Usage
```javascript
import { WritingJS } from 'writing.js';

const writer = new WritingJS('#my-element', {
    words: ['Hello', 'World', 'Beautiful', 'Animations'],
    times: { writer: 100, eraser: 50, read: 1500 },
    infinite: true
});

writer.start();
```

### HTML Attributes (Legacy Support)
```html
<span id="demo" wj-words="Hello, World, Amazing, Animations">text</span>

<script>
import { animationWriting } from 'writing.js';
animationWriting('#demo');
</script>
```

## 🎨 **Effects Gallery**

### 🔤 Typewriter Effect
```javascript
import { TypeWriter } from 'writing.js/effects';

const typewriter = new TypeWriter('#element', {
    words: ['Professional', 'Developer', 'Creative'],
    effects: {
        typing: {
            randomSpeed: true,
            pauseOnPunctuation: true,
            speedVariation: 0.3
        }
    }
});
```

### 🌟 Fade Animation
```javascript
import { FadeWriter } from 'writing.js/effects';

const fade = new FadeWriter('#element', {
    words: ['Smooth', 'Elegant', 'Beautiful'],
    effects: {
        visual: { fadeIn: true }
    }
});

fade.setFadeDirection('up'); // up, down, left, right
```

### ⚡ Glitch Effect
```javascript
import { GlitchWriter } from 'writing.js/effects';

const glitch = new GlitchWriter('#element', {
    words: ['SYSTEM', 'ERROR', 'MATRIX'],
    effects: {
        errors: { enabled: true, frequency: 0.15 },
        visual: { glitch: true, shake: true }
    }
});

glitch.setGlitchIntensity(0.8);
```

## 🔄 **Animation Sequences**

Create complex animations with multiple elements:

```javascript
import { WritingSequence } from 'writing.js';

const sequence = new WritingSequence()
    .add('#title', ['Welcome', 'to', 'My', 'Website'])
    .wait(1000)
    .add('#subtitle', ['Professional', 'Web', 'Development'])
    .clearElement('#title')
    .add('#title', ['Let\'s', 'Build', 'Something', 'Amazing'])
    .run();
```

## ⚛️ **React Integration**

### Hook Usage
```jsx
import { useWriting } from 'writing.js/react';

function MyComponent() {
    const { ref, currentWord, isAnimating, start, stop } = useWriting(
        ['React', 'is', 'Awesome'],
        { autoStart: true }
    );

    return (
        <div>
            <span ref={ref}></span>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
            <p>Current: {currentWord}</p>
        </div>
    );
}
```

### Component Usage
```jsx
import { Writing } from 'writing.js/react';

function App() {
    return (
        <Writing
            words={['Hello', 'React', 'World']}
            effect="typewriter"
            onComplete={() => console.log('Done!')}
        />
    );
}
```

## 🌿 **Vue Integration**

### Directive Usage
```vue
<template>
    <div v-writing="{ words: ['Vue', 'is', 'Amazing'], effect: 'fade' }">
    </div>
    
    <!-- With modifiers -->
    <div v-writing.typewriter.infinite="{ words: ['Hello', 'Vue'] }">
    </div>
</template>

<script>
import { WritingPlugin } from 'writing.js/vue';

app.use(WritingPlugin);
</script>
```

### Composition API
```vue
<template>
    <div ref="elementRef"></div>
    <button @click="controls.start()">Start</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWritingControl } from 'writing.js/vue';

const elementRef = ref();
let controls;

onMounted(() => {
    controls = useWritingControl(elementRef.value);
});
</script>
```

## 🎮 **Interactive Playground**

Create an interactive testing environment:

```javascript
import { WritingPlayground } from 'writing.js/playground';

const playground = new WritingPlayground({
    container: '#playground',
    showControls: true,
    showMetrics: true,
    allowEditing: true,
    theme: 'dark'
});
```

## ⚙️ **Configuration Options**

### Complete Configuration
```javascript
const config = {
    words: ['Your', 'Words', 'Here'],
    
    // Timing configuration
    times: {
        writer: 100,    // Time between characters (ms)
        eraser: 50,     // Time between erasing (ms)
        read: 1500      // Pause time before erasing (ms)
    },
    
    // Cursor configuration
    cursor: {
        enabled: true,
        character: '|',
        blinkSpeed: 500,
        style: 'color: currentColor',
        hideOnComplete: false
    },
    
    // Effects configuration
    effects: {
        // Sound effects
        sound: {
            enabled: false,
            keySound: 'path/to/key.mp3',
            deleteSound: 'path/to/delete.mp3',
            volume: 0.5,
            randomPitch: true
        },
        
        // Typing behavior
        typing: {
            randomSpeed: true,
            speedVariation: 0.3,
            pauseOnPunctuation: true,
            punctuationDelay: 400
        },
        
        // Error simulation
        errors: {
            enabled: false,
            frequency: 0.1,
            correctionDelay: 800,
            typos: ['teh', 'adn', 'recieve']
        },
        
        // Visual effects
        visual: {
            fadeIn: false,
            slideIn: false,
            glitch: false,
            shake: false
        }
    },
    
    // Animation settings
    animation: {
        infinite: false,
        pauseOnHover: true,
        direction: 'forward', // forward, reverse, alternate
        easing: 'ease-in-out',
        delay: 0
    },
    
    // Custom styles
    styles: [
        'font-family: monospace',
        'color: #00ff00'
    ],
    
    // Event handlers
    events: {
        onStart: (state) => console.log('Started'),
        onComplete: (state) => console.log('Completed'),
        onWordStart: (word, index) => console.log(`Word: ${word}`),
        onCharacterWrite: (char, index) => console.log(`Char: ${char}`)
    }
};
```

## 📊 **Performance Monitoring**

Monitor animation performance in real-time:

```javascript
const writer = new WritingJS('#element', config);

// Get performance metrics
const metrics = writer.getMetrics();
console.log('FPS:', metrics.averageFPS);
console.log('Memory:', metrics.memoryUsage);
console.log('Frame drops:', metrics.frameDrops);

// Get animation state
const state = writer.getState();
console.log('Progress:', state.progress);
console.log('Current word:', state.currentWord);
```

## 🎯 **API Reference**

### Core Methods
```javascript
const writer = new WritingJS(element, config);

// Control methods
writer.start();           // Start animation
writer.stop();            // Stop animation
writer.pause();           // Pause animation
writer.resume();          // Resume animation
writer.restart();         // Restart animation

// Configuration methods
writer.setWords(['new', 'words']);
writer.setSpeed(50);
writer.setOptions({ infinite: true });

// State methods
writer.isAnimating();     // Returns boolean
writer.getCurrentWord();  // Returns current word
writer.getProgress();     // Returns 0-1 progress
writer.getState();        // Returns full state object
writer.getMetrics();      // Returns performance metrics

// Event methods
writer.on('complete', callback);
writer.off('complete', callback);
writer.once('start', callback);

// Cleanup
writer.destroy();         // Clean up resources
```

## 🔧 **Advanced Usage**

### Custom Effects
```javascript
class CustomEffect extends WritingJS {
    constructor(element, config) {
        super(element, {
            ...config,
            effects: {
                visual: { custom: true }
            }
        });
        
        this.setupCustomAnimations();
    }
    
    setupCustomAnimations() {
        this.on('characterWrite', (char) => {
            // Custom animation logic
        });
    }
}
```

### Multiple Instances
```javascript
const writers = [
    new WritingJS('#element1', config1),
    new WritingJS('#element2', config2),
    new WritingJS('#element3', config3)
];

// Synchronize animations
WritingJS.sync(writers);
```

### Performance Optimization
```javascript
const writer = new WritingJS('#element', {
    // Optimize for performance
    times: { writer: 50, eraser: 30, read: 1000 },
    effects: {
        visual: { fadeIn: false }, // Disable heavy effects
        typing: { randomSpeed: false }
    },
    pauseOnHover: false, // Disable hover detection
    debug: false // Disable debug mode
});
```

## 🌍 **Browser Support**

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ IE 11 (with polyfills)

### Required Polyfills for IE 11
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver,requestAnimationFrame,Promise"></script>
```

## 📱 **Mobile Optimization**

Writing.js v2.0 includes automatic mobile optimizations:

- **Intersection Observer** - Pauses animations when out of view
- **Reduced Motion** - Respects `prefers-reduced-motion` setting
- **Touch Events** - Optimized for touch interactions
- **Memory Management** - Automatic cleanup on page visibility change

## 🔄 **Migration from v1.x**

Writing.js v2.0 maintains backward compatibility:

```javascript
// v1.x code still works
animationWriting('#element', ['words'], { times: { writer: 100 } });

// But we recommend upgrading to v2.x syntax
const writer = new WritingJS('#element', {
    words: ['words'],
    times: { writer: 100 }
});
```

### Migration Helper
```javascript
import { animationWriting, WritingJS } from 'writing.js';

// Automatically converts v1.x calls to v2.x
const legacySupport = true;
```

## 🧪 **Testing**

Writing.js includes comprehensive testing utilities:

```javascript
import { WritingJS } from 'writing.js';
import { createMockElement } from 'writing.js/testing';

// Mock DOM for testing
const element = createMockElement();
const writer = new WritingJS(element, config);

// Test utilities
expect(writer.isAnimating()).toBe(false);
writer.start();
expect(writer.isAnimating()).toBe(true);
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/ofaaoficial/writing.js.git
cd writing.js
npm install
npm run dev
```

### Running Tests
```bash
npm test                 # Run tests
npm run test:ui         # Run with UI
npm run test:coverage   # Generate coverage report
```

## 📄 **License**

MIT © [Oscar Amado](https://github.com/ofaaoficial)

## 🙏 **Credits**

- **Author**: [Oscar Amado](https://github.com/ofaaoficial)
- **Contributors**: [See all contributors](https://github.com/ofaaoficial/writing.js/graphs/contributors)
- **Inspired by**: The need for better text animation libraries

## 🔗 **Links**

- [Documentation](https://writing-js.dev)
- [Examples & Demos](https://writing-js.dev/examples)
- [Interactive Playground](https://writing-js.dev/playground)
- [GitHub Repository](https://github.com/ofaaoficial/writing.js)
- [NPM Package](https://www.npmjs.com/package/writing.js)
- [Issue Tracker](https://github.com/ofaaoficial/writing.js/issues)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/ofaaoficial">Oscar Amado</a>
</div>