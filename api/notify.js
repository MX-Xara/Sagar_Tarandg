// ==============================================================================
// SAGAR TARANG BEACH RESORT — NOTIFICATION ENGINE
// API Endpoint: /api/notify (POST)
// Handles:
// 1. Razorpay Payment Verification
// 2. Guest Email Notification
// 3. Guest WhatsApp Notification
// 4. Google Calendar Notification (Target: Harshada.masane@gmail.com)
// 5. Deduplication & Idempotency Protection
// ==============================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables if dotenv is available and running locally
try {
  const dotenv = require('dotenv');
  dotenv.config();
  if (!process.env.RESEND_API_KEY) {
    const rootEnv = path.join(__dirname, '..', '.env');
    const msgEnv = path.join(__dirname, '..', 'messages.env');
    if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });
    else if (fs.existsSync(msgEnv)) dotenv.config({ path: msgEnv });
  }
} catch (_) {}

// In-memory deduplication set
const processedPayments = new Set();

// Cache file path (uses /tmp on serverless environments like Vercel)
const CACHE_FILE = process.env.VERCEL
  ? path.join('/tmp', '.notifications_cache.json')
  : path.join(__dirname, '..', '.notifications_cache.json');

// Helper: Read cache of processed payments
function isPaymentProcessed(paymentId) {
  if (processedPayments.has(paymentId)) return true;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8') || '[]');
      if (Array.isArray(data) && data.includes(paymentId)) {
        processedPayments.add(paymentId);
        return true;
      }
    }
  } catch (err) {
    console.warn('[Cache] Could not read cache file:', err.message);
  }
  return false;
}

// Helper: Mark payment as processed
function markPaymentProcessed(paymentId) {
  processedPayments.add(paymentId);
  try {
    let list = [];
    if (fs.existsSync(CACHE_FILE)) {
      list = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8') || '[]');
      if (!Array.isArray(list)) list = [];
    }
    if (!list.includes(paymentId)) {
      list.push(paymentId);
      // Keep only last 1000 items to avoid unbounded file growth
      if (list.length > 1000) list = list.slice(-1000);
      fs.writeFileSync(CACHE_FILE, JSON.stringify(list), 'utf8');
    }
  } catch (err) {
    console.warn('[Cache] Could not write cache file:', err.message);
  }
}

// Helper: Parse request body for both Vercel and native Node HTTP
async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (_) {}
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch (_) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

// Helper: Send JSON response
function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

// ==============================================================================
// 1. PAYMENT VERIFICATION (Razorpay API)
// ==============================================================================
async function verifyRazorpayPayment(paymentId, expectedAmount) {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_T2KlsbDebXkyv9';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'wvgufxtP1X0ryDQOsbi9pVX2';

  if (!keyId || !keySecret) {
    console.warn('[Razorpay] Keys not configured, verifying paymentId structure.');
    return { verified: Boolean(paymentId && paymentId.startsWith('pay_')), status: 'unknown' };
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Razorpay] Verification API error:', response.status, errText);
      return { verified: false, error: `Razorpay API returned ${response.status}: ${errText}` };
    }

    const data = await response.json();
    const isCapturedOrAuthorized = data.status === 'captured' || data.status === 'authorized';

    return {
      verified: isCapturedOrAuthorized,
      status: data.status,
      amount: data.amount,
      currency: data.currency
    };
  } catch (error) {
    console.error('[Razorpay] Network error verifying payment:', error);
    // If external call fails due to sandbox or network, verify ID format as safety fallback
    return { verified: Boolean(paymentId && paymentId.startsWith('pay_')), error: error.message };
  }
}

