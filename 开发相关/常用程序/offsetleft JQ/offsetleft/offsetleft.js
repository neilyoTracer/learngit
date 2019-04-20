var animate={
	DISTANCE:200,
	DURATION:400,
	$div:null,
	$prevbtn:null,
	$nextbtn:null,
	init(){
		this.$div=$("#square");
		this.$prevbtn=this.$div.parent().prev();
		this.$nextbtn=this.$div.parent().next();
		this.$prevbtn.click(function(){
			var offsetLeft=parseFloat(this.$div.css("left"));
			if(offsetLeft<0)
				this.move(1);
		}.bind(this));
		this.$nextbtn.click(function(){
			var offsetLeft=parseFloat(this.$div.css("left"));
			if(offsetLeft>-600)
				this.move(-1);
		}.bind(this));
	},
	move(dir){
		var offsetLeft=parseFloat(this.$div.css("left"));
		if(!this.$div.is(":animated")){
			this.$div.animate({left:dir*this.DISTANCE+offsetLeft},
			this.DURATION,function(){
				offsetLeft=parseFloat(this.$div.css("left"));
				if(offsetLeft==-600) this.$nextbtn.addClass("disabled");
				else if(offsetLeft==0) this.$prevbtn.addClass("disabled");
				else{ 
					this.$prevbtn.removeClass("disabled");
					this.$nextbtn.removeClass("disabled");
				}
			}.bind(this));
		}
	},
}
animate.init();

