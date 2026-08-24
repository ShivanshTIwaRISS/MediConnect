import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

import ChatAgent from './components/ChatAgent';

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
                        {/* Public Routes — use Navbar + Footer */}
                        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                        <Route path="/login" element={<><Navbar /><Login /></>} />
                        <Route path="/signup" element={<><Navbar /><Signup /></>} />

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

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <ChatAgent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
