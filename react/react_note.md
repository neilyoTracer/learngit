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