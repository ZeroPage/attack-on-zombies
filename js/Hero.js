(function (global){
	function Hero(camera){
		var resourceManager = new ResourceManager();

		this.flashLight = new THREE.SpotLight();
		this.flashLight.castShadow = true;
		this.flashLight.shadowDarkness = 0.5;
		this.model = resourceManager.getModel("Hero");
		this.model.castShadow = true;
		this.model.receiveShadow = true;
		this.model.position.y = 3;

		this.camera = camera;
		this.stat = {};
		this.stat.speed = 100;
	}
	Hero.prototype.addTo = function(scene){
		scene.add(this.flashLight);
		scene.add(this.model);
	}
	Hero.prototype.up = function(dt){
		this.model.position.z -= dt * this.stat.speed;
		this.flashLight.position.z -= dt * this.stat.speed;
		this.camera.position.z -= dt * this.stat.speed;
	}
	Hero.prototype.down = function(dt){
		this.model.position.z += dt * this.stat.speed;
		this.flashLight.position.z += dt * this.stat.speed;
		this.camera.position.z += dt * this.stat.speed;
	}
	Hero.prototype.left = function(dt){
		this.model.position.x -= dt * this.stat.speed;
		this.flashLight.position.x -= dt * this.stat.speed;
		this.camera.position.x -= dt * this.stat.speed;
	}
	Hero.prototype.right = function(dt){
		this.model.position.x += dt * this.stat.speed;
		this.flashLight.position.x += dt * this.stat.speed;
		this.camera.position.x += dt * this.stat.speed;
	}
	global.Hero = Hero;
})(this)
