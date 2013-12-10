(function(global){
	  
    function Space(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        //node -> link [1, link index], link -> link [2, link index], link -> node [3, node index], node -> node [4, node index]
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
        this.node.push(space);
    }
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
		//TODO 
	}

    SpaceGraph.prototype.addRoad = function (road) {
        if (!road)
            return;
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
				//north or south
				if((this.node[i].y == (this.node[j].y + this.node[j].height)) || ((this.node[i].y + this.node[i].height) == this.node[j].y)) {
					//
					if((this.node[j].x >= this.node[i].x) && (this.node[j].x < (this.node[i].x + this.node[i].width))) {
						this.node[i].addNextSpace(NODE_TO_NODE, j);
						this.node[j].addNextSpace(NODE_TO_NODE, i);
					}
					else if((this.node[i].x >= this.node[j].x) && (this.node[i].x < (this.node[j].x + this.node[j].width))) {
						this.node[i].addNextSpace(NODE_TO_NODE, j);
						this.node[j].addNextSpace(NODE_TO_NODE, i);
					}
				}//west or east
				else if((this.node[i].x == (this.node[j].x + this.node[j].width)) || ((this.node[i].x + this.node[i].width) == this.node[j].x)) {
					if((this.node[j].y >= this.node[i].y) && (this.node[j].y < (this.node[i].y + this.node[i].height))) {
						this.node[i].addNextSpace(NODE_TO_NODE, j);
						this.node[j].addNextSpace(NODE_TO_NODE, i);
					}
					else if((this.node[i].y >= this.node[j].y) && (this.node[i].y < (this.node[j].y + this.node[j].height))) {
						this.node[i].addNextSpace(NODE_TO_NODE, j);
						this.node[j].addNextSpace(NODE_TO_NODE, i);
					}
				}
			}
			for(var k=0; k<this.link.length; k++) {
				//north or south
				if((this.node[i].y == (this.link[k].y + 1)) || ((this.node[i].y + this.node[i].height) == this.link[k].y)) {
					if((this.link[k].x >= this.node[i].x) && (this.link[k].x < (this.node[i].x + this.node[i].width))) { 
						this.node[i].addNextSpace(NODE_TO_LINK, k);
						this.link[k].addNextSpace(LINK_TO_NODE, i);
					}
				}//west or east
				else if((this.node[i].x == (this.link[k].x + 1)) || ((this.node[i].x + this.node[i].width) == this.link[k].x)) {
					if((this.link[k].y >= this.node[i].x) && (this.link[k].y < (this.node[i].x + this.node[i].width))) {
						this.node[i].addNextSpace(NODE_TO_LINK, k);
						this.link[k].addNextSpace(LINK_TO_NODE, i);
					}
				}
			}
		}
		//link -> (node or link)
		for(var i=0; i<this.link.length; i++) {
			for(var j=0; j<this.node.length; j++) {
				//north or south
				if((this.link[i].y == (this.node[j].y + this.node[j].height)) || ((this.link[i].y + 1) == this.node[j].y)) {
					if((this.link[i].x >= this.node[j].x) && (this.link[i].x < (this.node[j].x + this.node[j].width))) {
						this.link[i].addNextSpace(LINK_TO_NODE, j);
						this.node[j].addNextSpace(NODE_TO_LINK, i);
					}
				}//west or east
				else if((this.link[i].x == (this.node[j].x + this.node[j].width)) || ((this.link[i].x + 1) == this.node[j].x)) {
					if((this.link[i].y >= this.node[j].y) && (this.link[i].y < (this.node[j].y + this.node[j].width))) {
						this.link[i].addNextSpace(LINK_TO_NODE, j);
						this.node[j].addNextSpace(NODE_TO_LINK, i);
					}
				}
			}
			for(var k=0; k<this.link.length; k++) {
				//north or south
				if((this.link[i].y == (this.link[k].y + 1)) || ((this.link[i].y + 1) == this.link[k].y)) {
					if(this.link[i].x == this.link[k].x) {
						this.link[i].addNextSpace(LINK_TO_LINK, k);
						this.link[k].addNextSpace(LINK_TO_LINK, i);
					}
				}//west or east
				else if((this.link[i].x == (this.link[k].x + 1)) || ((this.link[i].x + 1) == this.link[k].x)) {
					if(this.link[i].y == this.link[k].y) {
						this.link[i].addNextSpace(LINK_TO_LINK, k);
						this.link[k].addNextSpace(LINK_TO_LINK, i);
					}
				}
			}
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