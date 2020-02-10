const getFirstScreenImageLoadTime = () => {
    // 获取所有的 img dom 节点
    const images = document.getElementsByTagName('img');
    const imageEntries = performance.getEntries().filter(function (entry) {
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