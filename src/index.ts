import { getConfig, OutieConfig, RenderModel } from "./config";
import { Tokenizer } from "./tokenizer";
import { Template } from "./template";

export { OutieConfig, defaultConfig } from './config';
export { Template } from './template';
export { Token } from './tokens/core/Token';
export { BlockStartToken } from './tokens/core/BlockStartToken';

export class Outie {
    readonly config: OutieConfig;
    readonly tokenizer: Tokenizer;

    constructor(userConfig?: Partial<OutieConfig>) {
        const config = getConfig(userConfig);
        
        this.config = config;
        this.tokenizer = new Tokenizer(config);
    }

    /**
     * Pre-compile a template string
     * 
     * @param template - a template string to compile
     * @returns pre-compiled template
     */
    async template (template: string): Promise<Template> {
        const t = await Template.fromString(template, this.tokenizer);
        t.compile();
        return t;
    }

    /**
     * Pre-compile a template from a file
     * 
     * @param filePath - absolute path to template file
     * @returns pre-compiled template
     */
    async templateFromFile (filePath: string): Promise<Template> {
        const t = await Template.fromFile(filePath, this.tokenizer);
        t.compile();
        return t;
    }

    /**
     * Render a template string.
     * 
     * @param template - template string
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    async render (template: string, model: RenderModel): Promise<string> {
        const t = await Template.fromString(template, this.tokenizer);
        return t.render(model);
    }

    /**
     * Render the contents of a file as a template.
     * 
     * @param filePath - absolute path to file
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    async renderFile (filePath: string, model: RenderModel): Promise<string> {
        const t = await Template.fromFile(filePath, this.tokenizer);
        return t.render(model);
    }
}