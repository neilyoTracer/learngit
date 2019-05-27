// 例9-3 : Complex.js: 表示复数的类
/**
 * Complex.js:
 * 这个文件定义了Complex类, 用来描述复数
 * 复数是实数和虚数的和,并且虚数i是-1的平方根
 */

function Complex(real, imaginary) {
	if (isNaN(real) || isNaN(imaginary)) {
		throw new TypeError();
	}
	this.r = real;              // 实部
	this.i = imaginary;         // 虚部
}

// 当前复数对象加上另外一个复数, 并返回一个新的计算和值后的复数对象
Complex.prototype.add = function (that) {
	return new Complex(this.r + that.r, this.i + that.i);
}

// 乘积
Complex.prototype.mul = function (that) {
	return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
}

// 计算复数的模, 复数的模定义为原点(0, 0)到复平面的距离
Complex.prototype.mag = function () {
	return Math.sqrt(this.r * this.r + this.i * this.i);
}

// 复数的求负运算
Complex.prototype.neg = function() { 
	return new Complex(-this.r, -this.i);
}

// 将复数对象转换为一个字符串
Complex.prototype.toString = function() { 
	return '{' + this.r + ',' + this.i + '}';
}

// 检测当前复数对象是否和另外一个负数值相等
Complex.prototype.equals = function(that) { 
	return that != null && that.constructor === Complex && this.r === that.r && this.i === that.i;
}

Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

Complex.parse = function(s) { 
	try { 
		var m = Complex._format.exec(s);
		return new Complex(parseFloat(m[1]), parseFloat(m[2]));
	} catch(x) { 
		throw new TypeError('Can\'t parse \'' + s + '\' as a complex number');
	}
};

Complex._format = /^\{([^,]+),([^}]+)\}$/;

var c = new Complex(2, 3);
var d = new Complex(c.i, c.r);
c.add(d).toString();  // "{5, 5}"
Complex.parse(c.toString())
	.add(c.neg())
	.equals(Complex.ZERO);
