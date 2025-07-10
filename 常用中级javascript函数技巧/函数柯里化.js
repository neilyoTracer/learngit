function curry(fn) {
    if (fn.length <= 1) return fn;
    const generator = (...args) => {
        if (fn.length === args.length)
            return fn(...args);
        else
            return (...args2) => {
                return generator(...args, ...args2)
            };
    }
    return generator;
}

// use as
const add = (a, b, c, d) => a + b + c + d;
const curriedAdd = curry(add);
const res1 = curriedAdd(5)(6, 7)(8);
const res2 = curriedAdd(5, 6, 7)(8);
console.log(res1, res2);

/**
 * 函数式编程另一个重要的函数 compose，能够将函数进行组合，而组合的函数只接受一个参数，
 * 所以如果有接受多个函数的需求并且需要用到 compose 进行函数组合，就需要使用柯里化对准备组合的函数进行部分求值，让它始终只接受一个参数
 * 这里有一个常见的例子，它接受两个函数f()和g()，并返回一个新的函数用以计算f(g()):
 * 返回一个新的可以计算的f(g(...))的函数
 * 返回的函数h()将它所有的实参传入g(),然后将g()的返回值传入f()
 * 调用f()和g()时的this值和调用h()时的this值是同一个this
 */
function compose(f, g) {
    return function () {
        return f.call(this, g.apply(this, arguments));
    }
}

function multipleCompose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) { 
        return rest[0]
    }

    return funcs.reduceRight((prev, curr) => (...arg) => curr(prev(...arg)));
}

// ex:
const square = x => x * x;
const sum = (x, y) => x + y;
const squareofsum = compose(square, sum);
const res3 = squareofsum(2, 3);
console.log(res3);

// ex: 
const power = (x, n) => x << (n - 1);
const curriedPower = curry(power);
const powerofsquareofsum = compose(curriedPower, squareofsum);
const res4 = powerofsquareofsum(2, 3)(3);
console.log(res4);

