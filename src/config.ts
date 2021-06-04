export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;

    // raw model accessor
    rawTokenIdentifier: string;

    // include partial
    includeTokenIdentifier: string;

    // include raw file contents, no processing
    rawIncludeTokenIdentifier: string;
}

/**
 * Names and ordering are important here. 
 * 
 * Since tokenizer doesn't look for trailing whitespace,
 * the order in which it checks for these identifiers may
 * lead to false identification if the identifiers are not carefully
 * chosen.
 */
const defaultConfig: OutieConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    rawTokenIdentifier: 'raw',
    includeTokenIdentifier: 'include',
    rawIncludeTokenIdentifier: 'includeRaw',
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};

export type RenderModel = Record<string, any>;