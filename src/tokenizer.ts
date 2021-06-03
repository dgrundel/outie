import { OutieConfig } from "./config";
import { encodeHtml } from "./encoder";

export abstract class Token {
    readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    abstract render(model: Record<string, any>): string;
}

export class RawToken extends Token {
    render() {
        return this.content;
    }
}

export class ModelKeyToken extends Token {
    getValue(model: Record<string, any>): string | undefined {
        const key = this.content.trim();
        if (model.hasOwnProperty(key) && typeof model[key] !== undefined) {
            return model[key].toString ? model[key].toString() : model[key];
        }
        return undefined;
    }

    render(model: Record<string, any>) {
        const value = this.getValue(model);
        return value ? encodeHtml(value) : '';
    }
}

export class RawModelKeyToken extends ModelKeyToken {
    render(model: Record<string, any>) {
        return this.getValue(model) || '';
    }
}

export class Tokenizer {
    readonly config: OutieConfig;

    constructor(config: OutieConfig) {
        this.config = config;
    }

    createToken (content: string): Token {
        const trimmed = content.trim();
        const isRaw = trimmed.substring(0, this.config.rawTokenIdentifier.length) === this.config.rawTokenIdentifier;
        if (isRaw) {
            return new RawModelKeyToken(
                trimmed.substring(this.config.rawTokenIdentifier.length)
            );
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
}