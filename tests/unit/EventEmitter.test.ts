// Unit tests for EventEmitter

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventEmitter } from '../../src/utils/EventEmitter';

describe('EventEmitter', () => {
    let emitter: EventEmitter;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    describe('Basic Event Handling', () => {
        it('should add event listener', () => {
            const listener = vi.fn();
            emitter.on('test', listener);

            expect(emitter.listenerCount('test')).toBe(1);
            expect(emitter.listeners('test')).toContain(listener);
        });

        it('should emit event to listeners', () => {
            const listener = vi.fn();
            emitter.on('test', listener);

            const result = emitter.emit('test', 'data');

            expect(result).toBe(true);
            expect(listener).toHaveBeenCalledWith('data');
        });

        it('should return false when emitting to non-existent event', () => {
            const result = emitter.emit('nonexistent');
            expect(result).toBe(false);
        });

        it('should handle multiple listeners for same event', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            
            emitter.on('test', listener1);
            emitter.on('test', listener2);

            emitter.emit('test', 'data');

            expect(listener1).toHaveBeenCalledWith('data');
            expect(listener2).toHaveBeenCalledWith('data');
        });
    });

    describe('Event Removal', () => {
        it('should remove specific listener', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            
            emitter.on('test', listener1);
            emitter.on('test', listener2);
            emitter.off('test', listener1);

            emitter.emit('test', 'data');

            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).toHaveBeenCalledWith('data');
        });

        it('should remove all listeners for event', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            
            emitter.on('test', listener1);
            emitter.on('test', listener2);
            emitter.off('test');

            emitter.emit('test', 'data');

            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).not.toHaveBeenCalled();
        });

        it('should handle removing non-existent listener', () => {
            const listener = vi.fn();
            
            expect(() => {
                emitter.off('test', listener);
            }).not.toThrow();
        });
    });

    describe('Once Events', () => {
        it('should execute once listener only once', () => {
            const listener = vi.fn();
            emitter.once('test', listener);

            emitter.emit('test', 'data1');
            emitter.emit('test', 'data2');

            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('data1');
        });

        it('should remove once listener after execution', () => {
            const listener = vi.fn();
            emitter.once('test', listener);

            emitter.emit('test', 'data');

            expect(emitter.listenerCount('test')).toBe(0);
        });
    });

    describe('Prepend Listeners', () => {
        it('should prepend listener to beginning', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            
            emitter.on('test', listener1);
            emitter.prependListener('test', listener2);

            const listeners = emitter.listeners('test');
            expect(listeners[0]).toBe(listener2);
            expect(listeners[1]).toBe(listener1);
        });

        it('should prepend once listener', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            
            emitter.on('test', listener1);
            emitter.prependOnceListener('test', listener2);

            emitter.emit('test', 'data');

            expect(listener2).toHaveBeenCalledWith('data');
            expect(listener1).toHaveBeenCalledWith('data');
            expect(emitter.listenerCount('test')).toBe(1);
        });
    });

    describe('Async Events', () => {
        it('should handle async event emission', async () => {
            const listener = vi.fn();
            emitter.on('test', listener);

            const result = await emitter.emitAsync('test', 'data');

            expect(result).toBe(true);
            expect(listener).toHaveBeenCalledWith('data');
        });

        it('should handle async listeners', async () => {
            const asyncListener = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
            });
            
            emitter.on('test', asyncListener);

            await emitter.emitAsync('test', 'data');

            expect(asyncListener).toHaveBeenCalledWith('data');
        });

        it('should handle async errors', async () => {
            const errorListener = vi.fn(async () => {
                throw new Error('Async error');
            });
            
            emitter.on('test', errorListener);

            await expect(emitter.emitAsync('test')).resolves.toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle errors in listeners', () => {
            const errorListener = vi.fn(() => {
                throw new Error('Test error');
            });
            const errorHandler = vi.fn();
            
            emitter.on('test', errorListener);
            emitter.on('error', errorHandler);

            emitter.emit('test', 'data');

            expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should not emit error event for error listeners', () => {
            const errorListener = vi.fn(() => {
                throw new Error('Test error');
            });
            
            emitter.on('error', errorListener);

            // Should not cause infinite loop
            expect(() => {
                emitter.emit('error', new Error('Original error'));
            }).not.toThrow();
        });
    });

    describe('Event Management', () => {
        it('should return event names', () => {
            emitter.on('event1', vi.fn());
            emitter.on('event2', vi.fn());

            const eventNames = emitter.eventNames();
            expect(eventNames).toContain('event1');
            expect(eventNames).toContain('event2');
        });

        it('should check if event has listeners', () => {
            emitter.on('test', vi.fn());

            expect(emitter.hasListeners('test')).toBe(true);
            expect(emitter.hasListeners('nonexistent')).toBe(false);
        });

        it('should remove all listeners', () => {
            emitter.on('event1', vi.fn());
            emitter.on('event2', vi.fn());

            emitter.removeAllListeners();

            expect(emitter.eventNames()).toHaveLength(0);
        });

        it('should remove all listeners for specific event', () => {
            emitter.on('event1', vi.fn());
            emitter.on('event2', vi.fn());

            emitter.removeAllListeners('event1');

            expect(emitter.hasListeners('event1')).toBe(false);
            expect(emitter.hasListeners('event2')).toBe(true);
        });
    });

    describe('Max Listeners', () => {
        it('should warn when exceeding max listeners', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            
            emitter.setMaxListeners(2);

            emitter.on('test', vi.fn());
            emitter.on('test', vi.fn());
            emitter.on('test', vi.fn()); // Should trigger warning

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('MaxListenersExceededWarning')
            );

            consoleSpy.mockRestore();
        });

        it('should get and set max listeners', () => {
            emitter.setMaxListeners(5);
            expect(emitter.getMaxListeners()).toBe(5);
        });

        it('should validate max listeners value', () => {
            expect(() => {
                emitter.setMaxListeners(-1);
            }).toThrow('n must be a non-negative number');
        });
    });

    describe('Utility Methods', () => {
        it('should clone emitter', () => {
            const listener = vi.fn();
            emitter.on('test', listener);
            emitter.setMaxListeners(5);

            const cloned = emitter.clone();

            expect(cloned.listenerCount('test')).toBe(1);
            expect(cloned.getMaxListeners()).toBe(5);
        });

        it('should pipe events from another emitter', () => {
            const source = new EventEmitter();
            const listener = vi.fn();
            
            emitter.on('test', listener);
            emitter.pipe(source);

            source.emit('test', 'data');

            expect(listener).toHaveBeenCalledWith('data');
        });

        it('should provide debug information', () => {
            emitter.on('event1', vi.fn());
            emitter.on('event1', vi.fn());
            emitter.on('event2', vi.fn());

            const debug = emitter.debug();

            expect(debug.events).toContain('event1');
            expect(debug.events).toContain('event2');
            expect(debug.listenerCounts.event1).toBe(2);
            expect(debug.listenerCounts.event2).toBe(1);
            expect(debug.totalListeners).toBe(3);
        });

        it('should destroy emitter', () => {
            emitter.on('test', vi.fn());
            
            emitter.destroy();

            expect(emitter.eventNames()).toHaveLength(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty event names', () => {
            const listener = vi.fn();
            emitter.on('', listener);

            emitter.emit('', 'data');

            expect(listener).toHaveBeenCalledWith('data');
        });

        it('should handle undefined data', () => {
            const listener = vi.fn();
            emitter.on('test', listener);

            emitter.emit('test');

            expect(listener).toHaveBeenCalledWith(undefined);
        });

        it('should handle null data', () => {
            const listener = vi.fn();
            emitter.on('test', listener);

            emitter.emit('test', null);

            expect(listener).toHaveBeenCalledWith(null);
        });

        it('should handle listeners being modified during emission', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn(() => {
                emitter.off('test', listener1);
            });
            
            emitter.on('test', listener1);
            emitter.on('test', listener2);

            emitter.emit('test', 'data');

            expect(listener1).toHaveBeenCalledWith('data');
            expect(listener2).toHaveBeenCalledWith('data');
        });
    });
});