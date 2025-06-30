const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');

// 👤 GET /auth/me - Get current user's data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -refreshToken');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 🛡️ GET /auth/all - Admin can view all users
router.get('/all', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.title || '';
    const category = req.query.category || null;
    const priceMin = parseFloat(req.query.priceMin) || 0;
    const priceMax = parseFloat(req.query.priceMax) || Number.MAX_SAFE_INTEGER;
    const sortBy = req.query.sortBy || ''; // name or price
    const sortOrder = req.query.order === 'desc' ? -1 : 1; // asc (default) or desc

    // Build MongoDB query
    let query = {
      name: { $regex: search, $options: 'i' }, // case-insensitive search
      price: { $gte: priceMin, $lte: priceMax }
    };

    if (category) {
      query.category = category;
    }

    // Fetch all matching items first
    const allItems = await Product.find(query);

    // Local sort (since API doesn't support server-side sorting)
    if (sortBy === 'name' || sortBy === 'price') {
      allItems.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    // Paginate manually
    const paginatedItems = allItems.slice(offset, offset + limit);

    res.json({
      items: paginatedItems,
      total: allItems.length
    });

  } catch (err) {
    console.error('Error in /products', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// POST /products - Add a new product
router.post('/',authMiddleware,isAdmin, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = new Product({
      name,
      price,
      description
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/refresh-token
router.post('/refresh-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
});



module.exports = router;
