# <h1 align='center'>CleanEase - A Full-Stack Cleaning Service Platform</h1>

CleanEase is a full-stack web application designed to streamline and enhance the booking of cleaning services. It provides an intuitive and responsive interface for users to explore, filter, and schedule cleaning services based on their preferences. The platform also includes secure payment processing, user authentication, and role-based access control.

## Features

### Frontend Features
- **User Authentication:** Login and registration using Firebase authentication.
- **Dynamic UI:** Built with React, featuring a seamless and interactive experience.
- **Filtering & Search:** Users can filter services based on availability, timing, and budget.
- **Personalized Checklists:** Users can create and manage their own cleaning checklists.
- **Booking System:** Users can schedule cleaning services for one-time or recurring appointments.
- **Secure Payments:** Stripe payment integration for seamless transactions.
- **Reminders & Notifications:** Users receive dashboard popup notifications for upcoming appointments.
- **Reviews & Ratings:** Users can leave feedback on services.

### Backend Features
- **RESTful API:** Built with Node.js and Express.js.
- **Database Management:** MongoDB for storing user data, services, and orders.
- **Security:** JWT authentication and Bcrypt password hashing.
- **Role-Based Access:** Middleware for managing user permissions (admin & normal users).
- **Order Management:** Admins can view, manage, and update service bookings.

## Technologies Used

### Frontend
- React.js
- Redux Toolkit (State Management)
- React Router Dom (Client-side Routing)
- Flowbite React (UI Components)
- Tailwind CSS (Styling)
- Formik & Yup (Form Validation)
- Stripe API (Payment Processing)
- Firebase (User Authentication)
- React Toastify (Notifications)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JSON Web Token (JWT) Authentication
- Bcrypt (Password Hashing)
- Stripe (Payment Integration)

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (LTS Version)
- MongoDB (Locally or Atlas)
- Git

### Installation

#### Clone the Repositories
```bash
# Frontend
git clone https://github.com/Yogadeepan29/CAPSTONE--CleanEase_Frontend.git

# Backend
git clone https://github.com/Yogadeepan29/CAPSTONE--CleanEase_Backend.git
```

#### Frontend Setup
```bash
cd CleanEase-frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd CleanEase-backend
npm install
npm start
```

## File Structure

### Frontend
```
CAPSTONE-CleanEase-(FRONTEND)/
├── .env
├── .gitignore
├── dist/
├── eslint.config.js
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
├── README.md
├── src/
│   ├── apiConfig.js
│   ├── App.css
│   ├── App.jsx
│   ├── Components/
│   │   ├── AddServiceModal.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── CustomerReviews.jsx
│   │   ├── DashboardAddress.jsx
│   │   ├── DashboardProfile.jsx
│   │   ├── DashboardSidebar.jsx
│   │   ├── EditServiceModal.jsx
│   │   ├── Filter.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── OAuth.jsx
│   │   ├── OnlyAdminPrivateRoute.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── ThemeProvider.jsx
│   ├── firebase.js
│   ├── index.css
│   ├── main.jsx
│   ├── Pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminReviews.jsx
│   │   │   ├── AdminServices.jsx
│   │   │   ├── AdminTransaction.jsx
│   │   │   ├── AdminUsers.jsx
│   │   ├── Common/
│   │   │   ├── PageNotFound.jsx
│   │   ├── User/
│   │   │   ├── Cancel.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CheckoutAddress.jsx
│   │   │   ├── CheckoutSlot.jsx
│   │   │   ├── CheckoutSummary.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Order.jsx
│   │   │   ├── ServiceDetails.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Signin.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Success.jsx
│   │   │   ├── UserDashboard.jsx
│   ├── Redux/
│   │   ├── Slice/
│   │   │   ├── cartSlice.jsx
│   │   │   ├── orderSlice.jsx
│   │   │   ├── servicesSlice.jsx
│   │   │   ├── themeSlice.jsx
│   │   │   ├── userSlice.jsx
│   │   ├── Store.jsx
├── tailwind.config.js
├── vite.config.js
```

### Backend
```
CAPSTONE-CleanEase-(BACKEND)/
├── .env
├── .gitignore
├── Controllers/
│   ├── authController.js
│   ├── cartController.js
│   ├── checkoutController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   ├── serviceController.js
│   ├── userController.js
│   ├── webhookController.js
├── Database/
│   ├── config.js
│   ├── services.js
├── Middleware/
│   ├── errorMiddleware.js
│   ├── verifyToken.js
├── Models/
│   ├── cartModel.js
│   ├── checkoutModel.js
│   ├── orderModel.js
│   ├── reviewModel.js
│   ├── servicesModel.js
│   ├── userModel.js
├── package-lock.json
├── package.json
├── Routers/
│   ├── authRouter.js
│   ├── cartRouter.js
│   ├── checkoutRouter.js
│   ├── orderRouter.js
│   ├── paymentRouter.js
│   ├── reviewRouter.js
│   ├── servicesRouter.js
│   ├── userRouter.js
│   ├── webhookRouter.js
├── server.js
├── Utils/
│   ├── Error.js
│   ├── scheduledTasks.js
```

## Deployment
- **Frontend:** Deployed on Netlify → [Live Demo](https://ryd-cleanease.netlify.app/)
- **Backend:** Deployed on Render → [API](https://capstone-cleanease-backend.onrender.com)

## Author
**YOGADEEPAN.R**  

## License
This project is licensed under the MIT License.

