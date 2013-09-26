
function Game(width, height){
	var that = this;
	
	this.camera = new THREE.PerspectiveCamera(30, width/height, 1, 10000);
	
	this.camera.position.z = 100;
	this.camera.position.y = 100;
	
	this.camera.rotation.x = - (45/ 180) * Math.PI ;

	this.scene = new THREE.Scene();

	var loader = new THREE.JSONLoader();
		
	var resourceManager = new ResourceManager();
	resourceManager.load({Hero : "models/editable-person.js"}, function(){
		
		that.hero = new Hero(that.camera);
		that.hero.addTo(that.scene);
	});
	
	this.map = new Map();
	this.map.addMeshTo(this.scene);

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

	this.renderer.domElement.addEventListener("mousemove", function(e){
		var x = e.x || e.clientX;
		var y = e.y || e.clientY;
		that.hero.aimTo(x - width/2, y - height/2)
	});

	this.keyBinder = new KeyBinder(document.body);
	
	this.keyBinder.bindKey("A", function(dt){
		that.hero.left(dt);
	}, true); 
	this.keyBinder.bindKey("D", function(dt){
		that.hero.right(dt);
	}, true);
	this.keyBinder.bindKey("W", function(dt){
		that.hero.up(dt);
	}, true);
	this.keyBinder.bindKey("S", function(dt){
		that.hero.down(dt);
	}, true);
	this.keyBinder.bindKey("I", function (dt) {
		var $itemStyle = document.getElementById("item").style;
		//if ($itemStyle.display) delete $itemStyle.display;
		//else $itemStyle.display == "inherit";
		$itemStyle.display = $itemStyle.display == "none" ? "inherit" : "none";
	}, false);
		
	this.clock = new THREE.Clock(true);
	requestAnimationFrame(function () { that.loop() });
}
Game.prototype.loop = function(){
	var dt = this.clock.getDelta();

	this.keyBinder.check(dt);
	this.move(dt);
	if(this.hero)
		this.render(dt);

	var that = this;
	requestAnimationFrame(function(){that.loop()});
}
Game.prototype.render = function(dt){
	this.renderer.render(this.scene, this.camera);
}
Game.prototype.move = function(dt){
}
Game.testWebGL = function(){
	var canvas = document.createElement("canvas");
	return !!window.WebGLRenderingContext && !!(canvas.getContext("webgl") || canvas.getContext("moz-webgl"));
}
