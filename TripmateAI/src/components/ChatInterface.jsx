import { useState, useEffect, useRef } from 'react';
import './ChatInterface.css';
import BrandLogo from './BrandLogo';

const questions = [
  {
    title: "What kind of trip do you want?",
    options: [
      { icon: "😌", label: "Rest and relax" },
      { icon: "🏕️", label: "Fun and action" },
      { icon: "🌿", label: "Nature" },
      { icon: "✨", label: "Very comfortable" }
    ]
  },
  {
    title: "Who are you going with?",
    options: [
      { icon: "👤", label: "Only me" },
      { icon: "💑", label: "Couple" },
      { icon: "👨‍👩‍👧‍👦", label: "Family" },
      { icon: "🍻", label: "Friends" }
    ]
  },
  {
    title: "How much money can you spend?",
    options: [
      { icon: "💸", label: "Less than ₹5k" },
      { icon: "💵", label: "Between ₹5k and ₹15k" },
      { icon: "💎", label: "More than ₹15k" }
    ]
  },
  {
    title: "When do you want to go?",
    options: [
      { icon: "📅", label: "This weekend" },
      { icon: "📆", label: "Next weekend" },
      { icon: "🗓️", label: "Choose dates" }
    ]
  },
  {
    title: "How far can you travel from Bengaluru?",
    options: [
      { icon: "🚗", label: "Up to 2 hours" },
      { icon: "🚙", label: "Up to 4 hours" },
      { icon: "✈️", label: "More than 4 hours is okay" }
    ]
  },
  {
    title: "What kind of place do you like?",
    options: [
      { icon: "🤫", label: "Quiet and peaceful" },
      { icon: "🎉", label: "Busy and fun" },
      { icon: "📸", label: "Beautiful for photos" }
    ]
  }
];

const BotAvatar = () => (
  <div className="chat-avatar small">🤖</div>
);

// Initial seed messages before user starts answering
const SEED_MESSAGES = [
  { type: 'bot', text: "Hello! 👋 I am your travel helper. Answer a few simple questions, and I will find the best places for you.", stepIndex: null },
  { type: 'user', text: 'Help me plan a trip', stepIndex: null },
  { type: 'bot', text: questions[0].title, stepIndex: 0 },
];

const ChatInterface = ({ onComplete, onBack, onMenuClick }) => {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [done, setDone] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const feedRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSelectOption = (optionLabel, atStep = currentStep) => {
    const nextStep = atStep + 1;
    const isLast = nextStep >= questions.length;

    // Build thread: keep everything up to (not including) user answer at atStep
    // then append the new user answer + next bot message
    const keepUntil = messages.findIndex(
      (m) => m.type === 'user' && m.stepIndex === atStep
    );

    const base =
      keepUntil === -1
        ? [...messages] // no existing answer yet — append normally
        : messages.slice(0, keepUntil); // rewind: cut from old answer onwards

    const newMessages = [
      ...base,
      { type: 'user', text: optionLabel, stepIndex: atStep },
    ];

    setMessages(newMessages);
    setIsBotTyping(true);

    setTimeout(() => {
      let finalMessages = [...newMessages];
      if (!isLast) {
        finalMessages.push({ type: 'bot', text: questions[nextStep].title, stepIndex: nextStep });
      } else {
        finalMessages.push({ type: 'bot', text: "🎉 Great! I am finding the best places for you...", stepIndex: null });
      }

      setMessages(finalMessages);
      setCurrentStep(nextStep);
      setDone(isLast);
      setIsBotTyping(false);

      if (isLast) {
        setTimeout(() => onComplete(), 1400);
      }
    }, 1200); // 1.2 seconds thinking time
  };

  // When user taps an old answer to edit it
  const handleEditAnswer = (stepIndex) => {
    // Rewind: slice messages back to before the user message for that step
    const keepUntil = messages.findIndex(
      (m) => m.type === 'user' && m.stepIndex === stepIndex
    );
    if (keepUntil === -1) return;

    setMessages(messages.slice(0, keepUntil));
    setCurrentStep(stepIndex);
    setDone(false);
    setIsBotTyping(false);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim() !== '') {
      handleSelectOption(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleInputSubmit();
  };

  const currentOptions =
    !done && !isBotTyping && currentStep < questions.length
      ? questions[currentStep].options
      : null;

  return (
    <div className="chat-container animate-fade-in">
      <header className="chat-header">
        <button className="chat-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <BrandLogo />
        <button className="chat-hamburger-btn" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      <div className="chat-feed" ref={feedRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.type} animate-slide-up`}>
            {msg.type === 'bot' && <BotAvatar />}

            <div className="chat-bubble-row">
              <div className={`chat-bubble ${msg.type === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
                {msg.text}
              </div>

              {/* Edit button on user answers that correspond to a question */}
              {msg.type === 'user' && msg.stepIndex !== null && (
                <button
                  className="edit-btn"
                  title="Edit this answer"
                  onClick={() => handleEditAnswer(msg.stepIndex)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="chat-message bot animate-slide-up">
            <BotAvatar />
            <div className="chat-bubble-row">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {currentOptions && (
          <div className="chat-options animate-fade-in">
            {currentOptions.map((opt, idx) => (
              <button
                key={idx}
                className="chat-option-btn"
                onClick={() => handleSelectOption(opt.label)}
              >
                <span className="option-icon">{opt.icon}</span>
                <span className="option-label">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-bottom-bar">
        <div className="chat-input-pill">
          <button className="chat-mic-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </button>
          <input
            type="text"
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-send-btn"
            style={inputValue.trim() ? { backgroundColor: '#2563EB' } : {}}
            onClick={handleInputSubmit}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
