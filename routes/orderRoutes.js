const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');
const Order = require('../models/Order');
const sendEmail = require('../utils/emailSender');

// ✅ Create order from cart
router.post('/order/create', auth, async (req, res) => {
  const { paymentMethod } = req.body;
  const user = await User.findById(req.user.userId).populate('cart.product');

  if (!user.cart.length) return res.status(400).json({ error: 'Cart is empty' });

  const newOrder = new Order({
    user: user._id,
    items: user.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    })),
    paymentMethod: paymentMethod || 'COD'
  });

  await newOrder.save();

  // Clear user's cart
  user.cart = [];
  await user.save();

  res.status(201).json({ message: 'Order placed successfully', order: newOrder });
});

// ✅ Get current user's orders
router.get('/order/my-orders', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.userId }).populate('items.product');
  res.json(orders);
});

// ✅ Admin: Get all orders
router.get('/order/all', auth, isAdmin, async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product');
  res.json(orders);
});

// // ✅ Admin: Update order status
// router.put('/order/update-status/:orderId', auth, isAdmin, async (req, res) => {
//   const { status } = req.body;
//   const order = await Order.findById(req.params.orderId);
//   if (!order) return res.status(404).json({ error: 'Order not found' });

//   order.status = status;
//   await order.save();

//   res.json({ message: 'Order status updated', order });
// });


router.put('/order/update-status/:orderId', auth, isAdmin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.orderId).populate('user');

  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  await order.save();

  // ✅ Send email to the user
  await sendEmail(order.user.email, status, order._id.toString());
  console.log(`Email sent to ${order.user.email} from ${process.env.EMAIL_USER} `);
  

  res.json({ message: 'Order status updated and email sent', order });
});


module.exports = router;
