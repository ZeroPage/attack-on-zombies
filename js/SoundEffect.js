function SoundEffect(source){
		
	if(!window.audioContext){
		audioContext = new webkitAudioContext;
	}
	
	var that = this;	
	that.source = source;
	that.buffer = null;
	that.isLoaded = false;
	that.loop = false;
	
	var getSound = new XMLHttpRequest();
	getSound.open("GET", that.source, true);
	getSound.responseType = "arraybuffer";
	getSound.onload = function(){
		audioContext.decodeAudioData(getSound.response, function(buffer){
			that.buffer = buffer;
			that.isLoaded = true;
			if(that.source === "sound/Background.mp3"){
				that.loop = true;
				
			}
		});
	}	
	getSound.send();
}

SoundEffect.prototype.play = function(){
	if(this.isLoaded === true){
		var playSound = audioContext.createBufferSource();
		playSound.buffer = this.buffer;
		playSound.loop = this.loop;
		playSound.connect(audioContext.destination);
		playSound.noteOn(0);
		this.isPlay = true;
	}
}