
function Game(width, height){
	var that = this;
	
	this.camera = new THREE.PerspectiveCamera(30, width/height, 1, 10000);
	
	this.camera.position.z = 100;
	this.camera.position.y = 100;
	
	this.camera.rotation.x = - (45/ 180) * Math.PI ;

	this.scene = new THREE.Scene();

	var loader = new THREE.JSONLoader();
	
	loader.load("/models/editable-person.js", function(geo) {
		var mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({color : 0xffffff, wireframe: false}));
		mesh.scale.set( 1, 1, 1);

		mesh.position.y = 3;
		mesh.position.x = 0;

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		that.char = mesh;

		that.scene.add(mesh);
	});
	var resourceManager = new ResourceManager();
	resourceManager.load({Hero : "models/editable-person.js"});
	
	this.map = new Map();
	this.map.addMeshTo(this.scene);
	
	var pointLight = new THREE.PointLight(0xafafaf);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	//add to the scene
	//this.scene.add(pointLight);

	var pointLight2 = new THREE.PointLight(0xffffff);
	pointLight2.position.x = 20;
	pointLight2.position.y = 20;
	pointLight2.position.z = 20;

	//this.scene.add(pointLight2);

	addSunlight(this.scene);

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

	this.keyBinder = new KeyBinder(document.body);
	this.keyBinder.bindKey("LEFT", function(dt){
		that.char.position.x -= dt;
	}, true);
	this.keyBinder.bindKey("RIGHT", function(dt){
		that.char.position.x += dt;
	}, true);
	this.keyBinder.bindKey("UP", function(dt){
		that.char.position.y += dt;
	}, true);
	this.keyBinder.bindKey("DOWN", function(dt){
		that.char.position.y -= dt;
	}, true);
	this.keyBinder.bindKey("A", function(dt){
		that.camera.position.x -= dt * 100;
		that.char.position.x -= dt * 100;
	}, true); 
	this.keyBinder.bindKey("D", function(dt){
		that.camera.position.x += dt * 100;
		that.char.position.x += dt * 100;
	}, true);
	this.keyBinder.bindKey("W", function(dt){
		that.camera.position.z -= dt * 100;
		that.char.position.z -= dt * 100;
	}, true);
	this.keyBinder.bindKey("S", function(dt){
		that.camera.position.z += dt * 100;
		that.char.position.z += dt * 100;
	}, true);
	
	this.clock = new THREE.Clock(true);
	this.loop();
}
Game.prototype.loop = function(){
	var dt = this.clock.getDelta();

	this.keyBinder.check(dt);
	this.move(dt);
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
function addSunlight(scene) {
	var sunlight = new THREE.SpotLight();
	sunlight.position.set(100,100, 100);
	sunlight.castShadow = true;
	sunlight.shadowDarkness = 0.5;
	//sunlight.shadowCameraVisible = true;
	
	scene.add(sunlight);
}
