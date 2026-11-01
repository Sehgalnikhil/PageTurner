import React, { useState, useEffect, useContext } from 'react';
import {
  PiCloudRainBold,
  PiFlameBold,
  PiClockBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
  PiPlayBold,
  PiPauseBold,
  PiUsersBold,
  PiCheckBold,
} from 'react-icons/pi';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { ambientAudio } from '../../utils/ambientAudioEngine';
import { communityService } from '../../services/api';
import {
  playWaxSealCrack,
  playPaperUnwrap,
  playRevealChime,
} from '../../utils/soundEffects';

const AmbientSoundboard = ({ parlourSlug = 'gothic', parlourTitle = 'The Gothic Study' }) => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  // Audio Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [rainVol, setRainVol] = useState(45);
  const [fireVol, setFireVol] = useState(35);
  const [clockVol, setClockVol] = useState(25);

  // Live Sprint State
  const [sprint, setSprint] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const currentUserName = user?.username || 'Curator Admin';
  const currentUserAvatar = user?.avatar || '/images/eleanor-avatar.jpg';
  const currentUserEmail = user?.email || 'nikhilsehgal1806@gmail.com';

  // Fetch live sprint from MongoDB
  const fetchSprint = async () => {
    try {
      const res = await communityService.getSprint(parlourSlug);
      if (res.data) {
        setSprint(res.data);
        const expires = new Date(res.data.expiresAt).getTime();
        const diffSeconds = Math.max(0, Math.floor((expires - Date.now()) / 1000));
        setSecondsLeft(diffSeconds > 0 ? diffSeconds : 25 * 60);
      }
    } catch (err) {
      console.warn('Could not fetch sprint from database:', err);
    }
  };

  useEffect(() => {
    fetchSprint();
  }, [parlourSlug]);

  // Sprint countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleCompleteSprint();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  // Handle ambient master toggle
  const handleToggleAudio = () => {
    playWaxSealCrack();
    const active = ambientAudio.toggle();
    setIsPlaying(active);
    if (active) {
      ambientAudio.setVolume('rain', rainVol / 100);
      ambientAudio.setVolume('fireplace', fireVol / 100);
      ambientAudio.setVolume('clock', clockVol / 100);
      enqueueSnackbar('🕯️ Cathedral atmosphere synthesized & active', {
        variant: 'info',
        autoHideDuration: 2000,
      });
    }
  };

  const handleRainChange = (e) => {
    const v = Number(e.target.value);
    setRainVol(v);
    ambientAudio.setVolume('rain', v / 100);
    if (!isPlaying && v > 0) {
      ambientAudio.start();
      setIsPlaying(true);
    }
  };

  const handleFireChange = (e) => {
    const v = Number(e.target.value);
    setFireVol(v);
    ambientAudio.setVolume('fireplace', v / 100);
    if (!isPlaying && v > 0) {
      ambientAudio.start();
      setIsPlaying(true);
    }
  };

  const handleClockChange = (e) => {
    const v = Number(e.target.value);
    setClockVol(v);
    ambientAudio.setVolume('clock', v / 100);
    if (!isPlaying && v > 0) {
      ambientAudio.start();
      setIsPlaying(true);
    }
  };

  // Join live sprint in database
  const handleJoinSprint = async () => {
    playWaxSealCrack();
    setTimerRunning(true);
    if (!isPlaying) {
      ambientAudio.start();
      setIsPlaying(true);
    }

    try {
      const res = await communityService.joinSprint(parlourSlug, {
        name: currentUserName,
        avatar: currentUserAvatar,
        email: currentUserEmail,
        currentBook: 'The Picture of Dorian Gray (Ch. IV)',
      });
      if (res.data?.sprint) {
        setSprint(res.data.sprint);
      }
      playRevealChime();
      enqueueSnackbar(
        '🕯️ Joined the synchronous Silent Reading Sprint! Solitude in community.',
        { variant: 'success' }
      );
    } catch (err) {
      console.warn('Could not join sprint in database:', err);
    }
  };

  // Complete sprint and award XP in database
  const handleCompleteSprint = async () => {
    setTimerRunning(false);
    setHasCompleted(true);
    playRevealChime();

    try {
      const res = await communityService.completeSprint(parlourSlug, {
        email: currentUserEmail,
      });
      enqueueSnackbar(
        '✨ 25-Min Silent Sprint Concluded! +50 Sanctuary XP awarded to your passport 📜',
        { variant: 'success' }
      );
    } catch (err) {
      console.warn('Could not sync complete sprint:', err);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm text-left animate-fade-in space-y-6">
      {/* Title & Master Audio Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5D7C2] gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#7D2235] font-bold block">
            Binaural Dark Academia Soundboard
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2F2620]">
            Sanctuary Atmosphere & Silent Sprint
          </h3>
        </div>

        <button
          type="button"
          onClick={handleToggleAudio}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto ${
            isPlaying
              ? 'bg-[#7D2235] text-white shadow-md'
              : 'bg-[#EAE0CF] hover:bg-[#DFD3BE] text-[#3E3228]'
          }`}
        >
          {isPlaying ? (
            <>
              <PiSpeakerHighBold className="text-sm" />
              <span>Atmosphere Synthesizer: Active</span>
            </>
          ) : (
            <>
              <PiSpeakerSlashBold className="text-sm" />
              <span>Enable Binaural Ambiance 🎧</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: 3 Live Volume Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rain Slider */}
        <div className="p-4 rounded-2xl bg-[#F0E6D5] border border-[#DECDB8] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-xs text-[#2F2620] flex items-center gap-1.5">
              <PiCloudRainBold className="text-sky-800 text-sm" />
              <span>Windowpane Rain</span>
            </span>
            <span className="font-mono text-[11px] text-[#7A6A5E] font-bold">
              {rainVol}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rainVol}
            onChange={handleRainChange}
            className="w-full accent-[#7D2235] cursor-pointer"
          />
          <span className="text-[10px] text-[#7A6A5E] block italic">
            Procedural pink-noise rain simulation
          </span>
        </div>

        {/* Fireplace Slider */}
        <div className="p-4 rounded-2xl bg-[#F0E6D5] border border-[#DECDB8] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-xs text-[#2F2620] flex items-center gap-1.5">
              <PiFlameBold className="text-amber-700 text-sm" />
              <span>Hearth Fireplace</span>
            </span>
            <span className="font-mono text-[11px] text-[#7A6A5E] font-bold">
              {fireVol}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={fireVol}
            onChange={handleFireChange}
            className="w-full accent-[#7D2235] cursor-pointer"
          />
          <span className="text-[10px] text-[#7A6A5E] block italic">
            Crackling embers & sub-bass warmth
          </span>
        </div>

        {/* Grandfather Clock Slider */}
        <div className="p-4 rounded-2xl bg-[#F0E6D5] border border-[#DECDB8] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-xs text-[#2F2620] flex items-center gap-1.5">
              <PiClockBold className="text-[#7D2235] text-sm" />
              <span>Antique Clock Tick</span>
            </span>
            <span className="font-mono text-[11px] text-[#7A6A5E] font-bold">
              {clockVol}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={clockVol}
            onChange={handleClockChange}
            className="w-full accent-[#7D2235] cursor-pointer"
          />
          <span className="text-[10px] text-[#7A6A5E] block italic">
            1 Hz rhythmic study focus cadence
          </span>
        </div>
      </div>

      {/* Synchronized Silent Reading Sprint Box */}
      <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-serif font-bold text-sm text-[#2F2620]">
              Synchronous Silent Sprint &bull; {parlourTitle}
            </span>
          </div>
          <p className="text-xs text-[#7A6A5E] font-serif italic">
            Deep focus reading interval. Read without interruption for 25 minutes alongside fellow scholars.
          </p>

          {/* Participant Avatars */}
          <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
            <div className="flex -space-x-1.5 overflow-hidden items-center">
              {(sprint?.participants || []).slice(0, 5).map((p, i) => (
                <img
                  key={i}
                  src={p.avatar || '/images/eleanor-avatar.jpg'}
                  alt={p.name}
                  title={`${p.name}: ${p.currentBook}`}
                  className="w-6 h-6 rounded-full object-cover border border-[#D5C2AC]"
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-[#7A6A5E]">
              {(sprint?.participants || []).length} readers focusing now
            </span>
          </div>
        </div>

        {/* Timer Display & Action */}
        <div className="flex items-center gap-3">
          <div className="p-3 px-5 rounded-xl bg-[#FAF5EB] border border-[#D8C7B0] text-center font-mono">
            <span className="text-2xl font-bold text-[#2F2620] tracking-wider block">
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
              {String(secondsLeft % 60).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-[#7A6A5E] uppercase tracking-wider block">
              {timerRunning ? 'Focus Active' : 'Sprint Paused'}
            </span>
          </div>

          <button
            type="button"
            onClick={timerRunning ? () => setTimerRunning(false) : handleJoinSprint}
            className={`px-5 py-3 rounded-full text-xs font-semibold shadow-md cute-press cursor-pointer flex items-center gap-1.5 ${
              timerRunning
                ? 'bg-amber-800 hover:bg-amber-900 text-white'
                : 'bg-[#7D2235] hover:bg-[#92283F] text-white'
            }`}
          >
            {timerRunning ? (
              <>
                <PiPauseBold />
                <span>Pause</span>
              </>
            ) : (
              <>
                <PiPlayBold />
                <span>Join 25-Min Sprint (+50 XP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbientSoundboard;
