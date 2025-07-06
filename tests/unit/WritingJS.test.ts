// Unit tests for WritingJS core functionality

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WritingJS } from '../../src/core/WritingJS';
import { createTestElement, waitForAnimation, waitForNextTick } from '../setup';

describe('WritingJS', () => {
    let element: HTMLElement;
    let writer: WritingJS;

    beforeEach(() => {
        element = createTestElement();
        vi.clearAllTimers();
        vi.useFakeTimers();
    });

    afterEach(() => {
        writer?.destroy();
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    describe('Constructor', () => {
        it('should create instance with element and config', () => {
            writer = new WritingJS(element, {
                words: ['test']
            });

            expect(writer).toBeInstanceOf(WritingJS);
            expect(writer.getId()).toBeDefined();
            expect(writer.getState().isRunning).toBe(false);
        });

        it('should create instance with CSS selector', () => {
            writer = new WritingJS('#test-element', {
                words: ['test']
            });

            expect(writer).toBeInstanceOf(WritingJS);
        });

        it('should throw error for invalid element', () => {
            expect(() => {
                new WritingJS('#nonexistent', { words: ['test'] });
            }).toThrow('Element not found');
        });

        it('should use default words when none provided', () => {
            writer = new WritingJS(element);
            const config = writer.getState();
            expect(writer['config'].words).toEqual(['Hello', 'World']);
        });

        it('should merge configurations correctly', () => {
            writer = new WritingJS(element, {
                words: ['custom'],
                times: { writer: 200, eraser: 50, read: 1500 },
                cursor: { enabled: true, character: '_', blinkSpeed: 800, style: 'color: inherit' }
            });

            const config = writer['config'];
            expect(config.words).toEqual(['custom']);
            expect(config.times?.writer).toBe(200);
            expect(config.times?.eraser).toBe(50); // Default value
            expect(config.cursor?.character).toBe('_');
        });
    });

    describe('Animation Control', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['hello', 'world'],
                times: { writer: 50, eraser: 25, read: 100 }
            });
        });

        it('should start animation', () => {
            const startSpy = vi.fn();
            writer.on('start', startSpy);

            writer.start();

            expect(writer.isAnimating()).toBe(true);
            expect(writer.getState().isRunning).toBe(true);
            expect(startSpy).toHaveBeenCalled();
        });

        it('should not start if already running', () => {
            writer.start();
            const initialState = writer.getState();
            
            writer.start(); // Try to start again
            
            expect(writer.getState().startTime).toBe(initialState.startTime);
        });

        it('should stop animation', () => {
            const completeSpy = vi.fn();
            writer.on('complete', completeSpy);

            writer.start();
            writer.stop();

            expect(writer.isAnimating()).toBe(false);
            expect(writer.getState().isRunning).toBe(false);
            expect(writer.getState().isPaused).toBe(false);
            expect(completeSpy).toHaveBeenCalled();
        });

        it('should pause animation', () => {
            const pauseSpy = vi.fn();
            writer.on('pause', pauseSpy);

            writer.start();
            writer.pause();

            expect(writer.getState().isRunning).toBe(true);
            expect(writer.getState().isPaused).toBe(true);
            expect(pauseSpy).toHaveBeenCalled();
        });

        it('should resume animation', () => {
            const resumeSpy = vi.fn();
            writer.on('resume', resumeSpy);

            writer.start();
            writer.pause();
            writer.resume();

            expect(writer.getState().isRunning).toBe(true);
            expect(writer.getState().isPaused).toBe(false);
            expect(resumeSpy).toHaveBeenCalled();
        });

        it('should restart animation', () => {
            writer.start();
            vi.advanceTimersByTime(100);
            
            const initialProgress = writer.getProgress();
            writer.restart();

            expect(writer.getState().currentWordIndex).toBe(0);
            expect(writer.getState().currentCharIndex).toBe(0);
            expect(writer.getProgress()).toBeLessThan(initialProgress);
        });
    });

    describe('Text Animation', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['hello'],
                times: { writer: 10, eraser: 5, read: 20 }
            });
        });

        it('should write characters progressively', async () => {
            const characterSpy = vi.fn();
            writer.on('characterWrite', characterSpy);

            writer.start();
            
            // Advance through character writing
            vi.advanceTimersByTime(50);
            await waitForNextTick();

            expect(characterSpy).toHaveBeenCalled();
            expect(element.textContent).toContain('h');
        });

        it('should complete word and trigger event', async () => {
            const wordCompleteSpy = vi.fn();
            writer.on('wordComplete', wordCompleteSpy);

            writer.start();
            
            // Advance through entire word cycle
            vi.advanceTimersByTime(200);
            await waitForNextTick();

            expect(wordCompleteSpy).toHaveBeenCalledWith('hello', 0);
        });

        it('should handle multiple words', async () => {
            writer.setWords(['first', 'second']);
            
            const wordStartSpy = vi.fn();
            writer.on('wordStart', wordStartSpy);

            writer.start();
            
            // Advance through first word cycle
            vi.advanceTimersByTime(300);
            await waitForNextTick();

            expect(wordStartSpy).toHaveBeenCalledTimes(2);
        });

        it('should handle infinite animation', async () => {
            writer.setOptions({ 
                animation: { 
                    infinite: true, 
                    pauseOnHover: false, 
                    direction: 'forward', 
                    easing: 'ease', 
                    delay: 0 
                } 
            });
            
            writer.start();
            
            // Complete multiple cycles
            vi.advanceTimersByTime(1000);
            await waitForNextTick();

            expect(writer.getState().isRunning).toBe(true);
        });
    });

    describe('Cursor Functionality', () => {
        it('should create cursor element when enabled', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                cursor: { enabled: true, character: '|', blinkSpeed: 800, style: 'color: inherit' }
            });

            const cursor = element.querySelector('.writing-cursor');
            expect(cursor).toBeTruthy();
            expect(cursor?.textContent).toBe('|');
        });

        it('should not create cursor when disabled', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                cursor: { enabled: false, character: '|', blinkSpeed: 800, style: 'color: inherit' }
            });

            const cursor = element.querySelector('.writing-cursor');
            expect(cursor).toBeFalsy();
        });

        it('should use custom cursor character', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                cursor: { enabled: true, character: '_', blinkSpeed: 800, style: 'color: inherit' }
            });

            const cursor = element.querySelector('.writing-cursor');
            expect(cursor?.textContent).toBe('_');
        });
    });

    describe('Event System', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['test'],
                times: { writer: 10, eraser: 5, read: 10 }
            });
        });

        it('should emit start event', () => {
            const startSpy = vi.fn();
            writer.on('start', startSpy);

            writer.start();

            expect(startSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    isRunning: true,
                    currentWordIndex: 0,
                    currentCharIndex: 0
                })
            );
        });

        it('should emit character events', async () => {
            const characterSpy = vi.fn();
            writer.on('characterWrite', characterSpy);

            writer.start();
            vi.advanceTimersByTime(50);
            await waitForNextTick();

            expect(characterSpy).toHaveBeenCalledWith('t', 0);
        });

        it('should handle multiple event listeners', () => {
            const spy1 = vi.fn();
            const spy2 = vi.fn();

            writer.on('start', spy1);
            writer.on('start', spy2);

            writer.start();

            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });

        it('should remove event listeners', () => {
            const spy = vi.fn();
            writer.on('start', spy);
            writer.off('start', spy);

            writer.start();

            expect(spy).not.toHaveBeenCalled();
        });

        it('should handle error events', () => {
            const errorSpy = vi.fn();
            writer.on('error', errorSpy);

            // Trigger an error condition
            writer.emit('error', new Error('Test error'));

            expect(errorSpy).toHaveBeenCalledWith(
                expect.any(Error)
            );
        });
    });

    describe('Configuration', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['test']
            });
        });

        it('should update words', () => {
            const newWords = ['new', 'words'];
            writer.setWords(newWords);

            expect(writer['config'].words).toEqual(newWords);
        });

        it('should update speed', () => {
            writer.setSpeed(200);

            expect(writer['config'].times?.writer).toBe(200);
        });

        it('should update options', () => {
            writer.setOptions({
                times: { writer: 150, eraser: 75, read: 1000 },
                animation: { infinite: true, pauseOnHover: false, direction: 'forward', easing: 'ease', delay: 0 }
            });

            expect(writer['config'].times?.writer).toBe(150);
            expect(writer['config'].times?.eraser).toBe(75);
            expect(writer['config'].animation?.infinite).toBe(true);
        });
    });

    describe('State Management', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['hello', 'world'],
                times: { writer: 10, eraser: 5, read: 10 }
            });
        });

        it('should return current state', () => {
            const state = writer.getState();

            expect(state).toEqual({
                isRunning: false,
                isPaused: false,
                currentWordIndex: 0,
                currentCharIndex: 0,
                currentWord: '',
                progress: 0,
                startTime: 0,
                elapsedTime: 0
            });
        });

        it('should update progress during animation', async () => {
            writer.start();
            vi.advanceTimersByTime(50);
            await waitForNextTick();

            const progress = writer.getProgress();
            expect(progress).toBeGreaterThan(0);
            expect(progress).toBeLessThanOrEqual(1);
        });

        it('should track current word', async () => {
            writer.start();
            vi.advanceTimersByTime(20);
            await waitForNextTick();

            expect(writer.getCurrentWord()).toBe('hello');
        });

        it('should return immutable state', () => {
            const state1 = writer.getState();
            const state2 = writer.getState();

            expect(state1).not.toBe(state2); // Different objects
            expect(state1).toEqual(state2); // Same values
        });
    });

    describe('Performance Metrics', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['test']
            });
        });

        it('should return performance metrics', () => {
            const metrics = writer.getMetrics();

            expect(metrics).toEqual({
                frameDrops: 0,
                averageFPS: 0,
                memoryUsage: 0,
                animationDuration: 0,
                lastFrameTime: 0
            });
        });

        it('should update metrics during animation', async () => {
            writer.start();
            vi.advanceTimersByTime(100);
            await waitForNextTick();

            const metrics = writer.getMetrics();
            expect(metrics.animationDuration).toBeGreaterThan(0);
        });
    });

    describe('Effects', () => {
        it('should handle typing effects', () => {
            writer = new WritingJS(element, {
                words: ['test']
            });

            expect(writer['config'].effects?.typing?.randomSpeed).toBe(false);
            expect(writer['config'].effects?.typing?.speedVariation).toBe(0.2);
        });

        it('should handle visual effects configuration', () => {
            writer = new WritingJS(element, {
                words: ['test']
            });

            expect(writer['config'].effects?.visual?.fadeIn).toBe(false);
            expect(writer['config'].effects?.visual?.glitch).toBe(false);
            expect(writer['config'].effects?.visual?.shake).toBe(false);
        });

        it('should handle sound effects configuration', () => {
            writer = new WritingJS(element, {
                words: ['test']
            });

            expect(writer['config'].effects?.sound?.enabled).toBe(false);
            expect(writer['config'].effects?.sound?.volume).toBe(0.5);
        });
    });

    describe('Hover Behavior', () => {
        it('should pause on hover when enabled', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                animation: { 
                    pauseOnHover: true, 
                    infinite: false, 
                    direction: 'forward', 
                    easing: 'ease', 
                    delay: 0 
                }
            });

            writer.start();
            
            // Simulate mouse enter
            element.dispatchEvent(new Event('mouseenter'));
            
            expect(writer.getState().isPaused).toBe(true);
        });

        it('should resume on mouse leave', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                animation: { 
                    pauseOnHover: true, 
                    infinite: false, 
                    direction: 'forward', 
                    easing: 'ease', 
                    delay: 0 
                }
            });

            writer.start();
            element.dispatchEvent(new Event('mouseenter'));
            element.dispatchEvent(new Event('mouseleave'));
            
            expect(writer.getState().isPaused).toBe(false);
        });

        it('should not pause on hover when disabled', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                animation: { 
                    pauseOnHover: false, 
                    infinite: false, 
                    direction: 'forward', 
                    easing: 'ease', 
                    delay: 0 
                }
            });

            writer.start();
            element.dispatchEvent(new Event('mouseenter'));
            
            expect(writer.getState().isPaused).toBe(false);
        });
    });

    describe('Cleanup and Destruction', () => {
        beforeEach(() => {
            writer = new WritingJS(element, {
                words: ['test'],
                cursor: { enabled: true, character: '|', blinkSpeed: 800, style: 'color: inherit' }
            });
        });

        it('should stop animation on destroy', () => {
            writer.start();
            writer.destroy();

            expect(writer.getState().isRunning).toBe(false);
        });

        it('should remove cursor on destroy', () => {
            const cursor = element.querySelector('.writing-cursor');
            expect(cursor).toBeTruthy();

            writer.destroy();

            const cursorAfter = element.querySelector('.writing-cursor');
            expect(cursorAfter).toBeFalsy();
        });

        it('should restore original content on destroy', () => {
            const originalContent = element.innerHTML;
            element.innerHTML = 'original content';
            
            writer = new WritingJS(element, { words: ['test'] });
            writer.destroy();

            expect(element.innerHTML).toBe('original content');
        });

        it('should remove all event listeners on destroy', () => {
            const spy = vi.fn();
            writer.on('test', spy);

            writer.destroy();
            writer.emit('test');

            expect(spy).not.toHaveBeenCalled();
        });

        it('should throw error when using destroyed instance', () => {
            writer.destroy();

            expect(() => {
                writer.start();
            }).toThrow('WritingJS instance has been destroyed');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty words array gracefully', () => {
            expect(() => {
                writer = new WritingJS(element, { words: [] });
            }).not.toThrow();
        });

        it('should handle very fast speeds', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                times: { writer: 1, eraser: 1, read: 1 }
            });

            expect(() => {
                writer.start();
                vi.advanceTimersByTime(100);
            }).not.toThrow();
        });

        it('should handle very slow speeds', () => {
            writer = new WritingJS(element, {
                words: ['test'],
                times: { writer: 5000, eraser: 5000, read: 5000 }
            });

            expect(() => {
                writer.start();
            }).not.toThrow();
        });

        it('should handle special characters', () => {
            writer = new WritingJS(element, {
                words: ['🎉✨🚀', 'àáâãäå', '中文测试']
            });

            expect(() => {
                writer.start();
                vi.advanceTimersByTime(100);
            }).not.toThrow();
        });

        it('should handle HTML entities', () => {
            writer = new WritingJS(element, {
                words: ['&lt;script&gt;', '&amp;', '&quot;test&quot;']
            });

            expect(() => {
                writer.start();
                vi.advanceTimersByTime(100);
            }).not.toThrow();
        });
    });
});