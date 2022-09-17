import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { GET_URLS, User } from './mock.types';
import { BASE_URL } from './server';

declare module 'axios' {
    // eslint-disable-next-line no-unused-vars
    interface AxiosResponse<T = any> extends Promise<T> {}
}

/**
 * base for http clients with custom axios instance
 */
export abstract class HttpClientBase {
    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });

        this._initializeResponseInterceptor();
    }

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError
        );
    };

    private _handleResponse = ({ data }: AxiosResponse) => data;

    protected _handleError = (error: any) => Promise.reject(error);
}

class HttpClient extends HttpClientBase {
    public get = <T>(url: GET_URLS) => this.instance.get<T>(url);

    // public getUsers = () => this.instance.get<User[]>('/users');

    public getUser = () => this.get<User>('/user');
}

const http = new HttpClient(BASE_URL);

export default http;
