// GlitchWriter Effect - Enhanced Typography Animation Library v2.0.0

import { WritingJS } from '../core/WritingJS';
import { WritingConfig } from '../types/WritingTypes';
import { DOMUtils } from '../utils/DOMUtils';

export class GlitchWriter {
    private element: HTMLElement;
    private config: Partial<WritingConfig>;
    private writingInstance: WritingJS | null = null;
    private glitchElements: HTMLElement[] = [];
    private glitchInterval: number | null = null;
    private glitchChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□', '▪', '▫', '◆', '◇', '◈', '◉', '◎', '●', '○'];

    constructor(element: string | HTMLElement, config: Partial<WritingConfig> = {}) {
        this.element = typeof element === 'string' ? 
            document.querySelector(element) as HTMLElement : element;
        
        if (!this.element) {
            throw new Error('Element not found');
        }
        
        this.config = this.mergeGlitchConfig(config);
        this.setupGlitchStyles();
    }

    /**
     * Merge glitch-specific configuration
     */
    private mergeGlitchConfig(config: Partial<WritingConfig>): Partial<WritingConfig> {
        return {
            times: {
                writer: 120,
                eraser: 80,
                read: 2000,
                ...config.times
            },
            cursor: {
                enabled: true,
                character: '█',
                blinkSpeed: 300,
                style: 'color: #00ff00; text-shadow: 0 0 5px #00ff00;',
                hideOnComplete: false,
                ...config.cursor
            },
            effects: {
                sound: {
                    enabled: false,
                    volume: 0.4,
                    randomPitch: true,
                    ...config.effects?.sound
                },
                typing: {
                    randomSpeed: true,
                    speedVariation: 0.5,
                    pauseOnPunctuation: false,
                    punctuationDelay: 100,
                    ...config.effects?.typing
                },
                errors: {
                    enabled: true,
                    frequency: 0.15,
                    correctionDelay: 300,
                    typos: this.glitchChars,
                    ...config.effects?.errors
                },
                visual: {
                    fadeIn: false,
                    slideIn: false,
                    glitch: true,
                    shake: true,
                    ...config.effects?.visual
                }
            },
            animation: {
                infinite: false,
                pauseOnHover: false,
                direction: 'forward',
                easing: 'linear',
                delay: 0,
                ...config.animation
            },
            ...config
        };
    }

    /**
     * Setup glitch-specific styles and animations
     */
    private setupGlitchStyles(): void {
        const glitchStyles = [
            'font-family: "Courier New", "Liberation Mono", monospace',
            'background-color: #000000',
            'color: #00ff00',
            'text-shadow: 0 0 3px #00ff00',
            'position: relative',
            'overflow: hidden',
            ...(this.config.styles || [])
        ];

        DOMUtils.applyStylesFromArray(this.element, glitchStyles);
        this.addGlitchAnimations();
    }

    /**
     * Add CSS animations for glitch effects
     */
    private addGlitchAnimations(): void {
        const animations = [
            `
            @keyframes glitch-1 {
                0% { transform: translateX(0); }
                20% { transform: translateX(-2px); }
                40% { transform: translateX(2px); }
                60% { transform: translateX(-1px); }
                80% { transform: translateX(1px); }
                100% { transform: translateX(0); }
            }
            `,
            `
            @keyframes glitch-2 {
                0% { transform: translateY(0); }
                20% { transform: translateY(-1px); }
                40% { transform: translateY(1px); }
                60% { transform: translateY(-2px); }
                80% { transform: translateY(2px); }
                100% { transform: translateY(0); }
            }
            `,
            `
            @keyframes glitch-text {
                0% { 
                    text-shadow: 0 0 3px #00ff00;
                    color: #00ff00;
                }
                25% { 
                    text-shadow: -2px 0 #ff0000, 2px 0 #00ffff;
                    color: #ffffff;
                }
                50% { 
                    text-shadow: 0 0 5px #ff00ff;
                    color: #ff00ff;
                }
                75% { 
                    text-shadow: 2px 0 #ffff00, -2px 0 #ff0000;
                    color: #ffff00;
                }
                100% { 
                    text-shadow: 0 0 3px #00ff00;
                    color: #00ff00;
                }
            }
            `,
            `
            @keyframes glitch-cursor {
                0%, 50% { 
                    opacity: 1;
                    text-shadow: 0 0 8px #00ff00;
                }
                51%, 100% { 
                    opacity: 0.3;
                    text-shadow: 0 0 3px #00ff00;
                }
            }
            `,
            `
            @keyframes glitch-bg {
                0% { background-color: #000000; }
                10% { background-color: #001100; }
                20% { background-color: #000000; }
                30% { background-color: #110000; }
                40% { background-color: #000000; }
                50% { background-color: #000011; }
                60% { background-color: #000000; }
                70% { background-color: #001111; }
                80% { background-color: #000000; }
                90% { background-color: #110011; }
                100% { background-color: #000000; }
            }
            `,
            `
            @keyframes glitch-char {
                0% { 
                    opacity: 0;
                    transform: scaleX(0) scaleY(2);
                    filter: blur(2px);
                }
                50% { 
                    opacity: 1;
                    transform: scaleX(1.2) scaleY(0.8);
                    filter: blur(0px);
                }
                100% { 
                    opacity: 1;
                    transform: scaleX(1) scaleY(1);
                    filter: blur(0px);
                }
            }
            `,
            `
            .glitch-char {
                animation: glitch-char 0.3s ease-out;
                display: inline-block;
            }
            `,
            `
            .glitch-text {
                animation: glitch-text 0.5s ease-in-out;
            }
            `,
            `
            .glitch-shake {
                animation: glitch-1 0.1s infinite, glitch-2 0.15s infinite;
            }
            `,
            `
            .glitch-cursor {
                animation: glitch-cursor 0.3s infinite;
            }
            `,
            `
            .glitch-bg {
                animation: glitch-bg 0.8s infinite;
            }
            `,
            `
            .glitch-error {
                color: #ff0000;
                text-shadow: 0 0 5px #ff0000;
                animation: glitch-text 0.2s ease-in-out;
            }
            `,
            `
            .glitch-phantom {
                position: absolute;
                color: rgba(255, 0, 0, 0.3);
                pointer-events: none;
                animation: glitch-1 0.1s infinite;
            }
            `
        ];

        const styleElement = document.createElement('style');
        styleElement.textContent = animations.join('\n');
        document.head.appendChild(styleElement);
    }

