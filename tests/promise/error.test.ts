import { promise } from '@src/index';

describe('Error handling', () => {
    test('should handle Error', async () => {
        const msg = 'invalid data';

        const [data, err] = await promise(() => {
            throw new Error(msg);
        });

        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe(msg);
        expect(data).toBeNull();
    });

    test('should runs onError on errors and never run then() method', async () => {
        const onError = jest.fn();
        const then = jest.fn();

        await promise(
            () => {
                throw new Error();
            },
            {
                then,
                onError,
            }
        );

        expect(onError).toBeCalled();
        expect(then).not.toBeCalled();
    });

    test('should re-throw errors using onError', async () => {
        const mockFn = jest.fn();

        const reThrow = async () => {
            await promise(
                () => {
                    throw new Error('re-throw');
                },
                {
                    onError: e => {
                        throw e;
                    },
                }
            );
            await mockFn();
        };

        expect(mockFn).not.toBeCalled();
        expect(reThrow).rejects.toThrowError('re-throw');
    });
});
