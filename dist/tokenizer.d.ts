import { OutieConfig } from "./config";
import { Template } from "./template";
declare type TokenConstructor = {
    new (content: string): Token;
};
export declare abstract class Token {
    readonly content: string;
    constructor(content: string);
    abstract render(template: Template, tokenizer: Tokenizer): Promise<string>;
    static getValue(key: string, data: Record<string, any>): any;
    static getString(key: string, data: Record<string, any>): string;
}
export declare class RawToken extends Token {
    render(): Promise<string>;
}
export declare class ModelKeyToken extends Token {
    render(template: Template): Promise<string>;
}
export declare class RawModelKeyToken extends ModelKeyToken {
    render(template: Template): Promise<string>;
}
export declare class IncludeToken extends Token {
    render(template: Template, tokenizer: Tokenizer): Promise<string>;
}
export declare class RawIncludeToken extends Token {
    render(template: Template): Promise<string>;
}
/**
 * Base class for all tokens that have start and end tags.
 */
export declare abstract class BlockStartToken extends Token {
    readonly children: Token[];
}
/**
 * This is a sort of meta token that is used to signal the
 * close of a block (e.g. it's used for "/for", "/if", etc.)
 */
export declare class BlockEndToken extends Token {
    readonly type: TokenConstructor;
    constructor(type: TokenConstructor);
    render(): Promise<string>;
}
export declare class IfToken extends BlockStartToken {
    render(template: Template, tokenizer: Tokenizer): Promise<string>;
}
export declare class UnlessToken extends BlockStartToken {
    render(template: Template, tokenizer: Tokenizer): Promise<string>;
}
export declare class ForToken extends BlockStartToken {
    readonly valueVarName: string;
    readonly keyVarName?: string;
    readonly itemsKey: string;
    constructor(content: string);
    render(template: Template, tokenizer: Tokenizer): Promise<string>;
    static parseTokenContent(content: string): {
        valueVarName: string;
        keyVarName: string | undefined;
        itemsKey: string;
    };
}
export declare class Tokenizer {
    readonly config: OutieConfig;
    constructor(config: OutieConfig);
    createToken(content: string): Token;
    tokenize(s: string): Token[];
    renderTokens(tokens: Token[], template: Template): Promise<string>;
    renderTemplate(template: Template): Promise<string>;
}
export {};
//# sourceMappingURL=tokenizer.d.ts.map