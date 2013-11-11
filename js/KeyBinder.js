function KeyBinder(element){
	var that = this;
		
	element.addEventListener("mousemove", function(e){
		that.onMouseMove(e);
	});
	element.addEventListener("keydown", function(e){
		that.onKeyDown(e);
	});
	element.addEventListener("keyup", function(e){
		that.onKeyUp(e);
	});
	element.addEventListener("mousedown", function(e){
		that.onKeyDown(e);
	});
	element.addEventListener("mouseup", function(e){
		that.onKeyUp(e);
	});

	this.pressed = {};
	this.keymap = {};
}
KeyBinder.prototype.onMouseMove = function(e){
	this.pos = new Point(e.x - e.srcElement.offsetLeft, e.y - e.srcElement.offsetTop);
}
KeyBinder.prototype.onKeyDown = function(e){
	var key = this.translate(e);
	if(!this.pressed[key] && this.keymap[key] && !this.keymap[key].contiued){
		this.keymap[key].func(e, this.pos);
	}
	this.pressed[key] = true;
}
KeyBinder.prototype.onKeyUp = function(e){
	var key = this.translate(e);
	delete this.pressed[key];
}
KeyBinder.prototype.check = function(deltaTime){
	for(var key in this.pressed){
		if(this.pressed[key] && this.keymap[key] && this.keymap[key].contiued){
			this.keymap[key].func(deltaTime, this.pos);
		}
	}
}

KeyBinder.prototype.bindKey = function(keyName, func, contiued){
	this.keymap[keyName] = {contiued : contiued, func : func};
}
KeyBinder.prototype.unbindKey = function(keyName){
	delete this.keyMap[keyName];
}
KeyBinder.prototype.translate = function(e){
	if(e.keyCode == 0){
		switch(e.button){
			case 0 :
				return "LBUTTON";
			case 1 :
				return "MBUTTON";
			case 2 :
				return "RBUTTON";
		}
	}

	if(e.keyCode >= 'A'.charCodeAt(0) && e.keyCode <= 'Z'.charCodeAt(0))
		return String.fromCharCode(e.keyCode);
	if(e.keyCode >= '0'.charCodeAt(0) && e.keyCode <= '9'.charCodeAt(0))
		return String.fromCharCode(e.keyCode);
	if(e.keyCode >= 112 && e.keyCode <= 123)
		return "F" + (e.keycode - 111);
	
	return KeyBinder.keyCode[e.keyCode] || console.error("KeyBinder", "Cannot handle key code " + e.keyCode);
}
KeyBinder.keyCode = {
	 8 : "BACKSPACE"  ,  9 : "TAB"     , 13 : "RETURN",  16 : "SHIFT"  ,  17 : "CTRL"  , 18 : "ALT",
	19 : "PAUSE"      , 20 : "CAPSLOCK", 27 : "ESC"   ,  32 : "SPACE"  ,  33 : "PAGEUP", 34 : "PAGEDOWN",
	35 : "END"        , 36 : "HOME"    , 37 : "LEFT"  ,  38 : "UP"     ,  39 : "RIGHT" , 40 : "DOWN",
	44 : "PRINTSCREEN", 45 : "INSERT"  , 46 : "DELETE", 144 : "NUMLOCK", 145 : "SCROLLLOCK", 

	186 : ";", 187 : "=", 188 : "," , 189 : "-", 190 : ".", 191 : "/",
	192 : "`", 219 : "[", 220 : "\\", 221 : "]", 222 : "'"
}
