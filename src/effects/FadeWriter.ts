// FadeWriter Effect - Enhanced Typography Animation Library v2.0.0

import { WritingJS } from '../core/WritingJS';
import { WritingConfig } from '../types/WritingTypes';
import { DOMUtils } from '../utils/DOMUtils';

export class FadeWriter {
    private element: HTMLElement;
    private config: Partial<WritingConfig>;
    private writingInstance: WritingJS | null = null;
    private fadeElements: HTMLElement[] = [];

    constructor(element: string | HTMLElement, config: Partial<WritingConfig> = {}) {
        this.element = typeof element === 'string' ? 
            document.querySelector(element) as HTMLElement : element;
        
        if (!this.element) {
            throw new Error('Element not found');
        }
        
        this.config = this.mergeFadeConfig(config);
        this.setupFadeStyles();
    }

    /**
     * Merge fade-specific configuration
     */
    private mergeFadeConfig(config: Partial<WritingConfig>): Partial<WritingConfig> {
        return {
            times: {
                writer: 80,
                eraser: 30,
                read: 1500,
                ...config.times
            },
            cursor: {
                enabled: true,
                character: '_',
                blinkSpeed: 600,
                style: 'color: currentColor; opacity: 0.7;',
                hideOnComplete: true,
                ...config.cursor
            },
            effects: {
                sound: {
                    enabled: false,
                    volume: 0.2,
                    randomPitch: false,
                    ...config.effects?.sound
                },
                typing: {
                    randomSpeed: false,
                    speedVariation: 0.1,
                    pauseOnPunctuation: false,
                    punctuationDelay: 200,
                    ...config.effects?.typing
                },
                errors: {
                    enabled: false,
                    frequency: 0,
                    correctionDelay: 0,
                    ...config.effects?.errors
                },
                visual: {
                    fadeIn: true,
                    slideIn: false,
                    glitch: false,
                    shake: false,
                    ...config.effects?.visual
                }
            },
            animation: {
                infinite: false,
                pauseOnHover: false,
                direction: 'forward',
                easing: 'ease-in-out',
                delay: 0,
                ...config.animation
            },
            ...config
        };
    }

    /**
     * Setup fade-specific styles and animations
     */
    private setupFadeStyles(): void {
        const fadeStyles = [
            'transition: opacity 0.3s ease-in-out',
            ...(this.config.styles || [])
        ];

        DOMUtils.applyStylesFromArray(this.element, fadeStyles);
        this.addFadeAnimations();
    }

    /**
     * Add CSS animations for fade effects
     */
    private addFadeAnimations(): void {
        const animations = [
            `
            @keyframes fade-in {
                from { 
                    opacity: 0;
                    transform: translateY(10px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            `,
            `
            @keyframes fade-out {
                from { 
                    opacity: 1;
                    transform: translateY(0);
                }
                to { 
                    opacity: 0;
                    transform: translateY(-10px);
                }
            }
            `,
            `
            @keyframes fade-cursor {
                0%, 50% { opacity: 0.7; }
                51%, 100% { opacity: 0.1; }
            }
            `,
            `
            .fade-char {
                animation: fade-in 0.5s ease-out;
                opacity: 0;
                animation-fill-mode: forwards;
            }
            `,
            `
            .fade-char-out {
                animation: fade-out 0.3s ease-in;
                animation-fill-mode: forwards;
            }
            `,
            `
            .fade-cursor {
                animation: fade-cursor 1.2s infinite;
            }
            `,
            `
            .fade-word {
                opacity: 0;
                animation: fade-in 0.8s ease-out;
                animation-fill-mode: forwards;
            }
            `,
            `
            .fade-word-out {
                animation: fade-out 0.5s ease-in;
                animation-fill-mode: forwards;
            }
            `
        ];

        const styleElement = document.createElement('style');
        styleElement.textContent = animations.join('\n');
        document.head.appendChild(styleElement);
    }

    /**
     * Start fade animation
     */
    public start(): this {
        if (!this.writingInstance) {
            this.writingInstance = new WritingJS(this.element, this.config);
            this.setupFadeEvents();
        }
        
        this.writingInstance.start();
        return this;
    }

    /**
     * Stop fade animation
     */
    public stop(): this {
        if (this.writingInstance) {
            this.writingInstance.stop();
        }
        return this;
    }

    /**
     * Pause fade animation
     */
    public pause(): this {
        if (this.writingInstance) {
            this.writingInstance.pause();
        }
        return this;
    }

    /**
     * Resume fade animation
     */
    public resume(): this {
        if (this.writingInstance) {
            this.writingInstance.resume();
        }
        return this;
    }

    /**
     * Restart fade animation
     */
    public restart(): this {
        if (this.writingInstance) {
            this.writingInstance.restart();
        }
        return this;
    }

    /**
     * Set words for fade effect
     */
    public setWords(words: string[]): this {
        if (this.writingInstance) {
            this.writingInstance.setWords(words);
        } else {
            this.config.words = words;
        }
        return this;
    }

    /**
     * Set fade speed
     */
    public setSpeed(speed: number): this {
        if (this.writingInstance) {
            this.writingInstance.setSpeed(speed);
        } else {
            if (!this.config.times) this.config.times = { writer: 80, eraser: 30, read: 1500 };
            this.config.times.writer = speed;
        }
        return this;
    }

