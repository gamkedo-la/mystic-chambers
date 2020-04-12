var AUDIO_DEBUG = false;
var audioTestLocation = vec2(0, 0);

//Sound IDs
const REVERB = 0;
const SOUND_NOAMMO = 1;

var soundsList = [
	"audio/reverb3.wav",
	"audio/noAmmo.mp3",
];

var sounds = [];

//--//Constants---------------------------------------------------------------
const VOLUME_INCREMENT = 0.1;
const CROSSFADE_TIME = 0.25;
const DROPOFF_MIN = 20;
const DROPOFF_MAX = 400;
const REVERB_MAX = 5;
const BEHIND_THE_HEAD = 0.5;

var audio = new AudioGlobal();

function AudioGlobal() {

	var initialized = false;
	var audioCtx;
	var musicBus, soundEffectsBus, masterBus;
	var musicVolume, soundEffectsVolume;
	var currentMusicTrack;
	var currentSoundSources = [];

//--//Set up WebAudioAPI nodes------------------------------------------------
	this.init = function() {
		if (initialized) return;

		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.context = audioCtx;
		this.audioListener = audioCtx.listener;
		musicBus = audioCtx.createGain();
		soundEffectsBus = audioCtx.createGain();
		masterBus = audioCtx.createGain();

		audio.loadSounds();

		musicVolume = 0.7;
		soundEffectsVolume = 0.7;

		musicBus.gain.value = musicVolume;
		soundEffectsBus.gain.value = soundEffectsVolume;

		musicBus.connect(masterBus);
		soundEffectsBus.connect(masterBus);
		masterBus.connect(audioCtx.destination);

		initialized = true;
	};

	this.update = function() {
		if (!initialized) audio.init();

		now = audioCtx.currentTime;
		//if (!AUDIO_DEBUG) {
			currentSoundSources = currentSoundSources.filter(function(referance){
				return referance.endTime > now && !referance.source.loop;
			}); //Removed completed sounds.  temporarally removed
		//}

		for (var i in currentSoundSources) {
			currentSoundSources[i].volume.gain.setValueAtTime(calcuateVolumeDropoff(currentSoundSources[i].pos), now);
			currentSoundSources[i].pan.pan.setValueAtTime(calcuatePan(currentSoundSources[i].pos), now);
		}
	};

	this.draw = function(off) {
		let v1 = vec2(0,0);
		let v2 = vec2(0,0);

		for (var i in currentSoundSources) {
			v1.x = currentSoundSources[i].pos.x - off.x;
			v1.y = currentSoundSources[i].pos.y - off.y;
			v2.x = currentPlayerX - off.x;
			v2.y = currentPlayerY - off.y;
			drawLine(renderer, v1, v2, "#FFFFFF");
			drawRect(renderer, vec2(v1.x-2, v1.y-2), vec2(5, 5), true, "#FFFFFF", false);
		}

		for (var i in currentAudGeo) {
			v1.x = currentAudGeo[i].point.x - off.x;
			v1.y = currentAudGeo[i].point.y - off.y;
			v2.x = currentPlayerX - off.x;
			v2.y = currentPlayerY - off.y;

			if(lineOfSight(currentAudGeo[i].point, currentPlayerPos)) {
				drawLine(renderer, v1, v2, "#885088");
			}

			for (var j in currentAudGeo[i].connections) {
				var index = currentAudGeo[i].connections[j];
				v2.x = currentAudGeo[index].point.x - off.x;
				v2.y = currentAudGeo[index].point.y - off.y;
				drawLine(renderer, v1, v2, "#885088");
			}

			drawRect(renderer, vec2(v1.x-2, v1.y-2), vec2(5, 5), true, "#885088", false);
		}
	};

//--//volume handling functions-----------------------------------------------
	this.toggleMute = function() {
		if (!initialized) return;

		var newVolume = (masterBus.gain.value === 0 ? 1 : 0);
		masterBus.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.03);

		return newVolume;
	};

	this.setMute = function(tOrF) {
		if (!initialized) return;

		var newVolume = (tOrF === false ? 1 : 0);
		masterBus.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.03);

		return tOrF;
	};

	this.setMusicVolume = function(amount) {
		if (!initialized) return;

		musicVolume = amount;
		if (musicVolume > 1.0) {
			musicVolume = 1.0;
		} else if (musicVolume < 0.0) {
			musicVolume = 0.0;
		}
		musicBus.gain.setTargetAtTime(Math.pow(musicVolume, 2), audioCtx.currentTime, 0.03);

		return musicVolume;
	};

	this.setSoundEffectsVolume = function(amount) {
		if (!initialized) return;

		soundEffectsVolume = amount;
		if (soundEffectsVolume > 1.0) {
			soundEffectsVolume = 1.0;
		} else if (soundEffectsVolume < 0.0) {
			soundEffectsVolume = 0.0;
		}
		soundEffectsBus.gain.setTargetAtTime(Math.pow(soundEffectsVolume, 2), audioCtx.currentTime, 0.03);

		return soundEffectsVolume;
	};

	this.turnVolumeUp = function() {
		if (!initialized) return;

		this.setMusicVolume(musicVolume + VOLUME_INCREMENT);
		this.setSoundEffectsVolume(soundEffectsVolume + VOLUME_INCREMENT);
	};

	this.turnVolumeDown = function() {
		if (!initialized) return;

		this.setMusicVolume(musicVolume - VOLUME_INCREMENT);
		this.setSoundEffectsVolume(soundEffectsVolume - VOLUME_INCREMENT);
	};

