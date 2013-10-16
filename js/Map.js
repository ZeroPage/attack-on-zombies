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
		this.objList = [];
	};
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
		
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff,
		   	map : new THREE.ImageUtils.loadTexture("/resources/texture/wall.jpg")
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	global.Map = Map;
})(this);
