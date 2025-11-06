// DOM utilities for Writing.js v2.0

interface ElementCache {
    data: Map<string, any>;
    styles: Map<string, string>;
}

export class DOMUtils {
    private static elementCache = new WeakMap<HTMLElement, ElementCache>();
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
    static createElement(tag: string, attributes: Record<string, any> = {}): HTMLElement {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'className' || key === 'class') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        return element;
    }

    /**
     * Apply styles to element efficiently
     */
    static applyStyles(element: HTMLElement, styles: Record<string, string>): void {
        Object.entries(styles).forEach(([property, value]) => {
            element.style.setProperty(property, value);
        });
    }

    /**
     * Apply styles from array of CSS strings
     */
    static applyStylesFromArray(element: HTMLElement, styles: string[]): void {
        styles.forEach(style => {
            if (style && style.includes(':')) {
                const [property, value] = style.split(':').map(s => s.trim());
                if (property && value) {
                    element.style.setProperty(property, value);
                }
            }
        });
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
        }, {
            threshold: 0.1,
            ...options
        });

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
        if (!this.elementCache.has(element)) {
            this.elementCache.set(element, {
                data: new Map(),
                styles: new Map()
            });
        }
        
        const cache = this.elementCache.get(element)!;
        cache.data.set(key, value);
    }

    /**
     * Get cached element data
     */
    static getCachedElementData(element: HTMLElement, key: string): any {
        const cache = this.elementCache.get(element);
        return cache?.data.get(key);
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

    /**
     * Add class to element
     */
    static addClass(element: HTMLElement, className: string): void {
        element.classList.add(className);
    }

    /**
     * Remove class from element
     */
    static removeClass(element: HTMLElement, className: string): void {
        element.classList.remove(className);
    }

    /**
     * Toggle class on element
     */
    static toggleClass(element: HTMLElement, className: string): void {
        element.classList.toggle(className);
    }

    /**
     * Check if element has class
     */
    static hasClass(element: HTMLElement, className: string): boolean {
        return element.classList.contains(className);
    }

    /**
     * Get element position
     */
    static getPosition(element: HTMLElement): { x: number; y: number } {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY
        };
    }

    /**
     * Animate element using CSS
     */
    static animate(
        element: HTMLElement,
        keyframes: Keyframe[],
        options: KeyframeAnimationOptions = {}
    ): Animation {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'ease',
            ...options
        });
    }

    /**
     * Set element text content safely
     */
    static setTextContent(element: HTMLElement, text: string): void {
        element.textContent = text;
    }

    /**
     * Set element HTML content safely
     */
    static setHTMLContent(element: HTMLElement, html: string): void {
        // Basic XSS prevention
        const div = document.createElement('div');
        div.textContent = html;
        element.innerHTML = div.innerHTML;
    }

    /**
     * Wait for element to be ready
     */
    static waitForElement(selector: string, timeout = 5000): Promise<HTMLElement> {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    const element = document.querySelector(selector) as HTMLElement;
                    if (element) {
                        observer.disconnect();
                        resolve(element);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * Create element with styles
     */
    static createStyledElement(
        tag: string,
        styles: Record<string, string>,
        attributes: Record<string, any> = {}
    ): HTMLElement {
        const element = this.createElement(tag, attributes);
        this.applyStyles(element, styles);
        return element;
    }

    /**
     * Copy element styles
     */
    static copyStyles(from: HTMLElement, to: HTMLElement): void {
        const fromStyles = window.getComputedStyle(from);
        Array.from(fromStyles).forEach(property => {
            to.style.setProperty(property, fromStyles.getPropertyValue(property));
        });
    }

    /**
     * Measure text width
     */
    static measureTextWidth(text: string, font?: string): number {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        
        if (font) {
            context.font = font;
        }
        
        return context.measureText(text).width;
    }

    /**
     * Check if element is focused
     */
    static isFocused(element: HTMLElement): boolean {
        return document.activeElement === element;
    }

    /**
     * Get element's font family
     */
    static getFontFamily(element: HTMLElement): string {
        return this.getComputedStyle(element, 'font-family');
    }

    /**
     * Get element's font size
     */
    static getFontSize(element: HTMLElement): number {
        const fontSize = this.getComputedStyle(element, 'font-size');
        return parseFloat(fontSize);
    }
}