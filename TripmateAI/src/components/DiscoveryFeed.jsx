import { useState, useEffect } from 'react';
import './DiscoveryFeed.css';

const MOCK_FEED = [
  {
    id: 1,
    type: 'destination',
    name: 'Coorg',
    distance: '4 Hours Away',
    weather: '20°C',
    tag: 'Vibe Match',
    match: '90%',
    images: [
      'https://images.unsplash.com/photo-1560357647-62a43d9897bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/flagged/photo-1592544858330-7ac10a0468e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1710612198146-77512950a4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    likes: '24K',
    saves: '8.2K',
    authorImage: 'https://i.pravatar.cc/150?img=32',
    description: 'Hilly area.'
  },
  {
    id: 2,
    type: 'destination',
    name: 'Wayanad',
    distance: '6 Hours Away',
    weather: '22°C',
    tag: 'Trending',
    match: '95%',
    images: [
      'https://plus.unsplash.com/premium_photo-1661962772428-f17249503156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1723709431768-d749b0d814b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    likes: '18K',
    saves: '6.1K',
    authorImage: 'https://i.pravatar.cc/150?img=41',
    description: 'Lush green valleys.'
  },
  {
    id: 3,
    type: 'destination',
    name: 'Ooty',
    distance: '6 Hours Away',
    weather: '18°C',
    tag: 'Popular',
    match: '85%',
    images: [
      'https://plus.unsplash.com/premium_photo-1725408090963-49dd5bfc1baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1660918738010-295b09857f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    likes: '32K',
    saves: '12K',
    authorImage: 'https://i.pravatar.cc/150?img=12',
    description: 'Queen of hill stations.'
  },
  {
    id: 4,
    type: 'destination',
    name: 'Chikmagalur',
    distance: '4.5 Hours Away',
    weather: '21°C',
    tag: 'Coffee Land',
    match: '92%',
    images: [
      'https://plus.unsplash.com/premium_photo-1697730116501-72f5749dffce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1739038034791-a60471396db0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    likes: '15K',
    saves: '5.5K',
    authorImage: 'https://i.pravatar.cc/150?img=22',
    description: 'Coffee estates and hills.'
  },
  {
    id: 5,
    type: 'destination',
    name: 'Bandipur',
    distance: '5 Hours Away',
    weather: '25°C',
    tag: 'Wildlife',
    match: '88%',
    images: [
      'https://plus.unsplash.com/premium_photo-1718570263614-812321f5974f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1540883214770-08e60a9bfd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    likes: '28K',
    saves: '9.2K',
    authorImage: 'https://i.pravatar.cc/150?img=33',
    description: 'National park safari.'
  }
];

const NEARBY_FEED = [
  {
    id: 101,
    type: 'destination',
    name: 'Cubbon Park',
    distance: '15 Mins Away',
    weather: '26°C',
    tag: 'Nature Walk',
    match: '98%',
    images: ['https://images.unsplash.com/photo-1595186985444-245ed783457f?auto=format&fit=crop&w=1080&q=80'],
    likes: '45K',
    saves: '12K',
    authorImage: 'https://i.pravatar.cc/150?img=11',
    description: 'Lung space of the city.'
  },
  {
    id: 102,
    type: 'destination',
    name: 'Lalbagh Botanical',
    distance: '20 Mins Away',
    weather: '27°C',
    tag: 'Gardens',
    match: '94%',
    images: ['https://images.unsplash.com/photo-1596176530529-78163a4f7af2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    likes: '38K',
    saves: '9K',
    authorImage: 'https://i.pravatar.cc/150?img=15',
    description: 'Iconic glass house.'
  },
  {
    id: 103,
    type: 'destination',
    name: 'Bangalore Palace',
    distance: '25 Mins Away',
    weather: '26°C',
    tag: 'Heritage',
    match: '89%',
    images: ['https://images.unsplash.com/photo-1697130383976-38f28c444292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    likes: '50K',
    saves: '15K',
    authorImage: 'https://i.pravatar.cc/150?img=20',
    description: 'Tudor-style architecture.'
  },
  {
    id: 104,
    type: 'destination',
    name: 'Nandi Hills',
    distance: '1.5 Hours Away',
    weather: '22°C',
    tag: 'Sunrise',
    match: '88%',
    images: ['https://images.unsplash.com/photo-1698332137428-3c4296198e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    likes: '60K',
    saves: '22K',
    authorImage: 'https://i.pravatar.cc/150?img=44',
    description: 'Beautiful sunrise views.'
  },
  {
    id: 105,
    type: 'destination',
    name: 'MG Road',
    distance: '10 Mins Away',
    weather: '28°C',
    tag: 'City Life',
    match: '82%',
    images: ['https://images.unsplash.com/photo-1580974582391-a169b18f080c?auto=format&fit=crop&w=1080&q=80'],
    likes: '20K',
    saves: '4K',
    authorImage: 'https://i.pravatar.cc/150?img=5',
    description: 'Shopping and cafes.'
  }
];

const TRIPS_FEED = [
  {
    id: 201,
    type: 'destination',
    name: 'Goa',
    distance: 'Flight: 1h 15m',
    weather: '32°C',
    tag: 'Beaches',
    match: '99%',
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1080&q=80'],
    likes: '120K',
    saves: '40K',
    authorImage: 'https://i.pravatar.cc/150?img=50',
    description: 'Sun, sand, and sea.'
  },
  {
    id: 202,
    type: 'destination',
    name: 'Jaipur',
    distance: 'Flight: 2h 30m',
    weather: '35°C',
    tag: 'Heritage',
    match: '91%',
    images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    likes: '85K',
    saves: '25K',
    authorImage: 'https://i.pravatar.cc/150?img=51',
    description: 'The Pink City.'
  },
  {
    id: 203,
    type: 'destination',
    name: 'Kerala',
    distance: 'Flight: 1h',
    weather: '29°C',
    tag: 'Backwaters',
    match: '96%',
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    likes: '95K',
    saves: '30K',
    authorImage: 'https://i.pravatar.cc/150?img=52',
    description: 'God\'s Own Country.'
  },
  {
    id: 204,
    type: 'destination',
    name: 'Manali',
    distance: 'Flight + Drive',
    weather: '15°C',
    tag: 'Mountains',
    match: '87%',
    images: ['https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    likes: '110K',
    saves: '35K',
    authorImage: 'https://i.pravatar.cc/150?img=53',
    description: 'Snow-capped peaks.'
  },
  {
    id: 205,
    type: 'destination',
    name: 'Agra',
    distance: 'Flight: 2h 15m',
    weather: '38°C',
    tag: 'Wonder',
    match: '94%',
    images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1080&q=80'],
    likes: '200K',
    saves: '60K',
    authorImage: 'https://i.pravatar.cc/150?img=54',
    description: 'Home of the Taj Mahal.'
  }
];

const COORG_FEED = [
  {
    id: 1,
    type: 'destination',
    name: 'Coorg',
    distance: '4 Hours Away',
    weather: '20°C',
    tag: 'Vibe Match',
    match: '90%',
    images: [
      'https://images.unsplash.com/photo-1560357647-62a43d9897bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/flagged/photo-1592544858330-7ac10a0468e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1710612198146-77512950a4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ],
    likes: '24K',
    saves: '8.2K',
    authorImage: 'https://i.pravatar.cc/150?img=32',
    description: 'Hilly area.'
  },
  {
    id: 12,
    type: 'destination',
    name: 'Coorg',
    distance: '4 Hours Away',
    weather: '18°C',
    tag: 'Nature',
    match: '92%',
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    ],
    likes: '15K',
    saves: '4.5K',
    authorImage: 'https://i.pravatar.cc/150?img=41',
    description: 'Beautiful waterfalls and coffee estates.'
  },
  {
    id: 13,
    type: 'destination',
    name: 'Coorg',
    distance: '4 Hours Away',
    weather: '19°C',
    tag: 'Relaxing',
    match: '88%',
    images: [
      'https://images.unsplash.com/photo-1542314831-c6a4d14d4fe6?auto=format&fit=crop&w=800&q=80'
    ],
    likes: '31K',
    saves: '11K',
    authorImage: 'https://i.pravatar.cc/150?img=12',
    description: 'Luxury stays amidst nature.'
  },
  {
    id: 14,
    type: 'destination',
    name: 'Coorg',
    distance: '4 Hours Away',
    weather: '18°C',
    tag: 'Trekking',
    match: '91%',
    images: [
      'https://images.unsplash.com/photo-1590526002933-4f96d6da21b4?auto=format&fit=crop&w=800&q=80'
    ],
    likes: '18K',
    saves: '6.3K',
    authorImage: 'https://i.pravatar.cc/150?img=28',
    description: 'Trekking trails through lush forests.'
  },
  {
    id: 15,
    type: 'destination',
    name: 'Coorg',
    distance: '4 Hours Away',
    weather: '17°C',
    tag: 'Hidden Gem',
    match: '95%',
    images: [
      'https://images.unsplash.com/photo-1623356302022-63d80016a2d2?auto=format&fit=crop&w=800&q=80'
    ],
    likes: '42K',
    saves: '14.5K',
    authorImage: 'https://i.pravatar.cc/150?img=47',
    description: 'Secret viewpoints.'
  }
];

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {images.map((img, idx) => (
        <div 
          key={idx}
          style={{
            backgroundImage: `url(${img})`,
            opacity: idx === currentIndex ? 1 : 0,
            transform: idx % 2 === 0 
                ? (idx === currentIndex ? 'scale(1.1)' : 'scale(1)') 
                : (idx === currentIndex ? 'scale(1)' : 'scale(1.1)'),
            transition: 'opacity 1.5s ease-in-out, transform 12s linear',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
      ))}
    </>
  );
};

const DiscoveryFeed = ({ initialDestination, onBack, onNavigate, onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('weekend');
  
  const [liked, setLiked] = useState(() => {
    try {
      const item = localStorage.getItem('tripmate_liked');
      return item ? JSON.parse(item) : {};
    } catch (error) {
      return {};
    }
  });

  const [saved, setSaved] = useState(() => {
    try {
      const item = localStorage.getItem('tripmate_saved');
      return item ? JSON.parse(item) : {};
    } catch (error) {
      return {};
    }
  });

  const [isInputExpanded, setIsInputExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('tripmate_liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem('tripmate_saved', JSON.stringify(saved));
  }, [saved]);

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSave = (id) => setSaved(prev => ({ ...prev, [id]: !prev[id] }));

  const getActiveFeed = () => {
    let feed = [];
    if (activeTab === 'saved') {
      const allItems = [...NEARBY_FEED, ...MOCK_FEED, ...TRIPS_FEED];
      feed = allItems.filter(item => saved[item.id]);
    } else if (activeTab === 'nearby') {
      feed = NEARBY_FEED;
    } else if (activeTab === 'vacation') {
      feed = TRIPS_FEED;
    } else {
      feed = MOCK_FEED; // weekend
    }

    if (initialDestination) {
      if (initialDestination === 'Coorg') {
        return COORG_FEED;
      }
      return feed.filter(item => item.name === initialDestination);
    }
    return feed;
  };

  const currentFeed = getActiveFeed();

  return (
    <div className="discovery-feed-container bg-dark animate-fade-in">
      
      {/* Top Navigation Overlay */}
      {initialDestination ? (
        <div className="discovery-top-nav nav-dark" style={{ justifyContent: 'flex-start', paddingLeft: '16px' }}>
          <button className="reel-back-btn" onClick={onBack} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
        </div>
      ) : activeTab !== 'saved' && (
        <div className={`discovery-top-nav nav-dark reel-pills-only`}>
          <div className="tabs-container">
             <button className={activeTab === 'nearby' ? 'active' : ''} onClick={() => setActiveTab('nearby')}>
              <span role="img" aria-label="nearby">📍</span> Nearby
             </button>
             <button className={activeTab === 'weekend' ? 'active' : ''} onClick={() => setActiveTab('weekend')}>
              <span role="img" aria-label="weekend">🚗</span> Weekend
             </button>
             <button className={activeTab === 'vacation' ? 'active' : ''} onClick={() => setActiveTab('vacation')}>
              <span role="img" aria-label="vacation">✈️</span> Trips
             </button>
          </div>
        </div>
      )}

      {/* Feed Container */}
      <div key={activeTab} className="feed-scroll-container reel" style={{ overflowY: 'auto' }}>
        {currentFeed.length === 0 && activeTab === 'saved' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.6)', padding: '20px', textAlign: 'center' }}>
            <svg aria-label="Saved" color="currentColor" fill="currentColor" height="48" viewBox="0 0 24 24" width="48" style={{ marginBottom: '16px' }}><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
            <h2>No saved reels yet</h2>
            <p style={{ marginTop: '8px' }}>Tap the bookmark icon on any reel to save it here.</p>
          </div>
        ) : (
          currentFeed.map((item) => (
            <div key={item.id} className="feed-item">
            
            {/* Reel View */}
            <div className="destination-card-reel">
              {item.images && <ImageSlider images={item.images} />}
              <div className="dest-gradient-overlay"></div>
              
              {/* Right Side Social Actions */}
              <div className="social-actions-reel">
                <button className="social-btn" onClick={() => toggleLike(item.id)}>
                  {liked[item.id] ? (
                    <svg aria-label="Unlike" color="#EF4444" fill="#EF4444" height="28" viewBox="0 0 48 48" width="28"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                  ) : (
                    <svg aria-label="Like" color="white" fill="none" height="28" viewBox="0 0 24 24" width="28"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 2.369 1.174 3.208 0A4.21 4.21 0 0 1 16.792 3.904Z" stroke="currentColor" strokeWidth="2"></path></svg>
                  )}
                  <span>{item.likes || 'Likes'}</span>
                </button>
                <button className="social-btn">
                  <svg aria-label="Comment" color="white" fill="none" height="28" viewBox="0 0 24 24" width="28"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  <span>145</span>
                </button>
                <button className="social-btn">
                  <svg aria-label="Share Post" color="white" fill="none" height="28" viewBox="0 0 24 24" width="28"><line stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                  <span>89</span>
                </button>
                <button className="social-btn" onClick={() => toggleSave(item.id)}>
                  {saved[item.id] ? (
                    <svg aria-label="Remove" color="white" fill="white" height="28" viewBox="0 0 24 24" width="28"><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>
                  ) : (
                    <svg aria-label="Save" color="white" fill="none" height="28" viewBox="0 0 24 24" width="28"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                  )}
                  <span>{item.saves || 'Save'}</span>
                </button>
              </div>

              {/* Bottom Left Info */}
              <div className="dest-info-reel">
                <div className="dest-title-with-profile">
                  <img src={item.authorImage} alt="author" className="author-profile-img" />
                  <h2>{item.name}</h2>
                </div>
                <div className="dest-meta-reel">
                  <span>🚗 {item.distance}</span>
                  <span>🌡️ {item.weather}</span>
                  <span>⛰️ {item.description}</span>
                </div>
                <div className="dest-badges-container">
                  <div className="dest-badge-reel">{item.tag}</div>
                  <div className="dest-badge-reel match-score">{item.match}</div>
                </div>
              </div>

              {/* Input Action Bar */}
              <div className={`reel-bottom-input-bar ${isInputExpanded ? 'expanded' : ''} ${initialDestination ? 'no-nav' : ''}`}>
                <div className="reel-input-wrapper">
                  {isInputExpanded && (
                    <button className="reel-mic-btn-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                    </button>
                  )}
                  <input 
                    type="text" 
                    placeholder="Type your desire" 
                    className="reel-input-field" 
                    onFocus={() => setIsInputExpanded(true)}
                    onBlur={() => setTimeout(() => setIsInputExpanded(false), 200)}
                  />
                  {!isInputExpanded ? (
                    <button className="reel-mic-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                    </button>
                  ) : (
                    <button className="reel-submit-btn" onClick={() => onNavigate('evaluate')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  )}
                </div>
                {!isInputExpanded && (
                  <button className="reel-view-btn" onClick={() => onNavigate('evaluate')}>
                    Let's Plan <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                )}
              </div>
            </div>
            
          </div>
        ))
        )}
      </div>

      {/* 4-Icon Bottom Navigation Bar */}
      {!initialDestination && (
        <div className="bottom-nav-bar nav-dark">
        <button className="bottom-nav-item" onClick={() => onNavigate('home')}>
          <svg aria-label="Home" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
        </button>
        <button className={`bottom-nav-item ${activeTab !== 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('weekend')}>
          <svg aria-label="Reels" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
          </svg>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
          <svg aria-label="Saved" color="currentColor" fill={activeTab === 'saved' ? "currentColor" : "none"} height="24" viewBox="0 0 24 24" width="24"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
        </button>
        <button className="bottom-nav-item">
          <svg aria-label="Profile" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;
