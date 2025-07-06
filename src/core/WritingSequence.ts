// WritingSequence - Chain multiple writing animations
// Enhanced Typography Animation Library v2.0.0

import { WritingJS } from './WritingJS';
import { WritingConfig } from '../types/WritingTypes';
import { EventEmitter } from '../utils/EventEmitter';

export interface SequenceStep {
    type: 'write' | 'wait' | 'clear' | 'callback';
    selector?: string;
    element?: HTMLElement;
    words?: string[];
    config?: Partial<WritingConfig>;
    duration?: number;
    callback?: () => void;
}

export class WritingSequence extends EventEmitter {
    private steps: SequenceStep[] = [];
    private currentStep = 0;
    private isRunning = false;
    private isPaused = false;
    private writers: Map<string, WritingJS> = new Map();
    private id: string;

    constructor() {
        super();
        this.id = this.generateId();
    }

    /**
     * Add a writing step to the sequence
     */
    public add(
        selector: string | HTMLElement, 
        words: string[], 
        config?: Partial<WritingConfig>
    ): this {
        this.steps.push({
            type: 'write',
            selector: typeof selector === 'string' ? selector : undefined,
            element: typeof selector !== 'string' ? selector : undefined,
            words,
            config
        });
        return this;
    }

    /**
     * Add a wait step to the sequence
     */
    public wait(duration: number): this {
        this.steps.push({
            type: 'wait',
            duration
        });
        return this;
    }

    /**
     * Add a clear step to the sequence
     */
    public clearElement(selector: string | HTMLElement): this {
        this.steps.push({
            type: 'clear',
            selector: typeof selector === 'string' ? selector : undefined,
            element: typeof selector !== 'string' ? selector : undefined
        });
        return this;
    }

    /**
     * Add a callback step to the sequence
     */
    public callback(callback: () => void): this {
        this.steps.push({
            type: 'callback',
            callback
        });
        return this;
    }

    /**
     * Run the sequence
     */
    public async run(): Promise<void> {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentStep = 0;
        this.emit('start');

        try {
            while (this.currentStep < this.steps.length && this.isRunning) {
                if (this.isPaused) {
                    await this.waitForResume();
                }
                
                const step = this.steps[this.currentStep];
                await this.executeStep(step);
                
                this.currentStep++;
                this.emit('stepComplete', this.currentStep - 1, step);
            }
            
            this.emit('complete');
        } catch (error) {
            this.emit('error', error);
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Execute a single step
     */
    private async executeStep(step: SequenceStep): Promise<void> {
        switch (step.type) {
            case 'write':
                await this.executeWriteStep(step);
                break;
            case 'wait':
                await this.executeWaitStep(step);
                break;
            case 'clear':
                await this.executeClearStep(step);
                break;
            case 'callback':
                await this.executeCallbackStep(step);
                break;
        }
    }

    /**
     * Execute a write step
     */
    private async executeWriteStep(step: SequenceStep): Promise<void> {
        if (!step.words || (!step.selector && !step.element)) return;
        
        const element = step.element || step.selector!;
        const writerId = this.getWriterId(element);
        
        // Create or get existing writer
        let writer = this.writers.get(writerId);
        if (!writer) {
            writer = new WritingJS(element, {
                words: step.words,
                ...step.config
            });
            this.writers.set(writerId, writer);
        } else {
            writer.setWords(step.words);
            if (step.config) {
                writer.setOptions(step.config);
            }
        }
        
        // Wait for animation to complete
        return new Promise((resolve) => {
            writer!.once('complete', () => resolve());
            writer!.start();
        });
    }

    /**
     * Execute a wait step
     */
    private async executeWaitStep(step: SequenceStep): Promise<void> {
        if (!step.duration) return;
        
        return new Promise((resolve) => {
            setTimeout(resolve, step.duration);
        });
    }

    /**
     * Execute a clear step
     */
    private async executeClearStep(step: SequenceStep): Promise<void> {
        if (!step.selector && !step.element) return;
        
        const element = step.element || step.selector!;
        const writerId = this.getWriterId(element);
        const writer = this.writers.get(writerId);
        
        if (writer) {
            writer.stop();
            // Clear the element content
            if (typeof element === 'string') {
                const el = document.querySelector(element);
                if (el) el.innerHTML = '';
            } else {
                element.innerHTML = '';
            }
        }
    }

    /**
     * Execute a callback step
     */
    private async executeCallbackStep(step: SequenceStep): Promise<void> {
        if (step.callback) {
            try {
                await step.callback();
            } catch (error) {
                console.error('Callback error:', error);
            }
        }
    }

    /**
     * Get writer ID for element
     */
    private getWriterId(element: string | HTMLElement): string {
        if (typeof element === 'string') {
            return element;
        } else {
            return element.id || `element-${element.tagName}-${Math.random().toString(36).substr(2, 9)}`;
        }
    }

    /**
     * Pause the sequence
     */
    public pause(): this {
        if (!this.isRunning || this.isPaused) return this;
        
        this.isPaused = true;
        
        // Pause all active writers
        this.writers.forEach(writer => {
            if (writer.isAnimating()) {
                writer.pause();
            }
        });
        
        this.emit('pause');
        return this;
    }

    /**
     * Resume the sequence
     */
    public resume(): this {
        if (!this.isRunning || !this.isPaused) return this;
        
        this.isPaused = false;
        
        // Resume all paused writers
        this.writers.forEach(writer => {
            if (writer.getState().isPaused) {
                writer.resume();
            }
        });
        
        this.emit('resume');
        return this;
    }

    /**
     * Stop the sequence
     */
    public stop(): this {
        this.isRunning = false;
        this.isPaused = false;
        
        // Stop all writers
        this.writers.forEach(writer => writer.stop());
        
        this.emit('stop');
        return this;
    }

    /**
     * Wait for resume
     */
    private async waitForResume(): Promise<void> {
        return new Promise((resolve) => {
            const checkResume = () => {
                if (!this.isPaused) {
                    resolve();
                } else {
                    setTimeout(checkResume, 100);
                }
            };
            checkResume();
        });
    }

    /**
     * Get current step
     */
    public getCurrentStep(): number {
        return this.currentStep;
    }

    /**
     * Get total steps
     */
    public getTotalSteps(): number {
        return this.steps.length;
    }

    /**
     * Get progress (0-1)
     */
    public getProgress(): number {
        return this.steps.length > 0 ? this.currentStep / this.steps.length : 0;
    }

    /**
     * Check if sequence is running
     */
    public isSequenceRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Check if sequence is paused
     */
    public isSequencePaused(): boolean {
        return this.isPaused;
    }

    /**
     * Get sequence ID
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Clear all steps
     */
    public clearSteps(): this {
        this.stop();
        this.steps = [];
        this.currentStep = 0;
        return this;
    }

    /**
     * Clone sequence
     */
    public clone(): WritingSequence {
        const clone = new WritingSequence();
        clone.steps = [...this.steps];
        return clone;
    }

    /**
     * Destroy sequence and cleanup
     */
    public destroy(): void {
        this.stop();
        
        // Destroy all writers
        this.writers.forEach(writer => writer.destroy());
        this.writers.clear();
        
        // Clear steps
        this.steps = [];
        
        // Remove all listeners
        this.removeAllListeners();
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `sequence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Static method to create and run a sequence
     */
    public static create(): WritingSequence {
        return new WritingSequence();
    }

    /**
     * Static method to sync multiple sequences
     */
    public static sync(sequences: WritingSequence[]): Promise<void[]> {
        return Promise.all(sequences.map(seq => seq.run()));
    }
}