// 图片懒加载
/**
 * <img src="./loading-url.png" data-src="./url.png" alt="">
 */

const imgList = [...document.querySelectorAll('img')];
const io = new IntersectionObserver(entries => { 
    entries.forEach(item => { 
        // isIntersecting 是一个Boolean值， 判断目标元素是否进入了root视窗
        if(item.isIntersecting) {
            item.target.src = item.target.dataset.src;
            // 图片加载后停止监听该元素
            io.unobserve(item.target);
        }
    });
});

// observe 监听所有img节点
imgList.forEach(img => io.observe(img));