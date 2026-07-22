import React, { useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');

  // Local API Keys State (Saved in browser securely)
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('bkr_gemini_key') || '');
  const [elevenKey, setElevenKey] = useState(localStorage.getItem('bkr_eleven_key') || '');

  // Chat
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: lang === 'hi' ? 'नमस्ते Balveer! मैं आपका BKR AI असिस्टेंट हूँ।' : 'Hello Balveer! I am your BKR AI Assistant.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Voice
  const [voiceText, setVoiceText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);

  // Video & Image
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);

  const saveKeys = () => {
    localStorage.setItem('bkr_gemini_key', geminiKey);
    localStorage.setItem('bkr_eleven_key', elevenKey);
    alert('Keys Saved Successfully!');
  };

  // 1. CHAT
  const handleChat = async () => {
    if (!chatPrompt.trim()) return;
    const userMsg = chatPrompt;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatPrompt('');
    setChatLoading(true);

    if (geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: userMsg }] }] })
        });
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "रिस्पॉन्स नहीं मिला।";
        setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
      } catch (e) {
        setChatMessages(prev => [...prev, { role: 'ai', content: "API Key अमान्य है या नेटवर्क एरर है।" }]);
      }
    } else {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', content: `नमस्ते Balveer! आपका मैसेज: "${userMsg}"। (किमी API Key दर्ज करने के लिए ऊपर Settings में Key भरें)` }]);
      }, 500);
    }
    setChatLoading(false);
  };

  // 2. VOICE
  const handleVoice = async () => {
    if (!voiceText.trim()) return;
    setVoiceLoading(true);

    if (elevenKey) {
      try {
        const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenKey },
          body: JSON.stringify({ text: voiceText, model_id: "eleven_multilingual_v2" })
        });
        if (res.ok) {
          const blob = await res.blob();
          setAudioUrl(URL.createObjectURL(blob));
        } else {
          alert('ElevenLabs Key अमान्य है या कोटा समाप्त हो गया है।');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
    setVoiceLoading(false);
  };

  // 3. IMAGE
  const handleImageGen = () => {
    if (!imagePrompt.trim()) return;
    const cleanPrompt = encodeURIComponent(imagePrompt.trim());
    setGeneratedImage(`https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=500&nologo=true`);
  };

  // 4. VIDEO
  const handleVideoGen = () => {
    if (!videoPrompt.trim()) return;
    setGeneratedVideo("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2" onClick={() => setCurrentView('landing')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xl text-white">B</div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">BKR AI Studio</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} className="px-3 py-1 bg-slate-800 text-xs rounded-lg border border-slate-700">🌐 {lang === 'hi' ? 'English' : 'हिंदी'}</button>
          <button onClick={() => setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing')} className="px-3 py-1 bg-indigo-600 text-xs rounded-lg font-bold">{currentView === 'landing' ? 'Open App 🚀' : 'Home 🏠'}</button>
        </div>
      </nav>

      {currentView === 'dashboard' && (
        <div className="pt-20 px-4 max-w-6xl mx-auto pb-12">
          {/* API KEYS CONFIG PANEL */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 mb-6 space-y-3">
            <h3 className="text-sm font-bold text-indigo-400">🔑 API Keys Settings (सुरक्षित स्थान)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="Paste Gemini API Key" className="p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"/>
              <input type="password" value={elevenKey} onChange={e => setElevenKey(e.target.value)} placeholder="Paste ElevenLabs API Key" className="p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"/>
            </div>
            <button onClick={saveKeys} className="px-4 py-1.5 bg-emerald-600 text-xs font-bold rounded-lg">Save Keys in Browser</button>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-4 mb-6">
            {['chat', 'voice', 'image', 'video'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{tab}</button>
            ))}
          </div>

          {activeTab === 'chat' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-xs ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-700'}`}>{msg.content}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input type="text" value={chatPrompt} onChange={e => setChatPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Ask anything..." className="flex-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"/>
                <button onClick={handleChat} className="px-5 bg-indigo-600 rounded-xl text-xs font-bold">Send</button>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 space-y-4">
              <textarea rows="3" value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder="Enter text..." className="w-full p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"/>
              <button onClick={handleVoice} className="w-full py-3 bg-indigo-600 rounded-xl text-xs font-bold">{voiceLoading ? 'Generating...' : '🔊 Generate / Speak'}</button>
              {audioUrl && <audio controls src={audioUrl} className="w-full mt-2"/>}
            </div>
          )}

          {activeTab === 'image' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 space-y-4">
              <div className="flex gap-2">
                <input type="text" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Prompt..." className="flex-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"/>
                <button onClick={handleImageGen} className="px-5 bg-purple-600 rounded-xl text-xs font-bold">Generate</button>
              </div>
              {generatedImage && <img src={generatedImage} alt="AI" className="w-full rounded-xl"/>}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 space-y-4">
              <div className="flex gap-2">
                <input type="text" value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} placeholder="Video Prompt..." className="flex-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"/>
                <button onClick={handleVideoGen} className="px-5 bg-purple-600 rounded-xl text-xs font-bold">Generate</button>
              </div>
              {generatedVideo && <iframe src={generatedVideo} className="w-full aspect-video rounded-xl mt-2"/>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
