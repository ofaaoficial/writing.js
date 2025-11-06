// Event emitter for Writing.js v2.0

type EventListener<T = any> = (data: T) => void;

interface EventRegistry {
    [event: string]: EventListener[];
}

export class EventEmitter {
    private events: EventRegistry = {};
    private maxListeners = 10;

    /**
     * Add event listener
     */
    on<T = any>(event: string, listener: EventListener<T>): this {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(listener);

        // Warning for too many listeners
        if (this.events[event].length > this.maxListeners) {
            console.warn(`MaxListenersExceededWarning: Possible memory leak detected. ${this.events[event].length} listeners added to event "${event}". Use setMaxListeners() to increase limit.`);
        }

        return this;
    }

    /**
     * Add one-time event listener
     */
    once<T = any>(event: string, listener: EventListener<T>): this {
        const onceWrapper = (data: T) => {
            listener(data);
            this.off(event, onceWrapper);
        };

        return this.on(event, onceWrapper);
    }

    /**
     * Remove event listener
     */
    off<T = any>(event: string, listener?: EventListener<T>): this {
        if (!this.events[event]) {
            return this;
        }

        if (!listener) {
            // Remove all listeners for this event
            delete this.events[event];
        } else {
            // Remove specific listener
            const index = this.events[event].indexOf(listener);
            if (index !== -1) {
                this.events[event].splice(index, 1);
            }

            // Clean up empty event arrays
            if (this.events[event].length === 0) {
                delete this.events[event];
            }
        }

        return this;
    }

    /**
     * Emit event to all listeners
     */
    emit<T = any>(event: string, data?: T): boolean {
        if (!this.events[event] || this.events[event].length === 0) {
            return false;
        }

        // Create a copy of listeners to avoid issues if listeners are modified during emission
        const listeners = [...this.events[event]];

        listeners.forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                console.error(`Error in event listener for "${event}":`, error);
                // Emit error event if it's not the error event itself
                if (event !== 'error') {
                    this.emit('error', error);
                }
            }
        });

        return true;
    }

    /**
     * Get all listeners for an event
     */
    listeners(event: string): EventListener[] {
        return this.events[event] ? [...this.events[event]] : [];
    }

    /**
     * Get listener count for an event
     */
    listenerCount(event: string): number {
        return this.events[event] ? this.events[event].length : 0;
    }

    /**
     * Get all event names that have listeners
     */
    eventNames(): string[] {
        return Object.keys(this.events);
    }

    /**
     * Remove all listeners for all events
     */
    removeAllListeners(event?: string): this {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
        return this;
    }

    /**
     * Set maximum number of listeners per event
     */
    setMaxListeners(n: number): this {
        if (typeof n !== 'number' || n < 0 || isNaN(n)) {
            throw new TypeError('n must be a non-negative number');
        }
        this.maxListeners = n;
        return this;
    }

    /**
     * Get maximum number of listeners per event
     */
    getMaxListeners(): number {
        return this.maxListeners;
    }

    /**
     * Add listener to beginning of listeners array
     */
    prependListener<T = any>(event: string, listener: EventListener<T>): this {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].unshift(listener);
        return this;
    }

    /**
     * Add one-time listener to beginning of listeners array
     */
    prependOnceListener<T = any>(event: string, listener: EventListener<T>): this {
        const onceWrapper = (data: T) => {
            listener(data);
            this.off(event, onceWrapper);
        };

        return this.prependListener(event, onceWrapper);
    }

    /**
     * Emit event asynchronously
     */
    async emitAsync<T = any>(event: string, data?: T): Promise<boolean> {
        if (!this.events[event] || this.events[event].length === 0) {
            return false;
        }

        const listeners = [...this.events[event]];

        await Promise.all(listeners.map(async listener => {
            try {
                await listener(data);
            } catch (error) {
                console.error(`Error in async event listener for "${event}":`, error);
                if (event !== 'error') {
                    this.emit('error', error);
                }
            }
        }));

        return true;
    }

    /**
     * Check if event has listeners
     */
    hasListeners(event: string): boolean {
        return this.listenerCount(event) > 0;
    }

    /**
     * Create a new event emitter with the same listeners
     */
    clone(): EventEmitter {
        const cloned = new EventEmitter();
        cloned.events = JSON.parse(JSON.stringify(this.events));
        cloned.maxListeners = this.maxListeners;
        return cloned;
    }

    /**
     * Pipe events from another emitter
     */
    pipe(emitter: EventEmitter, events?: string[]): this {
        const eventsToWatch = events || emitter.eventNames();
        
        eventsToWatch.forEach(event => {
            emitter.on(event, (data) => {
                this.emit(event, data);
            });
        });

        return this;
    }

    /**
     * Remove listeners and clean up
     */
    destroy(): void {
        this.removeAllListeners();
    }

    /**
     * Get debug information about the emitter
     */
    debug(): {
        events: string[];
        listenerCounts: Record<string, number>;
        totalListeners: number;
        maxListeners: number;
    } {
        const events = this.eventNames();
        const listenerCounts: Record<string, number> = {};
        let totalListeners = 0;

        events.forEach(event => {
            const count = this.listenerCount(event);
            listenerCounts[event] = count;
            totalListeners += count;
        });

        return {
            events,
            listenerCounts,
            totalListeners,
            maxListeners: this.maxListeners
        };
    }
}