import { Template } from '../template';
import { BlockStartToken } from './core/BlockStartToken';
import { Token } from './core/Token';

export class ForToken extends BlockStartToken {
    readonly valueVarName: string;
    readonly keyVarName?: string;
    readonly itemsKey: string;

    constructor(content: string) {
        super(content);

        const { valueVarName, keyVarName, itemsKey, } = ForToken.parseTokenContent(content);
        this.valueVarName = valueVarName;
        this.keyVarName = keyVarName;
        this.itemsKey = itemsKey;
    }

    async render(template: Template): Promise<string> {
        // find the collection through which we'll iterate
        const collection = Token.getValue(this.itemsKey, template.model);
        if (typeof collection !== 'object') {
            return '';
        }

        // render each item
        const promises = Object.keys(collection).map(k => {
            const extras = {
                [this.valueVarName]: collection[k]
            };
            if (this.keyVarName) {
                extras[this.keyVarName] = k;
            }
            return Token.renderTokens(this.children, template.withExtras(extras));
        });

        // wait for the items to render and join them
        return (await Promise.all(promises)).join('');
    }

    static parseTokenContent(content: string) {
        const trimmed = content.trim();
        const matches = trimmed.match(/(\w+)(?:\:(\w+))?(?:\s+in\s+)(\S+)/) || [];
        const valueVarName = matches[2] ? matches[2] : matches[1];
        const keyVarName = matches[2] ? matches[1] : undefined;
        const itemsKey = matches[3];

        if (!(valueVarName && itemsKey)) {
            throw new Error(`Unrecognized string "${trimmed}" in ${this.constructor.name}.`
                + '\nExpected format: "key:value in items" or "value in items"');
        }

        return { valueVarName, keyVarName, itemsKey, };
    }
}