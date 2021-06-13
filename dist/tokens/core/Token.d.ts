import { RenderModel } from '../../config';
import { Template } from '../../template';
export declare type TokenConstructor = {
    new (content: string, sourceTemplate?: Template): Token;
};
export declare abstract class Token {
    readonly content: string;
    readonly sourceTemplate?: Template;
    constructor(content: string, sourceTemplate?: Template);
    abstract render(model: RenderModel): Promise<string>;
    static renderTokens(tokens: Token[], model: RenderModel): Promise<string>;
    static getValue(key: string, data: Record<string, any>): any;
    static getString(key: string, data: Record<string, any>): string;
}
//# sourceMappingURL=Token.d.ts.map