import express from 'express';
import { Parlour } from '../models/parlourModel.js';
import { CommunityPost } from '../models/communityPostModel.js';
import { User } from '../models/userModel.js';
import { Marginalia } from '../models/marginaliaModel.js';
import { SocraticDebate } from '../models/socraticDebateModel.js';
import { LiteraryLetter } from '../models/literaryLetterModel.js';
import { ReadingSprint } from '../models/readingSprintModel.js';
import { seedCommunityData, initialParlours, initialPosts } from '../utils/seedCommunityData.js';

const router = express.Router();

// Auto-seed if needed on first request
router.use(async (req, res, next) => {
  try {
    const pCount = await Parlour.countDocuments();
    if (pCount === 0) {
      await seedCommunityData();
    }
  } catch (err) {
    console.error('Seed check error:', err);
  }
  next();
});

// @route   GET /community/parlours
// @desc    Get all literary parlours
// @access  Public
router.get('/parlours', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { currentBook: { $regex: search, $options: 'i' } },
      ];
    }

    const parlours = await Parlour.find(query).sort({ createdAt: 1 });
    res.status(200).json(parlours);
  } catch (error) {
    next(error);
  }
});

// @route   GET /community/readers
// @desc    Get real registered community readers from the PageTurner database with affinity scores
// @access  Public
router.get('/readers', async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('username email role avatar createdAt')
      .lean();

    const CURATED_PORTRAITS = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      '/images/eleanor-avatar.jpg',
      '/images/arthur-avatar.jpg',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    ];

    const LITERARY_MOVEMENTS = [
      'Victorian Gothic & Classic Tragedy',
      'Stoic & Nocturnal Philosophy',
      'Dystopian Visions & Political Realism',
      'Psychological Realism & Russian Canon',
      'Romantic Poetry & Archaic Epics',
      'Modernist Speculation & Solitary Prose',
    ];

    const BOOKS_IN_PROGRESS = [
      { title: 'The Picture of Dorian Gray', page: 'p. 84 (Ch. IV)' },
      { title: '1984', page: 'p. 142 (Part II)' },
      { title: 'Crime and Punishment', page: 'p. 188 (Ch. III)' },
      { title: 'Meditations', page: 'p. 54 (Book IV)' },
      { title: 'Frankenstein', page: 'p. 91 (Vol. II)' },
      { title: 'Dune', page: 'p. 312 (Muad\'Dib)' },
    ];

    // Real users from database first, then demo if any
    const realUsers = users.filter((u) => u.username && !u.username.includes('Demo'));
    const demoUsers = users.filter((u) => u.username && u.username.includes('Demo'));
    const orderedUsers = realUsers.length > 0 ? realUsers.concat(demoUsers) : users;

    const readers = orderedUsers.map((u, idx) => {
      const handle = u.username.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const movement = LITERARY_MOVEMENTS[idx % LITERARY_MOVEMENTS.length];
      const bookInfo = BOOKS_IN_PROGRESS[idx % BOOKS_IN_PROGRESS.length];
      const match = `${98 - ((idx * 3) % 13)}%`;
      const level = (idx % 6) + 3;

      return {
        id: u._id,
        _id: u._id,
        username: u.username,
        name: u.username,
        handle,
        email: u.email,
        role: u.role === 'admin' ? 'Curator & Chief Librarian' : 'Sanctuary Reader',
        avatar: u.avatar || CURATED_PORTRAITS[idx % CURATED_PORTRAITS.length],
        match,
        affinity: match,
        shared: movement,
        currentBook: bookInfo.title,
        page: bookInfo.page,
        level: `Lv. ${level}`,
        memberId: `PT-${80000 + ((idx * 1337) % 19999)}`,
        isRealUser: true,
      };
    });

    res.status(200).json(readers);
  } catch (error) {
    next(error);
  }
});

