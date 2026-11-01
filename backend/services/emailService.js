import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

let testAccountTransporter = null;

/**
 * Resolve the public frontend URL for email deep-links.
 * Prefers explicitly supplied URL, then FRONTEND_URL environment variable,
 * defaulting to the live deployed Netlify application.
 */
export const resolveFrontendUrl = (explicitUrl = '') => {
  if (explicitUrl && typeof explicitUrl === 'string') {
    return explicitUrl.replace(/\/$/, '');
  }
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.replace(/\/$/, '');
  }
  return 'https://pageeturner.netlify.app';
};

/**
 * Get or create a nodemailer transporter.
 * If EMAIL_USER and EMAIL_PASS are configured, uses Gmail SMTP.
 * Automatically sanitizes Gmail 16-character App Passwords by removing formatted spaces.
 * Otherwise, generates a free Ethereal test inbox so developers can preview the email immediately.
 */
export const getTransporter = async () => {
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '').trim() : '';

  if (emailUser && emailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Fallback: Automatic free test account for immediate local testing & preview
  if (!testAccountTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      testAccountTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[Email Service] Initialized free Ethereal preview account: ${testAccount.user}`);
    } catch (err) {
      console.warn('[Email Service] Could not create Ethereal test account:', err.message);
      return null;
    }
  }

  return testAccountTransporter;
};

/**
 * Generate a deterministic or random reader member number
 */
export const generateMemberId = (username = 'Reader') => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash) % 90000 + 10000;
  return `PT-${positive}`;
};

/**
 * Parse a raw user-agent string into a friendly "Browser on OS" description
 */
export const parseUserAgent = (uaString = '') => {
  if (!uaString) return 'Web Browser';

  let browser = 'Browser';
  let os = 'Unknown Device';

  if (uaString.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (uaString.includes('Edg/')) browser = 'Microsoft Edge';
  else if (uaString.includes('Chrome/')) browser = 'Google Chrome';
  else if (uaString.includes('Safari/') && !uaString.includes('Chrome')) browser = 'Apple Safari';

  if (uaString.includes('Macintosh') || uaString.includes('Mac OS X')) os = 'macOS';
  else if (uaString.includes('Windows NT')) os = 'Windows';
  else if (uaString.includes('iPhone')) os = 'iPhone (iOS)';
  else if (uaString.includes('iPad')) os = 'iPad (iPadOS)';
  else if (uaString.includes('Android')) os = 'Android Device';
  else if (uaString.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
};

/**
 * =========================================================================
 * 1. WELCOME EMAIL — EX-LIBRIS PASSPORT & LITERARY STARTER PACKAGE
 * =========================================================================
 */
export const generateWelcomeEmailHtml = ({
  username = 'Reader',
  email = '',
  memberId = '',
  frontendUrl = '',
}) => {
  const baseUrl = resolveFrontendUrl(frontendUrl);
  const resolvedMemberId = memberId || generateMemberId(username);
  const issuedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PageTurner — Official Reader Passport & Starter Pack</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F6F1E8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2F2620;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      display: block;
    }
    .wrapper {
      width: 100%;
      background-color: #F6F1E8;
      padding: 36px 12px;
    }
    .main-card {
      background-color: #FFFDF9;
      margin: 0 auto;
      max-width: 640px;
      border: 1px solid #E2D5C3;
      border-radius: 24px;
      box-shadow: 0 16px 48px rgba(47, 38, 32, 0.08);
      overflow: hidden;
    }
    .masthead {
      background: linear-gradient(135deg, #4A0E18 0%, #7D1D2D 60%, #4A0E18 100%);
      padding: 38px 30px 32px;
      text-align: center;
      color: #FFFDF8;
      position: relative;
      border-bottom: 3px solid #C6A16B;
    }
    .masthead-logo {
      margin: 0 auto 16px;
      max-height: 58px;
      width: auto;
      display: inline-block;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
    }
    .masthead-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(247, 216, 164, 0.4);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.2px;
      text-transform: uppercase;
      font-family: 'DM Mono', 'Courier New', monospace;
      color: #F7D8A4;
      margin-bottom: 12px;
    }
    .masthead h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 28px;
      line-height: 1.25;
      letter-spacing: -0.5px;
      color: #FFFDF8;
      font-weight: 700;
    }
    .masthead p {
      margin: 8px 0 0;
      font-size: 13px;
      color: #EBD6BC;
      font-family: 'Georgia', serif;
      font-style: italic;
    }
    .content {
      padding: 36px 32px 30px;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 24px;
      color: #2F2620;
      line-height: 1.3;
      margin-bottom: 14px;
      font-weight: 700;
    }
    .greeting span {
      color: #7D1D2D;
      font-style: italic;
    }
    .lead-text {
      font-size: 14.5px;
      line-height: 1.7;
      color: #5F5248;
      font-family: 'Georgia', serif;
      margin-bottom: 26px;
    }

    /* Tactile Reader Passport Card */
    .passport-box {
      background: linear-gradient(180deg, #FAF5EB 0%, #F1E5D3 100%);
      border: 2px dashed #C8B298;
      border-radius: 20px;
      padding: 24px 26px;
      margin: 28px 0 32px;
      box-shadow: 0 8px 24px rgba(47, 38, 32, 0.05);
      position: relative;
    }
    .passport-ribbon {
      border-bottom: 1px solid #D8C5AD;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .passport-seal-pill {
      display: inline-block;
      background: #7D1D2D;
      color: #F7D8A4;
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 999px;
      font-family: 'DM Mono', monospace;
    }
    .passport-id-badge {
      float: right;
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      font-weight: bold;
      color: #2F2620;
      background: rgba(255, 255, 255, 0.6);
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid #D5C2AA;
    }
    .passport-table {
      width: 100%;
    }
    .passport-table td {
      padding: 6px 0;
      font-size: 13px;
      vertical-align: top;
    }
    .passport-lbl {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #847262;
      width: 130px;
    }
    .passport-val {
      font-family: 'Georgia', serif;
      font-weight: bold;
      color: #2F2620;
    }
    .passport-privileges {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #D8C5AD;
      font-size: 11.5px;
      color: #6A5B4F;
      font-family: 'Georgia', serif;
      line-height: 1.6;
    }

    /* Quick Action Dock */
    .action-dock {
      text-align: center;
      margin: 28px 0;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #7D1D2D 0%, #982236 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 13px 30px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 14px rgba(125, 29, 45, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-secondary {
      display: inline-block;
      background: #F4EADA;
      color: #4A3A2F !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #D9C8B1;
      margin: 6px 4px;
    }

    /* Curated Starter Trilogy */
    .section-title {
      font-family: 'Georgia', serif;
      font-size: 19px;
      color: #2F2620;
      font-weight: 700;
      margin: 32px 0 6px;
      padding-bottom: 8px;
      border-bottom: 1px solid #E6D9C8;
    }
    .section-desc {
      font-size: 12.5px;
      color: #7A695B;
      font-family: 'Georgia', serif;
      font-style: italic;
      margin-bottom: 18px;
    }
    .book-item-table {
      width: 100%;
      background: #FAF6EE;
      border: 1px solid #E5D8C6;
      border-radius: 14px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .book-item-table td {
      padding: 14px 16px;
      vertical-align: middle;
    }
    .book-cover-img {
      width: 62px;
      height: 88px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(47, 38, 32, 0.18);
    }
    .book-name {
      font-family: 'Georgia', serif;
      font-size: 16px;
      font-weight: bold;
      color: #2F2620;
      margin: 0 0 2px;
    }
    .book-author {
      font-size: 12px;
      color: #7A695B;
      font-family: 'Georgia', serif;
      font-style: italic;
      margin: 0 0 6px;
    }
    .book-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      background: #ECE0CE;
      color: #6B5746;
      font-size: 9.5px;
      font-weight: bold;
      font-family: 'DM Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .book-btn {
      display: inline-block;
      background: #7D1D2D;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 7px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(125, 29, 45, 0.2);
    }

    /* Blind Date Mystery Teaser */
    .mystery-banner {
      background: linear-gradient(135deg, #2A1C22 0%, #1A1015 100%);
      border: 1px solid #4D333F;
      border-radius: 16px;
      padding: 24px;
      color: #FFFDF8;
      text-align: center;
      margin: 28px 0;
    }
    .mystery-banner h4 {
      margin: 0 0 6px;
      font-family: 'Georgia', serif;
      font-size: 18px;
      color: #F8E3CD;
    }
    .mystery-banner p {
      font-size: 12.5px;
      line-height: 1.6;
      color: #D3BFB1;
      font-family: 'Georgia', serif;
      font-style: italic;
      max-width: 460px;
      margin: 0 auto 16px;
    }
    .mystery-btn {
      display: inline-block;
      background: linear-gradient(135deg, #9C2034 0%, #7D1D2D 100%);
      color: #FFF9F2 !important;
      text-decoration: none;
      padding: 9px 22px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: bold;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Rituals Box */
    .rituals-card {
      background: #FBF8F2;
      border: 1px solid #E8DCCF;
      border-radius: 14px;
      padding: 20px 22px;
      margin: 26px 0;
    }
    .ritual-row {
      margin-bottom: 12px;
      font-size: 13px;
      color: #4A3E35;
      line-height: 1.5;
    }
    .ritual-row:last-child {
      margin-bottom: 0;
    }
    .ritual-dot {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: #7D1D2D;
      color: #FFF;
      font-size: 10px;
      font-weight: bold;
      margin-right: 8px;
    }

    /* Sign-off & Footer */
    .signoff {
      border-top: 1px solid #E6D9C8;
      padding-top: 22px;
      margin-top: 30px;
      text-align: center;
    }
    .signoff p {
      font-family: 'Georgia', serif;
      font-style: italic;
      color: #6F5E51;
      font-size: 14px;
      margin: 4px 0;
    }
    .footer {
      background: #F1E7D7;
      padding: 24px 28px;
      text-align: center;
      border-top: 1px solid #DECDB7;
      font-size: 11px;
      color: #837264;
      line-height: 1.6;
    }
    .footer a {
      color: #7D1D2D;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Top Masthead with Official Logo -->
      <div class="masthead">
        <a href="${baseUrl}" target="_blank" style="text-decoration: none;">
          <img src="${baseUrl}/images/pageturner-full-transparent.png" alt="PageTurner" class="masthead-logo" />
        </a>
        <br />
        <span class="masthead-badge">Official Reader Folio &bull; Issue No. 24</span>
        <h1>Welcome to Your Sanctuary</h1>
        <p>A Curated Haven for Book Lovers, Thoughtful Collectors &amp; Kindred Minds</p>
      </div>

      <!-- Main Body Content -->
      <div class="content">
        <div class="greeting">
          Greetings, <span>${username}</span>.
        </div>
        <div class="lead-text">
          Your Reader Passport has been sealed and inscribed into the permanent stacks of PageTurner. Within these halls, books are not mere data points—they are atmospheres to live inside, thoughts to linger over, and conversations across centuries.
        </div>

        <!-- The Physical-Style Reader Passport Card -->
        <div class="passport-box">
          <div class="passport-ribbon">
            <span class="passport-seal-pill">&#10086; Verified Sanctuary Member</span>
            <span class="passport-id-badge">${resolvedMemberId}</span>
          </div>

          <table class="passport-table">
            <tr>
              <td class="passport-lbl">Reader Name:</td>
              <td class="passport-val">${username}</td>
            </tr>
            <tr>
              <td class="passport-lbl">Dispatch Address:</td>
              <td class="passport-val">${email || 'Reader Sanctuary Box'}</td>
            </tr>
            <tr>
              <td class="passport-lbl">Curator Status:</td>
              <td class="passport-val" style="color: #7D1D2D;">Active Library Fellow</td>
            </tr>
            <tr>
              <td class="passport-lbl">Inscribed Date:</td>
              <td class="passport-val" style="color: #6F5E51; font-weight: normal;">${issuedDate}</td>
            </tr>
          </table>

          <div class="passport-privileges">
            <strong>Active Sanctuary Privileges:</strong> Unlimited Personal Shelf Pins, Mystery Parcel Blind Dates, Real-Time Marginalia Scribing, Epistolary Letters &amp; Mailbox Exchange, and Binaural Reading Chambers.
          </div>
        </div>

        <!-- Functional 1-Click Action Dock -->
        <div class="action-dock">
          <a href="${baseUrl}" class="btn-primary" target="_blank">
            &#10022; Step Into Your Sanctuary
          </a>
          <br style="line-height: 22px;" />
          <a href="${baseUrl}/?openShelf=true" class="btn-secondary" target="_blank">
            &#128218; View Reading Shelf
          </a>
          <a href="${baseUrl}/community" class="btn-secondary" target="_blank">
            &#127963; Enter Readers' Salon
          </a>
        </div>

        <!-- Curated Starter Pack Trilogy -->
        <div class="section-title">Starter Volumes Included in Your Package</div>
        <div class="section-desc">Three canonical works selected by our chief librarians to inaugurate your collection:</div>

        <!-- Volume 1: Dorian Gray -->
        <table class="book-item-table">
          <tr>
            <td style="width: 72px;">
              <img src="${baseUrl}/images/dorian-open-book-spread.jpg" alt="The Picture of Dorian Gray" class="book-cover-img" />
            </td>
            <td>
              <div class="book-name">The Picture of Dorian Gray</div>
              <div class="book-author">Oscar Wilde</div>
              <div style="margin-bottom: 6px;">
                <span class="book-badge">Gothic Aestheticism</span>
                <span style="font-size: 11px; color: #847262; font-style: italic; margin-left: 6px;">~6 hrs</span>
              </div>
              <div style="font-size: 12px; color: #6A5B4F; font-family: 'Georgia', serif; font-style: italic;">
                "Behind every exquisite thing that existed, there was something tragic."
              </div>
            </td>
            <td style="width: 90px; text-align: right;">
              <a href="${baseUrl}/?openShelf=true" class="book-btn" target="_blank">+ Shelf</a>
            </td>
          </tr>
        </table>

        <!-- Volume 2: Meditations -->
        <table class="book-item-table">
          <tr>
            <td style="width: 72px;">
              <img src="https://covers.openlibrary.org/b/isbn/9780140449334-M.jpg" alt="Meditations" class="book-cover-img" />
            </td>
            <td>
              <div class="book-name">Meditations</div>
              <div class="book-author">Marcus Aurelius</div>
              <div style="margin-bottom: 6px;">
                <span class="book-badge">Stoic Philosophy</span>
                <span style="font-size: 11px; color: #847262; font-style: italic; margin-left: 6px;">~4 hrs</span>
              </div>
              <div style="font-size: 12px; color: #6A5B4F; font-family: 'Georgia', serif; font-style: italic;">
                "You have power over your mind - not outside events. Realise this, and you will find strength."
              </div>
            </td>
            <td style="width: 90px; text-align: right;">
              <a href="${baseUrl}/?openShelf=true" class="book-btn" target="_blank">+ Shelf</a>
            </td>
          </tr>
        </table>

        <!-- Volume 3: Dune -->
        <table class="book-item-table">
          <tr>
            <td style="width: 72px;">
              <img src="https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg" alt="Dune" class="book-cover-img" />
            </td>
            <td>
              <div class="book-name">Dune</div>
              <div class="book-author">Frank Herbert</div>
              <div style="margin-bottom: 6px;">
                <span class="book-badge">Speculative Sci-Fi</span>
                <span style="font-size: 11px; color: #847262; font-style: italic; margin-left: 6px;">~18 hrs</span>
              </div>
              <div style="font-size: 12px; color: #6A5B4F; font-family: 'Georgia', serif; font-style: italic;">
                "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration."
              </div>
            </td>
            <td style="width: 90px; text-align: right;">
              <a href="${baseUrl}/?openShelf=true" class="book-btn" target="_blank">+ Shelf</a>
            </td>
          </tr>
        </table>

        <!-- Blind Date Mystery Parcel Section -->
        <div class="mystery-banner">
          <h4>&#127873; Blind Date with a Book &bull; Mystery Parcel</h4>
          <p>
            Wrapped in heavy kraft paper with twine and wax seals. You know only the mood, rhythm, and sensory clues. Break the wax seal and meet your next beloved book.
          </p>
          <a href="${baseUrl}/?openBlindDate=true" class="mystery-btn" target="_blank">
            Reveal Your Mystery Parcel &rarr;
          </a>
        </div>

        <!-- Three Recommended Rituals -->
        <div class="rituals-card">
          <div style="font-family: 'Georgia', serif; font-size: 15px; font-weight: bold; color: #2F2620; margin-bottom: 12px;">
            Three Archival Rituals for Your First Visit:
          </div>
          <div class="ritual-row">
            <span class="ritual-dot">1</span>
            <strong>Curate Your Shelf:</strong> Pin beloved classics to your personal wall and set reading velocity targets.
          </div>
          <div class="ritual-row">
            <span class="ritual-dot">2</span>
            <strong>Step into The Salon:</strong> Inscribe margin thoughts, discuss active reading chapters, and join kindred parlours.
          </div>
          <div class="ritual-row">
            <span class="ritual-dot">3</span>
            <strong>Dispatch Wax Letters:</strong> Exchange intimate reflections with registered readers through our Poste Restante mailbox.
          </div>
        </div>

        <!-- Curator Sign-off -->
        <div class="signoff">
          <p>May your hours here be peaceful, quiet, and deeply thought-provoking.</p>
          <p style="font-weight: bold; color: #7D1D2D; margin-top: 8px;">
            &mdash; The Chief Curators &amp; Librarians of PageTurner
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        PageTurner Digital Reading Sanctuary &bull; Permanent Collection<br />
        This dispatch was sealed for <strong>${email || username}</strong> under Member ID <strong>${resolvedMemberId}</strong>.<br />
        <a href="${baseUrl}" target="_blank">Visit Web Sanctuary</a> &bull; 
        <a href="${baseUrl}/community" target="_blank">Readers' Salon</a> &bull; 
        <a href="${baseUrl}/login" target="_blank">Sign In</a>
      </div>

    </div>
  </div>
</body>
</html>`;
};

/**
 * =========================================================================
 * 2. LOGIN NOTIFICATION EMAIL — SESSION RESUMED & SECURITY ADVISORY
 * =========================================================================
 */
export const generateLoginNotificationEmailHtml = ({
  username = 'Reader',
  email = '',
  time = '',
  ip = '127.0.0.1',
  userAgent = '',
  frontendUrl = '',
}) => {
  const baseUrl = resolveFrontendUrl(frontendUrl);
  const formattedTime =
    time ||
    new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  const device = parseUserAgent(userAgent);
  const cleanIp = ip ? ip.replace(/^::ffff:/, '') : '127.0.0.1';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Notice: Session Resumed on PageTurner</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F6F1E8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2F2620;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    .wrapper {
      width: 100%;
      background-color: #F6F1E8;
      padding: 36px 12px;
    }
    .main-card {
      background-color: #FFFDF9;
      margin: 0 auto;
      max-width: 600px;
      border: 1px solid #E2D5C3;
      border-radius: 24px;
      box-shadow: 0 16px 48px rgba(47, 38, 32, 0.08);
      overflow: hidden;
    }
    .masthead {
      background: linear-gradient(135deg, #1E1719 0%, #2E1B23 60%, #1A1015 100%);
      padding: 32px 28px;
      text-align: center;
      color: #FFFDF8;
      border-bottom: 3px solid #7D1D2D;
    }
    .masthead-badge {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 999px;
      background: rgba(125, 29, 45, 0.4);
      border: 1px solid rgba(247, 216, 164, 0.3);
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-family: 'DM Mono', monospace;
      color: #F7D8A4;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .masthead h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 24px;
      color: #FFFDF8;
      font-weight: 700;
    }
    .content {
      padding: 34px 30px;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 22px;
      color: #2F2620;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .telemetry-card {
      background: #FAF5EB;
      border: 1px solid #E5D7C4;
      border-radius: 16px;
      padding: 20px 22px;
      margin: 22px 0 28px;
    }
    .telemetry-table {
      width: 100%;
    }
    .telemetry-table td {
      padding: 6px 0;
      font-size: 13px;
    }
    .telemetry-lbl {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px;
      text-transform: uppercase;
      color: #837264;
      width: 120px;
    }
    .telemetry-val {
      font-family: 'Georgia', serif;
      font-weight: bold;
      color: #2F2620;
    }
    .btn-confirm {
      display: inline-block;
      background: linear-gradient(135deg, #7D1D2D 0%, #982236 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 999px;
      font-size: 12.5px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(125, 29, 45, 0.3);
    }
    .btn-alert {
      display: inline-block;
      background: #FFF4F2;
      color: #B42318 !important;
      text-decoration: none;
      padding: 10px 22px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #FECDCA;
      margin-left: 8px;
    }
    .security-notice {
      background: #FDF9F3;
      border-left: 3px solid #C6A16B;
      padding: 14px 16px;
      border-radius: 0 10px 10px 0;
      margin-top: 26px;
      font-size: 12.5px;
      color: #6E5F52;
      line-height: 1.6;
      font-family: 'Georgia', serif;
    }
    .footer {
      background: #F1E7D7;
      padding: 22px 26px;
      text-align: center;
      border-top: 1px solid #DECDB7;
      font-size: 11px;
      color: #837264;
      line-height: 1.6;
    }
    .footer a {
      color: #7D1D2D;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="masthead">
        <span class="masthead-badge">&#128737; Security Sentinel</span>
        <h1>Sanctuary Reading Session Resumed</h1>
      </div>

      <div class="content">
        <div class="greeting">
          Hello, ${username}.
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #5F5248; font-family: 'Georgia', serif; margin: 0 0 20px;">
          A reading session was just reopened for your PageTurner sanctuary account. If this was you opening your book collection, you may safely resume reading.
        </p>

        <!-- Session Dossier -->
        <div class="telemetry-card">
          <table class="telemetry-table">
            <tr>
              <td class="telemetry-lbl">Time of Entry:</td>
              <td class="telemetry-val">${formattedTime}</td>
            </tr>
            <tr>
              <td class="telemetry-lbl">Device / OS:</td>
              <td class="telemetry-val">${device}</td>
            </tr>
            <tr>
              <td class="telemetry-lbl">IP Origin:</td>
              <td class="telemetry-val">${cleanIp}</td>
            </tr>
            <tr>
              <td class="telemetry-lbl">Sanctuary Account:</td>
              <td class="telemetry-val" style="color: #7D1D2D;">${email || username}</td>
            </tr>
          </table>
        </div>

        <!-- Action Choices -->
        <div style="text-align: center; margin: 26px 0;">
          <a href="${baseUrl}" class="btn-confirm" target="_blank">
            &#10022; Resume Reading Session
          </a>
          <a href="${baseUrl}/forgot-password?email=${encodeURIComponent(email)}" class="btn-alert" target="_blank">
            &#128274; Not You? Secure Account
          </a>
        </div>

        <div class="security-notice">
          <strong>Librarian's Note:</strong> We dispatch security alerts whenever an archival session token is generated on a browser or device. If you did not initiate this login, click <em>Secure Account</em> above to immediately reset your password and invalidate all active reading sessions.
        </div>
      </div>

      <div class="footer">
        PageTurner Digital Reading Sanctuary &bull; Automated Security Protocol<br />
        Dispatched to ${email || username} &bull; Protected by TLS Encryption &amp; Archival Tokens
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * =========================================================================
 * 3. PASSWORD RESET EMAIL — SANCTUARY KEY RECOVERY
 * =========================================================================
 */
export const generatePasswordResetEmailHtml = ({
  username = 'Reader',
  email = '',
  resetToken = '',
  frontendUrl = '',
}) => {
  const baseUrl = resolveFrontendUrl(frontendUrl);
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
  const displayToken = resetToken ? resetToken.slice(0, 8).toUpperCase() : 'PT-KEY-77';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your PageTurner Sanctuary Key</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F6F1E8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2F2620;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      background-color: #F6F1E8;
      padding: 36px 12px;
    }
    .main-card {
      background-color: #FFFDF9;
      margin: 0 auto;
      max-width: 600px;
      border: 1px solid #E2D5C3;
      border-radius: 24px;
      box-shadow: 0 16px 48px rgba(47, 38, 32, 0.08);
      overflow: hidden;
      position: relative;
    }
    .masthead {
      background: linear-gradient(135deg, #4A0E18 0%, #7D1D2D 60%, #4A0E18 100%);
      padding: 34px 28px;
      text-align: center;
      color: #FFFDF8;
      border-bottom: 3px solid #C6A16B;
    }
    .masthead-seal {
      display: inline-block;
      width: 46px;
      height: 46px;
      line-height: 46px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(247, 216, 164, 0.4);
      font-size: 20px;
      margin-bottom: 10px;
    }
    .masthead h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 25px;
      color: #FFFDF8;
      font-weight: 700;
    }
    .masthead p {
      margin: 6px 0 0;
      font-size: 11px;
      font-family: 'DM Mono', monospace;
      color: #F7D8A4;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      padding: 34px 30px;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 22px;
      color: #2F2620;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .btn-reset {
      display: inline-block;
      background: linear-gradient(135deg, #7D1D2D 0%, #982236 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 13px 32px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 14px rgba(125, 29, 45, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .token-box {
      background: #FAF5EB;
      border: 2px dashed #CBB59D;
      border-radius: 14px;
      padding: 18px 22px;
      margin: 24px 0;
      text-align: center;
    }
    .token-code {
      font-family: 'DM Mono', monospace;
      font-size: 18px;
      font-weight: bold;
      color: #7D1D2D;
      letter-spacing: 2px;
      word-break: break-all;
    }
    .footer {
      background: #F1E7D7;
      padding: 22px 26px;
      text-align: center;
      border-top: 1px solid #DECDB7;
      font-size: 11px;
      color: #837264;
      line-height: 1.6;
    }
    .footer a {
      color: #7D1D2D;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="masthead">
        <div class="masthead-seal">&#128273;</div>
        <h1>Sanctuary Key Recovery</h1>
        <p>ARCHIVAL FOLIO &bull; ACCESS RESTORATION</p>
      </div>

      <div class="content">
        <div class="greeting">
          Greetings, ${username}.
        </div>
        <p style="font-size: 14.5px; line-height: 1.7; color: #5F5248; font-family: 'Georgia', serif; margin: 0 0 20px;">
          We received a request to inscribe a new password for your PageTurner sanctuary account. Click the button below to forge your new key:
        </p>

        <!-- Primary 1-Click Action -->
        <div style="text-align: center; margin: 26px 0;">
          <a href="${resetLink}" class="btn-reset" target="_blank">
            &#128273; Inscribe New Sanctuary Key &rarr;
          </a>
        </div>

        <!-- Backup Token Box -->
        <div class="token-box">
          <div style="font-size: 11px; font-family: 'DM Mono', monospace; text-transform: uppercase; color: #837264; letter-spacing: 1px; margin-bottom: 6px;">
            Archival Verification Token (Expires in 60 Minutes)
          </div>
          <div class="token-code">${displayToken}</div>
          <div style="font-size: 11.5px; color: #837264; font-family: 'Georgia', serif; font-style: italic; margin-top: 6px;">
            If direct clicking is disabled by your email reader, paste the token above on the recovery page.
          </div>
        </div>

        <p style="font-size: 12.5px; line-height: 1.6; color: #7F7063; font-family: 'Georgia', serif; margin: 20px 0 0;">
          <strong>Security Note:</strong> This dispatch is valid for 60 minutes. If you did not make this request, you may safely ignore this letter—your existing key remains untouched and your private shelf remains secure.
        </p>
      </div>

      <div class="footer">
        PageTurner Digital Reading Sanctuary &bull; Permanent Collection<br />
        Dispatched to ${email || username} &bull; <a href="${baseUrl}">Return to Sanctuary</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * =========================================================================
 * DISPATCH HANDLERS
 * =========================================================================
 */

export const sendWelcomeEmail = async (toEmail, username, options = {}) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.log(`[Email Service] No transporter available. Skipped email to ${toEmail}.`);
      return { success: false, reason: 'No transporter available' };
    }

    const memberId = options.memberId || generateMemberId(username);
    const fromAddress = process.env.EMAIL_USER
      ? `"PageTurner Sanctuary" <${process.env.EMAIL_USER}>`
      : '"PageTurner Sanctuary" <curator@pageeturner.netlify.app>';

    const frontendUrl = resolveFrontendUrl(options.frontendUrl);

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `Welcome to PageTurner, ${username} — Your Official Reader Passport & Starter Pack`,
      html: generateWelcomeEmailHtml({
        username,
        email: toEmail,
        memberId,
        frontendUrl,
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] ✅ Welcome email dispatched to ${toEmail} (MessageId: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] ✉️ Preview Welcome Email: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      memberId,
      sentTo: toEmail,
    };
  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send welcome email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const sendLoginNotificationEmail = async (toEmail, username, details = {}) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      return { success: false, reason: 'No transporter available' };
    }

    const fromAddress = process.env.EMAIL_USER
      ? `"PageTurner Security" <${process.env.EMAIL_USER}>`
      : '"PageTurner Security" <curator@pageeturner.netlify.app>';

    const frontendUrl = resolveFrontendUrl(details.frontendUrl);

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `Security Notice: Sanctuary Reading Session Resumed (${username})`,
      html: generateLoginNotificationEmailHtml({
        username,
        email: toEmail,
        time: details.time ? new Date(details.time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '',
        ip: details.ip || '127.0.0.1',
        userAgent: details.userAgent || '',
        frontendUrl,
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] ✅ Login notification dispatched to ${toEmail} (MessageId: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      sentTo: toEmail,
    };
  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send login notification to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (toEmail, username, resetToken, options = {}) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      return { success: false, reason: 'No transporter available' };
    }

    const fromAddress = process.env.EMAIL_USER
      ? `"PageTurner Sanctuary" <${process.env.EMAIL_USER}>`
      : '"PageTurner Sanctuary" <curator@pageeturner.netlify.app>';

    const frontendUrl = resolveFrontendUrl(options.frontendUrl);

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `PageTurner: Inscribe Your New Sanctuary Key (${username})`,
      html: generatePasswordResetEmailHtml({
        username,
        email: toEmail,
        resetToken,
        frontendUrl,
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] ✅ Password reset email dispatched to ${toEmail} (MessageId: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      sentTo: toEmail,
    };
  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send password reset email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};
