// Event emitter for Writing.js v2.0.0

export class EventEmitter {
    private events: { [key: string]: ((...args: any[]) => void)[] } = {};
    private maxListeners = 10;

    /**
     * Add an event listener
     */
    on(event: string, callback: (...args: any[]) => void): this {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        if (this.events[event].length >= this.maxListeners) {
            console.warn(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this.events[event].length + 1} ${event} listeners added.`);
        }

        this.events[event].push(callback);
        return this;
    }

    /**
     * Add a one-time event listener
     */
    once(event: string, callback: (...args: any[]) => void): this {
        const onceWrapper = (...args: any[]) => {
            callback(...args);
            this.off(event, onceWrapper);
        };

        this.on(event, onceWrapper);
        return this;
    }

    /**
     * Remove an event listener
     */
    off(event: string, callback?: (...args: any[]) => void): this {
        if (!this.events[event]) return this;

        if (!callback) {
            delete this.events[event];
            return this;
        }

        const index = this.events[event].indexOf(callback);
        if (index !== -1) {
            this.events[event].splice(index, 1);
        }

        if (this.events[event].length === 0) {
            delete this.events[event];
        }

        return this;
    }

    /**
     * Emit an event
     */
    emit(event: string, ...args: any[]): boolean {
        if (!this.events[event]) return false;

        const listeners = [...this.events[event]];
        
        for (const listener of listeners) {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in event listener for '${event}':`, error);
                this.emit('error', error);
            }
        }

        return true;
    }

    /**
     * Get all event names
     */
    eventNames(): string[] {
        return Object.keys(this.events);
    }

    /**
     * Get listener count for an event
     */
    listenerCount(event: string): number {
        return this.events[event] ? this.events[event].length : 0;
    }

    /**
     * Get all listeners for an event
     */
    listeners(event: string): ((...args: any[]) => void)[] {
        return this.events[event] ? [...this.events[event]] : [];
    }

    /**
     * Remove all listeners
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
     * Set max listeners
     */
    setMaxListeners(n: number): this {
        this.maxListeners = n;
        return this;
    }

    /**
     * Get max listeners
     */
    getMaxListeners(): number {
        return this.maxListeners;
    }
}