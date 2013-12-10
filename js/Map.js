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

        this.objects = 0;

        this.chanceRoom = 75;
        this.chanceCorridor = 25;

        this.width = 50;
        this.height = 50;
        this.data = [];
        for (var i = 0; i < this.height; i++) {
            this.data[i] = [];
            for (var k = 0; k < this.width; k++) {
                this.data[i][k] = 2;
            }
        }
        this.spaceManager = new SpaceGraph();
        this.createDungeon(100);
        //this.random3();
        this.objList = [];
    };

    
    Map.prototype.setCell = function (x, y, celltype) {
        if (y < 0 || x < 0 || x > this.width || y > this.height)
            return;
       this.data[y][x] = celltype;
    }
    Map.prototype.getCell = function (x, y) {
        if (y < 0 || x < 0 || x > this.width || y > this.height)
            return;
        return this.data[y][x];
    }
	
	
	
	Map.prototype.getMonsterPos = function() {
		var t_space = this.spaceManager.node;
        var index;
        while (true) {
            index = rand(0, t_space.length - 1);
			var x = parseInt(((2*t_space[index].x) + t_space[index].width) / 2);
			var y = parseInt(((2*t_space[index].y) + t_space[index].height) / 2);
			if((this.data[x][y] == 1)&&(this.hero_node != index)) {
				break;
			}
        }
		x = (x * 10) + 5;
		y = (y * 10) + 5;
        return [x, y, index];
	}
    Map.prototype.getHeroXY = function () {
        var t_space = this.spaceManager.node;
        while (true) {
            var index = rand(0, t_space.length - 1);
			var x = parseInt(((2*t_space[index].x) + t_space[index].width) / 2);
			var y = parseInt(((2*t_space[index].y) + t_space[index].height) / 2);
            if (this.data[x][y] == 1) {
                this.hero_node = index;
                break;
            }
        }
        return new Point(x, y);
    }
    Map.prototype.makeCorridor = function (x, y, length, direction) {
        var len = rand(MAP_SIZE.CORRIDOR_MIN_LENGTH, length);
        var floor = MAP_FEATURE.CORRIDOR;
        var dir = 0;
        if (direction > 0 && direction < 4) dir = direction;

        var xtemp = 0;
        var ytemp = 0;
        var xsize = this.width - 1;
        var ysize = this.height - 1;

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
        var xlen = rand(MAP_SIZE.ROOM_MIN_WIDTH, xlength);
        var ylen = rand(MAP_SIZE.ROOM_MIN_HEIGHT, ylength);
        var floor = MAP_FEATURE.FLOOR;
        var wall = MAP_FEATURE.WALL;
        var dir = 0;
        var ysize = this.height - 1;
        var xsize = this.width - 1;
        if (direction > 0 && direction < 4) dir = direction;

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

    Map.prototype.createDungeon = function (inobj) {
		this.objects = inobj < 1 ? 10 : inobj;
        
        var xsize = this.width;
        var ysize = this.height;
		
        for (var y = 0; y < ysize; y++){
            for (var x = 0; x < xsize; x++){
                if (y == 0) this.setCell(x, y, MAP_FEATURE.WALL);
                else if (y == ysize-1) this.setCell(x, y, MAP_FEATURE.WALL);
                else if (x == 0) this.setCell(x, y, MAP_FEATURE.WALL);
                else if (x == xsize-1) this.setCell(x, y, MAP_FEATURE.WALL);
                else this.setCell(x, y, MAP_FEATURE.WALL);
            }
        }
        this.makeRoom(parseInt(xsize/2), parseInt(ysize/2), MAP_SIZE.ROOM_MAX_WIDTH, MAP_SIZE.ROOM_MIN_HEIGHT, rand(0,3));

        var currentFeatures = 1;
 
        for (var countingTries = 0; countingTries < 1000; countingTries++){
            if (currentFeatures == this.objects){
                break;
            }

            var newx = 0;
            var xmod = 0;
            var newy = 0;
            var ymod = 0;
            var validTile = -1;
           
            for (var testing = 0; testing < 1000; testing++){
                newx = rand(1, xsize-1);
                newy = rand(1, ysize-1);
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
                var feature = rand(0, 100);
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

        //sprinkle out the bonusstuff (stairs, chests etc.) over the map
        var newx = 0;
        var newy = 0;
        var ways = 0; //from how many directions we can reach the random spot from
        var state = 0; //the state the loop is in, start with the stairs
        while (state != 10){
            for (var testing = 0; testing < 1000; testing++){
                newx = rand(1, xsize-1);
                newy = rand(1, ysize-2); 
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
		
		for(var i=0; i<this.height; i++) {
			for(var j=0; j<this.width; j++) {
				var temp = this.data[i][j];
				this.data[i][j] = this.data[j][i];
				this.data[j][i] = temp;
			}
		}
		
		//consist of adjacency list
		this.spaceManager.makeSpaceLinkedList();
        return true;
    }

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

	function rand(min, max){
		var n = max - min;
        var i = Math.floor(Math.random() * n);
        if (i < 0)
            i = -i;
        return min + i;
	}

	global.Map = Map;
})(this);
