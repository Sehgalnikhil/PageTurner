import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiFeatherBold,
  PiPlusBold,
  PiHeartBold,
  PiHeartFill,
  PiChatCircleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiShareNetworkBold,
  PiDotsThreeBold,
  PiMoonFill,
  PiPenNibBold,
  PiColumnsBold,
  PiCaretDownBold,
  PiHouseBold,
  PiUsersBold,
  PiHeadphonesBold,
  PiNotePencilBold,
  PiSparkleBold,
  PiXBold,
  PiClockBold,
  PiFlameBold,
  PiCloudRainBold,
  PiPaperPlaneRightBold,
  PiMagnifyingGlassBold,
  PiCheckBold,
  PiBookOpenBold,
  PiCameraBold,
} from 'react-icons/pi';
import ChangeAvatarModal from '../components/common/ChangeAvatarModal';
import LiteraryLetterModal from '../components/common/LiteraryLetterModal';
import SocraticDebateLectern from '../components/common/SocraticDebateLectern';
import AmbientSoundboard from '../components/common/AmbientSoundboard';
import MarginaliaBoard from '../components/common/MarginaliaBoard';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { communityService } from '../services/api';
import { CHAPTER_EXCERPTS } from '../data/bookExcerpts';
import {
  playWaxSealCrack,
  playPaperUnwrap,
  playPageFlipSound,
  playBookSpineSlide,
  startAmbientSound,
  stopAmbientSound,
} from '../utils/soundEffects';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  if (isNaN(diffMs) || diffMs < 60000) return 'Just now';
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleEnterParlour = (parlourId) => {
    playBookSpineSlide();
    navigate(`/community/parlour/${parlourId}`);
  };

  // Extraordinary Entrance Animation State ('sealed' | 'opening' | 'revealed')
  // ONLY triggers when user navigates to The Salon via the Navbar link
  const [entranceStage, setEntranceStage] = useState(() => {
    return location.state?.fromNavbar ? 'sealed' : 'revealed';
  });

  // Watch for Navbar navigation clicks (even if already on /community)
  useEffect(() => {
    if (location.state?.fromNavbar) {
      setEntranceStage('sealed');
      // Replace state in browser history so refreshing won't replay animation
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.triggerTimestamp]);

  const handleOpenSalon = () => {
    if (entranceStage !== 'sealed') return;
    playWaxSealCrack();
    setEntranceStage('opening');
    setTimeout(() => {
      playPaperUnwrap();
    }, 220);
    setTimeout(() => {
      setEntranceStage('revealed');
    }, 1300);
  };

  const handleSkipEntrance = (e) => {
    if (e) e.stopPropagation();
    setEntranceStage('revealed');
  };

  // Automatically start the ceremonial door opening after 1.4s of majestic ambiance
  useEffect(() => {
    let timer = null;
    if (entranceStage === 'sealed') {
      timer = setTimeout(() => {
        handleOpenSalon();
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [entranceStage]);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'parlours' | 'rooms' | 'marginalia' | 'matches'
  const [sortOption, setSortOption] = useState('Recent');
  const [filterParlour, setFilterParlour] = useState('All Parlours');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [parlourDropdownOpen, setParlourDropdownOpen] = useState(false);

  // Interactive Excerpt Reader & Passport Dossier State
  const [activeExcerptKey, setActiveExcerptKey] = useState(null);
  const [showPassportDossier, setShowPassportDossier] = useState(false);
  const [readingFontSize, setReadingFontSize] = useState('base');
  const [passportXP, setPassportXP] = useState(user?.sanctuaryXp || 1240);
  const [claimedDailyXP, setClaimedDailyXP] = useState(false);

  // Literary Letter Dispatch State
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [letterRecipient, setLetterRecipient] = useState(null);
  const [letterSubject, setLetterSubject] = useState('');

  const handleInitiateLetter = (reader, defaultSubj = '') => {
    playWaxSealCrack();
    setLetterRecipient(reader?.email || `${reader?.handle || 'reader'}@pageturner.io`);
    setLetterSubject(defaultSubj || `Affinity Inscription from ${readerName}`);
    setShowLetterModal(true);
  };

  // Parlours Tab Search and Category
  const [parlourCategory, setParlourCategory] = useState('All');
  const [parlourSearch, setParlourSearch] = useState('');

  // Modals & Compose State
  const [showCompose, setShowCompose] = useState(false);
  const [showCreateParlourModal, setShowCreateParlourModal] = useState(false);
  const [showChangeAvatarModal, setShowChangeAvatarModal] = useState(false);
  const [realReaders, setRealReaders] = useState([]);
  const [newReflectionText, setNewReflectionText] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [selectedComposeParlour, setSelectedComposeParlour] = useState('The Gothic Study');

  // Create Parlour State
  const [newParlourTitle, setNewParlourTitle] = useState('');
  const [newParlourDesc, setNewParlourDesc] = useState('');
  const [newParlourCategory, setNewParlourCategory] = useState('Gothic & Victorian');

  // Silent Reading Room Timer
  const [readingTimerRunning, setReadingTimerRunning] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(1485);
  const [activeAmbiance, setActiveAmbiance] = useState('off');

  // Comprehensive Parlours State
  const [parlours, setParlours] = useState([
    {
      id: 'gothic',
      title: 'The Gothic Study',
      category: 'Gothic & Victorian',
      desc: 'Candlelight, Victorian mystery & brooding atmospheres. Delving into Mary Shelley, Bram Stoker, and Oscar Wilde.',
      members: 512,
      activeNow: 42,
      joined: true,
      img: '/images/parlour-gothic.jpg',
      currentBook: 'The Picture of Dorian Gray',
      currentBookAuthor: 'Oscar Wilde',
      currentBookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80',
      prompt: 'Is aestheticism a pursuit of beauty or an escape from moral decay?',
    },
    {
      id: 'midnight',
      title: 'The Midnight Philosophers',
      category: 'Nocturnal Philosophy',
      desc: 'Late-night classics, existential reflections & quiet tea. Sören Kierkegaard, Albert Camus, Jean-Paul Sartre.',
      members: 342,
      activeNow: 19,
      joined: false,
      img: '/images/parlour-midnight.jpg',
      currentBook: 'The Myth of Sisyphus',
      currentBookAuthor: 'Albert Camus',
      currentBookCover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=200&auto=format&fit=crop&q=80',
      prompt: 'Can one imagine Sisyphus truly happy in our contemporary acceleration?',
    },
    {
      id: 'slow',
      title: 'Slow Readers Society',
      category: 'Slow Reading',
      desc: 'One chapter a week. Close reading, deep textual dissection, and marginalia sharing.',
      members: 820,
      activeNow: 63,
      joined: false,
      img: '/images/parlour-slow.jpg',
      currentBook: '1984',
      currentBookAuthor: 'George Orwell',
      currentBookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&auto=format&fit=crop&q=80',
      prompt: 'The concept of memory holes in an era of digital deletion.',
    },
    {
      id: 'poetry',
      title: 'The Antiquarian Poetry Cloister',
      category: 'Romantic Poetry',
      desc: 'Romantic, Decadent, and Symbolist poetry read aloud under soft lamplight.',
      members: 275,
      activeNow: 14,
      joined: false,
      img: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
      currentBook: 'Les Fleurs du mal',
      currentBookAuthor: 'Charles Baudelaire',
      currentBookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80',
      prompt: 'Spleen et Idéal: navigating urban melancholy through verse.',
    },
    {
      id: 'dostoevsky',
      title: "Dostoevsky's Underground",
      category: 'Russian Classics',
      desc: 'Dissecting human frailty, suffering, guilt, and spiritual redemption.',
      members: 419,
      activeNow: 28,
      joined: false,
      img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      currentBook: 'Crime and Punishment',
      currentBookAuthor: 'Fyodor Dostoevsky',
      currentBookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80',
      prompt: "Raskolnikov's extraordinary man theory: rationalization vs conscience.",
    },
  ]);

  // Feed Posts State
  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Eleanor Vance',
      handle: 'eleanor_reads',
      avatar: '/images/eleanor-avatar.jpg',
      time: '22m ago',
      parlour: 'The Gothic Study',
      quote: '“Behind every exquisite thing that existed, there was something tragic.”',
      quoteAuthor: 'Oscar Wilde',
      quoteImg: '/images/dorian-open-book-spread.jpg',
      content:
        'Wilde captures this ache so perfectly. How often do we trade authentic contentment for the aesthetic illusion of it?',
      likes: 47,
      commentsCount: 12,
      liked: false,
      bookmarked: false,
      showComments: false,
      commentsList: [
        {
          id: 'c-1',
          author: 'Julian Frost',
          text: 'The portrait decaying while he remains untouched is the ultimate metaphor for moral dissociation.',
          time: '15m ago',
        },
        {
          id: 'c-2',
          author: 'Clara Oswald',
          text: 'This line stopped me cold when I first read Dorian Gray at university.',
          time: '8m ago',
        },
      ],
    },
    {
      id: 'post-2',
      author: 'Arthur Pendelton',
      handle: 'arthur_scribe',
      avatar: '/images/arthur-avatar.jpg',
      time: '1h ago',
      parlour: 'Slow Readers Society',
      quote: null,
      quoteAuthor: null,
      quoteImg: null,
      content:
        'Rereading Part Two this morning under soft rain. What terrifies me most about 1984 isn’t the torture; it’s the quiet compliance of forgetting.',
      likes: 89,
      commentsCount: 18,
      liked: true,
      bookmarked: false,
      showComments: false,
      commentsList: [
        {
          id: 'c-3',
          author: 'Maya Lin',
          text: 'Doublethink is so insidious precisely because it demands total cognitive surrender.',
          time: '45m ago',
        },
      ],
    },
  ]);

  const [commentInputs, setCommentInputs] = useState({});

  // Live Database Synchronizer with Seamless Fallback
  useEffect(() => {
    let isMounted = true;
    const username = user?.username || user?.name || 'Admin Demo';
    const userHandle = username.toLowerCase().replace(/\s+/g, '_');

    // Fetch parlours from DB
    communityService
      .getParlours()
      .then((res) => {
        if (!isMounted || !res.data || !res.data.length) return;
        const mappedParlours = res.data.map((p) => ({
          ...p,
          id: p.slug || p.id || p._id,
          joined:
            p.membersList?.includes(userHandle) ||
            p.membersList?.includes(username) ||
            p.slug === 'gothic',
        }));
        setParlours(mappedParlours);
      })
      .catch((err) => console.warn('Could not load live parlours from DB, using fallback state:', err));

    // Fetch common room posts from DB
    communityService
      .getPosts({ parlourSlug: 'common-room' })
      .then((res) => {
        if (!isMounted || !res.data || !res.data.length) return;
        const mappedPosts = res.data.map((p) => ({
          ...p,
          id: p.id || p._id,
          parlour: p.parlourTitle || p.parlourSlug || 'The Gothic Study',
          time: formatTimeAgo(p.createdAt),
          liked: p.likedBy?.includes(userHandle) || p.likedBy?.includes(username) || false,
          bookmarked:
            p.bookmarkedBy?.includes(userHandle) || p.bookmarkedBy?.includes(username) || false,
          showComments: false,
          commentsCount: p.commentsList ? p.commentsList.length : 0,
          commentsList: (p.commentsList || []).map((c) => ({
            ...c,
            id: c.id || c._id,
            time: formatTimeAgo(c.createdAt),
          })),
        }));
        setPosts(mappedPosts);
      })
      .catch((err) => console.warn('Could not load live posts from DB, using fallback state:', err));

    // Fetch real registered readers from MongoDB database
    communityService
      .getCommunityReaders()
      .then((res) => {
        if (!isMounted || !res.data || !res.data.length) return;
        setRealReaders(res.data);
      })
      .catch((err) => console.warn('Could not load real readers from DB:', err));

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Optimistic Toggle Join Parlour with MongoDB Synchronization
  const handleToggleJoin = async (id) => {
    playBookSpineSlide();
    const target = parlours.find((p) => p.id === id || p.slug === id || p._id === id);
    if (!target) return;
    const nextJoined = !target.joined;

    // Instant optimistic state update (0ms UI latency)
    setParlours((prev) =>
      prev.map((p) => {
        if (p.id === id || p.slug === id || p._id === id) {
          enqueueSnackbar(nextJoined ? `Entered ${p.title} 🕯️` : `Departed ${p.title}`, {
            variant: nextJoined ? 'success' : 'info',
          });
          return {
            ...p,
            joined: nextJoined,
            members: nextJoined ? (p.members || 0) + 1 : Math.max(0, (p.members || 0) - 1),
          };
        }
        return p;
      })
    );

    // Background sync to MongoDB
    try {
      const slug = target.slug || target.id;
      const username = user?.username || user?.name || 'Admin Demo';
      await communityService.toggleJoinParlour(slug, username);
    } catch (err) {
      console.error('Failed to sync parlour join status:', err);
      // Rollback on failure
      setParlours((prev) =>
        prev.map((p) => {
          if (p.id === id || p.slug === id || p._id === id) {
            return {
              ...p,
              joined: !nextJoined,
              members: !nextJoined ? (p.members || 0) + 1 : Math.max(0, (p.members || 0) - 1),
            };
          }
          return p;
        })
      );
      enqueueSnackbar('Could not sync parlour membership. Changes reverted.', { variant: 'error' });
    }
  };

  // Optimistic Like with MongoDB Synchronization
  const handleLike = async (id) => {
    playWaxSealCrack();
    const target = posts.find((p) => p.id === id || p._id === id);
    if (!target) return;
    const nextLiked = !target.liked;

    // Instant optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id || p._id === id) {
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
          };
        }
        return p;
      })
    );

    // Background MongoDB sync
    try {
      const username = user?.username || user?.name || 'Admin Demo';
      await communityService.toggleLikePost(target._id || target.id, username);
    } catch (err) {
      console.error('Failed to sync like:', err);
      // Rollback
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === id || p._id === id) {
            return {
              ...p,
              liked: !nextLiked,
              likes: !nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
            };
          }
          return p;
        })
      );
    }
  };

  // Optimistic Bookmark with MongoDB Synchronization
  const handleBookmark = async (id) => {
    playPageFlipSound();
    const target = posts.find((p) => p.id === id || p._id === id);
    if (!target) return;
    const nextBookmarked = !target.bookmarked;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id || p._id === id) {
          enqueueSnackbar(
            nextBookmarked
              ? 'Saved reflection to your marginalia archive 📖'
              : 'Removed reflection from saved archive',
            { variant: 'info' }
          );
          return { ...p, bookmarked: nextBookmarked };
        }
        return p;
      })
    );

    try {
      const username = user?.username || user?.name || 'Admin Demo';
      await communityService.toggleBookmarkPost(target._id || target.id, username);
    } catch (err) {
      console.error('Failed to sync bookmark:', err);
      setPosts((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? { ...p, bookmarked: !nextBookmarked } : p))
      );
    }
  };

  const toggleComments = (postId) => {
    playPaperUnwrap();
    setPosts((prev) =>
      prev.map((p) => (p.id === postId || p._id === postId ? { ...p, showComments: !p.showComments } : p))
    );
  };

  // Optimistic Add Comment with MongoDB Synchronization
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    playPageFlipSound();
    const authorName = user?.username || user?.name || 'Nikhil Sehgal';
    const authorHandle = (user?.username || user?.name || 'nikhil_sehgal').toLowerCase().replace(/\s+/g, '_');
    const tempCommentId = `c-${Date.now()}`;

    const newComment = {
      id: tempCommentId,
      _id: tempCommentId,
      author: authorName,
      handle: authorHandle,
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      text,
      time: 'Just now',
    };

    // Instant optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId || p._id === postId) {
          return {
            ...p,
            commentsCount: (p.commentsCount || 0) + 1,
            commentsList: [...(p.commentsList || []), newComment],
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    enqueueSnackbar('Marginalia inscribed ✒️', { variant: 'success' });

    // Background sync to MongoDB
    try {
      const target = posts.find((p) => p.id === postId || p._id === postId);
      const postDocId = target?._id || target?.id || postId;
      const res = await communityService.addComment(postDocId, {
        author: authorName,
        handle: authorHandle,
        avatar: '/images/eleanor-avatar.jpg',
        text,
      });

      if (res.data?.comment) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId || p._id === postId) {
              return {
                ...p,
                commentsList: p.commentsList.map((c) =>
                  c.id === tempCommentId
                    ? {
                        ...c,
                        id: res.data.comment.id || res.data.comment._id,
                        _id: res.data.comment._id,
                      }
                    : c
                ),
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Failed to post comment to database:', err);
      // Rollback comment on error
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId || p._id === postId) {
            return {
              ...p,
              commentsCount: Math.max(0, (p.commentsCount || 0) - 1),
              commentsList: (p.commentsList || []).filter((c) => c.id !== tempCommentId),
            };
          }
          return p;
        })
      );
      enqueueSnackbar('Could not save marginalia note. Please retry.', { variant: 'error' });
    }
  };

  // Optimistic Publish Reflection with MongoDB Persistence
  const handlePublishReflection = async (e) => {
    e.preventDefault();
    if (!newReflectionText.trim()) return;

    playWaxSealCrack();
    const authorName = user?.username || user?.name || 'Nikhil Sehgal';
    const authorHandle = (user?.username || user?.name || 'nikhil_sehgal').toLowerCase().replace(/\s+/g, '_');
    const tempPostId = `post-${Date.now()}`;

    const newPost = {
      id: tempPostId,
      _id: tempPostId,
      author: authorName,
      handle: authorHandle,
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      time: 'Just now',
      parlour: selectedComposeParlour,
      parlourTitle: selectedComposeParlour,
      parlourSlug: 'common-room',
      quote: newQuoteText.trim() ? `“${newQuoteText.trim()}”` : null,
      quoteAuthor: newQuoteAuthor.trim() || null,
      quoteImg: newQuoteText.trim() ? '/images/dorian-open-book-spread.jpg' : null,
      content: newReflectionText.trim(),
      likes: 1,
      commentsCount: 0,
      liked: true,
      bookmarked: false,
      showComments: false,
      commentsList: [],
    };

    // Instant optimistic update
    setPosts([newPost, ...posts]);
    setNewReflectionText('');
    setNewQuoteText('');
    setNewQuoteAuthor('');
    setShowCompose(false);
    enqueueSnackbar('Reflection inscribed to the Common Room ✒️', { variant: 'success' });

    // Background DB persistence
    try {
      const res = await communityService.createPost({
        parlourSlug: 'common-room',
        parlourTitle: selectedComposeParlour,
        author: authorName,
        handle: authorHandle,
        avatar: '/images/eleanor-avatar.jpg',
        tag: 'Community Reflection',
        quote: newPost.quote,
        quoteAuthor: newPost.quoteAuthor,
        quoteImg: newPost.quoteImg,
        content: newPost.content,
      });

      if (res.data) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === tempPostId
              ? {
                  ...p,
                  id: res.data.id || res.data._id,
                  _id: res.data._id,
                  liked: true,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to persist reflection to database:', err);
      enqueueSnackbar('Note: Reflection saved locally.', {
        variant: 'warning',
      });
    }
  };

  // Optimistic Create Parlour with MongoDB Persistence
  const handleCreateParlour = async (e) => {
    e.preventDefault();
    if (!newParlourTitle.trim()) return;

    playWaxSealCrack();
    const authorName = user?.username || user?.name || 'Nikhil Sehgal';
    const authorHandle = (user?.username || user?.name || 'nikhil_sehgal').toLowerCase().replace(/\s+/g, '_');
    const tempParlourId = `parlour-${Date.now()}`;
    const generatedSlug = newParlourTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newParlour = {
      id: generatedSlug || tempParlourId,
      _id: tempParlourId,
      slug: generatedSlug,
      title: newParlourTitle.trim(),
      category: newParlourCategory,
      desc: newParlourDesc.trim() || 'A new literary parlour for kindred minds.',
      longDesc: newParlourDesc.trim() || 'A sanctuary for close reading and deep textual reflection.',
      curator: authorName,
      curatorHandle: authorHandle,
      curatorAvatar: '/images/eleanor-avatar.jpg',
      members: 1,
      activeNow: 1,
      joined: true,
      img: '/images/parlour-midnight.jpg',
      currentBook: 'Selected Canonical Volume',
      currentBookAuthor: 'Guild Curator',
      currentBookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80',
      prompt: 'Opening session inquiry awaiting participant discourse.',
    };

    setParlours([newParlour, ...parlours]);
    setNewParlourTitle('');
    setNewParlourDesc('');
    setShowCreateParlourModal(false);
    enqueueSnackbar(`Literary Parlour "${newParlour.title}" established! 🕯️`, {
      variant: 'success',
    });

    try {
      const res = await communityService.createParlour({
        title: newParlour.title,
        category: newParlour.category,
        desc: newParlour.desc,
        longDesc: newParlour.longDesc,
        curator: newParlour.curator,
        curatorHandle: newParlour.curatorHandle,
        curatorAvatar: newParlour.curatorAvatar,
        img: newParlour.img,
        currentBook: newParlour.currentBook,
        currentBookAuthor: newParlour.currentBookAuthor,
        currentBookCover: newParlour.currentBookCover,
        prompt: newParlour.prompt,
      });

      if (res.data) {
        setParlours((prev) =>
          prev.map((p) =>
            p.id === tempParlourId || p.id === generatedSlug
              ? {
                  ...p,
                  id: res.data.slug || res.data.id || res.data._id,
                  _id: res.data._id,
                  slug: res.data.slug,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to persist parlour to database:', err);
      enqueueSnackbar('Note: Parlour created locally.', {
        variant: 'warning',
      });
    }
  };

  const handleToggleAmbiance = (type) => {
    if (activeAmbiance === type) {
      stopAmbientSound();
      setActiveAmbiance('off');
      enqueueSnackbar('Ambiance silenced 🔇', { variant: 'info' });
    } else {
      startAmbientSound(type);
      setActiveAmbiance(type);
      enqueueSnackbar(
        type === 'rain'
          ? 'Listening to rain against cathedral window 🌧️'
          : 'Hearth fire crackling in the salon 🕯️',
        { variant: 'info' }
      );
    }
  };

  const handleWaxSealClick = () => {
    playWaxSealCrack();
    enqueueSnackbar('“A book is a dream you hold in your hands.” — Neil Gaiman', {
      variant: 'info',
    });
  };

  const readerName = user?.username || 'nikhil sehgal';
  const userAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';

  const fallbackRealReaders = [
    {
      id: 'r1',
      name: 'nikhil sehgal',
      username: 'nikhil sehgal',
      handle: 'nikhil_sehgal',
      match: '98%',
      affinity: '98%',
      shared: 'Victorian Gothic & Classic Tragedy',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      role: 'Curator & Chief Librarian',
      currentBook: 'The Picture of Dorian Gray',
      page: 'p. 84 (Ch. IV)',
      level: 'Lv. 7',
      memberId: 'PT-89421',
    },
    {
      id: 'r2',
      name: 'krish garg',
      username: 'krish garg',
      handle: 'krish_garg',
      match: '95%',
      affinity: '95%',
      shared: 'Dystopian Classics & Political Realism',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'Sanctuary Reader',
      currentBook: '1984',
      page: 'p. 142 (Part II)',
      level: 'Lv. 5',
      memberId: 'PT-82314',
    },
    {
      id: 'r3',
      name: 'manan',
      username: 'manan',
      handle: 'manan',
      match: '92%',
      affinity: '92%',
      shared: 'Stoic & Nocturnal Philosophy, Marcus Aurelius',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      role: 'Sanctuary Reader',
      currentBook: 'Meditations',
      page: 'p. 54 (Book IV)',
      level: 'Lv. 4',
      memberId: 'PT-85112',
    },
    {
      id: 'r4',
      name: 'nik',
      username: 'nik',
      handle: 'nik',
      match: '89%',
      affinity: '89%',
      shared: 'Romantic Poetry & Archaic Epics',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'Sanctuary Reader',
      currentBook: 'Frankenstein',
      page: 'p. 91 (Vol. II)',
      level: 'Lv. 4',
      memberId: 'PT-87941',
    },
    {
      id: 'r5',
      name: 'nikhik',
      username: 'nikhik',
      handle: 'nikhik',
      match: '87%',
      affinity: '87%',
      shared: 'Psychological Realism & Russian Canon',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      role: 'Sanctuary Reader',
      currentBook: 'Crime and Punishment',
      page: 'p. 188 (Ch. III)',
      level: 'Lv. 3',
      memberId: 'PT-83019',
    },
    {
      id: 'r6',
      name: 'nikhil11',
      username: 'nikhil11',
      handle: 'nikhil11',
      match: '85%',
      affinity: '85%',
      shared: 'Speculative Canon & Dune Chronicles',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      role: 'Sanctuary Reader',
      currentBook: 'Dune',
      page: 'p. 312 (Muad\'Dib)',
      level: 'Lv. 3',
      memberId: 'PT-88120',
    },
  ];

  const allAvailableReaders = realReaders.length > 0 ? realReaders : fallbackRealReaders;

  const displayedMatches = allAvailableReaders.filter(
    (r) =>
      r.username?.toLowerCase() !== readerName?.toLowerCase() &&
      r.email?.toLowerCase() !== user?.email?.toLowerCase()
  );

  // Filtered posts for feed
  const filteredPosts = posts.filter((p) => {
    if (filterParlour === 'All Parlours') return true;
    return p.parlour === filterParlour;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === 'Top Reflections') return b.likes - a.likes;
    if (sortOption === 'Most Discussed') return b.commentsCount - a.commentsCount;
    return 0;
  });

  // Filtered parlours for Literary Parlours tab
  const filteredParloursList = parlours.filter((p) => {
    const matchesCat = parlourCategory === 'All' || p.category === parlourCategory;
    const matchesSearch =
      !parlourSearch.trim() ||
      p.title.toLowerCase().includes(parlourSearch.toLowerCase()) ||
      p.desc.toLowerCase().includes(parlourSearch.toLowerCase()) ||
      p.currentBook.toLowerCase().includes(parlourSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const joinedParlours = parlours.filter((p) => p.joined);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E6] text-[#2F2620] selection:bg-[#7D2235]/20 font-sans">
      {/* ============================================================
          CINEMATIC OPENING CEREMONY (ANTIQUE 3D FOLIO DOORS & WAX SEAL)
          ============================================================ */}
      {entranceStage !== 'revealed' && (
        <div
          className={`fixed inset-0 z-[100] perspective-salon flex items-center justify-center overflow-hidden bg-[#0A0706] ${
            entranceStage === 'opening' ? 'animate-entrance-backdrop pointer-events-none' : ''
          }`}
        >
          {/* Ambient Candle Dust Particles drifting in the dark */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-[#E0A96D] animate-dust-drift filter blur-[0.5px]" />
            <div className="absolute top-3/4 left-2/3 w-2 h-2 rounded-full bg-[#E0A96D] animate-dust-drift filter blur-[1px] [animation-delay:1.5s]" />
            <div className="absolute top-1/2 left-1/5 w-1 h-1 rounded-full bg-[#E0A96D] animate-dust-drift filter blur-[0.5px] [animation-delay:3s]" />
          </div>

          {/* Center Splitting Golden Light Ray Burst during Opening */}
          {entranceStage === 'opening' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-12 sm:w-28 h-full bg-gradient-to-r from-transparent via-[#FAD089]/60 to-transparent animate-light-rays filter blur-xl" />
              <div className="absolute w-[340px] h-[340px] rounded-full bg-[#F39C12]/40 animate-light-rays filter blur-3xl" />
            </div>
          )}

          {/* Fast Skip Pill (Top Right) */}
          <button
            type="button"
            onClick={handleSkipEntrance}
            className="absolute top-6 right-6 z-50 text-xs text-[#D8C7B0]/80 hover:text-[#FAF4E8] bg-black/60 hover:bg-black/90 px-4 py-1.5 rounded-full border border-[#C6A16B]/40 backdrop-blur-md transition-all cute-press cursor-pointer flex items-center gap-1.5 shadow-xl"
          >
            <span>Fast Enter</span>
            <PiXBold className="text-[10px]" />
          </button>

          {/* HORIZONTAL CRIMSON & GOLD RIBBON SASH (Across the seam) */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-14 z-20 pointer-events-none flex items-center justify-center">
            <div className="w-full h-10 bg-gradient-to-r from-transparent via-[#701828]/95 to-transparent border-y border-[#D4AF37]/50 shadow-[0_4px_25px_rgba(0,0,0,0.8)]" />
          </div>

          {/* LEFT GOTHIC FOLIO DOOR */}
          <div
            onClick={handleOpenSalon}
            className={`door-panel absolute top-0 left-0 w-1/2 h-full cursor-pointer select-none border-r-2 border-[#C6A16B]/50 bg-gradient-to-r from-[#120B07] via-[#1E130B] to-[#160E08] shadow-[inset_-25px_0_50px_rgba(0,0,0,0.92)] flex flex-col justify-between p-6 sm:p-12 ${
              entranceStage === 'opening' ? 'animate-folio-left' : ''
            }`}
          >
            {/* Ambient Candle Halo for Left Sconce */}
            <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-[#F39C12]/12 filter blur-3xl pointer-events-none" />

            {/* Gothic Arch Inner Wood Frame Molding */}
            <div className="absolute inset-4 sm:inset-8 border border-[#C6A16B]/25 rounded-l-2xl pointer-events-none" />
            <div className="absolute inset-6 sm:inset-12 border border-[#8C6D3F]/15 rounded-l-xl pointer-events-none" />

            {/* Antique Brass Corner Plates */}
            <div className="w-16 h-16 border-t-2 border-l-2 border-[#C6A16B]/60 rounded-tl-xl relative z-10">
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#C6A16B]/80 shadow-sm" />
            </div>

            {/* Left Door Mounted Candle Sconce */}
            <div className="absolute top-1/3 right-8 sm:right-16 flex flex-col items-center z-10">
              <div className="w-4 h-7 rounded-full bg-gradient-to-t from-[#D35400] via-[#F39C12] to-[#FFF9E6] filter drop-shadow-[0_0_16px_#F39C12] animate-candle-flame" />
              <div className="w-3 h-14 bg-gradient-to-b from-[#F5E6CC] to-[#D0BE9C] rounded-t-sm shadow-md border-t border-[#FFF]" />
              <div className="w-9 h-2.5 bg-[#8C6D3F] rounded-full shadow-lg mt-[-2px] border-b border-[#523C1B]" />
              <div className="w-2.5 h-8 bg-gradient-to-b from-[#634C2B] to-[#362612] rounded-b-sm" />
            </div>

            {/* Inset Gothic Latin Plaque (Placed high away from the seal) */}
            <div className="relative z-10 self-start max-w-xs mt-6 pl-2 sm:pl-4 opacity-60">
              <div className="font-serif italic text-base sm:text-xl text-[#E8D4B8] tracking-widest flex items-center gap-2">
                <span>❧</span>
                <span>Silentium et Sapientia</span>
              </div>
              <div className="font-mono text-[9px] sm:text-[11px] text-[#A89886] tracking-widest uppercase mt-1 pl-4">
                Libri Sunt Amici Vitae
              </div>
            </div>

            {/* Antique Brass Corner Plate (Bottom-Left) */}
            <div className="w-16 h-16 border-b-2 border-l-2 border-[#C6A16B]/60 rounded-bl-xl relative z-10">
              <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#C6A16B]/80 shadow-sm" />
            </div>
          </div>

          {/* RIGHT GOTHIC FOLIO DOOR */}
          <div
            onClick={handleOpenSalon}
            className={`door-panel absolute top-0 right-0 w-1/2 h-full cursor-pointer select-none border-l-2 border-[#C6A16B]/50 bg-gradient-to-l from-[#120B07] via-[#1E130B] to-[#160E08] shadow-[inset_25px_0_50px_rgba(0,0,0,0.92)] flex flex-col justify-between p-6 sm:p-12 ${
              entranceStage === 'opening' ? 'animate-folio-right' : ''
            }`}
          >
            {/* Ambient Candle Halo for Right Sconce */}
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#F39C12]/12 filter blur-3xl pointer-events-none" />

            {/* Gothic Arch Inner Wood Frame Molding */}
            <div className="absolute inset-4 sm:inset-8 border border-[#C6A16B]/25 rounded-r-2xl pointer-events-none" />
            <div className="absolute inset-6 sm:inset-12 border border-[#8C6D3F]/15 rounded-r-xl pointer-events-none" />

            {/* Antique Brass Corner Plates */}
            <div className="self-end w-16 h-16 border-t-2 border-r-2 border-[#C6A16B]/60 rounded-tr-xl relative z-10">
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#C6A16B]/80 shadow-sm" />
            </div>

            {/* Right Door Mounted Candle Sconce */}
            <div className="absolute top-1/3 left-8 sm:left-16 flex flex-col items-center z-10">
              <div className="w-4 h-7 rounded-full bg-gradient-to-t from-[#D35400] via-[#F39C12] to-[#FFF9E6] filter drop-shadow-[0_0_16px_#F39C12] animate-candle-flame [animation-delay:0.4s]" />
              <div className="w-3 h-14 bg-gradient-to-b from-[#F5E6CC] to-[#D0BE9C] rounded-t-sm shadow-md border-t border-[#FFF]" />
              <div className="w-9 h-2.5 bg-[#8C6D3F] rounded-full shadow-lg mt-[-2px] border-b border-[#523C1B]" />
              <div className="w-2.5 h-8 bg-gradient-to-b from-[#634C2B] to-[#362612] rounded-b-sm" />
            </div>

            {/* Inset Gothic Latin Plaque (Placed high away from the seal) */}
            <div className="relative z-10 self-end max-w-xs mt-6 pr-2 sm:pr-4 text-right opacity-60">
              <div className="font-serif italic text-base sm:text-xl text-[#E8D4B8] tracking-widest flex items-center justify-end gap-2">
                <span>Sanctuarium Litterarum</span>
                <span>☙</span>
              </div>
              <div className="font-mono text-[9px] sm:text-[11px] text-[#A89886] tracking-widest uppercase mt-1 pr-4">
                Est. MDCCCLXXXIV
              </div>
            </div>

            {/* Antique Brass Corner Plate (Bottom-Right) */}
            <div className="self-end w-16 h-16 border-b-2 border-r-2 border-[#C6A16B]/60 rounded-br-xl relative z-10">
              <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#C6A16B]/80 shadow-sm" />
            </div>
          </div>

          {/* ELEGANT TOP CALLIGRAPHIC HEADER (Positioned high above seal, zero overlap) */}
          <div className="absolute top-10 sm:top-14 left-0 right-0 z-40 text-center pointer-events-none select-none px-4">
            <div className="font-serif text-[#C6A16B] text-xs sm:text-sm tracking-[0.3em] uppercase opacity-85 flex items-center justify-center gap-3">
              <span>❦</span>
              <span>Archivum Litterarum</span>
              <span>❦</span>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-5xl text-[#FDF6EA] tracking-wide mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              The Readers’ Salon
            </h1>
            <p className="font-serif italic text-xs sm:text-base text-[#D4AF37] mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] max-w-md mx-auto">
              A private literary haven for kindred minds & fine bindings
            </p>
          </div>

          {/* CENTERPIECE MONOGRAM WAX SEAL & INVITATION TRIGGER */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center text-center cursor-pointer ${
              entranceStage === 'opening' ? 'animate-seal-break pointer-events-none' : ''
            }`}
            onClick={handleOpenSalon}
          >
            {/* Glowing Candle Halo */}
            <div className="absolute w-56 h-56 rounded-full bg-[#F39C12]/20 filter blur-3xl animate-candle-glow pointer-events-none" />

            {/* Hanging Satin Ribbon Tails */}
            <div className="absolute top-16 flex items-start gap-3 pointer-events-none">
              <div className="w-5 h-20 bg-gradient-to-b from-[#8D263B] to-[#58101E] border-x border-[#D4AF37]/40 shadow-lg transform -rotate-6 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
              <div className="w-5 h-24 bg-gradient-to-b from-[#8D263B] to-[#58101E] border-x border-[#D4AF37]/40 shadow-lg transform rotate-6 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />
            </div>

            {/* Large Intricate Crimson Wax Seal Medallion */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#9B2C42] via-[#751B2E] to-[#4A101C] shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(155,44,66,0.6)] border-4 border-[#C6A16B] flex items-center justify-center cute-press transform hover:scale-105 transition-transform duration-300 overflow-hidden">
              {/* Outer Scalloped Wax Ring */}
              <div className="absolute inset-1.5 rounded-full border border-dashed border-[#F3E5C8]/50 pointer-events-none z-10" />
              <div className="absolute inset-3 rounded-full border border-[#D4AF37]/40 pointer-events-none z-10" />

              {/* Embossed Open Book, Lantern & Cup Illustrated Emblem */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#F7EFE4] flex items-center justify-center shadow-inner">
                <img
                  src="/images/pageturner-emblem.png"
                  alt="PageTurner Seal"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
            </div>

            {/* Bottom Ceremony Prompt (Positioned safely below seal) */}
            <div className="mt-14 text-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/75 border border-[#C6A16B]/60 text-[#FAF4E8] text-xs sm:text-sm font-medium backdrop-blur-md cute-press shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#E0A96D] animate-ping" />
                <span>Doors Parting... Tap to Enter Instantly</span>
                <span className="text-sm">🕯️</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-1 w-full max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        
        {/* ============================================================
            1. THE HERO SANCTUARY BANNER (IDENTICAL TO REFERENCE MOCKUP)
            ============================================================ */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-[#D5C6AF] shadow-[0_16px_50px_rgba(35,26,18,0.22)] bg-[#191512] mb-6 select-none animate-fadeIn">
          
          {/* Panoramic Atmospheric Visual Window (NO TEXT IN IMAGE) */}
          <div className="relative w-full min-h-[320px] sm:min-h-[350px] md:min-h-[370px] overflow-hidden flex flex-col justify-between">
            <img
              src="/images/salon-hero-backdrop.jpg"
              alt="The Readers' Salon Window Sanctuary"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] pointer-events-none"
            />

            {/* Gradient overlays to ensure crystal-clear text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

            {/* Top / Main Hero Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Left Column: Heading, Subtitle, Description, and CTA Buttons */}
              <div className="max-w-xl text-left">
                <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#F7EFE2] tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  The Readers’ Salon
                </h1>
                
                <p className="font-serif italic text-base sm:text-lg text-[#E6D4BD] mt-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                  A private literary haven for kindred minds.
                </p>
                
                <p className="text-xs sm:text-[13px] text-[#CBC0B0] mt-1.5 max-w-md leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  Join intimate parlours, share reflections, exchange marginalia, and find readers who read the world like you do.
                </p>

                {/* The Authentic Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {/* Primary Burgundy Button: Share a Reflection */}
                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setShowCompose((prev) => !prev);
                    }}
                    className="h-10 px-5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-[#FDFBF7] text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 shadow-[0_4px_16px_rgba(125,34,53,0.45)] border border-[#A4344C]/40 cute-press cursor-pointer transition-all"
                  >
                    <PiFeatherBold className="text-sm text-[#F7D8A4]" />
                    <span>Share a Reflection</span>
                  </button>

                  {/* Frosted Glass Outline Button: + Create a Parlour */}
                  <button
                    type="button"
                    onClick={() => {
                      playBookSpineSlide();
                      setShowCreateParlourModal(true);
                    }}
                    className="h-10 px-5 rounded-full bg-black/40 hover:bg-black/60 text-[#EADBCC] text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-[#D1B898]/30 shadow-sm cute-press cursor-pointer transition-all"
                  >
                    <PiPlusBold className="text-xs text-[#EADBCC]" />
                    <span>Create a Parlour</span>
                  </button>

                  {/* Frosted Glass Button: ✉️ Poste Restante (Mailbox) */}
                  <button
                    type="button"
                    onClick={() => {
                      playWaxSealCrack();
                      setShowLetterModal(true);
                    }}
                    className="h-10 px-4 rounded-full bg-black/40 hover:bg-black/60 text-[#F7D8A4] text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-[#D1B898]/30 shadow-sm cute-press cursor-pointer transition-all"
                    title="Open your Literary Mailbox & Dispatched Wax Letters"
                  >
                    <span>✉️</span>
                    <span>Poste Restante</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Real Parchment Note Card (Today in the Salon ♡) */}
              <div className="relative self-end md:self-auto w-full max-w-[280px] sm:max-w-[300px]">
                <div className="relative bg-[#FAF4E8] text-[#2F241C] rounded-lg p-5 border border-[#D8C7B0] shadow-[0_16px_35px_rgba(0,0,0,0.45)] transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  
                  {/* Card Header */}
                  <div className="text-center font-serif text-xs text-[#7B6856] tracking-wide mb-2 flex items-center justify-center gap-1">
                    <span>Today in the Salon</span>
                    <span className="text-[#8D263B] text-[10px]">♡</span>
                  </div>
                  
                  {/* Card Quote */}
                  <blockquote className="font-serif italic text-sm text-[#2F241C] text-center leading-snug">
                    “A book is a dream you hold in your hands.”
                  </blockquote>
                  
                  {/* Author Attribution */}
                  <p className="font-serif text-[11px] text-[#867362] text-right mt-3">
                    — Neil Gaiman
                  </p>

                  {/* Authentic Dark Red Wax Seal Medallion in Corner */}
                  <div
                    onClick={handleWaxSealClick}
                    className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#7C1E2D] border-2 border-[#57131F] shadow-[0_6px_14px_rgba(0,0,0,0.4)] flex items-center justify-center text-[#E89EAA] font-serif text-[11px] font-bold ring-2 ring-[#992537]/40 select-none rotate-12 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    title="Click for literary seal impression"
                  >
                    PT
                  </div>
                </div>
              </div>

            </div>

            <div className="h-2" />
          </div>

          {/* ============================================================
              NAVIGATION RIBBON BAR (DIRECTLY ATTACHED UNDER WINDOW SILL)
              ============================================================ */}
          <div className="w-full bg-[#EFE8DA] border-t border-[#D9CCB7] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs flex-wrap gap-3">
            
            {/* 5 Distinct Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium flex-wrap">
              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('feed');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiHouseBold className="text-xs" />
                <span>Salon Feed</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('parlours');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'parlours'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiUsersBold className="text-xs" />
                <span>Literary Parlours</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('rooms');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'rooms'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiHeadphonesBold className="text-xs" />
                <span>Reading Rooms</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('marginalia');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'marginalia'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiNotePencilBold className="text-xs" />
                <span>Marginalia Exchange</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('matches');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'matches'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiSparkleBold className="text-xs" />
                <span>Reader Matches</span>
              </button>
            </div>

            {/* Metrics & Avatars on the Right */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs">
              <div className="flex -space-x-2 overflow-hidden items-center">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] object-cover"
                  src={userAvatar}
                  alt={readerName}
                  title={`You (${readerName})`}
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] object-cover"
                  src="/images/eleanor-avatar.jpg"
                  alt="Eleanor Vance"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] object-cover"
                  src="/images/arthur-avatar.jpg"
                  alt="Arthur Pendelton"
                />
                <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] bg-[#C59B63] text-white items-center justify-center text-[10px] font-bold">
                  PT
                </div>
              </div>
              <span className="text-[#645548] font-medium hidden sm:inline">12,480 Readers</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#286337] bg-[#286337]/10 px-2.5 py-0.5 rounded-full text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#286337] animate-pulse" />
                218 Reading Now
              </span>
            </div>

          </div>
        </section>

        {/* ============================================================
            CREATE PARLOUR MODAL (INTERACTIVE)
            ============================================================ */}
        {showCreateParlourModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#FAF4EA] rounded-2xl border-2 border-[#D8C7B0] p-6 shadow-2xl text-left animate-drawer-spring">
              <button
                type="button"
                onClick={() => setShowCreateParlourModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#7A6A5E] cursor-pointer"
              >
                <PiXBold className="text-base" />
              </button>

              <h3 className="font-serif text-xl font-bold text-[#2F2620] mb-1 flex items-center gap-2">
                <PiUsersBold className="text-[#7D2235]" />
                <span>Establish a Literary Parlour</span>
              </h3>
              <p className="text-xs text-[#7A6A5E] mb-4">
                Found an intimate circle dedicated to an author, era, philosophical inquiry, or reading discipline.
              </p>

              <form onSubmit={handleCreateParlour} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#2F2620] mb-1">
                    Parlour Name
                  </label>
                  <input
                    type="text"
                    value={newParlourTitle}
                    onChange={(e) => setNewParlourTitle(e.target.value)}
                    placeholder="e.g. The Dostoevsky Circle"
                    className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs sm:text-sm text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#2F2620] mb-1">
                    Literary Movement / Category
                  </label>
                  <select
                    value={newParlourCategory}
                    onChange={(e) => setNewParlourCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                  >
                    <option value="Gothic & Victorian">Gothic & Victorian</option>
                    <option value="Nocturnal Philosophy">Nocturnal Philosophy</option>
                    <option value="Slow Reading">Slow Reading</option>
                    <option value="Romantic Poetry">Romantic Poetry</option>
                    <option value="Russian Classics">Russian Classics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#2F2620] mb-1">
                    Sanctuary Description & Vibe
                  </label>
                  <textarea
                    rows="3"
                    value={newParlourDesc}
                    onChange={(e) => setNewParlourDesc(e.target.value)}
                    placeholder="e.g. Delving into Russian existentialism, psychological torment, and the search for redemption..."
                    className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateParlourModal(false)}
                    className="px-4 py-2 text-xs text-[#7A6A5E] hover:text-[#2F2620]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-md cute-press cursor-pointer flex items-center gap-1.5"
                  >
                    <PiPlusBold className="text-xs" />
                    <span>Open Parlour to Kindred Minds</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            SHARE A REFLECTION COMPOSER (EXPANDABLE)
            ============================================================ */}
        {showCompose && (
          <div className="mb-6 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#7D2235]/30 shadow-lg text-left animate-drawer-spring">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-[#2F2620] flex items-center gap-2">
                <PiFeatherBold className="text-[#7D2235]" />
                <span>Inscribe a Reflection to the Common Room</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#7A6A5E]"
              >
                <PiXBold className="text-sm" />
              </button>
            </div>

            <form onSubmit={handlePublishReflection} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Quotation / passage (e.g. “To define is to limit...”)"
                  className="sm:col-span-2 w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs font-serif italic text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                />
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Author (e.g. Oscar Wilde)"
                  className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#76675B] mb-1">
                  Post to Literary Parlour:
                </label>
                <select
                  value={selectedComposeParlour}
                  onChange={(e) => setSelectedComposeParlour(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                >
                  {parlours.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows="3"
                value={newReflectionText}
                onChange={(e) => setNewReflectionText(e.target.value)}
                placeholder="What did this passage reveal? Share your thoughts with fellow readers..."
                className="w-full p-3 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
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
                  <PiFeatherBold className="text-xs text-[#F7D8A4]" />
                  <span>Publish to Common Room</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            TAB 1: SALON FEED (THE 3-COLUMN SPECIFICATION COMMON ROOM)
            ============================================================ */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start animate-fade-in">
            
            {/* LEFT COLUMN (3 COLS): CLIPBOARD "MY READER PASSPORT" */}
            <div className="lg:col-span-3">
              <div className="relative pt-4">
                
                {/* Metallic Clipboard Binder Clamp */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-16 h-7 bg-gradient-to-b from-[#56493F] to-[#2E2520] rounded-t-md shadow-md border border-[#2B231D] flex items-center justify-center">
                  <div className="w-8 h-2 rounded-full bg-[#1C1714] border border-white/20 shadow-inner" />
                </div>

                {/* Textured Passport Card */}
                <div
                  onClick={() => {
                    playPaperUnwrap();
                    setShowPassportDossier(true);
                  }}
                  className="relative z-10 bg-[#FAF4EA] rounded-2xl border-2 border-[#D8C7B0] p-6 text-center shadow-[0_8px_30px_rgba(40,30,20,0.08)] cursor-pointer hover:border-[#7D2235]/40 transition-all group"
                  title="Click to view detailed Reader Dossier & XP Breakdown"
                >
                  {/* Heading */}
                  <div className="flex items-center justify-center gap-1.5 mt-1 mb-4">
                    <h3 className="font-serif text-lg font-bold text-[#2F2620] group-hover:text-[#7D2235] transition-colors">
                      My Reader Passport
                    </h3>
                    <span className="text-xs text-[#7A6A5E]">ⓘ</span>
                  </div>

                  {/* Circular Profile Avatar with Real-Time PFP & Edit Action */}
                  <div className="relative w-20 h-20 mx-auto mb-1.5 rounded-full overflow-hidden border-2 border-[#D9C4A6] shadow-inner bg-[#2C231E] group/avatar relative">
                    <img
                      src={userAvatar}
                      alt={readerName}
                      className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPaperUnwrap();
                        setShowChangeAvatarModal(true);
                      }}
                      title="Change Profile Picture"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-mono cursor-pointer"
                    >
                      <PiCameraBold className="text-base text-[#F7D8A4]" />
                      <span>Edit PFP</span>
                    </button>
                  </div>

                  {/* Change PFP Quick Pill */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPaperUnwrap();
                        setShowChangeAvatarModal(true);
                      }}
                      className="text-[10px] font-mono font-semibold text-[#7D2235] hover:text-[#92283F] inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <PiCameraBold className="text-xs" />
                      <span>Change PFP</span>
                    </button>
                  </div>

                  {/* Reader Identity */}
                  <h4 className="font-serif font-bold text-base text-[#2F2620] leading-tight">
                    {readerName}
                  </h4>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#817265] block mt-0.5">
                    PT-48127
                  </span>

                  {/* Passport Badges */}
                  <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                      <PiMoonFill className="text-[#7D2235] text-xs" />
                      <span>Night Owl Reader</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                      <PiPenNibBold className="text-[#7D2235] text-xs" />
                      <span>Marginalia Scribe</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                      <PiColumnsBold className="text-[#7D2235] text-xs" />
                      <span>Classics Initiate</span>
                    </span>
                  </div>

                  {/* Level Progress Station */}
                  <div className="mt-5 pt-4 border-t border-[#E5D4BC] text-left text-xs font-sans">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#76675B]">Literary Level</span>
                      <span className="font-bold text-[#7D2235]">Lv. 4</span>
                    </div>
                    <div className="text-xs font-serif font-bold text-[#2F2620] mb-2">
                      The Attentive Reader
                    </div>

                    {/* XP Bar */}
                    <div className="w-full h-2 rounded-full bg-[#E5D7C2] overflow-hidden">
                      <div
                        className="h-full bg-[#7D2235] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (passportXP / 1500) * 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#76675B] mt-1.5">
                      <span>{passportXP} / 1,500 XP</span>
                      <span>Lv. 4</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN (6 COLS): FROM THE COMMON ROOM (FEED) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Header with Sorting & Filtering Dropdowns */}
              <div className="flex items-center justify-between pb-2 mb-1">
                <h2 className="font-serif text-lg font-bold text-[#2F2620] flex items-center gap-2 border-b-2 border-[#7D2235] pb-1">
                  <span>From the Common Room</span>
                  <PiFeatherBold className="text-sm text-[#7D2235]" />
                </h2>

                <div className="flex items-center gap-2 text-xs">
                  {/* Recent Sort Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSortDropdownOpen((prev) => !prev);
                        setParlourDropdownOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#D8CCB8] bg-[#FAF5ED] text-[#483B32] font-medium flex items-center gap-1.5 cute-press cursor-pointer"
                    >
                      <span>{sortOption}</span>
                      <PiCaretDownBold className="text-[10px]" />
                    </button>
                    {sortDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-[#FAF5ED] rounded-xl shadow-lg border border-[#D8CCB8] py-1 z-30 text-xs">
                        {['Recent', 'Top Reflections', 'Most Discussed'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSortOption(opt);
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 hover:bg-[#EFE7D8] text-[#2F2620] ${
                              sortOption === opt ? 'font-bold text-[#7D2235]' : ''
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* All Parlours Filter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setParlourDropdownOpen((prev) => !prev);
                        setSortDropdownOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#D8CCB8] bg-[#FAF5ED] text-[#483B32] font-medium flex items-center gap-1.5 cute-press cursor-pointer"
                    >
                      <span>{filterParlour}</span>
                      <PiCaretDownBold className="text-[10px]" />
                    </button>
                    {parlourDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[#FAF5ED] rounded-xl shadow-lg border border-[#D8CCB8] py-1 z-30 text-xs">
                        {['All Parlours', 'The Gothic Study', 'The Midnight Philosophers', 'Slow Readers Society'].map(
                          (opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setFilterParlour(opt);
                                setParlourDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 hover:bg-[#EFE7D8] text-[#2F2620] ${
                                filterParlour === opt ? 'font-bold text-[#7D2235]' : ''
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Weekly Socratic Debate Lectern */}
              <SocraticDebateLectern />

              {/* Posts Cards */}
              {sortedPosts.map((post) => (
                <article
                  key={post.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm relative overflow-hidden text-left"
                >
                  {/* Author Top Row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          post.author === readerName || post.author === user?.username
                            ? userAvatar
                            : post.avatar || '/images/eleanor-avatar.jpg'
                        }
                        alt={post.author}
                        className="w-9 h-9 rounded-full object-cover border border-[#D8CCB8] shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-sm text-[#2F2620]">
                            {post.author}
                          </span>
                          <span className="text-[11px] font-sans text-[#7A6A5E]">
                            @{post.handle}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-[#7A6A5E] block">
                          {post.time} &bull; in{' '}
                          <strong className="text-[#7D2235] font-medium">
                            {post.parlour}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => enqueueSnackbar(`Options for @${post.handle}`, { variant: 'info' })}
                      className="p-1 rounded-full hover:bg-black/5 text-[#7A6A5E]"
                    >
                      <PiDotsThreeBold className="text-base" />
                    </button>
                  </div>

                  {/* Highlighted Quote Box with image thumbnail */}
                  {post.quote && (
                    <div
                      onClick={() => {
                        playBookSpineSlide();
                        const key =
                          post.parlourSlug === 'slow' || post.parlour?.includes('Slow')
                            ? 'slow'
                            : post.parlourSlug === 'midnight' || post.parlour?.includes('Midnight')
                            ? 'midnight'
                            : post.parlourSlug === 'poetry' || post.parlour?.includes('Poetry')
                            ? 'poetry'
                            : post.parlourSlug === 'dostoevsky' || post.parlour?.includes('Dostoevsky')
                            ? 'dostoevsky'
                            : 'gothic';
                        setActiveExcerptKey(key);
                      }}
                      className="p-4 rounded-xl bg-[#F0E6D5] border border-[#D8C7B0] mb-3.5 flex items-center justify-between gap-4 cursor-pointer hover:border-[#7D2235]/50 transition-all group"
                      title="Click to read chapter excerpt on the lectern 📖"
                    >
                      <div className="flex-1">
                        <blockquote className="font-serif italic text-xs sm:text-[13px] text-[#2F2620] leading-relaxed group-hover:text-[#7D2235] transition-colors">
                          {post.quote}
                        </blockquote>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-serif text-[11px] text-[#7A6A5E]">
                            — {post.quoteAuthor}
                          </span>
                          <span className="text-[10.5px] text-[#7D2235] font-semibold underline flex items-center gap-0.5">
                            <PiBookOpenBold className="text-[11px]" />
                            <span>Read Excerpt</span>
                          </span>
                        </div>
                      </div>

                      {post.quoteImg && (
                        <div className="w-24 h-16 rounded-lg overflow-hidden border border-[#D8C7B0] flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <img
                            src={post.quoteImg}
                            alt="Open book spread with dried flowers"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Reflection Text */}
                  <p className="text-xs sm:text-[12.5px] text-[#2F2620] leading-relaxed mb-4 font-sans">
                    {post.content}
                  </p>

                  {/* Bottom Interactive Actions */}
                  <div className="pt-3 border-t border-[#E5D7C2] flex items-center justify-between text-xs text-[#6E5F53]">
                    <div className="flex items-center gap-4">
                      {/* Heart Like */}
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cute-press cursor-pointer ${
                          post.liked ? 'text-[#7D2235] font-bold' : 'hover:text-[#7D2235]'
                        }`}
                      >
                        {post.liked ? (
                          <PiHeartFill className="text-sm text-[#7D2235] animate-jelly-pop" />
                        ) : (
                          <PiHeartBold className="text-sm" />
                        )}
                        <span>{post.likes}</span>
                      </button>

                      {/* Comments Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cute-press cursor-pointer ${
                          post.showComments ? 'text-[#7D2235] font-bold' : 'hover:text-[#2F2620]'
                        }`}
                      >
                        <PiChatCircleBold className="text-sm" />
                        <span>{post.commentsCount}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Bookmark */}
                      <button
                        type="button"
                        onClick={() => handleBookmark(post.id)}
                        className="p-1 rounded hover:text-[#7D2235] transition-colors cute-press cursor-pointer"
                        title={post.bookmarked ? 'Saved to marginalia' : 'Save reflection'}
                      >
                        {post.bookmarked ? (
                          <PiBookmarkSimpleFill className="text-sm text-[#7D2235]" />
                        ) : (
                          <PiBookmarkSimpleBold className="text-sm" />
                        )}
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => {
                          playPaperUnwrap();
                          navigator.clipboard?.writeText(window.location.href);
                          enqueueSnackbar('Copied reflection link to clipboard 📜', { variant: 'info' });
                        }}
                        className="flex items-center gap-1 hover:text-[#2F2620] cute-press cursor-pointer text-xs"
                      >
                        <PiShareNetworkBold className="text-xs" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Comments Section */}
                  {post.showComments && (
                    <div className="mt-4 pt-3 border-t border-[#E5D7C2] space-y-3 animate-fade-in">
                      <span className="text-[11px] font-serif font-bold text-[#7A6A5E] block">
                        Common Room Discussion ({post.commentsCount})
                      </span>

                      {/* Comment list */}
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {post.commentsList.map((c) => (
                          <div key={c.id} className="p-2.5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={
                                    c.author === readerName || c.author === user?.username
                                      ? userAvatar
                                      : c.avatar || '/images/eleanor-avatar.jpg'
                                  }
                                  alt={c.author}
                                  className="w-4 h-4 rounded-full object-cover border border-[#DECDB8]"
                                />
                                <span className="font-serif font-bold text-[#2F2620]">{c.author}</span>
                              </div>
                              <span className="text-[10px] text-[#7A6A5E]">{c.time}</span>
                            </div>
                            <p className="text-[#3E3228] leading-snug pl-5.5">{c.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add comment input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Inscribe a thought..."
                          className="flex-1 p-2 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-2 rounded-xl bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cute-press cursor-pointer"
                        >
                          <PiPaperPlaneRightBold className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )}

                </article>
              ))}
            </div>

            {/* RIGHT COLUMN (3 COLS): FEATURED LITERARY PARLOURS SIDEBAR */}
            <div className="lg:col-span-3 space-y-4">
              
              <div className="flex items-center justify-between pb-2 mb-1">
                <h3 className="font-serif text-lg font-bold text-[#2F2620]">
                  Featured Literary Parlours
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playPageFlipSound();
                    setActiveTab('parlours');
                  }}
                  className="text-xs text-[#7D2235] font-semibold hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* Parlour Cards */}
              {parlours.slice(0, 3).map((parlour) => (
                <div
                  key={parlour.id}
                  onClick={() => handleEnterParlour(parlour.id)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm flex items-start gap-3.5 group hover:border-[#7D2235]/40 transition-all text-left cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#D8C7B0] flex-shrink-0 shadow-2xs">
                    <img
                      src={parlour.img}
                      alt={parlour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#2F2620] leading-snug group-hover:text-[#7D2235] transition-colors">
                      {parlour.title}
                    </h4>
                    <p className="text-[11px] text-[#7A6A5E] mt-0.5 line-clamp-2 leading-tight font-sans">
                      {parlour.desc}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E5D7C2]/60">
                      <span className="text-[10px] font-mono text-[#7A6A5E]">
                        {parlour.members} members
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterParlour(parlour.id);
                        }}
                        className="px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cute-press cursor-pointer bg-[#7D2235] hover:bg-[#92283F] text-white shadow-xs"
                      >
                        Enter →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 2: LITERARY PARLOURS SANCTUARY (DEDICATED EXPLORATION)
            ============================================================ */}
        {activeTab === 'parlours' && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Header with Title and Actions */}
            <div className="p-6 rounded-2xl bg-[#FAF5EB] border border-[#D8C7B0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#7D2235] font-bold">
                  Curated Reading Circles
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2F2620] mt-0.5">
                  Literary Parlours of the Salon
                </h2>
                <p className="text-xs text-[#7A6A5E] mt-1 max-w-xl">
                  Intimate thematic sanctuaries gathered around specific canons, authors, and philosophical inquiries. Join an ongoing parlor or establish your own circle.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playBookSpineSlide();
                  setShowCreateParlourModal(true);
                }}
                className="self-start md:self-auto px-5 py-2.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-md cute-press cursor-pointer flex items-center gap-1.5"
              >
                <PiPlusBold className="text-xs" />
                <span>+ Establish New Parlour</span>
              </button>
            </div>

            {/* My Joined Parlours Quick Bar */}
            {joinedParlours.length > 0 && (
              <div className="p-4 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-[#2F2620]">
                    Your Parlour Keyring:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {joinedParlours.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleEnterParlour(p.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] hover:bg-white text-[#2F2620] hover:text-[#7D2235] text-xs font-medium border border-[#D8C7B0] transition-colors cursor-pointer"
                        title={`Step into ${p.title}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7D2235]" />
                        <span>{p.title}</span>
                        <span className="text-[10px] text-[#7A6A5E]">→</span>
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-[#7A6A5E] font-mono">
                  Active in {joinedParlours.length} sanctuary
                </span>
              </div>
            )}

            {/* Search and Category Filter Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D8CCB8]">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
                {[
                  'All',
                  'Gothic & Victorian',
                  'Nocturnal Philosophy',
                  'Slow Reading',
                  'Romantic Poetry',
                  'Russian Classics',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playPageFlipSound();
                      setParlourCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cute-press cursor-pointer ${
                      parlourCategory === cat
                        ? 'bg-[#7D2235] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF5ED] text-[#645548] hover:text-[#2F2620] border border-[#D8CCB8]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6A5E]" />
                <input
                  type="text"
                  value={parlourSearch}
                  onChange={(e) => setParlourSearch(e.target.value)}
                  placeholder="Filter parlours..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-full border border-[#D8CCB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                />
              </div>
            </div>

            {/* Parlours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredParloursList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleEnterParlour(p.id)}
                  className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm flex flex-col justify-between group hover:border-[#7D2235]/50 transition-all text-left cursor-pointer"
                >
                  <div>
                    {/* Header Image with Tag */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3.5 border border-[#D8C7B0] shadow-inner">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-sm text-[#F7EFE2] text-[10.5px] font-serif font-medium border border-white/20">
                        {p.category}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-[10px] font-mono backdrop-blur-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {p.activeNow} online
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="font-serif font-bold text-base text-[#2F2620] leading-snug group-hover:text-[#7D2235] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#6F6054] mt-1 leading-relaxed line-clamp-2">
                      {p.desc}
                    </p>

                    {/* Current Reading Volume Focus */}
                    <div className="mt-3.5 p-3 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] flex items-center gap-3">
                      <img
                        src={p.currentBookCover}
                        alt={p.currentBook}
                        className="w-8 h-12 rounded object-cover border border-[#D8C7B0] flex-shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <span className="text-[9.5px] uppercase font-mono tracking-wider text-[#7D2235] font-bold block">
                          Current Focus
                        </span>
                        <h4 className="font-serif font-bold text-xs text-[#2F2620] truncate">
                          {p.currentBook}
                        </h4>
                        <span className="text-[11px] text-[#7A6A5E] truncate block">
                          {p.currentBookAuthor}
                        </span>
                      </div>
                    </div>

                    {/* Weekly Prompt */}
                    <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#FAF4EA] border border-[#E5D7C2] text-[11px] text-[#52443A] italic font-serif leading-snug">
                      “{p.prompt}”
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t border-[#E5D7C2] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#7A6A5E]">
                      {p.members} Readers
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterParlour(p.id);
                      }}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cute-press cursor-pointer bg-[#7D2235] hover:bg-[#92283F] text-white shadow-xs flex items-center gap-1.5"
                    >
                      <span>Enter Parlour →</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Establish Card */}
              <div
                onClick={() => {
                  playBookSpineSlide();
                  setShowCreateParlourModal(true);
                }}
                className="p-6 rounded-2xl border-2 border-dashed border-[#D5C6AF] hover:border-[#7D2235] bg-[#FAF5EB]/50 flex flex-col items-center justify-center text-center cursor-pointer group transition-all min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#EFE5D5] group-hover:bg-[#7D2235] group-hover:text-white text-[#7D2235] flex items-center justify-center transition-all mb-3 shadow-xs">
                  <PiPlusBold className="text-xl" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2F2620]">
                  Found a New Parlour
                </h3>
                <p className="text-xs text-[#7A6A5E] mt-1 max-w-xs">
                  Create a dedicated sanctuary for an author, book series, or philosophy reading group.
                </p>
                <span className="mt-4 text-xs font-semibold text-[#7D2235] group-hover:underline">
                  Open Parlour Studio →
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 3: READING ROOMS (LIVE SYNCHRONOUS CHAMBER)
            ============================================================ */}
        {activeTab === 'rooms' && (
          <div className="mb-8 space-y-6 animate-fade-in">
            <AmbientSoundboard parlourSlug="gothic" parlourTitle="The Grand Silent Reading Room" />
          </div>
        )}

        {/* ============================================================
            TAB 4: MARGINALIA EXCHANGE (REAL DATABASE SCRIBES)
            ============================================================ */}
        {activeTab === 'marginalia' && (
          <div className="mb-8 animate-fade-in">
            <MarginaliaBoard
              onOpenLetterModal={(email, subj) =>
                handleInitiateLetter({ email, name: 'Kindred Reader' }, subj)
              }
            />
          </div>
        )}

        {/* ============================================================
            TAB 5: READER MATCHES (REAL USERS FROM PAGETURNER DATABASE)
            ============================================================ */}
        {activeTab === 'matches' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm text-left animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5D7C2] gap-2 mb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2F2620] flex items-center gap-2">
                  <PiSparkleBold className="text-[#7D2235]" />
                  <span>Kindred Reader Affinity Matches</span>
                </h3>
                <p className="text-xs text-[#7A6A5E] mt-0.5">
                  Real registered readers across the PageTurner database &bull; Matched by literary themes and reading velocities.
                </p>
              </div>
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold self-start sm:self-auto border border-emerald-300">
                ● Live Database Sync ({displayedMatches.length} Registered Readers)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayedMatches.map((m) => (
                <div key={m.handle || m.id} className="p-4.5 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] shadow-xs hover:shadow-md hover:border-[#7D2235]/40 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#C59B63]/60 shadow-xs bg-[#2D241E] flex-shrink-0">
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#2F2620] group-hover:text-[#7D2235] transition-colors leading-tight">
                            {m.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#7A6A5E] block">@{m.handle}</span>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EADCCB] text-[#5A4535] border border-[#D5C3AF]">
                        {m.level || 'Lv. 4'}
                      </span>
                    </div>

                    <div className="mt-2 py-2 px-3 rounded-xl bg-[#FAF5EB] border border-[#E9DCB8] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#7A6A5E] text-[11px]">Literary Affinity:</span>
                        <strong className="text-[#7D2235] font-mono font-bold text-xs">{m.affinity || m.match || '95%'}</strong>
                      </div>
                      <p className="text-[11px] text-[#52443A] leading-snug">
                        <strong>Shared Canon:</strong> {m.shared}
                      </p>
                      {m.currentBook && (
                        <p className="text-[10px] text-[#8C7A68] italic font-serif pt-1 border-t border-[#EFE5D5]">
                          Currently reading: {m.currentBook} ({m.page})
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInitiateLetter(m)}
                    className="mt-4 w-full py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cute-press cursor-pointer shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PiPaperPlaneRightBold className="text-xs text-[#F7D8A4]" />
                    <span>Inscribe Wax Letter ✉️</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            INTERACTIVE LECTERN CHAPTER EXCERPT READER MODAL
            ============================================================ */}
        {activeExcerptKey && CHAPTER_EXCERPTS[activeExcerptKey] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#FAF4EA] rounded-2xl border-2 border-[#C6A16B]/50 shadow-[0_25px_60px_rgba(0,0,0,0.55)] overflow-hidden">
              {/* Modal Antique Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8C7B0] bg-[#F2E7D5]/80 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7D2235] text-white flex items-center justify-center text-sm shadow-xs">
                    <PiBookOpenBold />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#2F241C] leading-tight">
                      {CHAPTER_EXCERPTS[activeExcerptKey].bookTitle}
                    </h3>
                    <span className="text-[11px] text-[#7A6A5E] font-serif italic block">
                      by {CHAPTER_EXCERPTS[activeExcerptKey].author} &bull; {CHAPTER_EXCERPTS[activeExcerptKey].era}
                    </span>
                  </div>
                </div>

                {/* Controls: Font Size, Ambiance, Close */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#E5D7C2] rounded-full p-0.5 border border-[#D5C2A5] text-[11px] font-serif font-bold">
                    <button
                      type="button"
                      onClick={() => setReadingFontSize('sm')}
                      className={`px-2 py-0.5 rounded-full ${readingFontSize === 'sm' ? 'bg-[#7D2235] text-white shadow-xs' : 'text-[#6E5F53] hover:text-black'}`}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingFontSize('base')}
                      className={`px-2 py-0.5 rounded-full ${readingFontSize === 'base' ? 'bg-[#7D2235] text-white shadow-xs' : 'text-[#6E5F53] hover:text-black'}`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingFontSize('lg')}
                      className={`px-2 py-0.5 rounded-full ${readingFontSize === 'lg' ? 'bg-[#7D2235] text-white shadow-xs' : 'text-[#6E5F53] hover:text-black'}`}
                    >
                      A+
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAmbiance(CHAPTER_EXCERPTS[activeExcerptKey].audioPreset || 'rain')}
                    title="Toggle Sanctuary Reading Sound"
                    className={`p-2 rounded-full border transition-all cute-press ${
                      activeAmbiance !== 'off'
                        ? 'bg-[#7D2235] text-white border-[#7D2235] shadow-xs'
                        : 'bg-[#E5D7C2] text-[#6E5F53] border-[#D5C2A5] hover:text-black'
                    }`}
                  >
                    <PiCloudRainBold className="text-sm" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveExcerptKey(null)}
                    className="p-1.5 rounded-full bg-[#E5D7C2] hover:bg-[#D5C2A5] text-[#2F241C] border border-[#D5C2A5] cute-press transition-colors"
                    title="Close Lectern"
                  >
                    <PiXBold className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Scrollable Parchment Folio Reading Surface */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 font-serif select-text">
                <div className="text-center pb-4 border-b border-[#E5D7C2]">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#7D2235] block mb-1">
                    Canonical Lectern Focus
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#2F241C] italic tracking-wide">
                    {CHAPTER_EXCERPTS[activeExcerptKey].chapterTitle}
                  </h2>
                </div>

                <div
                  className={`text-[#2F241C] leading-relaxed transition-all ${
                    readingFontSize === 'sm'
                      ? 'text-sm'
                      : readingFontSize === 'lg'
                      ? 'text-lg leading-loose'
                      : 'text-base sm:text-lg'
                  }`}
                >
                  {CHAPTER_EXCERPTS[activeExcerptKey].textParagraphs.map((para, idx) => (
                    <p key={idx} className="mb-5 indent-6 first-of-type:indent-0">
                      {idx === 0 ? (
                        <>
                          <span className="float-left text-5xl sm:text-6xl font-serif text-[#7D2235] leading-none pr-3 pt-1 font-bold">
                            {para.charAt(0)}
                          </span>
                          {para.slice(1)}
                        </>
                      ) : (
                        para
                      )}
                    </p>
                  ))}
                </div>

                {CHAPTER_EXCERPTS[activeExcerptKey].marginaliaNotes && (
                  <div className="mt-8 p-4 rounded-xl bg-[#F0E6D5] border-l-4 border-[#7D2235] space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#7D2235] font-bold block">
                      Curator’s Margin Annotations
                    </span>
                    {CHAPTER_EXCERPTS[activeExcerptKey].marginaliaNotes.map((note, nIdx) => (
                      <div key={nIdx} className="text-xs text-[#4A3B30] font-sans flex items-start gap-2">
                        <span className="font-mono text-[10px] text-[#7D2235] font-semibold">{note.page}:</span>
                        <div>
                          <span className="font-bold font-serif text-[#2F2620]">{note.scribe}</span> — {note.note}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 border-t border-[#D8C7B0] bg-[#F2E7D5]/80 flex items-center justify-between flex-wrap gap-3 select-none">
                <span className="text-xs font-serif italic text-[#7A6A5E]">
                  Inscribe your thoughts into the Common Room feed below.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playWaxSealCrack();
                    const qText = CHAPTER_EXCERPTS[activeExcerptKey].quoteHighlight || '';
                    const qAuth = CHAPTER_EXCERPTS[activeExcerptKey].author || '';
                    setActiveExcerptKey(null);
                    setNewQuoteText(qText);
                    setNewQuoteAuthor(qAuth);
                    setShowCompose(true);
                  }}
                  className="px-5 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm cute-press cursor-pointer"
                >
                  <PiFeatherBold className="text-sm text-[#F7D8A4]" />
                  <span>Inscribe Reflection on this Passage ✒️</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            READER PASSPORT DOSSIER & PROGRESSION MODAL
            ============================================================ */}
        {showPassportDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md bg-[#FAF4EA] rounded-2xl border-2 border-[#D8C7B0] p-6 shadow-2xl space-y-4 text-center">
              <button
                type="button"
                onClick={() => setShowPassportDossier(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#7A6A5E]"
              >
                <PiXBold className="text-sm" />
              </button>

              <div className="relative w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-[#C6A16B] shadow-md group/dossier">
                <img
                  src={userAvatar}
                  alt={readerName}
                  className="w-full h-full object-cover group-hover/dossier:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassportDossier(false);
                    playPaperUnwrap();
                    setShowChangeAvatarModal(true);
                  }}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover/dossier:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-mono cursor-pointer"
                  title="Change Reader Portrait"
                >
                  <PiCameraBold className="text-sm text-[#F7D8A4]" />
                  <span>Edit</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPassportDossier(false);
                  playPaperUnwrap();
                  setShowChangeAvatarModal(true);
                }}
                className="text-[10px] font-mono font-semibold text-[#7D2235] hover:text-[#92283F] inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                <PiCameraBold className="text-xs" />
                <span>Change Portrait / PFP</span>
              </button>

              <div>
                <h3 className="font-serif font-bold text-xl text-[#2F2620]">
                  {readerName}
                </h3>
                <span className="text-xs text-[#7D2235] font-semibold">
                  Literary Level 4 &bull; The Attentive Reader
                </span>
                <span className="text-[11px] text-[#7A6A5E] block font-mono mt-0.5">
                  Member ID: PT-48127 &bull; Sanctuary Initiate
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="p-3.5 rounded-xl bg-[#F0E6D5] text-left text-xs font-sans space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A6A5E]">Sanctuary XP Progress:</span>
                  <span className="font-bold text-[#7D2235]">{passportXP} / 1,500 XP</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#DECDB8] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7D2235] to-[#C6A16B] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (passportXP / 1500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#7A6A5E]">
                  <span>Next: Lv. 5 The Scholarly Sage</span>
                  <span>{1500 - passportXP} XP remaining</span>
                </div>
              </div>

              {/* Unlocked Badges Dossier */}
              <div className="space-y-2 text-left">
                <span className="font-serif font-bold text-xs text-[#2F2620] block">
                  Earned Sanctuary Insignias:
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F4ECDE] border border-[#DECDB8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PiMoonFill className="text-[#7D2235] text-base" />
                      <div>
                        <span className="font-bold block text-[#2F2620]">Night Owl Reader</span>
                        <span className="text-[10.5px] text-[#7A6A5E]">42 nocturnal reading hours logged</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F4ECDE] border border-[#DECDB8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PiPenNibBold className="text-[#7D2235] text-base" />
                      <div>
                        <span className="font-bold block text-[#2F2620]">Marginalia Scribe</span>
                        <span className="text-[10.5px] text-[#7A6A5E]">28 reflections & textual notes published</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F4ECDE] border border-[#DECDB8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PiColumnsBold className="text-[#7D2235] text-base" />
                      <div>
                        <span className="font-bold block text-[#2F2620]">Classics Initiate</span>
                        <span className="text-[10.5px] text-[#7A6A5E]">6 canonical volumes annotated</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                  </div>
                </div>
              </div>

              {/* Daily XP Gift Button */}
              <button
                type="button"
                disabled={claimedDailyXP}
                onClick={async () => {
                  playWaxSealCrack();
                  setClaimedDailyXP(true);
                  setPassportXP((x) => x + 25);
                  try {
                    const res = await communityService.claimDailyXp({ email: user?.email });
                    if (res.data?.sanctuaryXp) {
                      setPassportXP(res.data.sanctuaryXp);
                    }
                  } catch (err) {
                    console.warn('Could not sync daily XP with database:', err);
                  }
                  enqueueSnackbar('✨ Claimed Daily Salon Inspiration: +25 Sanctuary XP saved to database! 🕯️', {
                    variant: 'success',
                  });
                }}
                className={`w-full py-2.5 rounded-full text-xs font-semibold shadow-xs cute-press cursor-pointer flex items-center justify-center gap-2 ${
                  claimedDailyXP
                    ? 'bg-[#E5D7C2] text-[#8C7A6D] cursor-default'
                    : 'bg-[#7D2235] hover:bg-[#92283F] text-white'
                }`}
              >
                <PiSparkleBold />
                <span>{claimedDailyXP ? 'Daily Inspiration Claimed ✓' : 'Claim Daily Salon Inspiration (+25 XP) 🕯️'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Change Reader Portrait / PFP Modal */}
        <ChangeAvatarModal
          isOpen={showChangeAvatarModal}
          onClose={() => setShowChangeAvatarModal(false)}
        />

        {/* Literary Letter / Poste Restante Modal */}
        <LiteraryLetterModal
          isOpen={showLetterModal}
          onClose={() => setShowLetterModal(false)}
          initialRecipient={letterRecipient}
          initialSubject={letterSubject}
        />

      </main>

      <Footer />
    </div>
  );
};

export default Community;
