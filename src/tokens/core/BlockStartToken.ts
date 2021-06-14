import { RenderModel } from '../../config';
import { Template } from '../../template';
import { Token } from './Token';

/**
 * Base class for all tokens that have start and end tags.
 */
export abstract class BlockStartToken extends Token {
    protected readonly children: Token[] = [];

    append(child: Token) {
        this.children.push(child);
    }

    async render(model: RenderModel): Promise<string> {
        return Token.renderTokens(this.children, model);
    }
}
