import * as fs from 'fs';
import * as path from 'path';
import { RenderModel } from './config';
import { Tokenizer } from './tokenizer';
import { Token } from './tokens/Token';

export class Template {
    readonly content: string;
    readonly model: RenderModel;
    readonly tokenizer: Tokenizer;
    readonly dir?: string;
    tokens?: Token[];

    constructor(content: string, model: RenderModel, tokenizer: Tokenizer, dir?: string, tokens?: Token[]) {
        this.content = content;
        this.model = model;
        this.tokenizer = tokenizer;
        this.dir = dir;
        this.tokens = tokens;
    }

    withExtras(extras: RenderModel) {
        const modelWithExtras = {
            ...this.model,
            ...extras
        };
        return new Template(this.content, modelWithExtras, this.tokenizer, this.dir, this.tokens);
    }

    compile() {
        if (!this.tokens) {
            this.tokens = this.tokenizer.tokenize(this.content);
        }
        return this.tokens;
    }

    async render(): Promise<string> {
        const tokens = this.tokens || this.compile();
        return Token.renderTokens(tokens, this);
    }

    static async fromFile(filePath: string, model: RenderModel, tokenizer: Tokenizer, cwd?: string): Promise<Template> {
        const absPath = path.isAbsolute(filePath) || typeof cwd !== 'string'
            ? filePath
            : path.join(cwd, filePath);
        const contents: string = await new Promise((resolve, reject) => {
            fs.readFile(path.resolve(absPath), 'utf8', (err, data) => err ? reject(err) : resolve(data));
        });

        return new Template(contents, model, tokenizer, path.dirname(absPath));
    }

    static async fromString(content: string, model: RenderModel, tokenizer: Tokenizer): Promise<Template> {
        return new Template(content, model, tokenizer);
    }
}