// DOM utilities for Writing.js v2.0.0

export class DOMUtils {
    private static elementCache = new WeakMap<HTMLElement, any>();
    private static observerCache = new WeakMap<HTMLElement, IntersectionObserver>();

    /**
     * Get element by selector with caching
     */
    static getElement(selector: string | HTMLElement): HTMLElement | null {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        return selector instanceof HTMLElement ? selector : null;
    }

    /**
     * Get elements by selector
     */
    static getElements(selector: string): NodeListOf<HTMLElement> {
        return document.querySelectorAll(selector);
    }

    /**
     * Create element with attributes
     */
    static createElement(tag: string, attributes: { [key: string]: string } = {}): HTMLElement {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        return element;
    }

    /**
     * Apply styles to element efficiently
     */
    static applyStyles(element: HTMLElement, styles: { [key: string]: string | number }): void {
        const cssText = Object.entries(styles)
            .map(([property, value]) => `${this.kebabCase(property)}: ${value}`)
            .join('; ');
        
        element.style.cssText += cssText;
    }

    /**
     * Apply styles from array of CSS strings
     */
    static applyStylesFromArray(element: HTMLElement, styles: string[]): void {
        const cssText = styles.join('; ');
        element.style.cssText += cssText;
    }

    /**
     * Create and inject CSS stylesheet
     */
    static createStyleSheet(selector: string, styles: string[]): void {
        const styleId = `writing-js-${this.generateId()}`;
        
        // Check if Constructable Stylesheets are supported
        if ('adoptedStyleSheets' in document) {
            try {
                const sheet = new CSSStyleSheet();
                const cssText = `${selector} { ${styles.join('; ')} }`;
                sheet.replaceSync(cssText);
                
                if (document.adoptedStyleSheets) {
                    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
                } else {
                    document.adoptedStyleSheets = [sheet];
                }
                return;
            } catch (error) {
                console.warn('Constructable Stylesheets not supported, falling back to <style> tag');
            }
        }

        // Fallback: create style element
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = `${selector} { ${styles.join('; ')} }`;
        document.head.appendChild(styleElement);
    }

    /**
     * Get computed style property
     */
    static getComputedStyle(element: HTMLElement, property: string): string {
        return window.getComputedStyle(element).getPropertyValue(property);
    }

    /**
     * Check if element is visible
     */
    static isVisible(element: HTMLElement): boolean {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
    }

    /**
     * Get element dimensions
     */
    static getDimensions(element: HTMLElement): { width: number; height: number } {
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * Check if element is in viewport
     */
    static isInViewport(element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Observe element visibility with Intersection Observer
     */
    static observeVisibility(
        element: HTMLElement, 
        callback: (isVisible: boolean) => void,
        options: IntersectionObserverInit = {}
    ): IntersectionObserver {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                callback(entry.isIntersecting);
            });
        }, options);

        observer.observe(element);
        this.observerCache.set(element, observer);
        return observer;
    }

    /**
     * Disconnect observer for element
     */
    static disconnectObserver(element: HTMLElement): void {
        const observer = this.observerCache.get(element);
        if (observer) {
            observer.disconnect();
            this.observerCache.delete(element);
        }
    }

    /**
     * Optimized text insertion using Document Fragment
     */
    static insertTextOptimized(element: HTMLElement, text: string): void {
        const fragment = document.createDocumentFragment();
        const textNode = document.createTextNode(text);
        fragment.appendChild(textNode);
        element.appendChild(fragment);
    }

    /**
     * Batch DOM updates
     */
    static batchUpdate(updates: (() => void)[]): void {
        requestAnimationFrame(() => {
            updates.forEach(update => update());
        });
    }

    /**
     * Debounce function
     */
    static debounce<T extends (...args: any[]) => void>(
        func: T, 
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;
        
        return function(this: any, ...args: Parameters<T>) {
            const later = () => {
                clearTimeout(timeoutId);
                func.apply(this, args);
            };
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    static throttle<T extends (...args: any[]) => void>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        
        return function(this: any, ...args: Parameters<T>) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Convert camelCase to kebab-case
     */
    private static kebabCase(str: string): string {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * Generate unique ID
     */
    private static generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Cache element data
     */
    static cacheElementData(element: HTMLElement, key: string, value: any): void {
        let cache = this.elementCache.get(element);
        if (!cache) {
            cache = {};
            this.elementCache.set(element, cache);
        }
        cache[key] = value;
    }

    /**
     * Get cached element data
     */
    static getCachedElementData(element: HTMLElement, key: string): any {
        const cache = this.elementCache.get(element);
        return cache ? cache[key] : undefined;
    }

    /**
     * Clear element cache
     */
    static clearElementCache(element: HTMLElement): void {
        this.elementCache.delete(element);
    }

    /**
     * Cleanup all resources
     */
    static cleanup(): void {
        // Note: WeakMap doesn't have forEach, so we'll reset the cache
        // Individual observers should be cleaned up via disconnectObserver
        this.elementCache = new WeakMap();
        this.observerCache = new WeakMap();
    }
}