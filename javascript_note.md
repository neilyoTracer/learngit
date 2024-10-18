[super关键字]
既可以当成函数使用，也可以当成对象使用。
1. 第一种情况, super当作函数调用时,代表父类的构造函数
调用super()的作用是形成子类的this对象，把父类的实例属性和方法放到这个this对象上面。子类在调用super()之前，是没有this对象的，任何对this的操作都要放在super()的后面。
注意，这里的super虽然代表了父类的构造函数，但是因为返回的是子类的this（即子类的实例对象），所以super内部的this代表子类的实例，而不是父类的实例，这里的super()相当于[A.prototype.constructor.call(this)]（在子类的this上运行父类的构造函数）。
所以调用super
[第一步，形成子类的this]
[第二步，用子类的this对象调用父类的构造函数]
eg.
```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
上面示例中，new.target指向当前正在执行的函数。可以看到，在super()执行时（new B()），它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。

不过，由于super()在子类构造方法中执行时，子类的属性和方法还没有绑定到this，所以如果存在同名属性，[此时拿到的是父类的属性]。
```javascript
class A {
  name = 'A';
  constructor() {
    console.log('My name is ' + this.name);
  }
}

class B extends A {
  name = 'B';
}

const b = new B(); // My name is A
```
作为函数时，[super()只能用在子类的构造函数之中]，用在其他地方就会报错。

2. 第二种情况，super作为对象时，在普通方法中，指向[父类的原型对象]；在静态方法中，指向[父类](构造函数)。
这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是[无法通过super调用的]。
```javascript
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```
上面代码中，p是父类A实例的属性，super.p就引用不到它。
ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的[子类实例]。
```javascript
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```
上面代码中，super.print()虽然调用的是A.prototype.print()，
但是A.prototype.print()内部的this指向子类B的实例，导致输出的是2，而不是1。也就是说，
实际上执行的是[super.print.call(this)]。

由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
```javascript
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```
如果super作为对象，用在[静态方法]之中，这时super将指向父类，而不是父类的原型对象。
```javascript
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```
另外，在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```





