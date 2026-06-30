import React from 'react';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose, onNavigate }) => {
  const handleNav = (stage) => {
    onNavigate(stage);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`side-menu-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>

      {/* Menu Panel */}
      <div className={`side-menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-menu-header">MENU</div>
        <ul className="side-menu-list">
          <li onClick={() => handleNav('home')}>Home</li>
          <li onClick={() => handleNav('trips')}>My Trips</li>
          <li onClick={() => handleNav('explore')}>Explore</li>
          <li onClick={() => handleNav('friends')}>Friends</li>
          <li onClick={() => handleNav('settings')}>Settings</li>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;
