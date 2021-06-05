export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;
    closeTokenIdentifier: string;
    rawTokenIdentifier: string;
    rawIncludeTokenIdentifier: string;
    includeTokenIdentifier: string;
    ifTokenIdentifier: string;
    unlessTokenIdentifier: string;
    forTokenIdentifier: string;
}
export declare const getConfig: (userConfig?: Partial<OutieConfig>) => OutieConfig & Partial<OutieConfig>;
export declare type RenderModel = Record<string, any>;
//# sourceMappingURL=config.d.ts.map