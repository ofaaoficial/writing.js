// Validation utilities for Writing.js v2.0.0

import { WritingOptions, WritingConfig } from '../types/WritingTypes';

export class ValidationUtils {
    /**
     * Validate element selector or HTMLElement
     */
    static validateElement(element: string | HTMLElement): HTMLElement {
        if (typeof element === 'string') {
            const found = document.querySelector(element);
            if (!found) {
                throw new Error(`Element not found: ${element}`);
            }
            if (!(found instanceof HTMLElement)) {
                throw new Error(`Element is not an HTMLElement: ${element}`);
            }
            return found;
        }
        
        if (!(element instanceof HTMLElement)) {
            throw new Error('Element must be an HTMLElement or a valid selector string');
        }
        
        return element;
    }

    /**
     * Validate words array
     */
    static validateWords(words: any): string[] {
        if (!Array.isArray(words)) {
            throw new Error('Words must be an array');
        }
        
        if (words.length === 0) {
            throw new Error('Words array cannot be empty');
        }
        
        const validWords = words.filter(word => 
            typeof word === 'string' && word.trim().length > 0
        );
        
        if (validWords.length === 0) {
            throw new Error('Words array must contain at least one valid string');
        }
        
        return validWords;
    }

    /**
     * Validate and normalize configuration
     */
    static validateConfig(config: Partial<WritingConfig>): WritingConfig {
        const defaultConfig: WritingConfig = {
            element: '',
            words: [],
            times: {
                writer: 150,
                eraser: 150,
                read: 1000
            },
            cursor: {
                enabled: true,
                character: '|',
                blinkSpeed: 500,
                style: 'opacity: 1',
                hideOnComplete: false
            },
            effects: {
                sound: {
                    enabled: false,
                    volume: 0.5,
                    randomPitch: false
                },
                typing: {
                    randomSpeed: false,
                    speedVariation: 0.1,
                    pauseOnPunctuation: false,
                    punctuationDelay: 300
                },
                errors: {
                    enabled: false,
                    frequency: 0.05,
                    correctionDelay: 500,
                    typos: []
                },
                visual: {
                    fadeIn: false,
                    slideIn: false,
                    glitch: false,
                    shake: false
                }
            },
            animation: {
                infinite: false,
                pauseOnHover: false,
                direction: 'forward',
                easing: 'ease-in-out',
                delay: 0
            },
            infinite: false,
            pauseOnHover: false,
            debug: false
        };

        const mergedConfig = this.deepMerge(defaultConfig, config);

        // Validate specific properties
        this.validateTimes(mergedConfig.times);
        this.validateCursor(mergedConfig.cursor);
        this.validateEffects(mergedConfig.effects);
        this.validateAnimation(mergedConfig.animation);

        return mergedConfig;
    }

    /**
     * Validate times configuration
     */
    static validateTimes(times: any): void {
        if (!times || typeof times !== 'object') {
            throw new Error('Times must be an object');
        }

        const { writer, eraser, read } = times;

        if (typeof writer !== 'number' || writer < 0) {
            throw new Error('Writer time must be a non-negative number');
        }

        if (typeof eraser !== 'number' || eraser < 0) {
            throw new Error('Eraser time must be a non-negative number');
        }

        if (typeof read !== 'number' || read < 0) {
            throw new Error('Read time must be a non-negative number');
        }
    }

    /**
     * Validate cursor configuration
     */
    static validateCursor(cursor: any): void {
        if (!cursor || typeof cursor !== 'object') {
            throw new Error('Cursor must be an object');
        }

        const { enabled, character, blinkSpeed, style } = cursor;

        if (typeof enabled !== 'boolean') {
            throw new Error('Cursor enabled must be a boolean');
        }

        if (typeof character !== 'string') {
            throw new Error('Cursor character must be a string');
        }

        if (typeof blinkSpeed !== 'number' || blinkSpeed < 0) {
            throw new Error('Cursor blink speed must be a non-negative number');
        }

        if (typeof style !== 'string') {
            throw new Error('Cursor style must be a string');
        }
    }

