import { RenderModel } from './config';
export declare class Template {
    readonly content: string;
    readonly model: RenderModel;
    readonly dir?: string;
    constructor(content: string, model: RenderModel, dir?: string);
    with(extras: RenderModel): Template;
    static fromFile(filePath: string, model: RenderModel, cwd?: string): Promise<Template>;
    static fromString(content: string, model: RenderModel): Promise<Template>;
}
//# sourceMappingURL=template.d.ts.map