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
        this.speed = 10;
        
        this.wayPoint = []; // element is point
        
        //now position info
		
		this.currentNode = -1;
		
        this.curX = -1;
        this.curY = -1;
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
			
			if( !spaceList) return;
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
				x : spaceArr[0],
				y : spaceArr[1],
				index : spaceArr[2]
			});
		} 
		//이동
		if(this.wayPoint.length == 0) { throw "not the hell"}
		
		var delta = new THREE.Vector2();
		delta.x = this.wayPoint[0].x - this.curX;
		delta.y = this.wayPoint[0].y - this.curY;
		
		delta.normalize();
		
		this.curX += delta.x * this.speed * dt;
		this.curY += delta.y * this.speed * dt;
		
		if(delta.x * (this.wayPoint[0].x - this.curX) < 0){
			//지나감
			var node = this.wayPoint.shift();
			this.curX = node.x;
			this.curY = node.y;
			this.currentNode = node.index;
		} 
	}
    
    Zombie.prototype.update = function (dt, hero) {
		var pos = hero.getPos();
      
        //move update
		this.move(dt, hero);
		
		//나중에 뺄것같음
		this.model.position.x = this.curX;
		this.model.position.z = this.curY;
    }
    global.Zombie = Zombie;
})(this);