// 通过a标签下载图片，只有谷歌浏览器和火狐浏览器才支持
/**
 * 解决思路：
 * 1、因为图片地址是跨域的，所以先要转成 base64 数据流
 * 2、然后把 base64 转换成 blob对象
 * 3、然后判断浏览器的类型，选择不同的方式把 blob 文件流下载到本地
 */
// 转换成base64的方法
function convertUrlToBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const ext = img.src
                .substring(img.src.lastIndexOf('.') + 1)
                .toLowerCase();

            const type = `image/${ext}`;
            const dataUrl = canvas.toDataURL(type);
            const base64 = {
                dataUrl,
                type,
                ext
            }
            resolve(base64);
        }
    });
}

// 转换成 blob 对象
function convertBase64UrlToBlob(base64) {
    const parts = base64.dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("OPR") > -1) {
        return "Opera";
    } //判断是否Opera浏览器 OPR/43.0.2442.991
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器  Firefox/51.0
    if (userAgent.indexOf("Trident") > -1) {
        return "IE";
    } //判断是否IE浏览器  Trident/7.0; rv:11.0
    if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
    } //判断是否Edge浏览器  Edge/14.14393
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    } // Chrome/56.0.2924.87
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
}

const url = 'test'
// 图片转为base64
convertUrlToBase64(url).then((base64) => {
    const blob = convertBase64UrlToBlob(base64); // 转为blob对象
    // 下载
    const name = 'file_name'
    if (myBrowser() === "IE") {
        window.navigator.msSaveBlob(blob, name + ".jpg");
    } else if (that.myBrowser() === "FF") {
        window.location.href = url;
    } else {
        const name = `${name}.jpg`;
        downloadByA(name, URL.createObjectURL(blob))
    }
});

function downloadByA(filename, href) {
    const a = document.createElement('a')
    a.download = filename
    a.style.display = 'none'
    a.href = href
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(href)
}