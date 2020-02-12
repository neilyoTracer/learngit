function inherit(subClass, superClass) { 
    subClass.prototype = Object.create(superClass.prototype, { 
        constructor: { 
            enumerable: false,
            configurable: true,
            writable: true,
            value: superClass.constructor
        }
    });
    Object.setPrototypeOf(subClass, superClass); // 实现类的静态方法和属性的继承
}