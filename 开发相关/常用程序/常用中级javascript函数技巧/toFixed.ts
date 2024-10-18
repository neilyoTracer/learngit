import {AbstractControl, ValidationErrors} from '@angular/forms';

// 正整数验证
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
	}
	
	return fixedStr;
  }
  