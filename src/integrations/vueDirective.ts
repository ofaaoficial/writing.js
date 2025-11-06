// Vue Directive for Writing.js v2.0.0

import { WritingJS } from '../core/WritingJS';
import { WritingConfig } from '../types/WritingTypes';

// Interface for Vue binding value
interface WritingDirectiveBinding {
    value?: {
        words?: string[];
        config?: Partial<WritingConfig>;
        autoStart?: boolean;
        effect?: 'typewriter' | 'fade' | 'glitch';
    };
    modifiers?: {
        typewriter?: boolean;
        fade?: boolean;
        glitch?: boolean;
        autostart?: boolean;
        infinite?: boolean;
    };
}

// Store instances for cleanup
const instances = new WeakMap<HTMLElement, WritingJS>();

/**
 * Vue 3 Directive for Writing.js
 */
export const writingDirective = {
    mounted(el: HTMLElement, binding: WritingDirectiveBinding) {
        createWritingInstance(el, binding);
    },

    updated(el: HTMLElement, binding: WritingDirectiveBinding) {
        // Update existing instance if binding value changes
        const instance = instances.get(el);
        if (instance && binding.value) {
            if (binding.value.words) {
                instance.setWords(binding.value.words);
            }
            if (binding.value.config) {
                instance.setOptions(binding.value.config);
            }
        }
    },

    unmounted(el: HTMLElement) {
        // Cleanup instance
        const instance = instances.get(el);
        if (instance) {
            instance.destroy();
            instances.delete(el);
        }
    }
};

/**
 * Vue 2 Directive for Writing.js (legacy support)
 */
export const writingDirectiveV2 = {
    bind(el: HTMLElement, binding: WritingDirectiveBinding) {
        createWritingInstance(el, binding);
    },

    update(el: HTMLElement, binding: WritingDirectiveBinding) {
        const instance = instances.get(el);
        if (instance && binding.value) {
            if (binding.value.words) {
                instance.setWords(binding.value.words);
            }
            if (binding.value.config) {
                instance.setOptions(binding.value.config);
            }
        }
    },

    unbind(el: HTMLElement) {
        const instance = instances.get(el);
        if (instance) {
            instance.destroy();
            instances.delete(el);
        }
    }
};

/**
 * Create WritingJS instance based on directive binding
 */
function createWritingInstance(el: HTMLElement, binding: WritingDirectiveBinding) {
    // Cleanup existing instance
    const existingInstance = instances.get(el);
    if (existingInstance) {
        existingInstance.destroy();
    }

    // Get configuration from binding
    const config = getConfigFromBinding(binding);
    
    // Get words from various sources
    const words = getWordsFromBinding(el, binding);
    
    if (words.length === 0) {
        console.warn('v-writing: No words provided for animation');
        return;
    }

    // Create instance
    const instance = new WritingJS(el, {
        words,
        ...config
    });

    // Store instance for cleanup
    instances.set(el, instance);

    // Auto start if enabled
    const autoStart = binding.value?.autoStart !== false && !binding.modifiers?.autostart === false;
    if (autoStart) {
        instance.start();
    }

    // Expose instance to element for manual control
    (el as any).__writingInstance = instance;
}

/**
 * Get configuration from directive binding
 */
function getConfigFromBinding(binding: WritingDirectiveBinding): Partial<WritingConfig> {
    const config: Partial<WritingConfig> = {};
    
    // Apply base config
    if (binding.value?.config) {
        Object.assign(config, binding.value.config);
    }

    // Apply effect-specific configs based on modifiers
    if (binding.modifiers?.typewriter || binding.value?.effect === 'typewriter') {
        Object.assign(config, getTypewriterConfig());
    } else if (binding.modifiers?.fade || binding.value?.effect === 'fade') {
        Object.assign(config, getFadeConfig());
    } else if (binding.modifiers?.glitch || binding.value?.effect === 'glitch') {
        Object.assign(config, getGlitchConfig());
    }

    // Apply modifier-based configs
    if (binding.modifiers?.infinite) {
        config.infinite = true;
    }

    return config;
}

/**
 * Get words from various sources
 */
