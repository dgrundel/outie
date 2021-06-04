import * as fs from 'fs';
import * as path from 'path';
import { RenderModel } from './config';

export class Template {
    readonly content: string;
    readonly model: RenderModel;
    readonly dir?: string;

    constructor(content: string, model: RenderModel, dir?: string) {
        this.content = content;
        this.model = model;
        this.dir = dir;
    }

    with(extras: RenderModel) {
        const modelWithExtras = {
            ...this.model,
            ...extras
        };
        return new Template(this.content, modelWithExtras, this.dir);
    }

    static async fromFile(filePath: string, model: RenderModel, cwd?: string): Promise<Template> {
        const absPath = path.isAbsolute(filePath) || typeof cwd !== 'string'
            ? filePath
            : path.join(cwd, filePath);
        const contents: string = await new Promise((resolve, reject) => {
            fs.readFile(path.resolve(absPath), 'utf8', (err, data) => err ? reject(err) : resolve(data));
        });

        return new Template(contents, model, path.dirname(absPath));
    }

    static async fromString(content: string, model: RenderModel): Promise<Template> {
        return new Template(content, model);
    }
}