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
			var material = new THREE.MeshPhongMaterial({color:0xffffff});

			loader.load(path, function(geometry){
				models[name] = new THREE.Mesh(geometry, material);
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
