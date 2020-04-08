const AUDIO_DEBUG = false;

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
const DROPOFF_MAX = 200;
const REVERB_MAX = 3;
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
				return referance.endTime > now;
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
			v2.x = plPos.x - off.x;
			v2.y = plPos.y - off.y;
			drawLine(renderer, v1, v2, "#FFFFFFFF");
			drawRect(renderer, vec2(v1.x-2, v1.y-2), vec2(5, 5), true, "#FFFFFFFF", false);

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

	this.play3DSound = function(buffer, vec2,  mixVolume = 1, rate = 1) {
		return play3DSound4(buffer, vec2,  mixVolume, rate);
	};

	function play3DSound1(buffer, vec2,  mixVolume = 1, rate = 1) {//3d panning and volume
		if (!initialized) return;

		if (currentPlayerPos.distance(vec2) > DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(vec2);
		panNode.pan.value = calcuatePan(vec2);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		source.start();

		source.onended = function() {
			source = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: vec2, endTime: audioCtx.currentTime+source.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound2(buffer, vec2,  mixVolume = 1, rate = 1) {// +Occlusion
		if (!initialized) return;

		for (var i = 0; i < wall.length; i++) {
			if (isLineOnLine(vec2.x, vec2.y, 
					currentPlayerX, currentPlayerY, 
					wall[i].p1.x, wall[i].p1.y, 
					wall[i].p2.x, wall[i].p2.y)) {
				return false;
			}
		}
		if (currentPlayerPos.distance(vec2) > DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		gainNode.gain.value = calcuateVolumeDropoff(vec2);
		panNode.pan.value = calcuatePan(vec2);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		source.start();

		source.onended = function() {
			source = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: vec2, endTime: audioCtx.currentTime+source.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound3(buffer, vec2,  mixVolume = 1, rate = 1) {// +Propogation
		if (!initialized) return;

		if (currentPlayerPos.distance(vec2) > DROPOFF_MAX) {
			return false;
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		var pos = vec2;
		var arrayOfOccludingWalls = [];
		for (var i = 0; i < wall.length; i++) {
			if (isLineOnLine(vec2.x, vec2.y, 
					currentPlayerX, currentPlayerY, 
					wall[i].p1.x, wall[i].p1.y, 
					wall[i].p2.x, wall[i].p2.y)) {

				arrayOfOccludingWalls.push(wall[i]);
			}
		}

		gainNode.gain.value = calcuateVolumeDropoff(pos);
		panNode.pan.value = calcuatePan(pos);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		source.start();

		source.onended = function() {
			source = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: pos, endTime: audioCtx.currentTime+source.buffer.duration};
		currentSoundSources.push(referance);
		return referance;
	};

	function play3DSound4(buffer, vec2,  mixVolume = 1, rate = 1) {// +Occlusion and reverb
		if (!initialized) return;

		for (var i = 0; i < wall.length; i++) {
			if (isLineOnLine(vec2.x, vec2.y, 
					currentPlayerX, currentPlayerY, 
					wall[i].p1.x, wall[i].p1.y, 
					wall[i].p2.x, wall[i].p2.y)) {
				return false;
			}
		}
		if (currentPlayerPos.distance(vec2) > DROPOFF_MAX) {
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

		gainNode.gain.value = calcuateVolumeDropoff(vec2);
		verbMixNode.gain.value = calcuateReverbPresence(vec2);
		panNode.pan.value = calcuatePan(vec2);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value *= Math.pow(mixVolume, 2);
		verbNode.buffer = sounds[REVERB];
		source.start();

		source.onended = function() {
			source = null;
		}

		referance = {source: source, volume: gainNode, pan: panNode, pos: vec2, endTime: audioCtx.currentTime+source.buffer.duration+verbNode.buffer.duration};
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

	function calcuateVolumeDropoff(vec2) {
		return calcuateVolumeDropoff2(vec2);
	}

	function calcuateVolumeDropoff1(vec2) {//Distance dropoff only
		var distance = currentPlayerPos.distance(vec2);

		var newVolume = 1;
		if (distance > DROPOFF_MIN && distance <= DROPOFF_MAX) {
			newVolume = Math.abs((distance - DROPOFF_MIN)/(DROPOFF_MAX - DROPOFF_MIN) - 1);
		} else if (distance > DROPOFF_MAX) {
			newVolume = 0;
		}

		return Math.pow(newVolume, 2);
	}

	function calcuateVolumeDropoff2(vec2) {// +Head shadow
		var distance = currentPlayerPos.distance(vec2);

		var newVolume = 1;
		if (distance > DROPOFF_MIN && distance <= DROPOFF_MAX) {
			newVolume = Math.abs((distance - DROPOFF_MIN)/(DROPOFF_MAX - DROPOFF_MIN) - 1);
		} else if (distance > DROPOFF_MAX) {
			newVolume = 0;
		}

		var direction = currentPlayerAngleDegrees + radToDeg(vec2.angle(currentPlayerPos));
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

	function calcuatePan(vec2) {
		return calcuatePan2(vec2);
	}

	function calcuatePan1(vec2) {//360 pan
		var direction = currentPlayerAngleDegrees + radToDeg(vec2.angle(currentPlayerPos));
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

	function calcuatePan2(vec2) {// +proximity
		var direction = currentPlayerAngleDegrees + radToDeg(vec2.angle(currentPlayerPos));
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

		var distance = currentPlayerPos.distance(vec2);
		if (distance <=  DROPOFF_MIN) {
			var panReduction = distance/DROPOFF_MIN;
			pan *= panReduction;
		}

		return pan;
	}

	function calcuateReverbPresence(vec2) {
		var distance = currentPlayerPos.distance(vec2);

		var mixVolume = 0;
		mixVolume = Math.pow(distance/DROPOFF_MAX * REVERB_MAX, 1.5);

		return mixVolume;
	}

	return this;
}

function rndAP(base = 1, width = 0.1) {
	return Math.random()*width*2 + base - width;
}