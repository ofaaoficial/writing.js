// Main WritingJS class - Enhanced Typography Animation Library v2.0.0

import { EventEmitter } from '../utils/EventEmitter';
import { DOMUtils } from '../utils/DOMUtils';
import { ValidationUtils } from '../utils/ValidationUtils';
import { 
    WritingConfig, 
    WritingState, 
    WritingEvents, 
    PerformanceMetrics,
    AnimationFrame
} from '../types/WritingTypes';

export class WritingJS extends EventEmitter {
    private config: WritingConfig;
    private element: HTMLElement;
    private cursorElement: HTMLElement | null = null;
    private state: WritingState;
    private animationFrame: AnimationFrame | null = null;
    private metrics: PerformanceMetrics;
    private audioContext: AudioContext | null = null;
    private soundBuffers: Map<string, AudioBuffer> = new Map();
    private intersectionObserver: IntersectionObserver | null = null;
    private isDestroyed = false;
    private pausedByVisibility = false;
    private id: string;

    constructor(element: string | HTMLElement, config: Partial<WritingConfig> = {}) {
        super();
        
        this.id = this.generateId();
        this.element = ValidationUtils.validateElement(element);
        this.config = ValidationUtils.validateConfig({
            element: this.element,
            words: config.words || this.getWordsFromElement(),
            ...config
        });
        
        this.state = this.initializeState();
        this.metrics = this.initializeMetrics();
        
        this.setupElement();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupAudioContext();
    }

    /**
     * Initialize animation state
     */
    private initializeState(): WritingState {
        return {
            isRunning: false,
            isPaused: false,
            currentWordIndex: 0,
            currentCharIndex: 0,
            currentWord: '',
            progress: 0,
            startTime: 0,
            elapsedTime: 0
        };
    }

    /**
     * Initialize performance metrics
     */
    private initializeMetrics(): PerformanceMetrics {
        return {
            frameDrops: 0,
            averageFPS: 0,
            memoryUsage: 0,
            animationDuration: 0,
            lastFrameTime: 0
        };
    }

    /**
     * Setup element and cursor
     */
    private setupElement(): void {
        // Store original content
        const originalContent = this.element.innerHTML;
        DOMUtils.cacheElementData(this.element, 'originalContent', originalContent);
        
        // Apply custom styles
        if (this.config.styles && this.config.styles.length > 0) {
            DOMUtils.applyStylesFromArray(this.element, this.config.styles);
        }
        
        // Setup cursor
        if (this.config.cursor?.enabled) {
            this.setupCursor();
        }
        
        // Setup pause on hover
        if (this.config.pauseOnHover) {
            this.setupHoverEvents();
        }
    }

    /**
     * Setup cursor element
     */
    private setupCursor(): void {
        if (!this.config.cursor) return;
        
        this.cursorElement = DOMUtils.createElement('span', {
            class: 'writing-cursor',
            innerHTML: this.config.cursor.character
        });
        
        DOMUtils.applyStylesFromArray(this.cursorElement, [
            this.config.cursor.style,
            'display: inline-block'
        ]);
        
        this.element.appendChild(this.cursorElement);
        this.startCursorBlink();
    }

    /**
     * Start cursor blinking animation
     */
    private startCursorBlink(): void {
        if (!this.cursorElement) return;
        
        const blinkAnimation = () => {
            if (this.cursorElement && !this.isDestroyed) {
                this.cursorElement.style.opacity = 
                    this.cursorElement.style.opacity === '0' ? '1' : '0';
                
                setTimeout(blinkAnimation, this.config.cursor?.blinkSpeed || 500);
            }
        };
        
        blinkAnimation();
    }

    /**
     * Setup hover event listeners
     */
    private setupHoverEvents(): void {
        this.element.addEventListener('mouseenter', () => {
            if (this.state.isRunning && !this.state.isPaused) {
                this.pause();
            }
        });
        
        this.element.addEventListener('mouseleave', () => {
            if (this.state.isPaused) {
                this.resume();
            }
        });
    }

