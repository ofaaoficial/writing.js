// TypeWriter Effect - Enhanced Typography Animation Library v2.0.0

import { WritingJS } from '../core/WritingJS';
import { WritingConfig } from '../types/WritingTypes';
import { DOMUtils } from '../utils/DOMUtils';

export class TypeWriter {
    private element: HTMLElement;
    private config: Partial<WritingConfig>;
    private writingInstance: WritingJS | null = null;
    private customStyles: string[] = [];

    constructor(element: string | HTMLElement, config: Partial<WritingConfig> = {}) {
        this.element = typeof element === 'string' ? 
            document.querySelector(element) as HTMLElement : element;
        
        if (!this.element) {
            throw new Error('Element not found');
        }
        
        this.config = this.mergeDefaultConfig(config);
        this.setupTypeWriterStyles();
    }

    /**
     * Merge default typewriter configuration
     */
    private mergeDefaultConfig(config: Partial<WritingConfig>): Partial<WritingConfig> {
        return {
            times: {
                writer: 100,
                eraser: 50,
                read: 2000,
                ...config.times
            },
            cursor: {
                enabled: true,
                character: '|',
                blinkSpeed: 530,
                style: 'color: currentColor; font-weight: normal;',
                hideOnComplete: false,
                ...config.cursor
            },
            effects: {
                sound: {
                    enabled: false,
                    volume: 0.3,
                    randomPitch: true,
                    ...config.effects?.sound
                },
                typing: {
                    randomSpeed: true,
                    speedVariation: 0.3,
                    pauseOnPunctuation: true,
                    punctuationDelay: 400,
                    ...config.effects?.typing
                },
                errors: {
                    enabled: false,
                    frequency: 0.08,
                    correctionDelay: 800,
                    typos: ['teh', 'adn', 'hte', 'nad', 'fo', 'ot'],
                    ...config.effects?.errors
                },
                visual: {
                    fadeIn: false,
                    slideIn: false,
                    glitch: false,
                    shake: false,
                    ...config.effects?.visual
                }
            },
            animation: {
                infinite: false,
                pauseOnHover: true,
                direction: 'forward',
                easing: 'ease-out',
                delay: 0,
                ...config.animation
            },
            ...config
        };
    }

    /**
     * Setup typewriter-specific styles
     */
    private setupTypeWriterStyles(): void {
        this.customStyles = [
            'font-family: "Courier New", Monaco, monospace',
            'white-space: pre-wrap',
            'word-wrap: break-word',
            'line-height: 1.5',
            ...(this.config.styles || [])
        ];

        // Apply typewriter font and styling
        DOMUtils.applyStylesFromArray(this.element, this.customStyles);
        
        // Add typewriter-specific CSS animations
        this.addTypeWriterAnimations();
    }

    /**
     * Add CSS animations for typewriter effects
     */
    private addTypeWriterAnimations(): void {
        const animations = [
            `
            @keyframes typewriter-cursor {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            `,
            `
            @keyframes typewriter-char-enter {
                0% { 
                    opacity: 0; 
                    transform: translateY(2px); 
                }
                100% { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            `,
            `
            @keyframes typewriter-error-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            `,
            `
            .writing-cursor {
                animation: typewriter-cursor 1s infinite;
            }
            `,
            `
            .typewriter-char {
                animation: typewriter-char-enter 0.1s ease-out;
            }
            `,
            `
            .typewriter-error {
                animation: typewriter-error-shake 0.3s ease-in-out;
                color: #ff4444;
            }
            `
        ];

        // Create style element with animations
        const styleElement = document.createElement('style');
        styleElement.textContent = animations.join('\n');
        document.head.appendChild(styleElement);
    }

    /**
     * Start typewriter animation
     */
    public start(): this {
        if (!this.writingInstance) {
            this.writingInstance = new WritingJS(this.element, this.config);
            this.setupTypeWriterEvents();
        }
        
        this.writingInstance.start();
        return this;
    }

    /**
     * Stop typewriter animation
     */
    public stop(): this {
        if (this.writingInstance) {
            this.writingInstance.stop();
        }
        return this;
    }

    /**
     * Pause typewriter animation
     */
    public pause(): this {
        if (this.writingInstance) {
            this.writingInstance.pause();
        }
        return this;
    }

