# 🚀 Writing.js v2.0 - Advanced Usage Guide

Advanced techniques, patterns, and real-world use cases for Writing.js v2.0.

## 🎯 Performance Optimization

### 1. High-Performance Configurations

```javascript
// Configuration for maximum performance
const highPerformanceConfig = {
    words: ['Fast', 'Efficient', 'Optimized'],
    times: { writer: 30, eraser: 15, read: 800 },
    
    // Disable resource-intensive features
    effects: {
        visual: { fadeIn: false, glitch: false, shake: false },
        typing: { randomSpeed: false },
        sound: { enabled: false }
    },
    
    // Optimize DOM operations
    cursor: { blink: false },
    pauseOnHover: false,
    
    // Enable performance mode
    optimize: true,
    debug: false
};

const writer = new WritingJS('#element', highPerformanceConfig);
```

### 2. Memory Management Patterns

```javascript
class WritingManager {
    constructor() {
        this.instances = new Map();
        this.observer = null;
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.dataset.writingId;
                const instance = this.instances.get(id);
                
                if (entry.isIntersecting) {
                    instance?.resume();
                } else {
                    instance?.pause();
                }
            });
        }, { threshold: 0.1 });
    }
    
    createInstance(id, element, config) {
        // Clean up existing instance
        this.destroyInstance(id);
        
        const writer = new WritingJS(element, config);
        this.instances.set(id, writer);
        
        // Add to intersection observer
        element.dataset.writingId = id;
        this.observer.observe(element);
        
        return writer;
    }
    
    destroyInstance(id) {
        const writer = this.instances.get(id);
        if (writer) {
            writer.destroy();
            this.instances.delete(id);
        }
    }
    
    destroyAll() {
        this.instances.forEach(writer => writer.destroy());
        this.instances.clear();
        this.observer.disconnect();
    }
}
```

### 3. Resource Pooling

```javascript
class WritingPool {
    constructor(maxSize = 10) {
        this.pool = [];
        this.active = new Set();
        this.maxSize = maxSize;
    }
    
    getWriter(element, config) {
        let writer;
        
        if (this.pool.length > 0) {
            writer = this.pool.pop();
            writer.setElement(element);
            writer.setOptions(config);
        } else {
            writer = new WritingJS(element, config);
        }
        
        this.active.add(writer);
        return writer;
    }
    
    releaseWriter(writer) {
        if (this.active.has(writer)) {
            writer.stop();
            this.active.delete(writer);
            
            if (this.pool.length < this.maxSize) {
                this.pool.push(writer);
            } else {
                writer.destroy();
            }
        }
    }
    
    cleanup() {
        this.pool.forEach(writer => writer.destroy());
        this.active.forEach(writer => writer.destroy());
        this.pool.length = 0;
        this.active.clear();
    }
}
```

## 🎨 Advanced Animation Patterns

### 1. Complex Sequences

```javascript
import { WritingSequence } from 'writing.js';

class StoryTeller {
    constructor() {
        this.sequence = new WritingSequence();
        this.currentChapter = 0;
        this.chapters = [];
    }
    
    addChapter(title, content, config = {}) {
        this.chapters.push({ title, content, config });
        return this;
    }
    
    async playStory() {
        for (let i = 0; i < this.chapters.length; i++) {
            const chapter = this.chapters[i];
            
            // Chapter title
            this.sequence
                .add('#story-title', [chapter.title], {
                    times: { writer: 60, eraser: 30, read: 1000 },
                    effects: {
                        visual: { fadeIn: true },
                        typing: { pauseOnPunctuation: true }
                    }
                })
                .wait(800);
            
            // Chapter content with paragraphs
            chapter.content.forEach((paragraph, index) => {
                this.sequence
                    .add(`#paragraph-${index}`, [paragraph], {
                        times: { writer: 40, eraser: 20, read: 2000 },
                        ...chapter.config
                    })
                    .wait(1200);
            });
            
            // Chapter transition
            this.sequence
                .callback(() => this.onChapterComplete(i))
                .wait(2000)
                .clearElement('#story-title');
        }
        
        return this.sequence.run();
    }
    
    onChapterComplete(chapterIndex) {
        console.log(`Chapter ${chapterIndex + 1} completed`);
        this.currentChapter = chapterIndex + 1;
        
        // Emit custom event
        document.dispatchEvent(new CustomEvent('chapterComplete', {
            detail: { chapter: chapterIndex + 1 }
        }));
    }
}

