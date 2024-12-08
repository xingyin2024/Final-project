import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiHome, CiSettings, CiLogin, CiLogout } from "react-icons/ci";
import { IoGridOutline, IoCreateOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";

// Reusable IconButton component for Hamburger and Close icons
const IconButton = ({ onClick, isClose }) => {
  const iconClasses = "w-[18px] h-[18px] relative block w-full h-[2px] bg-blackScale-darker";
  return (
    <button
      className="fixed top-[24px] right-[24px] p-2 z-50"
      onClick={onClick}
      aria-label={isClose ? "Close Menu" : "Open Menu"}
    >
      <div className="w-[18px] h-[18px] relative">
        {isClose ? (
          <>
            <span className={`${iconClasses} rotate-45 absolute top-[8px]`} />
            <span className={`${iconClasses} -rotate-45 absolute top-[8px]`} />
          </>
        ) : (
          <>
            <span className={`${iconClasses} mb-[3px]`} />
            <span className={`${iconClasses} mb-[3px]`} />
            <span className={iconClasses} />
          </>
        )}
      </div>
    </button>
  );
};

// Reusable NavItem for links and buttons
const NavItem = ({ to, icon: Icon, label, isButton = false, onClick }) => {
  const sharedClasses =
    "nav-item flex items-center px-4 py-2 rounded-md text-blackScale-mid transition hover:bg-white hover:text-pinkGradient-from hover:border-pinkGradient-from";
  const IconComponent = <Icon className="nav-icon mr-4" size={20} />;
  const Label = <span>{label}</span>;

  if (isButton) {
    return (
      <li>
        <button className={`${sharedClasses} border w-full text-left`} onClick={onClick}>
          {IconComponent}
          {Label}
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link to={to} className={`${sharedClasses} border`} onClick={onClick}>
        {IconComponent}
        {Label}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <div>
      {/* Hamburger Icon */}
      {!menuOpen && <IconButton onClick={() => setMenuOpen(true)} />}

      {/* Navbar Drawer */}
      {menuOpen && (
        <div
          className={`fixed top-0 right-0 h-screen bg-blackScale-light rounded-l-lg shadow-lg p-6 z-50 transition-all duration-300 ${
            menuOpen ? "w-full md:w-[30%]" : "w-0"
          }`}
          style={{ backgroundColor: "#E5E5E5" }}
        >
          {/* Close Icon */}
          <IconButton onClick={() => setMenuOpen(false)} isClose />

          {/* Profile Section */}
          <div className="flex items-center mb-8">
            <img
              src="/profile-pic.png" // Replace with dynamic profile image source
              alt="Profile"
              className="profile-pic"
            />
            <span className="ml-4 font-bold text-gray-800">
              Hi! {user?.name || "Guest"}
            </span>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-4">
            {[
              { to: "/dashboard", icon: CiHome, label: "Dashboard" },
              { to: "/create-trip", icon: IoCreateOutline, label: "Create Trip Report" },
              { to: "/settings", icon: CiSettings, label: "Settings" },
              ...(user?.role === "admin"
                ? [{ to: "/admin", icon: IoGridOutline, label: "Admin" }]
                : []),
              user
                ? {
                    isButton: true,
                    onClick: handleLogout,
                    icon: CiLogout,
                    label: "Logout",
                  }
                : { to: "/login", icon: CiLogin, label: "Login" },
            ].map(({ to, icon, label, isButton = false, onClick }, index) => (
              <NavItem
                key={index}
                to={to}
                icon={icon}
                label={label}
                isButton={isButton}
                onClick={onClick || (() => setMenuOpen(false))}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
