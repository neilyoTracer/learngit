function co(gen) {
    const ctx = this;

    return new Promise(function (resolve, reject) {
        if (typeof gen === 'function') gen = gen.call(ctx);
        if (!gen || typeof gen.next !== 'function') return resolve(gen);

        onFulfilled();
        function onFulfilled(res) {
            var ret;
            try {
                ret = gen.next(res);
            } catch (e) {
                return reject(e);
            }
            next(ret);
        }
    });
}

function next(ret) {
    if (ret.done) return resolve(ret.value);
    var value = toPromise.call(ctx, ret.value);
    if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
    return onRejected(
        new TypeError(
            'You may only yield a function, promise, generator, array, or object, '
            + 'but the following object was passed: "'
            + String(ret.value)
            + '"'
        )
    );
}

// 简易版本
function run(gen) { 
    const it = gen();
    const result = it.next();

    return new Promise((resolve, reject) => { 
        const next = function(result) { 
            if(result.done) { 
                resolve(result.value);
            }
            result.value = Promise.resolve(result.value);
            result.value
                .then(res => next(it.next(res)))
                .catch(err => reject(err));
        }
        next(result);
    });
}

// 使用方法
function* fn() { 
    const res = yield api(data);
    console.log(res);
    const res2 = yield api2(data2);
    console.log(res2);
    const res3 = yield api3(data3);
    console.log(res3);
    console.log(res, res2, res3);
}

run(fn);