# <h1 align='center'> CleanEase - Frontend </h1>

CleanEase is a full-stack web application designed to streamline and enhance the booking of cleaning services. It provides an intuitive and responsive interface for users to explore, filter, and schedule cleaning services based on their preferences. The platform also includes secure payment processing, user authentication, and role-based access control.

---

## 📸 Screenshots

<style>
  .screenshot-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
  .screenshot-grid img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .screenshot-grid img:hover {
    transform: scale(1.05);
  }
</style>

### 👤 User Pages

<div class="screenshot-grid">
  <a href="public/screenshots/User/home.png" target="_blank">
    <img src="public/screenshots/User/home.png" alt="Home Page">
  </a>
  <a href="public/screenshots/User/signin.png" target="_blank">
    <img src="public/screenshots/User/signin.png" alt="Sign In">
  </a>
  <a href="public/screenshots/User/signup.png" target="_blank">
    <img src="public/screenshots/User/signup.png" alt="Sign Up">
  </a>
  <a href="public/screenshots/User/google-signin.png" target="_blank">
    <img src="public/screenshots/User/google-signin.png" alt="Sign Up with Google">
  </a>
  <a href="public/screenshots/User/user-profile.png" target="_blank">
    <img src="public/screenshots/User/user-profile.png" alt="User Profile">
  </a>
  <a href="public/screenshots/User/user-address.png" target="_blank">
    <img src="public/screenshots/User/user-address.png" alt="User Address">
  </a>
  <a href="public/screenshots/User/services.png" target="_blank">
    <img src="public/screenshots/User/services.png" alt="Services Listing">
  </a>
  <a href="public/screenshots/User/service-details.png" target="_blank">
    <img src="public/screenshots/User/service-details.png" alt="Service Details">
  </a>
  <a href="public/screenshots/User/cart.png" target="_blank">
    <img src="public/screenshots/User/cart.png" alt="Cart">
  </a>
  <a href="public/screenshots/User/checkout-address.png" target="_blank">
    <img src="public/screenshots/User/checkout-address.png" alt="Checkout Address">
  </a>
  <a href="public/screenshots/User/checkout-slot.png" target="_blank">
    <img src="public/screenshots/User/checkout-slot.png" alt="Checkout Slot">
  </a>
  <a href="public/screenshots/User/checkout-summary.png" target="_blank">
    <img src="public/screenshots/User/checkout-summary.png" alt="Checkout Summary">
  </a>
</div>

---

### 🚧 Error Page

<div class="screenshot-grid">
  <a href="public/screenshots/page-not-found.png" target="_blank">
    <img src="public/screenshots/page-not-found.png" alt="404 Page Not Found">
  </a>
</div>

---

### 🛠 Admin Panel

<div class="screenshot-grid">
  <a href="public/screenshots/Admin/admin-dashboard.png" target="_blank">
    <img src="public/screenshots/Admin/admin-dashboard.png" alt="Admin Dashboard">
  </a>
  <a href="public/screenshots/Admin/admin-orders.png" target="_blank">
    <img src="public/screenshots/Admin/admin-orders.png" alt="Admin Orders">
  </a>
  <a href="public/screenshots/Admin/admin-reviews.png" target="_blank">
    <img src="public/screenshots/Admin/admin-reviews.png" alt="Admin Reviews">
  </a>
  <a href="public/screenshots/Admin/admin-services.png" target="_blank">
    <img src="public/screenshots/Admin/admin-services.png" alt="Admin Services">
  </a>
  <a href="public/screenshots/Admin/admin-transactions.png" target="_blank">
    <img src="public/screenshots/Admin/admin-transactions.png" alt="Admin Transactions">
  </a>
  <a href="public/screenshots/Admin/admin-users.png" target="_blank">
    <img src="public/screenshots/Admin/admin-users.png" alt="Admin Users">
  </a>
</div>

---

## 🔍 Features

### 🎨 Frontend Features

- ✨ **User Authentication**: Login and registration using Firebase authentication.
- 🔄 **Dynamic UI**: Built with React for an interactive experience.
- ⚙️ **Filtering & Search**: Find services by availability, timing, and budget.
- 🏠 **Personalized Checklists**: Users can create and manage their own cleaning checklists.
- ⏳ **Booking System**: One-time and recurring appointments.
- 💳 **Secure Payments**: Integrated with Stripe for seamless transactions.
- 📲 **Reminders & Notifications**: Dashboard popups for upcoming appointments.
- 🌟 **Reviews & Ratings**: Users can leave feedback on services.

### 🛠️ Backend Features

- 🛠 **RESTful API**: Built with Node.js and Express.js.
- 📚 **Database Management**: MongoDB for storing user data, services, and orders.
- 🔒 **Security**: JWT authentication & Bcrypt password hashing.
- 🔐 **Role-Based Access**: Admin and user access control.
- ✅ **Order Management**: Admins can view, manage, and update service bookings.

---

## 🌐 Technologies Used

### 💻 Frontend

- ✨ **React.js**
- 👉 Redux Toolkit (State Management)
- 🔍 React Router Dom (Client-side Routing)
- 🎨 Flowbite React (UI Components)
- 🖌️ Tailwind CSS (Styling)
- 📜 Formik & Yup (Form Validation)
- 💳 Stripe API (Payment Processing)
- 🛠 Firebase (User Authentication)
- 🎉 React Toastify (Notifications)

