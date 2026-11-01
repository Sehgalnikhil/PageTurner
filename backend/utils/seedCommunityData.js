import { Parlour } from '../models/parlourModel.js';
import { CommunityPost } from '../models/communityPostModel.js';

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
  } catch (err) {
    console.error('Error seeding community data:', err);
  }
};

