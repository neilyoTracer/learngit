
// 停止某个操作一段时间之后才执行相应的监听函数fn
function debounce(fn, delay, context) {
    const _timer;

    return (...args) => {
        if (timer) { clearTimeout(_timer); _timer = null; }

        _timer = setTimeout(() => fn.apply(context, args), delay);
    }
}

// 就是固定函数fn执行的速率,单位时间间隔内只会执行一次
function throttle(fn, interval = 250, context) {
    const _last = 0;

    return (...args) => {
        const now = new Date();
        if (now - _last >= interval) {
            fn.apply(context, args);
            _last = now;
        }
    }
}

/**
 * 节流函数不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而防抖动只是在最后一次事件后才触发一次函数。
 */

/**
 * 完整版本
 */
const debounce2 = (fn, time = 17, options = {
    leading: true,
    trailing: true,
    context: null
}) => {
    let timer;
    const _debounce = function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        if (options.leading && !timer) {
            timer = setTimeout(null, time);
            fn.apply(options.context, args);
        } else if (options.trailing) {
            timer = setTimeout(() => {
                fn.apply(options.context, args);
                timer = null;
            }, time);
        }
    }

    _debounce.cancel = function () {
        clearTimeout(timer);
        timer = null;
    }

    return _debounce;
}

/**
 * leading 为是否在进入时立即执行一次， trailing 为是否在事件触发结束后额外再触发一次，
 * 原理是利用定时器，如果在规定时间内再次触发事件会将上次的定时器清除，即不会执行函数并重新设置一个新的定时器，
 * 直到超过规定时间自动触发定时器中的函数同时通过闭包向外暴露了一个 cancel 函数，使得外部能直接清除内部的计数器
 */

const throttle2 = (fn, time = 17, options = { leading: true, trailing: false, context: null }) => {
    let previous = new Date(0).getTime();
    let timer;
    const _throttle = function (...args) {
        let now = new Date().getTime();

        if (!options.leading) {
            if (timer) return;
            timer = setTimeout(() => {
                timer = null;
                fn.apply(options.context, args);
            }, time)
        } else if (now - previous > time) { 
            fn.apply(options.context, args);
            previous = now;
        } else if (options.trailing) { 
            clearTimeout(timer);
            timer = setTimeout(() => { 
                fn.apply(options.context, args);
            }, time); 
        }
    }

    _throttle.cancel = () => { 
        previous = 0;
        clearTimeout(timer);
        timer = null;
    }

    return _throttle;
};