// Usage
const story = new StoryTeller()
    .addChapter('The Beginning', [
        'Once upon a time...',
        'In a land far away...',
        'There lived a brave developer...'
    ])
    .addChapter('The Challenge', [
        'The developer faced a difficult problem...',
        'Performance was slow...',
        'Users were frustrated...'
    ])
    .addChapter('The Solution', [
        'Then they discovered Writing.js...',
        'Everything changed...',
        'The end.'
    ]);

story.playStory();
```

### 2. Synchronized Multi-Element Animation

```javascript
class SynchronizedWriter {
    constructor() {
        this.writers = new Map();
        this.timeline = [];
        this.isPlaying = false;
    }
    
    addWriter(id, element, config) {
        const writer = new WritingJS(element, {
            ...config,
            autoStart: false
        });
        
        this.writers.set(id, writer);
        return this;
    }
    
    addToTimeline(time, action) {
        this.timeline.push({ time, action });
        this.timeline.sort((a, b) => a.time - b.time);
        return this;
    }
    
    async play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        const startTime = performance.now();
        
        for (const event of this.timeline) {
            const currentTime = performance.now() - startTime;
            const waitTime = Math.max(0, event.time - currentTime);
            
            if (waitTime > 0) {
                await this.wait(waitTime);
            }
            
            await event.action();
        }
        
        this.isPlaying = false;
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage
const sync = new SynchronizedWriter()
    .addWriter('title', '#title', {
        words: ['Welcome', 'to', 'our', 'presentation']
    })
    .addWriter('subtitle', '#subtitle', {
        words: ['Advanced', 'animation', 'techniques']
    })
    .addWriter('content', '#content', {
        words: ['Let\'s', 'explore', 'together']
    });

sync
    .addToTimeline(0, () => sync.writers.get('title').start())
    .addToTimeline(2000, () => sync.writers.get('subtitle').start())
    .addToTimeline(4000, () => sync.writers.get('content').start())
    .play();
```

### 3. Data-Driven Animations

```javascript
class DataWriter {
    constructor(element, dataSource) {
        this.element = element;
        this.dataSource = dataSource;
        this.writer = null;
        this.currentData = null;
        this.updateInterval = null;
    }
    
    async initialize() {
        this.writer = new WritingJS(this.element, {
            words: ['Loading...'],
            times: { writer: 50, eraser: 25, read: 1000 }
        });
        
        // Start with initial data
        await this.updateData();
        
        // Set up periodic updates
        this.updateInterval = setInterval(() => {
            this.updateData();
        }, 5000);
    }
    
    async updateData() {
        try {
            const newData = await this.fetchData();
            
            if (this.hasDataChanged(newData)) {
                this.currentData = newData;
                const words = this.formatDataForDisplay(newData);
                
                this.writer.setWords(words);
                this.writer.restart();
            }
        } catch (error) {
            console.error('Data update failed:', error);
            this.writer.setWords(['Error loading data']);
        }
    }
    
    async fetchData() {
        const response = await fetch(this.dataSource);
        return response.json();
    }
    
    hasDataChanged(newData) {
        return JSON.stringify(newData) !== JSON.stringify(this.currentData);
    }
    
    formatDataForDisplay(data) {
        if (data.type === 'stats') {
            return [
                `Users: ${data.users}`,
                `Revenue: $${data.revenue}`,
                `Growth: ${data.growth}%`
            ];
        }
        
        return data.messages || ['No data available'];
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.writer?.destroy();
    }
}

// Usage
const liveStats = new DataWriter('#stats', '/api/live-stats');
liveStats.initialize();
```

## 🎵 Advanced Sound Integration

### 1. Dynamic Sound Generation

```javascript
class SoundWriter extends WritingJS {
    constructor(element, config) {
        super(element, config);
        this.audioContext = null;
        this.soundCache = new Map();
        this.initializeAudio();
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio context not supported');
        }
    }
    
