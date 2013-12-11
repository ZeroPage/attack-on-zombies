(function(global){
	  
    function Space(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.type;
        this.nextSpace = new Array();
    };
    Space.prototype.addNextSpace = function (flag, index) {
        if (flag > 4)
            return;
        this.nextSpace.push([flag, index]);
    }

    function SpaceGraph() {
        this.spaceList = [];
    };

    SpaceGraph.prototype.addSpace = function (space) {
        if (!space)
            return;
		space.type = "node";
        this.spaceList.push(space);
    }
	//may be need to some repairing.
	SpaceGraph.prototype.getNextSpace = function (curIndex) {
		var sendIndex, sendX, sendY, sendFlag;
		var t_space;
		
		if(this.spaceList[curIndex].nextSpace.length == 0) 
			return null;
		var randNum = Math.floor(Math.random()*this.spaceList[curIndex].nextSpace.length);
		sendFlag = this.spaceList[curIndex].nextSpace[randNum][0];
		sendIndex = this.spaceList[curIndex].nextSpace[randNum][1];
		
		t_space = this.spaceList[sendIndex];
		
		sendX = (t_space.x + t_space.width) * (Math.floor(Math.random() * 5) + 2);
		sendY = (t_space.y + t_space.height) * (Math.floor(Math.random() * 5) + 2);
		return [sendX, sendY, sendIndex, sendFlag];
	}
	SpaceGraph.prototype.getConnectionPoint = function(curSpaceIndex, nextSpaceIndex)
	{
		var from = this.spaceList[curSpaceIndex];
		var to = this.spaceList[nextSpaceIndex];
		
		if(from.x == to.x + to.width){
			//left
			var y = getMidPoint(
				from.y,
				from.y + from.height,
				to.y,
				to.y + to.height
			);
			return {x : from.x * 10, y: y * 10};
		} else if(from.x + from.width == to.x){
			//right
			var y = getMidPoint(
				from.y,
				from.y + from.height,
				to.y,
				to.y + to.height
			);
			return {x : to.x * 10, y: y * 10};
		} else if(from.y == to.y + to.height){
			//up
			var x = getMidPoint(
				from.x,
				from.x + from.width,
				to.x, 
				to.x + to.width
			)
			return {x : x * 10, y : from.y * 10};
		} else if(from.y + from.height == to.y){
			//down
			var x = getMidPoint(
				from.x,
				from.x + from.width,
				to.x, 
				to.x + to.width
			)
			return {x : x * 10, y : to.y * 10};
		}
		throw "not have connect Point";
		function getMidPoint(a, b, c, d){
			var tmp =[a,b,c,d].sort(function(a, b){
				return a-b;
			});
			return (tmp[1] + tmp[2])/2;
		}
	}
	SpaceGraph.prototype.getPath = function(curSpaceIndex, pos){
		
		var to_index = this.searchSpace(pos);
		 
		var from = this.spaceList[curSpaceIndex];
		var to = this.spaceList[to_index];
		
		var nearNode = [];
		
		//if hero and zombie is in the same space 
		if(curSpaceIndex == to_index) {
			return nearNode;
		}
		
		//first next space setting in nearNode
		for(var i = 0; i < this.spaceList[curSpaceIndex].nextSpace.length; i++){
			nearNode.push([this.spaceList[curSpaceIndex].nextSpace[i][1]]);
		}
	
		while(nearNode.length != 0){
			
			var index = nearNode.shift();
			
			var lastindex = index[index.length -1];
			
			if(lastindex == to_index) return index;
			
			for(var i = 0; i < this.spaceList[lastindex].nextSpace.length; i++){
				var nextIndex = this.spaceList[lastindex].nextSpace[i][1];

				if(index.length > 10) continue;
				if(isInArray(index, nextIndex)) continue;

				var newpath = index.concat([nextIndex]);
				nearNode.push(newpath);
			}
		}
		return;
		
		function isInArray(arr, value){
			for(var j = 0; j < arr.length; j++){
				if(arr[j] == value){
					return true;
				}
			}
			return false;
		}
	}
	
	SpaceGraph.prototype.searchSpace = function (pos) {
		
		for(var i=0; i<this.spaceList.length; i++) {
			if(checkInside(this.spaceList[i], pos)) {
				return i;	
			}
		}
		
		function checkInside(space, pos){
			if(space.x * 10 > pos.x) return false;
			if(space.x * 10 + space.width * 10 < pos.x) return false;
			if(space.y * 10 > pos.y) return false;
			if(space.y * 10 + space.height * 10 < pos.y) return false;
			return true;
		}
	}

    SpaceGraph.prototype.addRoad = function (road) {
        if (!road)
            return;
		road.type = "Link"
        this.spaceList.push(road);
    }
	
	SpaceGraph.prototype.makeSpaceLinkedList = function () {

		for(var i=0; i<this.spaceList.length; i++) {
			for(var j=0; j<this.spaceList.length; j++) {
				var dir = isNaver(this.spaceList[i], this.spaceList[j]);
				if(dir != "none"){
					this.spaceList[i].nextSpace.push([1, j]);
				}
				
			}
		}
		
		function isOverlap(from1, to1, from2, to2){
			if(from1 < from2 && from2 < to1) return true;
			if(from1 < to2 && to2 < to1) return true;
			
			if(from2 < from1 && from1 < to2) return true;
			if(from2 < to1 && to1 < to2) return true;
			
			if(from1 == from2 && to1 == to2) return true;
			
			return false;
		}
		function isNaver(from, to){
			if(from.x == to.x + to.width){
				if(isOverlap(from.y, from.y + from.height, to.y, to.y + to.height)){
					//left
					return "left"
				}
			} else if(from.x + from.width == to.x){
				if(isOverlap(from.y, from.y + from.height, to.y, to.y + to.height)){
					//right
					return "right"
				}
			} else if(from.y == to.y + to.height){
				if(isOverlap(from.x, from.x + from.width, to.x, to.x + to.width)){
					return "up"
				}
			} else if(from.y + from.height == to.y){
				if(isOverlap(from.x, from.x + from.width, to.x, to.x + to.width)){
					return "down"
				}
			}
			return "none";
		}
    }
	
	global.Space = Space;
	global.SpaceGraph = SpaceGraph;
})(this);