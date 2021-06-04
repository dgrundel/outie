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

const startsWithIdentifier = (content: string, identifier: string) => {
    const trimmed = content.trim();
    const hasIdentifier = trimmed.substring(0, identifier.length) === identifier;
    const value = trimmed.substring(identifier.length).trim();

    return {
        hasIdentifier,
        value,
    };
};

export class Tokenizer {
    readonly config: OutieConfig;

    constructor(config: OutieConfig) {
        this.config = config;
    }

    createToken (content: string): Token {
        const rawIdent = startsWithIdentifier(content, this.config.rawTokenIdentifier);
        if (rawIdent.hasIdentifier) {
            return new RawModelKeyToken(rawIdent.value);
        }
        const includeIdent = startsWithIdentifier(content, this.config.includeTokenIdentifier);
        if (includeIdent.hasIdentifier) {
            return new IncludeToken(includeIdent.value);
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