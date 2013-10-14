	var backgroundSound	= "sound/background.mp3";	// MP3 FILE
	
	var audiowidth	= "300"							// WIDTH OF PLAYER
	var borderw		= "2"							// BORDER AROUND PLAYER WIDTH
	var bordcolor	= "0066FF"						// BORDER COLOR
	var loopsong	= "yes"							// LOOP MUSIC | yes | no |

	if (loopsong === "yes") {
		var looping5="loop";
		var loopingE="true";
	}
	else{
		var looping5="";
		var loopingE="false";
	}
	document.write('<audio autoplay="autoplay">');
	document.write('<source src="'+backgroundSound+'" type="audio/mpeg">');
	document.write('<!--[if lt IE 9]>');
	document.write('<bgsound src="'+backgroundSound+'" loop="1">');
	document.write('<![endif]-->');
	document.write('</audio>');