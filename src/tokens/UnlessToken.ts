import { Template } from '../template';
import { BlockStartToken } from './core/BlockStartToken';
import { Token } from './core/Token';

export class UnlessToken extends BlockStartToken {
    async render(template: Template): Promise<string> {
        const condition = Token.getValue(this.content, template.model);
        return !condition ? Token.renderTokens(this.children, template) : '';
    }
}