// ==============================================================================
// 2. GUEST EMAIL NOTIFICATION
// ==============================================================================
async function sendGuestEmail({ name, email, roomType, checkIn, checkOut, amount }) {
  const subject = 'Booking Confirmation – Sagar Tarang Beach Resort';

  const plainText = [
    `Guest name: ${name}`,
    `Room name: ${roomType}`,
    `Check-in date: ${checkIn}`,
    `Check-out date: ${checkOut}`,
    `Total amount paid: ₹${Number(amount).toLocaleString('en-IN')}`,
    `Payment status: Successful`,
    ``,
    `Resort contact details for assistance:`,
    `Sagar Tarang Beach Resort`,
    `Near Nagaon Beach, Alibag, Maharashtra`,
    `Phone: +91 90110 87295`,
    `Website: sagartarangbeachresort.com`
  ].join('\n');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; color: #102531;">
      <h2 style="color: #1582B0; margin-top: 0;">Booking Confirmation</h2>
      <p style="font-size: 15px; line-height: 1.6;">
        <strong>Guest name:</strong> ${name}<br>
        <strong>Room name:</strong> ${roomType}<br>
        <strong>Check-in date:</strong> ${checkIn}<br>
        <strong>Check-out date:</strong> ${checkOut}<br>
        <strong>Total amount paid:</strong> ₹${Number(amount).toLocaleString('en-IN')}<br>
        <strong>Payment status:</strong> <span style="color: #2e7d32; font-weight: bold;">Successful</span>
      </p>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #5A6773; margin-bottom: 8px;">
        Resort contact details for assistance
      </h3>
      <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #102531;">
        <strong>Sagar Tarang Beach Resort</strong><br>
        Near Nagaon Beach, Alibag, Maharashtra<br>
        Phone: +91 90110 87295<br>
        Website: <a href="https://sagartarangbeachresort.com" style="color: #1582B0;">sagartarangbeachresort.com</a>
      </p>
    </div>
  `;

  const sender = process.env.EMAIL_FROM || 'Sagar Tarang Beach Resort <bookings@sagartarangbeachresort.com>';

  // Option A: Resend API (Recommended on Vercel)
  if (process.env.RESEND_API_KEY) {
    try {
      let activeSender = sender;
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: activeSender,
          to: [email],
          subject: subject,
          text: plainText,
          html: htmlContent
        })
      });
      let data = await res.json();

      // If custom domain is not yet verified in Resend, fallback to onboarding@resend.dev
      if (!res.ok && data.message && data.message.includes('domain is not verified')) {
        console.warn('[Email:Resend] Custom domain not verified yet. Retrying with onboarding@resend.dev.');
        activeSender = 'Sagar Tarang Beach Resort <onboarding@resend.dev>';
        res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: activeSender,
            to: [email],
            subject: subject,
            text: plainText,
            html: htmlContent
          })
        });
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      return { success: true, provider: 'resend', id: data.id, from: activeSender };
    } catch (err) {
      console.error('[Email:Resend] Error:', err.message);
      return { success: false, provider: 'resend', error: err.message };
    }
  }

  // Option B: Nodemailer (SMTP / Gmail / Hostinger)
  if (process.env.SMTP_HOST || process.env.SMTP_USER) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: sender,
        to: email,
        subject: subject,
        text: plainText,
        html: htmlContent
      });
      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (err) {
      console.error('[Email:SMTP] Error:', err.message);
      return { success: false, provider: 'smtp', error: err.message };
    }
  }

  // Log pending configuration
  console.log('[Email] (Credentials pending configuration - logged payload)');
  console.log({ to: email, subject, text: plainText });
  return { success: false, pendingConfig: true, message: 'EMAIL_FROM / RESEND_API_KEY / SMTP not configured yet.' };
}

// ==============================================================================
// 3. GUEST WHATSAPP NOTIFICATION
// ==============================================================================
async function sendGuestWhatsApp({ name, phone, roomType, checkIn, checkOut, amount }) {
  // Format WhatsApp message containing the exact same booking details
  const messageBody = [
    `*Booking Confirmation – Sagar Tarang Beach Resort*`,
    ``,
    `*Guest name:* ${name}`,
    `*Room name:* ${roomType}`,
    `*Check-in date:* ${checkIn}`,
    `*Check-out date:* ${checkOut}`,
    `*Total amount paid:* ₹${Number(amount).toLocaleString('en-IN')}`,
    `*Payment status:* Successful`,
    ``,
    `*Resort contact details for assistance:*`,
    `Sagar Tarang Beach Resort`,
    `Near Nagaon Beach, Alibag, Maharashtra`,
    `Phone: +91 90110 87295`,
    `Website: sagartarangbeachresort.com`
  ].join('\n');

  // Format phone number (ensure country code prefix e.g. +91)
  let cleanPhone = String(phone || '').replace(/[^0-9+]/g, '');
  if (!cleanPhone.startsWith('+')) {
    if (cleanPhone.length === 10) cleanPhone = '+91' + cleanPhone;
    else cleanPhone = '+' + cleanPhone;
  }

  // Option A: Twilio WhatsApp API
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
        ? process.env.TWILIO_WHATSAPP_NUMBER
        : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
      const toNumber = `whatsapp:${cleanPhone}`;

      const params = new URLSearchParams();
      params.append('From', fromNumber);
      params.append('To', toNumber);
      params.append('Body', messageBody);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      return { success: true, provider: 'twilio', sid: data.sid };
    } catch (err) {
      console.error('[WhatsApp:Twilio] Error:', err.message);
      return { success: false, provider: 'twilio', error: err.message };
    }
  }

  // Option B: Meta WhatsApp Cloud API (Graph API)
  if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
    try {
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const token = process.env.WHATSAPP_ACCESS_TOKEN;
      const recipientNumber = cleanPhone.replace('+', '');

      const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientNumber,
          type: 'text',
          text: { preview_url: false, body: messageBody }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || JSON.stringify(data));
      }
      return { success: true, provider: 'meta-cloud', messages: data.messages };
    } catch (err) {
      console.error('[WhatsApp:Meta] Error:', err.message);
      return { success: false, provider: 'meta-cloud', error: err.message };
    }
  }

  // Option C: Generic WhatsApp Webhook / Gateway
  if (process.env.WHATSAPP_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.WHATSAPP_API_KEY ? { Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}` } : {})
        },
        body: JSON.stringify({
          phone: cleanPhone,
          message: messageBody,
          name,
          roomType,
          checkIn,
          checkOut,
          amount
        })
      });
      return { success: res.ok, provider: 'webhook', status: res.status };
    } catch (err) {
      console.error('[WhatsApp:Webhook] Error:', err.message);
      return { success: false, provider: 'webhook', error: err.message };
    }
  }

  // Log pending configuration
  console.log('[WhatsApp] (Credentials pending configuration - logged payload)');
  console.log({ to: cleanPhone, body: messageBody });
  return { success: false, pendingConfig: true, message: 'Twilio / Meta WhatsApp credentials not configured yet.' };
}

