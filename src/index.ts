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

    async render (template: string, model: RenderModel): Promise<string> {
        const t = await Template.fromString(template, model);
        return this.tokenizer.renderTemplate(t);
    }

    async renderFile (filePath: string, model: RenderModel): Promise<string> {
        const t = await Template.fromFile(filePath, model);
        return this.tokenizer.renderTemplate(t);
    }
}