import { OutieConfig } from "./config";
import { Token } from './tokens/core/Token';
import { Template } from './template';
export declare class Tokenizer {
    readonly config: OutieConfig;
    constructor(config: OutieConfig);
    createToken(content: string, sourceTemplate?: Template): Token;
    tokenize(s: string, sourceTemplate?: Template): Token[];
}
//# sourceMappingURL=tokenizer.d.ts.map