    /**
     * Setup fade-specific events
     */
    private setupFadeEvents(): void {
        if (!this.writingInstance) return;

        // Fade in characters as they're written
        this.writingInstance.on('characterWrite', (char: string, index: number) => {
            this.fadeInCharacter(char, index);
        });

        // Fade out characters as they're erased
        this.writingInstance.on('characterErase', (char: string, index: number) => {
            this.fadeOutCharacter(char, index);
        });

        // Fade in word on start
        this.writingInstance.on('wordStart', (word: string, index: number) => {
            this.fadeInWord(word, index);
        });

        // Fade out word on complete
        this.writingInstance.on('wordComplete', (word: string, index: number) => {
            this.fadeOutWord(word, index);
        });

        // Handle cursor fade
        this.writingInstance.on('start', () => {
            this.setupFadeCursor();
        });
    }

    /**
     * Fade in character
     */
    private fadeInCharacter(char: string, index: number): void {
        const textNodes = this.getTextNodes();
        const lastNode = textNodes[textNodes.length - 1];
        
        if (lastNode && lastNode.textContent) {
            const lastChar = lastNode.textContent.slice(-1);
            if (lastChar === char) {
                // Wrap character in span for fade animation
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'fade-char';
                
                // Replace the text node
                const newText = lastNode.textContent.slice(0, -1);
                lastNode.textContent = newText;
                
                // Insert the animated span
                if (lastNode.parentNode) {
                    lastNode.parentNode.insertBefore(charSpan, lastNode.nextSibling);
                }
                
                // Track for cleanup
                this.fadeElements.push(charSpan);
                
                // Remove animation class after completion
                setTimeout(() => {
                    charSpan.classList.remove('fade-char');
                }, 500);
            }
        }
    }

    /**
     * Fade out character
     */
    private fadeOutCharacter(char: string, index: number): void {
        const fadeChars = this.element.querySelectorAll('.fade-char, span:not(.fade-cursor)');
        const lastChar = fadeChars[fadeChars.length - 1] as HTMLElement;
        
        if (lastChar) {
            lastChar.classList.add('fade-char-out');
            
            // Remove element after fade out
            setTimeout(() => {
                lastChar.remove();
            }, 300);
        }
    }

    /**
     * Fade in word
     */
    private fadeInWord(word: string, index: number): void {
        // Add fade class to element
        this.element.classList.add('fade-word');
        
        // Remove class after animation
        setTimeout(() => {
            this.element.classList.remove('fade-word');
        }, 800);
    }

    /**
     * Fade out word
     */
    private fadeOutWord(word: string, index: number): void {
        // Add fade out class to element
        this.element.classList.add('fade-word-out');
        
        // Remove class after animation
        setTimeout(() => {
            this.element.classList.remove('fade-word-out');
        }, 500);
    }

    /**
     * Setup fade cursor
     */
    private setupFadeCursor(): void {
        const cursor = this.element.querySelector('.writing-cursor');
        if (cursor) {
            cursor.classList.add('fade-cursor');
        }
    }

    /**
     * Get text nodes from element
     */
    private getTextNodes(): Text[] {
        const walker = document.createTreeWalker(
            this.element,
            NodeFilter.SHOW_TEXT,
            null
        );
        
        const textNodes: Text[] = [];
        let node: Node | null;
        
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node as Text);
            }
        }
        
        return textNodes;
    }

    /**
     * Set fade duration
     */
    public setFadeDuration(duration: number): this {
        const style = document.createElement('style');
        style.textContent = `
            .fade-char {
                animation-duration: ${duration}ms !important;
            }
            .fade-char-out {
                animation-duration: ${duration * 0.6}ms !important;
            }
        `;
        document.head.appendChild(style);
        return this;
    }

    /**
     * Set fade direction
     */
    public setFadeDirection(direction: 'up' | 'down' | 'left' | 'right'): this {
        const transforms = {
            up: 'translateY(-10px)',
            down: 'translateY(10px)',
            left: 'translateX(-10px)',
            right: 'translateX(10px)'
        };

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fade-in {
                from { 
                    opacity: 0;
                    transform: ${transforms[direction]};
                }
                to { 
                    opacity: 1;
                    transform: translate(0);
                }
            }
        `;
        document.head.appendChild(style);
        return this;
    }

    /**
     * Get current state
     */
    public getState() {
        return this.writingInstance?.getState();
    }

    /**
     * Get metrics
     */
    public getMetrics() {
        return this.writingInstance?.getMetrics();
    }

    /**
     * Check if animating
     */
    public isAnimating(): boolean {
        return this.writingInstance?.isAnimating() || false;
    }

    /**
     * Destroy fade writer
     */
    public destroy(): void {
        if (this.writingInstance) {
            this.writingInstance.destroy();
            this.writingInstance = null;
        }
        
        // Clean up fade elements
        this.fadeElements.forEach(el => {
            if (el.parentNode) {
                const textNode = document.createTextNode(el.textContent || '');
                el.parentNode.replaceChild(textNode, el);
            }
        });
        this.fadeElements = [];
        
        // Remove fade classes
        this.element.classList.remove('fade-word', 'fade-word-out');
        
        // Clean up any remaining fade elements
        const fadeChars = this.element.querySelectorAll('.fade-char, .fade-char-out');
        fadeChars.forEach(char => {
            const textNode = document.createTextNode(char.textContent || '');
            char.parentNode?.replaceChild(textNode, char);
        });
    }

    /**
     * Static factory method
     */
    public static create(element: string | HTMLElement, config?: Partial<WritingConfig>): FadeWriter {
        return new FadeWriter(element, config);
    }
}