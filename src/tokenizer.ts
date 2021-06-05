import { OutieConfig, RenderModel } from "./config";
import { encodeHtml } from "./encoder";
import { Template } from "./template";

export abstract class Token {
    readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    abstract render(template: Template, tokenizer: Tokenizer): Promise<string>;

    static getValue(key: string, data: Record<string, any>): any {
        const keyParts = key.trim().split('.');
        return keyParts.reduce((obj: Record<string, any>, prop: string, i: number) => {
            if (typeof obj === 'undefined') {
                throw new Error(`Could not get property "${prop}" of undefined at "${keyParts.slice(0, i).join('.')}".`);
            }
            return obj[prop];
        }, data);
    }

    static getString(key: string, data: Record<string, any>): string {
        const value = Token.getValue(key, data);
        
        return typeof value !== 'undefined' ? value.toString() : '';
    }
}

export class RawToken extends Token {
    async render() {
        return this.content;
    }
}

export class ModelKeyToken extends Token {
    async render(template: Template) {
        const value = Token.getString(this.content, template.model);
        return value ? encodeHtml(value) : '';
    }
}

export class RawModelKeyToken extends ModelKeyToken {
    async render(template: Template) {
        return Token.getString(this.content, template.model);
    }
}

export class IncludeToken extends Token {
    async render(template: Template, tokenizer: Tokenizer) {
        const nested = await Template.fromFile(this.content, template.model, template.dir);
        return tokenizer.renderTemplate(nested);
    }
}

export class RawIncludeToken extends Token {
    async render(template: Template) {
        const nested = await Template.fromFile(this.content, template.model, template.dir);
        // just return the raw file content
        return nested.content;
    }
}

export abstract class OpenCloseToken extends Token {
    readonly children: Token[] = [];
    closed: boolean = false;
}

export class IfToken extends OpenCloseToken {
    async render(template: Template, tokenizer: Tokenizer): Promise<string> {
        const condition = Token.getValue(this.content, template.model);
        return condition ? tokenizer.renderTokens(this.children, template) : '';
    }
}

export class UnlessToken extends OpenCloseToken {
    async render(template: Template, tokenizer: Tokenizer): Promise<string> {
        const condition = Token.getValue(this.content, template.model);
        return !condition ? tokenizer.renderTokens(this.children, template) : '';
    }
}

export class ForToken extends OpenCloseToken {
    async render(template: Template, tokenizer: Tokenizer): Promise<string> {
        
        // first, parse token content
        const trimmed = this.content.trim();
        const matches = trimmed.match(/(\w+)(?:\:(\w+))?(?:\s+in\s+)(\S+)/) || [];
        const valueVarName = matches[2] ? matches[2] : matches[1];
        const keyVarName = matches[2] ? matches[1] : undefined;
        const itemsKey = matches[3];

        if (!(valueVarName && itemsKey)) {
            throw new Error(`Unrecognized string "${trimmed}" in ${this.constructor.name}. Expected format: "key:value in items" or "value in items"`);
        }

        // find the collection through which we'll iterate
        const collection = Token.getValue(itemsKey, template.model);
        if (typeof collection !== 'object') {
            return '';
        }

        // render each item
        const promises = Object.keys(collection).map(k => {
            const extras = {
                [valueVarName]: collection[k]
            };
            if (keyVarName) {
                extras[keyVarName] = k;
            }
            return tokenizer.renderTokens(this.children, template.with(extras));
        });

        // wait for the items to render and join them
        return (await Promise.all(promises)).join('');
    }
}

const identInfo = (s: string, identifier: string) => {
    const value = s.trim();
    const present = value.startsWith(identifier);
    const trimmed = present
        ? value.substring(identifier.length).trim()
        : value;
    return { present, trimmed };
};

export class Tokenizer {
    readonly config: OutieConfig;

    constructor(config: OutieConfig) {
        this.config = config;
    }

    createToken (content: string): Token {
        const config = this.config;
        // this lops off the opening "/" sequence if present
        const { present: isClosingToken, trimmed } = identInfo(content, config.closeTokenIdentifier);

        // map of all identifiers with their corresponding token types
        const identTypeMap = {
            [config.rawTokenIdentifier]: RawModelKeyToken,
            [config.rawIncludeTokenIdentifier]: RawIncludeToken,
            [config.includeTokenIdentifier]: IncludeToken,
            [config.ifTokenIdentifier]: IfToken,
            [config.unlessTokenIdentifier]: UnlessToken,
            [config.forTokenIdentifier]: ForToken,
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
            const { present, trimmed: tokenContents } = identInfo(trimmed, identifier);
            
            if (present) {
                const TokenType = identTypeMap[identifier];
                const token = new TokenType(tokenContents);
                if (token instanceof OpenCloseToken) {
                    token.closed = isClosingToken;
                }

                return token;
            }
        }

        return new ModelKeyToken(content);
    };

    tokenize (s: string): Token[] {
        const tokens: Token[] = [];
        const stack: OpenCloseToken[] = [];
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
            
            const target = stack.length ? stack[stack.length - 1].children : tokens;

            if (i < start) {
                target.push(new RawToken(s.substring(i, start)));
            }
            
            const token = this.createToken(
                s.substring(start + this.config.tokenStart.length, end)
            );

            if (token instanceof OpenCloseToken) {
                if (token.closed) {
                    if (stack.length === 0) {
                        throw new Error(`Found closing ${token.constructor.name} without opening.`);
                    }
                    const openingToken = stack[stack.length - 1];
                    if (openingToken.constructor !== token.constructor) {
                        throw new Error(`Found ${token.constructor.name} but ${openingToken.constructor.name} is still open.`);
                    }

                    stack.pop();
                } else {
                    // opening token
                    target.push(token);
                    stack.push(token);
                }
            } else {
                target.push(token);
            }
            
            // tokens.push(token);
    
            i = end + this.config.tokenEnd.length;
        }

        if (stack.length > 0) {
            throw new Error(`Unclosed items in template: ${stack.map(t => t.constructor.name).join(', ')}`);
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