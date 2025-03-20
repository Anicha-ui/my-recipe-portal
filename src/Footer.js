import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import './Footer.css'; // If you'd like to add custom styles


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Links Section 
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
*/}
        {/* Footer Social Media Section */}


        {/* Footer Copyright Section */}
        <div className="footer-copyright">
          <p>&copy; 2025 Blue Leaf Recipes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
