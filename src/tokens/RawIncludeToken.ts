import { Template } from '../template';
import { Token } from './core/Token';

export class RawIncludeToken extends Token {
    private readonly nestedTemplate: Promise<Template>;

    constructor(contents: string, sourceTemplate?: Template) {
        super(contents, sourceTemplate);

        if (sourceTemplate) {
            this.nestedTemplate = Template.fromFile(this.content, sourceTemplate.tokenizer, sourceTemplate.dir)
        } else {
            throw new Error('RawIncludeToken requires a sourceTemplate.');
        }
    }

    async render() {
        const nested = await this.nestedTemplate;
        // just return the raw file content
        return nested.content;
    }
}