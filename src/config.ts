import { ForToken } from './tokens/ForToken';
import { IfToken } from './tokens/IfToken';
import { IncludeToken } from './tokens/IncludeToken';
import { RawIncludeToken } from './tokens/RawIncludeToken';
import { RawModelKeyToken } from './tokens/RawModelKeyToken';
import { TokenConstructor } from './tokens/Token';
import { UnlessToken } from './tokens/UnlessToken';

export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;

    // for tokens that have an open and close (e.g. "if")
    // the sequence that indicates an "end" token
    closeTokenIdentifier: string;

    tokens: Record<string, TokenConstructor>;
}

const defaultConfig: OutieConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',

    tokens: {
        'raw': RawModelKeyToken,
        'includeRaw': RawIncludeToken,
        'include': IncludeToken,
        'if': IfToken,
        'unless': UnlessToken,
        'for': ForToken,
    }
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};

export type RenderModel = Record<string, any>;