import { RenderModel } from './config';
import { Tokenizer } from './tokenizer';
import { Token } from './tokens/core/Token';
export declare class Template {
    readonly content: string;
    readonly tokenizer: Tokenizer;
    readonly dir?: string;
    tokens?: Token[];
    private static readonly fileCache;
    constructor(content: string, tokenizer: Tokenizer, dir?: string, tokens?: Token[]);
    compile(): Token[];
    render(model: RenderModel): Promise<string>;
    static fromFile(filePath: string, tokenizer: Tokenizer, cwd?: string): Promise<Template>;
    static fromString(content: string, tokenizer: Tokenizer): Promise<Template>;
}
//# sourceMappingURL=template.d.ts.map