    /**
     * Start glitch animation
     */
    public start(): this {
        if (!this.writingInstance) {
            this.writingInstance = new WritingJS(this.element, this.config);
            this.setupGlitchEvents();
        }
        
        this.writingInstance.start();
        this.startGlitchBackground();
        return this;
    }

    /**
     * Stop glitch animation
     */
    public stop(): this {
        if (this.writingInstance) {
            this.writingInstance.stop();
        }
        this.stopGlitchBackground();
        return this;
    }

    /**
     * Pause glitch animation
     */
    public pause(): this {
        if (this.writingInstance) {
            this.writingInstance.pause();
        }
        this.stopGlitchBackground();
        return this;
    }

    /**
     * Resume glitch animation
     */
    public resume(): this {
        if (this.writingInstance) {
            this.writingInstance.resume();
        }
        this.startGlitchBackground();
        return this;
    }

    /**
     * Restart glitch animation
     */
    public restart(): this {
        if (this.writingInstance) {
            this.writingInstance.restart();
        }
        return this;
    }

    /**
     * Set words for glitch effect
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
     * Set glitch speed
     */
    public setSpeed(speed: number): this {
        if (this.writingInstance) {
            this.writingInstance.setSpeed(speed);
        } else {
            if (!this.config.times) this.config.times = { writer: 120, eraser: 80, read: 2000 };
            this.config.times.writer = speed;
        }
        return this;
    }

    /**
     * Setup glitch-specific events
     */
    private setupGlitchEvents(): void {
        if (!this.writingInstance) return;

        // Add glitch effects to characters
        this.writingInstance.on('characterWrite', (char: string, index: number) => {
            this.glitchCharacter(char, index);
        });

        // Add glitch errors
        this.writingInstance.on('characterWrite', (char: string, index: number) => {
            this.handleGlitchError(char, index);
        });

        // Setup glitch cursor
        this.writingInstance.on('start', () => {
            this.setupGlitchCursor();
        });

        // Add phantom text effect
        this.writingInstance.on('wordStart', (word: string, index: number) => {
            this.createPhantomText(word);
        });
    }

    /**
     * Apply glitch effect to character
     */
    private glitchCharacter(char: string, index: number): void {
        const textNodes = this.getTextNodes();
        const lastNode = textNodes[textNodes.length - 1];
        
        if (lastNode && lastNode.textContent) {
            const lastChar = lastNode.textContent.slice(-1);
            if (lastChar === char) {
                // Wrap character for glitch animation
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'glitch-char';
                
                // Replace text node
                const newText = lastNode.textContent.slice(0, -1);
                lastNode.textContent = newText;
                
                if (lastNode.parentNode) {
                    lastNode.parentNode.insertBefore(charSpan, lastNode.nextSibling);
                }
                
                this.glitchElements.push(charSpan);
                
                // Random glitch effects
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        charSpan.classList.add('glitch-text');
                        setTimeout(() => {
                            charSpan.classList.remove('glitch-text');
                        }, 500);
                    }, Math.random() * 100);
                }
                
