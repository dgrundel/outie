export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;

    // raw model accessor
    rawTokenIdentifier: string;

    // include raw file contents, no processing
    rawIncludeTokenIdentifier: string;

    // include partial
    includeTokenIdentifier: string;
}

const defaultConfig: OutieConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    rawTokenIdentifier: 'raw',
    rawIncludeTokenIdentifier: 'includeRaw',
    includeTokenIdentifier: 'include',
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};

export type RenderModel = Record<string, any>;