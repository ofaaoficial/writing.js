# 📖 Writing.js v2.0 - API Reference

Complete API documentation for all classes, methods, and interfaces in Writing.js v2.0.

## 🏗️ Core Classes

### WritingJS

The main class for creating text animations.

#### Constructor

```typescript
new WritingJS(element: string | HTMLElement, config: WritingConfig)
```

**Parameters:**
- `element`: CSS selector string or HTMLElement
- `config`: Configuration object (see [WritingConfig](#writingconfig))

**Example:**
```javascript
const writer = new WritingJS('#text-element', {
    words: ['Hello', 'World'],
    times: { writer: 100, eraser: 50, read: 1500 }
});
```

#### Methods

##### Animation Control

```typescript
start(): Promise<void>
```
Starts the animation. Returns a Promise that resolves when animation begins.

```typescript
stop(): void
```
Stops the animation and resets to initial state.

```typescript
pause(): void
```
Pauses the animation at current position.

```typescript
resume(): void
```
Resumes paused animation.

```typescript
restart(): void
```
Stops and starts the animation from beginning.

```typescript
destroy(): void
```
Completely destroys the instance and cleans up resources.

##### Configuration

```typescript
setWords(words: string[]): void
```
Updates the words array.

```typescript
setSpeed(speed: number): void
```
Updates the typing speed (ms between characters).

```typescript
setOptions(options: Partial<WritingConfig>): void
```
Updates any configuration options.

```typescript
getConfig(): WritingConfig
```
Returns current configuration.

##### State Management

```typescript
getState(): WritingState
```
Returns current animation state.

```typescript
getCurrentWord(): string
```
Returns currently displayed word.

```typescript
getProgress(): number
```
Returns animation progress (0-1).

```typescript
isAnimating(): boolean
```
Returns whether animation is currently running.

```typescript
isPaused(): boolean
```
Returns whether animation is paused.

##### Performance

```typescript
getMetrics(): PerformanceMetrics
```
Returns performance metrics.

```typescript
enableDebug(): void
```
Enables debug mode with console logging.

```typescript
disableDebug(): void
```
Disables debug mode.

##### Events

```typescript
on(event: string, callback: Function): void
```
Adds event listener.

```typescript
off(event: string, callback: Function): void
```
Removes event listener.

```typescript
once(event: string, callback: Function): void
```
Adds one-time event listener.

```typescript
emit(event: string, ...args: any[]): void
```
Emits event with arguments.

## 🎨 Effect Classes

### TypeWriter

Advanced typewriter effect with error simulation.

#### Constructor

```typescript
new TypeWriter(element: string | HTMLElement, config: TypeWriterConfig)
```

#### Additional Methods

```typescript
enableErrors(): void
```
Enables typing error simulation.

```typescript
disableErrors(): void
```
Disables typing error simulation.

```typescript
setErrorFrequency(frequency: number): void
```
Sets error frequency (0-1).

```typescript
setTypingSpeed(speed: number, variation?: number): void
```
Sets typing speed with optional variation.

### FadeWriter

Fade-in/out text animation effect.

#### Constructor

```typescript
new FadeWriter(element: string | HTMLElement, config: FadeWriterConfig)
```

#### Additional Methods

```typescript
setFadeDirection(direction: 'up' | 'down' | 'left' | 'right'): void
```
Sets fade animation direction.

```typescript
setFadeDuration(duration: number): void
```
Sets fade animation duration in ms.

```typescript
setOpacity(opacity: number): void
```
Sets target opacity (0-1).

### GlitchWriter

Cyberpunk-style glitch effect.

#### Constructor

```typescript
new GlitchWriter(element: string | HTMLElement, config: GlitchWriterConfig)
```

#### Additional Methods

```typescript
setGlitchIntensity(intensity: number): void
```
Sets glitch intensity (0-1).

```typescript
setGlitchColors(colors: string[]): void
```
Sets glitch color palette.

```typescript
enableShake(): void
```
Enables shake animation.

```typescript
disableShake(): void
```
Disables shake animation.

## 🔄 Sequence Classes

### WritingSequence

Manages sequences of multiple animations.

#### Constructor

```typescript
new WritingSequence()
```

#### Methods

```typescript
add(element: string | HTMLElement, words: string[], config?: WritingConfig): WritingSequence
```
Adds animation to sequence.

```typescript
wait(duration: number): WritingSequence
```
Adds wait/delay to sequence.

```typescript
callback(fn: Function): WritingSequence
```
Adds callback to sequence.

```typescript
clearElement(element: string | HTMLElement): WritingSequence
```
Adds element clearing to sequence.

```typescript
run(): Promise<void>
```
Executes the sequence.

```typescript
pause(): void
```
Pauses sequence execution.

```typescript
resume(): void
```
Resumes sequence execution.

```typescript
stop(): void
```
Stops and resets sequence.

## 🎮 Playground Classes

### WritingPlayground

Interactive playground for testing configurations.

#### Constructor

```typescript
new WritingPlayground(config: PlaygroundConfig)
```

#### Methods

```typescript
addPreset(preset: WritingPreset): void
```
Adds custom preset.

```typescript
removePreset(name: string): void
```
Removes preset by name.

```typescript
exportConfig(): string
```
Exports current configuration as JSON.

```typescript
importConfig(json: string): void
```
Imports configuration from JSON.

```typescript
show(): void
```
Shows playground interface.

```typescript
hide(): void
```
Hides playground interface.

## 📊 Configuration Interfaces

### WritingConfig

Main configuration interface for all animations.

```typescript
interface WritingConfig {
    // Required
    words: string[];
    
    // Timing
    times?: {
        writer?: number;    // Character typing speed (ms)
        eraser?: number;    // Character erasing speed (ms)
        read?: number;      // Pause before erasing (ms)
    };
    
    // Behavior
    infinite?: boolean;         // Loop animation
    pauseOnHover?: boolean;     // Pause on hover
    cursor?: CursorConfig;      // Cursor configuration
    
    // Visual
    styles?: string[];          // CSS styles array
    effects?: EffectsConfig;    // Visual effects
    
    // Performance
    debug?: boolean;            // Debug mode
    optimize?: boolean;         // Performance optimizations
    
    // Events
    callbacks?: CallbackConfig; // Event callbacks
}
```

### CursorConfig

Cursor appearance and behavior configuration.

```typescript
interface CursorConfig {
    character?: string;         // Cursor character (default: '|')
    blink?: boolean;           // Enable blinking
    blinkSpeed?: number;       // Blink speed (ms)
    styles?: string[];         // CSS styles for cursor
    hideOnComplete?: boolean;  // Hide cursor when animation completes
}
```

### EffectsConfig

Visual and audio effects configuration.

```typescript
interface EffectsConfig {
    // Typing effects
    typing?: {
        randomSpeed?: boolean;      // Vary typing speed
        speedVariation?: number;    // Speed variation (0-1)
        pauseOnPunctuation?: boolean; // Pause on punctuation
        punctuationDelay?: number;  // Punctuation pause (ms)
    };
    
    // Error simulation
    errors?: {
        enabled?: boolean;          // Enable errors
        frequency?: number;         // Error frequency (0-1)
        correctionDelay?: number;   // Correction delay (ms)
        maxErrors?: number;         // Max errors per word
    };
    
    // Visual effects
    visual?: {
        fadeIn?: boolean;           // Fade in effect
        fadeOut?: boolean;          // Fade out effect
        glitch?: boolean;           // Glitch effect
        shake?: boolean;            // Shake effect
        typewriter?: boolean;       // Classic typewriter
    };
    
    // Sound effects
    sound?: {
        enabled?: boolean;          // Enable sound
        keySound?: string;          // Key press sound URL
        deleteSound?: string;       // Delete sound URL
        volume?: number;            // Volume (0-1)
        randomPitch?: boolean;      // Random pitch variation
    };
}
```

### CallbackConfig

Event callback configuration.

```typescript
interface CallbackConfig {
    onStart?: (state: WritingState) => void;
    onComplete?: (state: WritingState) => void;
    onPause?: (state: WritingState) => void;
    onResume?: (state: WritingState) => void;
    onWordStart?: (word: string, index: number) => void;
    onWordComplete?: (word: string, index: number) => void;
    onCharacterWrite?: (char: string, index: number) => void;
    onCharacterErase?: (char: string, index: number) => void;
    onError?: (error: Error) => void;
}
```

## 📈 State Interfaces

### WritingState

Current animation state information.

```typescript
interface WritingState {
    isRunning: boolean;         // Animation running
    isPaused: boolean;          // Animation paused
    isComplete: boolean;        // Animation complete
    currentWordIndex: number;   // Current word index
    currentCharIndex: number;   // Current character index
    progress: number;           // Overall progress (0-1)
    elapsedTime: number;        // Elapsed time (ms)
    totalWords: number;         // Total words count
    loopCount: number;          // Current loop iteration
    lastUpdateTime: number;     // Last update timestamp
}
```

### PerformanceMetrics

Performance monitoring data.

```typescript
interface PerformanceMetrics {
    averageFPS: number;         // Average frames per second
    currentFPS: number;         // Current FPS
    frameDrops: number;         // Dropped frames count
    memoryUsage: number;        // Memory usage (MB)
    cpuUsage: number;           // CPU usage estimate (%)
    animationTime: number;      // Total animation time (ms)
    renderTime: number;         // Average render time (ms)
    startTime: number;          // Animation start timestamp
    updateCount: number;        // Total updates count
}
```

## 🎯 Event Types

### Event Names

```typescript
type WritingEventName = 
    | 'start'           // Animation started
    | 'stop'            // Animation stopped
    | 'pause'           // Animation paused
    | 'resume'          // Animation resumed
    | 'complete'        // Animation completed
    | 'loop'            // Loop iteration completed
    | 'wordStart'       // Word started
    | 'wordComplete'    // Word completed
    | 'characterWrite'  // Character written
    | 'characterErase'  // Character erased
    | 'error'           // Error occurred
    | 'performanceAlert' // Performance issue
    | 'configChange'    // Configuration changed
    | 'destroy';        // Instance destroyed
```

### Event Data

```typescript
interface WritingEventData {
    state: WritingState;
    timestamp: number;
    target: WritingJS;
    type: WritingEventName;
    data?: any;
}
```

## 🔧 Utility Functions

### Validation

```typescript
function validateConfig(config: WritingConfig): boolean
```
Validates configuration object.

```typescript
function validateElement(element: string | HTMLElement): HTMLElement
```
Validates and returns HTMLElement.

```typescript
function validateWords(words: string[]): boolean
```
Validates words array.

### Performance

```typescript
function measurePerformance(fn: Function): PerformanceMetrics
```
Measures function performance.

```typescript
function optimizeConfig(config: WritingConfig): WritingConfig
```
Optimizes configuration for performance.

```typescript
function getDeviceCapabilities(): DeviceCapabilities
```
Returns device performance capabilities.

### DOM Utilities

```typescript
function createElement(tag: string, attributes?: object): HTMLElement
```
Creates HTML element with attributes.

```typescript
function applyStyles(element: HTMLElement, styles: string[]): void
```
Applies CSS styles to element.

```typescript
function getElementMetrics(element: HTMLElement): ElementMetrics
```
Returns element size and position metrics.

## 🎨 Style Utilities

### CSS Classes

Writing.js automatically adds these CSS classes:

```css
.writing-js-container {
    /* Applied to container element */
}

.writing-js-text {
    /* Applied to text content */
}

.writing-js-cursor {
    /* Applied to cursor element */
}

.writing-js-cursor-blink {
    /* Applied when cursor is blinking */
}

.writing-js-error {
    /* Applied during error simulation */
}

.writing-js-glitch {
    /* Applied during glitch effect */
}

.writing-js-fade {
    /* Applied during fade effect */
}

.writing-js-shake {
    /* Applied during shake effect */
}

.writing-js-paused {
    /* Applied when animation is paused */
}

.writing-js-complete {
    /* Applied when animation is complete */
}
```

### CSS Variables

Customize appearance using CSS variables:

```css
:root {
    --writing-cursor-color: #333;
    --writing-cursor-width: 2px;
    --writing-text-color: inherit;
    --writing-error-color: #ff0000;
    --writing-glitch-color-1: #ff0000;
    --writing-glitch-color-2: #00ff00;
    --writing-glitch-color-3: #0000ff;
    --writing-fade-duration: 0.3s;
    --writing-shake-intensity: 2px;
}
```

## 🚀 Performance Constants

### Default Values

```typescript
const DEFAULT_CONFIG: WritingConfig = {
    words: [],
    times: {
        writer: 100,
        eraser: 50,
        read: 1500
    },
    infinite: false,
    pauseOnHover: true,
    cursor: {
        character: '|',
        blink: true,
        blinkSpeed: 800,
        hideOnComplete: false
    },
    effects: {
        typing: {
            randomSpeed: false,
            speedVariation: 0.2,
            pauseOnPunctuation: false,
            punctuationDelay: 300
        },
        errors: {
            enabled: false,
            frequency: 0.05,
            correctionDelay: 800,
            maxErrors: 3
        },
        visual: {
            fadeIn: false,
            fadeOut: false,
            glitch: false,
            shake: false,
            typewriter: true
        },
        sound: {
            enabled: false,
            volume: 0.5,
            randomPitch: false
        }
    },
    debug: false,
    optimize: true
};
```

### Performance Limits

```typescript
const PERFORMANCE_LIMITS = {
    MAX_WORDS: 1000,
    MAX_WORD_LENGTH: 500,
    MIN_SPEED: 10,
    MAX_SPEED: 2000,
    MAX_INSTANCES: 50,
    MEMORY_LIMIT: 100, // MB
    FPS_THRESHOLD: 30,
    FRAME_DROP_THRESHOLD: 10
};
```

## 🔍 Error Handling

### Error Types

```typescript
class WritingError extends Error {
    constructor(message: string, code: string) {
        super(message);
        this.name = 'WritingError';
        this.code = code;
    }
}

class ValidationError extends WritingError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
    }
}

class PerformanceError extends WritingError {
    constructor(message: string) {
        super(message, 'PERFORMANCE_ERROR');
    }
}

class ConfigurationError extends WritingError {
    constructor(message: string) {
        super(message, 'CONFIGURATION_ERROR');
    }
}
```

### Error Codes

```typescript
const ERROR_CODES = {
    ELEMENT_NOT_FOUND: 'Element not found',
    INVALID_CONFIG: 'Invalid configuration',
    EMPTY_WORDS: 'Words array is empty',
    INVALID_TIMING: 'Invalid timing configuration',
    MEMORY_LIMIT: 'Memory limit exceeded',
    PERFORMANCE_ISSUE: 'Performance issue detected',
    SOUND_LOAD_FAILED: 'Sound file failed to load',
    BROWSER_NOT_SUPPORTED: 'Browser not supported'
};
```

## 📱 Browser Compatibility

### Required APIs

```typescript
const REQUIRED_APIS = [
    'requestAnimationFrame',
    'IntersectionObserver',
    'WeakMap',
    'Promise',
    'addEventListener'
];
```

### Optional APIs

```typescript
const OPTIONAL_APIS = [
    'AudioContext',         // For sound effects
    'matchMedia',          // For responsive features
    'ResizeObserver',      // For automatic resizing
    'MutationObserver'     // For DOM change detection
];
```

### Polyfills

```typescript
// Load polyfills for older browsers
function loadPolyfills(): Promise<void> {
    const promises = [];
    
    if (!window.requestAnimationFrame) {
        promises.push(import('raf-polyfill'));
    }
    
    if (!window.IntersectionObserver) {
        promises.push(import('intersection-observer'));
    }
    
    return Promise.all(promises);
}
```

This API reference provides complete documentation for all public interfaces and methods in Writing.js v2.0. Use this as a reference when implementing the library in your projects.