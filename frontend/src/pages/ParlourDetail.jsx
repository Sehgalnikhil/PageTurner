import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiFeatherBold,
  PiHeartBold,
  PiHeartFill,
  PiChatCircleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiShareNetworkBold,
  PiArrowLeftBold,
  PiUsersBold,
  PiBookOpenBold,
  PiClockBold,
  PiCloudRainBold,
  PiFlameBold,
  PiCheckBold,
  PiPlusBold,
  PiPaperPlaneRightBold,
  PiSparkleBold,
  PiQuotesBold,
  PiCalendarBlankBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  playWaxSealCrack,
  playPaperUnwrap,
  playPageFlipSound,
  playBookSpineSlide,
  startAmbientSound,
  stopAmbientSound,
} from '../utils/soundEffects';

// Parlour database with rich thematic details
const PARLOURS_DATA = {
  gothic: {
    id: 'gothic',
    title: 'The Gothic Study',
    category: 'Gothic & Victorian',
    desc: 'Candlelight, Victorian mystery & brooding atmospheres. Delving into Mary Shelley, Bram Stoker, and Oscar Wilde.',
    longDesc:
      'The Gothic Study is a nocturnal gathering place for readers who dwell in the shadowy corridors of 19th-century literature. Here we dissect the sublime, the uncanny, decaying aristocratic manors, psychological doubles, and the delicate border between elegance and moral rot.',
    members: 512,
    activeNow: 42,
    curator: 'Eleanor Vance',
    curatorHandle: 'eleanor_reads',
    curatorAvatar: '/images/eleanor-avatar.jpg',
    img: '/images/parlour-gothic.jpg',
    currentBook: 'The Picture of Dorian Gray',
    currentBookAuthor: 'Oscar Wilde',
    currentBookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Chapter IV: The Studio of Basil Hallward',
    readingWeek: 'Week 3 of 6 • 68% Canon Complete',
    prompt:
      'Is aestheticism in Dorian Gray a genuine philosophical pursuit of pure beauty, or merely a sophisticated disguise for moral decay and cowardice?',
    meetingTime: 'Every Thursday at Dusk (9:00 PM GMT)',
    ambiancePreset: 'rain',
    pastBooks: [
      { title: 'Frankenstein', author: 'Mary Shelley', year: 'Read in October' },
      { title: 'Dracula', author: 'Bram Stoker', year: 'Read in September' },
      { title: 'The Strange Case of Dr Jekyll and Mr Hyde', author: 'R.L. Stevenson', year: 'Read in August' },
    ],
    initialDiscussions: [
      {
        id: 'd-1',
        author: 'Eleanor Vance',
        handle: 'eleanor_reads',
        avatar: '/images/eleanor-avatar.jpg',
        time: '45m ago',
        tag: 'Chapter IV Reflection',
        quote: '“Behind every exquisite thing that existed, there was something tragic.”',
        text: 'Notice how Lord Henry sells youth as a currency Dorian never knew he was spending until this exact moment. The tragedy is that Dorian falls in love with his own image, separating his conscience from his body.',
        likes: 38,
        liked: false,
        replies: [
          {
            id: 'r-1',
            author: 'Julian Frost',
            handle: 'jfrost',
            time: '20m ago',
            text: 'And Basil saw it coming immediately. He knew the portrait had too much of himself in it.',
          },
        ],
      },
      {
        id: 'd-2',
        author: 'Arthur Pendelton',
        handle: 'arthur_scribe',
        avatar: '/images/arthur-avatar.jpg',
        time: '3h ago',
        tag: 'Textual Annotation',
        quote: '“There is only one thing in the world worse than being talked about, and that is not being talked about.”',
        text: 'Lord Henry’s opening paradoxes feel lighthearted at first read, but as the book progresses, every witty remark transforms into an insidious trap.',
        likes: 24,
        liked: true,
        replies: [],
      },
    ],
  },
  midnight: {
    id: 'midnight',
    title: 'The Midnight Philosophers',
    category: 'Nocturnal Philosophy',
    desc: 'Late-night classics, existential reflections & quiet tea. Sören Kierkegaard, Albert Camus, Jean-Paul Sartre.',
    longDesc:
      'A solemn sanctuary for those awake in the small hours of the night. We gather when the world sleeps to confront the absurdity of existence, the terror of freedom, and the quiet dignity of choosing meaning in a silent cosmos.',
    members: 342,
    activeNow: 19,
    curator: 'Marcus Aurel',
    curatorHandle: 'stoic_night',
    curatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    img: '/images/parlour-midnight.jpg',
    currentBook: 'The Myth of Sisyphus',
    currentBookAuthor: 'Albert Camus',
    currentBookCover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Part I: An Absurd Reasoning',
    readingWeek: 'Week 2 of 4 • 40% Canon Complete',
    prompt:
      'Can one imagine Sisyphus truly happy in our contemporary era of constant acceleration and metricized lives?',
    meetingTime: 'Midnight Sittings on Saturdays (12:00 AM)',
    ambiancePreset: 'fireplace',
    pastBooks: [
      { title: 'Fear and Trembling', author: 'Søren Kierkegaard', year: 'Read in October' },
      { title: 'Nausea', author: 'Jean-Paul Sartre', year: 'Read in September' },
      { title: 'The Stranger', author: 'Albert Camus', year: 'Read in August' },
    ],
    initialDiscussions: [
      {
        id: 'd-1',
        author: 'Marcus Aurel',
        handle: 'stoic_night',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        time: '1h ago',
        tag: 'Core Thesis',
        quote: '“There is but one truly serious philosophical problem, and that is suicide.”',
        text: 'Camus begins with shocking clarity. If life is inherently without meaning, the revolt consists of living fully despite the void, not escaping it.',
        likes: 52,
        liked: false,
        replies: [],
      },
    ],
  },
  slow: {
    id: 'slow',
    title: 'Slow Readers Society',
    category: 'Slow Reading',
    desc: 'One chapter a week. Close reading, deep textual dissection, and marginalia sharing.',
    longDesc:
      'A counter-cultural sanctuary against speed reading and superficial skimming. We dedicate an entire week to every chapter, lingering over sentence cadence, archaic idioms, subtextual irony, and historical resonance.',
    members: 820,
    activeNow: 63,
    curator: 'Arthur Pendelton',
    curatorHandle: 'arthur_scribe',
    curatorAvatar: '/images/arthur-avatar.jpg',
    img: '/images/parlour-slow.jpg',
    currentBook: '1984',
    currentBookAuthor: 'George Orwell',
    currentBookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Part Two: Chapter V (The Room Above Mr. Charrington’s)',
    readingWeek: 'Week 7 of 12 • 55% Canon Complete',
    prompt:
      'Examine the coral paperweight Winston purchases. Why does a useless object of antique craftsmanship hold more subversive power than a political manifesto?',
    meetingTime: 'Sunday Tea Reading Sittings (4:00 PM GMT)',
    ambiancePreset: 'clock',
    pastBooks: [
      { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', year: 'Read in October' },
      { title: 'The Death of Ivan Ilyich', author: 'Leo Tolstoy', year: 'Read in September' },
      { title: 'To the Lighthouse', author: 'Virginia Woolf', year: 'Read in August' },
    ],
    initialDiscussions: [
      {
        id: 'd-1',
        author: 'Arthur Pendelton',
        handle: 'arthur_scribe',
        avatar: '/images/arthur-avatar.jpg',
        time: '2h ago',
        tag: 'Close Reading Note',
        quote: '“The paperweight was the room he was in, and the coral was Julia’s life and his own, fixed in a sort of eternity at the heart of the crystal.”',
        text: 'The glass paperweight is a preserved bubble of history. The Party can rewrite all text, but they cannot erase the sheer tactile reality of physical glass from an older world.',
        likes: 67,
        liked: true,
        replies: [],
      },
    ],
  },
  poetry: {
    id: 'poetry',
    title: 'The Antiquarian Poetry Cloister',
    category: 'Romantic Poetry',
    desc: 'Romantic, Decadent, and Symbolist poetry read aloud under soft lamplight.',
    longDesc:
      'Dedicated to meter, cadence, and the musicality of classical verse. We gather to read sonnets, elegies, and cantos aloud, analyzing rhyme schemes and symbolic architecture.',
    members: 275,
    activeNow: 14,
    curator: 'Clara Oswald',
    curatorHandle: 'clara_books',
    curatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    currentBook: 'Les Fleurs du mal',
    currentBookAuthor: 'Charles Baudelaire',
    currentBookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Spleen et Idéal: The Albatross',
    readingWeek: 'Week 1 of 4 • 25% Canon Complete',
    prompt:
      'How does Baudelaire use the giant bird stranded on the ship deck as a portrait of the poet exiled in modern industrial society?',
    meetingTime: 'Wednesday Evening Vespers (8:00 PM GMT)',
    ambiancePreset: 'rain',
    pastBooks: [
      { title: 'Odes and Sonnets', author: 'John Keats', year: 'Read in October' },
      { title: 'The Raven and Other Poems', author: 'Edgar Allan Poe', year: 'Read in September' },
    ],
    initialDiscussions: [
      {
        id: 'd-1',
        author: 'Clara Oswald',
        handle: 'clara_books',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        time: '5h ago',
        tag: 'Verse Metric Analysis',
        quote: '“Le Poète est semblable au prince des nuées / Qui hante la tempête et se rit de l’archer...”',
        text: 'The French alexandrine gives this stanza a soaring rhythm that collapses intentionally in the final couplet into heavy, clumsy monosyllables.',
        likes: 31,
        liked: false,
        replies: [],
      },
    ],
  },
  dostoevsky: {
    id: 'dostoevsky',
    title: "Dostoevsky's Underground",
    category: 'Russian Classics',
    desc: 'Dissecting human frailty, suffering, guilt, and spiritual redemption.',
    longDesc:
      'Delving into the profound psychological realism of 19th-century Saint Petersburg. We examine existential agony, moral philosophy, religious guilt, and the mystery of human redemption.',
    members: 419,
    activeNow: 28,
    curator: 'Nikolai Rostov',
    curatorHandle: 'nikolai_petersburg',
    curatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    currentBook: 'Crime and Punishment',
    currentBookAuthor: 'Fyodor Dostoevsky',
    currentBookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Part II: Chapter II (The Police Station and the Fever)',
    readingWeek: 'Week 4 of 8 • 48% Canon Complete',
    prompt:
      'Analyze the physical fever that grips Raskolnikov immediately following the deed. Is it physical illness or the soul rejecting an abstract intellectual crime?',
    meetingTime: 'Friday Night Petersburg Sittings (10:00 PM GMT)',
    ambiancePreset: 'fireplace',
    pastBooks: [
      { title: 'Notes from Underground', author: 'Fyodor Dostoevsky', year: 'Read in October' },
      { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', year: 'Read in Summer' },
    ],
    initialDiscussions: [
      {
        id: 'd-1',
        author: 'Nikolai Rostov',
        handle: 'nikolai_petersburg',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        time: '4h ago',
        tag: 'Psychological Autopsy',
        quote: '“It was not a human being I killed, it was a principle!”',
        text: 'Raskolnikov cannot even bear to keep the trinkets he took. The tragedy begins not when he is caught, but the moment he realizes that killing did not make him Napoleon—it made him a fugitive in his own mind.',
        likes: 49,
        liked: true,
        replies: [],
      },
    ],
  },
};

const ParlourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  // Find parlour or fallback to gothic
  const parlour = PARLOURS_DATA[id] || PARLOURS_DATA['gothic'];

  const [isJoined, setIsJoined] = useState(parlour.id === 'gothic');
  const [memberCount, setMemberCount] = useState(parlour.members);
  const [discussions, setDiscussions] = useState(parlour.initialDiscussions);

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Chapter Discussion');
  const [showCompose, setShowCompose] = useState(false);

  // Reply state per post
  const [replyInputs, setReplyInputs] = useState({});
  const [activeAmbiance, setActiveAmbiance] = useState('off');

  // Reading Sprint Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let int = null;
    if (timerRunning) {
      int = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(int);
  }, [timerRunning]);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleToggleJoin = () => {
    playBookSpineSlide();
    const next = !isJoined;
    setIsJoined(next);
    setMemberCount((c) => (next ? c + 1 : c - 1));
    enqueueSnackbar(
      next ? `Welcome to ${parlour.title} 🕯️` : `Departed ${parlour.title}`,
      { variant: next ? 'success' : 'info' }
    );
  };

  const handleLike = (postDocId) => {
    playWaxSealCrack();
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === postDocId) {
          const nextLiked = !d.liked;
          return {
            ...d,
            liked: nextLiked,
            likes: nextLiked ? d.likes + 1 : d.likes - 1,
          };
        }
        return d;
      })
    );
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    playWaxSealCrack();
    playPaperUnwrap();

    const authorName = user?.username || 'Nikhil Sehgal';
    const newPost = {
      id: `d-${Date.now()}`,
      author: authorName,
      handle: authorName.toLowerCase().replace(/\s+/g, '_'),
      avatar: '/images/eleanor-avatar.jpg',
      time: 'Just now',
      tag: newNoteTag,
      quote: newQuoteText.trim() ? `“${newQuoteText.trim()}”` : null,
      text: newNoteText.trim(),
      likes: 1,
      liked: true,
      replies: [],
    };

    setDiscussions([newPost, ...discussions]);
    setNewNoteText('');
    setNewQuoteText('');
    setShowCompose(false);
    enqueueSnackbar('Marginalia inscribed to parlour discourse ✒️', {
      variant: 'success',
    });
  };

  const handleAddReply = (discussionId) => {
    const text = replyInputs[discussionId]?.trim();
    if (!text) return;

    playPageFlipSound();
    const authorName = user?.username || 'Nikhil Sehgal';
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: [
              ...d.replies,
              {
                id: `r-${Date.now()}`,
                author: authorName,
                handle: authorName.toLowerCase().replace(/\s+/g, '_'),
                time: 'Just now',
                text,
              },
            ],
          };
        }
        return d;
      })
    );

    setReplyInputs((prev) => ({ ...prev, [discussionId]: '' }));
    enqueueSnackbar('Reply posted', { variant: 'info' });
  };

  const handleAmbiance = (soundType) => {
    if (activeAmbiance === soundType) {
      stopAmbientSound();
      setActiveAmbiance('off');
      enqueueSnackbar('Parlour soundscape silenced 🔇', { variant: 'info' });
    } else {
      startAmbientSound(soundType);
      setActiveAmbiance(soundType);
      enqueueSnackbar(`Sanctuary ambiance activated: ${soundType} 🕯️`, {
        variant: 'info',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E6] text-[#2F2620] selection:bg-[#7D2235]/20 font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* ============================================================
            NAVIGATION CRUMBS & TOP BAR
            ============================================================ */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-[#D8CBB6] text-xs">
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-[#7D2235] hover:text-[#92283F] font-semibold cute-press transition-colors"
          >
            <PiArrowLeftBold />
            <span>Return to The Salon</span>
          </Link>

          <div className="flex items-center gap-3 text-[#76675B]">
            <span className="font-mono text-[11px] hidden sm:inline">
              Sanctuary Ref: PT-PLR-{parlour.id.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {parlour.activeNow} Readers Here Now
            </span>
          </div>
        </div>

        {/* ============================================================
            HERO PARLOUR SANCTUARY BANNER
            ============================================================ */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-[#D5C6AF] shadow-[0_16px_50px_rgba(35,26,18,0.22)] bg-[#191512] mb-6 text-left">
          <div className="relative min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6 sm:p-8 md:p-10">
            <img
              src={parlour.img}
              alt={parlour.title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/60 pointer-events-none" />

            {/* Top Row: Category and Quick Ambiance */}
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#7D2235] text-white text-xs font-serif font-semibold tracking-wide shadow-xs border border-[#A4344C]/40">
                {parlour.category}
              </span>

              {/* Sound preset button */}
              <button
                type="button"
                onClick={() => handleAmbiance(parlour.ambiancePreset)}
                className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeAmbiance === parlour.ambiancePreset
                    ? 'bg-amber-400 text-stone-900 font-bold'
                    : 'bg-black/40 hover:bg-black/60 text-[#EADBCC]'
                }`}
              >
                {parlour.ambiancePreset === 'rain' ? (
                  <PiCloudRainBold />
                ) : (
                  <PiFlameBold />
                )}
                <span>
                  {activeAmbiance === parlour.ambiancePreset
                    ? 'Ambiance Playing 🕯️'
                    : 'Toggle Parlour Sound'}
                </span>
              </button>
            </div>

            {/* Main Info */}
            <div className="relative z-10 max-w-2xl mt-4">
              <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#F7EFE2] tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                {parlour.title}
              </h1>
              <p className="font-serif italic text-sm sm:text-base text-[#E6D4BD] mt-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {parlour.desc}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <button
                  type="button"
                  onClick={handleToggleJoin}
                  className={`h-9 px-5 rounded-full text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-md cute-press cursor-pointer transition-all ${
                    isJoined
                      ? 'bg-[#EAE0CF] text-[#4A3D34] border border-[#D5C2A5]'
                      : 'bg-[#7D2235] hover:bg-[#92283F] text-white'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <PiCheckBold className="text-xs text-[#7D2235]" />
                      <span>Member of this Parlour</span>
                    </>
                  ) : (
                    <>
                      <PiPlusBold className="text-xs" />
                      <span>Enter & Join Parlour</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCompose((prev) => !prev)}
                  className="h-9 px-4 rounded-full bg-black/40 hover:bg-black/60 text-[#EADBCC] text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-[#D1B898]/30 shadow-sm cute-press cursor-pointer transition-all"
                >
                  <PiFeatherBold className="text-xs text-[#F7D8A4]" />
                  <span>Inscribe a Thought</span>
                </button>
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#C8B8A3] pt-4 border-t border-white/10 mt-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={parlour.curatorAvatar}
                  alt={parlour.curator}
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
                <span>Curated by {parlour.curator}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{memberCount} Dedicated Readers</span>
                <span>{parlour.meetingTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            MAIN 2-COLUMN PARLOUR WORKSPACE
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          
          {/* ============================================================
              LEFT 8 COLS: CURRENT BOOK FOCUS & PARLOUR DISCOURSE STREAM
              ============================================================ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Current Reading Focus Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex gap-4 items-start">
                <img
                  src={parlour.currentBookCover}
                  alt={parlour.currentBook}
                  className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg object-cover border border-[#D8C7B0] shadow-md flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7D2235] font-bold">
                    Active Parlour Lectern Focus
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#2F2620] leading-tight mt-0.5">
                    {parlour.currentBook}
                  </h3>
                  <span className="text-xs text-[#7A6A5E] block font-serif">
                    by {parlour.currentBookAuthor}
                  </span>
                  <div className="mt-2 text-xs text-[#52443A] font-medium">
                    <span className="text-[#7D2235] font-semibold">{parlour.currentChapter}</span>
                  </div>
                  <span className="text-[11px] text-[#867362] font-mono block mt-0.5">
                    {parlour.readingWeek}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    playBookSpineSlide();
                    enqueueSnackbar('Opening Chapter Excerpt from archives...', {
                      variant: 'info',
                    });
                  }}
                  className="px-4 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-xs cute-press cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PiBookOpenBold className="text-sm" />
                  <span>Read Chapter Excerpt</span>
                </button>
              </div>
            </div>

            {/* 2. Pinned Weekly Inquiry Prompt */}
            <div className="p-5 rounded-2xl bg-[#F0E6D5] border-2 border-[#D8C7B0] shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 text-[#7D2235]">
                <PiQuotesBold className="text-lg" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider">
                  Weekly Parlour Philosophical Inquiry
                </span>
              </div>
              <blockquote className="font-serif italic text-sm sm:text-base text-[#2F2620] leading-relaxed">
                “{parlour.prompt}”
              </blockquote>
              <div className="mt-3 pt-2.5 border-t border-[#DECDB8] flex items-center justify-between text-[11px] text-[#7A6A5E]">
                <span>Inscribed by Host {parlour.curator}</span>
                <button
                  type="button"
                  onClick={() => {
                    setNewQuoteText(parlour.prompt);
                    setShowCompose(true);
                  }}
                  className="text-[#7D2235] font-semibold hover:underline cursor-pointer"
                >
                  Respond to Prompt →
                </button>
              </div>
            </div>

            {/* 3. Inscribe Discussion Note Composer */}
            {showCompose && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#7D2235]/40 shadow-lg animate-drawer-spring">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-base font-bold text-[#2F2620] flex items-center gap-2">
                    <PiFeatherBold className="text-[#7D2235]" />
                    <span>Inscribe Parlour Discussion Note</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="p-1 rounded-full hover:bg-black/5 text-[#7A6A5E]"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleAddPost} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      placeholder="Passage quotation (optional)"
                      className="p-2.5 rounded-xl border border-[#D9CDB8] bg-white text-xs font-serif italic text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    />
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="p-2.5 rounded-xl border border-[#D9CDB8] bg-white text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    >
                      <option value="Chapter Discussion">Chapter Discussion</option>
                      <option value="Philosophical Analysis">Philosophical Analysis</option>
                      <option value="Textual Annotation">Textual Annotation</option>
                      <option value="Question for Circle">Question for Circle</option>
                    </select>
                  </div>

                  <textarea
                    rows="3"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Share your thoughts on the text with fellow members..."
                    className="w-full p-3 rounded-xl border border-[#D9CDB8] bg-white text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    required
                  />

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-1.5 text-xs text-[#7A6A5E] hover:text-[#2F2620]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-xs cute-press cursor-pointer flex items-center gap-1.5"
                    >
                      <PiPaperPlaneRightBold className="text-xs" />
                      <span>Inscribe to Parlour</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 4. Parlour Discourse Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#D8CCB8]">
                <h3 className="font-serif text-lg font-bold text-[#2F2620] flex items-center gap-2">
                  <span>Parlour Discourse & Margin Notes</span>
                  <span className="text-xs font-sans font-normal text-[#7A6A5E]">
                    ({discussions.length})
                  </span>
                </h3>
              </div>

              {discussions.map((d) => (
                <article
                  key={d.id}
                  className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm text-left space-y-3"
                >
                  {/* Top user row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={d.avatar}
                        alt={d.author}
                        className="w-8 h-8 rounded-full object-cover border border-[#D8C7B0]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-sm text-[#2F2620]">
                            {d.author}
                          </span>
                          <span className="text-[11px] text-[#7A6A5E]">@{d.handle}</span>
                        </div>
                        <span className="text-[10px] text-[#7A6A5E] block">
                          {d.time} &bull; <strong className="text-[#7D2235]">{d.tag}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quoted passage if present */}
                  {d.quote && (
                    <div className="p-3.5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8]">
                      <blockquote className="font-serif italic text-xs text-[#2F2620] leading-relaxed">
                        {d.quote}
                      </blockquote>
                    </div>
                  )}

                  {/* Reflection thought */}
                  <p className="text-xs text-[#2F2620] leading-relaxed font-sans">
                    {d.text}
                  </p>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#E5D7C2] flex items-center justify-between text-xs text-[#6E5F53]">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleLike(d.id)}
                        className={`flex items-center gap-1.5 cute-press cursor-pointer ${
                          d.liked ? 'text-[#7D2235] font-bold' : 'hover:text-[#7D2235]'
                        }`}
                      >
                        {d.liked ? (
                          <PiHeartFill className="text-sm text-[#7D2235]" />
                        ) : (
                          <PiHeartBold className="text-sm" />
                        )}
                        <span>{d.likes}</span>
                      </button>

                      <span className="flex items-center gap-1 text-[#7A6A5E]">
                        <PiChatCircleBold className="text-sm" />
                        <span>{d.replies.length} replies</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playPaperUnwrap();
                        navigator.clipboard?.writeText(window.location.href);
                        enqueueSnackbar('Copied parlour note link 📜', { variant: 'info' });
                      }}
                      className="flex items-center gap-1 hover:text-[#2F2620] cute-press cursor-pointer text-xs"
                    >
                      <PiShareNetworkBold className="text-xs" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Replies thread */}
                  {d.replies.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E5D7C2] space-y-2 pl-3 border-l-2 border-[#7D2235]/40">
                      {d.replies.map((r) => (
                        <div key={r.id} className="text-xs bg-[#F0E6D5]/60 p-2.5 rounded-xl">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-serif font-bold text-[#2F2620]">
                              {r.author}
                            </span>
                            <span className="text-[10px] text-[#7A6A5E]">{r.time}</span>
                          </div>
                          <p className="text-[#3E3228] text-xs leading-snug">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={replyInputs[d.id] || ''}
                      onChange={(e) =>
                        setReplyInputs({ ...replyInputs, [d.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddReply(d.id);
                      }}
                      placeholder="Reply to this annotation..."
                      className="flex-1 p-2 rounded-xl border border-[#D9CDB8] bg-white text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddReply(d.id)}
                      className="px-3 py-2 rounded-xl bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cute-press cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </article>
              ))}
            </div>

          </div>

          {/* ============================================================
              RIGHT 4 COLS: PARLOUR ARCHIVE, TIMERS & COMPANIONS
              ============================================================ */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* 1. Silent Reading Sprint Station */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-sm text-[#2F2620] flex items-center gap-1.5">
                  <PiClockBold className="text-[#7D2235]" />
                  <span>Parlour Silent Sprint</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#7A6A5E] mb-3">
                Focus reading session alongside {parlour.activeNow} members.
              </p>
              <div className="p-3.5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] text-center mb-3">
                <span className="font-mono text-2xl font-bold text-[#2F2620]">
                  {Math.floor(timerSeconds / 60)}:
                  {String(timerSeconds % 60).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#7A6A5E] block mt-0.5">
                  {timerRunning ? 'Session active' : 'Session paused'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playWaxSealCrack();
                  setTimerRunning((prev) => !prev);
                }}
                className={`w-full py-2 rounded-full text-xs font-semibold shadow-xs cute-press cursor-pointer ${
                  timerRunning
                    ? 'bg-amber-800 text-white'
                    : 'bg-[#7D2235] hover:bg-[#92283F] text-white'
                }`}
              >
                {timerRunning ? 'Pause Reading Sprint' : 'Begin 25-Min Sprint'}
              </button>
            </div>

            {/* 2. Readers Gathered In this Parlour */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm">
              <h4 className="font-serif font-bold text-sm text-[#2F2620] mb-3 flex items-center gap-2">
                <PiUsersBold className="text-[#7D2235]" />
                <span>Gathered in this Room</span>
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/eleanor-avatar.jpg"
                      alt="Eleanor"
                      className="w-7 h-7 rounded-full object-cover border border-[#D8C7B0]"
                    />
                    <div>
                      <span className="font-serif font-bold text-[#2F2620] block leading-tight">
                        Eleanor Vance
                      </span>
                      <span className="text-[10px] text-[#7A6A5E]">Archival Host</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#7D2235]">p. 84</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/arthur-avatar.jpg"
                      alt="Arthur"
                      className="w-7 h-7 rounded-full object-cover border border-[#D8C7B0]"
                    />
                    <div>
                      <span className="font-serif font-bold text-[#2F2620] block leading-tight">
                        Arthur Pendelton
                      </span>
                      <span className="text-[10px] text-[#7A6A5E]">Scribe</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#7D2235]">p. 62</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#7D2235] text-white flex items-center justify-center text-[10px] font-bold">
                      CO
                    </div>
                    <div>
                      <span className="font-serif font-bold text-[#2F2620] block leading-tight">
                        Clara Oswald
                      </span>
                      <span className="text-[10px] text-[#7A6A5E]">Reader</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#7D2235]">p. 91</span>
                </div>
              </div>
            </div>

            {/* 3. Past Canonical Volumes Read in This Parlour */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm">
              <h4 className="font-serif font-bold text-sm text-[#2F2620] mb-3 flex items-center gap-2">
                <PiBookOpenBold className="text-[#7D2235]" />
                <span>Parlour Shelf Archives</span>
              </h4>
              <div className="space-y-2 text-xs">
                {parlour.pastBooks.map((b, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-serif font-bold text-[#2F2620] block">
                        {b.title}
                      </span>
                      <span className="text-[10.5px] text-[#7A6A5E]">{b.author}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#867362]">{b.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Parlour Gathering Schedule */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm">
              <h4 className="font-serif font-bold text-sm text-[#2F2620] mb-2 flex items-center gap-2">
                <PiCalendarBlankBold className="text-[#7D2235]" />
                <span>Next Parlour Assembly</span>
              </h4>
              <p className="text-xs text-[#52443A] leading-relaxed">
                {parlour.meetingTime}. Bring your copy, annotations, and quiet reflection.
              </p>
              <button
                type="button"
                onClick={() => {
                  playWaxSealCrack();
                  enqueueSnackbar('Added assembly reminder to your reading calendar 📅', {
                    variant: 'success',
                  });
                }}
                className="mt-3 w-full py-1.5 rounded-full border border-[#7D2235] text-[#7D2235] hover:bg-[#7D2235] hover:text-white text-xs font-semibold cute-press cursor-pointer transition-colors"
              >
                RSVP to Next Assembly
              </button>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ParlourDetail;
