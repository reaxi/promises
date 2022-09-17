import { rest } from 'msw';

export const handlers = baseUrl => [
    // Handles a POST /login request
    rest.post(`${baseUrl}/login`, null),
    // Handles a GET /user request

    rest.get(`${baseUrl}/user`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                name: 'john',
            })
        );
    }),
];
