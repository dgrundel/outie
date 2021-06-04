import { getConfig } from "../src/config";
import { ModelKeyToken, Token, Tokenizer } from "../src/tokenizer";

describe('outie tokenizer', () => {
    it('should tokenize a simple token', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('Hello, {name}!');
        
        expect(tokens).toMatchSnapshot();
    });

    it('should handle a string with only a single token', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('{token}');
        
        expect(tokens).toMatchSnapshot();
    });

    it('should handle a string with tokens at start and end', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('{greeting} {name}');
        
        expect(tokens).toMatchSnapshot();
    });

    it('should handle a string with a token at start', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('{greeting} name!');
        
        expect(tokens).toMatchSnapshot();
    });

    it('should handle a string with a token at end', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('hello {token}');
        
        expect(tokens).toMatchSnapshot();
    });

    it('should correctly identify raw tokens', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('{greeting} {name} {raw someHtml}');
        
        expect(tokens).toMatchSnapshot();
    });

    it('should correctly identify include tokens', () => {
        const config = getConfig();
        const tokenizer = new Tokenizer(config);
        const tokens = tokenizer.tokenize('{greeting} {name} {include some.file.html.outie}');
        
        expect(tokens).toMatchSnapshot();
    });
});