function getWordsFromBinding(el: HTMLElement, binding: WritingDirectiveBinding): string[] {
    // Priority: binding.value.words > wj-words attribute > element content
    
    if (binding.value?.words && binding.value.words.length > 0) {
        return binding.value.words;
    }

    const wordsAttr = el.getAttribute('wj-words');
    if (wordsAttr) {
        return wordsAttr.split(',').map(word => word.trim()).filter(word => word.length > 0);
    }

    const textContent = el.textContent?.trim();
    if (textContent) {
        return [textContent];
    }

    return [];
}

/**
 * Get typewriter effect configuration
 */
function getTypewriterConfig(): Partial<WritingConfig> {
    return {
        cursor: {
            enabled: true,
            character: '|',
            blinkSpeed: 530,
            style: 'color: currentColor; font-weight: normal;'
        },
        effects: {
            sound: {
                enabled: false,
                volume: 0.3,
                randomPitch: true
            },
            typing: {
                randomSpeed: true,
                speedVariation: 0.3,
                pauseOnPunctuation: true,
                punctuationDelay: 400
            },
            errors: {
                enabled: false,
                frequency: 0.08,
                correctionDelay: 800
            },
            visual: {
                fadeIn: false,
                slideIn: false,
                glitch: false,
                shake: false
            }
        },
        styles: [
            'font-family: "Courier New", Monaco, monospace',
            'white-space: pre-wrap',
            'word-wrap: break-word',
            'line-height: 1.5'
        ]
    };
}

/**
 * Get fade effect configuration
 */
function getFadeConfig(): Partial<WritingConfig> {
    return {
        cursor: {
            enabled: true,
            character: '_',
            blinkSpeed: 600,
            style: 'color: currentColor; opacity: 0.7;',
            hideOnComplete: true
        },
        effects: {
            sound: {
                enabled: false,
                volume: 0.2,
                randomPitch: false
            },
            typing: {
                randomSpeed: false,
                speedVariation: 0.1,
                pauseOnPunctuation: false,
                punctuationDelay: 200
            },
            errors: {
                enabled: false,
                frequency: 0,
                correctionDelay: 0
            },
            visual: {
                fadeIn: true,
                slideIn: false,
                glitch: false,
                shake: false
            }
        },
        styles: [
            'transition: opacity 0.3s ease-in-out'
        ]
    };
}

/**
 * Get glitch effect configuration
 */
function getGlitchConfig(): Partial<WritingConfig> {
    return {
        cursor: {
            enabled: true,
            character: '█',
            blinkSpeed: 300,
            style: 'color: #00ff00; text-shadow: 0 0 5px #00ff00;'
        },
        effects: {
            sound: {
                enabled: false,
                volume: 0.4,
                randomPitch: true
            },
            typing: {
                randomSpeed: true,
                speedVariation: 0.5,
                pauseOnPunctuation: false,
                punctuationDelay: 100
            },
            errors: {
                enabled: true,
                frequency: 0.15,
                correctionDelay: 300
            },
            visual: {
                fadeIn: false,
                slideIn: false,
                glitch: true,
                shake: true
            }
        },
        styles: [
            'font-family: "Courier New", "Liberation Mono", monospace',
            'background-color: #000000',
            'color: #00ff00',
            'text-shadow: 0 0 3px #00ff00',
            'position: relative',
            'overflow: hidden'
        ]
    };
}

/**
 * Vue plugin installer
 */
export const WritingPlugin = {
    install(app: any, options: { directiveName?: string } = {}) {
        const directiveName = options.directiveName || 'writing';
        
        // Detect Vue version and use appropriate directive
        if (app.version && app.version.startsWith('3')) {
            app.directive(directiveName, writingDirective);
        } else {
            // Vue 2 fallback
            app.directive(directiveName, writingDirectiveV2);
        }
    }
};

/**
 * Helper function to control writing animation from Vue components
 */
export const useWritingControl = (el: HTMLElement) => {
    const instance = instances.get(el) || (el as any).__writingInstance;
    
    if (!instance) {
        console.warn('WritingJS instance not found on element');
        return null;
    }

    return {
        start: () => instance.start(),
        stop: () => instance.stop(),
        pause: () => instance.pause(),
        resume: () => instance.resume(),
        restart: () => instance.restart(),
        setWords: (words: string[]) => instance.setWords(words),
        setSpeed: (speed: number) => instance.setSpeed(speed),
        setOptions: (options: Partial<WritingConfig>) => instance.setOptions(options),
        getState: () => instance.getState(),
        getMetrics: () => instance.getMetrics(),
        isAnimating: () => instance.isAnimating()
    };
};

// Default export
export default writingDirective;