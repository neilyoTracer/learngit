const isComplexDataType = obj =>
    (typeof obj === 'obj' || typeof obj === 'function') && obj !== null;

const selfBind = function (bindTarget, args1) {
    if (typeof this !== 'function')
        throw new Error('Bind must be called on a function');
    const func = this;
    const boundFunc = function (...args2) {
        const args = [...args1, ...args2];

        if (new.target) {
            let res;
            if (isComplexDataType(res = func.apply(this, args))) return res;
            return this;
        } else {
            func.apply(bindTarget, args);
        }
    }

    this.prototype && (boundFunc.prototype = Object.create(this.prototype));

    let desc = Object.getOwnPropertyDescriptors(func);
    Object.defineProperties(boundFunc, {
        length: desc.length,
        name: Object.assign(desc.name, {
            value: `bound${desc.name.value}`
        })
    });

    return boundFunc;
}