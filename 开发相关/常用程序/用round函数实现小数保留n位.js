// 四舍五入,保留n位小数
function round(num, n) { 
	return Math.round(num * Math.pow(10,n)) / Math.pow(10,n);
}