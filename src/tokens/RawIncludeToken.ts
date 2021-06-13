import { Template } from '../template';
import { Token } from './Token';

export class RawIncludeToken extends Token {
    async render(template: Template) {
        const nested = await Template.fromFile(this.content, template.model, template.tokenizer, template.dir);
        // just return the raw file content
        return nested.content;
    }
}