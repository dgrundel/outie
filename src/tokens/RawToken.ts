import { Token } from './Token';

export class RawToken extends Token {
    async render() {
        return this.content;
    }
}