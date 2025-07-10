function shuffle(array) {
    // 从数组最后一位开始遍历
    for (let i = array.length - 1; i > 0; i--) {
        // 在 0 ~ 1之间，随机取一个位置
        const j = Math.floor(Math.random() * (i + 1));
        // 交换当前元素和随机位置的元素
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}