import { Token } from './core/Token';

export class RawToken extends Token {
    async render() {
        return this.content;
    }
}