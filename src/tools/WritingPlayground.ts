// WritingPlayground - Interactive testing tool for Writing.js v2.0.0

import { WritingJS } from '../core/WritingJS';
import { WritingSequence } from '../core/WritingSequence';
import { TypeWriter } from '../effects/TypeWriter';
import { FadeWriter } from '../effects/FadeWriter';
import { GlitchWriter } from '../effects/GlitchWriter';
import { WritingConfig, WritingState, PerformanceMetrics } from '../types/WritingTypes';
import { DOMUtils } from '../utils/DOMUtils';

export interface PlaygroundConfig {
    container: string | HTMLElement;
    showControls?: boolean;
    showMetrics?: boolean;
    allowEditing?: boolean;
    exportConfig?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    presets?: PlaygroundPreset[];
}

export interface PlaygroundPreset {
    name: string;
    description: string;
    config: Partial<WritingConfig>;
    words: string[];
    effect?: 'typewriter' | 'fade' | 'glitch' | 'custom';
}

export class WritingPlayground {
    private container: HTMLElement;
    private config: PlaygroundConfig;
    private currentInstance: WritingJS | TypeWriter | FadeWriter | GlitchWriter | null = null;
    private currentPreset: PlaygroundPreset | null = null;
    private previewElement: HTMLElement | null = null;
    private controlsElement: HTMLElement | null = null;
    private metricsElement: HTMLElement | null = null;
    private configEditorElement: HTMLElement | null = null;
    private isDestroyed = false;

    constructor(config: PlaygroundConfig) {
        this.container = typeof config.container === 'string' 
            ? document.querySelector(config.container) as HTMLElement 
            : config.container;

        if (!this.container) {
            throw new Error('Playground container not found');
        }

        this.config = {
            showControls: true,
            showMetrics: true,
            allowEditing: true,
            exportConfig: true,
            theme: 'auto',
            presets: this.getDefaultPresets(),
            ...config
        };

        this.init();
    }

    /**
     * Initialize playground
     */
    private init(): void {
        this.setupContainer();
        this.createLayout();
        this.setupEventListeners();
        this.loadDefaultPreset();
    }

    /**
     * Setup container styles
     */
    private setupContainer(): void {
        this.container.classList.add('writing-playground');
        
        DOMUtils.applyStyles(this.container, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: this.config.theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: this.config.theme === 'dark' ? '#ffffff' : '#000000',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            position: 'relative'
        });

