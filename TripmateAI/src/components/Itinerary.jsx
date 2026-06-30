import React, { useState } from 'react';
import './Itinerary.css';
import './GettingThere.css';

const Itinerary = ({ onBack, onNavigate, onMenuClick }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeDay, setActiveDay] = useState('day1');
  const [activePackingTab, setActivePackingTab] = useState('saturday');
  const [expandedTimelineItem, setExpandedTimelineItem] = useState(null);
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [showAiInvitePanel, setShowAiInvitePanel] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1560357647-62a43d9897bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/flagged/photo-1592544858330-7ac10a0468e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1710612198146-77512950a4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ];

  const GROUP_MEMBERS = [
    { name: 'Rahul', initial: 'R', amount: '₹3,750', status: 'Paid' },
    { name: 'Aditi', initial: 'A', amount: '₹3,750', status: 'Paid' },
    { name: 'Priya', initial: 'P', amount: '₹3,750', status: 'Pending' },
    { name: 'Rohan', initial: 'Ro', amount: '₹3,750', status: 'Pending' }
  ];
  const MEMBER_COLORS = ['#EFF6FF', '#FAF5FF', '#FDF2F8', '#ECFDF5'];
  const MEMBER_TEXT_COLORS = ['#2563EB', '#9333EA', '#DB2777', '#059669'];

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleTimelineItem = (itemId) => {
    setExpandedTimelineItem(expandedTimelineItem === itemId ? null : itemId);
  };

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="itinerary-container animate-fade-in">
      {/* Header */}
      <header className="itin-page-header">
        <button className="itin-page-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h2 className="itin-header-title">Coorg</h2>
        <button className="itin-hamburger-btn" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      {/* Hero Image */}
      <div className="itin-hero animate-slide-up">
        <div className="itin-hero-bg" onClick={() => onNavigate('discovery', 'Coorg')} style={{ overflow: 'hidden', padding: 0, cursor: 'pointer' }}>
          {images.map((img, i) => (
            <img
              key={i}
              className="rec-card-image"
              src={img}
              alt={`Coorg ${i + 1}`}
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
          <div className="rec-card-image-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

          <div className="rec-badge-aipick" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>Highly Recommended</div>
          

          
          <div className="rec-card-bottom-overlay">
            <div className="rec-card-location">
              <h2 className="rec-dest-name">Coorg</h2>
              <p className="rec-dest-region">Karnataka · Coffee Country</p>
            </div>
            
            <div className="rec-img-dots">
              {images.map((_, i) => (
                <div key={i} className={`rec-img-dot ${i === imgIndex ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setImgIndex(i); }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="full-itin-content">
        
        {/* Card 1 */}
        <div className="full-info-card animate-slide-up delay-100" onClick={() => toggleCard('getting_there')} style={{cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div className="fic-icon" style={{backgroundColor: '#F3E8FF'}}>
              <span style={{fontSize: '24px'}}>🚗</span>
            </div>
            <div className="fic-text">
              <h3>Getting There</h3>
              <p>Bangalore → Coorg · Self Drive · 4hr</p>
            </div>
            <div className="fic-arrow" style={{ transform: expandedCard === 'getting_there' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
          
          {expandedCard === 'getting_there' && (
            <div className="gt-content animate-fade-in" style={{padding: '16px 0 0 0'}}>
              {/* Map Header Area */}
              <div className="gt-map-area" onClick={() => window.open('https://maps.google.com/maps?q=Bengaluru+to+Coorg', '_blank')} style={{cursor: 'pointer'}}>
                <div className="gt-map-bg" style={{position: 'relative'}}>
                  <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10}}></div>
                  <iframe 
                    title="Route Map"
                    width="100%" 
                    height="100%" 
                    style={{border:0, position: 'absolute', top: '-150px', left: 0, height: 'calc(100% + 300px)'}} 
                    loading="lazy" 
                    allowFullScreen 
                    src="https://maps.google.com/maps?q=Bengaluru+to+Coorg&t=&z=7&ie=UTF8&iwloc=&output=embed">
                  </iframe>
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
              <div className="gt-info-grid">
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
                    <h4>5 hr 52 min</h4>
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
              <div className="gt-estimates">
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
          )}
        </div>

        {/* Card 2 */}
        <div className="full-info-card animate-slide-up delay-100" onClick={() => toggleCard('trip_schedule')} style={{cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div className="fic-icon" style={{backgroundColor: '#EFF6FF'}}>
              <span style={{fontSize: '24px'}}>🗓️</span>
            </div>
            <div className="fic-text">
              <h3>Trip Schedule</h3>
              <p>2 Days · 8 Activities</p>
            </div>
            <div className="fic-arrow" style={{ transform: expandedCard === 'trip_schedule' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
          
          {expandedCard === 'trip_schedule' && (
            <div className="ts-content animate-fade-in" style={{padding: '16px 0 0 0'}} onClick={(e) => e.stopPropagation()}>
              {/* Merged Day Toggle & Weather Card */}
              <div className="animate-fade-in" style={{marginBottom: '32px'}}>
                <div style={{
                  border: '1px solid #E2E8F0', 
                  borderRadius: '24px', 
                  padding: '12px 16px 20px 16px', 
                  backgroundColor: 'white',
                  width: '100%',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
                }}>
                  {/* Segmented Control Tabs */}
                  <div style={{display: 'flex', gap: '8px', marginBottom: '20px', padding: '6px', background: '#F1F5F9', borderRadius: '100px'}}>
                    <div 
                      style={{flex: 1, textAlign: 'center', padding: '10px', borderRadius: '100px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: activeDay === 'day1' ? 'white' : '#64748B', background: activeDay === 'day1' ? '#2563EB' : 'transparent', boxShadow: activeDay === 'day1' ? '0 4px 12px rgba(37,99,235,0.2)' : 'none', transition: 'all 0.2s ease'}}
                      onClick={() => setActiveDay('day1')}
                    >Day 1</div>
                    <div 
                      style={{flex: 1, textAlign: 'center', padding: '10px', borderRadius: '100px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: activeDay === 'day2' ? 'white' : '#64748B', background: activeDay === 'day2' ? '#F97316' : 'transparent', boxShadow: activeDay === 'day2' ? '0 4px 12px rgba(249,115,22,0.2)' : 'none', transition: 'all 0.2s ease'}}
                      onClick={() => setActiveDay('day2')}
                    >Day 2</div>
                  </div>

                  {/* Weather Info */}
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                      <div style={{fontSize: '36px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'}}>
                        {activeDay === 'day1' ? '☁️' : '☀️'}
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{fontSize: '16px', fontWeight: 700, color: '#475569', marginBottom: '2px'}}>
                          {activeDay === 'day1' ? 'Saturday' : 'Sunday'}
                        </div>
                        <div style={{fontSize: '14px', fontWeight: 500, color: '#94A3B8'}}>
                          {activeDay === 'day1' ? '16° low' : '18° low'}
                        </div>
                      </div>
                    </div>
                    <div style={{fontSize: '36px', fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-1px'}}>
                      {activeDay === 'day1' ? '22°' : '25°'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-container">
                <div className={`timeline-line ${activeDay === 'day1' ? 'blue' : 'orange'}`}></div>
                
                {activeDay === 'day1' && (
                  <>
                    <div className="timeline-item">
                      <div className="timeline-dot blue"></div>
                      <div className="timeline-card">
                        <div style={{width: '100%'}}>
                          <div className="timeline-header">
                            <span className="timeline-emoji">🚗</span>
                            <span className="timeline-time blue">6:00 AM</span>
                            <span className="timeline-title">Leave Bangalore</span>
                          </div>
                          <p className="timeline-desc">Beat traffic — early start recommended</p>
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot blue"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('resort')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🏨</span>
                              <span className="timeline-time blue">10:00 AM</span>
                              <span className="timeline-title">Arrive at Resort</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'resort' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Check-in starts at 11 AM</p>

                          {expandedTimelineItem === 'resort' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" alt="Resort" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <span className="attr-pill blue">4.7★ Rating</span>
                                <span className="attr-pill green">Early Drop-off OK</span>
                                <span className="attr-pill purple" style={{backgroundColor: '#F3E8FF', color: '#7E22CE'}}>📍 At your stay</span>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                Coorg Wilderness Resort. You can drop off your bags early and enjoy a welcome drink in the lobby before check-in.
                              </p>
                              <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                                <button style={{flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer'}}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                  View Map
                                </button>
                                <button style={{flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); onNavigate('hotel_details'); }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                  Hotel Details
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot blue"></div>
                      <div className="timeline-card">
                        <div style={{width: '100%'}}>
                          <div className="timeline-header">
                            <span className="timeline-emoji">🔑</span>
                            <span className="timeline-time blue">11:00 AM</span>
                            <span className="timeline-title">Check-In</span>
                          </div>
                          <p className="timeline-desc">Freshen up and unwind</p>
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot blue"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('raintree')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🍽️</span>
                              <span className="timeline-time blue">1:00 PM</span>
                              <span className="timeline-title">Lunch at Raintree</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'raintree' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Rated #1 restaurant in Coorg</p>

                          {expandedTimelineItem === 'raintree' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" alt="Raintree Restaurant" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 5 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 1 PM - 2 PM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> Low</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 60 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                Located in a beautiful heritage bungalow, serving authentic Coorgi cuisine including their famous Pandi Curry and Akki Roti.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot blue"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('coffee')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">☕</span>
                              <span className="timeline-time blue">3:00 PM</span>
                              <span className="timeline-title">Coffee Plantation Tour</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'coffee' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Guided 90-minute experience</p>

                          {expandedTimelineItem === 'coffee' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=400&q=80" alt="Coffee Plantation" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 12 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 3 PM - 4:30 PM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> Medium</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 90 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                Walk through lush estates, learn the coffee-making process, and enjoy fresh tasting sessions.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot blue"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('sunset')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🌅</span>
                              <span className="timeline-time blue">6:00 PM</span>
                              <span className="timeline-title">Sunset Point View</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'sunset' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Don't miss this — magical hour</p>

                          {expandedTimelineItem === 'sunset' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=400&q=80" alt="Sunset Point" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 15 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 6 PM - 7 PM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> High</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 60 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                Panoramic views of the valleys illuminated by the setting sun. A perfect way to end the day.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeDay === 'day2' && (
                  <>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('breakfast')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🥞</span>
                              <span className="timeline-time orange">7:00 AM</span>
                              <span className="timeline-title">Breakfast</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'breakfast' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Enjoy included hotel breakfast</p>

                          {expandedTimelineItem === 'breakfast' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80" alt="Breakfast Buffet" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 0 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 7 AM - 8 AM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> Low</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 60 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                The resort offers a lavish spread of Continental, South Indian, and fresh Coorg coffee right by the infinity pool.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('abbey')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">💧</span>
                              <span className="timeline-time orange">8:00 AM</span>
                              <span className="timeline-title">Abbey Falls</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'abbey' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Low crowds in the morning</p>

                          {expandedTimelineItem === 'abbey' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1621245084997-15d2a93910c2?auto=format&fit=crop&w=400&q=80" alt="Abbey Falls" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 20 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 8 AM - 10 AM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> Low</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 2 hours</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                A breathtaking waterfall nestled amidst coffee plantations and spice estates. A hanging bridge offers a great vantage point.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('raja')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🏛️</span>
                              <span className="timeline-time orange">11:00 AM</span>
                              <span className="timeline-title">Raja's Seat</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'raja' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Best panoramic views of valley</p>

                          {expandedTimelineItem === 'raja' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=400&q=80" alt="Raja's Seat" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 18 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 11 AM - 12:30 PM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> Medium</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 90 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                A seasonal garden of flowers and artificial fountains. It was a favorite spot of the kings of Coorg to watch sunsets.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('local_lunch')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🍛</span>
                              <span className="timeline-time orange">1:00 PM</span>
                              <span className="timeline-title">Lunch at local café</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'local_lunch' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Try pandi curry — Coorg specialty</p>

                          {expandedTimelineItem === 'local_lunch' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80" alt="Local Cafe" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 3 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 1 PM - 2 PM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> Medium</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 60 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                Taste of Coorg. A cozy local spot near Raja's Seat known for its authentic flavors and generous portions.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card" onClick={() => toggleTimelineItem('market')} style={{cursor: 'pointer'}}>
                        <div style={{width: '100%'}}>
                          <div className="timeline-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <span className="timeline-emoji">🛍️</span>
                              <span className="timeline-time orange">2:30 PM</span>
                              <span className="timeline-title">Local Market & Shopping</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTimelineItem === 'market' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', border: '1.5px solid #E2E8F0', borderRadius: '50%', padding: '3px', boxSizing: 'content-box' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <p className="timeline-desc">Coffee, spices, honey</p>

                          {expandedTimelineItem === 'market' && (
                            <div className="animate-fade-in" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0'}} onClick={(e) => e.stopPropagation()}>
                              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" alt="Local Market" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />
                              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                                <div className="attr-pill blue"><span className="attr-pill-icon" style={{marginRight: '4px'}}>📍</span> 4 km</div>
                                <div className="attr-pill orange"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏰</span> 2:30 PM - 4 PM</div>
                                <div className="attr-pill green"><span className="attr-pill-icon" style={{marginRight: '4px'}}>👥</span> High</div>
                                <div className="attr-pill purple"><span className="attr-pill-icon" style={{marginRight: '4px'}}>⏳</span> 90 min</div>
                              </div>
                              <p style={{margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 500}}>
                                Perfect time to buy authentic Coorgi spices, freshly ground coffee, and pure homemade chocolates for friends and family.
                              </p>
                              <button style={{marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer'}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                View on Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card">
                        <div style={{width: '100%'}}>
                          <div className="timeline-header">
                            <span className="timeline-emoji">🛣️</span>
                            <span className="timeline-time orange">4:00 PM</span>
                            <span className="timeline-title">Return Journey</span>
                          </div>
                          <p className="timeline-desc">Head back before dark</p>
                        </div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot orange"></div>
                      <div className="timeline-card">
                        <div style={{width: '100%'}}>
                          <div className="timeline-header">
                            <span className="timeline-emoji">🌃</span>
                            <span className="timeline-time orange">8:00 PM</span>
                            <span className="timeline-title">Reach Bangalore</span>
                          </div>
                          <p className="timeline-desc">Home safely</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card 3 */}
        <div className="full-info-card animate-slide-up delay-200" onClick={() => toggleCard('my_stay')} style={{cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div className="fic-icon" style={{backgroundColor: '#FFF7ED'}}>
              <span style={{fontSize: '24px'}}>🏨</span>
            </div>
            <div className="fic-text">
              <h3>My Stay</h3>
              <p>Coorg Wilderness Resort</p>
            </div>
            <div className="fic-arrow" style={{ transform: expandedCard === 'my_stay' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

          {expandedCard === 'my_stay' && (
            <div className="attr-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{marginTop: '16px'}}>
              
              <div className="hotel-card">
                <div className="hotel-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80')"}}>
                  <h4 className="hotel-title">Coorg Wilderness Resort</h4>
                  <div className="hotel-rating">
                    ★ ★ ★ ★ ★ <span>4.7 · 512 reviews</span>
                  </div>
                </div>
                <div className="hotel-amenities">
                  <div className="hotel-amenity-pill">📶 Free WiFi</div>
                  <div className="hotel-amenity-pill">🏊 Pool</div>
                  <div className="hotel-amenity-pill">🍽️ Restaurant</div>
                  <div className="hotel-amenity-pill">🚗 Parking</div>
                  <div className="hotel-amenity-pill">☕ Breakfast</div>
                </div>
                <button className="hotel-details-btn" onClick={() => onNavigate('hotel_details')}>View Hotel Details & Photos &gt;</button>
              </div>

            </div>
          )}
        </div>

        {/* Card 4 */}
        <div className="full-info-card animate-slide-up delay-200" onClick={() => toggleCard('why_love')} style={{cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div className="fic-icon" style={{backgroundColor: '#FEF2F2'}}>
              <span style={{fontSize: '24px'}}>✨</span>
            </div>
            <div className="fic-text">
              <h3>Why You'll Love This Trip</h3>
              <p>Weather · Packing · Stay · Cost · Insights</p>
            </div>
            <div className="fic-arrow" style={{ transform: expandedCard === 'why_love' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

          {expandedCard === 'why_love' && (
            <div className="why-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
              
              {/* 1. Why AI Recommends This */}
              <h4 className="section-title">✨ Why AI Recommends This</h4>
              <div className="ai-reasons-grid">
                <div className="ai-reason-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Matches your ₹15,000 budget</span>
                </div>
                <div className="ai-reason-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Within 4 hrs from Bangalore</span>
                </div>
                <div className="ai-reason-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Perfect weather this weekend</span>
                </div>
                <div className="ai-reason-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Highly rated resort (4.7★)</span>
                </div>
                <div className="ai-reason-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Lower crowd levels</span>
                </div>
                <div className="ai-reason-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Best for relaxation goals</span>
                </div>
              </div>

              {/* 2. Weekend Weather */}
              <h4 className="section-title">⛅ Weekend Weather</h4>
              <div className="weather-grid">
                <div className="weather-card">
                  <span className="weather-day">Sat</span>
                  <span className="weather-icon">☁️</span>
                  <span className="weather-high">22°</span>
                  <span className="weather-low">16° low</span>
                </div>
                <div className="weather-card">
                  <span className="weather-day">Sun</span>
                  <span className="weather-icon">☀️</span>
                  <span className="weather-high">24°</span>
                  <span className="weather-low">17° low</span>
                </div>
                <div className="weather-card">
                  <span className="weather-day">Mon</span>
                  <span className="weather-icon">⛅</span>
                  <span className="weather-high">21°</span>
                  <span className="weather-low">15° low</span>
                </div>
              </div>
              <div className="ai-tip-box">
                <span style={{fontSize: '20px'}}>🤖</span>
                <span><b>AI Tip:</b> Perfect 8 AM–5 PM. Carry a light jacket — drops to 16°C after sunset.</span>
              </div>

              {/* 3. Packing Guide */}
              <h4 className="section-title">🎒 Packing Guide</h4>
              <div className="packing-tabs">
                <div className={`packing-tab ${activePackingTab === 'saturday' ? 'active' : ''}`} onClick={() => setActivePackingTab('saturday')}>
                  👕 Saturday
                </div>
                <div className={`packing-tab ${activePackingTab === 'sunday' ? 'active' : ''}`} onClick={() => setActivePackingTab('sunday')}>
                  ☀️ Sunday
                </div>
                <div className={`packing-tab ${activePackingTab === 'general' ? 'active' : ''}`} onClick={() => setActivePackingTab('general')}>
                  🎒 General
                </div>
              </div>
              <div className="packing-pills">
                <div className="packing-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Light Jacket
                </div>
                <div className="packing-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Comfortable Shoes
                </div>
                <div className="packing-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Casual Wear
                </div>
                <div className="packing-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Power Bank
                </div>
              </div>


              {/* 5. Cost Breakdown */}
              <h4 className="section-title">💰 Cost Breakdown</h4>
              <div className="cost-card">
                <div className="cost-flex">
                  <div className="cost-chart">
                    <svg viewBox="0 0 36 36" style={{width: '100%', height: '100%'}}>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="8"></circle>
                      {/* Very simple representation of donut slices */}
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray="20 100" strokeDashoffset="25"></circle>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F97316" strokeWidth="8" strokeDasharray="30 100" strokeDashoffset="5"></circle>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeDasharray="15 100" strokeDashoffset="-25"></circle>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="10 100" strokeDashoffset="-40"></circle>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#94A3B8" strokeWidth="8" strokeDasharray="5 100" strokeDashoffset="-50"></circle>
                    </svg>
                  </div>
                  <div className="cost-legend">
                    <div className="cost-item"><span style={{display: 'flex', alignItems: 'center'}}><span className="cost-dot" style={{backgroundColor: '#2563EB'}}></span> Transport</span> <span>₹3,500</span></div>
                    <div className="cost-item"><span style={{display: 'flex', alignItems: 'center'}}><span className="cost-dot" style={{backgroundColor: '#F97316'}}></span> Hotel</span> <span>₹7,000</span></div>
                    <div className="cost-item"><span style={{display: 'flex', alignItems: 'center'}}><span className="cost-dot" style={{backgroundColor: '#8B5CF6'}}></span> Food</span> <span>₹2,000</span></div>
                    <div className="cost-item"><span style={{display: 'flex', alignItems: 'center'}}><span className="cost-dot" style={{backgroundColor: '#10B981'}}></span> Activities</span> <span>₹1,500</span></div>
                    <div className="cost-item"><span style={{display: 'flex', alignItems: 'center'}}><span className="cost-dot" style={{backgroundColor: '#94A3B8'}}></span> Taxes</span> <span>₹1,000</span></div>
                    <div className="cost-item total"><span>Total</span> <span>₹15,000</span></div>
                  </div>
                </div>

              </div>

              {/* 6. Experience Before You Go */}
              <h4 className="section-title">🎬 Experience Before You Go</h4>
              <div className="experience-scroll">
                <div className="experience-video" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80')"}}>
                  <div className="experience-play">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                  <span className="experience-title">Coorg in Monsoon</span>
                </div>
                <div className="experience-video" style={{backgroundImage: "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80')"}}>
                  <div className="experience-play">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                  <span className="experience-title">Coffee Tour</span>
                </div>
                <div className="experience-video" style={{backgroundImage: "url('https://images.unsplash.com/photo-1596449175510-2e38c92a95c9?auto=format&fit=crop&w=400&q=80')"}}>
                  <div className="experience-play">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                  <span className="experience-title">Abbey Falls Drone View</span>
                </div>
              </div>

              {/* 7. Local Insights */}
              <h4 className="section-title">📍 Local Insights</h4>
              <div className="local-insight-card">
                <div className="local-insight-icon">🍛</div>
                <div className="local-insight-text">
                  <h5>Local Foods</h5>
                  <p>Pandi Curry, Kadambuttu, Koli Curry</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">☕</div>
                <div className="local-insight-text">
                  <h5>Best Cafés</h5>
                  <p>Coorg Wilderness, Filter Coffee Bar</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">🏧</div>
                <div className="local-insight-text">
                  <h5>ATM</h5>
                  <p>SBI & HDFC in Madikeri Town (10 km)</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">📶</div>
                <div className="local-insight-text">
                  <h5>Network</h5>
                  <p>Airtel & Jio — good in town, patchy in estates</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">🚨</div>
                <div className="local-insight-text">
                  <h5>Emergency</h5>
                  <p>Police: 100 · Hospital: 0824-2225566</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">⛽</div>
                <div className="local-insight-text">
                  <h5>Petrol Pump</h5>
                  <p>BPCL station at NH-275 (8 km)</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">🏥</div>
                <div className="local-insight-text">
                  <h5>Nearest Hospital</h5>
                  <p>Madikeri General — 12 km</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">🗣️</div>
                <div className="local-insight-text">
                  <h5>Language</h5>
                  <p>Kannada, Kodava · English widely spoken</p>
                </div>
              </div>
              <div className="local-insight-card">
                <div className="local-insight-icon">🛡️</div>
                <div className="local-insight-text">
                  <h5>Safety Rating</h5>
                  <p>Very Safe · 4.8/5 traveler ratings</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Backdrop Blur Overlay */}
      {isGroupExpanded && (
        <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 90, animation: 'fadeIn 0.2s ease-out' }} onClick={() => setIsGroupExpanded(false)} />
      )}

      {/* Sticky Bottom Bar */}
      <div className="itin-bottom-bar animate-slide-up delay-300" style={{ zIndex: 100, padding: isGroupExpanded ? '24px 20px 32px' : '16px 20px', borderTopLeftRadius: isGroupExpanded ? '32px' : '0', borderTopRightRadius: isGroupExpanded ? '32px' : '0', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        
        {/* Travel Buddies Section */}
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
              <div className="expanded-section-title" style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
                <span className="mr-2">💰</span> Trip Expense Sharing
              </div>

              <div className="expense-summary-card" style={{ marginBottom: '24px' }}>
                <div className="expense-stat">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">₹15,000</span>
                </div>
                <div className="stat-divider"></div>
                <div className="expense-stat">
                  <span className="stat-label">Per Person</span>
                  <span className="stat-value text-blue">₹3,750</span>
                </div>
                <div className="stat-divider"></div>
                <div className="expense-stat">
                  <span className="stat-label">Paid</span>
                  <span className="stat-value text-green">2/4</span>
                </div>
              </div>

              <div className="rec-expense-members-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {GROUP_MEMBERS.map((member, i) => (
                  <div key={i} className="rec-expense-member-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', border: '1px solid #F1F5F9', borderRadius: '16px', padding: '12px 16px' }}>
                    <div className="member-avatar-lg" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', backgroundColor: MEMBER_COLORS[i], color: MEMBER_TEXT_COLORS[i] }}>
                      {member.initial}
                    </div>
                    <span className="member-name" style={{ flex: 1, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>{member.name}</span>
                    <span className="member-amount" style={{ fontWeight: '800', fontSize: '15px', color: '#0F172A' }}>{member.amount}</span>
                    {member.status === 'Paid' ? (
                      <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', backgroundColor: '#ECFDF5', color: '#059669' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Paid
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
        </div>

        {/* Bottom Actions (Always show) */}
        <div className="itin-bottom-actions" style={{ marginTop: '16px' }}>
          <button className="mic-btn-large">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </button>
          <button className="approve-btn">
              <span>Approve & Pay</span>
              <span>₹3,750</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
