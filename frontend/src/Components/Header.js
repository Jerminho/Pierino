import React from "react";
import { Link } from "react-router-dom";
import logo from "../Components/images/pierino-logo.webp";

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Pierino Logo" className="h-12" />
      </Link>

      {/* Navigation Links */}
      <nav>
        <ul className="flex space-x-6 text-lg font-medium">
          <li>
            <Link to="/" className="hover:text-blue-500">Home</Link>
          </li>
          <li>
            <Link to="/ijs-bestellen" className="hover:text-blue-500">IJs Bestellen</Link>
          </li>
          <li>
            <Link to="/offer" className="hover:text-blue-500">Ijskar Reserveren</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-500">Contact</Link>
          </li>
          <li>
            <Link to="/management" className="hover:text-blue-500">Manage</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