### 🚀 Backend

- 🌟 Node.js
- 🛠 Express.js
- 📚 MongoDB (Mongoose ODM)
- 🔐 JSON Web Token (JWT) Authentication
- 🔑 Bcrypt (Password Hashing)
- 💳 Stripe (Payment Integration)

---

## 🛠️ Getting Started

### ⚡ Prerequisites

Ensure you have the following installed:

- 💻 **Node.js** (LTS Version)
- 📂 **MongoDB** (Locally or Atlas)
- 🐳 **Git**

### ⏳ Installation

#### 📚 Clone the Repositories

```bash
# Frontend
git clone https://github.com/Yogadeepan29/CAPSTONE--CleanEase_Frontend.git

# Backend
git clone https://github.com/Yogadeepan29/CAPSTONE--CleanEase_Backend.git
```

#### 🚀 Frontend Setup

```bash
cd CleanEase-frontend
npm install
npm run dev
```

#### 🚀 Backend Setup

```bash
cd CleanEase-backend
npm install
npm start
```

---

## File Structure

### Frontend

```
CAPSTONE-CleanEase-(FRONTEND)/
├── 📜 .env
├── 🚫 .gitignore
├── 📂 dist/
├── ⚙️ eslint.config.js
├── 📝 index.html
├── 🌍 netlify.toml
├── 📜 package-lock.json
├── 📜 package.json
├── 🎨 postcss.config.js
├── 📂 public/
├── 📖 README.md
├── 📂 src/
│   ├── 🔧 apiConfig.js
│   ├── 🎨 App.css
│   ├── ⚛️ App.jsx
│   ├── 📁 Components/
│   │   ├── 🏗️ AddServiceModal.jsx
│   │   ├── 🖥️ AdminLayout.jsx
│   │   ├── 📊 AdminSidebar.jsx
│   │   ├── ⭐ CustomerReviews.jsx
│   │   ├── 🏠 DashboardAddress.jsx
│   │   ├── 👤 DashboardProfile.jsx
│   │   ├── 📊 DashboardSidebar.jsx
│   │   ├── ✏️ EditServiceModal.jsx
│   │   ├── 🔍 Filter.jsx
│   │   ├── 🚀 Footer.jsx
│   │   ├── 🏠 Header.jsx
│   │   ├── 🔑 OAuth.jsx
│   │   ├── 🔒 OnlyAdminPrivateRoute.jsx
│   │   ├── 🔒 PrivateRoute.jsx
│   │   ├── 🎨 ThemeProvider.jsx
│   ├── 🔥 firebase.js
│   ├── 🎨 index.css
│   ├── ⚛️ main.jsx
│   ├── 📁 Pages/
│   │   ├── 🛠️ Admin/
│   │   │   ├── 📊 AdminDashboard.jsx
│   │   │   ├── 📋 AdminOrders.jsx
│   │   │   ├── ⭐ AdminReviews.jsx
│   │   │   ├── 🛠️ AdminServices.jsx
│   │   │   ├── 💰 AdminTransaction.jsx
│   │   │   ├── 👥 AdminUsers.jsx
│   │   ├── 🚧 Common/
│   │   │   ├── ⚠️ PageNotFound.jsx
│   │   ├── 👤 User/
│   │   │   ├── ❌ Cancel.jsx
│   │   │   ├── 🛒 Cart.jsx
│   │   │   ├── 📦 CheckoutAddress.jsx
│   │   │   ├── ⏳ CheckoutSlot.jsx
│   │   │   ├── 📜 CheckoutSummary.jsx
│   │   │   ├── 🏠 Home.jsx
│   │   │   ├── 📦 Order.jsx
│   │   │   ├── 🧼 ServiceDetails.jsx
│   │   │   ├── 🛠️ Services.jsx
│   │   │   ├── 🔑 Signin.jsx
│   │   │   ├── 🆕 Signup.jsx
│   │   │   ├── ✅ Success.jsx
│   │   │   ├── 🏠 UserDashboard.jsx
│   ├── 🎯 Redux/
│   │   ├── ⚡ Slice/
│   │   │   ├── 🛒 cartSlice.jsx
│   │   │   ├── 📦 orderSlice.jsx
│   │   │   ├── 🛠️ servicesSlice.jsx
│   │   │   ├── 🎨 themeSlice.jsx
│   │   │   ├── 👤 userSlice.jsx
│   │   ├── 🗄️ Store.jsx
├── 🎨 tailwind.config.js
├── ⚡ vite.config.js

```

## 🏷️ Deployment

- **Frontend:** Deployed on Netlify → [Live Demo](https://ryd-cleanease.netlify.app/)
- **Backend:** Deployed on Render → [API](https://capstone-cleanease-backend.onrender.com)

---

## 🧪 Testing Information

### 🎭 Demo User Credentials

- **User Login**
  - Email: `test1@test.com`
  - Password: `qwerty`

- **Admin Login**
  - Email: `admin@admin.com`
  - Password: `qwerty@123`  

### 💳 Stripe Test Card Details
Use the following test card details for payment:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry Date**: `12/34`
- **CVC**: `123`
- **ZIP Code**: Any 5-digit number

---

## 👤 Author

**YOGADEEPAN.R**

---
