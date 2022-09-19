# 0.3.0

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

# 0.1.0

First release 🎈
