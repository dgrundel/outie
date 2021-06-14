import { ForToken } from './tokens/ForToken';
import { IfToken } from './tokens/IfToken';
import { IncludeToken } from './tokens/IncludeToken';
import { RawIncludeToken } from './tokens/RawIncludeToken';
import { RawModelKeyToken } from './tokens/RawModelKeyToken';
import { TokenConstructor } from './tokens/core/Token';
import { UnlessToken } from './tokens/UnlessToken';
import { Cache, MruCache } from './cache';
import { Template } from './template';

export interface OutieConfig {
    tokenStart: string;
    tokenEnd: string;

    // for tokens that have an open and close (e.g. "if")
    // the sequence that indicates an "end" token
    closeTokenIdentifier: string;

    tokens: Record<string, TokenConstructor>;

    fileCache: Cache<Template>;
}

export const defaultConfig: OutieConfig = {
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
    },

    fileCache: new MruCache<Template>(),
};

export const getConfig = (userConfig: Partial<OutieConfig> = {}) => {
    return Object.assign({}, defaultConfig, userConfig);
};

export type RenderModel = Record<string, any>;