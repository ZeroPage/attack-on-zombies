AudioContext = window.AudioContext || webkitAudioContext;
(function(){
	window.onload = function(){
		
		var scripts = [
			"/js/Game.js",
			"/js/Point.js",
			"/js/KeyBinder.js",
			"/js/three.js",
			"/js/Map.js",
			"/js/Controller.js",
			"/js/Hero.js",
			"/js/ResourceManager.js",
			"/js/Window.js",
			"/js/SoundEffect.js",
			"/js/Gun.js",
			"/js/Bullet.js",
			"/js/Zombie.js",
			"/js/Monster.js",
			"/js/SpaceGraph.js"
		];
		loadScripts(scripts, onReady);

		function onReady(filepath){
			var resourceManager = new ResourceManager();
			resourceManager.load({
					models : {
						Hero : "models/player.js",
						Test : "models/editable-person.js",
						Zombie : "models/zombie.js"
					},
					sounds : {
						Background : "sound/Background.mp3",
						Walk : "sound/Walk.mp3",
						Bullet : "sound/Bullet.mp3"
					}
				}, function(){
				console.log("staring App...");
				new Game(window.innerWidth, window.innerHeight);	
			});
		}
	}

	function loadScript(filepath, callback){
		var e = document.createElement("script");
		e.setAttribute("defer", "defer");
		e.setAttribute("async", "async");
		e.setAttribute("src", filepath);
		e.addEventListener("load", function(){
			callback && callback(filepath);
		})

		console.log("Load " + filepath);
		
		document.getElementById("scripts").appendChild(e);
	}

	function loadScripts(scriptsName, callback){
		var count = 0;

		for(var i = 0; i < scriptsName.length; i++){
			loadScript(scriptsName[i], onReady);
		}

		function onReady(filepath){
			count++;
			console.log(filepath + " is Ready!");

			if(count >= scriptsName.length){
				callback && callback();
			}
		}
	}
})();
