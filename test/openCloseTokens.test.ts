import { Outie } from "../src";

describe('open-close', () => {
    
    describe('open-close token parsing', () => {
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

    describe('if', () => {
        it('should handle a simple case', async () => {
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
    
        it('should coerce other types', async () => {
            const outie = new Outie();
            const actual = await outie.render(`{if prevVisits}You've been here {prevVisits} times!{/if}`, { 
                prevVisits: 13,
            });
            expect(actual).toMatchSnapshot();
        });
    
        it('should support nested props', async () => {
            const outie = new Outie();
            const actual = await outie.render(`{if user.prevVisits}You've been here {user.prevVisits} times!{/if}`, { 
                user: {
                    name: 'Lisa',
                    prevVisits: 13,
                }
            });
            expect(actual).toMatchSnapshot();
        });
    });

    describe('unless', () => {
        it('should handle a simple unless', async () => {
            const outie = new Outie();
            const actual = await outie.render(`{unless prevVisits}You must be new here.{/unless}`, {});
            expect(actual).toMatchSnapshot();
        });

        it('should coerce other types', async () => {
            const outie = new Outie();
            const actual = await outie.render(`{unless prevVisits}You're new here!{/unless}`, { 
                prevVisits: 0,
            });
            expect(actual).toMatchSnapshot();
        });
    
        it('should support nested props', async () => {
            const outie = new Outie();
            const actual = await outie.render(`{unless user.prevVisits}You're new here!{/unless}`, { 
                user: {
                    name: 'Lisa',
                    prevVisits: 0,
                }
            });
            expect(actual).toMatchSnapshot();
        });
    });

    describe('for', () => {
        it('should support use of value only', async () => {
            const outie = new Outie();
            const actual = await outie.render(`
                {for color in colors}
                    {color} is my favorite color. No, wait.
                {/for}
            `, {
                colors: ['red', 'green', 'blue']
            });
            expect(actual).toMatchSnapshot();
        });
    
        it('should support use of key:value syntax', async () => {
            const outie = new Outie();
            const actual = await outie.render(`
                {for state:city in capitals}
                    The capital of {state} is {city}.
                {/for}
            `, {
                capitals: {
                    'Florida': 'Tallahassee',
                    'Washington': 'Olympia',
                }
            });
            expect(actual).toMatchSnapshot();
        });

        it('should support nested props', async () => {
            const outie = new Outie();
            const actual = await outie.render(`
                {for animal in farm.animals}
                    The {animal.name} goes "{animal.sound}".
                {/for}
            `, {
                farm: {
                    animals: [
                        { name: 'cow', sound: 'moo'},
                        { name: 'chicken', sound: 'BOCK'},
                        { name: 'horse', sound: 'neigh'},
                    ]
                }
            });
            expect(actual).toMatchSnapshot();
        });

        it('should do nothing for non-objects', async () => {
            const outie = new Outie();
            const actual = await outie.render(`
                {for item in items}
                    This won't work.
                {/for}
            `, { 
                items: 'hello' 
            });
            expect(actual).toMatchSnapshot();
        });
    });

    
});