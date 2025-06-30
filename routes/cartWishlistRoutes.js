const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// ------------------ CART ------------------

// ✅ Add to cart
router.post('/cart/add', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user.userId);

  const existing = user.cart.find(item => item.product.toString() === productId);

  if (existing) {
    existing.quantity += quantity || 1;
  } else {
    user.cart.push({ product: productId, quantity: quantity || 1 });
  }

  await user.save();
  res.json({ message: 'Product added to cart', cart: user.cart });
});

// ✅ Remove from cart
router.post('/cart/remove', auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.userId);

  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();

  res.json({ message: 'Product removed from cart', cart: user.cart });
});

// ✅ Get cart
router.get('/cart', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('cart.product');
  res.json(user.cart);
});


// ------------------ WISHLIST ------------------

// ✅ Add to wishlist
router.post('/wishlist/add', auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.userId);

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  res.json({ message: 'Product added to wishlist', wishlist: user.wishlist });
});

// ✅ Remove from wishlist
router.post('/wishlist/remove', auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.userId);

  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();

  res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
});

// ✅ Get wishlist
router.get('/wishlist', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('wishlist');
  res.json(user.wishlist);
});

module.exports = router;
