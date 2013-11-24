//audio contex
(function(global){
	var audioContext = new AudioContext();

	function SoundEffect(name, loop){
		this.buffer = new ResourceManager().getSound(name);
		this.loop = loop;
	
		this.isPlay = false;		
	}
	SoundEffect.prototype.play = function(){
		if(this.isPlay) return;
		
		var that = this;
		
		var playSound = audioContext.createBufferSource();
		playSound.buffer = this.buffer;
		playSound.loop = this.loop;
		playSound.connect(audioContext.destination);
		playSound.noteOn(0);
		this.isPlay = true;

		//playSound.onended = onEnd;
		if(!this.loop){
			setTimeout(onEnd, this.buffer.duration * 1000);	
		}
		
		function onEnd(){
			that.isPlay = false;
		}
	}
	
	SoundEffect.decode = function(data, callback){
		audioContext.decodeAudioData(data, callback);
	}
	global.SoundEffect = SoundEffect;
})(this);

