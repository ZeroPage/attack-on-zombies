(function(global){
	var models = {};
	var sounds = {};
	var loader;

	function ResourceManager(){
		if(!loader) loader = new THREE.JSONLoader();
	}

	ResourceManager.prototype.load = function(list, callback){
		var numOfnames = 0;
		var count = 0;

		for(var name in list.models || {}){
			numOfnames++;
			loadModel(name, list.models[name]);
		}
		for(var name in list.sounds || {}){
			numOfnames++;
			loadSound(name, list.sounds[name]);
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
		
		function loadSound(name, path){
			console.log("Load sound : " + name);
			var ajax = new XMLHttpRequest();
			var audioContext;
			if(!window.audioContext){
				audioContext = new webkitAudioContext;
			} else {
				console.error("can't find AudioContext!");
			}
			ajax.open("GET", that.source, true);
			ajax.responseType = "arraybuffer";
			ajax.onload = function(){
				audioContext.decodeAudioData(ajax.response, function(buffer){
					sounds[name] = buffer;
					complete();
				});
			}	
			ajax.send();
			
		}
		function complete(){
			count++;
			if(numOfnames <= count) callback && callback();
		}
	}
	ResourceManager.prototype.getModel = function(name){
		return models[name];
	}
	ResourceManager.prototype.getSound = function(name){
		return sounds[name];
	}
	global.ResourceManager = ResourceManager;
})(this);
