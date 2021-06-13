import { Template } from '../../template';

export type TokenConstructor = { new (content: string): Token };

export abstract class Token {
    readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    abstract render(template: Template): Promise<string>;

    static async renderTokens (tokens: Token[], template: Template): Promise<string> {
        const rendered = await Promise.all(tokens.map(t => t.render(template)));
        return rendered.join('');
    }

    static getValue(key: string, data: Record<string, any>): any {
        const keyParts = key.trim().split('.');
        return keyParts.reduce((obj: any, prop: string) => typeof obj === 'undefined' ? undefined : obj[prop], data);
    }

    static getString(key: string, data: Record<string, any>): string {
        const value = Token.getValue(key, data);
        
        return typeof value !== 'undefined' ? value.toString() : '';
    }
}