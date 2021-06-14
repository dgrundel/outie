import * as fs from 'fs';
import * as path from 'path';
import { RenderModel } from './config';
import { Tokenizer } from './tokenizer';
import { Token } from './tokens/core/Token';

const getFileContents = async (absPath: string): Promise<string> => new Promise((resolve, reject) => {
    fs.readFile(absPath, 'utf8', (err, data) => err ? reject(err) : resolve(data));
});

export class Template {
    readonly content: string;
    readonly tokenizer: Tokenizer;
    readonly dir?: string;
    tokens?: Token[];

    constructor(content: string, tokenizer: Tokenizer, dir?: string, tokens?: Token[]) {
        this.content = content;
        this.tokenizer = tokenizer;
        this.dir = dir;
        this.tokens = tokens;
    }

    compile(): Token[] {
        if (!this.tokens) {
            this.tokens = this.tokenizer.tokenize(this.content, this);
        }
        return this.tokens;
    }

    async render(model: RenderModel): Promise<string> {
        return Token.renderTokens(this.compile(), model);
    }

    static async fromFile(filePath: string, tokenizer: Tokenizer, cwd?: string): Promise<Template> {
        const absPath = path.resolve(
            path.isAbsolute(filePath) || typeof cwd !== 'string'
                ? filePath
                : path.join(cwd, filePath)
        );

        const fileCache = tokenizer.config.fileCache;

        const template = fileCache.getOrPut(absPath, async () => {
            const contents: string = await getFileContents(absPath);
            return new Template(contents, tokenizer, path.dirname(absPath));
        });

        return template;
    }

    static async fromString(content: string, tokenizer: Tokenizer, cwd?: string): Promise<Template> {
        return new Template(content, tokenizer, cwd);
    }
}