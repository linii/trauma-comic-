var mic, recorder, soundFile;
var origSize, size, counter;
var multiplier = 1.75;
var volMult = 0.3;
var img, x, y, posX, posY;

var s = ["speak the words on the screen",
		"speak", "talk", "sing", "whisper", "breathe", "laugh", "cry", "yell", "remember",
		"feel", "be still",
		"play music"];

var arr = [];

function setup() {
	noCursor();
	createCanvas(windowWidth, windowHeight);

	inputArchive();
	img = loadImage("art1.jpg");
	init();

	new Text().display();
}

function init() {
	counter = 0;

	origSize = windowWidth/3;
	size = origSize;

	posX = windowWidth/2 - size/2;
	posY = windowHeight/2 - size/2;

	x = random(0, img.width);
	y = random(0, img.height);
}

function draw() {
	frameRate(60);
	display(mic.getLevel());
	counter += 1;
}

function Text(x, y) {
	this.action = random(s);
	this.particle = "to interact";
}

Text.prototype.display = function() {
	textSize(20);
	fill("red");
	text(this.action, windowWidth/10, windowHeight/15)
	fill("gray");
	text(this.particle, windowWidth/10, windowHeight/10);
}

function inputArchive() {
	mic = new p5.AudioIn();
	mic.start();
}

function display (vol) {
	if (vol * size > 0.10 && !keyIsPressed) {
		console.log("key is pressed")
		counter = 0;
		frameRate(20);
	}

	size = max(0, (origSize - counter/3) + vol * size * volMult);
	
	strokeWeight(0.4);
	noFill();

	for (var i = 0; i < 10; i++) {
		var disp1 = random(-1, 1) * randomGaussian(vol * size);
		var disp2 = random(-1, 1) * randomGaussian(vol * size);

		x += disp1 * 2;
		y += disp2 * 2;

		var imgSize = size * multiplier;

		console.log(vol)
		rect(disp1 + posX, disp2 + posY, size, size);
		image(img,
			disp1+posX,
			disp2+posY,
			size, size,
			min(x, img.width - imgSize),
			min(y, img.height - imgSize),
			imgSize, imgSize );
	}
	// check for bounds
	if (x > img.width || x < 0)
		x = random(0, img.width - size);
	if (y > img.height || y < 0)
		y = random(0, img.height - size);
}

function startArchive() {
	recorder = new p5.SoundRecorder();
	recorder.setInput(mic);
	soundFile = new p5.SoundFile();
	recorder.record(soundFile);
}

function completed() {
	recorder.stop();
	save(soundFile, 'remembered on ' +
		year() + '_' + month() + '_' + day() + '_' + hour() + '_' + minute() +
		'.wav');
}

function endDirection() {
	textSize(12);
	fill("white");
	text("press any key to exit", 100, 100);
}

function touchStarted() {
	if (getAudioContext().state !== 'running') {
		getAudioContext().resume();
	}
}
