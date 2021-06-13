import { RenderModel } from '../config';
import { Template } from '../template';
import { Token } from './core/Token';

export class IncludeToken extends Token {
    private readonly nestedTemplate: Promise<Template>;

    constructor(contents: string, sourceTemplate?: Template) {
        super(contents, sourceTemplate);

        if (sourceTemplate) {
            this.nestedTemplate = Template.fromFile(this.content, sourceTemplate.tokenizer, sourceTemplate.dir)
        } else {
            throw new Error('IncludeToken requires a sourceTemplate.');
        }
    }

    async render(model: RenderModel) {
        const nested = await this.nestedTemplate;
        return nested.render(model);
    }
}