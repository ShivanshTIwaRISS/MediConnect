# MediConnect - Online Doctor Consultation Platform

A full-stack web application that enables seamless online doctor consultation through appointment booking with secure, role-based access for patients, doctors, and administrators.

## 🚀 Features

### Patient Features
- ✅ Secure signup and login
- 👨‍⚕️ View available doctors with specialization details
- 📅 Book consultation appointments
- 📊 Track appointment status (pending, approved, rejected)
- ❌ Cancel appointments
- 👤 Manage personal profile

### Doctor Features
- ✅ Secure login
- 📝 Create and manage doctor profile
- 📋 View appointment requests from patients
- ✅ Accept or reject consultation requests
- 📚 View consultation history

### Admin Features
- ✅ Secure admin login
- ✔️ Approve or block doctor accounts
- 👥 Manage users (patients and doctors)
- 📊 View all appointments on the platform
- 📈 Monitor system statistics

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator

### Frontend
- **Library:** React.js
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Custom CSS with modern design system

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like Aiven)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd mediconnect-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd mediconnect-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Default User Roles

When registering, users can select from three roles:
- **Patient** - Book appointments and manage consultations
- **Doctor** - Manage profile and handle appointment requests (requires admin approval)
- **Admin** - Manage platform users and doctors

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Patient Routes
- `GET /api/patient/doctors` - Get all approved doctors
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get patient's appointments
- `PUT /api/patient/appointments/:id/cancel` - Cancel appointment
- `GET /api/patient/profile` - Get patient profile
- `PUT /api/patient/profile` - Update patient profile

### Doctor Routes
- `POST /api/doctor/profile` - Create doctor profile
- `PUT /api/doctor/profile` - Update doctor profile
- `GET /api/doctor/profile` - Get doctor profile
- `GET /api/doctor/appointments` - Get appointment requests
- `PUT /api/doctor/appointments/:id/accept` - Accept appointment
- `PUT /api/doctor/appointments/:id/reject` - Reject appointment
- `GET /api/doctor/history` - Get consultation history

### Admin Routes
- `GET /api/admin/doctors/pending` - Get pending doctor approvals
- `PUT /api/admin/doctors/:id/approve` - Approve doctor
- `PUT /api/admin/doctors/:id/block` - Block doctor
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/statistics` - Get platform statistics

## 🎨 Design Features

- Modern gradient backgrounds
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive design
- Accessible color palette
- Professional typography (Inter font)

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Follow the prompts
4. Set environment variable `REACT_APP_API_URL` to your backend URL

### Database (Aiven)
1. Create a MongoDB instance on Aiven
2. Get the connection string
3. Update `MONGODB_URI` in backend environment variables

## 📝 Usage Guide

### For Patients
1. Sign up with role "Patient"
2. Browse available doctors
3. Book an appointment by selecting a doctor, date, and time
4. View your appointments in "My Appointments"
5. Cancel appointments if needed

### For Doctors
1. Sign up with role "Doctor"
2. Create your professional profile (specialization, fees, etc.)
3. Wait for admin approval
4. Once approved, view and manage appointment requests
5. Accept or reject patient consultations

### For Admins
1. Sign up with role "Admin"
2. View platform statistics
3. Approve or block doctor accounts
4. Manage users and view all appointments

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- CORS configuration

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your own use.

## 📄 License

ISC

## 👨‍💻 Author

Created as a full-stack learning project demonstrating:
- RESTful API design
- Authentication & Authorization
- Role-based access control
- CRUD operations
- React state management
- Modern UI/UX design

---

**Note:** This project is for educational purposes and demonstrates core full-stack development concepts. For production use, additional features like email verification, payment integration, and video consultations would be recommended.
