// Type definitions for Writing.js v2.0.0

export interface WritingOptions {
    times: {
        writer: number;
        eraser: number;
        read: number;
    };
    cursor: CursorOptions;
    effects: WritingEffects;
    animation: AnimationOptions;
    styles?: string[];
    infinite?: boolean;
    pauseOnHover?: boolean;
    debug?: boolean;
}

export interface CursorOptions {
    enabled: boolean;
    character: string;
    blinkSpeed: number;
    style: string;
    hideOnComplete?: boolean;
}

export interface SoundOptions {
    enabled: boolean;
    keySound?: string;
    deleteSound?: string;
    volume: number;
    randomPitch?: boolean;
}

export interface WritingEffects {
    sound: SoundOptions;
    typing: {
        randomSpeed: boolean;
        speedVariation: number;
        pauseOnPunctuation: boolean;
        punctuationDelay: number;
    };
    errors: {
        enabled: boolean;
        frequency: number;
        correctionDelay: number;
        typos?: string[];
    };
    visual: {
        fadeIn: boolean;
        slideIn: boolean;
        glitch: boolean;
        shake: boolean;
    };
}

export interface AnimationOptions {
    infinite: boolean;
    pauseOnHover: boolean;
    direction: 'forward' | 'reverse' | 'alternate';
    easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    delay: number;
    duration?: number;
}

export interface WritingState {
    isRunning: boolean;
    isPaused: boolean;
    currentWordIndex: number;
    currentCharIndex: number;
    currentWord: string;
    progress: number;
    startTime: number;
    elapsedTime: number;
}

export interface WritingEvents {
    onStart: (state: WritingState) => void;
    onComplete: (state: WritingState) => void;
    onWordStart: (word: string, index: number) => void;
    onWordComplete: (word: string, index: number) => void;
    onCharacterWrite: (char: string, index: number) => void;
    onCharacterErase: (char: string, index: number) => void;
    onPause: (state: WritingState) => void;
    onResume: (state: WritingState) => void;
    onError: (error: Error) => void;
}

export interface WritingConfig extends Partial<WritingOptions> {
    words: string[];
    element: HTMLElement | string;
    events?: Partial<WritingEvents>;
}

export interface AnimationFrame {
    id: number;
    timestamp: number;
    callback: () => void;
}

export interface WritingInstance {
    id: string;
    element: HTMLElement;
    config: WritingConfig;
    state: WritingState;
    cleanup: () => void;
}

export type WritingEffect = 'typewriter' | 'fade' | 'glitch' | 'slide' | 'bounce';
export type WritingDirection = 'ltr' | 'rtl';
export type WritingSpeed = 'slow' | 'normal' | 'fast' | 'instant';

export interface PerformanceMetrics {
    frameDrops: number;
    averageFPS: number;
    memoryUsage: number;
    animationDuration: number;
    lastFrameTime: number;
}