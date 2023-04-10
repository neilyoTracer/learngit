import {AbstractControl, ValidationErrors} from '@angular/forms';

export function posIntegerValidate(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if ((!isNaN(value) && value > 0 && value % 1 === 0) || !value) {
		return null;
	} else {
		return {invalidValue: {value: control.value}};
	}
}

/**
 * toFixed修正函数
 * @param
 * num操作数
 * s表示需要保留的小数位数
 */
// num表示需要保留的小数位数
function toFixed(num, s) {
	var multiplier = Math.pow(10, s);
	var fixedNum = Math.floor(num * multiplier) / multiplier;
	var fixedStr = fixedNum.toString();
	var decimalIndex = fixedStr.indexOf('.');
	
	if (s > 0) {
	  if (decimalIndex == -1) {
		fixedStr += '.';
		decimalIndex = fixedStr.length - 1;
	  }
	  while (fixedStr.length - decimalIndex - 1 < s) {
		fixedStr += '0';
	  }
	} else if (decimalIndex != -1) {
	  fixedStr = fixedStr.substring(0, decimalIndex);
	}
	
	return fixedStr;
  }