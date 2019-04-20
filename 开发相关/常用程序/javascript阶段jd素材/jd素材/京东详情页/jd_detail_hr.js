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
	$mask:null,//保存半透明zezao
	MSIZE:175,//保存msk的大小
	SMSIZE:350,//保存smsk的大小
	MAX:0,//保存mask可用的最大top和left
	$lg:null,//保存largeDiv
	init(){
		this.MAX=this.SMSIZE-this.MSIZE;
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
		this.$ul.on("mouseover","li>img",function(){
			var src=$(this).attr("src");
			var i=src.lastIndexOf(".");
			src=src.slice(0,i)+"-m"+src.slice(i);
			$("#mImg").attr("src",src);
		});
		this.$mask=$("#mask");
		this.$lg=$("#largeDiv");
		$("#superMask")
		.hover(function(){
			this.$mask.toggle();
			this.$lg.toggle();
			var src=$("#mImg").attr("src");
			var i=src.lastIndexOf(".");
			src=src.slice(0,i-1)+"l"+src.slice(i);
			this.$lg.css("backgroundImage","url("+src+")");
		}.bind(this))
		.mousemove(function(e){
			var x=e.offsetX,y=e.offsetY;
			var top=y-this.MSIZE/2,
				left=x-this.MSIZE/2;
			//如果top<0,就改回0
			if(top<0) top=0;
			else if(top>this.MAX) top=this.MAX;
			if(left<0) left=0;
			else if(left>this.MAX) left=this.MAX;
			this.$mask.css({
				top,left	//"top":top,"left":left
			});
			this.$lg.css("backgroundPosition",`${-16/7*left}px ${-16/7*top}px`);
		}.bind(this));
	},
	checkA(){
		if(this.moved==0)
			$("[class^='backward']").attr("class","backward_disabled");
		else if(this.$ul.children().size()-this.moved==5)
			$("[class^='forward']").attr("class","forward_disabled");
		else{
			$("[class^='backward']").attr("class","backward");
			$("[class^='forward']").attr("class","forward");
		}
	}
}
preview.init();
