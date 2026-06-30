import React, { useState, useEffect } from 'react';
import BrandLogo from './BrandLogo';
import './HotelDetails.css';

function HotelDetails({ onBack, onNavigate, onMenuClick }) {
  const [placeholder, setPlaceholder] = useState('');

  const phrases = [
    "Type your answer...",
    "Want to check another hotel?",
    "Have any queries?",
    "Ask AI to customize your stay..."
  ];

  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let timeoutId;

    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        setPlaceholder(currentPhrase.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        typingSpeed = 40;
      } else {
        setPlaceholder(currentPhrase.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      timeoutId = setTimeout(type, typingSpeed);
    };

    timeoutId = setTimeout(type, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hotel-details-container animate-fade-in">
      {/* Standard App Header */}
      <header className="rec-page-header">
        <button className="rec-page-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <BrandLogo />
        <button className="rec-hamburger-btn" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      {/* Hero Gallery */}
      <div className="hd-gallery">
        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80" alt="Coorg Wilderness Resort" className="hd-main-img" />
        <button className="hd-all-photos-btn">
          <span style={{marginRight: '6px'}}>📸</span> 24 photos
        </button>
      </div>

      {/* Content */}
      <div className="hd-content">
        <h1 className="hd-title">Coorg Wilderness Resort</h1>
        <div className="hd-rating">
          <span className="stars">★ ★ ★ ★ ★</span>
          <span>4.7 (512 reviews)</span>
        </div>
        <div className="hd-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Virajpet Main Road, Madikeri, Karnataka
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0'}} />

        <div className="hd-price-block" style={{marginBottom: '24px'}}>
          <div className="hd-price" style={{fontSize: '24px'}}>₹7,000 <span style={{fontSize: '15px', fontWeight: 500, color: '#475569'}}>/ night</span></div>
          <div className="hd-price-sub" style={{fontSize: '15px'}}>Total ₹14,000 for 2 nights</div>
        </div>

        {/* Amenities */}
        <h2 className="hd-section-title" style={{marginTop: 0}}>Popular Amenities</h2>
        <div className="hd-amenities-grid">
          <div className="hd-amenity-item"><span className="hd-amenity-icon">📶</span> Free WiFi</div>
          <div className="hd-amenity-item"><span className="hd-amenity-icon">🏊</span> Outdoor Pool</div>
          <div className="hd-amenity-item"><span className="hd-amenity-icon">🍽️</span> 2 Restaurants</div>
          <div className="hd-amenity-item"><span className="hd-amenity-icon">🚗</span> Free Parking</div>
          <div className="hd-amenity-item"><span className="hd-amenity-icon">💆</span> Full-service Spa</div>
          <div className="hd-amenity-item"><span className="hd-amenity-icon">☕</span> Breakfast included</div>
        </div>
        <button className="hd-show-all-btn">Show all 32 amenities</button>

        <hr style={{border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0'}} />

        {/* Room Selection */}
        <h2 className="hd-section-title">Your Room: Grove View Studio</h2>
        <div className="hd-room-card">
          <h3 className="hd-room-title">Grove View Studio</h3>
          <div className="hd-room-perks">
            <div className="hd-perk"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Free cancellation before June 20</div>
            <div className="hd-perk"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> No prepayment needed</div>
            <div className="hd-perk gray"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Sleeps 2 guests</div>
            <div className="hd-perk gray"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="20"></line><path d="M19 8V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path></svg> 1 King Bed</div>
          </div>
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0'}} />

        {/* About */}
        <h2 className="hd-section-title">About this property</h2>
        <p className="hd-description">
          Nestled amidst the lush green hills of Coorg, the Wilderness Resort offers an unparalleled luxury experience blended with nature. Wake up to the sound of exotic birds and the aroma of freshly brewed local coffee. Enjoy infinity pools that seemingly drop into the valley below, and world-class spa treatments.
        </p>
        <p style={{color: '#2563EB', fontWeight: 600, fontSize: '15px', marginTop: '12px', cursor: 'pointer'}}>
          Read more
        </p>

        <hr style={{border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0'}} />

        {/* Location */}
        <h2 className="hd-section-title">Location</h2>
        <div className="hd-map-preview">
          <div className="hd-map-marker">Exact location provided after booking</div>
        </div>
        <p style={{fontSize: '14px', color: '#64748B', lineHeight: 1.5}}>
          Located 4.5 km from Madikeri Fort and 6 km from Raja's Seat. The nearest airport is Kannur International Airport, 90 km away.
        </p>

      </div>

      {/* Sticky Footer */}
      <div className="hd-sticky-footer">
        <div className="hd-chat-input-pill" onClick={() => onNavigate('express')}>
          <div className="hd-chat-mic-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            readOnly
          />
          <div className="hd-chat-send-btn" style={{backgroundColor: '#E2E8F0'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
