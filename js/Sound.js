function Sound(source){
		
	if(!window.audioContext){
		audioContext = new webkitAudioContext;
	}
	
	var that = this;	
	that.source = source;
	that.buffer = null;
	that.isLoaded = false;
	
	var getSound = new XMLHttpRequest();
	getSound.open("GET", that.source, true);
	getSound.responseType = "arraybuffer";
	getSound.onload = function(){
		audioContext.decodeAudioData(getSound.response, function(buffer){
			that.buffer = buffer;
			that.isLoaded = true;
		}, onError);
	}	
	getSound.send();
}

Sound.prototype.play = function(){
	if(this.isLoaded === true){
		var playSoundd = audioContext.createBufferSource();
		playSound.buffer = this.buffer;
		playSound.connect(audioContext.destination);
		playSound.noteOn(0);
	}
}