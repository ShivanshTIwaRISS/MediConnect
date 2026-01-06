import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>MediConnect</h4>
                        <p>Your trusted platform for online doctor consultations.</p>
                    </div>
                    <div className="footer-section">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/login">Login</a></li>
                            <li><a href="/signup">Sign Up</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h5>Contact</h5>
                        <p>Email: support@mediconnect.com</p>
                        <p>Phone: +1 (555) 123-4567</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MediConnect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
