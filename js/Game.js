
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
	
	that.hero = new Hero(that.camera);
	that.hero.addTo(that.scene);
	that.hero.setPosition(that.map.getHeroXY());

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
		//TODO clean up
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
		if(min){
			that.hero.aimTo(min.point);
		}
	});

	this.keyBinder = new KeyBinder(document.body);	
	that.walkSound = new SoundEffect("sound/Walk.mp3");
	this.playing = true;
	
	this.keyBinder.bindKey("A", function(dt){
		that.hero.left(dt);
		if(this.playing){
			that.walkSound.play();
		}
		this.playing = !this.playing;
	}, true); 
	this.keyBinder.bindKey("D", function(dt){
		that.hero.right(dt);
		if(this.playing){
			that.walkSound.play();
		}
		this.playing = !this.playing;
	}, true);
	this.keyBinder.bindKey("W", function(dt){
		that.hero.up(dt);
		if(this.playing){
			that.walkSound.play();
		}
		this.playing = !this.playing;
	}, true);
	this.keyBinder.bindKey("S", function(dt){
		that.hero.down(dt);
		if(this.playing){
			that.walkSound.play();
		}
		this.playing = !this.playing;
	}, true);

	var $itemWindow = new Window("item");
	this.keyBinder.bindKey("I", function (dt) {
		$itemWindow.toggle();
	}, false);

	var $statWindow = new Window("stats");
	this.keyBinder.bindKey("P", function (dt) {
		$statWindow.toggle();
	}, false);
		
	this.clock = new THREE.Clock(true);
	requestAnimationFrame(function () { that.loop() });
	
	this.bgm = new SoundEffect("sound/Background.mp3");	
}

Game.prototype.loop = function(){
	var dt = this.clock.getDelta();

	this.keyBinder.check(dt);
	this.move(dt);
	if(!this.bgm.isPlay){
		this.bgm.play();
		this.bgm.loop = true;
	}
	if(this.hero)
		this.render(dt);

	var that = this;
	requestAnimationFrame(function(){that.loop()});
}
Game.prototype.render = function(dt){
	this.renderer.render(this.scene, this.camera);
}
Game.prototype.move = function (dt) {
   // console.log(parseInt(this.hero.getPos().x / 10) + ", " + parseInt(this.hero.getPos().y / 10));
    
	if(!this.hero)
		return;

    if (this.hero.getPos().x < 1) { this.hero.right(dt); }
    else if (this.hero.getPos().y < 1) { this.hero.down(dt); }
    else if (this.hero.getPos().x > this.map.width * 10 - 1) { this.hero.left(dt); }
    else if (this.hero.getPos().y > this.map.height * 10 - 1) { this.hero.up(dt); }
    
    var around = 1;
	var wallSize = 10;
	var wall = 2;
	var x = parseInt(this.hero.getPos().x/10);
	var y = parseInt(this.hero.getPos().y/10);
    var left = parseInt((this.hero.getPos().x-around)/wallSize);
	var right = parseInt((this.hero.getPos().x+around)/wallSize);
	var up = parseInt((this.hero.getPos().y-around)/wallSize);
	var down = parseInt((this.hero.getPos().y+around)/wallSize);
	
	if(this.map.data[x][up] == wall)	this.hero.down(dt);
	if(this.map.data[x][down] == wall)	this.hero.up(dt);
	if(this.map.data[right][y] == wall)	this.hero.left(dt);
	if(this.map.data[left][y] == wall)	this.hero.right(dt);
}
Game.testWebGL = function(){
	var canvas = document.createElement("canvas");
	return !!window.WebGLRenderingContext && !!(canvas.getContext("webgl") || canvas.getContext("moz-webgl"));
}
