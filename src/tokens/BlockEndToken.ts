import { Token, TokenConstructor } from './Token';

/**
 * This is a sort of meta token that is used to signal the 
 * close of a block (e.g. it's used for "/for", "/if", etc.)
 */
 export class BlockEndToken extends Token {
    readonly type: TokenConstructor;

    constructor(type: TokenConstructor) {
        super('');
        this.type = type;
    }

    render(): Promise<string> {
        throw new Error(`${this.constructor.name}.render should never be called.`);
    }
}