    generateKeySound(frequency = 440, duration = 0.1) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playCharacterSound(char) {
        const baseFreq = 440;
        const charCode = char.charCodeAt(0);
        const frequency = baseFreq + (charCode % 12) * 20;
        
        this.generateKeySound(frequency, 0.08);
    }
    
    playErrorSound() {
        this.generateKeySound(200, 0.15);
    }
    
    playCompleteSound() {
        // Play a chord
        const frequencies = [261, 329, 392]; // C major
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.generateKeySound(freq, 0.3), index * 100);
        });
    }
}

// Usage
const soundWriter = new SoundWriter('#element', {
    words: ['Hello', 'World', 'with', 'Dynamic', 'Sound'],
    effects: {
        sound: { enabled: true }
    }
});

soundWriter.on('characterWrite', (char) => {
    soundWriter.playCharacterSound(char);
});

soundWriter.on('error', () => {
    soundWriter.playErrorSound();
});

soundWriter.on('complete', () => {
    soundWriter.playCompleteSound();
});
```

### 2. Contextual Sound Effects

```javascript
class ContextualSoundWriter extends WritingJS {
    constructor(element, config) {
        super(element, config);
        this.soundMappings = new Map();
        this.setupSoundMappings();
    }
    
    setupSoundMappings() {
        // Punctuation sounds
        this.soundMappings.set('.', { freq: 300, duration: 0.2 });
        this.soundMappings.set('!', { freq: 600, duration: 0.15 });
        this.soundMappings.set('?', { freq: 500, duration: 0.18 });
        this.soundMappings.set(',', { freq: 400, duration: 0.1 });
        
        // Letter categories
        this.soundMappings.set('vowels', { freq: 440, duration: 0.08 });
        this.soundMappings.set('consonants', { freq: 330, duration: 0.06 });
        this.soundMappings.set('numbers', { freq: 550, duration: 0.08 });
        this.soundMappings.set('space', { freq: 220, duration: 0.05 });
    }
    
    getCharacterCategory(char) {
        if (/[aeiouAEIOU]/.test(char)) return 'vowels';
        if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/.test(char)) return 'consonants';
        if (/[0-9]/.test(char)) return 'numbers';
        if (char === ' ') return 'space';
        return 'punctuation';
    }
    
    playContextualSound(char) {
        let soundConfig;
        
        if (this.soundMappings.has(char)) {
            soundConfig = this.soundMappings.get(char);
        } else {
            const category = this.getCharacterCategory(char);
            soundConfig = this.soundMappings.get(category) || 
                         this.soundMappings.get('consonants');
        }
        
        if (soundConfig) {
            this.generateKeySound(soundConfig.freq, soundConfig.duration);
        }
    }
}
```

## 🎮 Interactive Features

### 1. User-Controlled Animation

```javascript
class InteractiveWriter {
    constructor(element, config) {
        this.writer = new WritingJS(element, config);
        this.isManualMode = false;
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.isManualMode) {
                this.handleManualInput(e);
            } else {
                this.handleControlInput(e);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('.writing-control')) {
                this.handleControlClick(e);
            }
        });
    }
    
    handleManualInput(e) {
        switch(e.key) {
            case 'ArrowRight':
                this.writer.stepForward();
                break;
            case 'ArrowLeft':
                this.writer.stepBackward();
                break;
            case 'Space':
                this.writer.skipToNextWord();
                break;
            case 'Enter':
                this.writer.completeCurrentWord();
                break;
        }
    }
    
    handleControlInput(e) {
        switch(e.key) {
            case 'p':
                this.writer.pause();
                break;
            case 'r':
                this.writer.resume();
                break;
            case 's':
                this.writer.stop();
                break;
            case 'm':
                this.toggleManualMode();
                break;
        }
    }
    
    handleControlClick(e) {
        const action = e.target.dataset.action;
        switch(action) {
            case 'faster':
                this.adjustSpeed(-20);
                break;
            case 'slower':
                this.adjustSpeed(20);
                break;
            case 'reset-speed':
                this.resetSpeed();
                break;
        }
    }
    
    toggleManualMode() {
        this.isManualMode = !this.isManualMode;
        if (this.isManualMode) {
            this.writer.pause();
        } else {
            this.writer.resume();
        }
    }
    
    adjustSpeed(delta) {
        const config = this.writer.getConfig();
        const newSpeed = Math.max(10, config.times.writer + delta);
        this.writer.setSpeed(newSpeed);
    }
    
    resetSpeed() {
        this.writer.setSpeed(100);
    }
}

