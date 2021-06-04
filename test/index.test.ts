import { Outie } from "../src";

describe('outie', () => {
    it('should render a basic template', async () => {
        const outie = new Outie();
        const actual = await outie.render('Hello, {name}!', { name: 'world' });
        const expected = 'Hello, world!';
        expect(actual).toStrictEqual(expected);
    });

    it('should suport custom start and end sequences', async () => {
        const outie = new Outie({
            tokenStart: '<%',
            tokenEnd: '%>',
        });
        const actual = await outie.render('Hello, <%name%>!', { name: 'world' });
        const expected = 'Hello, world!';
        expect(actual).toStrictEqual(expected);
    });

    it('should suport custom raw identifier sequences', async () => {
        const outie = new Outie({
            tokenStart: '<%',
            tokenEnd: '%>',
            rawTokenIdentifier: '~'
        });
        const actual = await outie.render('Hello, <%~name%>!', { name: '<b>world</b>' });
        const expected = 'Hello, <b>world</b>!';
        expect(actual).toStrictEqual(expected);
    });

    it('should prevent xss', async () => {
        const outie = new Outie();
        const actual = await outie.render('Hello, {name}!', { name: '<script>alert("xss!");</script>' });
        const expected = 'Hello, &lt;script&gt;alert(&#x22;xss!&#x22;);&lt;/script&gt;!';
        expect(actual).toStrictEqual(expected);
    });

    it('should render raw when asked', async () => {
        const outie = new Outie();
        const actual = await outie.render('Hello, {raw name}!', { name: '<strong>world</strong>' });
        const expected = 'Hello, <strong>world</strong>!';
        expect(actual).toStrictEqual(expected);
    });

    it('should allow object property access', async () => {
        const outie = new Outie();
        const actual = await outie.render(
            'Hello, {user.name}!', 
            { 
                user: {
                    name: 'world'
                }
            }
        );
        const expected = 'Hello, world!';
        expect(actual).toStrictEqual(expected);
    });
});