        this.addPlaygroundStyles();
    }

    /**
     * Add CSS styles for playground
     */
    private addPlaygroundStyles(): void {
        const styles = `
            .writing-playground {
                display: grid;
                grid-template-columns: 1fr 300px;
                gap: 20px;
                min-height: 400px;
            }
            
            .playground-main {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .playground-preview {
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#f8f9fa'};
                border: 2px dashed ${this.config.theme === 'dark' ? '#444' : '#dee2e6'};
                border-radius: 6px;
                padding: 40px 20px;
                text-align: center;
                font-size: 24px;
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .playground-controls {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .playground-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background: #007bff;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .playground-btn:hover {
                background: #0056b3;
            }
            
            .playground-btn:disabled {
                background: #6c757d;
                cursor: not-allowed;
            }
            
            .playground-sidebar {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .playground-section {
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#f8f9fa'};
                border-radius: 6px;
                padding: 15px;
            }
            
            .playground-section h3 {
                margin: 0 0 10px 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .playground-preset {
                display: block;
                width: 100%;
                padding: 8px 12px;
                margin-bottom: 5px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: transparent;
                color: inherit;
                cursor: pointer;
                text-align: left;
                transition: background-color 0.2s;
            }
            
            .playground-preset:hover {
                background: ${this.config.theme === 'dark' ? '#3a3a3a' : '#e9ecef'};
            }
            
            .playground-preset.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            
            .playground-metrics {
                font-family: monospace;
                font-size: 12px;
                line-height: 1.4;
            }
            
            .playground-config-editor {
                width: 100%;
                height: 200px;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: ${this.config.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
                color: inherit;
                resize: vertical;
            }
            
            @media (max-width: 768px) {
                .writing-playground {
                    grid-template-columns: 1fr;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    /**
     * Create playground layout
     */
    private createLayout(): void {
        this.container.innerHTML = `
            <div class="playground-main">
                <div class="playground-preview" id="playground-preview">
                    Click a preset or customize your animation...
                </div>
                ${this.config.showControls ? this.createControlsHTML() : ''}
            </div>
            <div class="playground-sidebar">
                ${this.createPresetsHTML()}
                ${this.config.showMetrics ? this.createMetricsHTML() : ''}
                ${this.config.allowEditing ? this.createConfigEditorHTML() : ''}
            </div>
        `;

        this.previewElement = this.container.querySelector('#playground-preview');
        this.controlsElement = this.container.querySelector('#playground-controls');
        this.metricsElement = this.container.querySelector('#playground-metrics');
        this.configEditorElement = this.container.querySelector('#playground-config-editor');
    }

    /**
     * Create controls HTML
     */
    private createControlsHTML(): string {
        return `
            <div class="playground-controls" id="playground-controls">
                <button class="playground-btn" data-action="start">Start</button>
                <button class="playground-btn" data-action="stop">Stop</button>
                <button class="playground-btn" data-action="pause">Pause</button>
                <button class="playground-btn" data-action="resume">Resume</button>
                <button class="playground-btn" data-action="restart">Restart</button>
                ${this.config.exportConfig ? '<button class="playground-btn" data-action="export">Export Config</button>' : ''}
            </div>
        `;
    }

    /**
     * Create presets HTML
     */
    private createPresetsHTML(): string {
        const presetsHTML = this.config.presets!.map(preset => `
            <button class="playground-preset" data-preset="${preset.name}">
                <strong>${preset.name}</strong><br>
                <small>${preset.description}</small>
            </button>
        `).join('');

        return `
            <div class="playground-section">
                <h3>Presets</h3>
                ${presetsHTML}
            </div>
        `;
    }

    /**
     * Create metrics HTML
     */
    private createMetricsHTML(): string {
        return `
            <div class="playground-section">
                <h3>Performance Metrics</h3>
                <div class="playground-metrics" id="playground-metrics">
                    <div>FPS: <span id="fps">--</span></div>
                    <div>Progress: <span id="progress">--</span></div>
                    <div>State: <span id="state">--</span></div>
                    <div>Memory: <span id="memory">--</span></div>
                </div>
            </div>
        `;
    }

    /**
     * Create config editor HTML
     */
    private createConfigEditorHTML(): string {
        return `
            <div class="playground-section">
                <h3>Configuration</h3>
                <textarea class="playground-config-editor" id="playground-config-editor" 
                          placeholder="Edit configuration JSON..."></textarea>
                <button class="playground-btn" data-action="apply-config">Apply Config</button>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Control buttons
        if (this.controlsElement) {
            this.controlsElement.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const action = target.getAttribute('data-action');
                
                if (action) {
                    this.handleControlAction(action);
                }
            });
        }

        // Preset buttons
        this.container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const preset = target.closest('[data-preset]') as HTMLElement;
            
            if (preset) {
                const presetName = preset.getAttribute('data-preset');
                this.loadPreset(presetName!);
            }
        });

        // Config editor
        if (this.configEditorElement) {
            this.container.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.getAttribute('data-action') === 'apply-config') {
                    this.applyCustomConfig();
                }
            });
        }
    }

    /**
     * Handle control actions
     */
    private handleControlAction(action: string): void {
        if (!this.currentInstance) return;

        switch (action) {
            case 'start':
                this.currentInstance.start();
                break;
            case 'stop':
                this.currentInstance.stop();
                break;
            case 'pause':
                this.currentInstance.pause();
                break;
            case 'resume':
                this.currentInstance.resume();
                break;
            case 'restart':
                this.currentInstance.restart();
                break;
            case 'export':
                this.exportConfig();
                break;
        }
    }

    /**
     * Load preset by name
     */
    private loadPreset(presetName: string): void {
        const preset = this.config.presets!.find(p => p.name === presetName);
        if (!preset) return;

        this.currentPreset = preset;
        this.updateActivePreset(presetName);
        this.createInstanceFromPreset(preset);
        this.updateConfigEditor(preset);
    }

    /**
     * Update active preset UI
     */
    private updateActivePreset(presetName: string): void {
        const presets = this.container.querySelectorAll('[data-preset]');
        presets.forEach(preset => preset.classList.remove('active'));
        
        const activePreset = this.container.querySelector(`[data-preset="${presetName}"]`);
        if (activePreset) {
            activePreset.classList.add('active');
        }
    }

    /**
     * Create instance from preset
     */
    private createInstanceFromPreset(preset: PlaygroundPreset): void {
        if (this.currentInstance) {
            this.currentInstance.destroy();
        }

        if (!this.previewElement) return;

        // Clear preview element
        this.previewElement.innerHTML = '';

        // Create appropriate instance based on effect
        switch (preset.effect) {
            case 'typewriter':
                this.currentInstance = new TypeWriter(this.previewElement, {
                    words: preset.words,
                    ...preset.config
                });
                break;
            case 'fade':
                this.currentInstance = new FadeWriter(this.previewElement, {
                    words: preset.words,
                    ...preset.config
                });
                break;
            case 'glitch':
                this.currentInstance = new GlitchWriter(this.previewElement, {
                    words: preset.words,
                    ...preset.config
                });
                break;
            default:
                this.currentInstance = new WritingJS(this.previewElement, {
                    words: preset.words,
                    ...preset.config
                });
                break;
        }

        // Setup metrics tracking
        this.setupMetricsTracking();
    }

    /**
     * Setup metrics tracking
     */
    private setupMetricsTracking(): void {
        if (!this.currentInstance || !this.metricsElement) return;

        const updateMetrics = () => {
            if (this.isDestroyed || !this.currentInstance) return;

            const state = this.currentInstance.getState?.();
            const metrics = this.currentInstance.getMetrics?.();

            if (state) {
                this.updateMetricValue('progress', `${Math.round(state.progress * 100)}%`);
                this.updateMetricValue('state', state.isRunning ? 'Running' : 'Stopped');
            }

            if (metrics) {
                this.updateMetricValue('fps', Math.round(metrics.averageFPS).toString());
                this.updateMetricValue('memory', this.formatBytes(metrics.memoryUsage));
            }

            requestAnimationFrame(updateMetrics);
        };

        updateMetrics();
    }

    /**
     * Update metric value in UI
     */
    private updateMetricValue(metric: string, value: string): void {
        const element = this.metricsElement?.querySelector(`#${metric}`);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Format bytes for display
     */
    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Update config editor
     */
    private updateConfigEditor(preset: PlaygroundPreset): void {
        if (!this.configEditorElement) return;

        const config = {
            words: preset.words,
            effect: preset.effect,
            ...preset.config
        };

        (this.configEditorElement as HTMLTextAreaElement).value = JSON.stringify(config, null, 2);
    }

    /**
     * Apply custom config from editor
     */
    private applyCustomConfig(): void {
        if (!this.configEditorElement) return;

        try {
            const configText = (this.configEditorElement as HTMLTextAreaElement).value;
            const config = JSON.parse(configText);

            const customPreset: PlaygroundPreset = {
                name: 'Custom',
                description: 'Custom configuration',
                words: config.words || ['Hello', 'World'],
                effect: config.effect || 'custom',
                config: config
            };

            this.createInstanceFromPreset(customPreset);
            this.currentPreset = customPreset;
            
            // Clear active preset
            const presets = this.container.querySelectorAll('[data-preset]');
            presets.forEach(preset => preset.classList.remove('active'));

        } catch (error) {
            alert('Invalid JSON configuration: ' + error);
        }
    }

    /**
     * Export configuration
     */
    private exportConfig(): void {
        if (!this.currentPreset) return;

        const config = {
            preset: this.currentPreset.name,
            words: this.currentPreset.words,
            effect: this.currentPreset.effect,
            config: this.currentPreset.config,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `writing-config-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Load default preset
     */
    private loadDefaultPreset(): void {
        if (this.config.presets && this.config.presets.length > 0) {
            this.loadPreset(this.config.presets[0].name);
        }
    }

    /**
     * Get default presets
     */
    private getDefaultPresets(): PlaygroundPreset[] {
        return [
            {
                name: 'Basic Typewriter',
                description: 'Classic typewriter effect',
                effect: 'typewriter',
                words: ['Hello', 'World', 'Writing.js', 'Awesome!'],
                config: {
                    times: { writer: 100, eraser: 50, read: 1500 }
                }
            },
            {
                name: 'Fade Animation',
                description: 'Smooth fade in/out effect',
                effect: 'fade',
                words: ['Fade', 'Beautiful', 'Animation', 'Effect'],
                config: {
                    times: { writer: 80, eraser: 30, read: 2000 }
                }
            },
            {
                name: 'Glitch Effect',
                description: 'Cyberpunk glitch style',
                effect: 'glitch',
                words: ['SYSTEM', 'ERROR', 'GLITCH', 'MATRIX'],
                config: {
                    times: { writer: 120, eraser: 80, read: 1800 }
                }
            },
            {
                name: 'Fast Typing',
                description: 'High speed animation',
                effect: 'typewriter',
                words: ['Fast', 'Quick', 'Rapid', 'Speed'],
                config: {
                    times: { writer: 30, eraser: 20, read: 800 }
                }
            },
            {
                name: 'Slow & Steady',
                description: 'Relaxed typing pace',
                effect: 'typewriter',
                words: ['Slow', 'Steady', 'Relaxed', 'Calm'],
                config: {
                    times: { writer: 200, eraser: 100, read: 3000 }
                }
            }
        ];
    }

    /**
     * Add custom preset
     */
    public addPreset(preset: PlaygroundPreset): void {
        this.config.presets!.push(preset);
        // Rebuild presets section
        const presetsSection = this.container.querySelector('.playground-section');
        if (presetsSection) {
            presetsSection.innerHTML = `
                <h3>Presets</h3>
                ${this.createPresetsHTML()}
            `;
        }
    }

    /**
     * Get current instance
     */
    public getCurrentInstance() {
        return this.currentInstance;
    }

    /**
     * Get current preset
     */
    public getCurrentPreset(): PlaygroundPreset | null {
        return this.currentPreset;
    }

    /**
     * Destroy playground
     */
    public destroy(): void {
        this.isDestroyed = true;
        
        if (this.currentInstance) {
            this.currentInstance.destroy();
        }
        
        this.container.innerHTML = '';
        this.container.classList.remove('writing-playground');
    }

    /**
     * Static factory method
     */
    public static create(config: PlaygroundConfig): WritingPlayground {
        return new WritingPlayground(config);
    }
}