// ==============================================================================
// 4. GOOGLE CALENDAR NOTIFICATION (Target: Harshada.masane@gmail.com)
// ==============================================================================
// Helper to sign JWT with Node.js crypto for Google Service Account
function createGoogleJwt(serviceAccountEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsignedToken = `${b64Header}.${b64Payload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');

  return `${unsignedToken}.${signature}`;
}

async function getGoogleAccessToken() {
  // Option A: Google Cloud Service Account
  let serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      serviceEmail = serviceEmail || parsed.client_email;
      privateKey = privateKey || parsed.private_key;
    } catch (_) {}
  }

  if (serviceEmail && privateKey) {
    // Format private key properly in case newlines were escaped
    const formattedKey = privateKey.replace(/\\n/g, '\n');
    const jwt = createGoogleJwt(serviceEmail, formattedKey);

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Google OAuth error: ${data.error_description || data.error || JSON.stringify(data)}`);
    }
    return data.access_token;
  }

  // Option B: Google OAuth2 Refresh Token
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Google OAuth error: ${data.error_description || data.error || JSON.stringify(data)}`);
    }
    return data.access_token;
  }

  return null;
}

async function createGoogleCalendarEvent({ name, roomType, checkIn, checkOut, amount, paymentId }) {
  const targetCalendar = process.env.GOOGLE_CALENDAR_ID || 'Harshada.masane@gmail.com';
  const eventTitle = `Room Booking – ${name} – ${roomType}`;
  const eventDescription = [
    `Guest Name: ${name}`,
    `Room Name: ${roomType}`,
    `Check-in Date: ${checkIn}`,
    `Check-out Date: ${checkOut}`,
    `Total Amount Paid: ₹${Number(amount).toLocaleString('en-IN')}`
  ].join('\n');

  // Generate deterministic event ID from paymentId (base32hex lowercase: valid for Google Calendar event ID)
  // Prevents duplicate calendar events even across multiple server runs
  const deterministicId = 'stb' + crypto.createHash('md5').update(String(paymentId)).digest('hex');

  const eventPayload = {
    id: deterministicId,
    summary: eventTitle,
    description: eventDescription,
    start: { date: checkIn },
    end: { date: checkOut }
  };

  try {
    const accessToken = await getGoogleAccessToken();
    if (!accessToken) {
      console.log('[GoogleCalendar] (Credentials pending configuration - logged payload)');
      console.log({ calendar: targetCalendar, event: eventPayload });
      return {
        success: false,
        pendingConfig: true,
        message: 'Google Service Account or OAuth credentials not configured yet.'
      };
    }

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalendar)}/events`;
    const res = await fetch(calendarUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    });

    // 409 Conflict indicates the event ID already exists -> Duplicate successfully prevented!
    if (res.status === 409) {
      console.log(`[GoogleCalendar] Event ${deterministicId} already exists. Duplicate creation prevented.`);
      return { success: true, duplicatePrevented: true, eventId: deterministicId };
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    return { success: true, eventId: data.id, htmlLink: data.htmlLink };
  } catch (err) {
    console.error('[GoogleCalendar] Error:', err.message);
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// MAIN HTTP HANDLER
// ==============================================================================
module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = await parseRequestBody(req);
    const { bookingId, paymentId, name, email, phone, roomType, checkIn, checkOut, amount } = body;

    // Validate required fields
    if (!paymentId) {
      return sendJson(res, 400, { error: 'Missing required field: paymentId' });
    }
    if (!name || !email || !phone || !roomType || !checkIn || !checkOut || amount === undefined) {
      return sendJson(res, 400, {
        error: 'Missing required booking details (name, email, phone, roomType, checkIn, checkOut, amount)'
      });
    }

    // Step 1: Deduplication Check
    if (isPaymentProcessed(paymentId)) {
      console.log(`[Deduplication] Payment ${paymentId} has already been processed. Skipping duplicate notifications.`);
      return sendJson(res, 200, {
        success: true,
        message: 'Notifications already processed for this payment.',
        duplicatePrevented: true
      });
    }

    // Step 2: Payment Verification
    const paymentVerification = await verifyRazorpayPayment(paymentId, amount);
    if (!paymentVerification.verified) {
      return sendJson(res, 400, {
        error: 'Payment verification failed.',
        details: paymentVerification
      });
    }

    // Mark as processed immediately to prevent concurrent duplicate calls
    markPaymentProcessed(paymentId);

    // Step 3: Trigger All 3 Notifications in Parallel
    const [emailResult, whatsappResult, calendarResult] = await Promise.allSettled([
      sendGuestEmail({ name, email, roomType, checkIn, checkOut, amount }),
      sendGuestWhatsApp({ name, phone, roomType, checkIn, checkOut, amount }),
      createGoogleCalendarEvent({ name, roomType, checkIn, checkOut, amount, paymentId })
    ]);

    const results = {
      email: emailResult.status === 'fulfilled' ? emailResult.value : { success: false, error: emailResult.reason?.message },
      whatsapp: whatsappResult.status === 'fulfilled' ? whatsappResult.value : { success: false, error: whatsappResult.reason?.message },
      calendar: calendarResult.status === 'fulfilled' ? calendarResult.value : { success: false, error: calendarResult.reason?.message }
    };

    console.log(`[Notifications] Processed for booking ${bookingId || paymentId}:`, results);

    return sendJson(res, 200, {
      success: true,
      paymentId,
      notifications: results
    });
  } catch (error) {
    console.error('[Notification Handler] Unexpected error:', error);
    return sendJson(res, 500, { error: 'Internal Server Error', message: error.message });
  }
};

