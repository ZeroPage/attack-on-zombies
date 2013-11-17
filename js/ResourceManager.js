(function(global){
	var models = {};
	var loader;

	function ResourceManager(){
		if(!loader) loader = new THREE.JSONLoader();
	}

	ResourceManager.prototype.load = function(names, callback){
		var numOfnames = 0;
		var count = 0;

		for(name in names){
			numOfnames++;
			loadModel(name, names[name]);
		}

		function loadModel(name, path){
			loader.load(path, function(geometry, material){
				var material = new THREE.MeshFaceMaterial(material);
				models[name] = new THREE.SkinnedMesh(geometry, material);
				complete();
			});
		}
		function complete(){
			count++;
			if(numOfnames <= count) callback && callback();
		}
	}
	ResourceManager.prototype.getModel = function(name){
		return models[name];
	}
	
	global.ResourceManager = ResourceManager;
})(this);
