/**循环求法 */

// 求两个数的最大公约数的基础函数
function gcd(a, b) {
	if (isFinitePI(a) && isFinitePI(b)) {
		let r = a % b;
		while(r > 0) {
			a = b,
			b = r,
			r = a % b;
		}

		return b;
	} else { 
		return NaN;
	}
}

function isFinitePI(n) {
	return isFinite(n) && n > 0 && n === Math.round(n);
}

// 求几个数的最大公约数
function gcd2(...args) { 
	const canCompu = args.every(arg => isFinitePI(arg));
	if(canCompu) { 
		return args.reduce((p,c) => gcd(p,c));
	}
}

/**函数式编程递归 */