    /**
     * Resume typewriter animation
     */
    public resume(): this {
        if (this.writingInstance) {
            this.writingInstance.resume();
        }
        return this;
    }

    /**
     * Restart typewriter animation
     */
    public restart(): this {
        if (this.writingInstance) {
            this.writingInstance.restart();
        }
        return this;
    }

    /**
     * Set words for typewriter
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
     * Set typing speed
     */
    public setSpeed(speed: number): this {
        if (this.writingInstance) {
            this.writingInstance.setSpeed(speed);
        } else {
            if (!this.config.times) this.config.times = { writer: 100, eraser: 50, read: 2000 };
            this.config.times.writer = speed;
        }
        return this;
    }

    /**
     * Setup typewriter-specific events
     */
    private setupTypeWriterEvents(): void {
        if (!this.writingInstance) return;

        // Add character animation on write
        this.writingInstance.on('characterWrite', (char: string, index: number) => {
            this.animateCharacter(char, index);
        });

        // Handle typing errors
        if (this.config.effects?.errors?.enabled) {
            this.writingInstance.on('characterWrite', (char: string, index: number) => {
                this.handleTypingError(char, index);
            });
        }

        // Handle cursor management
        this.writingInstance.on('complete', () => {
            if (this.config.cursor?.hideOnComplete) {
                this.hideCursor();
            }
        });
    }

    /**
     * Animate character entry
     */
    private animateCharacter(char: string, index: number): void {
        // Find the last added character and animate it
        const textNodes = this.getTextNodes();
        const lastNode = textNodes[textNodes.length - 1];
        
        if (lastNode && lastNode.textContent) {
            const lastChar = lastNode.textContent.slice(-1);
            if (lastChar === char) {
                // Wrap the character in a span for animation
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'typewriter-char';
                
                // Replace the text node with the animated span
                const newText = lastNode.textContent.slice(0, -1);
                lastNode.textContent = newText;
                lastNode.parentNode?.insertBefore(charSpan, lastNode.nextSibling);
                
                // Remove the animation class after animation completes
                setTimeout(() => {
                    charSpan.className = '';
                }, 100);
            }
        }
    }

    /**
     * Handle typing errors
     */
    private handleTypingError(char: string, index: number): void {
        const errorConfig = this.config.effects?.errors;
        if (!errorConfig?.enabled) return;

        // Random chance to make an error
        if (Math.random() < errorConfig.frequency) {
            const typos = errorConfig.typos || ['x', 'z', 'q'];
            const typo = typos[Math.floor(Math.random() * typos.length)];
            
            // Add error animation
            this.element.classList.add('typewriter-error');
            
            // Remove error class after animation
            setTimeout(() => {
                this.element.classList.remove('typewriter-error');
            }, 300);
            
            // Simulate correction after delay
            setTimeout(() => {
                this.simulateCorrection(typo, char);
            }, errorConfig.correctionDelay || 800);
        }
    }

    /**
     * Simulate typing correction
     */
    private simulateCorrection(typo: string, correctChar: string): void {
        // This would need integration with the main WritingJS class
        // For now, just add visual feedback
        const correctionSpan = document.createElement('span');
        correctionSpan.textContent = correctChar;
        correctionSpan.style.backgroundColor = '#90EE90';
        correctionSpan.style.transition = 'background-color 0.5s ease';
        
        setTimeout(() => {
            correctionSpan.style.backgroundColor = 'transparent';
        }, 500);
    }

    /**
     * Hide cursor
     */
    private hideCursor(): void {
        const cursor = this.element.querySelector('.writing-cursor');
        if (cursor) {
            (cursor as HTMLElement).style.opacity = '0';
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
     * Destroy typewriter
     */
    public destroy(): void {
        if (this.writingInstance) {
            this.writingInstance.destroy();
            this.writingInstance = null;
        }
        
        // Remove custom styles
        this.element.classList.remove('typewriter-error');
        
        // Clean up any added elements
        const animatedChars = this.element.querySelectorAll('.typewriter-char');
        animatedChars.forEach(char => {
            const textNode = document.createTextNode(char.textContent || '');
            char.parentNode?.replaceChild(textNode, char);
        });
    }

    /**
     * Static factory method
     */
    public static create(element: string | HTMLElement, config?: Partial<WritingConfig>): TypeWriter {
        return new TypeWriter(element, config);
    }
}