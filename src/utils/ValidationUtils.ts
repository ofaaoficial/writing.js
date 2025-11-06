// Validation utilities for Writing.js v2.0

import type { WritingConfig } from '../types/WritingTypes';

export class ValidationUtils {
    /**
     * Validate element parameter
     */
    static validateElement(element: string | HTMLElement): HTMLElement {
        if (typeof element === 'string') {
            const found = document.querySelector(element);
            if (!found) {
                throw new Error(`Element not found: ${element}`);
            }
            return found as HTMLElement;
        }
        
        if (!(element instanceof HTMLElement)) {
            throw new Error('Invalid element: must be HTMLElement or CSS selector string');
        }
        
        return element;
    }

    /**
     * Validate words array
     */
    static validateWords(words: string[]): string[] {
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
            throw new Error('No valid words found in array');
        }
        
        return validWords.map(word => word.trim());
    }

    /**
     * Validate configuration object
     */
    static validateConfig(config: Partial<WritingConfig>): WritingConfig {
        if (!config.words || !Array.isArray(config.words)) {
            throw new Error('Configuration must include a valid words array');
        }

        // Validate times
        if (config.times) {
            const { writer, eraser, read } = config.times;
            if (writer !== undefined && (typeof writer !== 'number' || writer < 0)) {
                throw new Error('Writer speed must be a positive number');
            }
            if (eraser !== undefined && (typeof eraser !== 'number' || eraser < 0)) {
                throw new Error('Eraser speed must be a positive number');
            }
            if (read !== undefined && (typeof read !== 'number' || read < 0)) {
                throw new Error('Read delay must be a positive number');
            }
        }

        // Validate effects
        if (config.effects?.sound) {
            const { volume } = config.effects.sound;
            if (volume !== undefined && (typeof volume !== 'number' || volume < 0 || volume > 1)) {
                throw new Error('Sound volume must be a number between 0 and 1');
            }
        }

        return config as WritingConfig;
    }

    /**
     * Check browser support for features
     */
    static supports(feature: string): boolean {
        switch (feature) {
            case 'intersectionObserver':
                return 'IntersectionObserver' in window;
            case 'webAudio':
                return 'AudioContext' in window || 'webkitAudioContext' in window;
            case 'requestAnimationFrame':
                return 'requestAnimationFrame' in window;
            case 'performance':
                return 'performance' in window && 'now' in performance;
            case 'fetch':
                return 'fetch' in window;
            default:
                return false;
        }
    }

    /**
     * Validate CSS selector
     */
    static isValidSelector(selector: string): boolean {
        try {
            document.createDocumentFragment().querySelector(selector);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate URL
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
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
     * Validate styles array
     */
    static validateStyles(styles: string[]): string[] {
        if (!Array.isArray(styles)) {
            throw new Error('Styles must be an array');
        }
        
        return styles.filter(style => typeof style === 'string' && style.trim().length > 0);
    }

    /**
     * Check if value is within range
     */
    static isInRange(value: number, min: number, max: number): boolean {
        return typeof value === 'number' && value >= min && value <= max;
    }

    /**
     * Validate positive number
     */
    static isPositiveNumber(value: unknown): value is number {
        return typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value);
    }

    /**
     * Validate non-negative number
     */
    static isNonNegativeNumber(value: unknown): value is number {
        return typeof value === 'number' && value >= 0 && !isNaN(value) && isFinite(value);
    }
}