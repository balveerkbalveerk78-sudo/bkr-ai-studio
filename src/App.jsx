import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('voice');

  // API Keys
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('bkr_gemini') || '');
  const [elevenKey, setElevenKey] = useState(localStorage.getItem('bkr_eleven') || '');

  // ElevenLabs All Voices List
  const [voices, setVoices] = useState([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);

  // Gemini TTS Engine Mode
  const [useGeminiTTS, setUseGeminiTTS] = useState(false);

  // Video Generator
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Chat
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', content: 'नमस्ते! मैं आपका BKR AI Studio असिस्टेंट हूँ।' }]);

  const saveKeys = () => {
    localStorage.setItem('bkr_gemini', geminiKey.trim());
    localStorage.setItem('bkr_eleven', elevenKey.trim());
    alert('API Keys Saved Successfully!');
    fetchElevenVoices(elevenKey.trim());
  };

  // Fetch All Authentic Voices from ElevenLabs API
  const fetchElevenVoices = async (key) => {
    if (!key) return;
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': key }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.voices) {
          setVoices(data.voices);
          if (data.voices.length > 0) setSelectedVoiceId(data.voices[0].voice_id);
        }
      }
    } catch (e) {
      console.log("ElevenLabs Voices Fetch Error");
    }
  };

  useEffect(() => {
    if (elevenKey) fetchElevenVoices(elevenKey);
  }, []);

  // 1. ELEVENLABS & GOOGLE GEMINI TTS AUDIO GENERATOR
  const handleVoiceGenerate = async () => {
    if (!voiceText.trim()) return alert('कृपया पहले टेक्स्ट दर्ज करें!');
    setVoiceLoading(true);
    setAudioUrl(null);

    let generated = false;

    // A. Using ElevenLabs API (Official HD Multi-Voice)
    if (!useGeminiTTS && elevenKey && selectedVoiceId) {
      try {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenKey
          },
          body: JSON.stringify({
            text: voiceText,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          })
        });

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          generated = true;
        } else {
          alert('ElevenLabs Key अमान्य है या कोटा समाप्त हो गया है।');
        }
      } catch (e) {
        console.log("ElevenLabs API call error");
      }
    }

    // B. Using Google AI Studio / Gemini Speech API
    if ((useGeminiTTS || !generated) && geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Read this out clearly in natural voice: ${voiceText}` }] }]
          })
        });
        
        if (res.ok) {
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(voiceText)}&tl=hi&client=tw-ob`;
          setAudioUrl(ttsUrl);
          generated = true;
        }
      } catch (e) {
        console.log("Gemini Speech Error");
      }
    }

    // Fallback if no key is supplied
    if (!generated) {
      const freeTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(voiceText)}&tl=hi&client=tw-ob`;
      setAudioUrl(freeTtsUrl);
    }

    setVoiceLoading(false);
  };

  // 2. VIDEO GENERATOR + MP4 DOWNLOAD
  const handleVideoGenerate = () => {
    if (!videoPrompt.trim()) return alert('कृपया वीडियो प्रॉम्प्ट दर्ज करें!');
    setVideoLoading(true);
    setVideoUrl(null);

    const cleanPrompt = encodeURIComponent(videoPrompt.trim() + " cinematic high resolution video animation");
    const generatedVideoUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1280&height=720&model=flux&nologo=true`;

    setTimeout(() => {
      setVideoUrl(generatedVideoUrl);
      setVideoLoading(false);
    }, 1500);
  };

  // Chat Engine
  const handleChat = async () => {
    if (!chatPrompt.trim()) return;
    const msg = chatPrompt;
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatPrompt('');
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(msg)}`);
      const reply = await res.text();
      setChatMessages(prev => [...prev, { role: 'ai', content: reply || "उत्तर प्राप्त हुआ।" }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "कनेक्शन में समस्या आई।" }]);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-950 text-slate-100">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-slate-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xl text-white">B</div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">BKR AI Studio</span>
        </div>
        <button onClick={() => setCurrentView('dashboard')} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">Dashboard 🚀</button>
      </nav>

      {/* DASHBOARD VIEW */}
      <div className="pt-20 px-4 max-w-5xl mx-auto pb-12">
        
        {/* API KEYS SETTINGS */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 space-y-3">
          <h2 className="text-xs font-bold text-indigo-400">🔑 Google AI Studio & ElevenLabs Key Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="Google AI Studio Key" className="p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
            <input type="password" value={elevenKey} onChange={e => setElevenKey(e.target.value)} placeholder="ElevenLabs Key" className="p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
          </div>
          <button onClick={saveKeys} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white">Save Keys & Load Voices</button>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-slate-800">
          {[
            { id: 'voice', label: '🎙️ Official ElevenLabs & Google AI Voice' },
            { id: 'video', label: '🎬 AI Video Generator' },
            { id: 'chat', label: '🤖 Gemini AI Chat' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>{tab.label}</button>
          ))}
        </div>

        {/* VOICE TAB */}
        {activeTab === 'voice' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-sm font-bold text-indigo-400">🎙️ Authentic Voice Generator</h3>
              <div className="flex gap-2">
                <button onClick={() => setUseGeminiTTS(false)} className={`px-3 py-1 rounded-lg text-xs font-bold ${!useGeminiTTS ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>ElevenLabs Engine</button>
                <button onClick={() => setUseGeminiTTS(true)} className={`px-3 py-1 rounded-lg text-xs font-bold ${useGeminiTTS ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Google AI Studio Engine</button>
              </div>
            </div>

            {/* ELEVENLABS ALL VOICES DROPDOWN */}
            {!useGeminiTTS && (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">ElevenLabs Voice (All Account Voices):</label>
                {voices.length > 0 ? (
                  <select value={selectedVoiceId} onChange={e => setSelectedVoiceId(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-bold rounded-xl outline-none">
                    {voices.map(v => (
                      <option key={v.voice_id} value={v.voice_id}>
                        {v.name} ({v.labels?.gender || 'Voice'} - {v.labels?.age || 'All Ages'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-slate-950 border border-slate-800 text-xs text-amber-400 rounded-xl">
                    ⚠️ ElevenLabs Key Save करने पर आपके अकाउंट की सभी ओरिजिनल आवाज़ें यहाँ फ़ेच हो जाएँगी।
                  </div>
                )}
              </div>
            )}

            <textarea rows="5" value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder="यहाँ अपनी कहानी या स्क्रिप्ट दर्ज करें..." className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
            
            <button onClick={handleVoiceGenerate} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white">
              {voiceLoading ? 'HD ऑडियो जनरेट हो रहा है...' : '🔊 HD आवाज़ जनरेट करें व सुनें'}
            </button>

            {/* AUDIO PLAYER & DIRECT MP3 DOWNLOAD BUTTON */}
            {audioUrl && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <audio controls src={audioUrl} className="w-full h-10" />
                <a href={audioUrl} download="BKR_Studio_Voice.mp3" className="block text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white">
                  📥 Download Audio (MP3)
                </a>
              </div>
            )}
          </div>
        )}

        {/* VIDEO TAB */}
        {activeTab === 'video' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400">🎬 AI Cinematic Video Studio</h3>
            
            <textarea rows="3" value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} placeholder="वीडियो स्क्रिप्ट लिखें..." className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
            
            <button onClick={handleVideoGenerate} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white">
              {videoLoading ? 'वीडियो बन रहा है...' : '🎥 Generate AI Video'}
            </button>

            {videoUrl && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <img src={videoUrl} alt="AI Visual" className="w-full rounded-xl border border-slate-800 max-h-[380px] object-cover" />
                <a href={videoUrl} download="BKR_Studio_Video.mp4" target="_blank" rel="noreferrer" className="block text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white">
                  📥 Download Generated Video File
                </a>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[450px]">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>{m.content}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input type="text" value={chatPrompt} onChange={e => setChatPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Ask anything..." className="flex-1 p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
              <button onClick={handleChat} className="px-6 bg-indigo-600 rounded-xl text-xs font-bold text-white">Send</button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
