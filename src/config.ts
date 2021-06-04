export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;
    rawTokenIdentifier: string;
    includeTokenIdentifier: string;
}

const defaultConfig: OutieConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    rawTokenIdentifier: 'raw',
    includeTokenIdentifier: 'include',
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};

export type RenderModel = Record<string, any>;