import { TokenConstructor } from './tokens/Token';
export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;
    closeTokenIdentifier: string;
    tokens: Record<string, TokenConstructor>;
}
export declare const getConfig: (userConfig?: Partial<OutieConfig>) => OutieConfig & Partial<OutieConfig>;
export declare type RenderModel = Record<string, any>;
//# sourceMappingURL=config.d.ts.map