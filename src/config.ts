export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;

    // for tokens that have an open and close (e.g. "if")
    // the sequence that indicates an "end" token
    closeTokenIdentifier: string;

    // raw model accessor
    rawTokenIdentifier: string;
    // include raw file contents, no processing
    rawIncludeTokenIdentifier: string;
    // include partial
    includeTokenIdentifier: string;
    // if
    ifTokenIdentifier: string;
    // unless (if not)
    unlessTokenIdentifier: string;

}

const defaultConfig: OutieConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',
    rawTokenIdentifier: 'raw',
    rawIncludeTokenIdentifier: 'includeRaw',
    includeTokenIdentifier: 'include',
    ifTokenIdentifier: 'if',
    unlessTokenIdentifier: 'unless',
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};

export type RenderModel = Record<string, any>;