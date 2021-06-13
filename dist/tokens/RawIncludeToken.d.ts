import { Template } from '../template';
import { Token } from './core/Token';
export declare class RawIncludeToken extends Token {
    private readonly nestedTemplate;
    constructor(contents: string, sourceTemplate?: Template);
    render(): Promise<string>;
}
//# sourceMappingURL=RawIncludeToken.d.ts.map