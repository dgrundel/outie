import { OutieConfig, RenderModel } from "./config";
import { encodeHtml } from "./encoder";
import { Template } from "./template";

export abstract class Token {
    readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    abstract render(template: Template, tokenizer: Tokenizer): Promise<string>;
}

export class RawToken extends Token {
    async render() {
        return this.content;
    }
}

export class ModelKeyToken extends Token {
    getValue(model: RenderModel): string | undefined {
        const key = this.content.trim();
        if (model.hasOwnProperty(key) && typeof model[key] !== undefined) {
            return model[key].toString ? model[key].toString() : model[key];
        }
        return undefined;
    }

    async render(template: Template) {
        const value = this.getValue(template.model);
        return value ? encodeHtml(value) : '';
    }
}

export class RawModelKeyToken extends ModelKeyToken {
    async render(template: Template) {
        return this.getValue(template.model) || '';
    }
}

export class IncludeToken extends Token {
    async render(template: Template, tokenizer: Tokenizer) {
        const nested = await Template.fromFile(this.content, template.model, template.dir);
        return tokenizer.renderTemplate(nested);
    }
}

export class RawIncludeToken extends Token {
    async render(template: Template, tokenizer: Tokenizer) {
        const nested = await Template.fromFile(this.content, template.model, template.dir);
        // just return the raw file content
        return nested.content;
    }
}

export class Tokenizer {
    readonly config: OutieConfig;

    constructor(config: OutieConfig) {
        this.config = config;
    }

    createToken (content: string): Token {
        const config = this.config;
        const trimmed = content.trim();

        // map of all identifiers with their corresponding token types
        const identTypeMap = {
            [config.rawTokenIdentifier]: RawModelKeyToken,
            [config.rawIncludeTokenIdentifier]: RawIncludeToken,
            [config.includeTokenIdentifier]: IncludeToken,
        };

        // sort identifiers by length, longest first
        // this avoids cases where we might interpret "includeRaw" as "include"
        // because it starts with the same string ('include')
        const orderedIdentifiers = Object.keys(identTypeMap).sort((a, b) => {
            if (a.length === b.length) {
                return 0;
            }
            return a.length > b.length ? -1 : 1;
        });

        // test for each identifier
        for (let i = 0; i < orderedIdentifiers.length; i++) {
            const identifier = orderedIdentifiers[i];
            const hasIdentifier = trimmed.substring(0, identifier.length) === identifier;
            
            if (hasIdentifier) {
                const TokenType = identTypeMap[identifier];
                const tokenContents = trimmed.substring(identifier.length).trim();
                return new TokenType(tokenContents);
            }
        }

        return new ModelKeyToken(content);
    };

    tokenize (s: string): Token[] {
        const tokens: Token[] = [];
        let i = 0;
    
        while (i < s.length) {
            const start = s.indexOf(this.config.tokenStart, i);
            if (start === -1) {
                break;
            }
            const end = s.indexOf(this.config.tokenEnd, start + this.config.tokenStart.length);
            if (end === -1) {
                break;
            }
    
            if (i < start) {
                tokens.push(new RawToken(s.substring(i, start)));
            }
            
            const token = this.createToken(
                s.substring(start + this.config.tokenStart.length, end)
            );
            tokens.push(token);
    
            i = end + this.config.tokenEnd.length;
        }

        if (i < s.length) {
            tokens.push(new RawToken(s.substring(i)));
        }
    
        return tokens;
    }

    async renderTokens (tokens: Token[], template: Template): Promise<string> {
        const rendered = await Promise.all(tokens.map(t => t.render(template, this)));
        return rendered.join('');
    }

    async renderTemplate(template: Template) {
        const tokens = this.tokenize(template.content);
        return this.renderTokens(tokens, template);
    }
}