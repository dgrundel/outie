import { ModelKeyToken } from './ModelKeyToken';
import { Token } from './core/Token';
import { RenderModel } from '../config';

export class RawModelKeyToken extends ModelKeyToken {
    async render(model: RenderModel) {
        return Token.getString(this.content, model);
    }
}