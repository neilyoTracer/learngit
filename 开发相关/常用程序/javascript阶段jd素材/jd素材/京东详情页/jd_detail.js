//顶部下拉菜单
$(".app_jd,.service").hover(function(){
	$(this).children("[id$='_items']").toggle()
		   .prev().toggleClass("hover");
})
//全部商品分类菜单
$("#category").hover(function(){
	$("#cate_box").toggle();
})
//为子菜单添加事件委托，只允许li触发事件
$("#cate_box").on("mouseenter","li",showSub)
              .on("mouseleave","li",showSub)
function showSub(){
	$(this).children(".sub_cate_box").toggle()
		   .prev().toggleClass("hover");
}
//标签切换
$("#product_detail>.main_tabs").on("click","li",function(){
	$(this).addClass("current")
		   .siblings().removeClass("current");
	//内容的切换
	var $divs=$("#product_detail>[id^='product']");
	$divs.removeClass("show")
	if(!$(this).is(":contains('商品评价')")){
		var i=$("#product_detail>.main_tabs>li:not(:contains('商品评价'))").index($(this));
		//alert(i);
		$divs.eq(i).addClass("show");
	}
})

//放大镜
var preview={
	LIWIDTH:62,
	$ul:null,//保存小图标列表的ul
	moved:0,//保存已经左移了的li个数
	init(){
		this.$ul=$("#icon_list");
		$("#preview>h1>a").click(function(e){
			if(!$(e.target).is("[class$='_disabled']")){
				if($(e.target).is(".forward")){
					this.$ul.css("left",
						parseFloat(this.$ul.css("left"))
						-this.LIWIDTH
					);
					this.moved++;
				}else{
					this.$ul.css("left",
						parseFloat(this.$ul.css("left"))
						+this.LIWIDTH
					);
					this.moved--;
				}
				this.checkA();//检查a的状态
			}
		}.bind(this));
	},
	checkA(){
		if(this.moved==0)
			$("[class^='backward']").attr("class","backward_disabled");
		else if(this.$ul.children().size()-this.moved==5)
			$("[class^='forward']").attr("class","forward_disabled");
		else{
			$("[class^='backward']").attr("class","backward");
			$("[class^='forword']").attr("class","forword");
		}
	}
}
preview.init();