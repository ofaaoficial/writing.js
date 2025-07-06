# 🔗 Writing.js v2.0 - Framework Integration Guide

Complete guide for integrating Writing.js with popular web frameworks and libraries.

## ⚛️ React Integration

### 1. React Hook (useWriting)

```typescript
import { useWriting } from 'writing.js/react';

function MyComponent() {
    const { writer, isAnimating, currentWord, progress } = useWriting(
        '#text-element',
        {
            words: ['React', 'Integration', 'Amazing'],
            times: { writer: 100, eraser: 50, read: 1500 }
        }
    );

    return (
        <div>
            <h1 id="text-element">Loading...</h1>
            <div>
                <p>Current word: {currentWord}</p>
                <p>Progress: {Math.round(progress * 100)}%</p>
                <button onClick={() => writer?.start()}>Start</button>
                <button onClick={() => writer?.pause()}>Pause</button>
                <button onClick={() => writer?.resume()}>Resume</button>
            </div>
        </div>
    );
}
```

### 2. React Component

```typescript
import { Writing } from 'writing.js/react';

function App() {
    return (
        <div>
            <Writing
                words={['Welcome', 'to', 'React', 'Integration']}
                times={{ writer: 80, eraser: 40, read: 1200 }}
                infinite={true}
                pauseOnHover={true}
                onComplete={(state) => console.log('Animation complete', state)}
                onWordStart={(word, index) => console.log('Word started', word)}
                style={{ fontSize: '2rem', color: '#007bff' }}
            />
        </div>
    );
}
```

### 3. Advanced React Hook with Effects

```typescript
import { useWritingWithEffects } from 'writing.js/react';

function AdvancedComponent() {
    const { writer, state, metrics } = useWritingWithEffects({
        element: '#advanced-text',
        words: ['TypeScript', 'React', 'Performance'],
        effect: 'typewriter',
        config: {
            times: { writer: 60, eraser: 30, read: 1000 },
            effects: {
                typing: { randomSpeed: true, speedVariation: 0.3 },
                errors: { enabled: true, frequency: 0.05 },
                sound: { enabled: true, volume: 0.3 }
            }
        }
    });

    return (
        <div>
            <h1 id="advanced-text">Loading...</h1>
            <div className="metrics">
                <p>FPS: {metrics.currentFPS.toFixed(1)}</p>
                <p>Memory: {metrics.memoryUsage.toFixed(2)}MB</p>
                <p>Progress: {Math.round(state.progress * 100)}%</p>
            </div>
        </div>
    );
}
```

### 4. React Context Provider

```typescript
import { WritingProvider, useWritingContext } from 'writing.js/react';

function App() {
    return (
        <WritingProvider defaultConfig={{ times: { writer: 80 } }}>
            <MyComponent />
        </WritingProvider>
    );
}

function MyComponent() {
    const { createWriter, destroyWriter } = useWritingContext();

    useEffect(() => {
        const writer = createWriter('main-text', '#text', {
            words: ['Context', 'Provider', 'Example']
        });
        
        return () => destroyWriter('main-text');
    }, []);

    return <h1 id="text">Loading...</h1>;
}
```

### 5. React Hooks - Custom Implementation

```typescript
import { useEffect, useRef, useState } from 'react';
import { WritingJS } from 'writing.js';

export function useWritingJs(words: string[], config = {}) {
    const elementRef = useRef<HTMLElement>(null);
    const writerRef = useRef<WritingJS | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!elementRef.current) return;

        const writer = new WritingJS(elementRef.current, {
            words,
            ...config
        });

        writer.on('start', () => setIsAnimating(true));
        writer.on('complete', () => setIsAnimating(false));
        writer.on('wordStart', (word) => setCurrentWord(word));
        writer.on('characterWrite', (char, index) => {
            const state = writer.getState();
            setProgress(state.progress);
        });

        writerRef.current = writer;

        return () => {
            writer.destroy();
            writerRef.current = null;
        };
    }, [words, config]);

    const start = () => writerRef.current?.start();
    const stop = () => writerRef.current?.stop();
    const pause = () => writerRef.current?.pause();
    const resume = () => writerRef.current?.resume();

    return {
        elementRef,
        writer: writerRef.current,
        isAnimating,
        currentWord,
        progress,
        start,
        stop,
        pause,
        resume
    };
}
```

