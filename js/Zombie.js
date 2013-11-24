(function(global){
    
    function Zombie(map) {
        this.ZOMBIE_FEEL = {
            STAND   :   1,
            MOVE    :   2,
            CHASE   :   3,
            ATTACK  :   4
        };
        
        this.ZOMBIE_FEEL_RANGE = 50;
        
        var resourceManager = new ResourceManager();
        
        this.model = resourceManager.getModel("Zombie");
		this.model.castShadow = true;
		this.model.receiveShadow = true;
		this.model.position.y = 3;
        
        this.map = map;
        
        this.hp = 100;
        this.speed = 10;
        
        //move way to info
        this.isDestinationNode = false;
        this.destinationIndex = -1;
        this.destinationX = -1;
        this.destinationY = -1;
        
        //now position info
        this.curNodeIndex = -1;
        this.curX = -1;
        this.curY = -1;
        
        //prev position info
        this.oldNodeIndex = -1;
        this.oldX = -1;
        this.oldY = -1;
        
        this.isCurNode = true; 
        this.curState = this.ZOMBIE_FEEL.STAND;
    }
    
    Zombie.prototype.addTo = function (scene) {
        scene.add(this.model);
    }
    
    Zombie.prototype.updateState = function (heroX, heroY) {
        var interval = parseInt(Math.sqrt(Math.pow(heroX - this.curX, 2) + Math.pow(heroY - this.curY, 2)));
        
        //if hero is in zombie feeling range, then turn zombie state to chase mode.
        if(interval < this.ZOMBIE_FEEL_RANGE) {
            this.curState = this.ZOMBIE_FEEL.CHASE;
        }else if(this.curState == this.ZOMBIE_FEEL.STAND) {
            if(Math.floor(Math.random() * 10) < 5){
                var desInfo = this.map.spaceManager.getNextSpace(this.curNodeIndex, this.isCurNode);
                if(desInfo == null) return;
                this.curState = this.ZOMBIE_FEEL.MOVE;
                this.destinationX = desInfo[0];
                this.destinationY = desInfo[1];
                this.destinationIndex = desInfo[2];
                this.isDestinationNode = desInfo[3];
            }
        }else if(this.curState == this.ZOMBIE_FEEL.MOVE) {
            if(this.isArriveDestination()) {
            	//if()        
            }
        }else if(this.curState == this.ZOMBIE_FEEL.CHASE) {
			
		}else if(this.curState == this.ZOMBIE_FEEL.ATTACK) {
			
			this.curState = this.ZOMBIE_FEEL.CHASE;
		}
    }
    
    Zombie.prototype.isArriveDestination = function () {
        var lenToDes = parseInt(Math.sqrt(Math.pow(this.destinationX - this.curX, 2) + Math.pow(this.destinationY - this.curY, 2)));
        if(lenToDes < 1) {
            return true;
        }else{
            return false;
        }
    }
    
    Zombie.prototype.moveAround = function (dt) {
        
    }
    
    Zombie.prototype.chaseHero = function (dt, heroX, heroY) {
       	var dx, dy;
		var vx = parseInt(heroX - this.curX); 
		var vy = parseInt(heroY - this.curY);
		if(vx > 0) {
			dx = 1;
		} else if(vx < 0) {
			dx = -1;
		} else {
			dx = 0;
		}
		
		if(vy > 0) {
			dy = 1;
		} else if(vy < 0) {
			dy = -1;
		} else {
			dy = 0;
		}
		
		this.curX += dt*dx*this.speed;
		this.curY += dt*dy*this.speed;
		
		//TODO : change the current node info.
    }
    
    Zombie.prototype.action = function (dt, heroX, heroY) {
        
        //for Debug
		//this.chaseHero(dt, heroX, heroY);
		return;
        //end
        
        var zombieAction = this.curState;
        if(zombieAction == this.ZOMBIE_FEEL.MOVE) {
            this.moveAround(dt);
        } else if(zombieAction == this.ZOMBIE_FEEL.CHASE) {
            this.chaseHero(dt, heroX, heroY);
        }
    }
    
    Zombie.prototype.setPosition = function (x, y, index) {
        this.oldX = this.curX;
        this.oldY = this.curY;
        this.oldNodeIndex = this.curNodeIndex;
        
        this.curX = x;
        this.curY = y;
        this.curNodeIndex = index;
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
    Zombie.prototype.getOldX = function () {
        return this.oldX;
    }
    Zombie.prototype.getOldY = function () {
        return this.oldY;
    }
    Zombie.prototype.getOldNodeIndex = function () {
        return this.oldNodeIndex;
    }
    
    Zombie.prototype.update = function (dt, heroX, heroY) {
        //zombie state update
        this.updateState(heroX, heroY);
        //move update
        this.action(dt, heroX, heroY);
		
		this.model.position.x = this.curX;
		this.model.position.z = this.curY;
	
    }
    
    global.Zombie = Zombie;
})(this);