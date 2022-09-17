# @reaxi/promises

Promise (async/await) reusable structure for functions

> modern promises runtime to avoid [callback hell](http://callbackhell.com/)

> inspired by monad's design structure

```sh
yarn add @reaxi/promises

# npm i @reaxi/promises
```

## Features

-   functions run error secure with try/catch
-   typescript powered
-   build better programs
-   code consistency (dry)
-   cleaner code

> please note: this package is not an polyfill or Promise implementation, you still write your pure functions and tests isolated

## promise

```ts
import { promise } from '@reaxi/promises';

async function myApp() {
    const [result1, err1] = await promise(() => myFunctionA({ arg: 1 }));
    const [result2, err2] = await promise(() => myFunctionB({ arg: 2 }));
    const [result3, err3] = await promise(() => myFunctionC({ arg: 3 }));
    const [result3, err4] = await promise(() => myFunctionD({ arg: 4 }));
    const [result5, err5] = await promise(myFunctionE); //function with no args

    if()//....

    // very clean 👌
}
```

### Signature

```ts
//    data | Error
const [data, null ] = await promise(() => myFn(myArgs), options); //if your function return data
const [null, error] = await promise(() => myFn(myArgs), options); //if your function fails (Error)
```

### What about **then** ?

```ts
const [one] = await promise(() => 1, { then: res => res.toString() }); // '1'

const [posts] = await promise(() => fetch('/posts'), {
    then: res => res.json(),
}); //
```

### On Error

```ts
const [data] = await promise(() => fetch('/possible-err'), {
    onError: error => console.log(error),
}); //
```

### On Finally

```ts
const [data] = await promise(() => fetch('/user'), {
    onFinally: () => console.log('done'),
}); //
```

### skipping

> you can skip function call with a pre-flight parameter

```ts
const [reports] = await promise(() => fetch('/reports'), {
    skip: true, // or any function that returns a boolean like: validate(x): boolean
}); //
```

### options re-usage

```ts
import type { PromiseOptionsGen } from '@reaxi/promises';

type R = Awaited<ReturnType<typeof MyFn>>;

const options: PromiseOptionsGen<R> = {
    then: res => [res],
    onError: console.log,
    skip: isGuest(),
};

const [result1, err1] = await promise(() => MyFn({ id: 1 }), options);
const [result2, err2] = await promise(() => MyFn({ id: 2 }), options);
const [result3, err3] = await promise(() => MyFn({ id: 3 }), options);
```

## How it works?

ES6/ES8 Features

-   Promises
-   async/await
-   try/catch
-   async generators

## Options

```ts
const options: PromiseOptionsGen = {
    then: (result: R) => T, //function
    onError: (e: Error) => any, //function
    onFinally: () => any, //function
    skip: true | false, //boolean
};
```

## Examples:

they are trivial examples, you can use `promise` better with your application context

### fetch

```ts
import { promise } from '@reaxi/promises';
import fetch from 'cross-fetch';

type TodoResponse = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

export async function myPackage() {
    const [val, err] = await promise(
        () => fetch('https://jsonplaceholder.typicode.com/todos/1xx'),
        {
            then: res => {
                if (res.status === 404) throw new Error('Todo Not found');
                return res.json() as Promise<TodoResponse>;
            },
        }
    );

    if (val) console.log(val?.title);
    if (err) console.log(err.message);
}

myPackage();
```

### Options re-usage

```ts
type R = Awaited<ReturnType<typeof getTodos>>;

const getTodos = (id?: number) =>
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

const opts = {
    then: (res: R) => {
        if (res.status === 404) throw new Error('Todo Not found');
        return res.json() as Promise<TodoResponse>;
    },
};

export async function myPackage() {
    const [todo1, err1] = await promise(() => getTodos(1), opts);
    const [todo2, err2] = await promise(() => getTodos(999), opts);
    // ...

    if (todo1) console.log(todo1?.title); // 'delectus aut autem'
    if (err1) console.log(err1.message); // null

    if (todo2) console.log(todo2?.title); // null
    if (err2) console.log(err2.message); // 'Todo Not found'
}
```

### nextjs api handlers

> this example works for similar request/request handlers too

```ts
import { NextApiRequest, NextApiResponse } from 'next';
import { promise } from '@reaxi/promises';

async function getData(id) {
    const response = await get(`/data/${id}`);
    if (!response.data) throw new Error(`No Data found with id: ${id}`);

    return response.data;
}

async function validateRequest(RequestMethod, allowedMethod) {
    if (RequestMethod !== allowedMethod) throw new Error('Method Not Allowed');
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await promise(() => validateRequest(req.method, 'GET'), {
        onError: e => res.status(405).end(e.message), // e.message: 'Method Not Allowed'
    });

    const [id] = await promise(() => req.body.id, {
        onError: e => res.status(400).end('Missing id'),
    });

    await promise(() => getData(id), {
        then: data => res.status(200).json(data),
        onError: e => res.status(403).end(e?.message),
    });
};
```

### subsequent functions

this example will showcase an pipeline of subsequent functions

every time you call `promise` your function will be executed safely with try/catch,
even if return an Error the program will continue the next functions,
to stop you can re-throw the error or stop the program

```ts
export async function myWorkflow() {
    await promise(() => init(), {
        onError: process.exit, // stop the program on error
    });
    await promise(setup, {
        onError: e => {
            throw e;
        }, // re-throw the catch Error to be handled by the outer function (if the outer function doesn't catch, the program stops with the Error)
    });
    await promise(optionalRuntime); // optional function without args (the program will continue on error)
    await promise(() => calculate(a, b)); // optional function with args (the program will continue on error)
    const [app] = await promise(startApp, {
        then: () => console.log('app started'),
    });
}
```
