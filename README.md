# <h1 align='center'> CleanEase - Frontend </h1>

CleanEase is a full-stack web application designed to streamline and enhance the booking of cleaning services. It provides an intuitive and responsive interface for users to explore, filter, and schedule cleaning services based on their preferences. The platform also includes secure payment processing, user authentication, and role-based access control.

---

## 📸 Screenshots

### **👤 User Pages**

<details> <summary>👤 <b>User Pages</b> (Click to Expand)</summary> <table> <tr> <th>Home</th> <th>Sign In</th> <th>Sign Up</th> </tr> <tr> <td><a href="public/screenshots/User/home.png"><img src="public/screenshots/User/home.png" width="200"></a></td> <td><a href="public/screenshots/User/signin.png"><img src="public/screenshots/User/signin.png" width="200"></a></td> <td><a href="public/screenshots/User/signup.png"><img src="public/screenshots/User/signup.png" width="200"></a></td> </tr> </table> <table> <tr> <th>Google Sign In</th> <th>User Profile</th> <th>User Address</th> </tr> <tr> <td><a href="public/screenshots/User/google-signin.png"><img src="public/screenshots/User/google-signin.png" width="200"></a></td> <td><a href="public/screenshots/User/user-profile.png"><img src="public/screenshots/User/user-profile.png" width="200"></a></td> <td><a href="public/screenshots/User/user-address.png"><img src="public/screenshots/User/user-address.png" width="200"></a></td> </tr> </table> <table> <tr> <th>My Orders</th> <th>Order Details</th> <th>Wishlist</th> </tr> <tr> <td><a href="public/screenshots/User/my-orders.png"><img src="public/screenshots/User/my-orders.png" width="200"></a></td> <td><a href="public/screenshots/User/order-details.png"><img src="public/screenshots/User/order-details.png" width="200"></a></td> <td><a href="public/screenshots/User/wishlist.png"><img src="public/screenshots/User/wishlist.png" width="200"></a></td> </tr> </table> </details>

---

### **🚧 Error Page**

<details> <summary>📋 <b>Common Pages</b> (Click to Expand)</summary> <table> <tr> <th>About Us</th> <th>Contact Us</th> <th>Terms & Conditions</th> </tr> <tr> <td><a href="public/screenshots/Common/about-us.png"><img src="public/screenshots/Common/about-us.png" width="200"></a></td> <td><a href="public/screenshots/Common/contact-us.png"><img src="public/screenshots/Common/contact-us.png" width="200"></a></td> <td><a href="public/screenshots/Common/terms-conditions.png"><img src="public/screenshots/Common/terms-conditions.png" width="200"></a></td> </tr> </table> <table> <tr> <th>Privacy Policy</th> <th>FAQ</th> <th>Page Not Found</th> </tr> <tr> <td><a href="public/screenshots/Common/privacy-policy.png"><img src="public/screenshots/Common/privacy-policy.png" width="200"></a></td> <td><a href="public/screenshots/Common/faq.png"><img src="public/screenshots/Common/faq.png" width="200"></a></td> <td><a href="public/screenshots/Common/page-not-found.png"><img src="public/screenshots/Common/page-not-found.png" width="200"></a></td> </tr> </table> </details>

---

### **🛠 Admin Panel**

<details> <summary>🛠 <b>Admin Panel</b> (Click to Expand)</summary> <table> <tr> <th>Dashboard</th> <th>Orders</th> <th>Reviews</th> </tr> <tr> <td><a href="public/screenshots/Admin/admin-dashboard.png"><img src="public/screenshots/Admin/admin-dashboard.png" width="200"></a></td> <td><a href="public/screenshots/Admin/admin-orders.png"><img src="public/screenshots/Admin/admin-orders.png" width="200"></a></td> <td><a href="public/screenshots/Admin/admin-reviews.png"><img src="public/screenshots/Admin/admin-reviews.png" width="200"></a></td> </tr> </table> <table> <tr> <th>Users</th> <th>Products</th> <th>Settings</th> </tr> <tr> <td><a href="public/screenshots/Admin/admin-users.png"><img src="public/screenshots/Admin/admin-users.png" width="200"></a></td> <td><a href="public/screenshots/Admin/admin-products.png"><img src="public/screenshots/Admin/admin-products.png" width="200"></a></td> <td><a href="public/screenshots/Admin/admin-settings.png"><img src="public/screenshots/Admin/admin-settings.png" width="200"></a></td> </tr> </table> </details>

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
