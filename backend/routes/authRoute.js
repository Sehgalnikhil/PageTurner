import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/userModel.js';

import { JWT_SECRET } from '../config.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendWelcomeEmail,
  generateWelcomeEmailHtml,
  generateMemberId,
  sendLoginNotificationEmail,
  generateLoginNotificationEmailHtml,
  sendPasswordResetEmail,
  generatePasswordResetEmailHtml,
} from '../services/emailService.js';

const router = express.Router();

// Generate JWT (Lectures 57, 60: JWT Authentication & Storage)
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (first user will be admin for simplicity, others user)
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      // Send beautiful welcome email asynchronously in background (non-blocking)
      sendWelcomeEmail(user.email, user.username);

      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Dispatches security alert & welcome back email to user asynchronously
      sendLoginNotificationEmail(user.email, user.username, {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Web Browser',
        time: new Date(),
      });

      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /auth/me
// @desc    Get current logged in user profile
// @access  Private (Demonstrates Protected Route & JWT verification)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving user profile' });
  }
});

// @route   GET /auth/email/preview
// @desc    Interactive live browser preview of the PageTurner Welcome Email & Reader Passport
// @access  Public
router.get('/email/preview', (req, res) => {
  const username = req.query.username || 'Alex Rivera';
  const email = req.query.email || 'alex.rivera@example.com';
  const memberId = req.query.memberId || generateMemberId(username);

  const emailHtml = generateWelcomeEmailHtml({
    username,
    email,
    memberId,
    frontendUrl: 'http://localhost:5173',
  });

  // If ?raw=true, return pure HTML for testing/crawlers
  if (req.query.raw === 'true') {
    return res.setHeader('Content-Type', 'text/html').send(emailHtml);
  }

  // Wrap in a sleek interactive inspector frame
  const inspectorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PageTurner — Welcome Email & Reader Passport Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #1C1917;
      color: #FAF7F2;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .top-inspector {
      background: #292524;
      border-bottom: 1px solid #44403C;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: #7B1826;
      color: #FFF;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 999px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 700;
    }
    .meta-pills {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      color: #A8A29E;
    }
    .meta-pills strong { color: #FAF7F2; }
    .controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #57534E;
      background: #3A3533;
      color: #FAF7F2;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn:hover {
      background: #44403C;
      border-color: #78716C;
    }
    .btn-primary {
      background: #7B1826;
      border-color: #962334;
      color: #FFF;
    }
    .btn-primary:hover {
      background: #8E1C2C;
    }
    .preview-canvas {
      flex: 1;
      padding: 32px 16px;
      display: flex;
      justify-content: center;
      background: radial-gradient(circle at 50% 10%, #2A2421 0%, #151312 100%);
    }
    .preview-frame-wrap {
      width: 100%;
      max-width: 680px;
      transition: max-width 0.3s ease;
    }
    .preview-frame-wrap.mobile {
      max-width: 390px;
    }
    iframe {
      width: 100%;
      height: 980px;
      border: 1px solid #44403C;
      border-radius: 16px;
      background: #FAF7F2;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
  </style>
</head>
<body>
  <header class="top-inspector">
    <div class="brand-group">
      <span class="badge">Live Preview</span>
      <h1 class="title">Welcome Email &amp; Reader Passport</h1>
    </div>

    <div class="meta-pills">
      <span>To: <strong>${username}</strong> (&lt;${email}&gt;)</span>
      <span>•</span>
      <span>ID: <strong style="color: #F8E8CD;">${memberId}</strong></span>
    </div>

    <div class="controls">
      <button class="btn" id="toggleView" onclick="toggleViewport()">📱 Mobile View</button>
      <a href="/auth/email/preview?raw=true&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}" target="_blank" class="btn">↗ Open Raw HTML</a>
      <button class="btn btn-primary" onclick="sendTestEmail()">✉️ Send to My Email</button>
    </div>
  </header>

  <main class="preview-canvas">
    <div class="preview-frame-wrap" id="frameWrap">
      <iframe src="/auth/email/preview?raw=true&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&memberId=${encodeURIComponent(memberId)}" title="Email Live Preview"></iframe>
    </div>
  </main>

  <script>
    let isMobile = false;
    function toggleViewport() {
      isMobile = !isMobile;
      const wrap = document.getElementById('frameWrap');
      const btn = document.getElementById('toggleView');
      if (isMobile) {
        wrap.classList.add('mobile');
        btn.textContent = '💻 Desktop View';
      } else {
        wrap.classList.remove('mobile');
        btn.textContent = '📱 Mobile View';
      }
    }

    async function sendTestEmail() {
      const target = prompt('Enter the destination email address to receive this live welcome email:', '${email}');
      if (!target) return;
      try {
        const res = await fetch('/auth/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: target, username: '${username}' })
        });
        const data = await res.json();
        if (data.success) {
          alert('✅ Welcome email dispatched successfully to ' + target + '! Check your inbox.');
        } else {
          alert('❌ Error dispatching email: ' + (data.error || data.message || 'Unknown error'));
        }
      } catch (e) {
        alert('❌ Network error: ' + e.message);
      }
    }
  </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html').send(inspectorHtml);
});

