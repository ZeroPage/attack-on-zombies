(function(global){
    
    var ZOMBIE_FEEL_RANGE = 150;
    
    function Zombie(map) {
                
        var resourceManager = new ResourceManager();
        
        this.model = resourceManager.getModel("Zombie");
		this.model.castShadow = true;
		this.model.receiveShadow = true;
		this.model.position.y = 0;
        
        this.map = map;
        
        this.hp = 100;
        this.speed = 7;
        
        this.wayPoint = []; // element is point
		
		this.animation = new THREE.Animation(
    		this.model,
    		'ZombieArmatureAction',
    		THREE.AnimationHandler.CATMULLROM
  		);
		//XXX To test
		this.animation.play();
        
        //now position info
		
		this.currentNode = -1;
		
        this.curX = -1;
        this.curY = -1;
		
		this.isMoving = false;

		this.delta = new THREE.Vector2();
    }
    
    Zombie.prototype.addTo = function (scene) {
        scene.add(this.model);
    }
    
    Zombie.prototype.isHeroNearBy = function(hero)
	{
		var pos = hero.getPos();
		var interval = Math.sqrt(Math.pow(pos.x - this.curX, 2) + Math.pow(pos.y - this.curY, 2));
        return interval < ZOMBIE_FEEL_RANGE;
	}
    
    Zombie.prototype.setPosition = function (x, y, index) {
        this.curX = x;
        this.curY = y;
        this.currentNode = index;
    }
	
	Zombie.prototype.setPos = function (x, y) {
		this.curX = x;
		this.curY = y;
	}
    Zombie.prototype.getPos = function () {
		return new Point(this.curX, this.curY);
	}
    
    Zombie.prototype.getCurX = function () {
        return this.curX;
    }
    Zombie.prototype.getCurY =function () {
        return this.curY;
    }
    Zombie.prototype.getCurNodeIndex = function () {
        return this.currentNode;
    }
   
   	Zombie.prototype.move = function(dt, hero)
	{
		if(this.isHeroNearBy(hero))
		{
			var pos = hero.getPos();
			
			// 1. reset waypoint
			this.wayPoint = [];
			// 2. hero 위치로 waypoint 설정
			var spaceList = this.map.spaceManager.getPath(this.currentNode, pos);
			
			if( !spaceList) return true;
			if( spaceList.length == 0){
				this.wayPoint.push({
					x : pos.x,
					y : pos.y,
					index : this.currentNode
				});
				
			} else {
				var from = this.currentNode;
				var to = spaceList[0];
				var connectionPoint = this.map.spaceManager.getConnectionPoint(from, to);
				this.wayPoint.push({
					x : connectionPoint.x,
					y : connectionPoint.y,
					index : to
				});
			
				for(var i = 0; i < spaceList.length - 1; i++){
					
					from = spaceList[i];
					to = spaceList[i+1];
					var connectionPoint = this.map.spaceManager.getConnectionPoint(from, to);
					this.wayPoint.push({
						x : connectionPoint.x,
						y : connectionPoint.y,
						index : to
					});
				}
				this.wayPoint.push({
					x : pos.x,
					y : pos.y,
					index : to
				});
			}
		}
		else if(this.wayPoint.length == 0)
		{
			var spaceArr = this.map.spaceManager.getNextSpace(this.currentNode);
			var connectionPoint = this.map.spaceManager.getConnectionPoint(this.currentNode, spaceArr[2]);
			//way point 갱신
			this.wayPoint.push({
				x : connectionPoint.x,
				y : connectionPoint.y,
				index : spaceArr[2]
			});
			this.wayPoint.push({
				x : spaceArr[0] + 5 * Math.random(),
				y : spaceArr[1] + 5 * Math.random(),
				index : spaceArr[2]
			});
		} 
		//이동
		if(this.wayPoint.length == 0) { throw "not the hell"}
		
		
		this.delta.x = this.wayPoint[0].x - this.curX;
		this.delta.y = this.wayPoint[0].y - this.curY;
		
		this.delta.normalize();
		
		this.curX += this.delta.x * this.speed * dt;
		this.curY += this.delta.y * this.speed * dt;
		
		if(this.delta.x * (this.wayPoint[0].x - this.curX) < 0){
			//지나감
			var node = this.wayPoint.shift();
			//this.curX = node.x;
			//this.curY = node.y;
			this.currentNode = node.index;
		} 
		this.isMoving = true;
		return true;
	}
    
    Zombie.prototype.update = function (dt, hero, zombie) {
		var pos = hero.getPos();
						
        //move update
		this.move(dt, hero);
		this.collisionHero(dt, hero);
		this.collisionZombie(dt, zombie);
		
		this.model.position.x = this.curX;
		this.model.position.z = this.curY;
		
		var dx = hero.model.position.x - this.model.position.x;
		var dz = hero.model.position.z - this.model.position.z;

		this.model.rotation.y = Math.atan(dx/dz);
		if(dz < 0){
			this.model.rotation.y += Math.PI;
		}
		
		if(this.isMoving)
			this.animation.update(dt);
		this.isMoving = false;
    }
	
	Zombie.prototype.collisionHero = function (dt, hero) {
		var pos = hero.getPos();
		var interval = parseInt(Math.sqrt(Math.pow(pos.x - this.curX, 2) + Math.pow(pos.y - this.curY, 2)));
		if(interval < 5) {
			hero.attackByMonster(1);
			//좀비 때리는 애니메이션(있다면)
			//뒤로 살짝 뺀다.
			this.curX = this.curX - (this.delta.x * this.speed * dt);
			this.curY = this.curY - (this.delta.y * this.speed * dt);
		}
	}
	
	Zombie.prototype.collisionZombie = function (dt, zombie) {
		for(var i=0; i<zombie.length; i++) {
			var other = zombie[i].getPos();
			var interval = parseInt(Math.sqrt(Math.pow(other.x - this.curX, 2) + Math.pow(other.y - this.curY, 2)));
			if(interval < 4) {
				var direction_To = new THREE.Vector2();
				direction_To.x = other.x - this.curX;
				direction_To.y = other.y - this.curY;
				direction_To.normalize();
			
				//zombie[i].setPos(other.x + (direction_To.x * dt * this.speed), other.y + (direction_To.y * dt * this.speed));
				this.curX = this.curX - (direction_To.x * dt * this.speed);
				this.curY = this.curY - (direction_To.y * dt * this.speed);
			}
		}
	}
	
	Zombie.prototype.collisionWall = function (dt) {
		
	}
	
	//좀비와 좀비 충돌
	//좀비와 히어로 충돌
	//좀비와 벽충돌
	//좀비와 총알 충돌
	
    global.Zombie = Zombie;
})(this);