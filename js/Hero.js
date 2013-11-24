(function (global){
	function Hero(camera){
		var resourceManager = new ResourceManager();
		
		this.pos = new Point(0,0);

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
	Hero.prototype.update = function(dt){
		this.model.position.x = this.pos.x;
		this.model.position.z = this.pos.y;
		this.flashLight.position.x = this.pos.x;
		this.flashLight.position.z = this.pos.y;
		this.camera.position.x = this.pos.x;
		this.camera.position.z = 100 + this.pos.y;
		this.torch.position.x = this.pos.x;
		this.torch.position.z = this.pos.y;
		this.modelLight.position.x = this.pos.x;
		this.modelLight.position.z = this.pos.y;
		this.flashLight.target.position.x = this.pos.x;
		this.flashLight.target.position.z = this.pos.y;
		
		this.animation.update(dt * 100);
	}
	Hero.prototype.up = function(dt){
		var curx = parseInt(this.pos.x / 10);
		var cury = parseInt(this.pos.y / 10);
		
		var futx = parseInt(this.pos.x / 10);
		var futy = parseInt((this.pos.y - dt * this.stat.speed) / 10);
		this.pos.y -= dt * this.stat.speed;
		this.update(dt);
	}
	Hero.prototype.down = function(dt){
		this.pos.y += dt * this.stat.speed;
		this.update(dt);
	}
	Hero.prototype.left = function(dt){
		this.pos.x -= dt * this.stat.speed;
		this.update(dt);
	}
	Hero.prototype.right = function(dt){
		this.pos.x += dt * this.stat.speed;
		this.update(dt);
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
		return this.pos;
	}
	Hero.prototype.setPosition = function(pos){
		this.pos = new Point(pos.x * 10 +5, pos.y * 10 + 5);
		this.update(0)
	}
	function ModelHandler(){
		
	}
	global.Hero = Hero;
})(this);
