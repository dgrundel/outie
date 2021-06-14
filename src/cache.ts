
export interface Cache<T> {
    has: (key: string) => boolean;
    put: (key: string, value: T) => void;
    get: (key: string) => Promise<T | undefined>;
    getOrPut: (key: string, supplier: () => Promise<T>) => Promise<T>;
}

export class MruCache<T> implements Cache<T> {
    private readonly maxSize: number;
    private readonly items: Record<string, T>;
    private readonly keys: Set<string>;

    constructor(maxSize: number = 150) {
        this.maxSize = maxSize;
        this.items = {};
        this.keys = new Set();
    }

    has(key: string): boolean {
        return this.keys.has(key);
    }

    put(key: string, value: T): void {
        if (this.has(key)) {
            throw new Error(`Duplicate cache key "${key}"`);
        }

        this.resize();

        this.keys.add(key);
        this.items[key] = value;
    }

    async get(key: string): Promise<T | undefined> {
        if (this.keys.has(key)) {
            this.touchKey(key);
            return this.items[key];
        }

        return undefined;
    }

    async getOrPut(key: string, supplier: () => Promise<T>): Promise<T> {
        if (this.has(key)) {
            return (await this.get(key))!;
        }

        const value: T = await supplier();
        this.put(key, value);
        return value;
    }

    /**
     * Move a cache key to the end of the
     * deletion queue.
     * @param key cache key
     */
    private touchKey(key: string): void {
        if (!this.keys.has(key)) {
            throw new Error(`Key "${key}" does not exist.`);
        }

        this.keys.delete(key);
        this.keys.add(key);
    }

    /**
     * Remove items to make room for new ones.
     * Deletes oldest keys first.
     */
    private resize(): void {
        // delete keys in order of insertion
        while (this.keys.size >= this.maxSize) {
            const iter = this.keys[Symbol.iterator]();
            const key = iter.next().value;
            
            this.keys.delete(key);
            delete this.items[key];
        }
    }
}