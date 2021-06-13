import { RenderModel } from '../config';
import { Template } from '../template';
import { Token } from './core/Token';
export declare class IncludeToken extends Token {
    private readonly nestedTemplate;
    constructor(contents: string, sourceTemplate?: Template);
    render(model: RenderModel): Promise<string>;
}
//# sourceMappingURL=IncludeToken.d.ts.map