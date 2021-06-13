import { Template } from '../template';
import { BlockStartToken } from './core/BlockStartToken';
export declare class ForToken extends BlockStartToken {
    readonly valueVarName: string;
    readonly keyVarName?: string;
    readonly itemsKey: string;
    constructor(content: string);
    render(template: Template): Promise<string>;
    static parseTokenContent(content: string): {
        valueVarName: string;
        keyVarName: string | undefined;
        itemsKey: string;
    };
}
//# sourceMappingURL=ForToken.d.ts.map