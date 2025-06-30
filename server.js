
require('dotenv').config(); // ✅ load variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartWishlistRoutes = require('./routes/cartWishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');


app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/me',authRoutes);
app.use('/all',authRoutes);
app.use('/refresh-token',authRoutes);
app.use('/cart', cartWishlistRoutes);
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
