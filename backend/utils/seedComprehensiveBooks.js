import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from '../models/bookModel.js';
import { User } from '../models/userModel.js';

dotenv.config();

export const comprehensiveBooks = [
  // --- 1 to 20: Original Curated Classics ---
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publishYear: 1960,
    category: 'Fiction',
    description: 'Set in the American South during the 1930s, this Pulitzer Prize-winning masterpiece follows young Scout Finch, whose father Atticus is appointed to defend a Black man falsely accused of a grave crime. An enduring examination of prejudice, moral courage, and innocence.',
    isbn: '9780061120084',
    pageCount: 336,
    language: 'English',
    image: '/uploads/covers/to-kill-a-mockingbird.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'One of the most moving novels in modern literature. Atticus Finch remains the ultimate paragon of justice and integrity.' },
      { rating: 5, comment: 'A compassionate, deeply humane story that stays with you long after the final page.' }
    ]
  },
  {
    title: '1984',
    author: 'George Orwell',
    publishYear: 1949,
    category: 'Sci-Fi',
    description: 'A chilling dystopian warning set in Oceania, a totalitarian superstate ruled by the omnipresent Party and Big Brother. Winston Smith dares to commit thoughtcrime and secret rebellion in a world where language, truth, and human thought are ruthlessly policed.',
    isbn: '9780451524935',
    pageCount: 328,
    language: 'English',
    image: '/uploads/covers/1984.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'More prophetic with every passing decade. Doublethink and Newspeak are brilliant concepts.' }
    ]
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishYear: 1925,
    category: 'Fiction',
    description: 'Set in the Roaring Twenties on Long Island, the story follows the mysterious Jay Gatsby and his quixotic passion for the beautiful Daisy Buchanan. A poetic critique of the American Dream, excess, class, and longing.',
    isbn: '9780743273565',
    pageCount: 180,
    language: 'English',
    image: '/uploads/covers/the-great-gatsby.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Exquisite prose and haunting symbolism. Fitzgerald captured the Jazz Age like no other.' }
    ]
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publishYear: 1813,
    category: 'Fiction',
    description: 'A sparkling romantic comedy of manners following the witty Elizabeth Bennet and the proud Mr. Darcy. Austen explores societal expectations, family dynamics, and the folly of hasty judgements with razor-sharp irony.',
    isbn: '9780141439518',
    pageCount: 432,
    language: 'English',
    image: '/uploads/covers/pride-and-prejudice.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Unbeatable wit, beloved characters, and peerless dialogue. Truly timeless.' }
    ]
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    publishYear: 1951,
    category: 'Fiction',
    description: 'Narrated by sixteen-year-old Holden Caulfield after his expulsion from prep school, this groundbreaking novel captures adolescent alienation, the loss of innocence, and the yearning for authentic human connection.',
    isbn: '9780316769488',
    pageCount: 277,
    language: 'English',
    image: '/uploads/covers/the-catcher-in-the-rye.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Raw, honest, and unforgettable voice. Holden remains an iconic literary figure.' }
    ]
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    publishYear: 1937,
    category: 'Fiction',
    description: 'Bilbo Baggins, a comfort-loving hobbit, is whisked away on an unexpected journey by the wizard Gandalf and thirteen dwarves to reclaim the Lonely Mountain and its hoard from the dragon Smaug.',
    isbn: '9780547928227',
    pageCount: 310,
    language: 'English',
    image: '/uploads/covers/the-hobbit.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'A whimsical and breathtaking doorway into Middle-earth. Pure storytelling magic.' }
    ]
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    publishYear: 2011,
    category: 'Non-Fiction',
    description: 'A sweeping narrative exploring how an insignificant ape became the ruler of planet Earth. Harari covers the Cognitive, Agricultural, and Scientific Revolutions, illuminating how shared myths have shaped human history.',
    isbn: '9780062316097',
    pageCount: 443,
    language: 'English',
    image: '/uploads/covers/sapiens.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Mind-expanding perspective on human biology, economy, and history.' }
    ]
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    publishYear: 1965,
    category: 'Sci-Fi',
    description: 'Set on the desert planet Arrakis, Dune is the epic tale of Paul Atreides as his noble family assumes control of the universe\'s only source of the spice melange. An astonishing triumph of worldbuilding, ecology, religion, and galactic politics.',
    isbn: '9780441172719',
    pageCount: 688,
    language: 'English',
    image: '/uploads/covers/dune.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'The Lord of the Rings of science fiction. Unmatched depth and ambition.' }
    ]
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    publishYear: 2011,
    category: 'Biography',
    description: 'Based on more than forty interviews with Jobs conducted over two years, this definitive biography portrays the rollercoaster life and searingly intense personality of a creative entrepreneur whose passion for perfection revolutionized six industries.',
    isbn: '9781451648539',
    pageCount: 656,
    language: 'English',
    image: '/uploads/covers/steve-jobs.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Fascinating, unvarnished look inside one of technology’s greatest innovators.' }
    ]
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    publishYear: 1988,
    category: 'Fiction',
    description: 'The mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure. Along the way, he discovers the wisdom of listening to his heart, recognizing omens, and following his Personal Legend.',
    isbn: '9780062315007',
    pageCount: 208,
    language: 'English',
    image: '/uploads/covers/the-alchemist.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Inspiring fable that reminds us that our true treasure is often closer than we think.' }
    ]
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    publishYear: 1932,
    category: 'Sci-Fi',
    description: 'Set in a technologically engineered World State where citizens are genetically conditioned, psychologically manipulated, and numbed by the synthetic narcotic soma. A prophetic contemplation on consumerism, hedonism, and lost individuality.',
    isbn: '9780060850524',
    pageCount: 288,
    language: 'English',
    image: '/uploads/covers/brave-new-world.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Astonishingly insightful view into modern pleasure-driven distraction societies.' }
    ]
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    publishYear: 2018,
    category: 'Non-Fiction',
    description: 'A proven framework for improving every day. James Clear reveals practical strategies on how small changes lead to remarkable results by mastering cue, craving, response, and reward systems.',
    isbn: '9780735211292',
    pageCount: 320,
    language: 'English',
    image: '/uploads/covers/atomic-habits.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'The most actionable self-improvement guide ever written. Changed my daily routine.' }
    ]
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    publishYear: 1866,
    category: 'Fiction',
    description: 'Raskolnikov, a destitute former student in Saint Petersburg, commits a murder believing himself beyond conventional morality. What follows is a gripping psychological and spiritual investigation of guilt, conscience, and redemption.',
    isbn: '9780140449136',
    pageCount: 671,
    language: 'English',
    image: '/uploads/covers/crime-and-punishment.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Dostoevsky dissects human psychology with unequaled brilliance and depth.' }
    ]
  },
  {
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    publishYear: 1954,
    category: 'Fiction',
    description: 'The first volume in the epic legend of Middle-earth. Frodo Baggins inherits the One Ring of the Dark Lord Sauron and must journey with eight companions across great peril toward Mount Doom to destroy it.',
    isbn: '9780547928210',
    pageCount: 423,
    language: 'English',
    image: '/uploads/covers/the-fellowship-of-the-ring.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'The pinnacle of high fantasy. Tolkien’s language and lore are unparalleled.' }
    ]
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    publishYear: 2018,
    category: 'Biography',
    description: 'An unforgettable memoir about a young girl kept out of school and isolated from society in rural Idaho by survivalist parents, who eventually teaches herself enough mathematics and grammar to enter college and earn a PhD from Cambridge.',
    isbn: '9780399590504',
    pageCount: 334,
    language: 'English',
    image: '/uploads/covers/educated.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Incredible resilience and a moving testament to the transformative power of knowledge.' }
    ]
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    publishYear: 1953,
    category: 'Sci-Fi',
    description: 'Guy Montag is a fireman whose job is to burn books, which are banned in a dystopian future where intellectual curiosity is suppressed in favor of instant entertainment. When he meets a freethinking girl, his worldview begins to ignite.',
    isbn: '9781451673319',
    pageCount: 249,
    language: 'English',
    image: '/uploads/covers/fahrenheit-451.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Poetic, urgent tribute to the preservation of literature, thought, and memory.' }
    ]
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    publishYear: 2011,
    category: 'Non-Fiction',
    description: 'Nobel laureate Daniel Kahneman explains the two systems that drive the way we think: System 1 (fast, intuitive, emotional) and System 2 (slower, deliberate, logical). A masterclass on cognitive biases, heuristics, and choice architecture.',
    isbn: '9780374533557',
    pageCount: 499,
    language: 'English',
    image: '/uploads/covers/thinking-fast-and-slow.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Essential reading for understanding how the human mind actually makes decisions.' }
    ]
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    publishYear: 1947,
    category: 'Biography',
    description: 'Discovered in the secret attic annex where she and her family hid from Nazi occupation in Amsterdam, Anne Frank’s diary provides an intimate, heartbreaking, and luminous testimony to the human spirit in the face of tyranny.',
    isbn: '9780553296983',
    pageCount: 283,
    language: 'English',
    image: '/uploads/covers/the-diary-of-a-young-girl.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'A profoundly poignant voice that reminds the world of the tragedy of intolerance.' }
    ]
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    publishYear: 1890,
    category: 'Fiction',
    description: 'Enthralled by his own youth and beauty in a painted portrait, Dorian Gray trades his soul to ensure the portrait ages while he remains eternally young, leading him down a decadent path of aestheticism, moral decay, and consequence.',
    isbn: '9780141439570',
    pageCount: 254,
    language: 'English',
    image: '/uploads/covers/the-picture-of-dorian-gray.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Wilde\'s epigrams and philosophical musings on beauty and morality are intoxicating.' }
    ]
  },
  {
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl',
    publishYear: 1946,
    category: 'Non-Fiction',
    description: 'Psychiatrist Viktor Frankl\'s profound memoir of his experiences in Nazi concentration camps, introducing his psychotherapeutic method of logotherapy—the belief that our primary drive in life is not pleasure, but the discovery of meaning.',
    isbn: '9780807014295',
    pageCount: 165,
    language: 'English',
    image: '/uploads/covers/mans-search-for-meaning.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Life-altering book that provides fortitude and perspective in any difficult season.' }
    ]
  },

  // --- 21 to 50: New Editorial Standouts & Literary Classics ---
  {
    title: 'The Secret History',
    author: 'Donna Tartt',
    publishYear: 1992,
    category: 'Fiction',
    description: 'Under the influence of their charismatic classics professor, a group of clever, eccentric misfits at an elite New England college discover a way of thinking and living that is a world away from the humdrum existence of their contemporaries—gradually slipping from aesthetic obsession into betrayal and murder.',
    isbn: '9781400031702',
    pageCount: 559,
    language: 'English',
    image: '/uploads/covers/the-secret-history.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'The founding text of Dark Academia. Tartt’s prose is richly atmospheric and endlessly captivating.' },
      { rating: 5, comment: 'A brilliant psychological study of beauty, guilt, and the terror of moral detachment.' }
    ]
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    publishYear: 1847,
    category: 'Fiction',
    description: 'An orphaned young woman survives an abusive childhood and harsh boarding school to become governess at Thornfield Hall, where she falls in love with the brooding, enigmatic Mr. Rochester—only to uncover a devastating secret hidden in the attic.',
    isbn: '9780141441146',
    pageCount: 532,
    language: 'English',
    image: '/uploads/covers/jane-eyre.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Jane Eyre’s fierce independence and moral integrity make her one of the greatest heroines in all of literature.' }
    ]
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    publishYear: 1847,
    category: 'Fiction',
    description: 'A turbulent, wild tale of passionate obsession and violent revenge between Catherine Earnshaw and the foundling Heathcliff across the desolate, windswept Yorkshire moors. A gothic tour de force unlike any other.',
    isbn: '9780141439556',
    pageCount: 416,
    language: 'English',
    image: '/uploads/covers/wuthering-heights.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Dark, elemental, and utterly mesmerizing. Emily Brontë captured raw emotion with unsparing power.' }
    ]
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    publishYear: 1818,
    category: 'Sci-Fi',
    description: 'Obsessed with overcoming mortality, young Swiss scientist Victor Frankenstein animates a creature made from stolen graveyard corpses, only to abandon his creation in horror—provoking a tragic crusade of vengeance and sorrow.',
    isbn: '9780141439471',
    pageCount: 280,
    language: 'English',
    image: '/uploads/covers/frankenstein.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Mary Shelley wrote the foundation of modern science fiction at just nineteen. The creature\'s philosophical eloquence is devastating.' }
    ]
  },
  {
    title: 'Little Women',
    author: 'Louisa May Alcott',
    publishYear: 1868,
    category: 'Fiction',
    description: 'Chronicles the joys, ambitions, hardships, and sisterly devotions of Meg, Jo, Beth, and Amy March growing up in Concord, Massachusetts during the American Civil War as they strive to be good and true to their artistic souls.',
    isbn: '9780147514011',
    pageCount: 449,
    language: 'English',
    image: '/uploads/covers/little-women.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Jo March inspired generations of young writers. Warm, comforting, and deeply affectionate.' }
    ]
  },
  {
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    publishYear: 1987,
    category: 'Fiction',
    description: 'Hearing an orchestral cover of the Beatles song sends Toru Watanabe back to his student days in late-1960s Tokyo, caught between the fragile, grieving Naoko and the fiercely vibrant, independent Midori. A nostalgic meditation on youth, loss, and emerging into adulthood.',
    isbn: '9780375704024',
    pageCount: 296,
    language: 'Japanese',
    image: '/uploads/covers/norwegian-wood.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'A tender, melancholic masterpiece. Murakami evokes 1960s Tokyo with haunting emotional clarity.' }
    ]
  },
  {
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    publishYear: 2002,
    category: 'Fiction',
    description: 'Follows fifteen-year-old runaway Kafka Tamura and an eccentric elderly man named Nakata, who can speak with cats. Fish fall from the sky, spirits cross boundaries, and the riddle of identity unfolds in an extraordinary labyrinth of dreams and memory.',
    isbn: '9781400079278',
    pageCount: 505,
    language: 'Japanese',
    image: '/uploads/covers/kafka-on-the-shore.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Wholly original magical realism that stays in your psyche forever.' }
    ]
  },
  {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    publishYear: 1967,
    category: 'Fiction',
    description: 'The monumental rise and fall of the mythical mythical Colombian town of Macondo through seven generations of the Buendía family. Widely recognized as the crowning achievement of magical realism and world literature.',
    isbn: '9780060883287',
    pageCount: 417,
    language: 'Spanish',
    image: '/uploads/covers/one-hundred-years-of-solitude.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'García Márquez blends myth, history, and lyricism into an unforgettable tapestry of human fate.' }
    ]
  },
  {
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    publishYear: 1915,
    category: 'Fiction',
    description: 'Traveling salesman Gregor Samsa awakens one morning from troubled dreams to find himself transformed in his bed into a monstrous insect. Kafka’s landmark exploration of alienation, family burden, and existential dread.',
    isbn: '9780143105244',
    pageCount: 201,
    language: 'German',
    image: '/uploads/covers/metamorphosis.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Unsettling, poignant, and darkly comic. A central pillar of twentieth-century modernism.' }
    ]
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    publishYear: 180,
    category: 'Philosophy',
    description: 'Private spiritual exercises written on campaign along the Danubian frontier by the Roman Emperor Marcus Aurelius. A timeless guide to Stoic resilience, rational serenity, and the pursuit of virtue amidst life’s chaotic storms.',
    isbn: '9780812968255',
    pageCount: 256,
    language: 'Greek',
    image: '/uploads/covers/meditations.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'The ultimate handbook on personal tranquility, discipline, and emotional strength.' }
    ]
  },
  {
    title: 'The Stranger',
    author: 'Albert Camus',
    publishYear: 1942,
    category: 'Philosophy',
    description: 'Through the indifferent persona of Meursault, who kills an Arab on a blinding Algerian beach and faces trial less for the murder than for not weeping at his mother’s funeral, Camus explores the Absurd and the radical honesty of human existence.',
    isbn: '9780679720201',
    pageCount: 123,
    language: 'French',
    image: '/uploads/covers/the-stranger.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Crisp, startling prose that questions every social convention and moral complacency.' }
    ]
  },
  {
    title: 'Beyond Good and Evil',
    author: 'Friedrich Nietzsche',
    publishYear: 1886,
    category: 'Philosophy',
    description: 'A dazzling, provocative assault on traditional Western philosophical assumptions and Christian morality. Nietzsche calls for free spirits who dare to question received dogmas and embrace the will to power.',
    isbn: '9780140449235',
    pageCount: 240,
    language: 'German',
    image: '/uploads/covers/beyond-good-and-evil.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Fiery, challenging, and profoundly poetic aphorisms that disrupt passive thinking.' }
    ]
  },
  {
    title: 'The Bell Jar',
    author: 'Sylvia Plath',
    publishYear: 1963,
    category: 'Fiction',
    description: 'Esther Greenwood is a brilliant, beautiful young woman interning at a top women’s magazine in New York during the summer of 1953, who finds her world slowly descending under the suffocating bell jar of clinical depression.',
    isbn: '9780060837020',
    pageCount: 244,
    language: 'English',
    image: '/uploads/covers/the-bell-jar.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Astonishingly luminous and heartbreaking prose. Plath writes about the mind with startling precision.' }
    ]
  },
  {
    title: 'Slaughterhouse-Five',
    author: 'Kurt Vonnegut',
    publishYear: 1969,
    category: 'Sci-Fi',
    description: 'Billy Pilgrim has come unstuck in time, flitting between his memories as an American POW during the firebombing of Dresden, his suburban post-war life, and his abduction by the fatalistic extraterrestrial Tralfamadorians. So it goes.',
    isbn: '9780385333849',
    pageCount: 275,
    language: 'English',
    image: '/uploads/covers/slaughterhouse-five.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Equal parts satirical anti-war masterpiece and cosmic comedy. Truly unique.' }
    ]
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    publishYear: 2011,
    category: 'Fiction',
    description: 'A breathtakingly lyrical retelling of the Iliad from the perspective of Patroclus, an awkward young prince exiled to the court of Phthia, where he forms an unbreakable bond with golden Achilles that defies kings, fate, and the Trojan War.',
    isbn: '9780062060624',
    pageCount: 416,
    language: 'English',
    image: '/uploads/covers/the-song-of-achilles.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'One of the most exquisitely written love stories of our era. The final chapter brought me to tears.' }
    ]
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    publishYear: 2018,
    category: 'Fiction',
    description: 'In the house of Helios, god of the sun, a daughter is born who possesses not divine majesty, but the dark art of witchcraft. Banished to the lonely island of Aiaia, Circe hones her craft, defies the Olympians, and chooses mortality over divine cruelty.',
    isbn: '9780316556347',
    pageCount: 400,
    language: 'English',
    image: '/uploads/covers/circe.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Empowering, luminous, and mythologically breathtaking.' }
    ]
  },
  {
    title: 'A Gentle Reminder',
    author: 'Bianca Sparacino',
    publishYear: 2020,
    category: 'Non-Fiction',
    description: 'A deeply compassionate collection of poetic essays reminding readers to be softer with their hearts, to allow themselves to heal, and to trust that even in their loneliest seasons, their lives are quietly expanding toward joy.',
    isbn: '9781949759297',
    pageCount: 154,
    language: 'English',
    image: '/uploads/covers/a-gentle-reminder.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Warm balm for weary souls. Every page feels like a warm conversation with a dear friend.' }
    ]
  },
  {
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    publishYear: 2001,
    category: 'Fiction',
    description: 'Barcelona, 1945. Young Daniel Sempere is initiated into the secret Cemetery of Forgotten Books and selects an obscure novel by Julián Carax—igniting an intoxicating gothic mystery of doomed romance, murder, and cursed authors.',
    isbn: '9780143034902',
    pageCount: 487,
    language: 'Spanish',
    image: '/uploads/covers/the-shadow-of-the-wind.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'The ultimate love letter to books and libraries. Richly atmospheric, suspenseful, and unforgettable.' }
    ]
  },
  {
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    publishYear: 2021,
    category: 'Sci-Fi',
    description: 'From her vantage point in a store, Klara, an Artificial Friend with extraordinary observational qualities, watches the behavior of those who come in to browse and the passerby outside, hoping soon she will be chosen by a human child.',
    isbn: '9780593318171',
    pageCount: 303,
    language: 'English',
    image: '/uploads/covers/klara-and-the-sun.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Subtle, gentle, and profoundly questioning what it means to love and to be replaceable.' }
    ]
  },
  {
    title: 'Never Let Me Go',
    author: 'Kazuo Ishiguro',
    publishYear: 2005,
    category: 'Fiction',
    description: 'Kathy, Ruth, and Tommy grow up together at Hailsham, a seemingly idyllic English boarding school secluded in the countryside. Only slowly do they begin to understand the horrifying secret purpose for which they were created.',
    isbn: '9781400078776',
    pageCount: 288,
    language: 'English',
    image: '/uploads/covers/never-let-me-go.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Devastatingly restrained and quietly tragic. One of the finest British novels of the 21st century.' }
    ]
  },
  {
    title: 'Emma',
    author: 'Jane Austen',
    publishYear: 1815,
    category: 'Fiction',
    description: 'Handsome, clever, and rich, Emma Woodhouse has little to distress or vex her and delights in orchestrating the romantic affairs of her neighbors in Highbury—frequently blinded by self-delusion until she realizes her own true heart.',
    isbn: '9780141439587',
    pageCount: 474,
    language: 'English',
    image: '/uploads/covers/emma.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Austen’s absolute comedic masterpiece of human hubris, redemption, and domestic manners.' }
    ]
  },
  {
    title: 'Sense and Sensibility',
    author: 'Jane Austen',
    publishYear: 1811,
    category: 'Fiction',
    description: 'Contrasting the quiet prudence of Elinor Dashwood with the impassioned romantic impulsiveness of her sister Marianne as they navigate love, sudden poverty, and deceptive suitors in Georgian England.',
    isbn: '9780141439662',
    pageCount: 409,
    language: 'English',
    image: '/uploads/covers/sense-and-sensibility.jpg',
    isFeatured: false,
    reviews: [
      { rating: 4, comment: 'Splendid interplay of restraint and passion. Marianne and Elinor remain wonderfully relatable.' }
    ]
  },
  {
    title: 'The Odyssey',
    author: 'Homer',
    publishYear: 800,
    category: 'Classic',
    description: 'The ten-year odyssey of wily Greek warrior-king Odysseus as he braves cyclopes, sirens, wrathful deities, and enchantresses to return home to Ithaca and his steadfast wife Penelope after the fall of Troy.',
    isbn: '9780393356250',
    pageCount: 592,
    language: 'Greek',
    image: '/uploads/covers/the-odyssey.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'Emily Wilson’s translation is electric, fluid, and brilliantly modern while honoring Homer’s epic meter.' }
    ]
  },
  {
    title: 'The Iliad',
    author: 'Homer',
    publishYear: 800,
    category: 'Classic',
    description: 'Set during the tenth year of the siege of Troy, this ancient epic sings of the devastating wrath of Achilles, the heroic doom of Hector, and the heartbreaking cost of glory, honor, and warfare.',
    isbn: '9780140275360',
    pageCount: 683,
    language: 'Greek',
    image: '/uploads/covers/the-iliad.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Monumental and terrifyingly human. The grief of Priam and Achilles in the final book is unmatched.' }
    ]
  },
  {
    title: 'Stoner',
    author: 'John Williams',
    publishYear: 1965,
    category: 'Fiction',
    description: 'Born to impoverished dirt farmers in late-19th-century Missouri, William Stoner enters university to study agriculture, only to fall unexpectedly in love with English literature. A quiet, sublime testament to an ordinary life lived with enduring dignity.',
    isbn: '9781590171998',
    pageCount: 278,
    language: 'English',
    image: '/uploads/covers/stoner.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'A miraculous, quiet triumph. It makes the ordinary act of teaching and loving feel transcendent.' }
    ]
  },
  {
    title: 'A Little Life',
    author: 'Hanya Yanagihara',
    publishYear: 2015,
    category: 'Fiction',
    description: 'Follows four college classmates—broke, adrift, and buoyed only by friendship and ambition—as they move to New York to make their way. Over decades, their relationships center on Jude, a brilliant lawyer grappling with unspeakable childhood trauma.',
    isbn: '9780804172707',
    pageCount: 720,
    language: 'English',
    image: '/uploads/covers/a-little-life.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Emotionally colossal and relentlessly affecting. Jude St. Francis will stay in your heart forever.' }
    ]
  },
  {
    title: 'Babel: An Arcane History',
    author: 'R.F. Kuang',
    publishYear: 2022,
    category: 'Fiction',
    description: '1828. Robin Swift, orphaned in Canton and brought to London, trains at Oxford’s Royal Institute of Translation—known as Babel—the world\'s center for translation and magic silver-working that fuels British imperialism.',
    isbn: '9780063021426',
    pageCount: 545,
    language: 'English',
    image: '/uploads/covers/babel.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'A brilliant indictment of empire disguised as a love letter to language, etymology, and translation.' }
    ]
  },
  {
    title: 'If We Were Villains',
    author: 'M.L. Rio',
    publishYear: 2017,
    category: 'Fiction',
    description: 'Oliver Marks has just served ten years in prison for a murder that may or may not have happened. On the day he is released, he agrees to tell the retiring detective the truth about his close-knit circle of fourth-year Shakespearean actors at Dellecher Conservatory.',
    isbn: '9781250095282',
    pageCount: 368,
    language: 'English',
    image: '/uploads/covers/if-we-were-villains.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Dark Academia at its most dramatic and addictive. If you love Shakespeare and secrets, this is gold.' }
    ]
  },
  {
    title: 'Pachinko',
    author: 'Min Jin Lee',
    publishYear: 2017,
    category: 'Fiction',
    description: 'In the early 1900s, beloved daughter Sunja falls pregnant by a married man in Yeongdo, Korea. Rescued by a gentle minister, she moves to Japan, launching an epic multi-generational journey of identity, resilience, and belonging for a Zainichi Korean family.',
    isbn: '9781455563937',
    pageCount: 496,
    language: 'English',
    image: '/uploads/covers/pachinko.jpg',
    isFeatured: true,
    reviews: [
      { rating: 5, comment: 'A grand, sprawling historical saga written with immense empathy and grace. Absolutely unforgettable.' }
    ]
  },
  {
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    publishYear: 2015,
    category: 'Fiction',
    description: 'In a tiny Tokyo back alley, there is an underground café that has been serving carefully brewed coffee for over a hundred years. Legend has it that if you sit in a specific chair, you can travel back in time—but only for as long as your coffee stays warm.',
    isbn: '9781335430991',
    pageCount: 213,
    language: 'Japanese',
    image: '/uploads/covers/before-the-coffee-gets-cold.jpg',
    isFeatured: false,
    reviews: [
      { rating: 5, comment: 'Charming, poignant, and bittersweet. Reminds us to treasure every conversation while we can.' }
    ]
  }
];

