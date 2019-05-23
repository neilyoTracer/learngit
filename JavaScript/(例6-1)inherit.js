// 例6-1: 通过原型继承创建一个新对象
// inherit() 返回一个继承自原型对象p的属性的新对象
// 这里使用ECMAScript 5 中的Object.create()函数(如果存在的话)
// 如果不存在Object.create(), 则退化使用其他方法
function inherit(p) { 
	if(p == null) throw TypeError();     // p是一个对象,但不能是null
	if(Object.create) return Object.create(p); // 如果Object.create()存在,直接使用它
	var t = typeof p;
	if(t !== 'object' && t !== "function") throw TypeError();
	function f() { };
	f.prototype = p;
	return new f();   // 使用f创建p的继承对象
} 

module.exports = inherit;