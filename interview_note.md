# 普通函数与箭头函数的区别
① 内部this指向不同        
普通函数内部的 this 指向由调用方式决定，即“谁调用，this指向谁”。但可以通过 call()、apply()、bind() 等方法来显式改变this的指向。        
箭头函数内部的 this 指向由其外层作用域的 this 指向决定，即“继承”外部作用域的 this 指向。且无法 通过 call()、apply()、bind() 等方法来显式改变this的指向。
② 是否能作为构造函数        
普通函数可以作为构造函数来使用，通过 new 关键字创建一个新的实例，拥有 prototype 属性，且内部的 this 会指向新创建的实例。    箭头函数无法作为构造函数来使用，如果使用 new 关键字，则会抛出错误。
③ arguments 对象不同        
普通函数可以使用内置的 arguments 对象来获取函数的所有参数。        
箭头函数没有自己的 arguments 对象，其会“继承”外部作用域的 arguments 对象。如果外部作用域是全局作用域，则会抛出错误，因为全局作用域没有 arguments 对象。
④ 对象方法不同        
在设置对象方法时，普通函数更适合，因为在通过对象调用方法时，普通函数的 this 指向对象本身。如果使用的是箭头函数，则通过对象调用方法时，函数内部的 this 指向取决于调用时所在的外部作用域。

# CommonJS, UMD, ESM 3者的区别
1. 用途场景不同
2. 加载方式不同
3. 兼容性不同

1. CommonJS(Node.js专用)
    语法 - require()引入，module.exports导出
    用途 - Node.js服务器端
    加载方式 - 同步加载(运行时加载)
    适合场景 - 后端，文件本地已存在，可同步加载

示例: 
```js
function add(a, b) {
  return a + b;
}
module.exports = add;

// index.js
const add = require('./math');
console.log(add(2, 3));
```

2. ESM(ES Modules/ES6 Module)
    语法 - import/export
    用途 - 浏览器 + 现代Node.js
    加载方式 - 异步加载(编译时加载)
    适合场景 - 现代浏览器，前端项目，模块化构建工具(如Vite, Webpack)

示例: 
```js
// math.js
export function add(a, b) {
  return a + b;
}

// index.js
import { add } from './math.js';
console.log(add(2, 3));
// 在 HTML 中，必须使用 <script type="module">：
<script type="module" src="index.js"></script>

```

3. UMD(Universal Module Definition) 通用模块定义
    语法 - 混合CommonJS + AMD + 浏览器变量
    用途 - 兼容所有环境: Node.js, 浏览器，RequireJS等
    加载方式 - 自动判断运行环境，动态适配
    适用场景 - 发布npm包，CDN脚本，需要最大兼容性时使用

示例: 
```js
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        root.myLib = factory();
    }
})(this, function() {
    return {
        hello: function() {}
    }
})
```