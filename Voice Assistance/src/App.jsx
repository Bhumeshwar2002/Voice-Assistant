// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import aiAvatar from './ai-generated-concept-human.jpg';
// import VoiceWakeUp from './VoiceWakeUp';

// const App = () => {
//   const [transcript, setTranscript] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [information, setInformation] = useState('');
//   const [voices, setVoices] = useState([]);
//   const [isActive, setIsActive] = useState(false);
//   const [energyPulse, setEnergyPulse] = useState(0);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const loadVoices = () => {
//       const allVoices = window.speechSynthesis.getVoices();
//       setVoices(allVoices);
//     };

//     if (typeof window !== 'undefined' && window.speechSynthesis) {
//       loadVoices();
//       window.speechSynthesis.onvoiceschanged = loadVoices;
//     }
//   }, []);

//   useEffect(() => {
//     if (isListening) {
//       const interval = setInterval(() => {
//         setEnergyPulse(Math.random() * 100);
//       }, 300);
//       return () => clearInterval(interval);
//     }
//   }, [isListening]);

//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return alert('Speech recognition not supported.');

//     if (!recognitionRef.current) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = 'en-US';
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.maxAlternatives = 1;

//       recognitionRef.current.onresult = (event) => {
//         const spokenText = event.results[0][0].transcript.toLowerCase();
//         setTranscript(spokenText);
//         handleVoiceCommand(spokenText);
//       };

//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//         setTimeout(() => setIsActive(false), 2000);
//       };
//     }

//     recognitionRef.current.start();
//     setIsListening(true);
//     setIsActive(true);
//   };

//   const speakText = (text) => {
//     if (voices.length === 0) {
//       console.warn('Voices not loaded yet.');
//       return;
//     }

//     const voice =
//       voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
//       voices.find(v => v.lang.startsWith('en')) ||
//       voices[0];

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.voice = voice;
//     utterance.lang = voice.lang;
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     utterance.volume = 1;

//     // Wait until voices are fully ready before speaking
//     const speak = () => {
//       if (!window.speechSynthesis.speaking) {
//         window.speechSynthesis.speak(utterance);
//       } else {
//         setTimeout(speak, 100);
//       }
//     };
//     speak();
//   };

//   const handleVoiceCommand = async (command) => {
//     const sitesMap = {
//       youtube: 'https://www.youtube.com',
//       facebook: 'https://www.facebook.com',
//       google: 'https://www.google.com',
//       twitter: 'https://www.twitter.com',
//       instagram: 'https://www.instagram.com',
//     };

//     if (command.startsWith('open')) {
//       const site = command.split('open ')[1].trim();
//       if (sitesMap[site]) {
//         speakText(`Opening ${site}`);
//         window.open(sitesMap[site], '_blank');
//         setInformation(`Opened ${site}`);
//         return;
//       } else {
//         speakText(`I don't know how to open ${site}`);
//         setInformation(`Could not find the website for ${site}`);
//         return;
//       }
//     }

//     const gptResponse = await fetchGPTResponse(command);
//     if (gptResponse) {
//       speakText(gptResponse);
//       setInformation(gptResponse);
//     } else {
//       speakText("I'm still learning. Can you rephrase that?");
//       setInformation("I'm still learning. Can you rephrase that?");
//     }
//   };

//   const fetchGPTResponse = async (userQuery) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/chat', {
//         message: userQuery,
//       });
//       return response.data.reply || "I'm still learning. Can you rephrase that?";
//     } catch (error) {
//       console.error('Error contacting backend server:', error);
//       return "I encountered an error processing your request.";
//     }
//   };


import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import aiAvatar from './ai-generated-concept-human.jpg';
import VoiceWakeUp from './VoiceWakeUp';

