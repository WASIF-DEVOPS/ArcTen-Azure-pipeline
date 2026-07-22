const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const QuoteRequest = require('./models/QuoteRequest');

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. Prevent NoSQL Injection
app.use(mongoSanitize());

// 3. CORS Configuration (Removed unneeded ngrok origins)
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean),
  credentials: true,
}));

app.use(express.json());

// 4. Rate Limiter for Login Endpoint (Max 10 requests per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5. Rate Limiter for Quote Submissions (Max 5 quote requests per hour)
const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Quote request limit reached. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send Quote Notification Email
async function sendQuoteNotificationEmail(quote) {
  try {
    const templatePath = path.join(__dirname, 'templates', 'quote-notification.ejs');
    const html = await ejs.renderFile(templatePath, {
      quote,
      adminUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    });

    await transporter.sendMail({
      from: `"ARCTen Quotes" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Quote Request from ${quote.companyName}`,
      html,
    });

    console.log('Quote notification email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Login Route (Protected with Rate Limiter & Bcrypt)
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = process.env.ADMIN_PASSWORD_HASH 
      ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
      : password === process.env.ADMIN_PASSWORD;

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify Token
app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// Helper function to safely escape regex special characters
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Submit Quote Request (Public - Rate Limited)
app.post('/api/quote-request', quoteLimiter, async (req, res) => {
  try {
    const { companyName, email, phone, productInterest, estimatedQuantity, additionalNotes } = req.body;

    if (!companyName || !email || !phone || !productInterest || !estimatedQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    const quoteRequest = new QuoteRequest({
      companyName,
      email,
      phone,
      productInterest,
      estimatedQuantity,
      additionalNotes,
    });

    await quoteRequest.save();

    // Send email notification to admin
    sendQuoteNotificationEmail(quoteRequest);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully. Our team will contact you within 24 hours.',
      data: { id: quoteRequest._id },
    });
  } catch (error) {
    console.error('Quote request error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
});

// Get all quote requests (Admin - Protected, Paginated, Escaped Regex)
app.get('/api/admin/quotes', authMiddleware, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { companyName: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [quotes, total] = await Promise.all([
      QuoteRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      QuoteRequest.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single quote (Admin - Protected)
app.get('/api/admin/quotes/:id', authMiddleware, async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update quote status (Admin - Protected)
app.patch('/api/admin/quotes/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ 
      success: true, 
      message: 'Quote status updated',
      data: quote,
    });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete quote (Admin - Protected)
app.delete('/api/admin/quotes/:id', authMiddleware, async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id);

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ 
      success: true, 
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get quote stats (Admin - Protected, Single Aggregation Query)
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const statsResult = await QuoteRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await QuoteRequest.countDocuments();
    const statsMap = {
      total,
      new: 0,
      contacted: 0,
      'in-progress': 0,
      quoted: 0,
      closed: 0,
    };

    statsResult.forEach((item) => {
      if (item._id && statsMap.hasOwnProperty(item._id)) {
        statsMap[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      data: statsMap,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ARCTen API running on port ${PORT}`);
});

