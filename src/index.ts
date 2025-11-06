// Writing.js v2.0.0 - Enhanced Typography Animation Library
// Main entry point

export { WritingJS } from './core/WritingJS';
export { WritingSequence } from './core/WritingSequence';
export { WritingPlayground } from './tools/WritingPlayground';

// Effects
export { TypeWriter } from './effects/TypeWriter';
export { FadeWriter } from './effects/FadeWriter';
export { GlitchWriter } from './effects/GlitchWriter';

// Utilities
export { DOMUtils } from './utils/DOMUtils';
export { ValidationUtils } from './utils/ValidationUtils';
export { EventEmitter } from './utils/EventEmitter';

// Types
export type {
    WritingOptions,
    WritingEffects,
    WritingEvents,
    WritingState,
    CursorOptions,
    SoundOptions,
    AnimationOptions
} from './types/WritingTypes';

// React Hook (if React is available)
export { useWriting } from './integrations/useWriting';

// Vue Directive (if Vue is available)
export { writingDirective } from './integrations/vueDirective';

// Legacy support for backward compatibility
export { animationWriting } from './legacy/LegacySupport';