import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} AI-Powered Volunteer Matching System</p>
      </div>
    </footer>
  );
}

export default Footer;