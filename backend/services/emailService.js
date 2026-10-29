import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

let testAccountTransporter = null;

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
 * Generate rich, responsive, magazine-grade HTML email matching PageTurner's aesthetic
 */
export const generateWelcomeEmailHtml = ({
  username = 'Reader',
  email = '',
  memberId = '',
  frontendUrl = 'http://localhost:5173',
}) => {
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
  <title>Welcome to PageTurner — Your Official Reader Passport</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF7F2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #292522;
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
      background-color: #FAF7F2;
      padding: 40px 12px;
    }
    .main-card {
      background-color: #FFFDF9;
      margin: 0 auto;
      max-width: 620px;
      border: 1px solid #E8DED2;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(41, 37, 34, 0.08);
      overflow: hidden;
    }
    .masthead {
      background: linear-gradient(135deg, #7B1826 0%, #861D2D 60%, #5C101B 100%);
      padding: 34px 28px;
      text-align: center;
      color: #FFFDF9;
      position: relative;
    }
    .masthead-seal {
      display: inline-block;
      width: 44px;
      height: 44px;
      line-height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 20px;
      margin-bottom: 12px;
    }
    .masthead h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 30px;
      letter-spacing: -0.5px;
      font-weight: 700;
      color: #FFFDF9;
    }
    .masthead p {
      margin: 8px 0 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      font-family: 'Courier New', Courier, monospace;
      color: #F8E8CD;
      font-weight: bold;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 26px;
      font-weight: 700;
      color: #292522;
      line-height: 1.25;
      margin-bottom: 12px;
    }
    .greeting span {
      color: #861D2D;
      font-style: italic;
      font-weight: normal;
    }
    .lead-text {
      font-size: 15px;
      line-height: 1.7;
      color: #5A524C;
      font-family: 'Georgia', serif;
      margin-bottom: 24px;
    }

    /* Official Reader Passport Card */
    .passport-card {
      background: linear-gradient(180deg, #F9F5EC 0%, #F1E6D4 100%);
      border: 2px dashed #CBB499;
      border-radius: 16px;
      padding: 22px 24px;
      margin: 28px 0 32px;
      box-shadow: 0 4px 16px rgba(50, 30, 15, 0.06);
    }
    .passport-header {
      border-bottom: 1px solid #D6C3AA;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .passport-title {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #7B1826;
      font-weight: bold;
    }
    .passport-meta-table {
      width: 100%;
    }
    .passport-meta-table td {
      padding: 4px 0;
      font-size: 13px;
    }
    .passport-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      text-transform: uppercase;
      color: #7A695A;
      width: 120px;
    }
    .passport-value {
      font-family: 'Georgia', serif;
      font-weight: bold;
      color: #292522;
    }

    /* 3 Starter Recommendations */
    .section-title {
      font-family: 'Georgia', serif;
      font-size: 19px;
      font-weight: 700;
      color: #292522;
      margin: 32px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #EAE0D5;
    }
    .section-subtitle {
      font-size: 13px;
      color: #786C62;
      font-family: 'Georgia', serif;
      font-style: italic;
      margin-top: -12px;
      margin-bottom: 20px;
    }
    .book-card-table {
      width: 100%;
      margin-bottom: 14px;
      background: #FAF7F2;
      border: 1px solid #E6DCD0;
      border-radius: 12px;
      overflow: hidden;
    }
    .book-card-table td {
      padding: 14px 16px;
      vertical-align: middle;
    }
    .book-thumb {
      width: 58px;
      height: 82px;
      border-radius: 6px;
      object-fit: cover;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .book-title {
      font-family: 'Georgia', serif;
      font-size: 16px;
      font-weight: bold;
      color: #292522;
      margin: 0 0 3px;
      line-height: 1.3;
    }
    .book-author {
      font-size: 12px;
      color: #786C62;
      font-family: 'Georgia', serif;
      font-style: italic;
      margin: 0 0 6px;
    }
    .book-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-family: 'Courier New', Courier, monospace;
      text-transform: uppercase;
      font-weight: bold;
      background: #EAE1D5;
      color: #5C4B3E;
    }
    .book-action-btn {
      display: inline-block;
      background-color: #861D2D;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 2px 6px rgba(134, 29, 45, 0.25);
    }

    /* Blind Date Mystery Teaser Card */
    .mystery-teaser {
      background: linear-gradient(135deg, #24171D 0%, #170E13 100%);
      color: #FAF5ED;
      border-radius: 14px;
      padding: 24px;
      margin: 28px 0;
      border: 1px solid #482D3A;
      text-align: center;
    }
    .mystery-teaser h3 {
      font-family: 'Georgia', serif;
      font-size: 19px;
      color: #F8E4CF;
      margin: 0 0 8px;
    }
    .mystery-teaser p {
      font-size: 13px;
      line-height: 1.6;
      color: #D6C2B4;
      font-family: 'Georgia', serif;
      font-style: italic;
      margin: 0 auto 16px;
      max-width: 440px;
    }
    .mystery-btn {
      display: inline-block;
      background: linear-gradient(90deg, #9E1F32 0%, #7B1826 100%);
      color: #FFF5EB !important;
      text-decoration: none;
      padding: 11px 24px;
      border-radius: 24px;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Quick Start 3 Rituals */
    .rituals-box {
      background-color: #FBF8F3;
      border: 1px solid #EBE1D4;
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 28px;
    }
    .ritual-item {
      margin-bottom: 14px;
      font-size: 13px;
      color: #4A423D;
      line-height: 1.5;
    }
    .ritual-item:last-child {
      margin-bottom: 0;
    }
    .ritual-num {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: #861D2D;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: bold;
      margin-right: 8px;
    }

    /* Primary CTA */
    .cta-container {
      text-align: center;
      margin: 36px 0 20px;
    }
    .primary-btn {
      display: inline-block;
      background: linear-gradient(135deg, #7B1826 0%, #962334 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 15px 36px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
      box-shadow: 0 6px 18px rgba(123, 24, 38, 0.35);
    }

    /* Footer */
    .footer {
      border-top: 1px solid #E8DED2;
      background-color: #F8F4EC;
      padding: 24px 32px;
      text-align: center;
      font-size: 11px;
      color: #7C7167;
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.7;
    }
    .footer a {
      color: #861D2D;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Masthead Header -->
      <div class="masthead">
        <div class="masthead-seal">❦</div>
        <h1>PageTurner</h1>
        <p>Digital Reading Journal &bull; Issue No. 24</p>
      </div>

      <!-- Main Body Content -->
      <div class="content">
        <div class="greeting">
          Welcome to the library, <span>${username}.</span>
        </div>
        <p class="lead-text">
          Your reader passport is officially active. PageTurner is an artisanal universe designed for deep reading, timeless reflections, and quieter days.
        </p>

        <!-- Official Reader Passport Card -->
        <div class="passport-card">
          <div class="passport-header">
            <span class="passport-title">Official Reader Passport &bull; Ex Libris</span>
          </div>
          <table class="passport-meta-table">
            <tr>
              <td class="passport-label">Reader Name:</td>
              <td class="passport-value">${username}</td>
            </tr>
            <tr>
              <td class="passport-label">Passport No:</td>
              <td class="passport-value" style="font-family: 'Courier New', Courier, monospace; color: #861D2D;">${resolvedMemberId}</td>
            </tr>
            <tr>
              <td class="passport-label">Member Tier:</td>
              <td class="passport-value">Verified Founding Reader</td>
            </tr>
            <tr>
              <td class="passport-label">Date Issued:</td>
              <td class="passport-value">${issuedDate}</td>
            </tr>
            <tr>
              <td class="passport-label">Privileges:</td>
              <td class="passport-value">Unlimited Shelf Pins, Blind Date Volumes, CSV Journal Export</td>
            </tr>
          </table>
        </div>

        <!-- 3 Hand-Curated Starter Pack Recommendations -->
        <div class="section-title">Your Curated Starter Pack</div>
        <div class="section-subtitle">Three extraordinary stories hand-selected to inaugurate your private shelf:</div>

        <!-- Book 1: The Picture of Dorian Gray -->
        <table class="book-card-table">
          <tr>
            <td style="width: 70px;">
              <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80" alt="The Picture of Dorian Gray" class="book-thumb" />
            </td>
            <td>
              <h4 class="book-title">The Picture of Dorian Gray</h4>
              <p class="book-author">by Oscar Wilde &bull; 1890</p>
              <span class="book-badge">Gothic Fiction &bull; 4.8 ★</span>
            </td>
            <td style="text-align: right; width: 110px;">
              <a href="${frontendUrl}" class="book-action-btn">Pin to Shelf &rarr;</a>
            </td>
          </tr>
        </table>

        <!-- Book 2: The Alchemist -->
        <table class="book-card-table">
          <tr>
            <td style="width: 70px;">
              <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80" alt="The Alchemist" class="book-thumb" />
            </td>
            <td>
              <h4 class="book-title">The Alchemist</h4>
              <p class="book-author">by Paulo Coelho &bull; 1988</p>
              <span class="book-badge">Philosophy &bull; 4.7 ★</span>
            </td>
            <td style="text-align: right; width: 110px;">
              <a href="${frontendUrl}" class="book-action-btn">Pin to Shelf &rarr;</a>
            </td>
          </tr>
        </table>

        <!-- Book 3: Dune -->
        <table class="book-card-table">
          <tr>
            <td style="width: 70px;">
              <img src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=200&q=80" alt="Dune" class="book-thumb" />
            </td>
            <td>
              <h4 class="book-title">Dune</h4>
              <p class="book-author">by Frank Herbert &bull; 1965</p>
              <span class="book-badge">Sci-Fi Epic &bull; 4.9 ★</span>
            </td>
            <td style="text-align: right; width: 110px;">
              <a href="${frontendUrl}" class="book-action-btn">Pin to Shelf &rarr;</a>
            </td>
          </tr>
        </table>

        <!-- Blind Date with a Book Mystery Teaser -->
        <div class="mystery-teaser">
          <div style="font-size: 24px; margin-bottom: 6px;">💌</div>
          <h3>A Mystery Volume Awaits You</h3>
          <p>
            An unopened volume is wrapped in tactile kraft paper and sealed in crimson wax in the library gallery. Three anonymous clues have been placed for your curiosity.
          </p>
          <a href="${frontendUrl}#blind-date-section" class="mystery-btn">Break the Wax Seal &rarr;</a>
        </div>

        <!-- 3 Reader Rituals -->
        <div class="section-title">The Three Daily Rituals</div>
        <div class="rituals-box">
          <div class="ritual-item">
            <span class="ritual-num">1</span> <strong>Curate by Atmosphere:</strong> Explore books through cinematic moodboards like <em>Dark Academia</em>, <em>Mind-Bending</em>, and <em>Quiet Comfort</em>.
          </div>
          <div class="ritual-item">
            <span class="ritual-num">2</span> <strong>Build Your Private Shelf:</strong> Tap the crimson <em>Save Pin</em> on any story to collect it to your personal reading sanctum.
          </div>
          <div class="ritual-item">
            <span class="ritual-num">3</span> <strong>Export Your Reading Log:</strong> Download your entire catalog anytime via CSV for offline reflection and timeless record-keeping.
          </div>
        </div>

        <!-- Primary Call to Action -->
        <div class="cta-container">
          <a href="${frontendUrl}" class="primary-btn">Enter the Library &amp; Begin Exploring &rarr;</a>
        </div>
      </div>

      <!-- Editorial Footer -->
      <div class="footer">
        PageTurner &bull; Digital Reading Journal &bull; Issue No. 24<br>
        Curated universe of books, ideas &amp; quieter days.<br>
        Member ID: ${resolvedMemberId} &bull; Delivered to ${email || username}<br>
        <span style="font-size: 10px; color: #9E9184;">&copy; ${new Date().getFullYear()} PageTurner. All rights reserved.</span>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Send welcome email asynchronously.
 * Automatically handles Gmail SMTP with fallback to Ethereal.
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
      ? `"PageTurner Library" <${process.env.EMAIL_USER}>`
      : '"PageTurner Library" <no-reply@pageturner.io>';

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `Welcome to PageTurner, ${username} — Your Official Reader Passport & Starter Pack`,
      html: generateWelcomeEmailHtml({
        username,
        email: toEmail,
        memberId,
        frontendUrl: options.frontendUrl || 'http://localhost:5173',
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] ✅ Welcome email dispatched to ${toEmail} (MessageId: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] ✉️  Preview Welcome Email Online: ${previewUrl}`);
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
 * Generate responsive, magazine-grade Login Notification HTML email
 */
export const generateLoginNotificationEmailHtml = ({
  username = 'Reader',
  email = '',
  time = '',
  ip = '127.0.0.1',
  userAgent = '',
  frontendUrl = 'http://localhost:5173',
}) => {
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
  <title>Security Notice: New Login to PageTurner</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF7F2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #292522;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    .wrapper {
      width: 100%;
      background-color: #FAF7F2;
      padding: 40px 12px;
    }
    .main-card {
      background-color: #FFFDF9;
      margin: 0 auto;
      max-width: 580px;
      border: 1px solid #E8DED2;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(41, 37, 34, 0.08);
      overflow: hidden;
    }
    .masthead {
      background: linear-gradient(135deg, #1C1917 0%, #292524 60%, #1A1015 100%);
      padding: 30px 24px;
      text-align: center;
      color: #FFFDF9;
      border-bottom: 2px solid #861D2D;
    }
    .masthead-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(134, 29, 45, 0.3);
      border: 1px solid rgba(248, 232, 205, 0.3);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: 'Courier New', Courier, monospace;
      color: #F8E8CD;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .masthead h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 24px;
      letter-spacing: -0.5px;
      font-weight: 700;
      color: #FFFDF9;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 22px;
      font-weight: 700;
      color: #292522;
      line-height: 1.3;
      margin-bottom: 12px;
    }
    .greeting span {
      color: #861D2D;
    }
    .lead-text {
      font-size: 14px;
      line-height: 1.65;
      color: #5A524C;
      font-family: 'Georgia', serif;
      margin-bottom: 24px;
    }

    /* Security Dossier Card */
    .session-card {
      background: linear-gradient(180deg, #F9F5EC 0%, #F1E6D4 100%);
      border: 1px solid #D6C3AA;
      border-radius: 14px;
      padding: 20px 22px;
      margin: 24px 0 28px;
      box-shadow: 0 4px 12px rgba(50, 30, 15, 0.05);
    }
    .session-header {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #7B1826;
      font-weight: bold;
      border-bottom: 1px solid #D6C3AA;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }
    .session-table {
      width: 100%;
    }
    .session-table td {
      padding: 6px 0;
      font-size: 13px;
      vertical-align: top;
    }
    .session-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      text-transform: uppercase;
      color: #7A695A;
      width: 130px;
      font-weight: 600;
    }
    .session-value {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 600;
      color: #292522;
    }

    .notice-box {
      background-color: #FAF5F0;
      border-left: 3px solid #C99A48;
      border-radius: 0 10px 10px 0;
      padding: 14px 16px;
      margin-bottom: 28px;
      font-size: 12px;
      line-height: 1.6;
      color: #63564A;
    }
    .notice-box strong {
      color: #292522;
    }

    .cta-container {
      text-align: center;
      margin: 28px 0 16px;
    }
    .primary-btn {
      display: inline-block;
      background: linear-gradient(135deg, #7B1826 0%, #861D2D 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 13px 32px;
      border-radius: 28px;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.4px;
      box-shadow: 0 4px 14px rgba(123, 24, 38, 0.3);
    }

    .footer {
      border-top: 1px solid #E8DED2;
      background-color: #F8F4EC;
      padding: 22px 32px;
      text-align: center;
      font-size: 11px;
      color: #7C7167;
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Masthead -->
      <div class="masthead">
        <div class="masthead-badge">🔒 Session Security Alert</div>
        <h1>PageTurner Authentication</h1>
      </div>

      <!-- Main Body -->
      <div class="content">
        <div class="greeting">
          Welcome back, <span>${username}.</span>
        </div>
        <p class="lead-text">
          A new sign-in was successfully verified for your PageTurner reader account. Here are the session details for your records:
        </p>

        <!-- Session Details Box -->
        <div class="session-card">
          <div class="session-header">Session Verification Details</div>
          <table class="session-table">
            <tr>
              <td class="session-label">Date &amp; Time:</td>
              <td class="session-value">${formattedTime}</td>
            </tr>
            <tr>
              <td class="session-label">Device / Browser:</td>
              <td class="session-value">${device}</td>
            </tr>
            <tr>
              <td class="session-label">Network IP:</td>
              <td class="session-value" style="font-family: 'Courier New', Courier, monospace;">${cleanIp}</td>
            </tr>
            <tr>
              <td class="session-label">Account:</td>
              <td class="session-value" style="font-family: 'Courier New', Courier, monospace;">${email}</td>
            </tr>
          </table>
        </div>

        <!-- Security Advice -->
        <div class="notice-box">
          <strong>Was this you?</strong> If you initiated this sign-in, no action is necessary. You may continue exploring your personal reading collection.<br><br>
          <strong>Did not recognize this activity?</strong> If you suspect unauthorized access, please update your password immediately in your account settings or contact the library curator.
        </div>

        <!-- Call to Action -->
        <div class="cta-container">
          <a href="${frontendUrl}" class="primary-btn">Open My Reading Shelf &rarr;</a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        PageTurner Literary Journal &bull; Security &bull; Issue No. 24<br>
        Delivered to ${email}<br>
        &copy; ${new Date().getFullYear()} PageTurner. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Send login notification email asynchronously.
 */
export const sendLoginNotificationEmail = async (toEmail, username, details = {}) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.log(`[Email Service] No transporter available. Skipped login email to ${toEmail}.`);
      return { success: false, reason: 'No transporter available' };
    }

    const fromAddress = process.env.EMAIL_USER
      ? `"PageTurner Security" <${process.env.EMAIL_USER}>`
      : '"PageTurner Security" <no-reply@pageturner.io>';

    const time = details.time || new Date();
    const formattedDate = new Date(time).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `New Login to PageTurner — ${formattedDate}`,
      html: generateLoginNotificationEmailHtml({
        username,
        email: toEmail,
        time: formattedDate,
        ip: details.ip || '127.0.0.1',
        userAgent: details.userAgent || '',
        frontendUrl: details.frontendUrl || 'http://localhost:5173',
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] 🔐 Login security email dispatched to ${toEmail} (MessageId: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] ✉️  Preview Login Email Online: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      sentTo: toEmail,
    };
  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send login notification email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Generate Pinterest-style, editorial Password Reset Request HTML email
 */
export const generatePasswordResetEmailHtml = ({
  username = 'Reader',
  email = '',
  resetToken = '',
  frontendUrl = 'http://localhost:5173',
}) => {
  const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your PageTurner Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF7F2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #292522;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    .wrapper {
      width: 100%;
      background-color: #FAF7F2;
      padding: 40px 12px;
    }
    .main-card {
      background-color: #FFFDF9;
      margin: 0 auto;
      max-width: 580px;
      border: 1px solid #E8DED2;
      border-radius: 20px;
      box-shadow: 0 10px 32px rgba(41, 37, 34, 0.08);
      overflow: hidden;
      position: relative;
    }
    .masthead {
      background: linear-gradient(135deg, #7B1826 0%, #861D2D 60%, #5C101B 100%);
      padding: 32px 24px 28px;
      text-align: center;
      color: #FFFDF9;
    }
    .masthead-seal {
      display: inline-block;
      width: 42px;
      height: 42px;
      line-height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 18px;
      margin-bottom: 10px;
    }
    .masthead h1 {
      margin: 0;
      font-family: 'Georgia', serif;
      font-size: 26px;
      letter-spacing: -0.5px;
      font-weight: 700;
      color: #FFFDF9;
    }
    .masthead p {
      margin: 6px 0 0;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: 'Courier New', Courier, monospace;
      color: #F8E8CD;
      font-weight: bold;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-family: 'Georgia', serif;
      font-size: 22px;
      font-weight: 700;
      color: #292522;
      line-height: 1.3;
      margin-bottom: 12px;
    }
    .greeting span {
      color: #861D2D;
      font-style: italic;
    }
    .lead-text {
      font-size: 15px;
      line-height: 1.65;
      color: #5A524C;
      font-family: 'Georgia', serif;
      margin-bottom: 24px;
    }

    /* Pinterest-Style Vintage Dispatch Card */
    .pin-dossier {
      background: linear-gradient(180deg, #F9F5EC 0%, #F1E6D4 100%);
      border: 2px dashed #CBB499;
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0 28px;
      box-shadow: 0 4px 14px rgba(50, 30, 15, 0.05);
      position: relative;
    }
    .pin-dossier-header {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #7B1826;
      font-weight: bold;
      border-bottom: 1px solid #D6C3AA;
      padding-bottom: 10px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
    }
    .expiry-tag {
      background: #E8D9C7;
      color: #5A4535;
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 10px;
      font-family: 'Courier New', Courier, monospace;
      font-weight: bold;
    }

    .cta-container {
      text-align: center;
      margin: 30px 0 20px;
    }
    .primary-btn {
      display: inline-block;
      background: linear-gradient(135deg, #7B1826 0%, #962334 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 15px 36px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
      box-shadow: 0 6px 18px rgba(123, 24, 38, 0.35);
    }
    .fallback-link {
      font-size: 11px;
      font-family: 'Courier New', Courier, monospace;
      word-break: break-all;
      color: #827870;
      background: #F4ECE1;
      padding: 10px 12px;
      border-radius: 8px;
      margin-top: 18px;
      line-height: 1.5;
    }
    .notice-box {
      background-color: #FAF5F0;
      border-left: 3px solid #861D2D;
      border-radius: 0 10px 10px 0;
      padding: 14px 16px;
      margin: 24px 0 12px;
      font-size: 12px;
      line-height: 1.6;
      color: #63564A;
      font-family: 'Georgia', serif;
      font-style: italic;
    }

    .footer {
      border-top: 1px solid #E8DED2;
      background-color: #F8F4EC;
      padding: 22px 32px;
      text-align: center;
      font-size: 11px;
      color: #7C7167;
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Masthead -->
      <div class="masthead">
        <div class="masthead-seal">🗝️</div>
        <h1>Password Reset Request</h1>
        <p>PageTurner &bull; Account Recovery &bull; Issue No. 24</p>
      </div>

      <!-- Main Body -->
      <div class="content">
        <div class="greeting">
          Hello, <span>${username}.</span>
        </div>
        <p class="lead-text">
          We received an official request to reset the password for your PageTurner reader account (<strong style="color: #292522;">${email}</strong>).
        </p>

        <!-- Pinterest-Styled Card -->
        <div class="pin-dossier">
          <div class="pin-dossier-header">
            <span>Security Verification Dispatch</span>
            <span class="expiry-tag">⏱️ Valid for 60 Minutes</span>
          </div>
          <p style="font-size: 14px; font-family: 'Georgia', serif; line-height: 1.6; color: #4A3E36; margin: 0 0 16px;">
            Click the button below to choose a fresh password and safely unlock your reading collection:
          </p>

          <div class="cta-container">
            <a href="${resetLink}" class="primary-btn">Reset My Password &rarr;</a>
          </div>

          <div class="fallback-link">
            Or copy and paste this URL into your browser:<br>
            <a href="${resetLink}" style="color: #7B1826;">${resetLink}</a>
          </div>
        </div>

        <div class="notice-box">
          <strong>Didn&apos;t request this?</strong> Don&apos;t worry — your password remains completely secure, and no action was taken on your account. You can safely disregard this message.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        PageTurner Literary Journal &bull; Digital Reading &amp; Ephemera<br>
        Delivered to ${email}<br>
        &copy; ${new Date().getFullYear()} PageTurner. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Send password reset email asynchronously
 */
export const sendPasswordResetEmail = async (toEmail, username, resetToken, options = {}) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.log(`[Email Service] No transporter available. Skipped reset email to ${toEmail}.`);
      return { success: false, reason: 'No transporter available' };
    }

    const fromAddress = process.env.EMAIL_USER
      ? `"PageTurner Library" <${process.env.EMAIL_USER}>`
      : '"PageTurner Library" <no-reply@pageturner.io>';

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `Reset Your PageTurner Password — Security Verification`,
      html: generatePasswordResetEmailHtml({
        username,
        email: toEmail,
        resetToken,
        frontendUrl: options.frontendUrl || 'http://localhost:5173',
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] 🗝️ Password reset email dispatched to ${toEmail} (MessageId: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] ✉️  Preview Reset Email Online: ${previewUrl}`);
    }

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
