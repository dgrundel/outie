import { TokenConstructor } from './tokens/core/Token';
import { Cache } from './cache';
import { Template } from './template';
export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;
    closeTokenIdentifier: string;
    tokens: Record<string, TokenConstructor>;
    fileCache: Cache<Template>;
}
export declare const defaultConfig: OutieConfig;
export declare const getConfig: (userConfig?: Partial<OutieConfig>) => OutieConfig & Partial<OutieConfig>;
export declare type RenderModel = Record<string, any>;
//# sourceMappingURL=config.d.ts.map