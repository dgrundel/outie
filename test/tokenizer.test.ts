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
        const tokens = tokenizer.tokenize('{greeting} {name} {~someHtml}');
        
        expect(tokens).toMatchSnapshot();
    });
});

describe('token render', () => {
    it('should html encode on render', () => {
        const t = new ModelKeyToken('value');
        const actual = t.render({ value: 'Hello, <script>alert("xss");</script> world!'});

        expect(actual).toMatchSnapshot();
    });
});