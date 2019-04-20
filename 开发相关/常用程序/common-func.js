const isLocalhost = Boolean(
	window.location.hostname === 'localhost' || 
	window.location.hostname === '[::1]' || 
	window.location.hostname.match(
		/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
	)
)

// 四舍五入,保留n位小数
function round(num, n) { 
	return Math.round(num * Math.pow(10,n)) / Math.pow(10,n);
}

