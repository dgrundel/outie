import { Token, TokenConstructor } from './Token';
/**
 * This is a sort of meta token that is used to signal the
 * close of a block (e.g. it's used for "/for", "/if", etc.)
 */
export declare class BlockEndToken extends Token {
    readonly type: TokenConstructor;
    constructor(type: TokenConstructor);
    render(): Promise<string>;
}
//# sourceMappingURL=BlockEndToken.d.ts.map