    /**
     * Setup intersection observer for visibility optimization
     */
    private setupIntersectionObserver(): void {
        if (!ValidationUtils.supports('intersectionObserver')) return;
        
        this.intersectionObserver = DOMUtils.observeVisibility(
            this.element,
            (isVisible) => {
                if (!isVisible && this.state.isRunning && !this.state.isPaused) {
                    this.pause();
                    this.pausedByVisibility = true;
                } else if (isVisible && this.pausedByVisibility) {
                    this.resume();
                    this.pausedByVisibility = false;
                }
            },
            { threshold: 0.1 }
        );
    }

    /**
     * Setup audio context for sound effects
     */
    private setupAudioContext(): void {
        if (!this.config.effects?.sound?.enabled || !ValidationUtils.supports('webAudio')) return;
        
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.loadSoundEffects();
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }

    /**
     * Load sound effects
     */
    private async loadSoundEffects(): Promise<void> {
        if (!this.audioContext || !this.config.effects?.sound) return;
        
        const sounds = [
            { name: 'key', url: this.config.effects.sound.keySound },
            { name: 'delete', url: this.config.effects.sound.deleteSound }
        ];
        
        for (const sound of sounds) {
            if (sound.url) {
                try {
                    const buffer = await this.loadAudioBuffer(sound.url);
                    this.soundBuffers.set(sound.name, buffer);
                } catch (error) {
                    console.warn(`Failed to load sound: ${sound.url}`, error);
                }
            }
        }
    }

    /**
     * Load audio buffer
     */
    private async loadAudioBuffer(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext!.decodeAudioData(arrayBuffer);
    }

    /**
     * Play sound effect
     */
    private playSound(soundName: string): void {
        if (!this.audioContext || !this.soundBuffers.has(soundName) || !this.config.effects?.sound) return;
        
        const buffer = this.soundBuffers.get(soundName)!;
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.value = this.config.effects.sound.volume;
        
        if (this.config.effects.sound.randomPitch) {
            source.playbackRate.value = 0.8 + Math.random() * 0.4;
        }
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start();
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Setup config events
        if (this.config.events) {
            Object.entries(this.config.events).forEach(([event, handler]) => {
                if (handler) {
                    this.on(event, handler);
                }
            });
        }
        
        // Setup error handling
        this.on('error', (error) => {
            console.error('WritingJS Error:', error);
            this.cleanup();
        });
    }

    /**
     * Get words from element attributes
     */
    private getWordsFromElement(): string[] {
        const wordsAttr = this.element.getAttribute('wj-words');
        if (wordsAttr) {
            return wordsAttr.split(',').map(word => word.trim()).filter(word => word.length > 0);
        }
        
        const classAttr = this.element.getAttribute('wj-class');
        if (classAttr) {
            const elements = DOMUtils.getElements(`.${classAttr}`);
            return Array.from(elements).map(el => el.textContent || '').filter(text => text.length > 0);
        }
        
        return [];
    }

    /**
     * Start animation
     */
    public start(): this {
        if (this.isDestroyed) {
            throw new Error('WritingJS instance has been destroyed');
        }
        
        if (this.state.isRunning) {
            return this;
        }
        
        this.state.isRunning = true;
        this.state.startTime = performance.now();
        this.emit('start', this.state);
        
        // Clear current content
        this.clearContent();
        
        // Start animation loop
        this.runAnimation();
        
        return this;
    }

