import { OutieConfig, RenderModel } from "./config";
import { Tokenizer } from "./tokenizer";
import { Template } from "./template";
export declare class Outie {
    readonly config: OutieConfig;
    readonly tokenizer: Tokenizer;
    constructor(userConfig?: Partial<OutieConfig>);
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
    template(template: string, model: RenderModel): Promise<Template>;
    /**
     * Pre-compile a template from a file with a base data model.
     *
     * See `Outie#template` doc for more detail.
     *
     * @param filePath - absolute path to template file
     * @param model - a data model for rendering
     * @returns pre-compiled template
     */
    templateFromFile(filePath: string, model: RenderModel): Promise<Template>;
    /**
     * Render a template string.
     *
     * @param template - template string
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    render(template: string, model: RenderModel): Promise<string>;
    /**
     * Render the contents of a file as a template.
     *
     * @param filePath - absolute path to file
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    renderFile(filePath: string, model: RenderModel): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map