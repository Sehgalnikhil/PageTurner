// Web Audio API Synthesized Sound Effects for Tactile Interactions
// Zero external mp3 dependencies, 100% reliable, zero latency, works offline

let audioCtx = null;
let currentAmbient = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Crisp wax seal snap & crack sound
 */
export const playWaxSealCrack = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Snappy initial transient click
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    // 2. Crunchy noise burst (shattering wax)
    const bufferSize = ctx.sampleRate * 0.12;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.12);
  } catch (err) {
    console.debug('Audio not available:', err);
  }
};

/**
 * Gentle paper rustle / unwrap swoosh
 */
export const playPaperUnwrap = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.28;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1600, now + 0.14);
    filter.frequency.linearRampToValueAtTime(400, now + 0.28);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.28);
  } catch (err) {
    console.debug('Audio not available:', err);
  }
};

let cachedFlipBuffer = null;

/**
 * Subtle paper page turn / flip sound (Pre-cached buffer for zero latency, zero frame drops)
 */
export const playPageFlipSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (!cachedFlipBuffer || cachedFlipBuffer.sampleRate !== ctx.sampleRate) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      cachedFlipBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = cachedFlipBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = cachedFlipBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.16);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.16);
  } catch (err) {
    console.debug('Audio error:', err);
  }
};

/**
 * Triumphant gentle celestial chime for the book reveal
 */
export const playRevealChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch (err) {
    console.debug('Audio not available:', err);
  }
};

/**
 * Synthesizes Continuous Ambient Literary Soundscapes
 * Types: 'rain' | 'fireplace' | 'clock'
 */
export const startAmbientSound = (type = 'rain', volume = 0.3) => {
  try {
    stopAmbientSound();
    const ctx = getAudioContext();
    if (!ctx) return null;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
    masterGain.connect(ctx.destination);

    let activeNodes = [];
    let intervalId = null;

    if (type === 'rain') {
      // Pink/Brown noise generator for gentle steady rainfall
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(950, ctx.currentTime);

      noise.connect(lowpass);
      lowpass.connect(masterGain);
      noise.start();

      activeNodes.push(noise, lowpass);
    } else if (type === 'fireplace') {
      // Warm low frequency rumble + random intermittent micro crackles
      const rumbleOsc = ctx.createOscillator();
      rumbleOsc.type = 'sine';
      rumbleOsc.frequency.setValueAtTime(65, ctx.currentTime);
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.15, ctx.currentTime);
      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(masterGain);
      rumbleOsc.start();
      activeNodes.push(rumbleOsc, rumbleGain);

      // Random crackle pops
      intervalId = setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const popOsc = audioCtx.createOscillator();
        const popGain = audioCtx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(150 + Math.random() * 450, now);
        popGain.gain.setValueAtTime(0.04 + Math.random() * 0.07, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        popOsc.connect(popGain);
        popGain.connect(masterGain);
        popOsc.start(now);
        popOsc.stop(now + 0.035);
      }, 160);
    } else if (type === 'clock') {
      // Gentle antique pendulum tick
      intervalId = setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const tickOsc = audioCtx.createOscillator();
        const tickGain = audioCtx.createGain();
        tickOsc.type = 'sine';
        tickOsc.frequency.setValueAtTime(750, now);
        tickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        tickGain.gain.setValueAtTime(0.06, now);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        tickOsc.connect(tickGain);
        tickGain.connect(masterGain);
        tickOsc.start(now);
        tickOsc.stop(now + 0.04);
      }, 1000);
    }

    currentAmbient = {
      masterGain,
      activeNodes,
      intervalId,
      type,
    };

    return currentAmbient;
  } catch (err) {
    console.debug('Failed to start ambient sound:', err);
    return null;
  }
};

export const stopAmbientSound = () => {
  try {
    if (currentAmbient) {
      if (currentAmbient.intervalId) {
        clearInterval(currentAmbient.intervalId);
      }
      if (currentAmbient.masterGain && audioCtx) {
        currentAmbient.masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        setTimeout(() => {
          if (currentAmbient?.activeNodes) {
            currentAmbient.activeNodes.forEach((node) => {
              try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
              } catch (_) {}
            });
          }
          currentAmbient = null;
        }, 700);
      } else {
        currentAmbient = null;
      }
    }
  } catch (err) {
    console.debug('Error stopping ambient:', err);
  }
};

export const setAmbientVolume = (vol) => {
  try {
    if (currentAmbient?.masterGain && audioCtx) {
      currentAmbient.masterGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.1);
    }
  } catch (_) {}
};
