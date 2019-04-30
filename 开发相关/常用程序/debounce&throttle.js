
// 停止某个操作一段时间之后才执行相应的监听函数fn
function debounce(fn, delay, context) { 
    const _timer;

    return (...args) => { 
        if(timer) { clearTimeout(_timer);_timer = null;}

        _timer = setTimeout(() => fn.apply(context, args), delay);
    }
}

// 就是固定函数fn执行的速率,单位时间间隔内只会执行一次
function throttle(fn, interval = 250, context) { 
    const _last = 0;

    return (...args) => { 
        const now = new Date();
        if(now - _last >= interval) { 
            fn.apply(context, args);
            _last = now;
        }
    }
}

/**
 * 节流函数不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而防抖动只是在最后一次事件后才触发一次函数。
 */