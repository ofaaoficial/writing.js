// Legacy support for Writing.js v2.0.0
// Maintains backward compatibility with v1.x

import { WritingJS } from '../core/WritingJS';
import { DOMUtils } from '../utils/DOMUtils';
import { ValidationUtils } from '../utils/ValidationUtils';
import { WritingConfig } from '../types/WritingTypes';

// Legacy global options
let LEGACY_GLOBAL_OPTIONS = {
    times: {
        writer: 150,
        eraser: 150,
        read: 1000
    },
    infinite: false
};

/**
 * Legacy animationWriting function for backward compatibility
 * @param selector Element selector
 * @param arrayContent Array of words (optional)
 * @param options Configuration options (optional)
 */
export const animationWriting = async (
    selector: string,
    arrayContent: string[] = [],
    options: any = null
): Promise<void> => {
    try {
        // Validate inputs using legacy style
        const element = DOMUtils.getElement(selector);
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }

        // Process options in legacy format
        let config: Partial<WritingConfig> = {};
        
        if (options) {
            // Legacy options processing
            if (options.times) {
                config.times = {
                    writer: options.times.writer || LEGACY_GLOBAL_OPTIONS.times.writer,
                    eraser: options.times.eraser || LEGACY_GLOBAL_OPTIONS.times.eraser,
                    read: options.times.read || LEGACY_GLOBAL_OPTIONS.times.read
                };
            } else {
                config.times = LEGACY_GLOBAL_OPTIONS.times;
            }

            // Legacy styles processing
            if (options.styles && Array.isArray(options.styles)) {
                config.styles = options.styles;
            }

            // Legacy infinite option
            if (typeof options.infinite === 'boolean') {
                config.infinite = options.infinite;
            } else {
                config.infinite = LEGACY_GLOBAL_OPTIONS.infinite;
            }
        } else {
            config.times = LEGACY_GLOBAL_OPTIONS.times;
            config.infinite = LEGACY_GLOBAL_OPTIONS.infinite;
        }

        // Get words from array or element attributes
        let words: string[] = [];
        
        if (arrayContent && arrayContent.length > 0) {
            words = arrayContent;
        } else {
            // Try to get words from element attributes (legacy way)
            const wordsAttr = element.getAttribute('wj-words');
            if (wordsAttr) {
                words = wordsAttr.split(',').map(word => word.trim()).filter(word => word.length > 0);
            }
        }

        if (words.length === 0) {
            throw new Error('No words provided for animation');
        }

        // Create WritingJS instance with legacy-compatible config
        const writer = new WritingJS(element, {
            words,
            ...config,
            cursor: {
                enabled: true,
                character: '|',
                blinkSpeed: 500,
                style: 'color: currentColor'
            }
        });

        // Start animation and wait for completion
        return new Promise((resolve) => {
            writer.on('complete', () => {
                resolve();
            });
            
            writer.on('error', (error) => {
                console.error('Animation error:', error);
                resolve();
            });
            
            writer.start();
        });

    } catch (error) {
        console.error('Legacy animationWriting error:', error);
        throw error;
    }
};

/**
 * Legacy writer function
 * @param elementHTML HTML element
 * @param arrayLetters Array of characters
 */
export const writer = (
    elementHTML: HTMLElement,
    arrayLetters: string[] = ['n', 'o', ' ', 't', 'e', 'x', 't']
): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!elementHTML) {
            reject(new Error('The HTML Element is required.'));
            return;
        }

        if (!Array.isArray(arrayLetters)) {
            reject(new Error('The param arrayLetters must be an array of strings.'));
            return;
        }

        let positionArrayCharacters = 0;
        const positionArrayCharactersMax = arrayLetters.length;

        const intervalAnimationWriter = setInterval(() => {
            if (positionArrayCharacters < positionArrayCharactersMax) {
                elementHTML.innerHTML += arrayLetters[positionArrayCharacters];
                positionArrayCharacters++;
            } else {
                clearInterval(intervalAnimationWriter);
                resolve();
            }
        }, elementHTML.getAttribute('wj-writerTime') ? 
            parseInt(elementHTML.getAttribute('wj-writerTime')!) : 
            LEGACY_GLOBAL_OPTIONS.times.writer);
    });
};