//--//Audio playback classes--------------------------------------------------
	this.play1DSound = function(buffer, mixVolume = 1, rate = 1) {
		if (!initialized) return;

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();

		source.connect(gainNode);
		gainNode.connect(soundEffectsBus);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value = mixVolume;
		source.start();

		source.onended = function(evt) {
			source.buffer = null;
		}

		return {source: source, volume: gainNode};
	};

	this.play3DSound = function(buffer, location,  mixVolume = 1, rate = 1) {
		return play3DSound5(buffer, location,  mixVolume, rate);
	};

	function play3DSound1(buffer, location,  mixVolume = 1, rate = 1) {//3d panning and volume
		if (!initialized) return;

		if (currentPlayerPos.distance(location) >= DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(location);
		panNode.pan.value = calcuatePan(location);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		source.start();

		source.onended = function() {
			source.buffer = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: location, endTime: audioCtx.currentTime+source.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound2(buffer, location,  mixVolume = 1, rate = 1) {// +Occlusion
		if (!initialized) return;

		if (lineOfSight(location, currentPlayerPos)) {
			return false;
		}
		if (currentPlayerPos.distance(location) >= DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(location);
		panNode.pan.value = calcuatePan(location);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		source.start();

		source.onended = function() {
			source.buffer = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: location, endTime: audioCtx.currentTime+source.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound3(buffer, location,  mixVolume = 1, rate = 1) {// +Occlusion and reverb
		if (!initialized) return;

		if (lineOfSight(location, currentPlayerPos)) {
			return false;
		}
		if (currentPlayerPos.distance(location) >= DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();
		var verbMixNode = audioCtx.createGain();
		var verbNode = audioCtx.createConvolver();

		source.connect(gainNode);
		source.connect(verbMixNode);
		verbMixNode.connect(verbNode);
		verbNode.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(location);
		verbMixNode.gain.value = calcuateReverbPresence(location);
		panNode.pan.value = calcuatePan(location);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		verbNode.buffer = sounds[REVERB];
		source.start();

		source.onended = function() {
			source.buffer = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: location, endTime: audioCtx.currentTime+source.buffer.duration+verbNode.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound4(buffer, location,  mixVolume = 1, rate = 1) {// +Propogation
		if (!initialized) return;

		var pos = calculatePropogationPosition(location);
		if (currentPlayerPos.distance(pos) >= DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(pos);
		panNode.pan.value = calcuatePan(pos);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		source.start();

		source.onended = function() {
			source.buffer = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: pos, endTime: audioCtx.currentTime+source.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound5(buffer, location,  mixVolume = 1, rate = 1) {// +Propogation and reverb
		if (!initialized) return;

		var pos = calculatePropogationPosition(location);
		if (currentPlayerPos.distance(pos) >= DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();
		var verbMixNode = audioCtx.createGain();
		var verbNode = audioCtx.createConvolver();

		source.connect(gainNode);
		source.connect(verbMixNode);
		verbMixNode.connect(verbNode);
		verbNode.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(pos);
		verbMixNode.gain.value = calcuateReverbPresence(pos);
		panNode.pan.value = calcuatePan(pos);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		verbNode.buffer = sounds[REVERB];
		source.start();

		source.onended = function() {
			source.buffer = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: pos, endTime: audioCtx.currentTime+source.buffer.duration+verbNode.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	this.playMusic = function(buffer, fadeIn = false) {
		if (!initialized) return;

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();

		source.connect(gainNode);
		gainNode.connect(musicBus);

		source.buffer = buffer;

		source.loop = true;

		if (currentMusicTrack != null) {
			currentMusicTrack.volume.gain.setTargetAtTime(0, audioCtx.currentTime, CROSSFADE_TIME);
			currentMusicTrack.sound.stop(audioCtx.currentTime + CROSSFADE_TIME);
		}

		if (fadeIn) {
			gainNode.gain.value = 0;
			gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, CROSSFADE_TIME);
		}

		source.start();
		currentMusicTrack = {sound: source, volume: gainNode};

		return {sound: source, volume: gainNode};
	};

	this.loadBGMusic = function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.context.decodeAudioData(request.response, function(buffer) {
				audio.playMusic(buffer);
			});
		};
		request.send();
	};

	this.loadMusicEvent = function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.context.decodeAudioData(request.response, function(buffer) {
				audio.duckMusic(buffer.duration);
				audio.play1DSound(buffer);
			});
		};
		request.send();
	};

	this.loadSounds = function(id = 0) {
		var request = new XMLHttpRequest();
		request.open('GET', soundsList[id], true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.context.decodeAudioData(request.response, function(buffer) {
				sounds.push(buffer);
				if(id + 1 < soundsList.length) audio.loadSounds(id + 1);
			});
		};
		request.send();
	};

	this.duckMusic = function (duration, volume = 0) {
		currentMusicTrack.volume.gain.setTargetAtTime(volume, audioCtx.currentTime, CROSSFADE_TIME);
		currentMusicTrack.volume.gain.setTargetAtTime(1, audioCtx.currentTime + duration, CROSSFADE_TIME);
		return;
	};

	function calcuateVolumeDropoff(location) {
		return calcuateVolumeDropoff2(location);
	}

	function calcuateVolumeDropoff1(location) {//Distance dropoff only
		var distance = currentPlayerPos.distance(location);

		var newVolume = 1;
		if (distance > DROPOFF_MIN && distance <= DROPOFF_MAX) {
			newVolume = Math.abs((distance - DROPOFF_MIN)/(DROPOFF_MAX - DROPOFF_MIN) - 1);
		} else if (distance > DROPOFF_MAX) {
			newVolume = 0;
		}

		return Math.pow(newVolume, 2);
	}

	function calcuateVolumeDropoff2(location) {// +Head shadow
		var distance = currentPlayerPos.distance(location);

		var newVolume = 1;
		if (distance > DROPOFF_MIN && distance <= DROPOFF_MAX) {
			newVolume = Math.abs((distance - DROPOFF_MIN)/(DROPOFF_MAX - DROPOFF_MIN) - 1);
		} else if (distance > DROPOFF_MAX) {
			newVolume = 0;
		}

		var direction = currentPlayerAngleDegrees + radToDeg(location.angle(currentPlayerPos));
		while (direction >= 360) {
			direction -= 360;
		}
		while (direction < 0) {
			direction += 360;
		}

		if (direction > 90 && direction <= 180) {
			newVolume *= lerp(1, BEHIND_THE_HEAD, (direction-90)/90);
		} else if (direction > 180 && direction <= 270) {
			newVolume *= lerp(BEHIND_THE_HEAD, 1, (direction-180)/90);
		}

		return Math.pow(newVolume, 2);
	}

	function calcuatePan(location) {
		return calcuatePan2(location);
	}

	function calcuatePan1(location) {//360 pan
		var direction = currentPlayerAngleDegrees + radToDeg(location.angle(currentPlayerPos));
		while (direction >= 360) {
			direction -= 360;
		}
		while (direction < 0) {
			direction += 360;
		}

		var pan = 0;
		if (direction <= 90) {
			pan = lerp(0, -1, direction/90);
		} else if (direction <= 180) {
			pan = lerp(-1, 0, (direction-90)/90);
		} else if (direction <= 270) {
			pan = lerp(0, 1, (direction-180)/90);
		} else if (direction < 360) {
			pan = lerp(1, 0, (direction-270)/90);
		}

		return pan;
	}

	function calcuatePan2(location) {// +proximity
		var direction = currentPlayerAngleDegrees + radToDeg(location.angle(currentPlayerPos));
		while (direction >= 360) {
			direction -= 360;
		}
		while (direction < 0) {
			direction += 360;
		}

		var pan = 0;
		if (direction <= 90) {
			pan = lerp(0, -1, direction/90);
		} else if (direction <= 180) {
			pan = lerp(-1, 0, (direction-90)/90);
		} else if (direction <= 270) {
			pan = lerp(0, 1, (direction-180)/90);
		} else if (direction < 360) {
			pan = lerp(1, 0, (direction-270)/90);
		}

		var distance = currentPlayerPos.distance(location);
		if (distance <=  DROPOFF_MIN) {
			var panReduction = distance/DROPOFF_MIN;
			pan *= panReduction;
		}

		return pan;
	}

	function calcuateReverbPresence(location) {
		var distance = currentPlayerPos.distance(location);

		var mixVolume = 0;
		mixVolume = Math.pow(distance/DROPOFF_MAX * REVERB_MAX, 1.5);

		return mixVolume;
	}

	function calculatePropogationPosition(location) {
		if (lineOfSight(location, currentPlayerPos)) return location;

		var distance = DROPOFF_MAX;
		var pos = location;
		for (var i in currentAudGeo) {
			if (lineOfSight(currentPlayerPos, currentAudGeo[i].point)) {
				var newDistance = checkAudGeo(i, location, [])
				if (newDistance < distance) {
					distance = newDistance;
					pos = currentAudGeo[i].point;
				}
			}
		}
		distance += currentPlayerPos.distance(pos);

		var direction = currentPlayerPos.angle(pos);
		var newX = -Math.cos(direction) * distance + currentPlayerX;
		var newY = -Math.sin(direction) * distance + currentPlayerY;

		var newLocation = vec2(newX, newY);
		return newLocation;
	}

	function checkAudGeo(pointToCheck, location, pointsChecked) {
		var newPointsChecked = pointsChecked;
		newPointsChecked.push(pointToCheck);
		var distance = DROPOFF_MAX;
		var pos = location;
		if (lineOfSight(currentAudGeo[pointToCheck].point, location)) {
			return location.distance(currentAudGeo[pointToCheck].point);
		}

		for (var i in currentAudGeo[pointToCheck].connections) {
			var oldPoint = false;
			for (var j in pointsChecked) {
				if (i == pointsChecked[j]) {
					oldPoint = true;
				}
			}
			if (oldPoint) continue;

			var newDistance = checkAudGeo(currentAudGeo[pointToCheck].connections[i], location, newPointsChecked);
			if (newDistance < distance) {
				distance = newDistance;
				pos = currentAudGeo[currentAudGeo[pointToCheck].connections[i]].point;
			}
		}

		return distance + currentAudGeo[pointToCheck].point.distance(pos);
	}

	return this;
}

function rndAP(base = 1, width = 0.1) {
	return Math.random()*width*2 + base - width;
}

var fauxAudGeo = [
	vec2(602,224),
	vec2(576,149),
	vec2(594,127),
	];

var currentAudGeo = []; //{point: vec2, connections: [indexs]}
function generateAudGeo() {
	currentAudGeo = new Array();

	for (var i = 0; i < fauxAudGeo.length; i++) {
		//console.log("Checking point " + i);
		var connect = [];

		for (var j = 0; j < fauxAudGeo.length; j++) {
			if (i == j) continue;
			//console.log("--Against point " + j);
			var clear = true;

			for (var k = 0; k < wall.length; k++) {
				if (isLineOnLine(fauxAudGeo[i].x, fauxAudGeo[i].y, 
						fauxAudGeo[j].x, fauxAudGeo[j].y, 
						wall[k].p1.x, wall[k].p1.y, 
						wall[k].p2.x, wall[k].p2.y)
						&& wall[k].type != 0) {
					//console.log(wall[k]);
					clear = false;
					}
				}
			if (clear) {
				connect.push(j);
			}
		}

		currentAudGeo.push({point: fauxAudGeo[i], connections: connect});
	}
}

function lineOfSight(v1, v2) {
	for (var i in wall) {
		if (isLineOnLine(
				v1.x, v1.y, 
				v2.x, v2.y, 
				wall[i].p1.x, wall[i].p1.y, 
				wall[i].p2.x, wall[i].p2.y)
				&& !wall[i].type == 0) {
			return false;
		}
	}
	return true;
}