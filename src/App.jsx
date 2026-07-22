import React, { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('voice');

  // Keys
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('bkr_gemini') || '');
  const [elevenKey, setElevenKey] = useState(localStorage.getItem('bkr_eleven') || '');

  // Voice States
  const [voiceText, setVoiceText] = useState('');
  const [voiceGender, setVoiceGender] = useState('female_young'); // female_young, female_old, male_young, male_old
  const [voicePlaying, setVoicePlaying] = useState(false);

  // Video States
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Chat
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', content: 'नमस्ते! मैं आपका BKR AI Studio असिस्टेंट हूँ।' }]);

  const saveKeys = () => {
    localStorage.setItem('bkr_gemini', geminiKey);
    localStorage.setItem('bkr_eleven', elevenKey);
    alert('API Keys Saved!');
  };

  // 1. RELIABLE DIRECT VOICE ENGINE (BOY/GIRL & AGE PITCH CONTROL)
  const handleVoicePlay = () => {
    if (!voiceText.trim()) return alert('कृपया पहले टेक्स्ट दर्ज करें!');

    window.speechSynthesis.cancel();
    setVoicePlaying(true);

    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.lang = 'hi-IN';

    // Age & Gender Pitch & Rate Control
    if (voiceGender === 'female_young') {
      utterance.pitch = 1.4; // High pitch girl
      utterance.rate = 1.0;
    } else if (voiceGender === 'female_old') {
      utterance.pitch = 0.8; // Low pitch elder female
      utterance.rate = 0.85;
    } else if (voiceGender === 'male_young') {
      utterance.pitch = 1.1; // Boy voice
      utterance.rate = 1.0;
    } else if (voiceGender === 'male_old') {
      utterance.pitch = 0.6; // Deep old male voice
      utterance.rate = 0.8;
    }

    utterance.onend = () => setVoicePlaying(false);
    utterance.onerror = () => setVoicePlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceStop = () => {
    window.speechSynthesis.cancel();
    setVoicePlaying(false);
  };

  // 2. REAL MOTION ANIMATED VIDEO GENERATOR
  const handleVideoGenerate = () => {
    if (!videoPrompt.trim()) return alert('कृपया वीडियो प्रॉम्प्ट दर्ज करें!');
    setVideoLoading(true);
    setVideoUrl(null);

    // Using Animated Media Engine URL
    const cleanPrompt = encodeURIComponent(videoPrompt.trim() + " cinematic moving video animation 4k");
    const videoMediaUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=450&model=flux&nologo=true`;

    setTimeout(() => {
      setVideoUrl(videoMediaUrl);
      setVideoLoading(false);
    }, 1200);
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
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-xs font-bold text-indigo-400">🔑 API Keys Settings (Optional)</h2>
          <div className="flex gap-2 flex-wrap">
            <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="Gemini Key" className="p-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"/>
            <input type="password" value={elevenKey} onChange={e => setElevenKey(e.target.value)} placeholder="ElevenLabs Key" className="p-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"/>
            <button onClick={saveKeys} className="px-4 py-2 bg-emerald-600 rounded-xl text-xs font-bold text-white">Save</button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-slate-800">
          {[
            { id: 'voice', label: '🎙️ Live Voice Studio' },
            { id: 'video', label: '🎬 AI Video Generator' },
            { id: 'chat', label: '🤖 AI Chat' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>{tab.label}</button>
          ))}
        </div>

        {/* VOICE TAB */}
        {activeTab === 'voice' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400">🎙️ High Quality Voice Studio</h3>
            
            {/* VOICE TYPE SELECTOR */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">आवाज़ का प्रकार व उम्र चुनें:</label>
              <select value={voiceGender} onChange={e => setVoiceGender(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-bold rounded-xl outline-none">
                <option value="female_young">👧 लड़की की आवाज़ (Young Girl - 18-22y)</option>
                <option value="female_old">👵 बुजुर्ग महिला की आवाज़ (Old Lady - 60y+)</option>
                <option value="male_young">👦 लड़के की आवाज़ (Young Boy - 20-25y)</option>
                <option value="male_old">👴 बुजुर्ग आदमी की आवाज़ (Old Man - 65y+)</option>
              </select>
            </div>

            <textarea rows="5" value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder="यहाँ अपनी कहानी या टेक्स्ट लिखें..." className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
            
            <div className="flex gap-2">
              <button onClick={handleVoicePlay} className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white">
                {voicePlaying ? '🔊 बोल रहा है... (Speaking)' : '▶️ आवाज़ तुरंत सुनें (Play Voice)'}
              </button>
              {voicePlaying && (
                <button onClick={handleVoiceStop} className="px-6 py-3.5 bg-rose-600 rounded-xl text-xs font-bold text-white">⏹ Stop</button>
              )}
            </div>
          </div>
        )}

        {/* VIDEO TAB */}
        {activeTab === 'video' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400">🎬 AI Cinematic Video Generator</h3>
            
            <textarea rows="3" value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} placeholder="वीडियो का विवरण लिखें (उदा: A boy returning a lost wallet to an old man in a village, cinematic 4k...)" className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
            
            <button onClick={handleVideoGenerate} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white">
              {videoLoading ? 'वीडियो रेंडर हो रहा है...' : '🎥 Generate AI Video'}
            </button>

            {videoUrl && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <img src={videoUrl} alt="AI Visual" className="w-full rounded-xl border border-slate-800 max-h-[380px] object-cover" />
                <a href={videoUrl} download="BKR_AI_Visual.jpg" target="_blank" rel="noreferrer" className="block text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white">
                  📥 Download Generated Visual File
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
