import React, { useEffect } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";

function VoiceWakeUp({ onWakeWord }) {
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  const porcupineKeyword = {
    publicPath: "hey-freddy_en_web.ppn",
    label: "freddy",
  };

  const porcupineModel = {
    publicPath: "porcupine_params.pv",
  };

  useEffect(() => {
    const initWakeWord = async () => {
      try {
        await init(import.meta.env.VITE_PICOVOICE_KEY, porcupineKeyword, porcupineModel);
        await start();
      } catch (err) {
        console.error("Porcupine init error:", err);
      }
    };

    if (!isLoaded) {
      initWakeWord();
    }

    return () => {
      release();
    };
  }, [isLoaded]);

  useEffect(() => {
    if (keywordDetection !== null && keywordDetection.label === "freddy") {
      console.log("Wake word detected:", keywordDetection.label);
      onWakeWord(); // triggers speech recognition from App.jsx
    }
  }, [keywordDetection]);

  return (
    <div>
      <h2>🎤 Wake word: “Wake Up Freddy”</h2>
      {error && <p style={{ color: "red" }}>Error: {error.toString()}</p>}
      {!isLoaded && <p>Loading wake word engine...</p>}
      {isListening && <p>✅ Listening for wake word...</p>}
    </div>
  );
}

export default VoiceWakeUp;
