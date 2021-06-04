import { Outie } from "../src";

describe('outie open-close', () => {
    it('should handle an if', async () => {
        const outie = new Outie();
        const actual = await outie.render(`
Hello, {name}!
{if hereBefore}I've seen you here before!{/if}
{if notHereBefore}You're new around here!{/if}
        `, { 
            name: 'Dave',
            hereBefore: true,
            notHereBefore: false 
        });
        expect(actual).toMatchSnapshot();
    });

    it('should handle an if w/ type coercion', async () => {
        const outie = new Outie();
        const actual = await outie.render(`{if prevVisits}You've been here {prevVisits} times!{/if}`, { 
            prevVisits: 13,
        });
        expect(actual).toMatchSnapshot();
    });

    it('should handle an unless', async () => {
        const outie = new Outie();
        const actual = await outie.render(`{unless prevVisits}You must be new here.{/unless}`, {});
        expect(actual).toMatchSnapshot();
    });

    it('should throw on missing opening tag', async () => {
        await expect(async () => {
            const outie = new Outie();
            return outie.render(`You must be new here.{/unless}`, {});
        }).rejects.toMatchObject(new Error('Found closing UnlessToken without opening.'));
    });

    it('should throw on missing closing tag', async () => {
        await expect(async () => {
            const outie = new Outie();
            return outie.render(`{if foo}You must be new here.`, {});
        }).rejects.toMatchObject(new Error('Unclosed items in template: IfToken'));
    });

    it('should throw on tag mismatch', async () => {
        await expect(async () => {
            const outie = new Outie();
            return outie.render(`{if foo}You must be new here.{/unless}`, {});
        }).rejects.toMatchObject(new Error('Found UnlessToken but IfToken is still open.'));
    });
});