export const seedComprehensiveBooks = async () => {
  try {
    const admin = await User.findOne({ email: 'admin@pageturner.io' });
    const reader = await User.findOne({ email: 'student@pageturner.io' });
    const adminId = admin ? admin._id : null;
    const readerId = reader ? reader._id : adminId;

    // Clean up any test/incomplete records (e.g. books with empty descriptions or authors like 'tara wistara')
    await Book.deleteMany({
      $or: [
        { author: 'tara wistara' },
        { description: 'it is great book' },
        { isbn: '' }
      ]
    });

    let updatedCount = 0;
    let insertedCount = 0;

    for (const b of comprehensiveBooks) {
      const existing = await Book.findOne({
        $or: [
          { isbn: b.isbn },
          { title: b.title, author: b.author }
        ]
      });

      const reviewsWithUsers = b.reviews.map(r => ({
        ...r,
        userId: readerId,
        username: reader ? reader.username : 'BookLover'
      }));

      const avg = reviewsWithUsers.length
        ? reviewsWithUsers.reduce((acc, curr) => acc + curr.rating, 0) / reviewsWithUsers.length
        : 5;

      if (existing) {
        // Update to make sure all real details & cover paths are current
        existing.title = b.title;
        existing.author = b.author;
        existing.publishYear = b.publishYear;
        existing.category = b.category;
        existing.description = b.description;
        existing.isbn = b.isbn;
        existing.pageCount = b.pageCount;
        existing.language = b.language;
        existing.image = b.image;
        existing.isFeatured = b.isFeatured;
        existing.averageRating = avg;
        if (!existing.reviews || existing.reviews.length === 0) {
          existing.reviews = reviewsWithUsers;
        }
        await existing.save();
        updatedCount++;
      } else {
        await Book.create({
          ...b,
          createdBy: adminId,
          reviews: reviewsWithUsers,
          averageRating: avg
        });
        insertedCount++;
      }
    }

    console.log(`✨ Successfully seeded comprehensive library: ${insertedCount} new books inserted, ${updatedCount} existing updated! Total library size: ${await Book.countDocuments()}`);
  } catch (error) {
    console.error('Error seeding comprehensive books:', error);
  }
};

