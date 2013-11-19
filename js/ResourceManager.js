(function(global){
	var models = {};
	var loader;

	function ResourceManager(){
		if(!loader) loader = new THREE.JSONLoader();
	}

	ResourceManager.prototype.load = function(names, callback){
		var numOfnames = 0;
		var count = 0;

		for(var name in names){
			numOfnames++;
			loadModel(name, names[name]);
		}

		function loadModel(name, path){
			console.log("Load model : " + name);
			loader.load(path, function(geometry, material){
				var material = new THREE.MeshFaceMaterial(material);
				models[name] = new THREE.SkinnedMesh(geometry, material);
				
				//add animation to Handler
				for(var i = 0; i < models[name].geometry.animations.length; i++){
					THREE.AnimationHandler.add(models[name].geometry.animations[i]);	
				}
				
				var materials = models[name].material.materials;
				for(var i = 0; i <materials.length; i++){
					materials[i].skinning = true;
				}
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
