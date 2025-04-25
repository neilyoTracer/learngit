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