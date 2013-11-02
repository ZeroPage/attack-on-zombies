(function(global){

function Map() {
    //Random map
    this.width = 50;
    this.height = 50;
    this.data = new Array();
    for (var i = 0; i < this.height; i++) {
        this.data[i] = new Array();
        for (var k = 0; k < this.width; k++) {
            this.data[i][k] = 2;
        }
    }
	this.random3();
	this.objList = [];
};

function Space(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.isolated = true;
};

function SpaceGraph() {
    this.node = new Array(); // space
    this.link = new Array(); // road
    this.adjList = new Array(); // adjection list
};


SpaceGraph.prototype.getTetrisBlockArray = function (x, width, height) {
    var blockWidth;
    if (width - x >= 3) {
        blockWidth = Math.floor(Math.random() * (width/4)) + 3;
    } else {
        blockWidth = 0;
    }

    var blockCoordinate = new Array();
    var limit_Y = parseInt(height/4);
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
    if(!a || !b)
        return;
    for (var i = 0; i < this.adjList.length; i++) {
        if (this.adjList[i][0] == a && this.adjList[i][1] == b) {
            return;
        }
        else if (this.adjList[i][0] == b && this.adjList[i][1] == a) {
            return;
        }
    }
    var list = [a,b];
    this.adjList.push(list);
}

SpaceGraph.prototype.addSpace = function (space) {
    if(!space)
        return;
    this.node.push(space);
}

SpaceGraph.prototype.addRoad = function (road) {
    if(!road)
        return;
    this.link.push(road);
}


//random algorithm_third
//테트리스 방법.
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
            
        if(mapSize < sumSpaceSize) {
            break;
        }
        tx = Math.floor(Math.random() * (this.width - 1));
        count--;
    }
}
	Map.prototype.addMeshTo = function(scene){
		for(var i =0; i < this.data.length; i++){
			for(var j = 0; j < this.data[i].length; j++){
				if(this.data[i][j] != 2){
					//tile
					var mesh = makeMesh(this.data[i][j]);
					mesh.position.z = 10 * i;
					mesh.position.x = 10 * j;

					this.objList.push(mesh);

					scene.add(mesh);

				} else if(this.data[i][j] == 2) {
					var mesh = makeWalls();
					mesh.position.z = 10 * i;
					mesh.position.x = 10 * j;
					
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

		var material = new THREE.MeshLambertMaterial({
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
		
		var material = new THREE.MeshLambertMaterial({
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
