import React from 'react';
import './VoiceModal.css';

const VoiceModal = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const handleSuggestionClick = () => {
    onClose();
    if (onNavigate) {
      onNavigate('express');
    }
  };

  return (
    <div className="voice-modal-overlay" onClick={onClose}>
      <div className="voice-modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Top bar with drag handle and close button */}
        <div className="voice-modal-header">
          <div className="drag-handle"></div>
          <button className="voice-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <h3 className="voice-modal-title">VOICE ASSISTANT</h3>

        <div className="voice-mic-container">
          <button className="voice-large-mic">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </button>
        </div>

        <p className="voice-instruction">Tap the mic to start speaking</p>

        <div className="voice-input-box">
          <p className="voice-placeholder">Your words will appear here...</p>
        </div>

        <div className="voice-suggestions-section">
          <h4 className="voice-suggestions-title">TRY SAYING...</h4>
          <div className="voice-suggestion-pill" onClick={handleSuggestionClick}>"I want a relaxing trip within 4 hours"</div>
          <div className="voice-suggestion-pill" onClick={handleSuggestionClick}>"Plan a weekend escape for two, ₹15K budget"</div>
          <div className="voice-suggestion-pill" onClick={handleSuggestionClick}>"Adventure trip with friends this weekend"</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;
