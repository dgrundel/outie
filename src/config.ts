export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;
    rawTokenIdentifier: string;
}

const defaultConfig: OutieConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    rawTokenIdentifier: '~',
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};