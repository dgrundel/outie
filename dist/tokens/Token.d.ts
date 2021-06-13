import { Template } from '../template';
export declare type TokenConstructor = {
    new (content: string): Token;
};
export declare abstract class Token {
    readonly content: string;
    constructor(content: string);
    abstract render(template: Template): Promise<string>;
    static renderTokens(tokens: Token[], template: Template): Promise<string>;
    static getValue(key: string, data: Record<string, any>): any;
    static getString(key: string, data: Record<string, any>): string;
}
//# sourceMappingURL=Token.d.ts.map