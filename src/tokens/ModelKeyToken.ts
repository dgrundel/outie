import { encodeHtml } from '../encoder';
import { Template } from '../template';
import { Token } from './Token';

export class ModelKeyToken extends Token {
    async render(template: Template) {
        const value = Token.getString(this.content, template.model);
        return value ? encodeHtml(value) : '';
    }
}