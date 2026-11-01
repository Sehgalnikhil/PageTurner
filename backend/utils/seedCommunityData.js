import { Parlour } from '../models/parlourModel.js';
import { CommunityPost } from '../models/communityPostModel.js';
import { Marginalia } from '../models/marginaliaModel.js';
import { SocraticDebate } from '../models/socraticDebateModel.js';
import { LiteraryLetter } from '../models/literaryLetterModel.js';
import { ReadingSprint } from '../models/readingSprintModel.js';

export const initialParlours = [
  {
    slug: 'gothic',
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
    membersList: ['eleanor_reads', 'admin', 'nikhil'],
    pastBooks: [
      { title: 'Frankenstein', author: 'Mary Shelley', year: 'Read in October' },
      { title: 'Dracula', author: 'Bram Stoker', year: 'Read in September' },
      { title: 'The Strange Case of Dr Jekyll and Mr Hyde', author: 'R.L. Stevenson', year: 'Read in August' },
    ],
  },
  {
    slug: 'midnight',
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
    membersList: ['stoic_night'],
    pastBooks: [
      { title: 'Fear and Trembling', author: 'Søren Kierkegaard', year: 'Read in October' },
      { title: 'Nausea', author: 'Jean-Paul Sartre', year: 'Read in September' },
      { title: 'The Stranger', author: 'Albert Camus', year: 'Read in August' },
    ],
  },
  {
    slug: 'slow',
    title: 'Slow Readers Society',
    category: 'Slow Reading',
    desc: 'One chapter a week. Close reading, deep textual dissection, and marginalia sharing.',
    longDesc:
      'An antidote to skimread skimming. We read deliberately, dissecting sentence structures, historical resonance, etymologies, and the emotional cadences of each paragraph.',
    members: 820,
    activeNow: 63,
    curator: 'Arthur Pendelton',
    curatorHandle: 'arthur_scribe',
    curatorAvatar: '/images/arthur-avatar.jpg',
    img: '/images/parlour-slow.jpg',
    currentBook: '1984',
    currentBookAuthor: 'George Orwell',
    currentBookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Part Two, Section IX: The Theory and Practice of Oligarchical Collectivism',
    readingWeek: 'Week 5 of 8 • 55% Canon Complete',
    prompt:
      'The concept of memory holes in an era of digital deletion and instant rewriting of cultural records.',
    meetingTime: 'Sunday Afternoons with Earl Grey (4:00 PM GMT)',
    ambiancePreset: 'rain',
    membersList: ['arthur_scribe'],
    pastBooks: [
      { title: 'Brave New World', author: 'Aldous Huxley', year: 'Read in September' },
      { title: 'Fahrenheit 451', author: 'Ray Bradbury', year: 'Read in August' },
    ],
  },
  {
    slug: 'poetry',
    title: 'The Antiquarian Poetry Cloister',
    category: 'Romantic Poetry',
    desc: 'Romantic, Decadent, and Symbolist poetry read aloud under soft lamplight.',
    longDesc:
      'A lyrical hideaway devoted to verse that stirs the melancholic soul. Keats, Shelley, Lord Byron, Baudelaire, and Rimbaud.',
    members: 275,
    activeNow: 14,
    curator: 'Julian Frost',
    curatorHandle: 'jfrost_verse',
    curatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    currentBook: 'Les Fleurs du mal',
    currentBookAuthor: 'Charles Baudelaire',
    currentBookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Spleen et Idéal: Poem IV (Correspondances)',
    readingWeek: 'Week 1 of 4 • 25% Canon Complete',
    prompt:
      'Synesthesia in modern perception: how can poetry reconstruct scent, sound, and color simultaneously?',
    meetingTime: 'Wednesday Evenings (8:00 PM GMT)',
    ambiancePreset: 'wind',
    membersList: ['jfrost_verse'],
    pastBooks: [{ title: 'Odes and Elegies', author: 'John Keats', year: 'Read in October' }],
  },
  {
    slug: 'dostoevsky',
    title: "Dostoevsky's Underground",
    category: 'Russian Classics',
    desc: 'Dissecting human frailty, suffering, guilt, and spiritual redemption.',
    longDesc:
      'An uncompromising examination of moral crisis, nihilism, and the psychology of rebellion in 19th-century St. Petersburg.',
    members: 419,
    activeNow: 28,
    curator: 'Clara Oswald',
    curatorHandle: 'clara_dostoevsky',
    curatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    currentBook: 'Crime and Punishment',
    currentBookAuthor: 'Fyodor Dostoevsky',
    currentBookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    currentChapter: 'Part III, Chapter V: Porfiry Petrovich’s Office',
    readingWeek: 'Week 4 of 7 • 58% Canon Complete',
    prompt: "Raskolnikov's extraordinary man theory: rationalization vs conscience.",
    meetingTime: 'Friday Nights (10:00 PM GMT)',
    ambiancePreset: 'fireplace',
    membersList: ['clara_dostoevsky'],
    pastBooks: [
      { title: 'Notes from Underground', author: 'Fyodor Dostoevsky', year: 'Read in September' },
      { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', year: 'Read in July' },
    ],
  },
];

export const initialPosts = [
  // Common Room Feed Posts
  {
    parlourSlug: 'common-room',
    parlourTitle: 'The Gothic Study',
    author: 'Eleanor Vance',
    handle: 'eleanor_reads',
    avatar: '/images/eleanor-avatar.jpg',
    tag: 'Chapter IV Reflection',
    quote: '“Behind every exquisite thing that existed, there was something tragic.”',
    quoteAuthor: 'Oscar Wilde',
    quoteImg: '/images/dorian-open-book-spread.jpg',
    content:
      'Wilde captures this ache so perfectly. How often do we trade authentic contentment for the aesthetic illusion of it?',
    likes: 47,
    likedBy: [],
    bookmarkedBy: [],
    commentsList: [
      {
        author: 'Julian Frost',
        handle: 'jfrost',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        text: 'The portrait decaying while he remains untouched is the ultimate metaphor for moral dissociation.',
      },
      {
        author: 'Clara Oswald',
        handle: 'clara_o',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        text: 'This line stopped me cold when I first read Dorian Gray at university.',
      },
    ],
  },
  {
    parlourSlug: 'common-room',
    parlourTitle: 'Slow Readers Society',
    author: 'Arthur Pendelton',
    handle: 'arthur_scribe',
    avatar: '/images/arthur-avatar.jpg',
    tag: 'Historical Echoes',
    quote: null,
    quoteAuthor: null,
    quoteImg: null,
    content:
      'Rereading Part Two this morning under soft rain. What terrifies me most about 1984 isn’t the torture; it’s the quiet compliance of forgetting.',
    likes: 89,
    likedBy: ['admin'],
    bookmarkedBy: [],
    commentsList: [
      {
        author: 'Maya Lin',
        handle: 'mayalin',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        text: 'Doublethink is so insidious precisely because it demands total cognitive surrender.',
      },
    ],
  },
  // Gothic Study Parlour Discussions
  {
    parlourSlug: 'gothic',
    parlourTitle: 'The Gothic Study',
    author: 'Eleanor Vance',
    handle: 'eleanor_reads',
    avatar: '/images/eleanor-avatar.jpg',
    tag: 'Chapter IV Reflection',
    quote: '“Behind every exquisite thing that existed, there was something tragic.”',
    quoteAuthor: 'Oscar Wilde',
    quoteImg: null,
    content:
      'Notice how Lord Henry sells youth as a currency Dorian never knew he was spending until this exact moment. The tragedy is that Dorian falls in love with his own image, separating his conscience from his body.',
    likes: 38,
    likedBy: [],
    bookmarkedBy: [],
    commentsList: [
      {
        author: 'Julian Frost',
        handle: 'jfrost',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        text: 'And Basil saw it coming immediately. He knew the portrait had too much of himself in it.',
      },
    ],
  },
  {
    parlourSlug: 'gothic',
    parlourTitle: 'The Gothic Study',
    author: 'Arthur Pendelton',
    handle: 'arthur_scribe',
    avatar: '/images/arthur-avatar.jpg',
    tag: 'Textual Annotation',
    quote: '“There is only one thing in the world worse than being talked about, and that is not being talked about.”',
    quoteAuthor: 'Oscar Wilde',
    quoteImg: null,
    content:
      'Lord Henry’s opening paradoxes feel lighthearted at first read, but as the book progresses, every witty remark transforms into an insidious trap.',
    likes: 24,
    likedBy: ['admin'],
    bookmarkedBy: [],
    commentsList: [],
  },
  // Midnight Philosophers Parlour Discussions
  {
    parlourSlug: 'midnight',
    parlourTitle: 'The Midnight Philosophers',
    author: 'Marcus Aurel',
    handle: 'stoic_night',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    tag: 'Core Thesis',
    quote: '“There is but one truly serious philosophical problem, and that is suicide.”',
    quoteAuthor: 'Albert Camus',
    quoteImg: null,
    content:
      'Camus begins with shocking clarity. If life is inherently without meaning, the revolt consists of living fully despite the void, not escaping it.',
    likes: 52,
    likedBy: [],
    bookmarkedBy: [],
    commentsList: [],
  },
];

export const initialMarginalia = [
  {
    bookTitle: 'The Picture of Dorian Gray',
    bookAuthor: 'Oscar Wilde',
    chapter: 'Chapter IV: The Studio of Basil Hallward',
    quote: '“Behind every exquisite thing that existed, there was something tragic.”',
    annotation:
      'Wilde captures this ache so perfectly. How often do we trade authentic contentment for the aesthetic illusion of it? Basil\'s art was pure until it became possessive.',
    author: 'Eleanor Vance',
    authorHandle: 'eleanor_reads',
    authorAvatar: '/images/eleanor-avatar.jpg',
    authorEmail: 'eleanor@pageturner.io',
    parlourSlug: 'gothic',
    waxReactions: {
      profound: ['eleanor_reads', 'nikhilsehgal1806@gmail.com'],
      poetic: ['clara_books'],
      provocative: [],
    },
  },
  {
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    chapter: 'Part II, Chapter IX',
    quote: '“The best books... are those that tell you what you know already.”',
    annotation:
      'Rereading Part Two this morning under soft rain. What terrifies me most isn\'t the torture; it\'s the quiet compliance of collective forgetting.',
    author: 'Arthur Pendelton',
    authorHandle: 'arthur_scribe',
    authorAvatar: '/images/arthur-avatar.jpg',
    authorEmail: 'arthur@pageturner.io',
    parlourSlug: 'slow',
    waxReactions: {
      profound: ['eleanor_reads'],
      poetic: [],
      provocative: ['stoic_night'],
    },
  },
  {
    bookTitle: 'The Myth of Sisyphus',
    bookAuthor: 'Albert Camus',
    chapter: 'An Absurd Reasoning',
    quote: '“There is no sun without shadow, and it is essential to know the night.”',
    annotation:
      'Camus transforms suffering into sovereignty. When Sisyphus turns to walk down the hill, in that very pause, he is superior to his fate.',
    author: 'Marcus Aurel',
    authorHandle: 'stoic_night',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorEmail: 'marcus@pageturner.io',
    parlourSlug: 'midnight',
    waxReactions: {
      profound: ['arthur_scribe', 'eleanor_reads'],
      poetic: ['clara_books'],
      provocative: ['nikhilsehgal1806@gmail.com'],
    },
  },
];

export const initialDebates = [
  {
    topic: 'Aestheticism vs. Moral Truth in 19th-Century Decadence',
    book: 'The Picture of Dorian Gray by Oscar Wilde',
    motion: 'Resolved: The pursuit of pure aesthetic beauty without moral tether leads inevitably to spiritual destruction.',
    context:
      'In the 1891 preface, Wilde famously stated: "There is no such thing as a moral or an immoral book. Books are well written, or badly written. That is all." Yet Dorian\'s portrait rots in exact synchronization with his moral decay.',
    active: true,
    thesisLabel: 'Thesis: Aestheticism is the Supreme Spiritual Devotion',
    antithesisLabel: 'Antithesis: Unchecked Aestheticism is Moral Cowardice',
    thesisVotes: ['eleanor_reads', 'clara_books'],
    antithesisVotes: ['arthur_scribe', 'nikhilsehgal1806@gmail.com'],
    arguments: [
      {
        author: 'Eleanor Vance',
        authorHandle: 'eleanor_reads',
        authorAvatar: '/images/eleanor-avatar.jpg',
        stance: 'thesis',
        text: 'Wilde is not condemning beauty; he is condemning the hypocritical Victorian demand that art must preach a sermon. Art exists for the transfiguration of consciousness, free from utilitarian shackles.',
        votes: ['clara_books'],
      },
      {
        author: 'Arthur Pendelton',
        authorHandle: 'arthur_scribe',
        authorAvatar: '/images/arthur-avatar.jpg',
        stance: 'antithesis',
        text: 'Dorian does not celebrate art; he consumes it as a narcotic to numb guilt. The portrait is not a triumph of aestheticism—it is Wilde\'s piercing warning that human conscience cannot be locked in an attic without poisoning the soul.',
        votes: ['eleanor_reads', 'nikhilsehgal1806@gmail.com'],
      },
    ],
  },
];

export const initialLetters = [
  {
    senderName: 'Eleanor Vance',
    senderHandle: 'eleanor_reads',
    senderAvatar: '/images/eleanor-avatar.jpg',
    senderEmail: 'eleanor@pageturner.io',
    recipientName: 'Curator & Chief Librarian',
    recipientEmail: 'nikhilsehgal1806@gmail.com',
    subject: 'A Welcome Inscription to the Curators\' Sanctum',
    body:
      'Kindred reader,\n\nI noticed your margin notes on Basil Hallward\'s tragic devotion. There are few minds today who linger on the cadence of a sentence rather than rushing to its conclusion.\n\nWhenever the dusk settles, you will find a candle lit for you in The Gothic Study. Bring whatever volume haunts you most.\n\nYours in ink and parchment,\nEleanor Vance',
    waxSealColor: '#7D2235',
    waxSealEmblem: '❦',
    opened: false,
  },
  {
    senderName: 'Arthur Pendelton',
    senderHandle: 'arthur_scribe',
    senderAvatar: '/images/arthur-avatar.jpg',
    senderEmail: 'arthur@pageturner.io',
    recipientName: 'Curator & Chief Librarian',
    recipientEmail: 'nikhilsehgal1806@gmail.com',
    subject: 'Marginalia Note on Orwell\'s Principles of Newspeak',
    body:
      'Greetings from the slow reading alcove,\n\nI have transcribed several marginal notes from the Appendix of 1984 into our shared archives. Pay particular attention to how the reduction of vocabulary constrains the boundaries of thought itself.\n\nI welcome your counter-arguments at your leisure.\n\nRespectfully,\nArthur Pendelton',
    waxSealColor: '#4A3728',
    waxSealEmblem: '✒',
    opened: false,
  },
  {
    senderName: 'Eleanor Vance',
    senderHandle: 'eleanor_reads',
    senderAvatar: '/images/eleanor-avatar.jpg',
    senderEmail: 'eleanor@pageturner.io',
    recipientName: 'Admin Demo',
    recipientEmail: 'admin@pageturner.io',
    subject: 'A Welcome Inscription to the Curators\' Sanctum',
    body:
      'Kindred reader,\n\nI noticed your margin notes on Basil Hallward\'s tragic devotion. There are few minds today who linger on the cadence of a sentence rather than rushing to its conclusion.\n\nWhenever the dusk settles, you will find a candle lit for you in The Gothic Study. Bring whatever volume haunts you most.\n\nYours in ink and parchment,\nEleanor Vance',
    waxSealColor: '#7D2235',
    waxSealEmblem: '❦',
    opened: false,
  },
];

export const seedCommunityData = async () => {
  try {
    const parlourCount = await Parlour.countDocuments();
    if (parlourCount === 0) {
      console.log('Seeding initial Parlours into MongoDB...');
      await Parlour.insertMany(initialParlours);
      console.log(`✅ Seeded ${initialParlours.length} Parlours`);
    }

    const postCount = await CommunityPost.countDocuments();
    if (postCount === 0) {
      console.log('Seeding initial Community Posts into MongoDB...');
      await CommunityPost.insertMany(initialPosts);
      console.log(`✅ Seeded ${initialPosts.length} Community Posts`);
    }

    const marginaliaCount = await Marginalia.countDocuments();
    if (marginaliaCount === 0) {
      console.log('Seeding initial Marginalia into MongoDB...');
      await Marginalia.insertMany(initialMarginalia);
      console.log(`✅ Seeded ${initialMarginalia.length} Marginalia Inscriptions`);
    }

    const debateCount = await SocraticDebate.countDocuments();
    if (debateCount === 0) {
      console.log('Seeding initial Socratic Debate into MongoDB...');
      await SocraticDebate.insertMany(initialDebates);
      console.log(`✅ Seeded ${initialDebates.length} Socratic Debate`);
    }

    const letterCount = await LiteraryLetter.countDocuments();
    if (letterCount === 0) {
      console.log('Seeding initial Literary Letters into MongoDB...');
      await LiteraryLetter.insertMany(initialLetters);
      console.log(`✅ Seeded ${initialLetters.length} Literary Letters`);
    }

    const sprintCount = await ReadingSprint.countDocuments();
    if (sprintCount === 0) {
      console.log('Seeding initial Reading Sprint into MongoDB...');
      await ReadingSprint.create({
        parlourSlug: 'gothic',
        parlourTitle: 'The Gothic Study',
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
            currentBook: 'The Picture of Dorian Gray (Ch. IV)',
            joinedAt: new Date(),
            completed: false,
          },
          {
            name: 'Arthur Pendelton',
            avatar: '/images/arthur-avatar.jpg',
            email: 'arthur@pageturner.io',
            currentBook: '1984 (Part II)',
            joinedAt: new Date(),
            completed: false,
          },
        ],
      });
      console.log('✅ Seeded active Reading Sprint');
    }
  } catch (err) {
    console.error('Error seeding community data:', err);
  }
};

