import React, { useState, useContext, useEffect, useMemo } from 'react';
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
import CommunityDiscoveryHeader from '../components/community/CommunityDiscoveryHeader';
import LiteraryMoodPills, { LITERARY_MOODS } from '../components/community/LiteraryMoodPills';
import ParlourDiscoverySections from '../components/community/ParlourDiscoverySections';
import ReflectionPostCard from '../components/community/ReflectionPostCard';
import PersonalReadingIdentityCard from '../components/community/PersonalReadingIdentityCard';
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

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'parlours' | 'rooms' | 'marginalia' | 'matches'
  const [selectedMood, setSelectedMood] = useState('All');
  const [globalSearch, setGlobalSearch] = useState('');
  const [feedSort, setFeedSort] = useState('Recent'); // 'Recent' | 'Popular' | 'Most Discussed' | 'Saved'
  const [filterParlour, setFilterParlour] = useState('All Parlours');

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

  // Modals & Compose State
  const [showCompose, setShowCompose] = useState(false);
  const [showCreateParlourModal, setShowCreateParlourModal] = useState(false);
  const [showChangeAvatarModal, setShowChangeAvatarModal] = useState(false);
  const [realReaders, setRealReaders] = useState([]);
  const [newReflectionText, setNewReflectionText] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [selectedComposeParlour, setSelectedComposeParlour] = useState('The Gothic Study');

  // Create Parlour Form State
  const [newParlourTitle, setNewParlourTitle] = useState('');
  const [newParlourDesc, setNewParlourDesc] = useState('');
  const [newParlourCategory, setNewParlourCategory] = useState('Gothic & Victorian');

  // Silent Reading Room Timer & Ambiance
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
      meetingTime: 'Every Thursday at Dusk (9:00 PM GMT)',
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
      meetingTime: 'Midnight Sittings on Saturdays (12:00 AM)',
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
      meetingTime: 'Sunday Afternoons with Earl Grey (4:00 PM GMT)',
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
      meetingTime: 'Wednesday Evenings (8:00 PM GMT)',
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
      meetingTime: 'Friday Nights (10:00 PM GMT)',
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
      parlourTitle: 'The Gothic Study',
      parlourSlug: 'gothic',
      quote: '“Behind every exquisite thing that existed, there was something tragic.”',
      quoteAuthor: 'Oscar Wilde',
      quoteImg: '/images/dorian-open-book-spread.jpg',
      content:
        'Wilde captures this ache so perfectly. How often do we trade authentic contentment for the aesthetic illusion of it?',
      likes: 47,
      commentsCount: 12,
      liked: false,
      bookmarked: false,
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
      parlourTitle: 'Slow Readers Society',
      parlourSlug: 'slow',
      quote: null,
      quoteAuthor: null,
      quoteImg: null,
      content:
        'Rereading Part Two this morning under soft rain. What terrifies me most about 1984 isn’t the torture; it’s the quiet compliance of forgetting.',
      likes: 89,
      commentsCount: 18,
      liked: true,
      bookmarked: false,
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

  // Live Database Synchronizer
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
      .catch((err) => console.warn('Could not load live parlours from DB:', err));

    // Fetch common room posts from DB
    communityService
      .getPosts({ parlourSlug: 'common-room' })
      .then((res) => {
        if (!isMounted || !res.data || !res.data.length) return;
        const mappedPosts = res.data.map((p) => ({
          ...p,
          id: p.id || p._id,
          parlour: p.parlourTitle || p.parlourSlug || 'The Gothic Study',
          parlourTitle: p.parlourTitle || p.parlourSlug || 'The Gothic Study',
          parlourSlug: p.parlourSlug || 'gothic',
          time: formatTimeAgo(p.createdAt),
          liked: p.likedBy?.includes(userHandle) || p.likedBy?.includes(username) || false,
          bookmarked:
            p.bookmarkedBy?.includes(userHandle) || p.bookmarkedBy?.includes(username) || false,
          commentsCount: p.commentsList ? p.commentsList.length : 0,
          commentsList: (p.commentsList || []).map((c) => ({
            ...c,
            id: c.id || c._id,
            time: formatTimeAgo(c.createdAt),
          })),
        }));
        setPosts(mappedPosts);
      })
      .catch((err) => console.warn('Could not load live posts from DB:', err));

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

    // Instant optimistic state update
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

    try {
      const username = user?.username || user?.name || 'Admin Demo';
      const slug = target.slug || target.id;
      await communityService.toggleJoinParlour(slug, username);
    } catch (err) {
      console.error('Failed to sync parlour join status:', err);
      // Rollback
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

    try {
      const username = user?.username || user?.name || 'Admin Demo';
      await communityService.toggleLikePost(target._id || target.id, username);
    } catch (err) {
      console.error('Failed to sync like:', err);
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

  // Optimistic Add Comment with MongoDB Synchronization
  const handleAddComment = async (postId, text) => {
    if (!text?.trim()) return;

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
      text: text.trim(),
      time: 'Just now',
    };

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

    enqueueSnackbar('Marginalia inscribed ✒️', { variant: 'success' });

    try {
      const target = posts.find((p) => p.id === postId || p._id === postId);
      const postDocId = target?._id || target?.id || postId;
      const res = await communityService.addComment(postDocId, {
        author: authorName,
        handle: authorHandle,
        avatar: '/images/eleanor-avatar.jpg',
        text: text.trim(),
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
      // Rollback
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
      commentsList: [],
    };

    setPosts([newPost, ...posts]);
    setNewReflectionText('');
    setNewQuoteText('');
    setNewQuoteAuthor('');
    setShowCompose(false);
    enqueueSnackbar('Reflection inscribed to the Common Room ✒️', { variant: 'success' });

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
      meetingTime: 'Weekly Gathering (TBD)',
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

  const handleSharePost = (post) => {
    navigator.clipboard?.writeText(window.location.href);
    enqueueSnackbar('Link to reflection copied to clipboard 📋', { variant: 'success' });
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
      name: 'Arthur Pendelton',
      username: 'Arthur Pendelton',
      handle: 'arthur_pendelton',
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

  // Filtered & Sorted Feed Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // Parlour dropdown filter
      if (filterParlour !== 'All Parlours') {
        const matchesParlour =
          p.parlour === filterParlour || p.parlourTitle === filterParlour;
        if (!matchesParlour) return false;
      }

      // Mood filter
      if (selectedMood !== 'All') {
        const moodObj = LITERARY_MOODS.find((m) => m.id === selectedMood);
        const matchCats = moodObj?.matchCategories || [];
        const matchesCat = matchCats.some(
          (c) =>
            p.parlourTitle?.toLowerCase().includes(c.toLowerCase()) ||
            p.content?.toLowerCase().includes(c.toLowerCase()) ||
            p.quote?.toLowerCase().includes(c.toLowerCase())
        );
        if (!matchesCat) return false;
      }

      // Global search filter
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matchesSearch =
          p.author?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.quote?.toLowerCase().includes(q) ||
          p.parlourTitle?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Saved filter
      if (feedSort === 'Saved' && !p.bookmarked) {
        return false;
      }

      return true;
    });
  }, [posts, filterParlour, selectedMood, globalSearch, feedSort]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (feedSort === 'Popular') return (b.likes || 0) - (a.likes || 0);
      if (feedSort === 'Most Discussed') return (b.commentsCount || 0) - (a.commentsCount || 0);
      return 0; // Default recent
    });
  }, [filteredPosts, feedSort]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#32221D] font-sans selection:bg-[#812638]/20">
      <Navbar />

      <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ============================================================
            1. COMPACT DISCOVERY HEADER (Section 3A)
            ============================================================ */}
        <CommunityDiscoveryHeader
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenCompose={() => {
            playPaperUnwrap();
            setShowCompose(true);
          }}
          onOpenCreateParlour={() => {
            playBookSpineSlide();
            setShowCreateParlourModal(true);
          }}
          onOpenLetters={() => {
            playWaxSealCrack();
            setShowLetterModal(true);
          }}
          activeReadersCount={218}
          totalReadersCount={12480}
        />

        {/* ============================================================
            2. EXPLORE BY LITERARY MOOD (Section 3B - Fable-Inspired)
            ============================================================ */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#827363]">
              Explore by Literary Mood
            </span>
            {selectedMood !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedMood('All')}
                className="text-[11px] text-[#812638] font-medium hover:underline cursor-pointer"
              >
                Clear Mood Filter &times;
              </button>
            )}
          </div>
          <LiteraryMoodPills
            selectedMood={selectedMood}
            onSelectMood={(m) => {
              playPageFlipSound();
              setSelectedMood(m);
            }}
          />
        </div>

        {/* ============================================================
            3. REFINED SANCTUARY SUB-NAVIGATION TABS
            ============================================================ */}
        <div className="w-full bg-[#FFFCF6] border border-[#E9DDCC] rounded-2xl p-2 mb-6 flex items-center justify-between shadow-[0_2px_8px_rgba(50,34,29,0.03)] flex-wrap gap-2">
          {/* Navigation Tab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {[
              { id: 'feed', label: 'Salon Feed', icon: PiHouseBold },
              { id: 'parlours', label: 'Literary Parlours', icon: PiUsersBold },
              { id: 'rooms', label: 'Reading Rooms', icon: PiHeadphonesBold },
              { id: 'marginalia', label: 'Marginalia Exchange', icon: PiNotePencilBold },
              { id: 'matches', label: 'Reader Matches', icon: PiSparkleBold },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playPageFlipSound();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#812638] text-white shadow-xs font-semibold'
                      : 'text-[#827363] hover:text-[#32221D] hover:bg-[#F7F2E9]'
                  }`}
                >
                  <Icon className="text-xs" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Metrics / Avatars Stack */}
          <div className="hidden sm:flex items-center gap-3 text-xs pr-2">
            <div className="flex -space-x-1.5 overflow-hidden items-center">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#FFFCF6] object-cover"
                src={userAvatar}
                alt={readerName}
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#FFFCF6] object-cover"
                src="/images/eleanor-avatar.jpg"
                alt="Eleanor Vance"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#FFFCF6] object-cover"
                src="/images/arthur-avatar.jpg"
                alt="Arthur Pendelton"
              />
            </div>
            <span className="font-mono text-[11px] text-[#827363]">
              12,480 Kindred Readers
            </span>
          </div>
        </div>

        {/* ============================================================
            SHARE A REFLECTION COMPOSER (When Triggered)
            ============================================================ */}
        {showCompose && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#FFFCF6] border-2 border-[#812638]/30 shadow-lg text-left animate-fadeIn">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#E9DDCC]">
              <h3 className="font-serif text-lg font-bold text-[#32221D] flex items-center gap-2">
                <PiFeatherBold className="text-[#812638]" />
                <span>Inscribe a Reflection to the Common Room</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#827363] cursor-pointer"
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
                  className="sm:col-span-2 w-full p-2.5 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/50 text-xs font-serif italic text-[#32221D] focus:outline-none focus:border-[#812638]"
                />
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Author (e.g. Oscar Wilde)"
                  className="w-full p-2.5 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/50 text-xs text-[#32221D] focus:outline-none focus:border-[#812638]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#827363] mb-1">
                  Associate with Literary Parlour:
                </label>
                <select
                  value={selectedComposeParlour}
                  onChange={(e) => setSelectedComposeParlour(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/50 text-xs text-[#32221D] focus:outline-none focus:border-[#812638]"
                >
                  {parlours.map((p) => (
                    <option key={p.id || p.slug} value={p.title}>
                      {p.title} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows="3"
                value={newReflectionText}
                onChange={(e) => setNewReflectionText(e.target.value)}
                placeholder="What did this passage reveal? Share your thoughts with fellow readers..."
                className="w-full p-3 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/50 text-xs sm:text-[13px] text-[#32221D] focus:outline-none focus:border-[#812638]"
                required
              />

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-1.5 text-xs text-[#827363] hover:text-[#32221D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <PiFeatherBold className="text-xs text-[#F7D8A4]" />
                  <span>Publish to Common Room</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            TAB 1: SALON FEED (Section 3D & 3E - Common Room)
            ============================================================ */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            
            {/* MAIN COLUMN (8 COLS): SOCIAL READING FEED */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Feed Controls Header: Sort Pills & Parlour Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 rounded-xl bg-[#FFFCF6] border border-[#E9DDCC] shadow-2xs">
                {/* Sort Filter Tabs */}
                <div className="flex items-center gap-1 text-xs">
                  {['Recent', 'Popular', 'Most Discussed', 'Saved'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeedSort(opt)}
                      className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        feedSort === opt
                          ? 'bg-[#812638] text-white shadow-2xs font-semibold'
                          : 'text-[#827363] hover:text-[#32221D] hover:bg-[#F7F2E9]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Filter by Parlour Select */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#827363] font-mono">Parlour:</span>
                  <select
                    value={filterParlour}
                    onChange={(e) => setFilterParlour(e.target.value)}
                    className="text-xs py-1 px-2.5 rounded-lg border border-[#E9DDCC] bg-[#F7F2E9] text-[#32221D] focus:outline-none focus:border-[#812638] cursor-pointer"
                  >
                    <option value="All Parlours">All Parlours</option>
                    {parlours.map((p) => (
                      <option key={p.id || p.slug} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Socratic Debate Lectern Provocation */}
              <SocraticDebateLectern />

              {/* Reflection Posts List */}
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <ReflectionPostCard
                    key={post.id || post._id}
                    post={post}
                    user={user}
                    userAvatar={userAvatar}
                    readerName={readerName}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onShare={handleSharePost}
                    onAddComment={handleAddComment}
                    onEnterParlour={handleEnterParlour}
                    onOpenExcerpt={(p) => {
                      playBookSpineSlide();
                      const key =
                        p.parlourSlug === 'slow' || p.parlour?.includes('Slow')
                          ? 'slow'
                          : p.parlourSlug === 'midnight' || p.parlour?.includes('Midnight')
                          ? 'midnight'
                          : p.parlourSlug === 'poetry' || p.parlour?.includes('Poetry')
                          ? 'poetry'
                          : p.parlourSlug === 'dostoevsky' || p.parlour?.includes('Dostoevsky')
                          ? 'dostoevsky'
                          : 'gothic';
                      setActiveExcerptKey(key);
                    }}
                  />
                ))
              ) : (
                <div className="p-10 rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] text-center">
                  <p className="font-serif italic text-sm text-[#827363]">
                    No reflections matching your filter. Be the first to inscribe a thought into the sanctuary.
                  </p>
                </div>
              )}
            </div>

            {/* SIDEBAR COLUMN (4 COLS): PERSONAL IDENTITY & UTILITIES (Section 3E) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* 1. Personal Reading Identity Card */}
              <PersonalReadingIdentityCard
                user={user}
                userAvatar={userAvatar}
                readerName={readerName}
                passportXP={passportXP}
                claimedDailyXP={claimedDailyXP}
                onClaimDailyXP={async () => {
                  playWaxSealCrack();
                  setClaimedDailyXP(true);
                  setPassportXP((x) => x + 50);
                  try {
                    const res = await communityService.claimDailyXp({ email: user?.email });
                    if (res.data?.sanctuaryXp) {
                      setPassportXP(res.data.sanctuaryXp);
                    }
                  } catch (err) {
                    console.warn('Could not sync daily XP with database:', err);
                  }
                  enqueueSnackbar('✨ Claimed Daily Sanctuary XP (+50 XP)!', {
                    variant: 'success',
                  });
                }}
                onOpenPassportDossier={() => {
                  playPaperUnwrap();
                  setShowPassportDossier(true);
                }}
                onChangeAvatar={() => {
                  playPaperUnwrap();
                  setShowChangeAvatarModal(true);
                }}
              />

              {/* 2. Spotlight Trending Parlour */}
              <div className="rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] p-4.5 shadow-[0_2px_12px_rgba(50,34,29,0.03)] text-left">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E9DDCC]/70">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#32221D]">
                    Featured Parlour
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('parlours')}
                    className="text-[11px] text-[#812638] font-medium hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                {parlours[0] && (
                  <div>
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 bg-[#F0E9DE]">
                      <img
                        src={parlours[0].img}
                        alt={parlours[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9.5px] font-mono">
                        {parlours[0].category}
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#32221D] leading-snug">
                      {parlours[0].title}
                    </h4>
                    <p className="text-xs text-[#827363] mt-1 line-clamp-2 leading-relaxed">
                      {parlours[0].desc}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#E9DDCC]/70 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#827363]">
                        {parlours[0].members} members
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEnterParlour(parlours[0].id || parlours[0].slug)}
                        className="px-3.5 py-1 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-white text-xs font-medium cursor-pointer"
                      >
                        Enter &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Sanctuary Atmosphere Quick Soundscape Toggle */}
              <div className="rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] p-4.5 shadow-[0_2px_12px_rgba(50,34,29,0.03)] text-left">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E9DDCC]/70">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#32221D]">
                    Sanctuary Audio
                  </span>
                  <span className="font-mono text-[10px] text-[#812638] capitalize font-semibold">
                    {activeAmbiance}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'rain', label: 'Rain', icon: PiCloudRainBold },
                    { id: 'fireplace', label: 'Hearth', icon: PiFlameBold },
                    { id: 'clock', label: 'Clock', icon: PiClockBold },
                  ].map((amb) => {
                    const Icon = amb.icon;
                    const isActive = activeAmbiance === amb.id;
                    return (
                      <button
                        key={amb.id}
                        type="button"
                        onClick={() => handleToggleAmbiance(amb.id)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#812638] text-white border-[#812638] shadow-2xs font-semibold'
                            : 'bg-[#F7F2E9] text-[#63554A] border-[#E9DDCC] hover:border-[#B18A51]/60'
                        }`}
                      >
                        <Icon className="text-sm" />
                        <span className="text-[10.5px]">{amb.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: LITERARY PARLOURS (Section 3C - Fable-Inspired)
            ============================================================ */}
        {activeTab === 'parlours' && (
          <ParlourDiscoverySections
            parlours={parlours}
            selectedMood={selectedMood}
            searchQuery={globalSearch}
            onEnterParlour={handleEnterParlour}
            onToggleJoin={handleToggleJoin}
            onOpenCreateModal={() => {
              playBookSpineSlide();
              setShowCreateParlourModal(true);
            }}
          />
        )}

        {/* ============================================================
            TAB 3: READING ROOMS (Ambient Soundboard)
            ============================================================ */}
        {activeTab === 'rooms' && (
          <div className="mb-8 space-y-6 animate-fadeIn">
            <AmbientSoundboard parlourSlug="gothic" parlourTitle="The Grand Silent Reading Room" />
          </div>
        )}

        {/* ============================================================
            TAB 4: MARGINALIA EXCHANGE (Scribe Notes)
            ============================================================ */}
        {activeTab === 'marginalia' && (
          <div className="mb-8 animate-fadeIn">
            <MarginaliaBoard
              onOpenLetterModal={(email, subj) =>
                handleInitiateLetter({ email, name: 'Kindred Reader' }, subj)
              }
            />
          </div>
        )}

        {/* ============================================================
            TAB 5: READER MATCHES (Real Database Readers)
            ============================================================ */}
        {activeTab === 'matches' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] shadow-sm text-left animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9DDCC] gap-2 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#32221D] flex items-center gap-2">
                  <PiSparkleBold className="text-[#812638]" />
                  <span>Kindred Reader Affinity Matches</span>
                </h3>
                <p className="text-xs text-[#827363] mt-0.5">
                  Real registered readers across the PageTurner database &bull; Matched by literary themes and reading velocities.
                </p>
              </div>
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold self-start sm:self-auto border border-emerald-300">
                ● Live Database Sync ({displayedMatches.length} Registered Readers)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayedMatches.map((m) => (
                <div key={m.handle || m.id} className="p-4.5 rounded-2xl bg-[#F7F2E9]/70 border border-[#E9DDCC] shadow-2xs hover:shadow-md hover:border-[#812638]/40 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#B18A51]/60 shadow-xs bg-[#2D241E] flex-shrink-0">
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#32221D] group-hover:text-[#812638] transition-colors leading-tight">
                            {m.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#827363] block">@{m.handle}</span>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EADCCB] text-[#5A4535] border border-[#D5C3AF]">
                        {m.level || 'Lv. 4'}
                      </span>
                    </div>

                    <div className="mt-2 py-2 px-3 rounded-xl bg-[#FFFCF6] border border-[#E9DDCC] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#827363] text-[11px]">Literary Affinity:</span>
                        <strong className="text-[#812638] font-mono font-bold text-xs">{m.affinity || m.match || '95%'}</strong>
                      </div>
                      <p className="text-[11px] text-[#32221D] leading-snug">
                        <strong>Shared Canon:</strong> {m.shared}
                      </p>
                      {m.currentBook && (
                        <p className="text-[10px] text-[#827363] italic font-serif pt-1 border-t border-[#E9DDCC]/70">
                          Currently reading: {m.currentBook} ({m.page})
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInitiateLetter(m)}
                    className="mt-4 w-full py-2 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-1.5 transition-all"
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
            ESTABLISH PARLOUR MODAL
            ============================================================ */}
        {showCreateParlourModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative w-full max-w-lg bg-[#FFFCF6] rounded-2xl border border-[#E9DDCC] p-6 shadow-2xl text-left">
              <button
                type="button"
                onClick={() => setShowCreateParlourModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#827363] cursor-pointer"
              >
                <PiXBold className="text-base" />
              </button>

              <h3 className="font-serif text-xl font-bold text-[#32221D] mb-1 flex items-center gap-2">
                <PiUsersBold className="text-[#812638]" />
                <span>Establish a Literary Parlour</span>
              </h3>
              <p className="text-xs text-[#827363] mb-4">
                Found an intimate circle dedicated to an author, era, philosophical inquiry, or reading discipline.
              </p>

              <form onSubmit={handleCreateParlour} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#32221D] mb-1">
                    Parlour Name
                  </label>
                  <input
                    type="text"
                    value={newParlourTitle}
                    onChange={(e) => setNewParlourTitle(e.target.value)}
                    placeholder="e.g. The Dostoevsky Circle"
                    className="w-full p-2.5 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/60 text-xs sm:text-sm text-[#32221D] focus:outline-none focus:border-[#812638]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#32221D] mb-1">
                    Literary Movement / Category
                  </label>
                  <select
                    value={newParlourCategory}
                    onChange={(e) => setNewParlourCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/60 text-xs text-[#32221D] focus:outline-none focus:border-[#812638]"
                  >
                    <option value="Gothic & Victorian">Gothic & Victorian</option>
                    <option value="Nocturnal Philosophy">Nocturnal Philosophy</option>
                    <option value="Slow Reading">Slow Reading</option>
                    <option value="Romantic Poetry">Romantic Poetry</option>
                    <option value="Russian Classics">Russian Classics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#32221D] mb-1">
                    Sanctuary Description & Vibe
                  </label>
                  <textarea
                    rows="3"
                    value={newParlourDesc}
                    onChange={(e) => setNewParlourDesc(e.target.value)}
                    placeholder="e.g. Delving into Russian existentialism, psychological torment, and the search for redemption..."
                    className="w-full p-2.5 rounded-xl border border-[#E9DDCC] bg-[#F7F2E9]/60 text-xs text-[#32221D] focus:outline-none focus:border-[#812638]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateParlourModal(false)}
                    className="px-4 py-2 text-xs text-[#827363] hover:text-[#32221D] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
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
            INTERACTIVE LECTERN CHAPTER EXCERPT READER MODAL
            ============================================================ */}
        {activeExcerptKey && CHAPTER_EXCERPTS[activeExcerptKey] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#FFFCF6] rounded-2xl border border-[#E9DDCC] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9DDCC] bg-[#F7F2E9] select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#812638] text-white flex items-center justify-center text-sm shadow-xs">
                    <PiBookOpenBold />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#32221D] leading-tight">
                      {CHAPTER_EXCERPTS[activeExcerptKey].bookTitle}
                    </h3>
                    <span className="text-[11px] text-[#827363] font-serif italic block">
                      by {CHAPTER_EXCERPTS[activeExcerptKey].author} &bull; {CHAPTER_EXCERPTS[activeExcerptKey].era}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#E9DDCC] rounded-full p-0.5 text-[11px] font-serif font-bold">
                    <button
                      type="button"
                      onClick={() => setReadingFontSize('sm')}
                      className={`px-2 py-0.5 rounded-full ${readingFontSize === 'sm' ? 'bg-[#812638] text-white shadow-xs' : 'text-[#827363] hover:text-black'}`}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingFontSize('base')}
                      className={`px-2 py-0.5 rounded-full ${readingFontSize === 'base' ? 'bg-[#812638] text-white shadow-xs' : 'text-[#827363] hover:text-black'}`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingFontSize('lg')}
                      className={`px-2 py-0.5 rounded-full ${readingFontSize === 'lg' ? 'bg-[#812638] text-white shadow-xs' : 'text-[#827363] hover:text-black'}`}
                    >
                      A+
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAmbiance(CHAPTER_EXCERPTS[activeExcerptKey].audioPreset || 'rain')}
                    title="Toggle Sanctuary Reading Sound"
                    className={`p-2 rounded-full border transition-all ${
                      activeAmbiance !== 'off'
                        ? 'bg-[#812638] text-white border-[#812638]'
                        : 'bg-[#F7F2E9] text-[#827363] border-[#E9DDCC]'
                    }`}
                  >
                    <PiCloudRainBold className="text-sm" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveExcerptKey(null)}
                    className="p-1.5 rounded-full bg-[#F7F2E9] hover:bg-[#E9DDCC] text-[#32221D] border border-[#E9DDCC] transition-colors"
                  >
                    <PiXBold className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Reading Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 font-serif select-text">
                <div className="text-center pb-4 border-b border-[#E9DDCC]">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#812638] block mb-1">
                    Canonical Lectern Focus
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#32221D] italic tracking-wide">
                    {CHAPTER_EXCERPTS[activeExcerptKey].chapterTitle}
                  </h2>
                </div>

                <div
                  className={`text-[#32221D] leading-relaxed transition-all ${
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
                          <span className="float-left text-5xl sm:text-6xl font-serif text-[#812638] leading-none pr-3 pt-1 font-bold">
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
                  <div className="mt-8 p-4 rounded-xl bg-[#F7F2E9] border-l-4 border-[#812638] space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#812638] font-bold block">
                      Curator’s Margin Annotations
                    </span>
                    {CHAPTER_EXCERPTS[activeExcerptKey].marginaliaNotes.map((note, nIdx) => (
                      <div key={nIdx} className="text-xs text-[#32221D] font-sans flex items-start gap-2">
                        <span className="font-mono text-[10px] text-[#812638] font-semibold">{note.page}:</span>
                        <div>
                          <span className="font-bold font-serif text-[#32221D]">{note.scribe}</span> — {note.note}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 border-t border-[#E9DDCC] bg-[#F7F2E9] flex items-center justify-between flex-wrap gap-3 select-none">
                <span className="text-xs font-serif italic text-[#827363]">
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
                  className="px-5 py-2 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <PiFeatherBold className="text-sm text-[#F7D8A4]" />
                  <span>Inscribe Reflection on this Passage ✒️</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            FULL READER PASSPORT DOSSIER MODAL
            ============================================================ */}
        {showPassportDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md bg-[#FFFCF6] rounded-2xl border border-[#E9DDCC] p-6 shadow-2xl space-y-4 text-center">
              <button
                type="button"
                onClick={() => setShowPassportDossier(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#827363]"
              >
                <PiXBold className="text-sm" />
              </button>

              <div className="relative w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-[#B18A51] shadow-md group/dossier">
                <img
                  src={userAvatar}
                  alt={readerName}
                  className="w-full h-full object-cover group-hover/dossier:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-[#32221D]">
                  {readerName}
                </h3>
                <span className="text-xs text-[#812638] font-semibold">
                  Literary Level 4 &bull; The Attentive Reader
                </span>
                <span className="text-[11px] text-[#827363] block font-mono mt-0.5">
                  Member ID: PT-48127 &bull; Sanctuary Initiate
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="p-3.5 rounded-xl bg-[#F7F2E9] text-left text-xs font-sans space-y-2 border border-[#E9DDCC]">
                <div className="flex items-center justify-between">
                  <span className="text-[#827363]">Sanctuary XP Progress:</span>
                  <span className="font-bold text-[#812638]">{passportXP} / 1,500 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E9DDCC] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#812638] to-[#B18A51] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (passportXP / 1500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#827363]">
                  <span>Next: Lv. 5 The Scholarly Sage</span>
                  <span>{1500 - passportXP} XP remaining</span>
                </div>
              </div>

              {/* Earned Badges */}
              <div className="space-y-2 text-left">
                <span className="font-serif font-bold text-xs text-[#32221D] block">
                  Earned Sanctuary Insignias:
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F7F2E9] border border-[#E9DDCC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PiMoonFill className="text-[#812638] text-base" />
                      <div>
                        <span className="font-bold block text-[#32221D]">Night Owl Reader</span>
                        <span className="text-[10.5px] text-[#827363]">42 nocturnal reading hours logged</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F7F2E9] border border-[#E9DDCC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PiPenNibBold className="text-[#812638] text-base" />
                      <div>
                        <span className="font-bold block text-[#32221D]">Marginalia Scribe</span>
                        <span className="text-[10.5px] text-[#827363]">28 reflections & textual notes published</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F7F2E9] border border-[#E9DDCC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PiColumnsBold className="text-[#B18A51] text-base" />
                      <div>
                        <span className="font-bold block text-[#32221D]">Classics Initiate</span>
                        <span className="text-[10.5px] text-[#827363]">6 canonical volumes annotated</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                  </div>
                </div>
              </div>
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
