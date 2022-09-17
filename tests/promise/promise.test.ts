import { promise } from '@src/index';

// @todo
describe('Basic promise use cases', () => {
    test('should return string', async () => {
        const [data] = await promise(() => 'Hello');

        expect(data).toBe('Hello');
    });

    test('should return number', async () => {
        const [data] = await promise(() => 123);

        expect(data).toBe(123);
    });

    test('should return a new array from string', async () => {
        const [dataArr] = await promise(() => '1-2-3', {
            then: res => res.split('-'),
        });

        expect(dataArr).toEqual(['1', '2', '3']);
    });

    test('should return a new object from string then', async () => {
        const [obj] = await promise(() => 'john', {
            then: res => ({ name: res }),
        });

        expect(obj).toEqual({ name: 'john' });
    });

    test('should return an Error Instance on thrown error', async () => {
        const [obj, err] = await promise(() => {
            throw new Error();
        });

        expect(obj).toBeNull();
        expect(err).toBeInstanceOf(Error);
    });

    test('should run finally function with onFinally option', async () => {
        const mockFn = jest.fn();
        const onFinallyMockFn = jest.fn();

        await promise(mockFn, {
            onFinally: onFinallyMockFn,
        });

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
