var animate={
	DISTANCE:200,
	DURATION:400,
	STEPS:80,
	step:0,
	interval:0,
	div:null,
	timer:null,
	moved:0,
	prevbtn:null,
	nextbtn:null,
	init(){
		this.div=document.getElementById("square");
		this.prevbtn=this.div.parentNode.previousElementSibling;
		this.nextbtn=this.div.parentNode.nextElementSibling;
		this.step=this.DISTANCE/this.STEPS;
		this.interval=this.DURATION/this.STEPS;
		this.prevbtn.onclick=function(){
			var offsetLeft=parseFloat(getComputedStyle(this.div).left);
			if(offsetLeft<0)
				this.move(1);
		}.bind(this);
		this.nextbtn.onclick=function(){
			var offsetLeft=parseFloat(getComputedStyle(this.div).left);
			if(offsetLeft>-600)
				this.move(-1);
		}.bind(this);
	},
	move(dir){
		if(this.timer==null)
			this.timer=setInterval(this.moveStep.bind(this,dir)
			,this.interval);
	},
	moveStep(dir){
		var offsetLeft=parseFloat(getComputedStyle(this.div).left);
		this.div.style.left=offsetLeft+dir*this.step+"px";
		var newlt=parseFloat(getComputedStyle(this.div).left);
		this.moved++;
		if(this.moved==this.STEPS){
			clearInterval(this.timer);
			this.timer=null;
			this.moved=0;
			this.prevbtn.className=newlt==0?"disabled":"";
			this.nextbtn.className=newlt==-600?"disabled":"";
		}
	},
}
animate.init();