                // Remove animation class
                setTimeout(() => {
                    charSpan.classList.remove('glitch-char');
                }, 300);
            }
        }
    }

    /**
     * Handle glitch errors
     */
    private handleGlitchError(char: string, index: number): void {
        const errorConfig = this.config.effects?.errors;
        if (!errorConfig?.enabled) return;

        if (Math.random() < errorConfig.frequency) {
            // Show glitch character temporarily
            const glitchChar = this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
            
            // Find the last character span
            const lastSpan = this.glitchElements[this.glitchElements.length - 1];
            if (lastSpan) {
                const originalChar = lastSpan.textContent;
                lastSpan.textContent = glitchChar;
                lastSpan.classList.add('glitch-error');
                
                // Add shake effect
                this.element.classList.add('glitch-shake');
                
                // Restore after delay
                setTimeout(() => {
                    lastSpan.textContent = originalChar;
                    lastSpan.classList.remove('glitch-error');
                    this.element.classList.remove('glitch-shake');
                }, errorConfig.correctionDelay || 300);
            }
        }
    }

    /**
     * Create phantom text effect
     */
    private createPhantomText(word: string): void {
        const phantom = document.createElement('span');
        phantom.textContent = word;
        phantom.className = 'glitch-phantom';
        phantom.style.left = Math.random() * 10 + 'px';
        phantom.style.top = Math.random() * 20 - 10 + 'px';
        
        this.element.appendChild(phantom);
        
        // Remove phantom after animation
        setTimeout(() => {
            phantom.remove();
        }, 500);
    }

    /**
     * Setup glitch cursor
     */
    private setupGlitchCursor(): void {
        const cursor = this.element.querySelector('.writing-cursor');
        if (cursor) {
            cursor.classList.add('glitch-cursor');
        }
    }

    /**
     * Start glitch background effect
     */
    private startGlitchBackground(): void {
        this.element.classList.add('glitch-bg');
        
        // Random glitch intervals
        this.glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) {
                this.element.classList.add('glitch-shake');
                setTimeout(() => {
                    this.element.classList.remove('glitch-shake');
                }, 100);
            }
        }, 500);
    }

    /**
     * Stop glitch background effect
     */
    private stopGlitchBackground(): void {
        this.element.classList.remove('glitch-bg', 'glitch-shake');
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
            this.glitchInterval = null;
        }
    }

    /**
     * Get text nodes
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
     * Set glitch intensity
     */
    public setGlitchIntensity(intensity: number): this {
        const clampedIntensity = Math.max(0, Math.min(1, intensity));
        
        if (this.config.effects?.errors) {
            this.config.effects.errors.frequency = clampedIntensity * 0.3;
        }
        
        // Update animation speeds
        const style = document.createElement('style');
        style.textContent = `
            .glitch-shake {
                animation-duration: ${0.1 / clampedIntensity}s, ${0.15 / clampedIntensity}s;
            }
            .glitch-text {
                animation-duration: ${0.5 / clampedIntensity}s;
            }
        `;
        document.head.appendChild(style);
        
        return this;
    }

    /**
     * Set glitch colors
     */
    public setGlitchColors(colors: string[]): this {
        const colorStops = colors.map((color, index) => {
            const percent = (index / (colors.length - 1)) * 100;
            return `${percent}% { color: ${color}; text-shadow: 0 0 5px ${color}; }`;
        }).join('\n');

        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch-text {
                ${colorStops}
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
     * Destroy glitch writer
     */
    public destroy(): void {
        if (this.writingInstance) {
            this.writingInstance.destroy();
            this.writingInstance = null;
        }
        
        this.stopGlitchBackground();
        
        // Clean up glitch elements
        this.glitchElements.forEach(el => {
            if (el.parentNode) {
                const textNode = document.createTextNode(el.textContent || '');
                el.parentNode.replaceChild(textNode, el);
            }
        });
        this.glitchElements = [];
        
        // Remove glitch classes
        this.element.classList.remove('glitch-bg', 'glitch-shake');
        
        // Clean up phantom elements
        const phantoms = this.element.querySelectorAll('.glitch-phantom');
        phantoms.forEach(phantom => phantom.remove());
        
        // Clean up glitch spans
        const glitchSpans = this.element.querySelectorAll('.glitch-char, .glitch-text, .glitch-error');
        glitchSpans.forEach(span => {
            const textNode = document.createTextNode(span.textContent || '');
            span.parentNode?.replaceChild(textNode, span);
        });
    }

    /**
     * Static factory method
     */
    public static create(element: string | HTMLElement, config?: Partial<WritingConfig>): GlitchWriter {
        return new GlitchWriter(element, config);
    }
}