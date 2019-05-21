// 例 9-7: JavaScript中的枚举类型
// 这个函数创建一个新的枚举类型, 实参对象表示类的每个实例的名字和值
// 注意这个构造函数也会抛出异常: 不能使用它来创建该类型的新实例
// 返回的构造函数包含名/值对的映射表
// 包括由组成的数组, 以及一个foreach()迭代函数
function enumeration(namesToValues) { 
	// 这个虚拟的构造函数是返回值
	var enumeration = function() { throw "Can't Instantiate Enumerations";};

	// 枚举值继承自这个对象
	var proto = enumeration.prototype = { 
		constructor: enumeration,
		toString: function() { return this.name; },  // 返回名字
		valueOf: function() { return this.valueOf; }, // 返回值
		toJSON: function() { return this.name; } // 转换为JSON
	}

	enumeration.values = []; // 用以存放枚举对象的数组

	// 现在创建新类型的实例
	for(name in namesToValues) {   // 遍历每个值
		var e = inherit(proto);    // 创建一个代表的对象
		e.name = name;                    //给它一个名字
		e.value = namesToValues[name];    // 给它一个值
		enumeration[name] = e;            // 将它设置为构造函数的属性
		enumeration.values.push(e);        // 将它存储到值数组中
	}

	// 一个类方法, 用来对类的实例进行迭代
	enumeration.foreach = function(f,c) { 
		for(var i = 0;i<this.values.length;i++) f.call(c,this.values[i]);
	}

	// 返回标识这个新类型的构造函数
	return enumeration;
}