/**
 * Legacy eraser function
 * @param elementHTML HTML element
 */
export const eraser = (elementHTML: HTMLElement): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!elementHTML) {
            reject(new Error('The HTML Element is required.'));
            return;
        }

        setTimeout(() => {
            let lengthCharacters = elementHTML.innerText.length;
            const characters = elementHTML.innerText;

            const intervalAnimationEraser = setInterval(() => {
                elementHTML.innerText = characters.slice(0, lengthCharacters);

                if (lengthCharacters > 0) {
                    lengthCharacters--;
                } else {
                    clearInterval(intervalAnimationEraser);
                    resolve();
                }
            }, elementHTML.getAttribute('wj-eraserTime') ? 
                parseInt(elementHTML.getAttribute('wj-eraserTime')!) : 
                LEGACY_GLOBAL_OPTIONS.times.eraser);
        }, elementHTML.getAttribute('wj-readTime') ? 
            parseInt(elementHTML.getAttribute('wj-readTime')!) : 
            LEGACY_GLOBAL_OPTIONS.times.read);
    });
};

/**
 * Legacy error message function
 * @param message Error message
 * @param example Example code (optional)
 */
const errorMessage = (message: string, example: string = ''): never => {
    throw new Error(`\n\n  ${message} \n ${example} \n\n`);
};

/**
 * Legacy getElement function
 * @param selector Element selector
 */
const getElement = (selector: string): HTMLElement | null => {
    return document.querySelector(selector);
};

/**
 * Legacy setStyles function
 * @param selector Element selector
 * @param arrayDeclarations Array of CSS declarations
 */
const setStyles = (selector: string, arrayDeclarations: string[]): void => {
    if (!Array.isArray(arrayDeclarations)) {
        errorMessage('Is required an array with declarations of styles.', `{styles: ["color: white", "background: black"]} <=`);
    }

    try {
        // Try modern approach first
        const sheet = new CSSStyleSheet();
        let properties = '';
        arrayDeclarations.forEach(property => properties += `${property}; `);
        sheet.replaceSync(`${selector} {position: relative; ${properties}}`);
        
        if (document.adoptedStyleSheets) {
            document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
        } else {
            document.adoptedStyleSheets = [sheet];
        }
    } catch (error) {
        // Fallback to traditional style injection
        const styleElement = document.createElement('style');
        let properties = '';
        arrayDeclarations.forEach(property => properties += `${property}; `);
        styleElement.textContent = `${selector} {position: relative; ${properties}}`;
        document.head.appendChild(styleElement);
    }
};

/**
 * Legacy getWords function
 * @param elementHTML HTML element
 */
const getWords = (elementHTML: HTMLElement): string[] => {
    const attributeWords = elementHTML.getAttribute('wj-words');
    let words: string[] = [];
    const className = `.${elementHTML.getAttribute('wj-class')}` || '.wj-word';

    if (attributeWords) {
        words = attributeWords.split(',');
    } else {
        const content = document.querySelectorAll(className);

        if (content.length === 1) {
            errorMessage('It is recommended that you use the \'wj-words\' tag for a single word.', '<p id="example" wj-words="word"><p>');
        } else if (content.length < 1) {
            errorMessage('Items with these classes are required to run the animation.');
        }

        content.forEach(element => {
            words.push(element.textContent || '');
            element.remove();
        });
    }

    return words;
};

// Legacy module exports for Node.js compatibility
export const legacyModule = {
    animationWriting,
    writer,
    eraser
};

// Global object attachment for browser compatibility
if (typeof window !== 'undefined') {
    (window as any).animationWriting = animationWriting;
    (window as any).writer = writer;
    (window as any).eraser = eraser;
}

// Default export for compatibility
export default animationWriting;