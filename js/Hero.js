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
		this.flashLight.distance = 130;

		this.torch = new THREE.PointLight(0x00ff00, 0.5, 20);
		this.torch.position.y = 10;
	
		this.modelLight = new THREE.PointLight(0xffafff, 1, 10);
		this.modelLight.position.y = 10;

		this.model = resourceManager.getModel("Hero");
		this.model.castShadow = true;
		this.model.receiveShadow = true;
		this.model.position.y = 3;
		
		this.animation = new THREE.Animation(
    		this.model,
    		'PlayerArmatureAction',
    		THREE.AnimationHandler.CATMULLROM
  		);
		//XXX To test
		this.animation.play();
        
		this.camera = camera;
		this.stat = {};
		this.stat.speed = 100;
		
		this.gun = new Gun();
		this.gun.refill(100);
		this.gun.reload();
	}
	Hero.prototype.addTo = function(scene){
		scene.add(this.flashLight);
		scene.add(this.torch);
		scene.add(this.modelLight);
		scene.add(this.model);
	}
	Hero.prototype.move = function(dt){
		this.animation.update(dt * 100);
	}
	Hero.prototype.up = function(dt){
		this.model.position.z -= dt * this.stat.speed;
		this.flashLight.position.z -= dt * this.stat.speed;
		this.camera.position.z -= dt * this.stat.speed;
		this.torch.position.z -= dt * this.stat.speed;
		this.modelLight.position.z -= dt * this.stat.speed;
		this.flashLight.target.position.z -= dt * this.stat.speed;
		this.move(dt);
	}
	Hero.prototype.down = function(dt){
		this.model.position.z += dt * this.stat.speed;
		this.flashLight.position.z += dt * this.stat.speed;
		this.camera.position.z += dt * this.stat.speed;
		this.torch.position.z += dt * this.stat.speed;
		this.modelLight.position.z += dt * this.stat.speed;
		this.flashLight.target.position.z += dt * this.stat.speed;
		this.move(dt);
	}
	Hero.prototype.left = function(dt){
		this.model.position.x -= dt * this.stat.speed;
		this.flashLight.position.x -= dt * this.stat.speed;
		this.camera.position.x -= dt * this.stat.speed;
		this.torch.position.x -= dt * this.stat.speed;
		this.modelLight.position.x -= dt * this.stat.speed;
		this.flashLight.target.position.x -= dt * this.stat.speed;
		this.move(dt);
	}
	Hero.prototype.right = function(dt){
		this.model.position.x += dt * this.stat.speed;
		this.flashLight.position.x += dt * this.stat.speed;
		this.camera.position.x += dt * this.stat.speed;
		this.torch.position.x += dt * this.stat.speed;
		this.modelLight.position.x += dt * this.stat.speed;
		this.flashLight.target.position.x += dt * this.stat.speed;
		this.move(dt);
	}
	Hero.prototype.aimTo = function(vec){
		this.flashLight.target.position.x = vec.x
		this.flashLight.target.position.y = vec.y
		this.flashLight.target.position.z = vec.z
		
		var dx = vec.x - this.model.position.x;
		var dz = vec.z - this.model.position.z;

		this.model.rotation.y = Math.atan(dx/dz);
		if(dz < 0){
			this.model.rotation.y += Math.PI;
		}
	}
	Hero.prototype.getPos = function(){
		return new Point(this.model.position.x, this.model.position.z);
	}
	Hero.prototype.setPosition = function(pos){
		this.model.position.x += pos.x * 10 + 5;
		this.model.position.z += pos.y * 10 + 5;
		this.flashLight.position.x += pos.x * 10 + 5;
		this.flashLight.position.z += pos.y * 10 + 5;
		this.camera.position.x += pos.x * 10 + 5;
		this.camera.position.z += pos.y * 10 + 5;
		this.torch.position.x += pos.x * 10 + 5;
		this.torch.position.z += pos.y * 10 + 5;
		this.modelLight.position.x += pos.x * 10 + 5;
		this.modelLight.position.z += pos.y * 10 + 5;
		this.flashLight.target.position.x += pos.x * 10 + 5;
		this.flashLight.target.position.z += pos.y * 10 + 5;
	}
	global.Hero = Hero;
})(this);
