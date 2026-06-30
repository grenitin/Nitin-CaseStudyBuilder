import { useState, useEffect } from 'react';
import './Recommendations.css';
import BrandLogo from './BrandLogo';

const DESTINATIONS = [
  {
    id: 1,
    name: 'Coorg',
    region: 'Karnataka · Coffee Country',
    aiPick: true,
    matchScore: 95,
    travelTime: '4 hrs',
    distance: '245 km',
    weather: '22°C · Partly Cloudy',
    rating: '4.7★',
    budget: '₹15,000',
    description: 'Best balance of relaxation, budget, and travel time. Highly rated resorts within your budget.',
    totalCost: '₹ 3,450',
    costBreakdown: 'Total ₹ 13,450 · Taxes included',
    scores: [
      { label: 'VIBE MATCH', value: '95%' },
      { label: 'DISTANCE', value: '4 hrs' },
      { label: 'WEATHER', value: '22°C' },
    ],
    images: [
      'https://images.unsplash.com/photo-1560357647-62a43d9897bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/flagged/photo-1592544858330-7ac10a0468e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1710612198146-77512950a4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
  },
  {
    id: 2,
    name: 'Chikmagalur',
    region: 'Karnataka · Coffee Hills',
    aiPick: false,
    matchScore: 90,
    travelTime: '4.5 hrs',
    distance: '250 km',
    weather: '21°C · Partly Cloudy',
    rating: '4.5★',
    budget: '₹12,000',
    description: 'Mist-covered hills and serene coffee estates. A perfect retreat from city life.',
    totalCost: '₹ 2,900',
    costBreakdown: 'Total ₹ 11,600 · Taxes included',
    scores: [
      { label: 'VIBE MATCH', value: '90%' },
      { label: 'DISTANCE', value: '4.5 hrs' },
      { label: 'WEATHER', value: '21°C' },
    ],
    images: [
      'https://images.unsplash.com/photo-1601004128080-2a8d56b06821?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1598583486337-4318c4e5ff09?auto=format&fit=crop&w=1080&q=80'
    ],
  },
  {
    id: 3,
    name: 'Hampi',
    region: 'Karnataka · Ancient Ruins',
    aiPick: false,
    matchScore: 82,
    travelTime: '6 hrs',
    distance: '340 km',
    weather: '28°C · Sunny',
    rating: '4.6★',
    budget: '₹10,000',
    description: 'UNESCO World Heritage Site with boulder landscapes, ancient temples and unique culture.',
    totalCost: '₹ 2,100',
    costBreakdown: 'Total ₹ 8,400 · Taxes included',
    scores: [
      { label: 'VIBE MATCH', value: '82%' },
      { label: 'DISTANCE', value: '6 hrs' },
      { label: 'WEATHER', value: '28°C' },
    ],
    images: [
      'https://images.unsplash.com/photo-1582651957400-f9a175fef1e0?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

const MEMBERS = ['R', 'A', 'P', 'Ro'];

const GROUP_MEMBERS = [
  { name: 'Rahul', initial: 'R', status: 'Accepted' },
  { name: 'Aman', initial: 'A', status: 'Pending' },
  { name: 'Priya', initial: 'P', status: 'Accepted' },
  { name: 'Rohan', initial: 'Ro', status: 'Pending' }
];
const MEMBER_COLORS = ['#EFF6FF', '#FAF5FF', '#FDF2F8', '#ECFDF5'];
const MEMBER_TEXT_COLORS = ['#2563EB', '#9333EA', '#DB2777', '#059669'];
const MEMBER_BORDER_COLORS = ['#BFDBFE', '#E9D5FF', '#FBCFE8', '#A7F3D0'];


const RecommendationCard = ({ dest, onViewItinerary, onNavigate }) => {
  const [imgIndex, setImgIndex] = useState(0);

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex(i => (i - 1 + dest.images.length) % dest.images.length);
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex(i => (i + 1) % dest.images.length);
  };

  useEffect(() => {
    if (dest.images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIndex(prev => (prev + 1) % dest.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [dest.images.length]);

  return (
    <div className={`rec-card ${dest.aiPick ? 'rec-card-featured' : ''}`}>
      {/* Image Carousel */}
      <div className="rec-card-image-wrap" onClick={() => onNavigate('discovery', dest.name)} style={{ cursor: 'pointer' }}>
        {dest.images.map((img, i) => (
          <img
            key={i}
            className="rec-card-image"
            src={img}
            alt={`${dest.name} ${i + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: i === imgIndex ? 1 : 0,
              transform: i % 2 === 0 
                  ? (i === imgIndex ? 'scale(1.1)' : 'scale(1)') 
                  : (i === imgIndex ? 'scale(1)' : 'scale(1.1)'),
              transition: 'opacity 1s ease-in-out, transform 12s linear',
              objectFit: 'cover'
            }}
          />
        ))}
        <div className="rec-card-image-overlay" />

        {dest.aiPick && (
          <div className="rec-badge-aipick">Highly Recommended</div>
        )}

        {/* Carousel arrows removed to match mockup */}



        {/* Bottom overlay with text and dots */}
        <div className="rec-card-bottom-overlay">
          <div className="rec-card-location">
            <h2 className="rec-dest-name">{dest.name}</h2>
            <p className="rec-dest-region">{dest.region}</p>
          </div>
          
          {/* Image dots */}
          {dest.images.length > 1 && (
            <div className="rec-img-dots">
              {dest.images.map((_, i) => (
                <span 
                  key={i} 
                  className={`rec-img-dot ${i === imgIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIndex(i);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="rec-card-body">

        {/* Score Row */}
        <div className="rec-scores-row">
          {dest.scores.map((s, i) => (
            <div key={i} className={`rec-score-box ${i === 0 ? 'rec-score-featured' : ''} ${i === 1 ? 'rec-score-distance' : ''} ${i === 2 ? 'rec-score-weather' : ''}`}>
              <span className="rec-score-label">{s.label}</span>
              <span className="rec-score-value">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="rec-description">{dest.description}</p>

        {/* Cost Box */}
        <div className="rec-cost-box">
          <p className="rec-cost-breakdown">{dest.costBreakdown.split(' · ').slice(1).join(' - ')} | 100% Free Cancellation</p>
          <p className="rec-cost-amount">
            {dest.totalCost}
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, letterSpacing: 'normal' }}>/ PAX</span>
          </p>
          <p className="rec-cost-tag">{`${dest.costBreakdown.split(' · ')[0].toUpperCase()} - HOTEL - FUEL - FOOD`}</p>
        </div>

        {/* CTA */}
        <button className="rec-cta-btn" onClick={onViewItinerary}>
          View Full Itinerary
        </button>
      </div>
    </div>
  );
};

const Recommendations = ({ onBack, onNavigate, onMenuClick }) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showAiInvitePanel, setShowAiInvitePanel] = useState(false);

  return (
    <div className="rec-page animate-fade-in">
      {/* Header */}
      <header className="rec-page-header">
        <button className="rec-page-back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Weekend Escapes - 3</h1>
        <button className="rec-hamburger-btn" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </header>

      {/* Scrollable cards list */}
      <div className="rec-cards-list">
        {DESTINATIONS.map(dest => (
          <RecommendationCard
            key={dest.id}
            dest={dest}
            onViewItinerary={() => onNavigate('evaluate')}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Backdrop Blur Overlay */}
      {isGroupExpanded && (
        <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 90, animation: 'fadeIn 0.2s ease-out' }} onClick={() => setIsGroupExpanded(false)} />
      )}

      {/* Sticky Bottom Bar (Copied from Itinerary) */}
      <div className="itin-bottom-bar animate-slide-up delay-300" style={{ zIndex: 100, padding: isGroupExpanded ? '24px 20px 32px' : '16px 20px', borderTopLeftRadius: isGroupExpanded ? '32px' : '0', borderTopRightRadius: isGroupExpanded ? '32px' : '0', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        
        {/* Travel Buddies Header */}
        <div className="travel-buddies-section" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 0, border: 'none', background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', cursor: 'pointer', marginBottom: isGroupExpanded ? '24px' : '0' }} onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
            <div className="tb-icon-box bg-blue" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="tb-text">
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>Travel Buddies</h3>
              <p className="text-blue" style={{ margin: 0, fontSize: '12px', fontWeight: '700' }}>2 of 4 accepted</p>
            </div>
            <div className="tb-avatars" style={{ marginLeft: 'auto', marginRight: '8px' }}>
              {GROUP_MEMBERS.map((m, i) => (
                <div key={i} className="tb-avatar" style={{ width: '24px', height: '24px', fontSize: '10px', backgroundColor: MEMBER_COLORS[i], color: MEMBER_TEXT_COLORS[i], border: `1px solid ${MEMBER_TEXT_COLORS[i]}` }}>
                  {m.initial}
                </div>
              ))}
              <button className="tb-expand-btn" style={{ width: '24px', height: '24px' }}>
                {isGroupExpanded ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Expanded Content */}
          {isGroupExpanded && (
            <div className="rec-group-expanded-content" style={{ padding: '0', animation: 'fadeIn 0.3s ease-out' }}>
              <div className="rec-expense-members-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {GROUP_MEMBERS.map((member, i) => (
                  <div key={i} className="rec-expense-member-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', border: '1px solid #F1F5F9', borderRadius: '16px', padding: '12px 16px' }}>
                    <div className="member-avatar-lg" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', backgroundColor: MEMBER_COLORS[i], color: MEMBER_TEXT_COLORS[i] }}>
                      {member.initial}
                    </div>
                    <span className="member-name" style={{ flex: 1, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>{member.name}</span>
                    {member.status === 'Accepted' ? (
                      <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', backgroundColor: '#ECFDF5', color: '#059669' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Accepted
                      </div>
                    ) : (
                      <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', backgroundColor: '#FFF7ED', color: '#EA580C' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Pending
                      </div>
                    )}
                    <button style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF7ED', color: '#EA580C', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="expanded-section-title mt-4" style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '24px', marginBottom: '16px' }}>
                <span className="mr-2">💬</span> Discuss Before Booking
              </div>

              <div className="rec-action-buttons-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 0', borderRadius: '16px', border: '1px solid #FFEDD5', backgroundColor: '#FFF7ED', color: '#EA580C', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>Group Call</span>
                </button>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 0', borderRadius: '16px', border: '1px solid #DBEAFE', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  <span>Share Invite</span>
                </button>
                <button onClick={() => setShowAiInvitePanel(!showAiInvitePanel)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 0', borderRadius: '16px', border: showAiInvitePanel ? '2px solid #9333EA' : '1px solid #F3E8FF', backgroundColor: '#FAF5FF', color: '#9333EA', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                  <span>AI Invite</span>
                </button>
              </div>

              {/* Inline AI Invite Panel */}
              {showAiInvitePanel && (
                <div style={{ marginTop: '16px', backgroundColor: '#FAF5FF', borderRadius: '16px', padding: '16px', border: '1px solid #E9D5FF', animation: 'fadeIn 0.2s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      🤖
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#4C1D95' }}>Tripmate AI Invite</h4>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#7C3AED' }}>Speak a friend's name to send an invite</p>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', fontSize: '14px', color: '#1E293B', fontWeight: '500', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>👋</span>
                    <span style={{ lineHeight: 1.5 }}>Tap the mic and say the name of the friend you want to invite.</span>
                  </div>
                  
                  <button style={{ width: '100%', padding: '14px', borderRadius: '100px', backgroundColor: '#F3E8FF', border: '1px solid #D8B4FE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#7C3AED', fontWeight: '800', fontSize: '15px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                    Tap to speak
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Only show the chat input box when NOT expanded */}
          {!isGroupExpanded && (
            <div className="rec-bottom-input" style={{ marginTop: '16px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="rec-input-pill" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '100px', padding: '6px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <button className="rec-input-mic" style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '50%', background: '#F8FAFC', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                </button>
                <input 
                  type="text" 
                  placeholder="Ask AI anything about Coorg..." 
                  className="rec-input-field" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 16px', fontSize: '15px', color: '#0F172A', outline: 'none' }}
                />
                <button 
                  className="rec-input-send"
                  style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '50%', background: inputValue.trim() ? '#2563EB' : '#E2E8F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0, color: 'white' }}
                  disabled={!inputValue.trim()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
