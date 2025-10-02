# React 中只要 [props] [state] [context] [key] 或[外部订阅的数据变化]，或显式调用 [forceUpdate]，就会触发重新渲染。理解这几个触发点，有助于有效优化组件性能。

# Optimizing a custom Hook 
If you’re writing a custom Hook, it’s recommended to wrap any functions that it returns into useCallback

```javascript
function useRouter() {
    const {
        dispatch
    } = useContext(RouterStateContext);
    const navigate = useCallback(url => {
        dispatch({
            type: 'navigate',
            url
        });
    }, [dispatch]);

    const goBack = useCallback(url => {
        dispatch({
            type: 'back'
        });
    }, [dispatch]);

    return {
        navigate,
        goBack
    }
}
```

# React useState原理

每个React组件都维护了一个内部数组，用来存放在这个组件里声明的所有useState(value， setValue对)，它们是按读取顺序存放的，每当组件重新渲染，就会从0开始读取这个数组里面存放的这些pair
这就是为什么，你只能把useState放在组件的顶层，而不能放在conditions和循环里的原因，因为它的读取顺序必须是固定的

# Memoizing individual JSX nodes

Instead of wrapping List in memo, you could wrap the <List /> JSX node itself in useMemo

```javascript
// React.memo
const List = React.memo(function List({
    items
}) {});
export default function TodoList({
    todos,
    tab,
    theme
}) {
    // Tell React to cache your calculation between re-renders...
    const visibleTodos = useMeme(
        () => filterTodos(todos, tab),
        [todos, tab]
    );

    return ( <
        div className = {
            theme
        } >
        <
        List items = {
            visibleTodos
        }
        /> <
        /div>
    );
}

// Memoizing individual JSX nodes
export default function TodoList({
    todo,
    tab,
    theme
}) {
    const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
    const children = useMemo(() => < List items = {
            visibleTodos
        }
        />, [visibleTodos]);
        return ( <
            div className = {
                theme
            } > children < /div>
        )
    }
```

# 模拟React19推出的useEffectEvent

在 React 18 中如何模拟它
方法一：手写 shim（推荐）

你可以参考 Dan Abramov 提出的一个经典写法。这是社区广泛认可的一种实现方式：

```javascript
import {
    useRef,
    useLayoutEffect,
    useCallback
} from 'react';

export function useEvent(fn) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        ref.current = fn;
    }, [fn]); // 每次 fn 变化都更新 ref

    return useCallback((...args) => {
        const f = ref.current;
        return f(...args);
    }, []); // 返回一个身份始终不变的函数
}
```

# State as a Snapshot

```javascript
import {
    useState
} from 'react';

export default function Counter() {
    const [number, setNumber] = useState(0);

    return ( <
        >
        <
        h1 > {
            number
        } < /h1> <
        button onClick = {
            () => {
                setNumber(number + 5);
                setTimeout(() => {
                    console.log(number) // it's 0 in 2000ms
                }, 2000);
                /**
                    it's equivalent to 
                   setTimeout(() => {
                        console.log(0)
                   }, 2000) 
                 */
            }
        } > +5 < /button> <
        />
    )
}
```

<The state stored in React may have changed by the time the alert runs, but it was scheduled using a snapshot of the state at the time the user interacted with it!>

# Race Condition

why the useData can solve "Race Condition"

```javascript
function useData(url) {
    const [data, setData] = useState(null);
    useEffect(() => {
        let ignore = false;
        fetch(url)
            .then(response => response.json())
            .then(
                // 1. this is a function with the closure ignore
                // 2. when url is change , the ignore change to true
                // 3. react rendering, this will generate a new closure
                // 4. so the previours closure in previours query funtion is true
                // 5. and this logic will never be excute except the newest query result coming up
                json => {
                    if (!ignore) {
                        setData(json);
                    }
                }
            );
        return () => {
            ignore = true;
        };
    }, [url]);
    return data;
}
```

# useCallback的用法分为两步
1. 在定义函数的组件中使用[useCallback],然后传给子组件
2. 子组件用useMemo或者memo包装
3. 这样子组件就不会每次父组件更新都重新渲染

```javascript
const ShippingForm = memo(function ShippingForm({
    onSubmit
}) {
    // ...
});

or

const ShippingForm = useMemo(() => < ShippingForm onSubmit = {
            onSubmit
        }
        />, [onSubmit]);
```

If you’re already familiar with useMemo, you might find it helpful to think of useCallback as this:

```javascript
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
    return useMemo(() => fn, dependencies);
}
```

# forwardRef()

forwardRef 是 React 16.3 引入的一个 API，在 React 18 中依然使用，主要作用是 让函数组件可以接收父组件传递下来的 ref，并把它转发（forward）到子组件中的某个真实 DOM 元素或 class 组件实例上。

为什么需要 forwardRef

默认情况下，ref 只能直接绑定到原生 DOM 元素或者 class 组件上。

函数组件是没有实例的，父组件直接给函数组件传 ref 会报错。

有时我们需要父组件直接访问子组件内部的某个 DOM 节点（例如：input、button 等），这时就需要用 forwardRef 把 ref 转发到子组件里的 DOM 节点。

基本用法

```javascript
import React, {
    forwardRef,
    useRef
} from "react";

const MyInput = forwardRef((props, ref) => {
    return <input ref = {
        ref
    } {
        ...props
    }
    />;
});

export default function App() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus(); // 父组件直接操作子组件里的 input
    };

    return ( <
        div >
        <
        MyInput ref = {
            inputRef
        }
        placeholder = "Type here..." / >
        <
        button onClick = {
            focusInput
        } > Focus Input < /button> <
        /div>
    );
}
```

[核心点]

forwardRef 接受一个 渲染函数，参数是 (props, ref)。

props 是父组件传递的普通属性。

ref 是父组件传递的 ref 对象。

这个 ref 可以绑定到子组件里的 DOM 元素或 class 组件上。

结合 [useImperativeHandle] 可以更精细地暴露子组件的功能（比如只暴露 focus 方法）。

# useData

Encapsulation of fetching data through hooks

```javascript
// 暂时放的react-query的请求代码
const {
    isLoading,
    data
} = useQuery({
    queryKey: ['KnowledgeData', curPage, curPageSize],
    queryFn: async () => {
        try {
            const resp = await v1KnowledgeListList({
                page: curPage,
                size: curPageSize,
            })
            setTotal(resp.data.totalCount)
            // setKnowledgeList(resp.data.knowledges)
            return resp.data.knowledges;
        } catch (error) {
            message.error(getMessageFromError(error))
            throw new Error('some error!');
        }
    }
})
```

# 对于useCallback和useMemo的理解
对于React的组件或者hooks里定义的[函数]或[变量]，都是对于[当前函数](当前函数就是hooks或者说组件)来说都是闭包....
他们都是零时的，当从新调用当前函数的时候都会重新创建副本

所以如果我们不想他们发生变化的话，通常是某个[变量]需要大量计算或者某个定义的[函数]参与了useEffect
我们就需要用useCallback或者useDemo去包裹它了

inspiration from [zustand]
```javascript
const useCounterStore = <U>(
  currentTabIndex: number,
  selector: (state: CounterStore) => U,
) => {
  const stores = useContext(CounterStoresContext)

  if (stores === undefined) {
    throw new Error('useCounterStore must be used within CounterStoresProvider')
  }

  // we define a fn here, so we use useCallback to encapsulate it to preserve the fn Ref
  const getOrCreateCounterStoreByKey = useCallback(
    () => createCounterStoreFactory(stores),
    [stores],
  )

  return useStore(getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`))
}

```
