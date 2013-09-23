(function (global){
	function Hero(camera){
		var resourceManager = new ResourceManager();

		this.flashLight = new THREE.SpotLight();
		this.flashLight.castShadow = true;
		this.flashLight.shadowDarkness = 0.9;
		this.flashLight.shadowCameraNear = 1;
		this.flashLight.position.y = 3;

		this.torch = new THREE.PointLight();
		this.torch.position.y = 10;
		this.torch.intensity = 0.3;
		this.torch.distance = 20;

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
		scene.add(this.torch);
		scene.add(this.model);

	}
	Hero.prototype.up = function(dt){
		this.model.position.z -= dt * this.stat.speed;
		this.flashLight.position.z -= dt * this.stat.speed;
		this.camera.position.z -= dt * this.stat.speed;
		this.torch.position.z -= dt * this.stat.speed;
	}
	Hero.prototype.down = function(dt){
		this.model.position.z += dt * this.stat.speed;
		this.flashLight.position.z += dt * this.stat.speed;
		this.camera.position.z += dt * this.stat.speed;
		this.torch.position.z += dt * this.stat.speed;
	}
	Hero.prototype.left = function(dt){
		this.model.position.x -= dt * this.stat.speed;
		this.flashLight.position.x -= dt * this.stat.speed;
		this.camera.position.x -= dt * this.stat.speed;
		this.torch.position.x -= dt * this.stat.speed;
	}
	Hero.prototype.right = function(dt){
		this.model.position.x += dt * this.stat.speed;
		this.flashLight.position.x += dt * this.stat.speed;
		this.camera.position.x += dt * this.stat.speed;
		this.torch.position.x += dt * this.stat.speed;
	}
	Hero.prototype.aimTo = function(x, y){
		this.flashLight.target.position.x = x;
		this.flashLight.target.position.z = y;
	}
	global.Hero = Hero;
})(this);