## 🟢 Vue.js Integration

### 1. Vue 3 Composition API

```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import { WritingJS } from 'writing.js';

export function useWriting(words: string[], config = {}) {
    const elementRef = ref<HTMLElement>();
    const writer = ref<WritingJS | null>(null);
    const isAnimating = ref(false);
    const currentWord = ref('');
    const progress = ref(0);

    onMounted(() => {
        if (!elementRef.value) return;

        const instance = new WritingJS(elementRef.value, {
            words,
            ...config
        });

        instance.on('start', () => isAnimating.value = true);
        instance.on('complete', () => isAnimating.value = false);
        instance.on('wordStart', (word) => currentWord.value = word);
        instance.on('characterWrite', () => {
            const state = instance.getState();
            progress.value = state.progress;
        });

        writer.value = instance;
    });

    onUnmounted(() => {
        writer.value?.destroy();
    });

    const start = () => writer.value?.start();
    const stop = () => writer.value?.stop();
    const pause = () => writer.value?.pause();
    const resume = () => writer.value?.resume();

    return {
        elementRef,
        writer,
        isAnimating,
        currentWord,
        progress,
        start,
        stop,
        pause,
        resume
    };
}
```

### 2. Vue 3 Component

```vue
<template>
    <div>
        <h1 ref="textElement">Loading...</h1>
        <div class="controls">
            <button @click="start" :disabled="isAnimating">Start</button>
            <button @click="pause" :disabled="!isAnimating">Pause</button>
            <button @click="resume" :disabled="!isPaused">Resume</button>
            <button @click="stop">Stop</button>
        </div>
        <div class="status">
            <p>Current: {{ currentWord }}</p>
            <p>Progress: {{ Math.round(progress * 100) }}%</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWriting } from './composables/useWriting';

const props = defineProps<{
    words: string[];
    times?: { writer?: number; eraser?: number; read?: number };
    infinite?: boolean;
}>();

const {
    elementRef: textElement,
    writer,
    isAnimating,
    currentWord,
    progress,
    start,
    stop,
    pause,
    resume
} = useWriting(props.words, {
    times: props.times,
    infinite: props.infinite
});

const isPaused = computed(() => writer.value?.isPaused() || false);
</script>
```

### 3. Vue Directive

```typescript
import { WritingJS } from 'writing.js';

const vWriting = {
    mounted(el: HTMLElement, binding: any) {
        const { value, modifiers } = binding;
        const words = Array.isArray(value) ? value : [value];
        
        const config = {
            words,
            infinite: modifiers.infinite,
            pauseOnHover: modifiers.pauseOnHover,
            times: {
                writer: modifiers.slow ? 150 : modifiers.fast ? 50 : 100,
                eraser: modifiers.slow ? 100 : modifiers.fast ? 25 : 50,
                read: modifiers.slow ? 2000 : modifiers.fast ? 800 : 1500
            }
        };

        const writer = new WritingJS(el, config);
        el._writingInstance = writer;
        
        if (!modifiers.manual) {
            writer.start();
        }
    },
    
    updated(el: HTMLElement, binding: any) {
        const writer = el._writingInstance;
        if (writer) {
            const words = Array.isArray(binding.value) ? binding.value : [binding.value];
            writer.setWords(words);
        }
    },
    
    unmounted(el: HTMLElement) {
        if (el._writingInstance) {
            el._writingInstance.destroy();
            delete el._writingInstance;
        }
    }
};

// Usage in Vue app
app.directive('writing', vWriting);
```

### 4. Vue Plugin

```typescript
import { App } from 'vue';
import { WritingJS } from 'writing.js';

export default {
    install(app: App, options = {}) {
        // Global properties
        app.config.globalProperties.$writing = WritingJS;
        
        // Global component
        app.component('Writing', {
            props: {
                words: { type: Array, required: true },
                times: { type: Object, default: () => ({}) },
                infinite: { type: Boolean, default: false },
                pauseOnHover: { type: Boolean, default: true }
            },
            template: `
                <span ref="element">
                    <slot />
                </span>
            `,
            mounted() {
                this.writer = new WritingJS(this.$refs.element, {
                    words: this.words,
                    times: this.times,
                    infinite: this.infinite,
                    pauseOnHover: this.pauseOnHover
                });
                this.writer.start();
            },
            unmounted() {
                this.writer?.destroy();
            }
        });
        
        // Global directive
        app.directive('writing', vWriting);
    }
};
```

