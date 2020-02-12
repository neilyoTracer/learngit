/**
 * 写一个方法，传入数字x，从一个一维数组里找到两个数字符合“n1 + n2 ＝ x”
 * @param arr 
 * @param x 
 */

const find = (arr: number[], x: number): Array<Array<number>> => {
    const ret: Array<Array<number>> = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === x) {
                ret.push([arr[i], arr[j]])
            }
        }
    }

    return ret;
}