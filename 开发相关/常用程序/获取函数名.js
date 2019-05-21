function getName(fn) { 
	if("name" in this) return this.name;
	return fn.toString().match(/function\s*([^(]*)\(/)[1];
}