// HTML controls
const controlsHTML = `
    <div class="writing-controls">
        <button class="writing-control" data-action="faster">Faster</button>
        <button class="writing-control" data-action="slower">Slower</button>
        <button class="writing-control" data-action="reset-speed">Reset Speed</button>
    </div>
    <div class="writing-help">
        <p>Controls: P=Pause, R=Resume, S=Stop, M=Manual Mode</p>
        <p>Manual Mode: ←/→=Step, Space=Next Word, Enter=Complete Word</p>
    </div>
`;
```

### 2. Voice-Controlled Animation

```javascript
class VoiceWriter {
    constructor(element, config) {
        this.writer = new WritingJS(element, config);
        this.recognition = null;
        this.isListening = false;
        this.setupVoiceRecognition();
    }
    
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                this.handleVoiceResult(event);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        }
    }
    
    handleVoiceResult(event) {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
            const command = lastResult[0].transcript.toLowerCase().trim();
            this.executeVoiceCommand(command);
        }
    }
    
    executeVoiceCommand(command) {
        const commands = {
            'start': () => this.writer.start(),
            'stop': () => this.writer.stop(),
            'pause': () => this.writer.pause(),
            'resume': () => this.writer.resume(),
            'faster': () => this.adjustSpeed(-20),
            'slower': () => this.adjustSpeed(20),
            'reset': () => this.writer.restart(),
            'next word': () => this.writer.skipToNextWord(),
            'complete': () => this.writer.completeCurrentWord()
        };
        
        if (commands[command]) {
            commands[command]();
            console.log(`Voice command executed: ${command}`);
        }
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}
```

## 🌐 Real-Time Integration

### 1. WebSocket Integration

```javascript
class RealtimeWriter {
    constructor(element, wsUrl) {
        this.writer = new WritingJS(element, {
            words: ['Connecting...'],
            times: { writer: 80, eraser: 40, read: 1000 }
        });
        
        this.ws = null;
        this.messageQueue = [];
        this.isProcessing = false;
        
        this.connect(wsUrl);
    }
    
    connect(url) {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.writer.setWords(['Connected']);
            this.writer.start();
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
        
        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.writer.setWords(['Disconnected']);
            this.scheduleReconnect();
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.writer.setWords(['Connection error']);
        };
    }
    
    handleMessage(data) {
        switch(data.type) {
            case 'text':
                this.queueMessage(data.text);
                break;
            case 'typing':
                this.showTypingIndicator(data.user);
                break;
            case 'config':
                this.updateConfig(data.config);
                break;
        }
    }
    
    queueMessage(text) {
        this.messageQueue.push(text);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }
    
    async processQueue() {
        if (this.messageQueue.length === 0) {
            this.isProcessing = false;
            return;
        }
        
        this.isProcessing = true;
        const message = this.messageQueue.shift();
        
        this.writer.setWords([message]);
        await this.writer.start();
        
        // Process next message after a delay
        setTimeout(() => this.processQueue(), 1000);
    }
    
    showTypingIndicator(user) {
        const indicator = `${user} is typing...`;
        this.writer.setWords([indicator]);
        this.writer.start();
    }
    
    updateConfig(config) {
        this.writer.setOptions(config);
    }
    
    scheduleReconnect() {
        setTimeout(() => {
            this.connect(this.ws.url);
        }, 3000);
    }
    
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
}

// Usage
const realtime = new RealtimeWriter('#messages', 'ws://localhost:8080');

