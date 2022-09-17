import { promise } from '@src/index';

import http from '../__mocks__/http.client';

describe('Promise requests', () => {
    test('should do http request and receive user object', async () => {
        const [userRes, err] = await promise(() => http.getUser());

        const target = {
            name: 'john',
        };

        expect(err).toBeNull();
        expect(userRes).toEqual(target);
    });

    test('should do http request then return a new user object with id', async () => {
        const [userRes, err] = await promise(() => http.getUser(), {
            then: user => ({ ...user, id: 1 }),
        });

        const target = {
            name: 'john',
            id: 1,
        };

        expect(err).toBeNull();
        expect(userRes).toEqual(target);
    });

    test('should skip http request with skip option', async () => {
        const mockFn = jest.fn(() => http.getUser());

        const [res, err] = await promise(() => mockFn(), {
            skip: true,
        });

        expect(mockFn).toHaveBeenCalledTimes(0);
        expect(res).toBeNull();
        expect(err).toBeInstanceOf(Error);
    });
});
