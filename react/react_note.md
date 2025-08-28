# React 中只要 [props] [state] [context] [key] 或[外部订阅的数据变化]，或显式调用 [forceUpdate]，就会触发重新渲染。理解这几个触发点，有助于有效优化组件性能。

# Optimizing a custom Hook 
If you’re writing a custom Hook, it’s recommended to wrap any functions that it returns into useCallback
```javascript
function useRouter() {
    const { dispatch } = useContext(RouterStateContext);
    const navigate = useCallback(url => {
        dispatch({type: 'navigate', url});
    }, [dispatch]);

    const goBack = useCallback(url => {
        dispatch({type: 'back'});
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
const List = React.memo(function List({items}){});
export default function TodoList({todos, tab, theme}) {
    // Tell React to cache your calculation between re-renders...
    const visibleTodos = useMeme(
        () => filterTodos(todos, tab),
        [todos, tab]
    );

    return (
        <div className={theme}>
            <List items={visibleTodos}/>
        </div>
    );
}

// Memoizing individual JSX nodes
export default function TodoList({todo, tab, theme}) {
    const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
    const children = useMemo(() => <List items={visibleTodos}/>, [visibleTodos]);
    return (
        <div className={theme}>children</div>
    )
}
```

# 模拟React19推出的useEffectEvent
在 React 18 中如何模拟它
方法一：手写 shim（推荐）

你可以参考 Dan Abramov 提出的一个经典写法。这是社区广泛认可的一种实现方式：
```javascript
import { useRef, useLayoutEffect, useCallback } from 'react';

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
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
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
      }}>+5</button>
    </>
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