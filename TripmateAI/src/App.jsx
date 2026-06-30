import { useState } from 'react';
import Home from './components/Home';
import ChatInterface from './components/ChatInterface';
import Recommendations from './components/Recommendations';
import Itinerary from './components/Itinerary';
import DiscoveryFeed from './components/DiscoveryFeed';
import Profile from './components/Profile';
import SideMenu from './components/SideMenu';
import GettingThere from './components/GettingThere';
import HotelDetails from './components/HotelDetails';

function App() {
  const [currentStage, setCurrentStage] = useState('home');
  const [exploreBackStage, setExploreBackStage] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleNavigate = (stage, data) => {
    if (stage === 'explore') {
      // If navigating to explore, check where we are coming from
      if (currentStage === 'express') {
        setExploreBackStage('express');
      } else {
        setExploreBackStage('home');
      }
    }
    if (stage === 'discovery') {
      setSelectedDestination(data || null);
    }
    setCurrentStage(stage);
  };

  return (
    <div className="app-container">
      {currentStage === 'home' && (
        <Home onNavigate={handleNavigate} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}
      {currentStage === 'discovery' && (
        <DiscoveryFeed 
          initialDestination={selectedDestination}
          onBack={() => {
            if (selectedDestination) {
              setSelectedDestination(null);
              handleNavigate('explore');
            } else {
              handleNavigate('home');
            }
          }} 
          onNavigate={handleNavigate} 
          onMenuClick={() => setIsSideMenuOpen(true)}
        />
      )}
      {currentStage === 'express' && (
        <ChatInterface onComplete={() => handleNavigate('explore')} onBack={() => handleNavigate('home')} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}
      {currentStage === 'explore' && (
        <Recommendations onBack={() => handleNavigate(exploreBackStage)} onNavigate={handleNavigate} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}
      {currentStage === 'evaluate' && (
        <Itinerary onBack={() => handleNavigate('explore')} onNavigate={handleNavigate} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}
      {currentStage === 'hotel_details' && (
        <HotelDetails onBack={() => handleNavigate('evaluate')} onNavigate={handleNavigate} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}
      {currentStage === 'getting_there' && (
        <GettingThere onBack={() => handleNavigate('evaluate')} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}
      {currentStage === 'profile' && (
        <Profile onNavigate={handleNavigate} onMenuClick={() => setIsSideMenuOpen(true)} />
      )}

      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        onNavigate={handleNavigate} 
      />
    </div>
  );
}

export default App;
