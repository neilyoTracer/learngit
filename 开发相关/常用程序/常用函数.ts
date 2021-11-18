//判断第r行是否满格//判断一个数组是否满格的方法
function isFullRow(arr: any[]): boolean {
    //如果在当前行的字符串中没有找到开头的逗号或结尾的逗号或连续的两个逗号，说明是满格
    return String(arr).search(/^,|,,|,$/) == -1
}


// 四舍五入版本,保留n位小数
function roundFunc(num: number, n: number): number {
    return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
}

/** 没有四舍五入版本
     * toFixed修正函数
     * @param
     * num操作数 表示需要保留的小数位数
     * s 表示需要保留的小数位数
     */
function toFixed(num: number, s: number): number {
    if (isNaN(num)) {
        return 0;
    }

    const times = Math.pow(10, s);
    return parseInt(num * times + '', 10) / times;
}

/**循环求法 */

// 求两个数的最大公约数的基础函数
function gcd(a, b) {
    if (isFinitePI(a) && isFinitePI(b)) {
        let r = a % b;
        while (r > 0) {
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
    if (canCompu) {
        return args.reduce((p, c) => gcd(p, c));
    }
}

/**函数式编程递归 */

// 获取函数名
function getFuncName(fn) {
    if ("name" in this) return this.name;
    return fn.toString().match(/function\s*([^(]*)\(/)[1];
}

// 获取首屏图片加载时间
const getFirstScreenImageLoadTime = () => {
    // 获取所有的 img dom 节点
    const images = document.getElementsByTagName('img');
    const imageEntries = performance.getEntries().filter(function (entry: any) {
        return entry.initiatorType === 'img'
    });

    // 获取在首屏内的 img dom 节点
    const firstScreenEntry = [];
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const ret = image.getBoundingClientRect();
        if (ret.top < (window.innerHeight - 2) && ret.right > 0 && ret.left < (window.innerWidth - 2)) {
            // 如果在首屏内
            const imageEntry = imageEntries.filter(function (entry) {
                return entry.name === image.src;
            })[0];
            imageEntry && firstScreenEntry.push(imageEntry);
        }
    }

    // 获取最晚加载完成的一张
    let maxEntry;
    if (firstScreenEntry.length >= 1) {
        maxEntry = firstScreenEntry.reduce(function (prev, curr) {
            if (curr.responseEnd > prev.responseEnd) {
                return curr;
            } else {
                return prev
            }
        });
    }

    return maxEntry && maxEntry.responseEnd || null;
}


// 是否localhost
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)