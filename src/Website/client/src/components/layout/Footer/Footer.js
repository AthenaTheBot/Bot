import { Link } from "react-router-dom";

// Other Comp
import "./Footer.css";

const Footer = () => {
  return (
    <div className="athena-footer">
      <div className="athena-footer-content">
        <div className="athena-footer-brand">
          <img src="/assets/images/logo.png" alt="Athena" />
          <p>
            Athena is a multi-purpose discord bot that aims to serve every
            function of a discord bot that can perform.
          </p>
        </div>
        <div className="athena-footer-link-part">
          <ul className="athena-footer-links">
            <h3>General</h3>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/commands">Commands</Link>
            </li>
            <li>
              <Link to="/source">Source Code</Link>
            </li>
          </ul>
          <ul className="athena-footer-links">
            <h3>Legal</h3>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/tos">Terms of Service</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
