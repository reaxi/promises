export type Opts<T extends unknown, R, N> = {
    onError?: (err: Error) => void;
    then?: ((res: R) => T) | ((res: R | N) => T | N)[];
    onFinally?(): void;
    skip?: boolean;
};

// ? ----------  OK

export type PromiseOptionsGen<R, T> = {
    onError?: (err: Error) => void;
    then?: (arg: Awaited<R>) => T;
    onFinally?(): void;
    skip?: boolean;
};

type NotUnknown = object | number | string | symbol | bigint | boolean;

type OptionalArg<Arg, T1, T2> = Arg extends NotUnknown ? T2 : T1;

type SuccessRes<R, T> = [OptionalArg<T, Awaited<R>, Awaited<T>>, null];

type ErrorRes = [null, Error];

export type PromiseReturn<R, T> = SuccessRes<R, T> | ErrorRes;

export type InferReturn<T> = T extends (...args: any[]) => infer R ? R : T;
// type NotNoDistribute<T, U> = [T] extends [U] ? never : T;