const App = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [information, setInformation] = useState('');
  const [voices, setVoices] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [energyPulse, setEnergyPulse] = useState(0);
  const recognitionRef = useRef(null);

  const cache = useRef(new Map()); // Cache for storing responses

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setEnergyPulse(Math.random() * 100);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  // const startListening = () => {
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (!SpeechRecognition) return alert('Speech recognition not supported.');

  //   if (!recognitionRef.current) {
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.lang = 'en-US';
  //     recognitionRef.current.interimResults = false;
  //     recognitionRef.current.maxAlternatives = 1;

  //     recognitionRef.current.onresult = (event) => {
  //       const spokenText = event.results[0][0].transcript.toLowerCase();
  //       setTranscript(spokenText);
  //       handleVoiceCommand(spokenText);
  //     };

  //     recognitionRef.current.onend = () => {
  //       setIsListening(false);
  //       setTimeout(() => setIsActive(false), 2000);
  //     };
  //   }

  //   recognitionRef.current.start();
  //   setIsListening(true);
  //   setIsActive(true);
  // };

  const startListening = () => {
    if (isListening) return; // prevent duplicate triggers
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech recognition not supported.');
  
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
  
      recognitionRef.current.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.toLowerCase();
        setTranscript(spokenText);
        handleVoiceCommand(spokenText);
      };
  
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTimeout(() => setIsActive(false), 2000);
      };
    }
  
    recognitionRef.current.start();
    setIsListening(true);
    setIsActive(true);
  };
  
  const speakText = (text) => {
    if (voices.length === 0) {
      console.warn('Voices not loaded yet.');
      return;
    }

    const voice =
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const speak = () => {
      if (!window.speechSynthesis.speaking) {
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(speak, 100);
      }
    };
    speak();
  };

  const handleVoiceCommand = async (command) => {
    const sitesMap = {
      youtube: 'https://www.youtube.com',
      facebook: 'https://www.facebook.com',
      google: 'https://www.google.com',
      twitter: 'https://www.twitter.com',
      instagram: 'https://www.instagram.com',
    };

    if (command.startsWith('open')) {
      const site = command.split('open ')[1].trim();
      if (sitesMap[site]) {
        speakText(`Opening ${site}`);
        window.open(sitesMap[site], '_blank');
        setInformation(`Opened ${site}`);
        return;
      } else {
        speakText(`I don't know how to open ${site}`);
        setInformation(`Could not find the website for ${site}`);
        return;
      }
    }

    if (cache.current.has(command)) {
      const cachedReply = cache.current.get(command);
      speakText(cachedReply);
      setInformation(cachedReply);
      return;
    }

    const gptResponse = await fetchGPTResponse(command);
    if (gptResponse) {
      cache.current.set(command, gptResponse); // Store in cache
      speakText(gptResponse);
      setInformation(gptResponse);
    } else {
      speakText("I'm still learning. Can you rephrase that?");
      setInformation("I'm still learning. Can you rephrase that?");
    }
  };

  const fetchGPTResponse = async (userQuery) => {
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userQuery,
      });
      return response.data.reply || "I'm still learning. Can you rephrase that?";
    } catch (error) {
      console.error('Error contacting backend server:', error);
      return "I encountered an error processing your request.";
    }
  };
  return (
    <div className="app-container">
      <VoiceWakeUp onWakeWord={startListening} onCommandReceived={handleVoiceCommand} />
      <div className="cyber-grid"></div>

      <div className={`voice-assistant ${isActive ? 'active' : ''}`}>
        <div className="holographic-container">
          <div
            className="holographic-effect"
            style={{ '--pulse-intensity': `${energyPulse}%` }}
          ></div>
          <img src={aiAvatar} alt="AI" className="ai-avatar" />
        </div>

        <h2>
          <span className="cyber-text" data-text="Freddy">Freddy</span>
          <span className="ai-label">AI ASSISTANT</span>
        </h2>

        <div className="voice-feedback">
          <div className={`audio-wave ${isListening ? 'listening' : ''}`}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="wave-bar"></div>
            ))}
          </div>
          <p className="transcript">{transcript || "Awaiting your command..."}</p>
        </div>

        <div className="response-display">
          <div className="response-content">{information || "Ready to assist with your queries"}</div>
          <div className="response-glow"></div>
        </div>

        <button
          className={`activate-btn ${isListening ? 'listening' : ''}`}
          onClick={startListening}
          disabled={isListening}
        >
          <div className="btn-inner">
            <div className="btn-icon"></div>
            <div className="btn-pulse"></div>
            <span>{isListening ? 'Processing...' : 'Activate Freddy'}</span>
          </div>
        </button>
      </div>

      <div className="cyber-circle-1"></div>
      <div className="cyber-circle-2"></div>
    </div>
  );
};

export default App;
