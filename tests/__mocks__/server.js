import { setupServer } from 'msw/node';
import { handlers } from './api.handlers';
// This configures a request mocking server with the given request handlers.

export const BASE_URL = 'http://localhost/api';

export const server = setupServer(...handlers(BASE_URL));
