/**
 * 插入去重函数（可用于数组去重）
 * @param {Array} initial 待插入的数组，用于生成字典
 * @param {Array} insertArray 需要去重的数组，用于生成最终的输出
 * @param {string} field 元素是对象时，依据的去重字段，此字段值必须是字符串
 */

function insertDistinct(initial,insertArray,field) { 
    let dictionary = {},
        result = [];
    initial.forEach(ele => { 
        dictionary[field?ele[field]:ele] = true;
    })
    insertArray.forEach(ele => {
        if(!dictionary.hasOwnProperty(field ? ele[field] : ele)) { 
            result.push(ele);
            dictionary[field?field:ele] = true
        }
    });
    return result;
}