## 🅰️ Angular Integration

### 1. Angular Service

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { WritingJS } from 'writing.js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WritingService implements OnDestroy {
    private writers = new Map<string, WritingJS>();
    private animationStates = new Map<string, BehaviorSubject<any>>();

    createWriter(
        id: string,
        element: string | HTMLElement,
        config: any
    ): Observable<any> {
        // Clean up existing writer
        this.destroyWriter(id);

        const writer = new WritingJS(element, config);
        const state$ = new BehaviorSubject({
            isAnimating: false,
            currentWord: '',
            progress: 0
        });

        writer.on('start', () => {
            state$.next({ ...state$.value, isAnimating: true });
        });

        writer.on('complete', () => {
            state$.next({ ...state$.value, isAnimating: false });
        });

        writer.on('wordStart', (word) => {
            state$.next({ ...state$.value, currentWord: word });
        });

        writer.on('characterWrite', () => {
            const writerState = writer.getState();
            state$.next({ ...state$.value, progress: writerState.progress });
        });

        this.writers.set(id, writer);
        this.animationStates.set(id, state$);

        return state$.asObservable();
    }

    getWriter(id: string): WritingJS | undefined {
        return this.writers.get(id);
    }

    destroyWriter(id: string): void {
        const writer = this.writers.get(id);
        const state$ = this.animationStates.get(id);

        if (writer) {
            writer.destroy();
            this.writers.delete(id);
        }

        if (state$) {
            state$.complete();
            this.animationStates.delete(id);
        }
    }

    ngOnDestroy(): void {
        this.writers.forEach(writer => writer.destroy());
        this.animationStates.forEach(state$ => state$.complete());
        this.writers.clear();
        this.animationStates.clear();
    }
}
```

### 2. Angular Component

```typescript
import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WritingService } from './writing.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-writing',
    template: `
        <span #textElement>
            <ng-content></ng-content>
        </span>
        <div class="controls" *ngIf="showControls">
            <button (click)="start()" [disabled]="(animationState$ | async)?.isAnimating">
                Start
            </button>
            <button (click)="pause()" [disabled]="!(animationState$ | async)?.isAnimating">
                Pause
            </button>
            <button (click)="resume()">Resume</button>
            <button (click)="stop()">Stop</button>
        </div>
        <div class="status" *ngIf="showStatus">
            <p>Current: {{ (animationState$ | async)?.currentWord }}</p>
            <p>Progress: {{ ((animationState$ | async)?.progress * 100) | number:'1.0-0' }}%</p>
        </div>
    `
})
export class WritingComponent implements OnInit, OnDestroy {
    @ViewChild('textElement', { static: true }) textElement!: ElementRef;
    @Input() words: string[] = [];
    @Input() times: any = {};
    @Input() infinite: boolean = false;
    @Input() pauseOnHover: boolean = true;
    @Input() showControls: boolean = false;
    @Input() showStatus: boolean = false;

    animationState$!: Observable<any>;
    private writerId = Math.random().toString(36).substr(2, 9);

    constructor(private writingService: WritingService) {}

    ngOnInit(): void {
        this.animationState$ = this.writingService.createWriter(
            this.writerId,
            this.textElement.nativeElement,
            {
                words: this.words,
                times: this.times,
                infinite: this.infinite,
                pauseOnHover: this.pauseOnHover
            }
        );
    }

    ngOnDestroy(): void {
        this.writingService.destroyWriter(this.writerId);
    }

    start(): void {
        this.writingService.getWriter(this.writerId)?.start();
    }

    pause(): void {
        this.writingService.getWriter(this.writerId)?.pause();
    }

    resume(): void {
        this.writingService.getWriter(this.writerId)?.resume();
    }

    stop(): void {
        this.writingService.getWriter(this.writerId)?.stop();
    }
}
```

### 3. Angular Directive

```typescript
import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { WritingJS } from 'writing.js';