    /**
     * Validate effects configuration
     */
    static validateEffects(effects: any): void {
        if (!effects || typeof effects !== 'object') {
            throw new Error('Effects must be an object');
        }

        // Validate sound effects
        if (effects.sound) {
            const { enabled, volume, randomPitch } = effects.sound;
            if (typeof enabled !== 'boolean') {
                throw new Error('Sound enabled must be a boolean');
            }
            if (typeof volume !== 'number' || volume < 0 || volume > 1) {
                throw new Error('Sound volume must be a number between 0 and 1');
            }
            if (randomPitch !== undefined && typeof randomPitch !== 'boolean') {
                throw new Error('Sound randomPitch must be a boolean');
            }
        }

        // Validate typing effects
        if (effects.typing) {
            const { randomSpeed, speedVariation, pauseOnPunctuation, punctuationDelay } = effects.typing;
            if (typeof randomSpeed !== 'boolean') {
                throw new Error('Typing randomSpeed must be a boolean');
            }
            if (typeof speedVariation !== 'number' || speedVariation < 0 || speedVariation > 1) {
                throw new Error('Speed variation must be a number between 0 and 1');
            }
            if (typeof pauseOnPunctuation !== 'boolean') {
                throw new Error('PauseOnPunctuation must be a boolean');
            }
            if (typeof punctuationDelay !== 'number' || punctuationDelay < 0) {
                throw new Error('Punctuation delay must be a non-negative number');
            }
        }

        // Validate error effects
        if (effects.errors) {
            const { enabled, frequency, correctionDelay } = effects.errors;
            if (typeof enabled !== 'boolean') {
                throw new Error('Errors enabled must be a boolean');
            }
            if (typeof frequency !== 'number' || frequency < 0 || frequency > 1) {
                throw new Error('Error frequency must be a number between 0 and 1');
            }
            if (typeof correctionDelay !== 'number' || correctionDelay < 0) {
                throw new Error('Correction delay must be a non-negative number');
            }
        }
    }

    /**
     * Validate animation configuration
     */
    static validateAnimation(animation: any): void {
        if (!animation || typeof animation !== 'object') {
            throw new Error('Animation must be an object');
        }

        const { infinite, pauseOnHover, direction, easing, delay } = animation;

        if (typeof infinite !== 'boolean') {
            throw new Error('Animation infinite must be a boolean');
        }

        if (typeof pauseOnHover !== 'boolean') {
            throw new Error('Animation pauseOnHover must be a boolean');
        }

        const validDirections = ['forward', 'reverse', 'alternate'];
        if (!validDirections.includes(direction)) {
            throw new Error(`Animation direction must be one of: ${validDirections.join(', ')}`);
        }

        const validEasings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
        if (!validEasings.includes(easing)) {
            throw new Error(`Animation easing must be one of: ${validEasings.join(', ')}`);
        }

        if (typeof delay !== 'number' || delay < 0) {
            throw new Error('Animation delay must be a non-negative number');
        }
    }

    /**
     * Validate styles array
     */
    static validateStyles(styles: any): string[] {
        if (!styles) return [];
        
        if (!Array.isArray(styles)) {
            throw new Error('Styles must be an array');
        }

        const validStyles = styles.filter(style => 
            typeof style === 'string' && style.trim().length > 0
        );

        return validStyles;
    }

    /**
     * Check if a value is a valid number
     */
    static isValidNumber(value: any): boolean {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    /**
     * Check if a value is a valid positive number
     */
    static isValidPositiveNumber(value: any): boolean {
        return this.isValidNumber(value) && value >= 0;
    }

    /**
     * Check if a value is a valid percentage (0-1)
     */
    static isValidPercentage(value: any): boolean {
        return this.isValidNumber(value) && value >= 0 && value <= 1;
    }

    /**
     * Sanitize HTML content
     */
    static sanitizeHTML(html: string): string {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Deep merge objects
     */
    static deepMerge(target: any, source: any): any {
        const result = { ...target };
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    }

    /**
     * Check if browser supports a feature
     */
    static supports(feature: string): boolean {
        switch (feature) {
            case 'requestAnimationFrame':
                return typeof window !== 'undefined' && 'requestAnimationFrame' in window;
            case 'intersectionObserver':
                return typeof window !== 'undefined' && 'IntersectionObserver' in window;
            case 'constructableStylesheets':
                return typeof window !== 'undefined' && 'adoptedStyleSheets' in Document.prototype;
            case 'webAudio':
                return typeof window !== 'undefined' && 'AudioContext' in window;
            default:
                return false;
        }
    }

    /**
     * Generate error message with suggestions
     */
    static createErrorMessage(message: string, suggestions: string[] = []): string {
        let errorMessage = message;
        
        if (suggestions.length > 0) {
            errorMessage += '\n\nSuggestions:';
            suggestions.forEach((suggestion, index) => {
                errorMessage += `\n  ${index + 1}. ${suggestion}`;
            });
        }
        
        return errorMessage;
    }
}