import { OutieConfig } from "./config";
import { Template } from "./template";
import { Token } from './tokens/Token';
export declare class Tokenizer {
    readonly config: OutieConfig;
    constructor(config: OutieConfig);
    createToken(content: string): Token;
    tokenize(s: string): Token[];
    renderTemplate(template: Template): Promise<string>;
}
//# sourceMappingURL=tokenizer.d.ts.map