@Directive({
    selector: '[appWriting]'
})
export class WritingDirective implements OnInit, OnDestroy {
    @Input() appWriting: string[] = [];
    @Input() writingTimes: any = {};
    @Input() writingInfinite: boolean = false;
    @Input() writingPauseOnHover: boolean = true;
    @Input() writingAutoStart: boolean = true;

    private writer: WritingJS | null = null;

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.writer = new WritingJS(this.elementRef.nativeElement, {
            words: this.appWriting,
            times: this.writingTimes,
            infinite: this.writingInfinite,
            pauseOnHover: this.writingPauseOnHover
        });

        if (this.writingAutoStart) {
            this.writer.start();
        }
    }

    ngOnDestroy(): void {
        this.writer?.destroy();
    }
}
```

## 🔥 Svelte Integration

### 1. Svelte Store

```typescript
import { writable, derived } from 'svelte/store';
import { WritingJS } from 'writing.js';

function createWritingStore() {
    const writers = new Map<string, WritingJS>();
    const states = new Map<string, any>();
    
    const store = writable(new Map());

    function createWriter(id: string, element: HTMLElement, config: any) {
        const writer = new WritingJS(element, config);
        const state = {
            isAnimating: false,
            currentWord: '',
            progress: 0
        };

        writer.on('start', () => {
            state.isAnimating = true;
            updateStore();
        });

        writer.on('complete', () => {
            state.isAnimating = false;
            updateStore();
        });

        writer.on('wordStart', (word) => {
            state.currentWord = word;
            updateStore();
        });

        writer.on('characterWrite', () => {
            const writerState = writer.getState();
            state.progress = writerState.progress;
            updateStore();
        });

        writers.set(id, writer);
        states.set(id, state);
        updateStore();

        return writer;
    }

    function updateStore() {
        store.set(new Map(states));
    }

    function destroyWriter(id: string) {
        const writer = writers.get(id);
        if (writer) {
            writer.destroy();
            writers.delete(id);
            states.delete(id);
            updateStore();
        }
    }

    return {
        subscribe: store.subscribe,
        createWriter,
        destroyWriter,
        getWriter: (id: string) => writers.get(id)
    };
}

export const writingStore = createWritingStore();
```

### 2. Svelte Component

```svelte
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { WritingJS } from 'writing.js';

    export let words: string[] = [];
    export let times: any = {};
    export let infinite: boolean = false;
    export let pauseOnHover: boolean = true;
    export let showControls: boolean = false;

    let textElement: HTMLElement;
    let writer: WritingJS | null = null;
    let isAnimating = false;
    let currentWord = '';
    let progress = 0;

    onMount(() => {
        writer = new WritingJS(textElement, {
            words,
            times,
            infinite,
            pauseOnHover
        });

        writer.on('start', () => isAnimating = true);
        writer.on('complete', () => isAnimating = false);
        writer.on('wordStart', (word) => currentWord = word);
        writer.on('characterWrite', () => {
            const state = writer.getState();
            progress = state.progress;
        });
    });

    onDestroy(() => {
        writer?.destroy();
    });

    function start() {
        writer?.start();
    }

    function pause() {
        writer?.pause();
    }

    function resume() {
        writer?.resume();
    }

    function stop() {
        writer?.stop();
    }
</script>

<span bind:this={textElement}>
    <slot />
</span>

