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
		
		this.currentNode = {
			index : -1,
			isNode : true
		}
		
        this.curX = -1;
        this.curY = -1;
    }
    
    Zombie.prototype.addTo = function (scene) {
        scene.add(this.model);
    }
    
    Zombie.prototype.isHeroNearBy = function(hero)
	{
		var pos = hero.getPos();
		var interval = parseInt(Math.sqrt(Math.pow(pos.x - this.curX, 2) + Math.pow(pos.y - this.curY, 2)));
        return interval < ZOMBIE_FEEL_RANGE;
	}
    
    Zombie.prototype.setPosition = function (x, y, index) {
        this.curX = x;
        this.curY = y;
        this.currentNode.index = index;
    }
    
    Zombie.prototype.getCurX = function () {
        return this.curX;
    }
    Zombie.prototype.getCurY =function () {
        return this.curY;
    }
    Zombie.prototype.getCurNodeIndex = function () {
        return this.curNodeIndex;
    }
   
   	Zombie.prototype.move = function(dt, hero)
	{
		if(this.isHeroNearBy())
		{
			//TODO : 
			// 1. zombie chase hero.
			// 2. reset waypoint
			// 3. hero 위치로 waypoint 설정
		}
		else if(this.wayPoint.length == 0)
		{
			var spaceArr = this.map.spaceManager.getNextSpace(this.currentNode.index, this.currentNode.isNode);	
			var isNode = spaceArr[3] >=3 ? true : false;
			var connectionPoint = this.map.spaceManager.getConnectionPoint(this.currentNode.index, spaceArr[2], this.currentNode.isNode, isNode);
			//way point 갱신
			this.wayPoint.push({
				x : connectionPoint.x,
				y : connectionPoint.y,
				index : spaceArr[2],
				isNode : isNode
			});
			this.wayPoint.push({
				x : spaceArr[0],
				y : spaceArr[1],
				index : spaceArr[2],
				isNode : isNode
			});
		}
		//이동
	}
    
    Zombie.prototype.update = function (dt, hero) {
		var pos = hero.getPos();
      
        //move update
		this.move(dt, hero);
		
		//나중에 뺄것같음
		this.model.position.x = this.curX;
		this.model.position.z = this.curY;
    }
    
    //벽 충돌
	
	//좀비 공격
	
	//좀비 ai
    
    global.Zombie = Zombie;
})(this);