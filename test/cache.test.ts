import { MruCache } from '../src/cache';

describe('cache', () => {
    it('should limit its size', async () => {
        const cache = new MruCache<string>(3);
        
        cache.put('a', 'A');
        cache.put('b', 'B');
        cache.put('c', 'C');
        cache.put('d', 'D');

        expect(await cache.get('a')).toBe(undefined); // least recently touched key evicted
        expect(await cache.get('b')).toBe('B');
        expect(await cache.get('c')).toBe('C');
        expect(await cache.get('d')).toBe('D');
    });

    it('should evict the least recently used key', async () => {
        const cache = new MruCache<string>(3);
        
        cache.put('a', 'A');
        cache.put('b', 'B');
        cache.put('c', 'C');
        
        // getting 'a' bumps the key to the top of the usage list
        await cache.get('a');

        cache.put('d', 'D');
        expect(await cache.get('a')).toBe('A');
        expect(await cache.get('b')).toBe(undefined); // least recently touched key evicted
        expect(await cache.get('c')).toBe('C');
        expect(await cache.get('d')).toBe('D');
    });

    it('getOrPut calls supplier when needed', async () => {
        const cache = new MruCache<string>(3);
        cache.put('a', 'A');
        
        // should not call supplier 
        const aSupplier = jest.fn(() => Promise.resolve('A2'));
        expect(await cache.getOrPut('a', aSupplier)).toBe('A');
        expect(await cache.getOrPut('a', aSupplier)).toBe('A');
        expect(aSupplier).toHaveBeenCalledTimes(0);


        // should call supplier
        const bSupplier = jest.fn(() => Promise.resolve('B'));
        expect(await cache.getOrPut('b', bSupplier)).toBe('B');
        expect(await cache.getOrPut('b', bSupplier)).toBe('B');
        expect(bSupplier).toHaveBeenCalledTimes(1);
        
        // values should be stored in cache
        expect(await cache.get('a')).toBe('A');
        expect(await cache.get('b')).toBe('B');
    });
});