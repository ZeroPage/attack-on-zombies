(function(global){
	function Gun(){
		this.clip = 0;
		this.bulletNum = 0;
		this.bulletType = "9mm";
		this.redraw();
	}
	Gun.prototype.shoot = function(){
		if(this.bulletNum > 0){
			this.bulletNum--;
		}
	}
	Gun.prototype.reload = function(){
		var clipMax = 7;
		this.bulletNum -= clipMax;
		if(this.bulletNum < 0) this.bulletNum = 0;
		this.clip = clipMax;
		this.redraw();
	}
	Gun.prototype.refill = function(num){
		this.bulletNum += parseInt(num);
		this.redraw();
	}
	var $bullet = document.getElementById("bullet");
	var $bulletNum = document.getElementsByTagName("span");
	var $bulletType = $bullet.getElementsByTagName("figcaption")[0];
	Gun.prototype.redraw = function(){
		$bulletType.innerHTML = this.bulletType;
		$bulletNum[1].innerHTML = this.bulletNum;
		$bulletNum[0].innerHTML = this.clip;
	}
	global.Gun = Gun;
})(this);
