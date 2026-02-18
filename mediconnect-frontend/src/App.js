import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';


// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorsList from './pages/patient/DoctorsList';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import AppointmentRequests from './pages/doctor/AppointmentRequests';
import DoctorHistory from './pages/doctor/DoctorHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAppointments from './pages/admin/ManageAppointments';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Patient Routes */}
                            <Route
                                path="/patient/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['patient']}>
                                        <PatientDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/patient/doctors"
                                element={
                                    <ProtectedRoute allowedRoles={['patient']}>
                                        <DoctorsList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/patient/book-appointment"
                                element={
                                    <ProtectedRoute allowedRoles={['patient']}>
                                        <BookAppointment />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/patient/appointments"
                                element={
                                    <ProtectedRoute allowedRoles={['patient']}>
                                        <MyAppointments />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/patient/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['patient']}>
                                        <PatientProfile />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Doctor Routes */}
                            <Route
                                path="/doctor/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['doctor']}>
                                        <DoctorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/doctor/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['doctor']}>
                                        <DoctorProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/doctor/appointments"
                                element={
                                    <ProtectedRoute allowedRoles={['doctor']}>
                                        <AppointmentRequests />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/doctor/history"
                                element={
                                    <ProtectedRoute allowedRoles={['doctor']}>
                                        <DoctorHistory />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/doctors"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <ManageDoctors />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <ManageUsers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/appointments"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <ManageAppointments />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 Route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
