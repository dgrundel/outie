import { Outie } from "../src";

describe('outie', () => {
    it('should render a basic template', () => {
        const outie = new Outie();
        const actual = outie.render('Hello, {name}!', { name: 'world' });
        const expected = 'Hello, world!';
        expect(actual).toStrictEqual(expected);
    });

    it('should suport custom start and end sequences', () => {
        const outie = new Outie({
            tokenStart: '<%',
            tokenEnd: '%>',
        });
        const actual = outie.render('Hello, <%name%>!', { name: 'world' });
        const expected = 'Hello, world!';
        expect(actual).toStrictEqual(expected);
    });

    it('should suport custom raw identifier sequences', () => {
        const outie = new Outie({
            tokenStart: '<%',
            tokenEnd: '%>',
            rawTokenIdentifier: 'raw'
        });
        const actual = outie.render('Hello, <%rawname%>!', { name: '<b>world</b>' });
        const expected = 'Hello, <b>world</b>!';
        expect(actual).toStrictEqual(expected);
    });

    it('should prevent xss', () => {
        const outie = new Outie();
        const actual = outie.render('Hello, {name}!', { name: '<script>alert("xss!");</script>' });
        const expected = 'Hello, &lt;script&gt;alert(&#x22;xss!&#x22;);&lt;/script&gt;!';
        expect(actual).toStrictEqual(expected);
    });

    it('should render raw when asked', () => {
        const outie = new Outie();
        const actual = outie.render('Hello, {~name}!', { name: '<strong>world</strong>' });
        const expected = 'Hello, <strong>world</strong>!';
        expect(actual).toStrictEqual(expected);
    });
});