    /**
     * Stop animation
     */
    public stop(): this {
        if (!this.state.isRunning) return this;
        
        this.state.isRunning = false;
        this.state.isPaused = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame.id);
            this.animationFrame = null;
        }
        
        this.emit('complete', this.state);
        return this;
    }

    /**
     * Pause animation
     */
    public pause(): this {
        if (!this.state.isRunning || this.state.isPaused) return this;
        
        this.state.isPaused = true;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame.id);
            this.animationFrame = null;
        }
        
        this.emit('pause', this.state);
        return this;
    }

    /**
     * Resume animation
     */
    public resume(): this {
        if (!this.state.isRunning || !this.state.isPaused) return this;
        
        this.state.isPaused = false;
        this.runAnimation();
        this.emit('resume', this.state);
        return this;
    }

    /**
     * Restart animation
     */
    public restart(): this {
        this.stop();
        this.state = this.initializeState();
        this.start();
        return this;
    }

    /**
     * Main animation loop
     */
    private runAnimation(): void {
        if (!this.state.isRunning || this.state.isPaused) return;
        
        const currentTime = performance.now();
        this.updateMetrics(currentTime);
        
        if (this.state.currentWordIndex >= this.config.words.length) {
            if (this.config.infinite) {
                this.state.currentWordIndex = 0;
                this.state.currentCharIndex = 0;
                this.clearContent();
            } else {
                this.stop();
                return;
            }
        }
        
        const word = this.config.words[this.state.currentWordIndex];
        this.state.currentWord = word;
        
        // Handle word writing
        if (this.state.currentCharIndex < word.length) {
            this.writeNextCharacter(word, currentTime);
        } else {
            // Word is complete, wait then erase
            this.scheduleErase(currentTime);
        }
    }

    /**
     * Write next character with optimizations
     */
    private writeNextCharacter(word: string, currentTime: number): void {
        const char = word[this.state.currentCharIndex];
        const delay = this.calculateWriteDelay(char);
        
        // Schedule next character
        this.animationFrame = {
            id: requestAnimationFrame(() => {
                if (this.state.isRunning && !this.state.isPaused) {
                    // Add character to element
                    this.addCharacter(char);
                    
                    // Play sound effect
                    if (this.config.effects.sound.enabled) {
                        this.playSound('key');
                    }
                    
                    // Apply visual effects
                    this.applyVisualEffects(char);
                    
                    // Update state
                    this.state.currentCharIndex++;
                    this.updateProgress();
                    
                    // Emit event
                    this.emit('characterWrite', char, this.state.currentCharIndex - 1);
                    
                    // Continue animation
                    setTimeout(() => this.runAnimation(), delay);
                }
            }),
            timestamp: currentTime,
            callback: () => {}
        };
    }

    /**
     * Calculate write delay with randomization
     */
    private calculateWriteDelay(char: string): number {
        let delay = this.config.times.writer;
        
        // Add randomization
        if (this.config.effects.typing.randomSpeed) {
            const variation = this.config.effects.typing.speedVariation;
            delay += (Math.random() - 0.5) * delay * variation;
        }
        
        // Pause on punctuation
        if (this.config.effects.typing.pauseOnPunctuation && /[.,!?;:]/.test(char)) {
            delay += this.config.effects.typing.punctuationDelay;
        }
        
        return Math.max(10, delay); // Minimum delay
    }

    /**
     * Add character to element
     */
    private addCharacter(char: string): void {
        const textNode = document.createTextNode(char);
        
        if (this.cursorElement) {
            this.element.insertBefore(textNode, this.cursorElement);
        } else {
            this.element.appendChild(textNode);
        }
    }

    /**
     * Apply visual effects to character
     */
    private applyVisualEffects(char: string): void {
        if (this.config.effects.visual.fadeIn) {
            // Implement fade in effect
        }
        
        if (this.config.effects.visual.shake) {
            // Implement shake effect
        }
        
        if (this.config.effects.visual.glitch) {
            // Implement glitch effect
        }
    }

    /**
     * Schedule erase operation
     */
    private scheduleErase(currentTime: number): void {
        setTimeout(() => {
            if (this.state.isRunning && !this.state.isPaused) {
                this.eraseCurrentWord();
            }
        }, this.config.times.read);
    }

    /**
     * Erase current word
     */
    private eraseCurrentWord(): void {
        const eraseLoop = () => {
            if (!this.state.isRunning || this.state.isPaused) return;
            
            const textContent = this.getTextContent();
            if (textContent.length > 0) {
                // Remove last character
                this.removeLastCharacter();
                
                // Play sound
                if (this.config.effects.sound.enabled) {
                    this.playSound('delete');
                }
                
                // Continue erasing
                setTimeout(eraseLoop, this.config.times.eraser);
            } else {
                // Word fully erased, move to next
                this.state.currentWordIndex++;
                this.state.currentCharIndex = 0;
                this.emit('wordComplete', this.state.currentWord, this.state.currentWordIndex - 1);
                
                setTimeout(() => this.runAnimation(), this.config.animation.delay);
            }
        };
        
        eraseLoop();
    }

    /**
     * Remove last character
     */
    private removeLastCharacter(): void {
        const textNodes = this.getTextNodes();
        if (textNodes.length > 0) {
            const lastNode = textNodes[textNodes.length - 1];
            if (lastNode.textContent && lastNode.textContent.length > 0) {
                lastNode.textContent = lastNode.textContent.slice(0, -1);
                if (lastNode.textContent.length === 0) {
                    lastNode.remove();
                }
            }
        }
    }

    /**
     * Get text nodes (excluding cursor)
     */
    private getTextNodes(): Text[] {
        const walker = document.createTreeWalker(
            this.element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    return node.parentNode === this.element ? 
                        NodeFilter.FILTER_ACCEPT : 
                        NodeFilter.FILTER_REJECT;
                }
            }
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
     * Get current text content (excluding cursor)
     */
    private getTextContent(): string {
        return this.getTextNodes().map(node => node.textContent || '').join('');
    }

    /**
     * Clear content but preserve cursor
     */
    private clearContent(): void {
        const textNodes = this.getTextNodes();
        textNodes.forEach(node => node.remove());
    }

    /**
     * Update progress and metrics
     */
    private updateProgress(): void {
        const totalChars = this.config.words.reduce((sum, word) => sum + word.length, 0);
        const currentChars = this.state.currentWordIndex * this.config.words.length + this.state.currentCharIndex;
        this.state.progress = Math.min(currentChars / totalChars, 1);
        this.state.elapsedTime = performance.now() - this.state.startTime;
    }

    /**
     * Update performance metrics
     */
    private updateMetrics(currentTime: number): void {
        if (this.metrics.lastFrameTime > 0) {
            const frameDuration = currentTime - this.metrics.lastFrameTime;
            const fps = 1000 / frameDuration;
            
            if (fps < 50) {
                this.metrics.frameDrops++;
            }
            
            this.metrics.averageFPS = (this.metrics.averageFPS + fps) / 2;
        }
        
        this.metrics.lastFrameTime = currentTime;
        this.metrics.animationDuration = this.state.elapsedTime;
        
        // Memory usage (approximate)
        if (performance.memory) {
            this.metrics.memoryUsage = (performance.memory as any).usedJSHeapSize;
        }
    }

    /**
     * Public API methods
     */
    public setWords(words: string[]): this {
        this.config.words = ValidationUtils.validateWords(words);
        return this;
    }

    public setSpeed(speed: number): this {
        this.config.times.writer = speed;
        return this;
    }

    public setOptions(options: Partial<WritingConfig>): this {
        this.config = ValidationUtils.validateConfig({ ...this.config, ...options });
        return this;
    }

    public isAnimating(): boolean {
        return this.state.isRunning && !this.state.isPaused;
    }

    public getCurrentWord(): string {
        return this.state.currentWord;
    }

    public getProgress(): number {
        return this.state.progress;
    }

    public getState(): WritingState {
        return { ...this.state };
    }

    public getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    public getId(): string {
        return this.id;
    }

    /**
     * Cleanup resources
     */
    public destroy(): void {
        if (this.isDestroyed) return;
        
        this.isDestroyed = true;
        this.stop();
        
        // Cleanup DOM
        if (this.cursorElement) {
            this.cursorElement.remove();
        }
        
        // Cleanup observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Cleanup audio
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        // Clear caches
        DOMUtils.clearElementCache(this.element);
        
        // Remove event listeners
        this.removeAllListeners();
        
        // Restore original content
        const originalContent = DOMUtils.getCachedElementData(this.element, 'originalContent');
        if (originalContent) {
            this.element.innerHTML = originalContent;
        }
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `writing-js-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Private cleanup method
     */
    private cleanup(): void {
        this.destroy();
    }
}