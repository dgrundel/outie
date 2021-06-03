import { getConfig, OutieConfig } from "./config";
import { Token, Tokenizer } from "./tokenizer";

export class Outie {
    readonly config: OutieConfig;
    readonly tokenizer: Tokenizer;

    constructor(userConfig?: Partial<OutieConfig>) {
        const config = getConfig(userConfig);
        
        this.config = config;
        this.tokenizer = new Tokenizer(config);
    }

    render (template: string, model: Record<string, any>) {
        const tokens = this.tokenizer.tokenize(template);

        return tokens.map(t => t.render(model)).join('');
    }
}