// Send messages
realtime.send({
    type: 'text',
    text: 'Hello from the client!'
});
```

### 2. Server-Sent Events Integration

```javascript
class EventWriter {
    constructor(element, eventUrl) {
        this.writer = new WritingJS(element, {
            words: ['Waiting for events...'],
            infinite: true
        });
        
        this.eventSource = null;
        this.connectToEventStream(eventUrl);
    }
    
    connectToEventStream(url) {
        this.eventSource = new EventSource(url);
        
        this.eventSource.onopen = () => {
            console.log('Event stream connected');
            this.writer.setWords(['Live updates connected']);
        };
        
        this.eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleUpdate(data);
        };
        
        this.eventSource.onerror = (error) => {
            console.error('Event stream error:', error);
            this.writer.setWords(['Connection lost']);
        };
        
        // Custom event types
        this.eventSource.addEventListener('notification', (event) => {
            const data = JSON.parse(event.data);
            this.showNotification(data);
        });
        
        this.eventSource.addEventListener('alert', (event) => {
            const data = JSON.parse(event.data);
            this.showAlert(data);
        });
    }
    
    handleUpdate(data) {
        const messages = this.formatUpdateMessage(data);
        this.writer.setWords(messages);
        this.writer.restart();
    }
    
    formatUpdateMessage(data) {
        switch(data.type) {
            case 'user_joined':
                return [`${data.user} joined the chat`];
            case 'user_left':
                return [`${data.user} left the chat`];
            case 'message':
                return [`${data.user}: ${data.message}`];
            case 'system':
                return [data.message];
            default:
                return ['Unknown event'];
        }
    }
    
    showNotification(data) {
        // Temporary notification overlay
        this.writer.setWords([`📢 ${data.message}`]);
        this.writer.start();
    }
    
    showAlert(data) {
        // High priority alert
        this.writer.setWords([`🚨 ${data.message}`]);
        this.writer.setOptions({
            times: { writer: 30, eraser: 15, read: 3000 },
            effects: {
                visual: { shake: true },
                sound: { enabled: true }
            }
        });
        this.writer.start();
    }
    
    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }
}
```

## 📊 Analytics and Monitoring

### 1. Advanced Analytics

```javascript
class AnalyticsWriter extends WritingJS {
    constructor(element, config) {
        super(element, config);
        this.analytics = {
            startTime: null,
            endTime: null,
            characterCount: 0,
            wordCount: 0,
            errorCount: 0,
            pauseCount: 0,
            resumeCount: 0,
            userInteractions: []
        };
        
        this.setupAnalytics();
    }
    
    setupAnalytics() {
        this.on('start', () => {
            this.analytics.startTime = Date.now();
        });
        
        this.on('complete', () => {
            this.analytics.endTime = Date.now();
            this.sendAnalytics();
        });
        
        this.on('characterWrite', (char) => {
            this.analytics.characterCount++;
        });
        
        this.on('wordComplete', () => {
            this.analytics.wordCount++;
        });
        
        this.on('error', () => {
            this.analytics.errorCount++;
        });
        
        this.on('pause', () => {
            this.analytics.pauseCount++;
            this.trackInteraction('pause');
        });
        
        this.on('resume', () => {
            this.analytics.resumeCount++;
            this.trackInteraction('resume');
        });
    }
    
    trackInteraction(type, data = {}) {
        this.analytics.userInteractions.push({
            type,
            timestamp: Date.now(),
            ...data
        });
    }
    
    getAnalytics() {
        const duration = this.analytics.endTime - this.analytics.startTime;
        const metrics = this.getMetrics();
        
        return {
            ...this.analytics,
            duration,
            averageWPM: this.calculateWPM(duration),
            averageFPS: metrics.averageFPS,
            performanceScore: this.calculatePerformanceScore(metrics)
        };
    }
    
    calculateWPM(duration) {
        const minutes = duration / 60000;
        return Math.round(this.analytics.wordCount / minutes);
    }
    
