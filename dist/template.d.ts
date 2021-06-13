import { RenderModel } from './config';
import { Tokenizer } from './tokenizer';
import { Token } from './tokens/core/Token';
export declare class Template {
    readonly content: string;
    readonly model: RenderModel;
    readonly tokenizer: Tokenizer;
    readonly dir?: string;
    tokens?: Token[];
    constructor(content: string, model: RenderModel, tokenizer: Tokenizer, dir?: string, tokens?: Token[]);
    withExtras(extras: RenderModel): Template;
    compile(): Token[];
    render(): Promise<string>;
    static fromFile(filePath: string, model: RenderModel, tokenizer: Tokenizer, cwd?: string): Promise<Template>;
    static fromString(content: string, model: RenderModel, tokenizer: Tokenizer): Promise<Template>;
}
//# sourceMappingURL=template.d.ts.map