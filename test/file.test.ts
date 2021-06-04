import { Outie } from "../src";
import * as path from 'path';

describe('outie file handling', () => {
    it('should render a basic template from a file', async () => {
        const outie = new Outie();
        const filePath = path.resolve(__dirname, '__testData__/simple.html.outie');
        const actual = await outie.renderFile(filePath, { name: 'world' });
        
        expect(actual).toMatchSnapshot();
    });

    it('should handle relative includes', async () => {
        const outie = new Outie();
        const filePath = path.resolve(__dirname, '__testData__/include.html.outie');
        const actual = await outie.renderFile(filePath, { name: 'Kate' });
        
        expect(actual).toMatchSnapshot();
    });

    it('raw includes are unprocessed', async () => {
        const outie = new Outie();
        const filePath = path.resolve(__dirname, '__testData__/rawInclude.html.outie');
        const actual = await outie.renderFile(filePath, { name: 'Kate' });
        
        expect(actual).toMatchSnapshot();
    });
});