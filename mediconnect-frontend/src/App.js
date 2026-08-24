import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import DashboardLayout from './components/DashboardLayout';

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
import AdminSettings from './pages/admin/AdminSettings';

import ChatAgent from './components/ChatAgent';

// Home Page wrapper: If user is logged in, redirect straight to their dashboard
const PublicHomeRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return null;
    if (isAuthenticated && user?.role) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    return (
        <>
            <Navbar />
            <Home />
            <Footer />
        </>
    );
};

// Auth Page wrapper: If user is already logged in, redirect to dashboard
const PublicAuthRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return null;
    if (isAuthenticated && user?.role) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

// Helper: Wrap a page in DashboardLayout + ProtectedRoute
const DashPage = ({ roles, children }) => (
    <ProtectedRoute allowedRoles={roles}>
        <DashboardLayout>
            {children}
        </DashboardLayout>
    </ProtectedRoute>
);

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        {/* Public Routes — Auto-redirect logged-in users to their role dashboard */}
                        <Route path="/" element={<PublicHomeRoute />} />
                        <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
                        <Route path="/signup" element={<PublicAuthRoute><Signup /></PublicAuthRoute>} />

                        {/* Patient Routes */}
                        <Route path="/patient/dashboard" element={<DashPage roles={['patient']}><PatientDashboard /></DashPage>} />
                        <Route path="/patient/doctors" element={<DashPage roles={['patient']}><DoctorsList /></DashPage>} />
                        <Route path="/patient/book-appointment" element={<DashPage roles={['patient']}><BookAppointment /></DashPage>} />
                        <Route path="/patient/appointments" element={<DashPage roles={['patient']}><MyAppointments /></DashPage>} />
                        <Route path="/patient/profile" element={<DashPage roles={['patient']}><PatientProfile /></DashPage>} />

                        {/* Doctor Routes */}
                        <Route path="/doctor/dashboard" element={<DashPage roles={['doctor']}><DoctorDashboard /></DashPage>} />
                        <Route path="/doctor/profile" element={<DashPage roles={['doctor']}><DoctorProfile /></DashPage>} />
                        <Route path="/doctor/appointments" element={<DashPage roles={['doctor']}><AppointmentRequests /></DashPage>} />
                        <Route path="/doctor/history" element={<DashPage roles={['doctor']}><DoctorHistory /></DashPage>} />

                        {/* Admin Routes */}
                        <Route path="/admin/dashboard" element={<DashPage roles={['admin']}><AdminDashboard /></DashPage>} />
                        <Route path="/admin/doctors" element={<DashPage roles={['admin']}><ManageDoctors /></DashPage>} />
                        <Route path="/admin/users" element={<DashPage roles={['admin']}><ManageUsers /></DashPage>} />
                        <Route path="/admin/appointments" element={<DashPage roles={['admin']}><ManageAppointments /></DashPage>} />
                        <Route path="/admin/settings" element={<DashPage roles={['admin']}><AdminSettings /></DashPage>} />
                        <Route path="/admin/profile" element={<DashPage roles={['admin']}><AdminSettings /></DashPage>} />

                        {/* 404 fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <ChatAgent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
