import { OutieConfig } from "./config";
import { Token } from './tokens/core/Token';
export declare class Tokenizer {
    readonly config: OutieConfig;
    constructor(config: OutieConfig);
    createToken(content: string): Token;
    tokenize(s: string): Token[];
}
//# sourceMappingURL=tokenizer.d.ts.map