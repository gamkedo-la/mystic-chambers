
//Sound IDs
const SOUND_NOAMMO = 0;

var soundsList = [
    "audio/noAmmo.wav",
];

var totalSounds = 1;
var sounds = [];

//Constants-------------------------------------------------------------------
const VOLUME_INCREMENT = 0.1;
const CROSSFADE_TIME = 0.25;
const DROPOFF_MIN = 100;
const DROPOFF_MAX = 500;

var audio = new AudioGlobal();

function AudioGlobal() {

	var initialized = false;
	var audioCtx, audioListener;
	var musicBus, soundEffectsBus, masterBus;
	var isMuted;
	var musicVolume, soundEffectsVolume;
	var currentMusicTrack;
	var panningModel  = "HRTF";

//--//Set up WebAudioAPI nodes------------------------------------------------
	this.init = function() {
		if (initialized) return;

		//console.log("Initializing Audio...");
		// note: this causes a browser error if user has not interacted w page yet    
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.context = audioCtx;
		this.audioListener = audioCtx.listener;
		musicBus = audioCtx.createGain();
		soundEffectsBus = audioCtx.createGain();
		masterBus = audioCtx.createGain();

		musicVolume = 0.7;
		soundEffectsVolume = 0.7;

		musicBus.gain.value = musicVolume;
		soundEffectsBus.gain.value = soundEffectsVolume;

		musicBus.connect(masterBus);
		soundEffectsBus.connect(masterBus);
		masterBus.connect(audioCtx.destination);

		initialized = true;
	}

//--//volume handling functions-----------------------------------------------
	this.toggleMute = function() {
		if (!initialized) return;

		var newVolume = (masterBus.gain.value === 0 ? 1 : 0);
		masterBus.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.03);

		return newVolume;
	}

	this.setMute = function(tOrF) {
		if (!initialized) return;

		var newVolume = (tOrF === false ? 1 : 0);
		masterBus.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.03);

		return tOrF;
	}

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
	}

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
	}

	this.turnVolumeUp = function() {
		if (!initialized) return;

		this.setMusicVolume(musicVolume + VOLUME_INCREMENT);
		this.setSoundEffectsVolume(soundEffectsVolume + VOLUME_INCREMENT);
	}

	this.turnVolumeDown = function() {
		if (!initialized) return;

		this.setMusicVolume(musicVolume - VOLUME_INCREMENT);
		this.setSoundEffectsVolume(soundEffectsVolume - VOLUME_INCREMENT);
	}

//--//Audio playback classes--------------------------------------------------
	this.playOneshot = function(buffer, vec2, mixVolume = 1, rate = 1)
	{
		if (!initialized || buffer.playing) return;

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createPanner();

		panNode.panningModel = panningModel;
		panNode.distanceModel = 'inverse';
		panNode.coneInnerAngle = 360;
		panNode.coneOuterAngle  = 0;
		panNode.coneOuterGain  = 0;
		panNode.rolloffFactor  = 1;// will need to be fixed to use what ever get implemented for objects
		panNode.maxDistance = 1000;
		panNode.refDistance = 1;// will need to be fixed to use what ever get implemented for objects
		panNode.setPosition(vec2.x, vec2.y, 0);

		source.connect(gainNode);
		gainNode.connect(panNode);
		panNode.connect(soundEffectsBus);

		source.buffer = buffer;
		source.playbackRate.value = rate;
		gainNode.gain.value = mixVolume;
		//panNode.pan.value = calculatePan(referance);
		source.start();

		return {source: source, volume: gainNode, pan: panNode};
	}

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
	}

	this.loadBGMusic = function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.context.decodeAudioData(request.response, function(buffer) {
				audio.playMusic(buffer);
			});
		}
		request.send();
	}

	this.loadSounds = function(id) {
		var request = new XMLHttpRequest();
		request.open('GET', soundsList[id], true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.context.decodeAudioData(request.response, function(buffer) {
				sounds.push(buffer);
				if(id + 1 < totalSounds) audio.loadSounds(id + 1);
			});
		}
		request.send();
	}

    return this;
}
