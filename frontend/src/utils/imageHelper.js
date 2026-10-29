import { API_BASE_URL } from '../services/api';

// Map of canonical titles / ISBNs to lightning-fast local static cover images
const TITLE_TO_SLUG = {
  'to kill a mockingbird': 'to-kill-a-mockingbird',
  '1984': '1984',
  'the great gatsby': 'the-great-gatsby',
  'pride and prejudice': 'pride-and-prejudice',
  'the catcher in the rye': 'the-catcher-in-the-rye',
  'the hobbit': 'the-hobbit',
  'sapiens: a brief history of humankind': 'sapiens',
  'sapiens': 'sapiens',
  'dune': 'dune',
  'steve jobs': 'steve-jobs',
  'the alchemist': 'the-alchemist',
  'brave new world': 'brave-new-world',
  'atomic habits': 'atomic-habits',
  'crime and punishment': 'crime-and-punishment',
  'the fellowship of the ring': 'the-fellowship-of-the-ring',
  'educated': 'educated',
  'fahrenheit 451': 'fahrenheit-451',
  'thinking, fast and slow': 'thinking-fast-and-slow',
  'the diary of a young girl': 'the-diary-of-a-young-girl',
  'the picture of dorian gray': 'the-picture-of-dorian-gray',
  "man's search for meaning": 'mans-search-for-meaning',
  'mans search for meaning': 'mans-search-for-meaning',
};

const ISBN_TO_SLUG = {
  '9780061120084': 'to-kill-a-mockingbird',
  '9780451524935': '1984',
  '9780743273565': 'the-great-gatsby',
  '9780141439518': 'pride-and-prejudice',
  '9780316769488': 'the-catcher-in-the-rye',
  '9780547928227': 'the-hobbit',
  '9780062316097': 'sapiens',
  '9780441172719': 'dune',
  '9781451648539': 'steve-jobs',
  '9780062315007': 'the-alchemist',
  '9780060850524': 'brave-new-world',
  '9780735211292': 'atomic-habits',
  '9780140449136': 'crime-and-punishment',
  '9780547928210': 'the-fellowship-of-the-ring',
  '9780399590504': 'educated',
  '9781451673319': 'fahrenheit-451',
  '9780374533557': 'thinking-fast-and-slow',
  '9780553296983': 'the-diary-of-a-young-girl',
  '9780141439570': 'the-picture-of-dorian-gray',
  '9780807014295': 'mans-search-for-meaning',
};

/**
 * Returns an ultra-fast, local, or optimized image URL for a given book.
 * Automatically intercepts slow/laggy third-party CDN URLs (like OpenLibrary)
 * and serves the bundled local asset with zero network latency.
 */
export const getBookCoverUrl = (image, title = '', isbn = '') => {
  // 1. Check if the book matches a canonical local cover asset
  const normalizedTitle = title?.toLowerCase().trim();
  const slug = (isbn && ISBN_TO_SLUG[isbn]) || (normalizedTitle && TITLE_TO_SLUG[normalizedTitle]);

  if (slug) {
    return `/images/covers/${slug}.jpg`;
  }

  if (!image) return null;

  // 2. Intercept slow OpenLibrary URLs
  if (image.includes('covers.openlibrary.org')) {
    const match = image.match(/\/isbn\/([0-9Xx]+)/);
    if (match && match[1] && ISBN_TO_SLUG[match[1]]) {
      return `/images/covers/${ISBN_TO_SLUG[match[1]]}.jpg`;
    }
  }

  // 3. Already a local frontend public image
  if (image.startsWith('/images/')) {
    return image;
  }

  // 4. Backend static upload (e.g. /uploads/...)
  if (image.startsWith('/uploads/')) {
    return `${API_BASE_URL}${image}`;
  }

  // 5. Full URL (e.g. https://...)
  if (image.startsWith('http')) {
    return image;
  }

  return `${API_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

