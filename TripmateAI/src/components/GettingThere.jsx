import React from 'react';
import './GettingThere.css';

const GettingThere = ({ onBack, onMenuClick }) => {
  return (
    <div className="getting-there-container animate-fade-in">
      {/* Header */}
      <header className="itin-page-header">
        <button className="itin-page-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h2 className="itin-header-title">Getting There</h2>
        <button className="itin-hamburger-btn" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      <div className="gt-content">
        {/* Map Header Area */}
        <div className="gt-map-area animate-slide-up">
          <div className="gt-map-bg" style={{backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')"}}>
            {/* Map Overlay content */}
          </div>
          <div className="gt-route-pills">
            <div className="gt-pill">
              <span className="gt-dot blue"></span>
              Bengaluru
            </div>
            <div className="gt-pill-connector">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="6" cy="12" r="1"></circle><circle cx="18" cy="12" r="1"></circle></svg>
            </div>
            <div className="gt-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Coorg
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="gt-info-grid animate-slide-up delay-100">
          <div className="gt-grid-card border-blue">
            <div className="gt-icon-box bg-blue-light">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0v1a3 3 0 0 1-6 0v-1m-4 0v1a3 3 0 0 1-6 0v-1"></path></svg>
            </div>
            <div className="gt-card-text">
              <p>Mode</p>
              <h4>Self Drive</h4>
            </div>
          </div>

          <div className="gt-grid-card border-orange">
            <div className="gt-icon-box bg-orange-light">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="gt-card-text">
              <p>Duration</p>
              <h4>4 Hours</h4>
            </div>
          </div>

          <div className="gt-grid-card border-purple">
            <div className="gt-icon-box bg-purple-light">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="gt-card-text">
              <p>Distance</p>
              <h4>245 KM</h4>
            </div>
          </div>

          <div className="gt-grid-card border-green">
            <div className="gt-icon-box bg-green-light">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            </div>
            <div className="gt-card-text">
              <p>Depart</p>
              <h4>Sat 6:00 AM</h4>
            </div>
          </div>
        </div>

        {/* Estimate Rows */}
        <div className="gt-estimates animate-slide-up delay-200">
          <div className="gt-estimate-row">
            <div className="gt-estimate-left">
               <span className="gt-emoji">🛣️</span>
               <span className="gt-label">Toll Cost</span>
            </div>
            <div className="gt-estimate-right">~₹280 both ways</div>
          </div>

          <div className="gt-estimate-row">
            <div className="gt-estimate-left">
               <span className="gt-emoji">⛽</span>
               <span className="gt-label">Fuel Estimate</span>
            </div>
            <div className="gt-estimate-right">~₹1,800 (20 kmpl)</div>
          </div>

          <div className="gt-estimate-row">
            <div className="gt-estimate-left">
               <span className="gt-emoji">🅿️</span>
               <span className="gt-label">Parking</span>
            </div>
            <div className="gt-estimate-right">Available at all spots</div>
          </div>
        </div>

      </div>

      {/* Fixed Bottom CTA */}
      <div className="gt-bottom-bar animate-slide-up delay-300">
         <button className="gt-map-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            Open in Google Maps
         </button>
      </div>

    </div>
  );
};

export default GettingThere;
