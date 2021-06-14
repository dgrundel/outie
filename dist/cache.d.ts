export interface Cache<T> {
    has: (key: string) => boolean;
    put: (key: string, value: T) => void;
    get: (key: string) => Promise<T | undefined>;
    getOrPut: (key: string, supplier: () => Promise<T>) => Promise<T>;
}
export declare class MruCache<T> implements Cache<T> {
    private readonly maxSize;
    private readonly items;
    private readonly keys;
    constructor(maxSize?: number);
    has(key: string): boolean;
    put(key: string, value: T): void;
    get(key: string): Promise<T | undefined>;
    getOrPut(key: string, supplier: () => Promise<T>): Promise<T>;
    /**
     * Move a cache key to the end of the
     * deletion queue.
     * @param key cache key
     */
    private touchKey;
    /**
     * Remove items to make room for new ones.
     * Deletes oldest keys first.
     */
    private resize;
}
//# sourceMappingURL=cache.d.ts.map