// @route   GET /community/parlours/:slug
// @desc    Get parlour details and its discussion thread
// @access  Public
router.get('/parlours/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    let parlour = await Parlour.findOne({ slug });

    // Fallback search by id if slug didn't match
    if (!parlour) {
      // Check initial parlours fallback
      const match = initialParlours.find((p) => p.slug === slug);
      if (match) {
        parlour = await Parlour.create(match);
      }
    }

    if (!parlour) {
      return res.status(404).json({ message: 'Literary parlour not found' });
    }

    // Also fetch discussions for this parlour
    const discussions = await CommunityPost.find({ parlourSlug: slug }).sort({ createdAt: -1 });

    res.status(200).json({
      ...parlour.toJSON(),
      discussions,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/parlours
// @desc    Create a new parlour
// @access  Public (or Authenticated)
router.post('/parlours', async (req, res, next) => {
  try {
    const {
      title,
      category,
      desc,
      longDesc,
      curator,
      curatorHandle,
      curatorAvatar,
      img,
      currentBook,
      currentBookAuthor,
      currentBookCover,
      prompt,
      meetingTime,
      ambiancePreset,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Parlour title is required' });
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'parlour';
    
    let slug = baseSlug;
    let counter = 1;
    while (await Parlour.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newParlour = await Parlour.create({
      slug,
      title: title.trim(),
      category: category || 'Literary Salon',
      desc: desc ? desc.trim() : 'A haven for quiet reflection and scholarly discussions.',
      longDesc: longDesc ? longDesc.trim() : desc,
      curator: curator || 'Curator Admin',
      curatorHandle: curatorHandle || 'admin_curator',
      curatorAvatar: curatorAvatar || '/images/eleanor-avatar.jpg',
      img: img || '/images/parlour-gothic.jpg',
      currentBook: currentBook || 'Curated Volume',
      currentBookAuthor: currentBookAuthor || 'Classical Author',
      currentBookCover:
        currentBookCover ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
      prompt: prompt || 'What questions does this text awaken in you?',
      meetingTime: meetingTime || 'Weekly Evenings at Dusk',
      ambiancePreset: ambiancePreset || 'rain',
      members: 1,
      activeNow: 1,
      membersList: [curatorHandle || 'admin_curator'],
      pastBooks: [],
    });

    res.status(201).json(newParlour);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/parlours/:slug/join
// @desc    Toggle join/leave parlour
// @access  Public
router.post('/parlours/:slug/join', async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const { username = 'reader' } = req.body;

    const parlour = await Parlour.findOne({ slug });
    if (!parlour) {
      return res.status(404).json({ message: 'Parlour not found' });
    }

    const isMember = parlour.membersList.includes(username);

    if (isMember) {
      parlour.membersList = parlour.membersList.filter((m) => m !== username);
      parlour.members = Math.max(0, parlour.members - 1);
    } else {
      parlour.membersList.push(username);
      parlour.members += 1;
    }

    await parlour.save();

    res.status(200).json({
      joined: !isMember,
      members: parlour.members,
      membersList: parlour.membersList,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /community/posts
// @desc    Get community posts / discussions
// @access  Public
router.get('/posts', async (req, res, next) => {
  try {
    const { parlourSlug, sort = 'recent', search } = req.query;
    let query = {};

    if (parlourSlug && parlourSlug !== 'all') {
      query.parlourSlug = parlourSlug;
    }

    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { quote: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const sortObj = sort === 'popular' ? { likes: -1, createdAt: -1 } : { createdAt: -1 };

    const posts = await CommunityPost.find(query).sort(sortObj);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/posts
// @desc    Inscribe a new reflection or discussion note
// @access  Public
router.post('/posts', async (req, res, next) => {
  try {
    const {
      parlourSlug = 'common-room',
      parlourTitle = 'From the Common Room',
      author,
      handle,
      avatar,
      tag,
      quote,
      quoteAuthor,
      quoteImg,
      content,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Reflection content cannot be empty' });
    }

    const authorName = author && author.trim() ? author.trim() : 'Nikhil Sehgal';
    const postHandle =
      handle || authorName.toLowerCase().replace(/\s+/g, '_') || 'reader';

    const newPost = await CommunityPost.create({
      parlourSlug,
      parlourTitle,
      author: authorName,
      handle: postHandle,
      avatar: avatar || '/images/eleanor-avatar.jpg',
      tag: tag || 'Reflection',
      quote: quote ? quote.trim() : null,
      quoteAuthor: quoteAuthor ? quoteAuthor.trim() : null,
      quoteImg: quoteImg || null,
      content: content.trim(),
      likes: 1,
      likedBy: [postHandle],
      bookmarkedBy: [],
      commentsList: [],
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/posts/:id/like
// @desc    Optimistic toggle like on a post
// @access  Public
router.post('/posts/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username = 'reader' } = req.body;

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasLiked = post.likedBy.includes(username);

    if (hasLiked) {
      post.likedBy = post.likedBy.filter((u) => u !== username);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(username);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({
      id: post.id,
      likes: post.likes,
      liked: !hasLiked,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/posts/:id/bookmark
// @desc    Optimistic toggle bookmark on a post
// @access  Public
router.post('/posts/:id/bookmark', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username = 'reader' } = req.body;

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasBookmarked = post.bookmarkedBy.includes(username);

    if (hasBookmarked) {
      post.bookmarkedBy = post.bookmarkedBy.filter((u) => u !== username);
    } else {
      post.bookmarkedBy.push(username);
    }

    await post.save();

    res.status(200).json({
      id: post.id,
      bookmarked: !hasBookmarked,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/posts/:id/comments
// @desc    Add comment / reply to a post or discussion note
// @access  Public
router.post('/posts/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author, handle, avatar, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      author: author || 'Nikhil Sehgal',
      handle: handle || 'reader',
      avatar: avatar || '/images/eleanor-avatar.jpg',
      text: text.trim(),
    };

    post.commentsList.push(newComment);
    await post.save();

    const added = post.commentsList[post.commentsList.length - 1];

    res.status(201).json({
      post: post.toJSON(),
      comment: added,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// 1. MARGINALIA EXCHANGE (TEXT-ANNOTATIONS & QUOTE INSCRIPTIONS)
// ============================================================

// @route   GET /community/marginalia
// @desc    Get all marginalia annotations from the sanctuary database
// @access  Public
router.get('/marginalia', async (req, res, next) => {
  try {
    const { parlourSlug, search } = req.query;
    let query = {};
    if (parlourSlug && parlourSlug !== 'all') {
      query.parlourSlug = parlourSlug;
    }
    if (search) {
      query.$or = [
        { bookTitle: { $regex: search, $options: 'i' } },
        { quote: { $regex: search, $options: 'i' } },
        { annotation: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Marginalia.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/marginalia
// @desc    Inscribe a new margin note on a classical volume
// @access  Public
router.post('/marginalia', async (req, res, next) => {
  try {
    const {
      bookTitle,
      bookAuthor,
      chapter,
      quote,
      annotation,
      author,
      authorHandle,
      authorAvatar,
      authorEmail,
      parlourSlug,
    } = req.body;

    if (!bookTitle || !quote || !annotation || !author) {
      return res.status(400).json({
        message: 'Book title, quote, annotation, and author name are required',
      });
    }

    const newMarginalia = await Marginalia.create({
      bookTitle: bookTitle.trim(),
      bookAuthor: (bookAuthor || 'Classical Canon').trim(),
      chapter: (chapter || 'Chapter I').trim(),
      quote: quote.trim(),
      annotation: annotation.trim(),
      author: author.trim(),
      authorHandle: (authorHandle || 'reader').trim(),
      authorAvatar: authorAvatar || '/images/eleanor-avatar.jpg',
      authorEmail: authorEmail || '',
      parlourSlug: parlourSlug || 'gothic',
      waxReactions: {
        profound: [],
        poetic: [],
        provocative: [],
      },
    });

    // Optionally award 15 XP to user for inscribing marginalia
    if (authorEmail) {
      await User.findOneAndUpdate(
        { email: authorEmail },
        { $inc: { sanctuaryXp: 15 } }
      ).catch(() => {});
    }

    res.status(201).json(newMarginalia);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/marginalia/:id/react
// @desc    Toggle a wax seal reaction (profound, poetic, provocative)
// @access  Public
router.post('/marginalia/:id/react', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reactionType, userIdentifier } = req.body;

    if (!['profound', 'poetic', 'provocative'].includes(reactionType)) {
      return res.status(400).json({ message: 'Invalid wax seal reaction type' });
    }

    const item = await Marginalia.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Marginalia entry not found' });
    }

    const userId = userIdentifier || 'reader';
    const reactionList = item.waxReactions[reactionType] || [];
    const existingIndex = reactionList.indexOf(userId);

    if (existingIndex > -1) {
      reactionList.splice(existingIndex, 1);
    } else {
      reactionList.push(userId);
    }

    item.waxReactions[reactionType] = reactionList;
    item.markModified('waxReactions');
    await item.save();

    res.json({
      success: true,
      waxReactions: item.waxReactions,
      hasReacted: existingIndex === -1,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// 2. LITERARY LETTERS (POSTE RESTANTE & LITERARY MAILBOX)
// ============================================================

// @route   GET /community/letters
// @desc    Fetch letters sent to or from a reader
// @access  Public
router.get('/letters', async (req, res, next) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.$or = [{ recipientEmail: email }, { senderEmail: email }];
    }

    const letters = await LiteraryLetter.find(query).sort({ createdAt: -1 });
    res.json(letters);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/letters
// @desc    Dispatch a sealed wax letter to another reader
// @access  Public
router.post('/letters', async (req, res, next) => {
  try {
    const {
      senderName,
      senderHandle,
      senderAvatar,
      senderEmail,
      recipientName,
      recipientEmail,
      subject,
      body,
      waxSealColor,
      waxSealEmblem,
    } = req.body;

    if (!senderEmail || !recipientEmail || !body) {
      return res.status(400).json({ message: 'Sender email, recipient email, and letter body are required' });
    }

    const letter = await LiteraryLetter.create({
      senderName: senderName || 'Sanctuary Scribe',
      senderHandle: senderHandle || 'scribe',
      senderAvatar: senderAvatar || '/images/eleanor-avatar.jpg',
      senderEmail,
      recipientName: recipientName || 'Kindred Reader',
      recipientEmail,
      subject: subject || 'A Dispatched Inscription from Kindred Hands',
      body,
      waxSealColor: waxSealColor || '#7D2235',
      waxSealEmblem: waxSealEmblem || '❦',
      opened: false,
    });

    res.status(201).json(letter);
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /community/letters/:id/open
// @desc    Break wax seal and read a letter
// @access  Public
router.patch('/letters/:id/open', async (req, res, next) => {
  try {
    const { id } = req.params;
    const letter = await LiteraryLetter.findById(id);
    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    letter.opened = true;
    letter.openedAt = new Date();
    await letter.save();

    res.json({ success: true, letter });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// 3. SOCRATIC DEBATE LECTERN
// ============================================================

// @route   GET /community/debate
// @desc    Get active weekly Socratic debate
// @access  Public
router.get('/debate', async (req, res, next) => {
  try {
    let debate = await SocraticDebate.findOne({ active: true }).sort({ createdAt: -1 });
    if (!debate) {
      debate = await SocraticDebate.create(initialDebates[0]);
    }
    res.json(debate);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/debate/vote
// @desc    Vote for Thesis or Antithesis
// @access  Public
router.post('/debate/vote', async (req, res, next) => {
  try {
    const { side, userIdentifier } = req.body;
    if (!['thesis', 'antithesis'].includes(side)) {
      return res.status(400).json({ message: 'Side must be thesis or antithesis' });
    }

    const debate = await SocraticDebate.findOne({ active: true }).sort({ createdAt: -1 });
    if (!debate) {
      return res.status(404).json({ message: 'No active debate found' });
    }

    const userId = userIdentifier || 'reader';

    // Remove from other side if present
    debate.thesisVotes = debate.thesisVotes.filter((id) => id !== userId);
    debate.antithesisVotes = debate.antithesisVotes.filter((id) => id !== userId);

    if (side === 'thesis') {
      debate.thesisVotes.push(userId);
    } else {
      debate.antithesisVotes.push(userId);
    }

    await debate.save();

    res.json({
      success: true,
      thesisVotes: debate.thesisVotes,
      antithesisVotes: debate.antithesisVotes,
      votedSide: side,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/debate/argument
// @desc    Inscribe an argument to the Socratic Lectern
// @access  Public
router.post('/debate/argument', async (req, res, next) => {
  try {
    const { author, authorHandle, authorAvatar, stance, text } = req.body;
    if (!stance || !text || !text.trim()) {
      return res.status(400).json({ message: 'Stance and argument text are required' });
    }

    const debate = await SocraticDebate.findOne({ active: true }).sort({ createdAt: -1 });
    if (!debate) {
      return res.status(404).json({ message: 'No active debate found' });
    }

    const newArg = {
      author: author || 'Sanctuary Scribe',
      authorHandle: authorHandle || 'reader',
      authorAvatar: authorAvatar || '/images/eleanor-avatar.jpg',
      stance,
      text: text.trim(),
      votes: [],
    };

    debate.arguments.push(newArg);
    await debate.save();

    res.status(201).json({
      success: true,
      argument: debate.arguments[debate.arguments.length - 1],
      debate,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// 4. SILENT READING SPRINTS
// ============================================================

// @route   GET /community/sprint/:parlourSlug
// @desc    Get active silent sprint for a parlour
// @access  Public
router.get('/sprint/:parlourSlug', async (req, res, next) => {
  try {
    const { parlourSlug } = req.params;
    let sprint = await ReadingSprint.findOne({
      parlourSlug,
      status: 'active',
      expiresAt: { $gt: new Date() },
    });

    if (!sprint) {
      // Create fresh 25-min sprint
      sprint = await ReadingSprint.create({
        parlourSlug,
        parlourTitle: parlourSlug.charAt(0).toUpperCase() + parlourSlug.slice(1) + ' Study',
        hostName: 'Eleanor Vance',
        hostAvatar: '/images/eleanor-avatar.jpg',
        durationMinutes: 25,
        status: 'active',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 25 * 60 * 1000),
        participants: [
          {
            name: 'Eleanor Vance',
            avatar: '/images/eleanor-avatar.jpg',
            email: 'eleanor@pageturner.io',
            currentBook: 'The Picture of Dorian Gray',
            joinedAt: new Date(),
            completed: false,
          },
        ],
      });
    }

    res.json(sprint);
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/sprint/:parlourSlug/join
// @desc    Join an active reading sprint
// @access  Public
router.post('/sprint/:parlourSlug/join', async (req, res, next) => {
  try {
    const { parlourSlug } = req.params;
    const { name, avatar, email, currentBook } = req.body;

    const sprint = await ReadingSprint.findOne({
      parlourSlug,
      status: 'active',
      expiresAt: { $gt: new Date() },
    });

    if (!sprint) {
      return res.status(404).json({ message: 'No active sprint found in this parlour' });
    }

    const participantEmail = email || `${(name || 'reader').toLowerCase().replace(/\s+/g, '')}@pageturner.io`;
    const existingIndex = sprint.participants.findIndex((p) => p.email === participantEmail);

    if (existingIndex === -1) {
      sprint.participants.push({
        name: name || 'Sanctuary Reader',
        avatar: avatar || '/images/eleanor-avatar.jpg',
        email: participantEmail,
        currentBook: currentBook || 'Classical Volume',
        joinedAt: new Date(),
        completed: false,
      });
      await sprint.save();
    }

    res.json({ success: true, sprint });
  } catch (error) {
    next(error);
  }
});

// @route   POST /community/sprint/:parlourSlug/complete
// @desc    Complete silent sprint and claim +50 Sanctuary XP in database
// @access  Public
router.post('/sprint/:parlourSlug/complete', async (req, res, next) => {
  try {
    const { parlourSlug } = req.params;
    const { email } = req.body;

    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        user.sanctuaryXp = (user.sanctuaryXp || 1240) + 50;
        user.sanctuaryLevel = Math.floor(user.sanctuaryXp / 300) + 1;
        await user.save();
        return res.json({
          success: true,
          awardedXp: 50,
          totalXp: user.sanctuaryXp,
          level: user.sanctuaryLevel,
        });
      }
    }

    res.json({ success: true, awardedXp: 50, totalXp: 1290, level: 4 });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// 5. PROGRESSION & DAILY INSPIRATION CLAIM
// ============================================================

// @route   POST /community/claim-daily-xp
// @desc    Claim daily salon inspiration (+25 XP)
// @access  Public
router.post('/claim-daily-xp', async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    }
    if (!user) {
      user = (await User.findOne({ email: 'admin@pageturner.io' })) || (await User.findOne({}));
    }

    if (user) {
      user.sanctuaryXp = (user.sanctuaryXp || 1240) + 25;
      user.sanctuaryLevel = Math.floor(user.sanctuaryXp / 300) + 1;
      user.dailyInspirationClaimedAt = new Date();
      await user.save();

      return res.json({
        success: true,
        sanctuaryXp: user.sanctuaryXp,
        sanctuaryLevel: user.sanctuaryLevel,
        claimedAt: user.dailyInspirationClaimedAt,
      });
    }

    res.json({ success: true, sanctuaryXp: 1265, sanctuaryLevel: 4 });
  } catch (error) {
    next(error);
  }
});

// @route   GET /community/user-progress/:email
// @desc    Get user progression from database
// @access  Public
router.get('/user-progress/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('username email avatar sanctuaryXp sanctuaryLevel badges dailyInspirationClaimedAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;

