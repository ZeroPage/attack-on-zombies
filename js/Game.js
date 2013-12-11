
function Game(width, height){
	var that = this;
	
	this.camera = new THREE.PerspectiveCamera(30, width/height, 1, 10000);
	
	this.camera.position.z = 100;
	this.camera.position.y = 100;
	
	this.camera.rotation.x = -(45/ 180) * Math.PI;

	this.scene = new THREE.Scene();

	var loader = new THREE.JSONLoader();
	
	this.map = new Map();
	this.map.addMeshTo(this.scene);
	
	that.hero = new Hero(that.camera, this.map);
	that.hero.addTo(that.scene);
	that.hero.setPosition(that.map.getHeroXY());
	
	window.game = this;

	
	//temporary setting in zombie create - need to combine stage class or do something.
	this.zombie = new Array();
	for(var i = 0; i < 50 ; i++) {
		that.zombie.push(new Zombie(that.map));
		that.zombie[i].addTo(that.scene);
		var zombiePos = that.map.getMonsterPos();
		that.zombie[i].setPosition(zombiePos[0], zombiePos[1], zombiePos[2]); // x, y, index
	}


	if (Game.testWebGL()) {
		this.renderer = new THREE.WebGLRenderer();
		console.log("WebGL mode!");
	} else {
		this.renderer = new THREE.CanvasRenderer();
		console.log("Canvas model!");
	}
	this.renderer.setSize(width, height);

	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapSoft = true;

	document.body.appendChild(this.renderer.domElement);
	
	var projector = new THREE.Projector();

	this.renderer.domElement.addEventListener("mousemove", function(e){
		var x = e.x || e.clientX;
		var y = e.y || e.clientY;
		var min = mousePos(x, y);
		if(min){
			that.hero.aimTo(min.point);
		}
	});

	this.keyBinder = new KeyBinder(document.body);	
	this.walkSound = new SoundEffect("Walk");

	this.keyBinder.bindKey("A", function(dt){
		that.hero.left(dt);
		that.walkSound.play();
	}, true); 
	this.keyBinder.bindKey("D", function(dt){
		that.hero.right(dt);
		that.walkSound.play();
	}, true);
	this.keyBinder.bindKey("W", function(dt){
		that.hero.up(dt);
		that.walkSound.play();
	}, true);
	this.keyBinder.bindKey("S", function(dt){
		that.hero.down(dt);
		that.walkSound.play();
	}, true);

	var $itemWindow = new Window("item");
	this.keyBinder.bindKey("I", function (dt) {
		$itemWindow.toggle();
	}, false);

	var $statWindow = new Window("stats");
	this.keyBinder.bindKey("P", function (dt) {
		$statWindow.toggle();
	}, false);
	
	this.bulletSound = new SoundEffect("Bullet");
	
	this.keyBinder.bindKey("LBUTTON", function(dt, pos){
		var min = mousePos(pos.x, pos.y);
		if(min){
			that.bullets.push(new Bullet(that.hero.model.position, min.point, that.scene, dt));
		}
		that.bulletSound.play();
		
	}, true);
	that.bullets = [];
		
	this.clock = new THREE.Clock(true);
	requestAnimationFrame(function () { that.loop() });

	this.bgm = new SoundEffect("Background", false);	
	//this.bgm.play();
	
	function mousePos(x, y){
		var vec = new THREE.Vector3(
			(x/width) * 2 - 1,
			-(y/height) * 2 + 1,
			0
		);
		
		var raycaster = projector.pickingRay(vec, that.camera);
		var arr = raycaster.intersectObjects(that.map.objList);
		
		var min = arr[0];
		for(var i = 0; i < arr.length; i++){
			if(min.distance > arr[i].distance){
				min = arr[i];
			}
		}
		return min;
	}
}

Game.prototype.loop = function(){
	var that = this;
	var dt = this.clock.getDelta();

	this.keyBinder.check(dt);
	this.move(dt);
	
	//temporary setting in zombie AI - need to combine stage class or do something.
	
	
	this.zombie.forEach(function(elem){
		elem.update(dt, that.hero, that.zombie);
	});
	
	
	if(!this.bgm.isPlay){
		//this.bgm.play();
		this.bgm.loop = true;
	}

	for(var k = 0; k < this.bullets.length ;k++) {
		for(var i = 0 ; i < this.zombie.length ; i++) {
			if(that.bullets[k].hitZombie(this.zombie[i].curX, this.zombie[i].curY, dt)) {
				this.scene.remove(this.zombie[i].model);
				this.scene.remove(this.zombie[i]);
			}
		}
	}
	
	if(this.hero)
		this.render(dt);

	var that = this;
	requestAnimationFrame(function(){that.loop()});
}
Game.prototype.render = function(dt){
	this.hero.update(dt);
	this.renderer.render(this.scene, this.camera);
}
Game.prototype.move = function (dt) {
	var that = this;
	if(!this.hero)
		return;

	this.bullets = this.bullets.filter(function(item){
		return item.move(dt);
	});
	
	this.zombie = this.zombie.filter(function(elem){
		return elem.move(dt, that.hero);
	});
	
    if (this.hero.getPos().x < 1) { this.hero.right(dt); }
    else if (this.hero.getPos().y < 1) { this.hero.down(dt); }
    else if (this.hero.getPos().x > this.map.width * 10 - 1) { this.hero.left(dt); }
    else if (this.hero.getPos().y > this.map.height * 10 - 1) { this.hero.up(dt); }
}
Game.testWebGL = function(){
	var canvas = document.createElement("canvas");
	return !!window.WebGLRenderingContext && !!(canvas.getContext("webgl") || canvas.getContext("moz-webgl"));
}
