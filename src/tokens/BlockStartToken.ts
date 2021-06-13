import { Token } from './Token';

/**
 * Base class for all tokens that have start and end tags.
 */
 export abstract class BlockStartToken extends Token {
    readonly children: Token[] = [];
}
