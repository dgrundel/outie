import { RenderModel } from '../../config';
import { Template } from '../../template';

export type TokenConstructor = { new (content: string, sourceTemplate?: Template): Token };

export abstract class Token {
    readonly content: string;
    readonly sourceTemplate?: Template;

    constructor(content: string, sourceTemplate?: Template) {
        this.content = content;
        this.sourceTemplate = sourceTemplate;
    }

    abstract render(model: RenderModel): Promise<string>;

    static async renderTokens (tokens: Token[], model: RenderModel): Promise<string> {
        const rendered = await Promise.all(tokens.map(t => t.render(model)));
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