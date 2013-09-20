(function(global){
	function Map(){
		//Random map 
		this.data = [
			[ 1, 1, 1, 1, 1, 1, 1],
			[ 1, 1, 1, 1, 1, 1, 1],	
			[ 1, 1, 2, 1, 2, 1, 1],
			[ 1, 1, 1, 1, 2, 1, 1],
			[ 1, 1, 1, 2, 2, 1, 1],
			[ 1, 1, 1, 1, 1, 1, 1],
		];
	};
	Map.prototype.addMeshTo = function(scene){
		//tile
		for(var i =0; i < this.data.length; i++){
			for(var j = 0; j < this.data[i].length; j++){
				if(this.data[i][j] != 2){
					//tile
					var mesh = makeMesh(this.data[i][j]);
					mesh.position.z = 10 * i;
					mesh.position.x = 10 * j;

					scene.add(mesh);

				} else if(this.data[i][j] == 2) {
					//wall
					var wall;
					if(this.data[i-1][j] != 2){
						wall = makeWall("N");

						wall.position.set(10*j, 0, 10*i);

						scene.add(wall);
					} 
					if(this.data[i+1][j] != 2){
						wall = makeWall("S");
						
						wall.position.set(10*j, 0, 10*i);

						scene.add(wall);
					}
					if(this.data[i][j-1] != 2){
						wall = makeWall("W");

						wall.position.set(10*j, 0, 10*i);

						scene.add(wall);
					}
					if(this.data[i][j+1] != 2){
						wall = makeWall("E");

						wall.position.set(10*j, 0, 10*i);

						scene.add(wall);
					}
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
	var __WALL_MAT__;
	var __WALL_EAST_MAT__;
	var __WALL_NORTH_MAT__;
	var __WALL_WEST_MAT__;
	var __WALL_SOUTH_MAT__
	function getConst_WALL_MAT(direction){
		switch(direction){
			case "N":
			case "NORTH":
				if(__WALL_NORTH_MAT__) return __WALL_NORTH_MAT__;
				return __WALL_NORTH_MAT__ = new THREE.Matrix4().makeTranslation(5,5,0);
				break;
			case "W":
			case "WEST":
				if(__WALL_WEST_MAT__) return __WALL_WEST_MAT__;
				var mat = new THREE.Matrix4().makeTranslation(-5,5,0);
				__WALL_WEST_MAT__ = new THREE.Matrix4().makeRotationY(Math.PI/2);
				__WALL_WEST_MAT__.multiply(mat);
				return __WALL_WEST_MAT__;
				break;
			case "S":
			case "SOUTH":
				if(__WALL_SOUTH_MAT__) return __WALL_SOUTH_MAT__;
				return __WALL_SOUTH_MAT__ = new THREE.Matrix4().makeTranslation(5,5,10);
				break;
			case "E":
			case "EAST":
				if(__WALL_EAST_MAT__) return __WALL_EAST_MAT__;
				var mat = new THREE.Matrix4().makeTranslation(-5,5,10);
				__WALL_EAST_MAT__= new THREE.Matrix4().makeRotationY(Math.PI/2);
				__WALL_EAST_MAT__.multiply(mat);
				return __WALL_EAST_MAT__;
				break;
			default :
				if(__WALL_MAT__) return __WALL_MAT__;
				return __WALL_MAT__ = new THREE.Matrix4().makeTranslation(5,0,0);
				break;
		}
	}
	function makeMesh(type){
		var geometry = new THREE.PlaneGeometry(10, 10);
		geometry.applyMatrix(getConst_FLOOR_MAT());

		var material 
		switch(type){
			case 1:
				material = new THREE.MeshPhongMaterial({color : 0xffff0f, wireframe : false});
			break;
			case 2:
				material = new THREE.MeshPhongMaterial({color : 0xff0fff, wireframe : false});
			break;
			default :
				material = new THREE.MeshPhongMaterial({color : 0xffffff, wireframe : false});
		}
		var mesh = new THREE.Mesh(geometry, material);

		mesh.receiveShadow = true;

		return mesh;
	}
	function makeWall(direction){
		var geometry = new THREE.CubeGeometry(10, 10, 0.2);
		geometry.applyMatrix(getConst_WALL_MAT(direction));
		
		var material = new THREE.MeshLambertMaterial({color : 0xffff00, wireframe : false});
		
		var mesh = new THREE.Mesh(geometry, material);

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	global.Map = Map;
})(this);
