(function (global){
	function Hero(camera, map){
		var resourceManager = new ResourceManager();
		
		this.pos = new Point(0,0);
		this.map = map;

		this.flashLight = new THREE.SpotLight();
		this.flashLight.castShadow = true;
		this.flashLight.shadowDarkness = 0.9;
		this.flashLight.shadowCameraNear = 1;
		this.flashLight.shadowCameraFov = 90;
		this.flashLight.position.y = 5;
		this.flashLight.angle = (45/180) * Math.PI;
		this.flashLight.distance = 130;

		this.torch = new THREE.PointLight(0x00ff00, 0.8, 20);
		this.torch.position.y = 15;
		
		this.modelLight = new THREE.SpotLight(0xffafff, 1, 120);
		this.modelLight.position.y = 20;
	
		//this.modelLight = new THREE.PointLight(0xffafff, 1, 15);
		//this.modelLight.position.y = 15;

		this.model = resourceManager.getModel("Hero");
		this.model.position.y = 0;
		
		this.animation = new THREE.Animation(
    		this.model,
    		'PlayerArmatureAction',
    		THREE.AnimationHandler.CATMULLROM
  		);
		//XXX To test
		this.animation.play();
        
		this.camera = camera;
		this.stat = {};
		this.stat.speed = 50;
		
		this.gun = new Gun();
		this.gun.refill(100);
		this.gun.reload();
		
		this.isMoveing = false;
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
		this.modelLight.position.z = this.pos.y + 20;
		this.modelLight.target.position.x = this.pos.x;
		this.modelLight.target.position.z = this.pos.y;
		
		//TODO target must move whe player move
		//this.flashLight.target.position.x = this.pos.x;
		//this.flashLight.target.position.z = this.pos.y;
		if(this.isMoveing)
			this.animation.update(dt * this.stat.speed/10);
		this.isMoveing = false;
	}
	Hero.prototype.up = function(dt){
		var wallPos = this.checkWall(dt, {x : 0, y : -1});
		if(!wallPos){
			this.pos.y -= dt * this.stat.speed;
		} else {
			this.pos.y = (wallPos.y+1) * 10 + 1;
		}
		
		this.isMoveing = true;
	}
	Hero.prototype.down = function(dt){
		var wallPos = this.checkWall(dt, {x : 0, y : 1});
		if(!wallPos){
			this.pos.y += dt * this.stat.speed;
		} else {
			this.pos.y = (wallPos.y) * 10 - 1;
		}
		
		this.isMoveing = true;
	}
	Hero.prototype.left = function(dt){
		var wallPos = this.checkWall(dt, {x : -1, y : 0});
		if(!wallPos){
			this.pos.x -= dt * this.stat.speed;
		} else {
			this.pos.x = (wallPos.x + 1) * 10 + 1;
		}
		
		this.isMoveing = true;
	}
	Hero.prototype.right = function(dt){
		var wallPos = this.checkWall(dt, {x : 1, y : 0});
		if(!wallPos){
			this.pos.x += dt * this.stat.speed;
		} else {
			this.pos.x = (wallPos.x) * 10 - 1;
		}
		
		this.isMoveing = true;
	}
	Hero.prototype.checkWall = function(dt, direction){
		var len = dt * this.stat.speed;
		var nextPos = new Point();
		nextPos.x = parseInt((this.pos.x + len * direction.x)/10);
		nextPos.y = parseInt((this.pos.y + len * direction.y)/10);
		
		var currentPos = new Point();
		currentPos.x = parseInt(this.pos.x/10);
		currentPos.y = parseInt(this.pos.y/10);
		
		while(true){
			if(direction.x > 0 || direction.y > 0){
				if(currentPos.x > nextPos.x || currentPos.y > nextPos.y){
					break;
				}
			} else if (direction.x < 0 || direction.y < 0){
				if(currentPos.x < nextPos.x || currentPos.y < nextPos.y){
					break;
				}
			}
			
			if(this.map.data[currentPos.x][currentPos.y] == 2){
				return currentPos;
			}
			
			currentPos.x += direction.x;
			currentPos.y += direction.y;
		}
		return;
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
		this.update(0);
	}
	function ModelHandler(){

	}
	global.Hero = Hero;
})(this);