// @route   GET /auth/email/login-preview
// @desc    Live browser preview of the PageTurner Login Notification Email
// @access  Public
router.get('/email/login-preview', (req, res) => {
  const username = req.query.username || 'Alex Rivera';
  const email = req.query.email || 'alex.rivera@example.com';
  const ip = req.query.ip || '192.168.1.42';
  const userAgent = req.headers['user-agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';

  const emailHtml = generateLoginNotificationEmailHtml({
    username,
    email,
    ip,
    userAgent,
    frontendUrl: 'http://localhost:5173',
  });

  res.setHeader('Content-Type', 'text/html').send(emailHtml);
});

// @route   POST /auth/send-welcome-email
// @desc    Dispatch or resend official welcome package to any specified email
// @access  Public
router.post('/send-welcome-email', async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Target email address is required' });
    }

    const recipientUsername = username || email.split('@')[0];
    const result = await sendWelcomeEmail(email.trim(), recipientUsername.trim());

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Official Welcome Package dispatched to ${email}`,
        messageId: result.messageId,
        memberId: result.memberId,
        previewUrl: result.previewUrl,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Could not send welcome email',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('[Auth API] send-welcome-email error:', error);
    res.status(500).json({ success: false, message: 'Server error sending email', error: error.message });
  }
});

// @route   POST /auth/send-login-alert
// @desc    Dispatch a sample or live session security login alert
// @access  Public
router.post('/send-login-alert', async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Target email address is required' });
    }

    const recipientUsername = username || email.split('@')[0];
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Mozilla/5.0';

    const result = await sendLoginNotificationEmail(email.trim(), recipientUsername.trim(), {
      ip,
      userAgent,
      frontendUrl: 'http://localhost:5173',
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Session security notification dispatched to ${email}`,
        messageId: result.messageId,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Could not send session security notification',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('[Auth API] send-login-alert error:', error);
    res.status(500).json({ success: false, message: 'Server error sending alert email', error: error.message });
  }
});

// @route   POST /auth/forgot-password
// @desc    Initiate password reset flow & dispatch reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      // Security standard: don't reveal if user exists, but give clear response
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      });
    }

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Dispatch reset email asynchronously
    sendPasswordResetEmail(user.email, user.username, resetToken);

    res.status(200).json({
      success: true,
      message: `A password reset link has been dispatched to ${user.email}.`,
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    console.error('[Auth API] forgot-password error:', error);
    res.status(500).json({ message: 'Server error processing password reset request' });
  }
});

// @route   POST /auth/reset-password
// @desc    Verify reset token & update user password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ message: 'Password must be at least 5 characters long' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`[Auth API] ✅ Password reset successfully for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully! You may now sign in with your new password.',
    });
  } catch (error) {
    console.error('[Auth API] reset-password error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// @route   GET /auth/email/reset-preview
// @desc    Live browser preview of the Password Reset Email
// @access  Public
router.get('/email/reset-preview', (req, res) => {
  const username = req.query.username || 'Alex Rivera';
  const email = req.query.email || 'alex.rivera@example.com';
  const token = req.query.token || 'demo_secure_reset_token_68294';

  const emailHtml = generatePasswordResetEmailHtml({
    username,
    email,
    resetToken: token,
    frontendUrl: 'http://localhost:5173',
  });

  res.setHeader('Content-Type', 'text/html').send(emailHtml);
});

export default router;
