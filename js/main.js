navigator.getUserMedia = ( navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var capture, movie, filmstrip;
var g_movie;
var bt_capture, bt_play, bt_movie;

var films = [];
var index = 0;
var frame_count = 0;
var interval = 10;
var brange;
var mrange;
var rrange;

var random = function(min, max) {
	return min + Math.random() * (max - min);	
};

var initCapture = function() {
	navigator.getUserMedia( {video: true}, function(stream) {
		var url = URL.createObjectURL(stream);
		capture.src = url;
	});
};

var doCapture = function() {
	var g = document.createElement('canvas').getContext('2d');
	g.canvas.width = capture.videoWidth;
	g.canvas.height = capture.videoHeight;
	g.canvas.className = 'film';
	g.drawImage(capture, 0, 0);

	
	filmstrip.appendChild(g.canvas);
	films.push(g.canvas);
};

var clearFilms = function() {
	while(filmstrip.childNodes.length > 0) {
		filmstrip.removeChild(filmstrip.childNodes[0]);
	}
	
	while(films.length > 0) {
		films.shift();
	}
	index = 0;
};

var draw = function(g) {
	if(films.length > 0) {
		g.drawImage(films[index], 0, 0);		
		if(frame_count % interval === 0 && bt_play.checked) {
			if(bt_random.checked) {
				index = Math.floor(random(0, films.length));	
			}
			else {
				index++;	
			}
			
			if(index > films.length - 1) {
				index = 0;
			}
		}
	}
	frame_count++;
};


function blur() {
	movie.style['-webkit-filter'] = 'blur(' + brange.value + 'px)';
};

function rotate() {
	rv = rrange.value*18;
	movie.style['-webkit-transform'] = 'rotateY(' + rv + 'deg)';
};

function mask() {
	movie.style['-webkit-mask-image'] = 'url(../webcamtest/img/mask.png)';
	var x = 133 + mrange.value*17;
	var y = 100 + mrange.value*12;
	movie.style['-webkit-mask-position'] = 'center';
	movie.style['-webkit-mask-repeat'] = 'no-repeat';
	movie.style['-webkit-mask-size'] = x + 'px ' + y + 'px';
};

var loop = function() {
	draw(g_movie);
	requestAnimationFrame(loop);	
};

var init = function() {
	brange = document.querySelector('#brange');
	mrange = document.querySelector('#mrange');
	rrange = document.querySelector('#rrange');
	capture = document.querySelector('#capture');
	movie = document.querySelector('#movie');
	movie.style.position = 'relative';
	filmstrip = document.querySelector('#filmstrip');
	
	g_movie = movie.getContext('2d');
	
	bt_capture = document.querySelector('#bt-capture');
	bt_clear = document.querySelector('#bt-clear');
	bt_play = document.querySelector('#bt-play');
	bt_random = document.querySelector('#bt-random');
	
	bt_capture.onclick = doCapture;
	bt_clear.onclick = clearFilms;
	
	initCapture();
	
	movie.height = 480;
	movie.width = 640;

	mask();

	brange.onchange = function() {
		blur();
	};
	
	mrange.onchange = function() {
		mask();
	};

	rrange.onchange = function() {
		rotate();
	};
};



window.onload = function() {
	init();
	loop();
};