    calculatePerformanceScore(metrics) {
        const fpsScore = Math.min(metrics.averageFPS / 60, 1) * 40;
        const memoryScore = Math.max(0, 1 - (metrics.memoryUsage / 100)) * 30;
        const errorScore = Math.max(0, 1 - (this.analytics.errorCount / 10)) * 30;
        
        return Math.round(fpsScore + memoryScore + errorScore);
    }
    
    sendAnalytics() {
        const data = this.getAnalytics();
        
        // Send to analytics service
        fetch('/analytics/writing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(console.error);
    }
}
```

### 2. A/B Testing Framework

```javascript
class ABTestWriter {
    constructor(element, variants) {
        this.element = element;
        this.variants = variants;
        this.currentVariant = this.selectVariant();
        this.testData = {
            variant: this.currentVariant,
            startTime: Date.now(),
            interactions: []
        };
        
        this.initializeVariant();
    }
    
    selectVariant() {
        const userId = this.getUserId();
        const hash = this.hashCode(userId);
        const variantIndex = Math.abs(hash) % this.variants.length;
        return this.variants[variantIndex];
    }
    
    getUserId() {
        return localStorage.getItem('userId') || 
               this.generateUserId();
    }
    
    generateUserId() {
        const id = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', id);
        return id;
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    
    initializeVariant() {
        this.writer = new WritingJS(this.element, this.currentVariant.config);
        
        // Track all interactions
        this.writer.on('start', () => this.trackEvent('start'));
        this.writer.on('complete', () => this.trackEvent('complete'));
        this.writer.on('pause', () => this.trackEvent('pause'));
        this.writer.on('resume', () => this.trackEvent('resume'));
        
        // Track variant-specific metrics
        this.setupVariantTracking();
    }
    
    setupVariantTracking() {
        const variant = this.currentVariant;
        
        if (variant.trackEngagement) {
            this.trackEngagement();
        }
        
        if (variant.trackPerformance) {
            this.trackPerformance();
        }
        
        if (variant.trackErrors) {
            this.trackErrors();
        }
    }
    
    trackEngagement() {
        let engagementScore = 0;
        
        this.writer.on('characterWrite', () => {
            engagementScore += 1;
        });
        
        this.writer.on('pause', () => {
            engagementScore -= 5;
        });
        
        this.writer.on('complete', () => {
            this.testData.engagementScore = engagementScore;
        });
    }
    
    trackPerformance() {
        setInterval(() => {
            const metrics = this.writer.getMetrics();
            this.testData.performanceSnapshots = this.testData.performanceSnapshots || [];
            this.testData.performanceSnapshots.push({
                timestamp: Date.now(),
                fps: metrics.currentFPS,
                memory: metrics.memoryUsage
            });
        }, 1000);
    }
    
    trackErrors() {
        this.writer.on('error', (error) => {
            this.testData.errors = this.testData.errors || [];
            this.testData.errors.push({
                timestamp: Date.now(),
                error: error.message
            });
        });
    }
    
    trackEvent(eventType) {
        this.testData.interactions.push({
            type: eventType,
            timestamp: Date.now()
        });
    }
    
    finalize() {
        this.testData.endTime = Date.now();
        this.testData.duration = this.testData.endTime - this.testData.startTime;
        
        // Send test results
        this.sendTestResults();
    }
    
    sendTestResults() {
        fetch('/analytics/ab-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.testData)
        }).catch(console.error);
    }
}

// Usage
const abTest = new ABTestWriter('#test-element', [
    {
        name: 'fast',
        config: { words: ['Fast', 'Animation'], times: { writer: 50 } },
        trackEngagement: true
    },
    {
        name: 'slow',
        config: { words: ['Slow', 'Animation'], times: { writer: 150 } },
        trackEngagement: true
    },
    {
        name: 'effects',
        config: { 
            words: ['Effects', 'Animation'], 
            effects: { visual: { fadeIn: true } } 
        },
        trackPerformance: true
    }
]);
```

This advanced guide provides sophisticated patterns and real-world implementations for complex use cases with Writing.js v2.0. These examples demonstrate the library's flexibility and power for creating rich, interactive text animation experiences.