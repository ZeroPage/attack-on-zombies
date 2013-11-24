(function (global) {
	
	//TODO : 열거형 상수들을 MAP 객체 안에 넣어야함. + 이에따른 코드 정리 필요(우선순위 하_중).
    var MAP_FEATURE = {
        NO_USE :        0,
        FLOOR :         1,
        WALL :          2,
        CORRIDOR :      3,
        UP_STAIRS :     2,
        DOWN_STAIRS :   2,
        DOOR :          4,
        BOX :           2,
        TRAP :          2
    };

    var MAP_SIZE = {
        ROOM_MAX_WIDTH :        10,
        ROOM_MAX_HEIGHT :       10,
        ROOM_MIN_WIDTH :         6,
        ROOM_MIN_HEIGHT :        6,
        CORRIDOR_MAX_LENGTH :    6,
        CORRIDOR_MIN_LENGTH :    2
    };

    function Map() {
        //enum//in this time, i just call 1, 2
		this.hero_node = 0;

        this.xsize = 0;
        this.ysize = 0;

        this.objects = 0;

        this.chanceRoom = 75;
        this.chanceCorridor = 25;

        this.width = 50;
        this.height = 50;
        this.data = new Array();
        for (var i = 0; i < this.height; i++) {
            this.data[i] = new Array();
            for (var k = 0; k < this.width; k++) {
                this.data[i][k] = 2;
            }
        }
        this.spaceManager = new SpaceGraph();
        this.createDungeon(this.width, this.height, 100);
        //this.random3();
        this.objList = [];
    };
  
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
    
    Map.prototype.setCell = function (x, y, celltype) {
        if (y < 0 || x < 0 || x > this.xsize || y > this.ysize)
            return;
       this.data[y][x] = celltype;
    }
    Map.prototype.getCell = function (x, y) {
        if (y < 0 || x < 0 || x > this.xsize || y > this.ysize)
            return;

        //console.log("path : " + __gDebug__);
        //console.log(x + " and " + y);
        //console.log("=" + this.data[y][x]);

        return this.data[y][x];
    }
    Map.prototype.getRand = function (min, max) {
        var n = max - min;
        var i = Math.floor(Math.random() * n);
        if (i < 0)
            i = -i;
        return min + i;
    }
	Map.prototype.getMonsterPos = function() {
		var t_space = this.spaceManager.node;
        var index;
        while (true) {
            index = this.getRand(0, t_space.length - 1);
			if(this.hero_node != index) {
				break;
			}
        }
		var x = parseInt((t_space[index].x)*10 + this.getRand(1, t_space[index].width)*10);
		var y = parseInt((t_space[index].y)*10 + this.getRand(1, t_space[index].height)*10);
        return [x, y, index];
	}
    Map.prototype.getHeroXY = function () {
        var t_space = this.spaceManager.node;
        while (true) {
            var index = this.getRand(0, t_space.length - 1);
			var x = parseInt(((2*t_space[index].x) + t_space[index].width) / 2);
			var y = parseInt(((2*t_space[index].y) + t_space[index].height) / 2);
            if (this.data[y][x] == 1) {
                this.hero_node = index;
                break;
            }
        }
        return new Point(x, y);
    }
    Map.prototype.makeCorridor = function (x, y, length, direction) {
        var len = this.getRand(MAP_SIZE.CORRIDOR_MIN_LENGTH, length);
        var floor = MAP_FEATURE.CORRIDOR;
        var dir = 0;
        if (direction > 0 && direction < 4) dir = direction;

        var xtemp = 0;
        var ytemp = 0;
        var xsize = this.xsize - 1;
        var ysize = this.ysize - 1;

        //__gDebug__ = __gDebug__ + "-> makeCorridor";

        switch (dir) {
            case 0:
                if (x < 0 || x > xsize) return false;
                else xtemp = x;

                for (ytemp = y; ytemp > (y - len) ; ytemp--) {
                    if (ytemp < 0 || ytemp > ysize) return false;
                    if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                }

                for (ytemp = y; ytemp > (y - len) ; ytemp--) {
                    var t_road = new Space(xtemp, ytemp, 1, 1);
                    this.setCell(xtemp, ytemp, floor);
                    this.spaceManager.addRoad(t_road);
                }
                break;

            case 1:
                if (y < 0 || y > ysize) return false;
                else ytemp = y;

                for (xtemp = x; xtemp < (x + len) ; xtemp++) {
                    if (xtemp < 0 || xtemp > xsize) return false;
                    if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                }

                for (xtemp = x; xtemp < (x + len) ; xtemp++) {
                    var t_road = new Space(xtemp, ytemp, 1, 1);
                    this.setCell(xtemp, ytemp, floor);
                    this.spaceManager.addRoad(t_road);
                }
                break;

            case 2:
                if (x < 0 || x > xsize) return false;
                else xtemp = x;

                for (ytemp = y; ytemp < (y + len) ; ytemp++) {
                    if (ytemp < 0 || ytemp > ysize) return false;
                    if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                }
                for (ytemp = y; ytemp < (y + len) ; ytemp++) {
                    var t_road = new Space(xtemp, ytemp, 1, 1);
                    this.setCell(xtemp, ytemp, floor);
                    this.spaceManager.addRoad(t_road);
                }
                break;

            case 3:
                if (ytemp < 0 || ytemp > ysize) return false;
                else ytemp = y;

                for (xtemp = x; xtemp > (x - len) ; xtemp--) {
                    if (xtemp < 0 || xtemp > xsize) return false;
                    if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                }

                for (xtemp = x; xtemp > (x - len) ; xtemp--) {
                    var t_road = new Space(xtemp, ytemp, 1, 1);
                    this.setCell(xtemp, ytemp, floor);
                    this.spaceManager.addRoad(t_road);
                }
                break;
        }
        return true;
    }
    Map.prototype.makeRoom = function (x, y, xlength, ylength, direction) {
        //min lenght is 4 and max is xlength and ylength
        var xlen = this.getRand(MAP_SIZE.ROOM_MIN_WIDTH, xlength);
        var ylen = this.getRand(MAP_SIZE.ROOM_MIN_HEIGHT, ylength);
        var floor = MAP_FEATURE.FLOOR;
        var wall = MAP_FEATURE.WALL;
        var dir = 0;
        var ysize = this.ysize - 1;
        var xsize = this.xsize - 1;
        if (direction > 0 && direction < 4) dir = direction;

        //__gDebug__ = __gDebug__ + "-> makeRoom";
 
        switch(dir){
            case 0:
                for (var ytemp = y; ytemp > parseInt(y-ylen); ytemp--){
                    if (ytemp < 0 || ytemp > ysize) return false;
                    for (var xtemp = x - parseInt(xlen / 2) ; xtemp < x + parseInt((xlen + 1) / 2) ; xtemp++) {
                        if (xtemp < 0 || xtemp > xsize) return false;
                        if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false; 
                    }
                }
 
                for (var ytemp = y; ytemp > parseInt(y-ylen); ytemp--){
                    for (var xtemp = x - parseInt(xlen / 2) ; xtemp < x + parseInt((xlen + 1) / 2) ; xtemp++) {
                        if (xtemp == x - parseInt(xlen / 2)) this.setCell(xtemp, ytemp, wall);
                        else if (xtemp == x + parseInt((xlen - 1) / 2)) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == y) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == parseInt(y-ylen+1)) this.setCell(xtemp, ytemp, wall);
                        else this.setCell(xtemp, ytemp, floor);
                    }
                }
                //Debug
                //console.log(this.spaceManager.node.length +"-> x : " + (x - parseInt(xlen / 2) + 1) +" y : "+ (parseInt(y - ylen) + 2) +" xlen : "+ (xlen - 2) +" ylen : "+ (ylen - 2));
				
				var t_x = x - parseInt(xlen/2) + 1;
				var t_y = parseInt(y - ylen + 1) + 1;
				var t_width = parseInt((xlen+1)/2) + parseInt(xlen/2) - 1;
				var t_height = y - parseInt(y - ylen + 1) - 1;
                var t_space = new Space(t_x, t_y, t_width, t_height); // can be error so check this value
                this.spaceManager.addSpace(t_space);
                break;
            case 1:
                for (var ytemp = y - parseInt(ylen / 2) ; ytemp < y + parseInt((ylen + 1) / 2) ; ytemp++) {
                    if (ytemp < 0 || ytemp > ysize) return false;
                    for (var xtemp = x; xtemp < x + parseInt(xlen) ; xtemp++) {
                        if (xtemp < 0 || xtemp > xsize) return false;
                        if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                    }
                }
 
                for (var ytemp = y - parseInt(ylen / 2) ; ytemp < y + parseInt((ylen + 1) / 2) ; ytemp++) {
                    for (var xtemp = x; xtemp < parseInt(x+xlen); xtemp++){
                        if (xtemp == x) this.setCell(xtemp, ytemp, wall);
                        else if (xtemp == parseInt(x+xlen-1)) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == y - parseInt(ylen / 2)) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == y + parseInt((ylen - 1) / 2)) this.setCell(xtemp, ytemp, wall);
                        else this.setCell(xtemp, ytemp, floor);
                    }
                }
                //Debug
                //console.log(this.spaceManager.node.length + "-> x : " + (x + 1) + " y : " + (y - parseInt(ylen/2) + 1) + " xlen : " + (xlen - 2) + " ylen : " + (ylen - 2));
				var t_x = x + 1;
				var t_y = y - parseInt(ylen/2) + 1;
				var t_width = parseInt(x+xlen-1) - x - 1;
				var t_height = parseInt((ylen - 1)/2) + parseInt(ylen/2) - 1;
                var t_space = new Space(t_x, t_y, t_width, t_height); // can be error so check this value
                this.spaceManager.addSpace(t_space);
                break;
            case 2:
                for (var ytemp = y; ytemp < y + parseInt(ylen) ; ytemp++) {
                    if (ytemp < 0 || ytemp > ysize) return false;
                    for (var xtemp = x - parseInt(xlen / 2) ; xtemp < x + parseInt((xlen + 1) / 2) ; xtemp++) {
                        if (xtemp < 0 || xtemp > xsize) return false;
                        if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                    }
                }
 
                for (var ytemp = y; ytemp < parseInt(y+ylen); ytemp++){
                    for (var xtemp = x - parseInt(xlen / 2) ; xtemp < x + parseInt((xlen + 1) / 2) ; xtemp++) {
                        if (xtemp == x - parseInt(xlen / 2)) this.setCell(xtemp, ytemp, wall);
                        else if (xtemp == x + parseInt((xlen - 1) / 2)) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == y) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == (y+ylen-1)) this.setCell(xtemp, ytemp, wall); 
                        else this.setCell(xtemp, ytemp, floor);
                    }
                }
                //Debug
                //console.log(this.spaceManager.node.length + "-> x : " + (x - parseInt(xlen/2) + 1) + " y : " + (y + 1) + " xlen : " + (xlen - 2) + " ylen : " + (ylen - 2));
				var t_x = x - parseInt(xlen / 2) + 1;
				var t_y = y + 1;
				var t_width = parseInt((xlen - 1)/2) + parseInt(xlen/2) - 1;
				var t_height = ylen - 2;
                var t_space = new Space(t_x, t_y, t_width, t_height); // can be error so check this value
                this.spaceManager.addSpace(t_space);
                break;
            case 3:
                for (var ytemp = y - parseInt(ylen / 2) ; ytemp < y + parseInt((ylen + 1) / 2) ; ytemp++) {
                    if (ytemp < 0 || ytemp > ysize) return false;
                    for (var xtemp = x; xtemp > x - parseInt(xlen) ; xtemp--) {
                        if (xtemp < 0 || xtemp > xsize) return false;
                        if (this.getCell(xtemp, ytemp) != MAP_FEATURE.WALL) return false;
                    }
                }
 
                for (var ytemp = y - parseInt(ylen / 2) ; ytemp < y + parseInt((ylen + 1) / 2) ; ytemp++) {
                    for (var xtemp = x; xtemp > parseInt(x-xlen); xtemp--){
                        if (xtemp == x) this.setCell(xtemp, ytemp, wall);
                        else if (xtemp == parseInt(x-xlen+1)) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == y - parseInt(ylen / 2)) this.setCell(xtemp, ytemp, wall);
                        else if (ytemp == y + parseInt((ylen - 1) / 2)) this.setCell(xtemp, ytemp, wall);
                        else this.setCell(xtemp, ytemp, floor);
                    }
                }
                //Debug
                //console.log(this.spaceManager.node.length + "-> x : " + (parseInt(x - xlen) + 2) + " y : " + (y - parseInt(ylen / 2) + 1) + " xlen : " + (xlen - 2) + " ylen : " + (ylen - 2));
				var t_x = parseInt(x-xlen+1) + 1;
				var t_y = y - parseInt(ylen / 2) + 1;
				var t_width = x - parseInt(x-xlen+1) - 1;
				var t_height = parseInt((ylen-1)/2) + parseInt(ylen/2) - 1;
                var t_space = new Space(t_x, t_y, t_width, t_height); // can be error so check this value
                this.spaceManager.addSpace(t_space);
                break;
        }
        return true;
    }

    Map.prototype.createDungeon = function (inx, iny, inobj) {
        if (inobj < 1) this.objects = 10;
        else this.objects = inobj;
 
        if (inx < 3) this.xsize = 3;
        else if (inx > this.width) this.xsize = this.width;
        else this.xsize = inx;
 
        if (iny < 3) this.ysize = 3;
        else if (iny > this.height) this.ysize = this.height;
        else this.ysize = iny;
 
        var xsize = this.xsize;
        var ysize = this.ysize;

        //__gDebug__ = "createDungun";


        for (var y = 0; y < ysize; y++){
            for (var x = 0; x < xsize; x++){
                if (y == 0) this.setCell(x, y, MAP_FEATURE.WALL);
                else if (y == ysize-1) this.setCell(x, y, MAP_FEATURE.WALL);
                else if (x == 0) this.setCell(x, y, MAP_FEATURE.WALL);
                else if (x == xsize-1) this.setCell(x, y, MAP_FEATURE.WALL);
                else this.setCell(x, y, MAP_FEATURE.WALL);
            }
        }
        this.makeRoom(parseInt(xsize/2), parseInt(ysize/2), MAP_SIZE.ROOM_MAX_WIDTH, MAP_SIZE.ROOM_MIN_HEIGHT, this.getRand(0,3));
       // __gDebug__ = "createDungun->CenterRoom";

        var currentFeatures = 1;
 
        for (var countingTries = 0; countingTries < 1000; countingTries++){
            if (currentFeatures == this.objects){
                break;
            }

            //__gDebug__ = "createDungun->CenterRoom->obj:"+currentFeatures+"try:"+countingTries;

            var newx = 0;
            var xmod = 0;
            var newy = 0;
            var ymod = 0;
            var validTile = -1;
           
            for (var testing = 0; testing < 1000; testing++){
                newx = this.getRand(1, xsize-1);
                newy = this.getRand(1, ysize-1);
                validTile = -1;
                if (this.getCell(newx, newy) == MAP_FEATURE.WALL || this.getCell(newx, newy) == MAP_FEATURE.CORRIDOR){
                    //check if we can reach the place
                    if (this.getCell(newx, newy+1) == MAP_FEATURE.FLOOR || this.getCell(newx, newy+1) == MAP_FEATURE.CORRIDOR){
                        validTile = 0;
                        xmod = 0;
                        ymod = -1;
                    }
                    else if (this.getCell(newx-1, newy) == MAP_FEATURE.FLOOR || this.getCell(newx-1, newy) == MAP_FEATURE.CORRIDOR){
                        validTile = 1;
                        xmod = +1;
                        ymod = 0;
                    }
                    else if (this.getCell(newx, newy-1) == MAP_FEATURE.FLOOR || this.getCell(newx, newy-1) == MAP_FEATURE.CORRIDOR){
                        validTile = 2;
                        xmod = 0;
                        ymod = +1;
                    }
                    else if (this.getCell(newx+1, newy) == MAP_FEATURE.FLOOR || this.getCell(newx+1, newy) == MAP_FEATURE.CORRIDOR){
                        validTile = 3; 
                        xmod = -1;
                        ymod = 0;
                    }
 
                    //check that we haven't got another door nearby, so we won't get alot of openings besides
                    //each other
                    if (validTile > -1){
                        if (this.getCell(newx, newy+1) == MAP_FEATURE.DOOR) //north
                            validTile = -1;
                        else if (this.getCell(newx-1, newy) == MAP_FEATURE.DOOR)//east
                            validTile = -1;
                        else if (this.getCell(newx, newy-1) == MAP_FEATURE.DOOR)//south
                            validTile = -1;
                        else if (this.getCell(newx+1, newy) == MAP_FEATURE.DOOR)//west
                            validTile = -1;
                    }
 
                    //if we can, jump out of the loop and continue with the rest
                    if (validTile > -1) break;
                }
            }
            if (validTile > -1){
                //choose what to build now at our newly found place, and at what direction
                var feature = this.getRand(0, 100);
                if (feature <= this.chanceRoom){ //a new room
                    if (this.makeRoom((newx+xmod), (newy+ymod), MAP_SIZE.ROOM_MAX_WIDTH, MAP_SIZE.ROOM_MAX_HEIGHT, validTile)){
                        currentFeatures++; 
 
                        //then we mark the wall opening with a door
                        this.setCell(newx, newy, MAP_FEATURE.DOOR);
 
                        //clean up infront of the door so we can reach it
                        this.setCell((newx+xmod), (newy+ymod), MAP_FEATURE.FLOOR);
                    }
                }
                else if (feature >= this.chanceRoom){ //new corridor
                    if (this.makeCorridor((newx+xmod), (newy+ymod), MAP_SIZE.CORRIDOR_MAX_LENGTH, validTile)){
                        //same thing here, add to the quota and a door
                        currentFeatures++;
 
                        this.setCell(newx, newy, MAP_FEATURE.DOOR);
                    }
                }
            }
        }
        
        //__gDebug__ = "createDungun->CenterRoom->otherobject";
        
        //sprinkle out the bonusstuff (stairs, chests etc.) over the map
        var newx = 0;
        var newy = 0;
        var ways = 0; //from how many directions we can reach the random spot from
        var state = 0; //the state the loop is in, start with the stairs
        while (state != 10){
            for (var testing = 0; testing < 1000; testing++){
                newx = this.getRand(1, xsize-1);
                newy = this.getRand(1, ysize-2); 
                ways = 4; //the lower the better
                if (this.getCell(newx, newy+1) == MAP_FEATURE.FLOOR || this.getCell(newx, newy+1) == MAP_FEATURE.CORRIDOR){
                    //north
                    if (this.getCell(newx, newy+1) != MAP_FEATURE.DOOR)
                        ways--;
                }
                if (this.getCell(newx-1, newy) == MAP_FEATURE.FLOOR || this.getCell(newx-1, newy) == MAP_FEATURE.CORRIDOR){
                    //east
                    if (this.getCell(newx-1, newy) != MAP_FEATURE.DOOR)
                        ways--;
                }
                if (this.getCell(newx, newy-1) == MAP_FEATURE.FLOOR || this.getCell(newx, newy-1) == MAP_FEATURE.CORRIDOR){
                    //south
                    if (this.getCell(newx, newy-1) != MAP_FEATURE.DOOR)
                        ways--;
                }
                if (this.getCell(newx+1, newy) == MAP_FEATURE.FLOOR || this.getCell(newx+1, newy) == MAP_FEATURE.CORRIDOR){
                    //west
                    if (this.getCell(newx+1, newy) != MAP_FEATURE.DOOR)
                        ways--;
                }
 
                if (state == 0){
                    if (ways == 0){
                        //state 0, let's place a "upstairs" thing
                        this.setCell(newx, newy, MAP_FEATURE.UP_STAIRS);
                        state = 1;
                        break;
                    }
                }
                else if (state == 1){
                    if (ways == 0){
                        //state 1, place a "downstairs"
                        this.setCell(newx, newy, MAP_FEATURE.DOWN_STAIRS);
                        state = 10;
                        break;
                    }
                }
            }
        }
		//consist of adjacency list
		this.spaceManager.makeSpaceLinkedList();
        return true;
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
	
/*
    //random algorithm_third
    Map.prototype.random3 = function () {
        var spaceManager = new SpaceGraph();

        // 1. hole create
        var tx = Math.floor(Math.random() * (this.width - 1));
        var count = parseInt((this.width * this.height) / 10);
        var mapSize = parseInt(this.width * this.height);
        var sumSpaceSize = 0;
        var tetrisBlockArry;
        while (count != 0) {
            tetrisBlockArry = spaceManager.getTetrisBlockArray(tx, this.width, this.height);
            var t_space;
            if (tetrisBlockArry.length == 3 && tetrisBlockArry[2] != 0) {
                var t_space_w = tetrisBlockArry[2] - 2;//each front and back add -1 
                var t_space_h = tetrisBlockArry[1] - tetrisBlockArry[0] - 1; // endY - startY - 2 + 1(to be length)
                var t_space_x;
                var t_space_y = tetrisBlockArry[0] + 1;
                var t_nowStartX, t_nowEndX;
                var canNotBeBlock = false;
                //right side -> left side search for empty space
                for (t_space_x = this.width - 1; t_space_x >= 0; t_space_x--) {
                    t_nowStartX = t_space_x - tetrisBlockArry[2] + 1;
                    t_nowEndX = t_space_x;
                    for (var i = t_nowEndX; i >= t_nowStartX; i--) {
                        if (this.data[t_space_y][i] == 1) {
                            canNotBeBlock = true;
                        }
                    }
                    if (canNotBeBlock) {
                        canNotBeBlock = false;
                        continue;
                    }
                    t_space_x = t_nowStartX + 1;
                    t_space = new Space(t_space_x, t_space_y, t_space_w, t_space_h);
                    sumSpaceSize += tetrisBlockArry[0] * (tetrisBlockArry[2] - tetrisBlockArry[1]);
                    spaceManager.addSpace(t_space);
                    break;
                }

                for (var i = t_space_y; i < t_space_y + t_space_h; i++) {
                    for (var k = t_space_x; k < t_space_x + t_space_w; k++) {
                        this.data[i][k] = 1;
                    }
                }
            }

            if (mapSize < sumSpaceSize) {
                break;
            }
            tx = Math.floor(Math.random() * (this.width - 1));
            count--;
        }
    }
*/

	Map.prototype.addMeshTo = function(scene){
		for(var i =0; i < this.data.length; i++){
			for(var j = 0; j < this.data[i].length; j++){
				if(this.data[i][j] != 2){
					//tile
					var mesh = makeMesh(this.data[i][j]);
					mesh.position.x = 10 * i;
					mesh.position.z = 10 * j;

					this.objList.push(mesh);

					scene.add(mesh);

				} else if(this.data[i][j] == 2) {
					var mesh = makeWalls();
					mesh.position.x = 10 * i;
					mesh.position.z = 10 * j;
					this.objList.push(mesh);

					scene.add(mesh);
				}
			}
		}
	}
	
	var __FLOOR_MAT__;
	function getConst_FLOOR_MAT(){
		if(__FLOOR_MAT__) return  __FLOOR_MAT__;
		var mat = new THREE.Matrix4().makeTranslation(5, -5, 0);
		__FLOOR_MAT__ = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		__FLOOR_MAT__.multiply(mat);
		return __FLOOR_MAT__;
	}

	var __WALLS_MAT__;
	function getConst_WALLS_MAT(){
		if(__WALLS_MAT__) return  __WALLS_MAT__;
		return __WALLS_MAT__ =  new THREE.Matrix4().makeTranslation(5, 5, 5);
	}
	function makeMesh(type){
		var geometry = new THREE.PlaneGeometry(10, 10);
		geometry.applyMatrix(getConst_FLOOR_MAT());

		var material = new THREE.MeshPhongMaterial({
			color : 0xafafaf,
			wireframe : false, 
			map : new THREE.ImageUtils.loadTexture("/resources/texture/floor.png")
		});
		var mesh = new THREE.Mesh(geometry, material);

		mesh.receiveShadow = true;

		return mesh;
	}
	function makeWalls(){
		var geometry = new THREE.CubeGeometry(10, 10, 10);
		geometry.applyMatrix(getConst_WALLS_MAT());
		
		var material = new THREE.MeshPhongMaterial({
			color : 0xffffff,
		   	map : new THREE.ImageUtils.loadTexture("/resources/texture/wall_mini.png")
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	global.Map = Map;
})(this);
