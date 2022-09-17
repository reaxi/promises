import { runThen } from './pipe';
import { PromiseOptionsGen, PromiseReturn } from './types';

async function promise<R extends unknown, T extends unknown>(
    asyncFn: () => R,
    options: PromiseOptionsGen<R, T> = {}
): Promise<PromiseReturn<R, T>> {
    const { onError, then, skip, onFinally } = options;
    try {
        if (skip) return [null, new Error('skip')] as [null, Error];
        const init = await execGenerator(asyncFn, then);

        let result = await init.next();

        if (then) result = await init.next();

        return [result.value, null];
    } catch (error) {
        if (onError) onError(error as Error);
        return [null, error] as [null, Error];
    } finally {
        if (onFinally) onFinally();
    }
}

async function* execGenerator<R, T>(
    asyncFn: () => R,
    then?: (arg: Awaited<R>) => T
): AsyncGenerator<R | T> {
    try {
        const val = await asyncFn();
        yield val;

        if (then && !Array.isArray(then)) yield await then?.(val);

        if (then && Array.isArray(then)) yield await runThen(then, val);
    } catch (error) {
        yield Promise.reject(error);
    }
}

export { promise };
export type { PromiseOptionsGen };
