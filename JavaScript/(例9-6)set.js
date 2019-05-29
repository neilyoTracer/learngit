// 例 9-6: Set.js:值得任意集合
function Set() { // 这是一个构造函数
	this.values = {}; // 集合数据保存在对象的属性里
	this.n = 0; // 集合中值的个数
	this.add.apply(this, arguments); // 把所有参数都添加进这个集合
}

// 将每个参数都添加至集合中
Set.prototype.add = function () {
	for (var i = 0; i < arguments.length; i++) { // 遍历每个参数
		var val = arguments[i]; //待添加到集合中的值
		var str = Set._v2s(val); // 把它转换为字符串
		if (!this.values.hasOwnProperty(str)) { // 如果不在集合中
			this.values[str] = val; // 将字符串和值对应起来
			this.n++; // 集合中值的计数加1
		}
	}
	return this;
};

// 从集合删除元素,这些元素由参数指定
Set.prototype.remove = function () {
	for (var i = 0; i < arguments.length; i++) { // 遍历每个参数 
		var str = Set._v2s(arguments[i]) // 将字符串和值对应起来
		if (this.values.hasOwnProperty(str)) {
			delete this.values[str];
			this.n--;
		}
	}
	return this;
};

// 如果集合包含这个值,则返回true,否则,返回false
Set.prototype.contains = function (value) {
	return this.values.hasOwnProperty(Set._v2s(value));
};

// 返回集合的大小
Set.prototype.size = function () {
	return this.n;
};

// 遍历集合中的所有元素,在指定的上下文中调用f
Set.prototype.foreach = function (f, context) {
	for (var s in this.values) {
		if (this.values.hasOwnProperty(s)) {
			f.call(context, this.values[s]);
		}
	}
};

// 这是一个内部静态函数,用以将任意JavaScript值和唯一的字符串对应起来
Set._v2s = function (val) {
	switch (val) {
		case undefined: return 'u';  // 特殊的原始值
		case null: return 'n';  // 值只有一个字母
		case true: return 't';
		case false: return 'f';
		default: switch (typeof val) {
			case 'number': return '#' + val; // 数字都带有 # 前缀
			case 'string': return '"' + val; // 字符串都带有 " 前缀
			default: return '@' + objectId(val); // Objs and funcs get @
		}
	}

	// 对任意对象来说, 都会返回一个字符串
	// 针对不同的对象, 这个函数会返回不同的字符串
	// 对于同一个对象的多次调用, 总是返回相同的字符串
	// 为了做到这一点, 它给o创建了一个属性, 在ES5中,这个属性是不可枚举且只读的
	function objectId(o) {
		var prop = "|**objectid**|";    // 私有属性,用以存放id
		if (!o.hasOwnProperty(prop)) {
			o[prop] = Set._v2s.next++
		}
		return o[prop];
	}
};
Set._v2s.next = 100; // 设置初始id的值

// 将这些方法添加到Set类的原型对象中
extend(Set.prototype, {
	// 将集合转换为字符串
	toString: function () {
		var s = '{',
			i = 0;
		this.foreach(v => s += ((i++ > 0) ? ', ' : '') + v);
		return s + '}'
	},
	// 类似 toString, 但是对于所有的值都将调用toLocaleString()
	toLocaleString: function () {
		var s = '{', i = 0;
		this.foreach(v => {
			if (i++ > 0) s += ', ';
			if (v == null) s += v;          // null 和 undefined
			else s += v.toLocaleString();  // 其他情况
		});
		return s + '}';
	},
	// 将集合转换为值数组
	toArray: function () {
		var a = [];
		this.foreach(v => a.push(v));
		return a;
	}
});

// 对于要从JSON转换为字符串的集合都被当做数组来对待
Set.prototype.toJSON = Set.prototype.toArray;

Set.prototype.equals = function (that) {
	// 一些次要情况的快捷处理
	if (this === that) return true;

	if (!(that instanceof Set)) return false;

	if (this.size() != that.size()) return false;

	try {
		this.foreach(v => {
			if (!that.contains(v)) throw false;
		});
		return true;
	} catch (x) {
		if (x === false) return false;
		throw x; // 重新抛出异常
	}
}

