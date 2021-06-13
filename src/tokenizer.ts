import { OutieConfig } from "./config";
import { BlockEndToken } from './tokens/core/BlockEndToken';
import { BlockStartToken } from './tokens/core/BlockStartToken';
import { ModelKeyToken } from './tokens/ModelKeyToken';
import { RawToken } from './tokens/RawToken';
import { Token, TokenConstructor } from './tokens/core/Token';
import { RootToken } from './tokens/RootToken';

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

        // sort identifiers by length, longest first
        // this avoids cases where we might interpret "includeRaw" as "include"
        // because it starts with the same string ('include')
        const orderedIdentifiers = Object.keys(config.tokens).sort((a, b) => {
            if (a.length === b.length) {
                return 0;
            }
            return a.length > b.length ? -1 : 1;
        });

        // test for each identifier
        for (let i = 0; i < orderedIdentifiers.length; i++) {
            const identifier = orderedIdentifiers[i];
            const { present: isMatchingType, trimmed: tokenContents } = identInfo(trimmed, identifier);
            
            if (isMatchingType) {
                const TokenType: TokenConstructor = config.tokens[identifier];
                return isClosingToken
                    ? new BlockEndToken(TokenType)
                    : new TokenType(tokenContents);
            }
        }

        return new ModelKeyToken(content);
    };

    tokenize (s: string): Token[] {
        const root = new RootToken();
        const stack: BlockStartToken[] = [];
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
            
            const parent: BlockStartToken = stack.length ? stack[stack.length - 1] : root;

            if (i < start) {
                parent.append(new RawToken(s.substring(i, start)));
            }
            
            const token = this.createToken(
                s.substring(start + this.config.tokenStart.length, end)
            );

            if (token instanceof BlockEndToken) {
                if (stack.length === 0) {
                    throw new Error(`Found closing ${token.type.name} without opening.`);
                }
                const openingToken = stack[stack.length - 1];
                if (openingToken.constructor !== token.type) {
                    throw new Error(`Found ${token.type.name} but ${openingToken.constructor.name} is still open.`);
                }

                stack.pop();

            } else if (token instanceof BlockStartToken) {
                parent.append(token);
                stack.push(token);

            } else {
                parent.append(token);
            }
    
            i = end + this.config.tokenEnd.length;
        }

        if (stack.length > 0) {
            throw new Error(`Unclosed items in template: ${stack.map(t => t.constructor.name).join(', ')}`);
        }

        if (i < s.length) {
            root.append(new RawToken(s.substring(i)));
        }
    
        return [root];
    }
}