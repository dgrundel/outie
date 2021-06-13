import { getConfig, OutieConfig, RenderModel } from "./config";
import { Tokenizer } from "./tokenizer";
import { Template } from "./template";

export class Outie {
    readonly config: OutieConfig;
    readonly tokenizer: Tokenizer;

    constructor(userConfig?: Partial<OutieConfig>) {
        const config = getConfig(userConfig);
        
        this.config = config;
        this.tokenizer = new Tokenizer(config);
    }

    /**
     * Pre-compile a template string with a base data model.
     * 
     * If you don't want to supply data immediately, you can pass
     * an empty map (`{}`) and provide data later using `withExtras`:
     * 
     * ```
     * const t = await outie.template('Hello, {name}', {});
     * const j = t.withExtras({ name: 'Jay' });
     * const str = await j.render(); // Hello, Jay
     * ```
     * 
     * @param template - a template string to compile
     * @param model - a data model to use for rendering
     * @returns pre-compiled template
     */
    async template (template: string, model: RenderModel): Promise<Template> {
        const t = await Template.fromString(template, model, this.tokenizer);
        t.compile();
        return t;
    }

    /**
     * Pre-compile a template from a file with a base data model.
     * 
     * See `Outie#template` doc for more detail.
     * 
     * @param filePath - absolute path to template file
     * @param model - a data model for rendering
     * @returns pre-compiled template
     */
    async templateFromFile (filePath: string, model: RenderModel): Promise<Template> {
        const t = await Template.fromFile(filePath, model, this.tokenizer);
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
        const t = await Template.fromString(template, model, this.tokenizer);
        return this.tokenizer.renderTemplate(t);
    }

    /**
     * Render the contents of a file as a template.
     * 
     * @param filePath - absolute path to file
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    async renderFile (filePath: string, model: RenderModel): Promise<string> {
        const t = await Template.fromFile(filePath, model, this.tokenizer);
        return this.tokenizer.renderTemplate(t);
    }
}