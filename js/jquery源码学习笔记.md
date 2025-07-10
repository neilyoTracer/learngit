1. 正数下标和负数下标的用途

``` 
num < 0 ? this[ num + this.length ] : this[ num ]
```

2. 对象判空

``` 
isEmptyObject: function( obj ) {

    /* eslint-disable no-unused-vars */
	// See https://github.com/eslint/eslint/issues/6125
	var name;

	for ( name in obj ) {
		return false;
	}
	return true;
}		
```

3.

