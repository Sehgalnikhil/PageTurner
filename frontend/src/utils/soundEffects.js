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

/**
 * Smooth wooden / cloth friction when pulling a volume off the oak shelf
 */
export const playBookSpineSlide = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Resonant woody friction tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

    oscGain.gain.setValueAtTime(0.06, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    // Subtle paper/leather brush
    playPaperUnwrap();
  } catch (err) {
    console.debug('Audio error:', err);
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
export const startAmbientSound = (type = 'rain', volume = 0.35) => {
  try {
    // 1. Safely stop any currently active ambient sound without destroying new instance
    stopAmbientSound();

    const ctx = getAudioContext();
    if (!ctx) return null;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.6);
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
      // 1. Deep warm burning hearth rumble (filtered noise)
      const bufferSize = ctx.sampleRate * 2;
      const rumbleBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const rumbleData = rumbleBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.03 * white) / 1.03;
        rumbleData[i] = lastOut * 1.8;
      }
      const rumbleSource = ctx.createBufferSource();
      rumbleSource.buffer = rumbleBuffer;
      rumbleSource.loop = true;

      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(220, ctx.currentTime);

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.65, ctx.currentTime);

      rumbleSource.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(masterGain);
      rumbleSource.start();

      activeNodes.push(rumbleSource, rumbleFilter, rumbleGain);

      // 2. Continuous subtle ember hiss
      const hissBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const hissData = hissBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        hissData[i] = (Math.random() * 2 - 1) * 0.06;
      }
      const hissSource = ctx.createBufferSource();
      hissSource.buffer = hissBuffer;
      hissSource.loop = true;

      const hissFilter = ctx.createBiquadFilter();
      hissFilter.type = 'bandpass';
      hissFilter.frequency.setValueAtTime(1400, ctx.currentTime);
      hissFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      const hissGain = ctx.createGain();
      hissGain.gain.setValueAtTime(0.18, ctx.currentTime);

      hissSource.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(masterGain);
      hissSource.start();

      activeNodes.push(hissSource, hissFilter, hissGain);

      // 3. Dynamic crackle, snaps, and popping embers
      const playPop = () => {
        if (!audioCtx || audioCtx.state === 'closed') return;
        const now = audioCtx.currentTime;

        // Realistic wooden ember snap using shaped noise burst
        const snapLen = Math.floor(audioCtx.sampleRate * (0.012 + Math.random() * 0.025));
        const snapBuf = audioCtx.createBuffer(1, snapLen, audioCtx.sampleRate);
        const snapData = snapBuf.getChannelData(0);
        for (let i = 0; i < snapLen; i++) {
          const decay = Math.exp(-i / (snapLen * 0.28));
          snapData[i] = (Math.random() * 2 - 1) * decay;
        }

        const snapNode = audioCtx.createBufferSource();
        snapNode.buffer = snapBuf;

        const snapFilter = audioCtx.createBiquadFilter();
        snapFilter.type = 'bandpass';
        // Random pitch between 1200Hz (deeper wood snap) to 3800Hz (crisp spark pop)
        snapFilter.frequency.setValueAtTime(1200 + Math.random() * 2600, now);
        snapFilter.Q.setValueAtTime(2.2, now);

        const snapGain = audioCtx.createGain();
        const popVol = 0.25 + Math.random() * 0.55;
        snapGain.gain.setValueAtTime(popVol, now);

        snapNode.connect(snapFilter);
        snapFilter.connect(snapGain);
        snapGain.connect(masterGain);

        snapNode.start(now);
      };

      // Initial bursts
      playPop();
      setTimeout(playPop, 80);

      // Irregular timer for natural wood crackling
      intervalId = setInterval(() => {
        if (Math.random() > 0.25) {
          playPop();
          // Occasional double micro-crackle
          if (Math.random() > 0.6) {
            setTimeout(playPop, 35 + Math.random() * 65);
          }
        }
      }, 140);
    } else if (type === 'clock') {
      // Library Antique Pendulum Clock: Alternating Tick & Tock
      let isTick = true;

      const playPendulumBeat = () => {
        if (!audioCtx || audioCtx.state === 'closed') return;
        const now = audioCtx.currentTime;

        // 1. Mechanical escapement strike (crisp impulse)
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = 'triangle';
        // Tick is slightly higher (1650Hz), Tock is slightly deeper (1250Hz)
        const baseFreq = isTick ? 1650 : 1250;
        clickOsc.frequency.setValueAtTime(baseFreq, now);
        clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

        clickGain.gain.setValueAtTime(0.45, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        clickOsc.connect(clickGain);
        clickGain.connect(masterGain);
        clickOsc.start(now);
        clickOsc.stop(now + 0.035);

        // 2. Resonant antique wooden clock casing body ring
        const woodOsc = audioCtx.createOscillator();
        const woodGain = audioCtx.createGain();
        woodOsc.type = 'sine';
        woodOsc.frequency.setValueAtTime(isTick ? 440 : 370, now);

        woodGain.gain.setValueAtTime(0.28, now);
        woodGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

        woodOsc.connect(woodGain);
        woodGain.connect(masterGain);
        woodOsc.start(now);
        woodOsc.stop(now + 0.075);

        // 3. Very subtle gear friction snap
        const noiseLen = Math.floor(audioCtx.sampleRate * 0.015);
        const noiseBuf = audioCtx.createBuffer(1, noiseLen, audioCtx.sampleRate);
        const noiseData = noiseBuf.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) {
          noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.3));
        }
        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuf;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(isTick ? 3200 : 2600, now);
        noiseFilter.Q.setValueAtTime(3.0, now);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseNode.start(now);

        // Alternate tick and tock
        isTick = !isTick;
      };

      // Play immediate first tick
      playPendulumBeat();

      // Steady 1-second pendulum cadence (60 BPM)
      intervalId = setInterval(playPendulumBeat, 1000);
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
    const instanceToStop = currentAmbient;
    currentAmbient = null; // Detach immediately so new sounds won't be clobbered

    if (instanceToStop) {
      if (instanceToStop.intervalId) {
        clearInterval(instanceToStop.intervalId);
      }
      if (instanceToStop.masterGain && audioCtx && audioCtx.state !== 'closed') {
        instanceToStop.masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        instanceToStop.masterGain.gain.setValueAtTime(instanceToStop.masterGain.gain.value, audioCtx.currentTime);
        instanceToStop.masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        setTimeout(() => {
          if (instanceToStop.activeNodes) {
            instanceToStop.activeNodes.forEach((node) => {
              try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
              } catch (_) {}
            });
          }
        }, 350);
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
