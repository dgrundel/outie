import { RenderModel } from '../config';
import { encodeHtml } from '../encoder';
import { Token } from './core/Token';

export class ModelKeyToken extends Token {
    async render(model: RenderModel) {
        const value = Token.getString(this.content, model);
        return value ? encodeHtml(value) : '';
    }
}