import { Template } from '../template';
import { Token } from './core/Token';

export class IncludeToken extends Token {
    async render(template: Template) {
        const nested = await Template.fromFile(this.content, template.model, template.tokenizer, template.dir);
        return nested.render();
    }
}