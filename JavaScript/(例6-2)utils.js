// 例6-2 用来枚举属性的对象工具函数
/**
 * 把 p 中的可枚举属性复制到 o 中,并返回o
 * 如果 p 中含有同名的属性, 则覆盖o 中的属性
 * 这个函数并不处理getter和setter以及复制属性
 */

function extend(o, p) {
	for (prop in p) {                       // 遍历p中所有的属性
		if (p.hasOwnProperty(prop)) {       // 不包括继承属性
			o[prop] = p[prop]              // 将属性添加到o中
		}
	}
	return o;
}

/**
 * 把 p 中的可枚举属性复制到 o 中,并返回o
 * 如果 o 和 p 中含有同名属性, o中的属性将不受影响
 * 这个函数并不处理getter和setter以及复制属性
 */

function merge(o, p) {
	for (prop in p) {                                    // 遍历p中的所有属性
		if (p.hasOwnProperty(prop)) {

			if (o.hasOwnProperty(prop)) { continue };    // 过滤掉已在o中存在的属性
			o[prop] = p[prop];                           // 将属性添加至o 中
		}
	}
	return o;
}

/**
 * 如果o 中的属性在p中没有同名属性
 */

function restrict(o, p) { 
	for(prop in o) { 
		if(!(prop in p)) delete o[prop];
	} 
	return o;
}

/**
 * 如果o中的属性在p中存在同名属性, 则从o中删除这个属性
 */
function subtract(o, p) { 
	for(prop in p) { 
		delete o[prop];
	}
	return o;
}

/**
 * 返回一个新的对象, 这个对象同时拥有o的属性和p的属性
 * 如果o和p中有重名属性,则使用p中的属性值
 */
function union(o, p) { 
	return extend(extend({}, o), p);
}

/**
 * 返回一个新对象,这个对象拥有同时在o和p中出现的属性
 */
function intersection(o, p) { 
	return restrict(extend({}, o), p);
}


