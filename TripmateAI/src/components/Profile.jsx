import React from 'react';
import './Profile.css';

const Profile = ({ onNavigate, onMenuClick }) => {
  // Dummy data for grid
  const gridImages = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  ];

  return (
    <div className="profile-container animate-fade-in">
      {/* Top Header */}
      <div className="profile-header">
        <div className="profile-username">
          Arjun kr.
          <span className="profile-badge" style={{ marginLeft: '4px' }}>9+</span>
        </div>
        <div className="profile-header-right" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats-section">
        <div className="profile-avatar-container">
          <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" alt="Profile" className="profile-avatar" />
          <div className="profile-avatar-add">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">1,184</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24.2K</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">7,477</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="profile-bio">
        <div className="bio-name">Tomiwa Talabi</div>
        <div className="bio-category">Digital Creator</div>
        <div className="bio-text">
          • Social Media Marketing Expert<br />
          • Founder of @lagoslife & @UnilagGist.
        </div>
        <a href="#" className="bio-link">www.tomiwatalabi.com</a>
        <div className="bio-followed-by">
          Followed by <strong>mr_tunmise</strong>, <strong>oge.o</strong> and <strong>959 others</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="action-btn">Edit Profile</button>
        <button className="action-btn">Promotions</button>
        <button className="action-btn">Email</button>
      </div>

      {/* Highlights */}
      <div className="profile-highlights">
        <div className="highlight-item">
          <div className="highlight-circle add-highlight">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <span className="highlight-name">Highlight</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <div className="highlight-inner">
              <span className="highlight-emoji">📍</span>
            </div>
          </div>
          <span className="highlight-name">Explore</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <div className="highlight-inner">
              <span className="highlight-emoji">🇬🇭</span>
            </div>
          </div>
          <span className="highlight-name">Ghana</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <div className="highlight-inner">
              <span className="highlight-emoji">📺</span>
            </div>
          </div>
          <span className="highlight-name">TV</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <div className="profile-tab active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
        </div>
        <div className="profile-tab">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
        </div>
        <div className="profile-tab">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="profile-grid">
        {gridImages.map((src, index) => (
          <div key={index} className="grid-item">
            <img src={src} alt="Post" />
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="home-bottom-nav">
        <button className="home-nav-item" onClick={() => onNavigate('home')}>
          <svg aria-label="Home" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
        </button>
        <button className="home-nav-item" onClick={() => onNavigate('discovery')}>
          <svg aria-label="Reels" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
          </svg>
        </button>
        <button className="home-nav-item" onClick={() => onNavigate('trips')}>
          <svg aria-label="Trips" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
        </button>
        <button className="home-nav-item active" onClick={() => onNavigate('profile')}>
          <svg aria-label="Profile" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>

    </div>
  );
};

export default Profile;
