// 使用ES5实现数组的map方法
const selfMap = function (fn, context) {
	let arr = Array.prototype.slice.call(this);
	let mappedArr = [];
	for (let i = 0; i < arr.length; i++) {
		if (!arr.hasOwnProperty(i)) continue; 
		mappedArr.push(fn.call(context, arr[i], i, this))
	}
}


/**
 * 值得一提的是，map 的第二个参数为第一个参数回调中的 this 指向，如果第一个参数为箭头函数，那设置第二个 this 会因为箭头函数的词法绑定而失效
 
 另外就是对稀疏数组的处理，通过 hasOwnProperty 来判断当前下标的元素是否存在与数组中(感谢评论区的朋友)
 */

// 使用reduce实现数组map方法
const selfMap2 = function(fn, context) { 
	let arr = Array.prototype.slice.call(this);
	return arr.reduce((pre, cur, index) => { 
		return [...pre, fn.call(context, cur, index, this)]
	}, []);
}

Array.prototype.selfMap = selfMap;
// ES5实现数组filter方法
const selfFilter = function(fn, context) { 
	let arr = Array.prototype.slice.call(this);
	let filterArr = [];
	for(let i = 0; i < arr.length; i++) { 
		if(!arr.hasOwnProperty(i)) continue;
		fn.call(context, arr[i], i, this) && filteredArr.push(arr[i])
	}
	return filterArr;
}


// 使用reduce实现数组filter方法
const selfFilter2 = function(fn, context) { 
	return this.reduce((pre, cur, index) => { 
		return fn.call(context, cur, index, this) ? [...pre, cur] : [...pre];
	}, []);
}

// ES5实现数组的some方法
const selfSome = function(fn, context) { 
	let arr = Arr.prototype.slice.call(this);

	if(!arr.length) return false;
	let flag = false;
	for(let i = 0; i < arr.length; i++) { 
		if(!arr.hasOwnProperty(i)) continue;
		let res = fn.call(context, arr[i], i, this);
		if(res) { 
			flag = true;
			break;
		}
	}
	return flag;
}

/**
 * **************执行 some 方法的数组如果是一个空数组，最终始终会返回 false，而另一个数组的 every 方法中的数组如果是一个空数组，会始终返回 true*********************
 */

//  **注意，当不指定初始值调用reduce时，它将使用数组的第一个元素作为其初始值。这意味着第一次调用化简函数就使用了第一个和第二个数组元素作为其第一个参数和第二个参数，
// 在空数组上，如果不带初始值参数调用reduce将导致类型错误异常。
// 如果调用它的时候只有一个值 -- 数组只有一个元素并且没有指定初始值，或者🈶️一个空数组并且指定一个初始值， reduce只是简单的返回那个值，不会调用化简函数**

// ES5实现数组的reduce方法
const findRealElementIndex = function(arr, initIndex) { 
	let index;
	for(let i = initIndex || 0; i < arr.length; i++) { 
		if(!arr.hasOwnProperty(i)) continue;
		index = i;
		break;
	}
	return index;
}

const selfReduce = function(fn, initialValue) {
	let arr = Array.prototype.slice.call(this);
	let res

	if(initialValue === undefined) { 
		res = arr[findRealElementIndex(arr)]
		for(let i = 0; i < arr.length - 1; i++) { 
			if(!arr.hasOwnProperty(i)) continue;

			// reduce遍历时, 需要跳过稀疏元素,找到最近的一个非稀疏元素
			let realElementIndex = findRealElementIndex(arr, i + 1);
			res = fn.call(null, res, arr[realElementIndex], realElementIndex, this);
		}
	} else { 
		res = initialValue;
		for(let i = 0; i < arr.length; i++) { 
			if(!arr.hasOwnProperty(i)) continue;
			res = fn.call(null, res, arr[i], i, this);
		}
	}
	return res;
}

// 8. 使用 reduce 实现数组的 flat 方法
const selfFlat = function(depth = 1) { 
	let arr = Array.prototype.slice.call(this);
	if(depth === 0) { return arr; }
	return arr.reduce((pre, cur) => {
		if(Array.isArray(cur)) { 
			return [...pre, ...selfFlat.call(cur)];
		} else { 
			return [...pre, cur];
		}
	} , []);
}

