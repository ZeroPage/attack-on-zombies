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
        this.node = new Array(); // space
        this.link = new Array(); // road
    };

    SpaceGraph.prototype.addSpace = function (space) {
        if (!space)
            return;
		space.type = "node";
        this.node.push(space);
    }
	//may be need to some repairing.
	SpaceGraph.prototype.getNextSpace = function (curIndex, isNode) {
		var sendIndex, sendX, sendY, sendFlag;
		var t_space;
		var count, randNum;
		
		// if current space is node, then get randomly next space data.
		if(isNode) { 
			count = this.node[curIndex].nextSpace.length - 1  < 0 ? 0 : this.node[curIndex].nextSpace.length;
			if(count == 0) 
				return null;
			randNum = Math.floor(Math.random()*count);
			sendFlag = this.node[curIndex].nextSpace[randNum][0];
			sendIndex = this.node[curIndex].nextSpace[randNum][1];
			if(sendFlag == 1) {
				t_space = this.link[sendIndex];
				sendFlag = false;
			} else if(sendFlag == 4) {
				t_space = this.node[sendIndex];
				sendFlag = true;
			} else {
				console.log("what the hell in map->getNextSpace");
			}			
		} else { // if current space if link, then also get randomly next space data.
			count = this.link[curIndex].nextSpace.length - 1  < 0 ? 0 : this.link[curIndex].nextSpace.length;
			if(count == 0) 
				return null;
			randNum = Math.floor(Math.random()*count);
			sendFlag = this.link[curIndex].nextSpace[randNum][0];
			sendIndex = this.link[curIndex].nextSpace[randNum][1];
			if(sendFlag == 2) {
				t_space = this.link[sendIndex];
				sendFlag = false;
			} else if(sendFlag == 3) {
				t_space = this.node[sendIndex];
				sendFlag = true;
			} else {
				console.log("what the hell in map->getNextSpace");
			}
		}
		sendX = (t_space.x + t_space.width) * (Math.floor(Math.random() * 5) + 2);
		sendY = (t_space.y + t_space.height) * (Math.floor(Math.random() * 5) + 2);
		return [sendX, sendY, sendIndex, sendFlag];
	}
	SpaceGraph.prototype.getConnectionPoint = function(curSpaceIndex, nextSpaceIndex, curSpaceType, nextSpaceType)
	{
		var from = curSpaceType ? this.node[curSpaceIndex] : this.link[curSpaceIndex];
		var to = nextSpaceType ? this.node[nextSpaceIndex] : this.link[nextSpaceIndex];
		
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
	SpaceGraph.prototype.getPath = function(curSpaceIndex, curIsNode, pos){
		return;
		
		var to_index = this.searchSpace(pos);
		 
		var from = curIsNode ? this.node[curSpaceIndex] : this.link[curSpaceIndex];
		var to = to_index.isNode ? this.node[to_index.index] : this.link[to_index.index];
		
		var nearNode = [];
		
		//if hero and zombie is in the same space 
		if((curSpaceIndex == to_index.index) && (curIsNode == to_index.isNode)) {
			return nearNode;
		}
		
		//first next space setting in nearNode
		for(var i=0; i<from.nextSpace.length; i++) {
			var isNextNode = from.nextSpace[i][0] >= 3 ? true : false;
			nearNode.push(new Array({
				index : from.nextSpace[i][1],
				isNode : isNextNode
			}));	
		}
		
		//near node를 찿고 경로가 여러군데에서 연결되어있으면 분기해서 nearNode에 추가한다.
		//nearNode를 모두 순회하면서 목적지와 인덱스, 노드여부가 같으면 루프를 빠져나와서 path를 리턴한다.
		var step = 0;
		while(1)
		{
			step++;
			var curNearNodeLen = nearNode.length;
			for(var i=0; i < curNearNodeLen; i++) {
				var path = nearNode.shift();
				var pathEnd = path[path.length - 1];
				if(pathEnd.index == to_index.index) {
					return path; 
				} else {
					console.log(pathEnd.index);
					var lastSpace = pathEnd.isNode ? this.node[pathEnd.index] : this.link[pathEnd.index];
					for(var k=0; k<lastSpace.nextSpace.length; k++) {
						var temp = path;
						var addingisNode = lastSpace.nextSpace[0] >= 3 ? true : false;
						if(pathEnd.index != lastSpace.nextSpace[1] || pathEnd.isNode != addingisNode)
						{
							temp.push({
								index : lastSpace.nextSpace[1],
								isNode : addingisNode
							});
							nearNode.push(temp);
						}
					}	
				}
			}
			if(step == 20) {
				return;
			}
		}
	}
	
	SpaceGraph.prototype.searchSpace = function (pos) {
		
		for(var i=0; i<this.node.length; i++) {
			if(checkInside(this.node[i], pos)) {
				return {index : i, isNode : true};	
			}
		}
		for(var i=0; i<this.link.length; i++) {
			if(checkInside(this.link[i], pos)) {
				return {index : i, isNode : false};
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
        this.link.push(road);
    }
	// i don't know that how much this module effect to loading speed. so we will discuss about it and test it. -> can be done.
	// i infer about 1000 hundred operation cost.
	SpaceGraph.prototype.makeSpaceLinkedList = function () {
		var NODE_TO_LINK = 1;
		var LINK_TO_LINK = 2;
		var LINK_TO_NODE = 3;
		var NODE_TO_NODE = 4;
		
        //node -> (node or link)
		for(var i=0; i<this.node.length; i++) {
			for(var j=0; j<this.node.length; j++) {
				//NODE_TO_NODE
				var dir = isNaver(this.node[i], this.node[j]);
				if(dir != "none"){
					this.node[i].nextSpace.push([NODE_TO_NODE, j]);
				}
				
			}
			for(var j=0; j<this.link.length; j++) {
				//NODE_TO_LINK
				var dir = isNaver(this.node[i], this.link[j]);
				if(dir != "none"){
					this.node[i].nextSpace.push([NODE_TO_LINK, j]);
				}
			}
		}
		//link -> (node or link)
		for(var i=0; i<this.link.length; i++) {
			for(var j=0; j<this.node.length; j++) {
				//LINK_TO_NODE
				var dir = isNaver(this.link[i], this.node[j]);
				if(dir != "none"){
					this.link[i].nextSpace.push([LINK_TO_NODE, j]);
				}
			}
			for(var j=0; j<this.link.length; j++) {
				//LINK_TO_LINK
				var dir = isNaver(this.link[i], this.link[j]);
				if(dir != "none"){
					this.link[i].nextSpace.push([LINK_TO_LINK, j]);
				}
			}
		}
		
		
		function isOverlap(from1, to1, from2, to2){
			if(from1 < from2 && from2 < to1) return true;
			if(from1 < to2 && to2 < to1) return true;
			
			if(from2 < from1 && from1 < to2) return true;
			if(from2 < to1 && to1 < to2) return true;
			
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
	
	
    SpaceGraph.prototype.getTetrisBlockArray = function (x, width, height) {
        var blockWidth;
        if (width - x >= 3) {
            blockWidth = Math.floor(Math.random() * (width / 10)) + 3;
        } else {
            blockWidth = 0;
        }

        var blockCoordinate = new Array();
        var limit_Y = parseInt(height / 10);
        while (true) {
            if (limit_Y < 3) // exception - infinity loop
                break;
            var startY = Math.floor(Math.random() * (height - 1));
            var endY = Math.floor(Math.random() * (height - 1 - startY)) + startY;
            if ((endY - startY + 1) >= 3 && (endY - startY + 1) <= limit_Y) {
                blockCoordinate[0] = startY;
                blockCoordinate[1] = endY;
                blockCoordinate[2] = blockWidth;
                break;
            }
        }
        return blockCoordinate;
    }

    //administrate two space into the adjList.
    //arguments(a,b)-> two space node index
    SpaceGraph.prototype.saveSpaceConnection = function (a, b) {
        if (!a || !b)
            return;
        for (var i = 0; i < this.adjList.length; i++) {
            if (this.adjList[i][0] == a && this.adjList[i][1] == b) {
                return;
            }
            else if (this.adjList[i][0] == b && this.adjList[i][1] == a) {
                return;
            }
        }
        var list = [a, b];
        this.adjList.push(list);
    }
	
	global.Space = Space;
	global.SpaceGraph = SpaceGraph;
})(this);