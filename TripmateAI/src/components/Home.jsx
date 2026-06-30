import { useState, useEffect } from 'react';
import './Home.css';
import TripmateLogo from './TripmateLogo';
import VoiceModal from './VoiceModal';

const BANNER_SLIDES = [
  {
    icon: '📍',
    iconBg: 'bg-orange',
    title: 'Explore Nearby',
    subtitle: 'Restaurants, cafés & local spots',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    nav: 'discovery'
  },
  {
    icon: '🚗',
    iconBg: 'bg-blue',
    title: 'Plan My Weekend',
    subtitle: 'Road trips & hill escapes',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    nav: 'discovery'
  },
  {
    icon: '✈️',
    iconBg: 'bg-purple-icon',
    title: 'Trips & Vacations',
    subtitle: 'Multi-day trips & travel plans',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80',
    nav: 'discovery'
  }
];

const PLACEHOLDERS = [
  "Adventure trip under ₹15,000...",
  "Solo beach escape this week...",
  "Plan a weekend escape for two...",
  "Relaxing trip within 4 hours..."
];

const Home = ({ onNavigate, onMenuClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Typewriter effect state
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentFullText = PLACEHOLDERS[placeholderIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholderText(prev => prev.slice(0, -1));
        if (placeholderText === '') {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }
      }, 30);
    } else {
      if (placeholderText === currentFullText) {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      } else {
        timer = setTimeout(() => {
          setPlaceholderText(currentFullText.slice(0, placeholderText.length + 1));
        }, 60);
      }
    }
    
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, placeholderIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % BANNER_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container animate-fade-in">
      {/* Header */}
      <header className="home-header">
        <TripmateLogo />
        <button className="menu-btn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      {/* Rotating Hero Banner */}
      <div className="hero-banner-wrapper animate-slide-up">
        <div
          className="hero-card"
          onClick={() => onNavigate(BANNER_SLIDES[activeSlide].nav)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          {/* Animated Backgrounds */}
          {BANNER_SLIDES.map((slide, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.08) 100%), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: i === activeSlide ? 1 : 0,
                transform: i % 2 === 0 
                  ? (i === activeSlide ? 'scale(1.1)' : 'scale(1)') 
                  : (i === activeSlide ? 'scale(1)' : 'scale(1.1)'),
                transition: 'opacity 1s ease-in-out, transform 12s linear',
                zIndex: 0
              }}
            />
          ))}

          <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
            <div className={`hero-icon ${BANNER_SLIDES[activeSlide].iconBg}`}>{BANNER_SLIDES[activeSlide].icon}</div>
            <h2>{BANNER_SLIDES[activeSlide].title}</h2>
            <p>{BANNER_SLIDES[activeSlide].subtitle}</p>
          </div>
          <div className="carousel-dots" style={{ position: 'relative', zIndex: 1 }}>
            {BANNER_SLIDES.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === activeSlide ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setActiveSlide(i); }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="greeting-section animate-slide-up delay-100">
        <p className="greeting-text">Good morning, <strong>Arjun!</strong></p>
        <h2 className="greeting-title">What's your plan?</h2>
      </div>

      {/* Action Cards */}
      <div className="action-cards animate-slide-up delay-200">
        <button className="action-card" onClick={() => onNavigate('express')}>
          <div className="action-icon bg-purple">✈️</div>
          <div className="action-text">
            <h3>Trips & Vacations</h3>
            <p>Multi-day trips & travel plans</p>
          </div>
          <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>

        <button className="action-card" onClick={() => onNavigate('express')}>
          <div className="action-icon bg-blue-light">🚗</div>
          <div className="action-text">
            <h3>Plan My Weekend</h3>
            <p>Quick escapes within 4-6 hours</p>
          </div>
          <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>

        <button className="action-card" onClick={() => onNavigate('express')}>
          <div className="action-icon bg-orange-light">📍</div>
          <div className="action-text">
            <h3>Explore Nearby Places</h3>
            <p>Restaurants, cafés & local spots</p>
          </div>
          <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>

      {/* Bottom Input */}
      <div className="bottom-input-container animate-slide-up delay-300">
        <div className="bottom-input-bar">
          <button className="mic-btn-round" onClick={() => setIsVoiceModalOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </button>
          <input 
            type="text" 
            placeholder={placeholderText + (inputValue ? "" : "|")} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('express')}
          />
          <button 
            className="submit-btn-round" 
            style={inputValue.trim() ? { backgroundColor: '#2563EB', color: 'white' } : { backgroundColor: '#E2E8F0', color: 'white' }}
            onClick={() => inputValue.trim() && onNavigate('express')}
            disabled={!inputValue.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

      <div className="home-bottom-nav">
        <button className="home-nav-item active" onClick={() => onNavigate('home')}>
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
        <button className="home-nav-item" onClick={() => onNavigate('profile')}>
          <svg aria-label="Profile" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>

      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default Home;
