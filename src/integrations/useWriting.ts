// React Hook for Writing.js v2.0.0

import { useEffect, useRef, useState, useCallback } from 'react';
import { WritingJS } from '../core/WritingJS';
import { WritingConfig, WritingState } from '../types/WritingTypes';

export interface UseWritingOptions extends Partial<WritingConfig> {
    autoStart?: boolean;
    dependencies?: any[];
}

export interface UseWritingReturn {
    ref: React.RefObject<HTMLElement>;
    currentWord: string;
    isAnimating: boolean;
    progress: number;
    state: WritingState | null;
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
    setWords: (words: string[]) => void;
    setSpeed: (speed: number) => void;
    setOptions: (options: Partial<WritingConfig>) => void;
}

export const useWriting = (
    words: string[],
    options: UseWritingOptions = {}
): UseWritingReturn => {
    const ref = useRef<HTMLElement>(null);
    const writingInstanceRef = useRef<WritingJS | null>(null);
    const [currentWord, setCurrentWord] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [state, setState] = useState<WritingState | null>(null);

    const { autoStart = true, dependencies = [], ...config } = options;

    // Initialize WritingJS instance
    const initializeWriting = useCallback(() => {
        if (!ref.current || !words.length) return;

        // Cleanup existing instance
        if (writingInstanceRef.current) {
            writingInstanceRef.current.destroy();
        }

        // Create new instance
        writingInstanceRef.current = new WritingJS(ref.current, {
            words,
            ...config
        });

        // Setup event listeners
        const instance = writingInstanceRef.current;

        instance.on('start', (newState: WritingState) => {
            setIsAnimating(true);
            setState(newState);
        });

        instance.on('complete', (newState: WritingState) => {
            setIsAnimating(false);
            setState(newState);
        });

        instance.on('pause', (newState: WritingState) => {
            setIsAnimating(false);
            setState(newState);
        });

        instance.on('resume', (newState: WritingState) => {
            setIsAnimating(true);
            setState(newState);
        });

        instance.on('wordStart', (word: string) => {
            setCurrentWord(word);
        });

        instance.on('characterWrite', () => {
            const currentState = instance.getState();
            setProgress(currentState.progress);
            setState(currentState);
        });

        // Auto start if enabled
        if (autoStart) {
            instance.start();
        }
    }, [words, autoStart, ...dependencies]);

    // Initialize on mount and when dependencies change
    useEffect(() => {
        initializeWriting();

        return () => {
            if (writingInstanceRef.current) {
                writingInstanceRef.current.destroy();
                writingInstanceRef.current = null;
            }
        };
    }, [initializeWriting]);

    // Control methods
    const start = useCallback(() => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.start();
        }
    }, []);

    const stop = useCallback(() => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.stop();
        }
    }, []);

    const pause = useCallback(() => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.pause();
        }
    }, []);

    const resume = useCallback(() => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.resume();
        }
    }, []);

    const restart = useCallback(() => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.restart();
        }
    }, []);

    const setWords = useCallback((newWords: string[]) => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.setWords(newWords);
        }
    }, []);

    const setSpeed = useCallback((speed: number) => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.setSpeed(speed);
        }
    }, []);

    const setOptions = useCallback((newOptions: Partial<WritingConfig>) => {
        if (writingInstanceRef.current) {
            writingInstanceRef.current.setOptions(newOptions);
        }
    }, []);

    return {
        ref,
        currentWord,
        isAnimating,
        progress,
        state,
        start,
        stop,
        pause,
        resume,
        restart,
        setWords,
        setSpeed,
        setOptions
    };
};

// Additional hooks for specific effects
export const useTypeWriter = (words: string[], options: UseWritingOptions = {}) => {
    return useWriting(words, {
        ...options,
        cursor: {
            enabled: true,
            character: '|',
            blinkSpeed: 530,
            style: 'color: currentColor; font-weight: normal;',
            ...options.cursor
        },
        effects: {
            typing: {
                randomSpeed: true,
                speedVariation: 0.3,
                pauseOnPunctuation: true,
                punctuationDelay: 400,
                ...options.effects?.typing
            },
            ...options.effects
        }
    });
};

export const useFadeWriter = (words: string[], options: UseWritingOptions = {}) => {
    return useWriting(words, {
        ...options,
        cursor: {
            enabled: true,
            character: '_',
            blinkSpeed: 600,
            style: 'color: currentColor; opacity: 0.7;',
            hideOnComplete: true,
            ...options.cursor
        },
        effects: {
            visual: {
                fadeIn: true,
                ...options.effects?.visual
            },
            ...options.effects
        }
    });
};

export const useGlitchWriter = (words: string[], options: UseWritingOptions = {}) => {
    return useWriting(words, {
        ...options,
        cursor: {
            enabled: true,
            character: '█',
            blinkSpeed: 300,
            style: 'color: #00ff00; text-shadow: 0 0 5px #00ff00;',
            ...options.cursor
        },
        effects: {
            errors: {
                enabled: true,
                frequency: 0.15,
                correctionDelay: 300,
                ...options.effects?.errors
            },
            visual: {
                glitch: true,
                shake: true,
                ...options.effects?.visual
            },
            ...options.effects
        },
        styles: [
            'font-family: "Courier New", "Liberation Mono", monospace',
            'background-color: #000000',
            'color: #00ff00',
            'text-shadow: 0 0 3px #00ff00',
            'position: relative',
            'overflow: hidden',
            ...(options.styles || [])
        ]
    });
};

// React component wrapper
export interface WritingComponentProps extends UseWritingOptions {
    words: string[];
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onStart?: () => void;
    onComplete?: () => void;
    onWordChange?: (word: string) => void;
}

export const Writing: React.FC<WritingComponentProps> = ({
    words,
    as: Component = 'span',
    className,
    style,
    children,
    onStart,
    onComplete,
    onWordChange,
    ...options
}) => {
    const { ref, currentWord, isAnimating, start, stop, pause, resume, restart } = useWriting(words, options);

    // Event handlers
    useEffect(() => {
        if (isAnimating && onStart) {
            onStart();
        } else if (!isAnimating && onComplete) {
            onComplete();
        }
    }, [isAnimating, onStart, onComplete]);

    useEffect(() => {
        if (onWordChange) {
            onWordChange(currentWord);
        }
    }, [currentWord, onWordChange]);

    return React.createElement(
        Component,
        {
            ref,
            className,
            style,
            'data-writing-active': isAnimating,
            'data-current-word': currentWord
        },
        children
    );
};

export default useWriting;