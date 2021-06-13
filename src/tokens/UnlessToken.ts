import { RenderModel } from '../config';
import { BlockStartToken } from './core/BlockStartToken';
import { Token } from './core/Token';

export class UnlessToken extends BlockStartToken {
    async render(model: RenderModel): Promise<string> {
        const condition = Token.getValue(this.content, model);
        return !condition ? Token.renderTokens(this.children, model) : '';
    }
}