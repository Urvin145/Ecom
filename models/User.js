// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  cart: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }
  ],
  wishlist: [
  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
  role: { type: String, default: 'user' } // 'admin' or 'user'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
