const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

const QuoteRequest = require('./models/QuoteRequest');

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL,'http://localhost:3001','http://localhost:3000','https://phenomenologically-nontangental-les.ngrok-free.dev'],
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
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

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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

// Submit Quote Request (Public)
app.post('/api/quote-request', async (req, res) => {
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

// Get all quote requests (Admin - Protected)
app.get('/api/admin/quotes', authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        // { email: { $regex: search, $options: 'i' } },
      ];
    }

    const quotes = await QuoteRequest.find(query).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: quotes,
      count: quotes.length,
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

// Get quote stats (Admin - Protected)
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const total = await QuoteRequest.countDocuments();
    const newCount = await QuoteRequest.countDocuments({ status: 'new' });
    const contacted = await QuoteRequest.countDocuments({ status: 'contacted' });
    const inProgress = await QuoteRequest.countDocuments({ status: 'in-progress' });
    const quoted = await QuoteRequest.countDocuments({ status: 'quoted' });
    const closed = await QuoteRequest.countDocuments({ status: 'closed' });

    res.json({
      success: true,
      data: {
        total,
        new: newCount,
        contacted,
        'in-progress': inProgress,
        quoted,
        closed,
      },
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
