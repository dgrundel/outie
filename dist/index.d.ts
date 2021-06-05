import { OutieConfig, RenderModel } from "./config";
import { Tokenizer } from "./tokenizer";
export declare class Outie {
    readonly config: OutieConfig;
    readonly tokenizer: Tokenizer;
    constructor(userConfig?: Partial<OutieConfig>);
    render(template: string, model: RenderModel): Promise<string>;
    renderFile(filePath: string, model: RenderModel): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map