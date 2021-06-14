import { OutieConfig, RenderModel } from "./config";
import { Tokenizer } from "./tokenizer";
import { Template } from "./template";
export { OutieConfig, defaultConfig } from './config';
export { Template } from './template';
export { Token } from './tokens/core/Token';
export { BlockStartToken } from './tokens/core/BlockStartToken';
export declare class Outie {
    readonly config: OutieConfig;
    readonly tokenizer: Tokenizer;
    constructor(userConfig?: Partial<OutieConfig>);
    /**
     * Pre-compile a template string
     *
     * @param template - a template string to compile
     * @returns pre-compiled template
     */
    template(template: string): Promise<Template>;
    /**
     * Pre-compile a template from a file
     *
     * @param filePath - absolute path to template file
     * @returns pre-compiled template
     */
    templateFromFile(filePath: string): Promise<Template>;
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