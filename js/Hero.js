(function (global){
	function Hero(camera){
		var resourceManager = new ResourceManager();

		this.flashLight = new THREE.SpotLight();
		this.flashLight.castShadow = true;
		this.flashLight.shadowDarkness = 0.9;
		this.flashLight.shadowCameraNear = 1;
		this.flashLight.shadowCameraFov = 90;
		this.flashLight.position.y = 3;
		this.flashLight.angle = (45/180) * Math.PI;
		this.flashLight.distance = 100;

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
		this.flashLight.target.position.z -= dt * this.stat.speed;
	}
	Hero.prototype.down = function(dt){
		this.model.position.z += dt * this.stat.speed;
		this.flashLight.position.z += dt * this.stat.speed;
		this.camera.position.z += dt * this.stat.speed;
		this.torch.position.z += dt * this.stat.speed;
		this.flashLight.target.position.z += dt * this.stat.speed;
	}
	Hero.prototype.left = function(dt){
		this.model.position.x -= dt * this.stat.speed;
		this.flashLight.position.x -= dt * this.stat.speed;
		this.camera.position.x -= dt * this.stat.speed;
		this.torch.position.x -= dt * this.stat.speed;
		this.flashLight.target.position.x -= dt * this.stat.speed;
	}
	Hero.prototype.right = function(dt){
		this.model.position.x += dt * this.stat.speed;
		this.flashLight.position.x += dt * this.stat.speed;
		this.camera.position.x += dt * this.stat.speed;
		this.torch.position.x += dt * this.stat.speed;
		this.flashLight.target.position.x += dt * this.stat.speed;
	}
	Hero.prototype.aimTo = function(vec){
		//TODO optimaize
		//this.flashLight.target.position.x = vec.x
		this.flashLight.target.position.y = vec.y
		this.flashLight.target.position.z = vec.z
		
		var dx = vec.x - this.model.position.x;
		var dz = vec.z - this.model.position.z;

		this.model.rotation.y = -Math.atan(dz/dx) + Math.PI/2;
	}
	Hero.prototype.getPos = function(){
		return new Point(this.model.position.x, this.model.position.z);
	}
	global.Hero = Hero;
})(this);