{#if showControls}
    <div class="controls">
        <button on:click={start} disabled={isAnimating}>Start</button>
        <button on:click={pause} disabled={!isAnimating}>Pause</button>
        <button on:click={resume}>Resume</button>
        <button on:click={stop}>Stop</button>
    </div>
{/if}

<div class="status">
    <p>Current: {currentWord}</p>
    <p>Progress: {Math.round(progress * 100)}%</p>
</div>
```

### 3. Svelte Action

```typescript
import { WritingJS } from 'writing.js';

export function writing(node: HTMLElement, config: any) {
    let writer: WritingJS | null = null;

    function createWriter() {
        writer = new WritingJS(node, config);
        writer.start();
    }

    function updateWriter(newConfig: any) {
        if (writer) {
            writer.setOptions(newConfig);
        }
    }

    function destroyWriter() {
        if (writer) {
            writer.destroy();
            writer = null;
        }
    }

    createWriter();

    return {
        update: updateWriter,
        destroy: destroyWriter
    };
}
```

## 🟦 Next.js Integration

### 1. Next.js Component with SSR

```typescript
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const WritingJS = dynamic(() => import('writing.js').then(mod => mod.WritingJS), {
    ssr: false
});

interface WritingComponentProps {
    words: string[];
    times?: { writer?: number; eraser?: number; read?: number };
    infinite?: boolean;
}

export default function WritingComponent({ words, times, infinite }: WritingComponentProps) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const writerRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);
    const [currentWord, setCurrentWord] = useState('');

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !elementRef.current) return;

        import('writing.js').then(({ WritingJS }) => {
            const writer = new WritingJS(elementRef.current!, {
                words,
                times,
                infinite
            });

            writer.on('wordStart', (word) => setCurrentWord(word));
            writer.start();

            writerRef.current = writer;

            return () => {
                writer.destroy();
            };
        });
    }, [isClient, words, times, infinite]);

    if (!isClient) {
        return <span ref={elementRef}>Loading...</span>;
    }

    return <span ref={elementRef}>Loading...</span>;
}
```

### 2. Next.js API Route

```typescript
// pages/api/writing-config.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const defaultConfig = {
            words: ['Next.js', 'React', 'TypeScript'],
            times: { writer: 100, eraser: 50, read: 1500 },
            infinite: true,
            effects: {
                typing: { randomSpeed: true },
                visual: { fadeIn: true }
            }
        };

        res.status(200).json(defaultConfig);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
```

## 🔶 Nuxt.js Integration

### 1. Nuxt.js Plugin

```typescript
// plugins/writing.client.ts
import { WritingJS } from 'writing.js';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            writing: WritingJS
        }
    };
});
```

### 2. Nuxt.js Composable

```typescript
// composables/useWriting.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useWriting(words: string[], config = {}) {
    const elementRef = ref<HTMLElement>();
    const writer = ref<any>(null);
    const isAnimating = ref(false);
    const currentWord = ref('');

    onMounted(async () => {
        if (!elementRef.value) return;

        const { WritingJS } = await import('writing.js');
        const instance = new WritingJS(elementRef.value, {
            words,
            ...config
        });

        instance.on('start', () => isAnimating.value = true);
        instance.on('complete', () => isAnimating.value = false);
        instance.on('wordStart', (word) => currentWord.value = word);

        writer.value = instance;
    });

    onUnmounted(() => {
        writer.value?.destroy();
    });

    return {
        elementRef,
        writer,
        isAnimating,
        currentWord
    };
}
```

## 🔥 SvelteKit Integration

### 1. SvelteKit Store

```typescript
// lib/stores/writing.ts
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const writingStore = writable(new Map());

export async function createWriter(id: string, element: HTMLElement, config: any) {
    if (!browser) return;

    const { WritingJS } = await import('writing.js');
    const writer = new WritingJS(element, config);
    
    writingStore.update(store => {
        store.set(id, writer);
        return store;
    });

    return writer;
}
```

### 2. SvelteKit Component

```svelte
<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { createWriter } from '$lib/stores/writing';

    export let words: string[] = [];
    export let config: any = {};

    let textElement: HTMLElement;
    let writer: any = null;

    onMount(async () => {
        if (!browser) return;

        writer = await createWriter('main', textElement, {
            words,
            ...config
        });

        writer.start();

        return () => {
            writer?.destroy();
        };
    });
</script>

<span bind:this={textElement}>
    <slot />
</span>
```

## 🏗️ Build Integration

### 1. Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
    resolve: {
        alias: {
            'writing.js': path.resolve(__dirname, 'node_modules/writing.js/dist/writing.esm.js')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                writing: {
                    test: /[\\/]node_modules[\\/]writing\.js[\\/]/,
                    name: 'writing',
                    chunks: 'all'
                }
            }
        }
    }
};
```

### 2. Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            external: ['writing.js'],
            output: {
                globals: {
                    'writing.js': 'WritingJS'
                }
            }
        }
    },
    optimizeDeps: {
        include: ['writing.js']
    }
});
```

### 3. Rollup Configuration

```javascript
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        commonjs()
    ],
    external: ['writing.js']
};
```

This integration guide provides comprehensive examples for using Writing.js v2.0 with popular frameworks and build tools. Choose the integration method that best fits your project structure and requirements.