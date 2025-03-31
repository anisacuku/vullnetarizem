import React from 'react';
import '../../App.css'; // Optional for styles

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AI Volunteer Matching. Të gjitha të drejtat e rezervuara.</p>
    </footer>
  );
}

export default Footer;
