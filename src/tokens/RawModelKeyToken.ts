import { Template } from '../template';
import { ModelKeyToken } from './ModelKeyToken';
import { Token } from './core/Token';

export class RawModelKeyToken extends ModelKeyToken {
    async render(template: Template) {
        return Token.getString(this.content, template.model);
    }
}