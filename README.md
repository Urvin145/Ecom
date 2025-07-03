# 🛒 E-Commerce Backend API

A full-featured backend API built using **Node.js**, **Express**, and **MongoDB**, designed for an e-commerce platform with support for **user/admin roles**, **product management**, **cart & wishlist**, **order tracking**, **email notifications**, and more.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based secure login for users and admins.
- Role-based access control using custom middleware.

### 👥 User & Admin Management
- User & admin registration/login.
- Admin can view all users, assign roles, and delete accounts.

### 📦 Product Management (Admin)
- Admin CRUD (Create, Read, Update, Delete) operations on products.
- Update product stock in real-time.

### 📂 Category Management
- Add, view, and delete product categories.
- Filter products by category.

### 🛒 Shopping Cart System
- Each user can manage their cart (add/remove/update).
- Cart is persisted per user in the database.

### ❤️ Wishlist Feature
- Save and remove products from a personal wishlist.

### 📥 Order Management
- Users can place orders directly from their cart.
- Order history with live status tracking: `Pending → Shipped → Delivered`.
- Admin can view and update order statuses.

### ✉️ Email Notifications
- Users get an email when their order status changes.
- Secure Gmail integration using Nodemailer + App Password.

### 🔍 Search, Filter & Sort
- Search products by title.
- Filter by category and price range.
- Local sorting by name and price.

---

## 🧰 Tech Stack

| Layer       | Tech Stack                    |
|-------------|-------------------------------|
| **Backend** | Node.js, Express.js           |
| **Database**| MongoDB, Mongoose             |
| **Auth**    | JWT, bcrypt                   |
| **Email**   | Nodemailer + Gmail App Password |
| **Tools**   | Postman, Dotenv, Nodemon      |

---

## 🔧 Setup & Run

```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-backend.git

# Install dependencies
npm install

# Add environment variables
touch .env
