// @todo improve types

export async function runThen<R, P extends unknown, N>(
    fns: ((prev: P | R) => P | N)[],
    initialRes: R
) {
    let res: P | R | any = initialRes;
    for await (const fn of fns) {
        res = await fn(res);
        // console.log(res);
    }
    return res;
}

export function pipeFns<T>(initfn: () => T, ...fns: ((arg: T) => T)[]) {
    return fns.reduce((acc, fn) => fn(acc), initfn());
}
