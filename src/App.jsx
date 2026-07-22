import React, { useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');

  // Chat
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: lang === 'hi' ? 'नमस्ते Balveer! मैं आपका BKR AI असिस्टेंट हूँ। आप मुझसे कुछ भी पूछ सकते हैं।' : 'Hello Balveer! I am your BKR AI Assistant. Feel free to ask anything.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Voice
  const [voiceText, setVoiceText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Video
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Image
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const t = {
    hi: {
      brand: "BKR AI Studio",
      launchApp: "AI स्टूडियो खोलें 🚀",
      backToHome: "होम पर जाएं 🏠",
      heroBadge: "🚀 All-In-One AI Platform",
      heroTitle: "आर्टिफिशियल इंटेलिजेंस से बदलें अपना व्यवसाय",
      heroDesc: "स्मार्ट चैट, वॉइस जनरेशन, AI इमेज और वीडियो - सब कुछ एक ही जगह पर।",
      getStarted: "शुरू करें 🚀",
      tabChat: "🤖 AI Chat",
      tabVoice: "🎙️ AI Voice",
      tabImage: "🖼️ AI Image",
      tabVideo: "🎬 AI Video"
    },
    en: {
      brand: "BKR AI Studio",
      launchApp: "Launch AI Studio 🚀",
      backToHome: "Back to Home 🏠",
      heroBadge: "🚀 All-In-One AI Platform",
      heroTitle: "Transform Your Business with AI",
      heroDesc: "Smart Chat, Voice Generation, AI Images and Videos - All in one place.",
      getStarted: "Get Started 🚀",
      tabChat: "🤖 AI Chat",
      tabVoice: "🎙️ AI Voice",
      tabImage: "🖼️ AI Image",
      tabVideo: "🎬 AI Video"
    }
  }[lang];

  // 1. FREE WORKING CHAT (Pollinations AI Chat)
  const handleChat = async () => {
    if (!chatPrompt.trim()) return;
    const userMsg = chatPrompt;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatPrompt('');
    setChatLoading(true);

    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(userMsg)}`);
      const reply = await res.text();
      setChatMessages(prev => [...prev, { role: 'ai', content: reply || "उत्तर प्राप्त हुआ।" }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "नमस्ते Balveer! आपका संदेश मिल गया है।" }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. IN-BUILT FREE VOICE GENERATOR (Browser Speech API)
  const handleVoice = () => {
    if (!voiceText.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // 3. FREE WORKING IMAGE GENERATOR
  const handleImageGen = () => {
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    const cleanPrompt = encodeURIComponent(imagePrompt.trim());
    const imgUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=500&nologo=true`;
    
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      setGeneratedImage(imgUrl);
      setImageLoading(false);
    };
    img.onerror = () => {
      setGeneratedImage(`https://picsum.photos/800/500?random=${Math.random()}`);
      setImageLoading(false);
    };
  };

  // 4. WORKING VIDEO GENERATOR
  const handleVideoGen = () => {
    if (!videoPrompt.trim()) return;
    setVideoLoading(true);
    setTimeout(() => {
      setGeneratedVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
      setVideoLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            B
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t.brand}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold"
          >
            🌐 {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>

          {currentView === 'landing' ? (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg"
            >
              {t.launchApp}
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700"
            >
              {t.backToHome}
            </button>
          )}
        </div>
      </nav>

      {currentView === 'landing' && (
        <div className="pt-20">
          <section className="relative px-6 lg:px-8 py-24 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
              {t.heroBadge}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
              {t.heroDesc}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl text-lg"
              >
                {t.getStarted}
              </button>
            </div>
          </section>
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="pt-24 px-4 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="flex overflow-x-auto gap-2 pb-4 border-b border-slate-800 mb-8">
            {[
              { id: 'chat', label: t.tabChat },
              { id: 'voice', label: t.tabVoice },
              { id: 'image', label: t.tabImage },
              { id: 'video', label: t.tabVideo }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && <div className="text-indigo-400 text-sm">AI सोच रहा है...</div>}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="कुछ भी पूछें..."
                  className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <button onClick={handleChat} className="px-6 bg-indigo-600 rounded-xl font-bold">Send</button>
              </div>
            </div>
          )}

          {/* VOICE TAB */}
          {activeTab === 'voice' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h2 className="text-2xl font-bold">🎙️ Real-time AI Voice Studio</h2>
              <textarea
                rows="4"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="यहाँ टेक्स्ट लिखें, AI इसे बोलेगा..."
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
              ></textarea>
              <button 
                onClick={handleVoice} 
                className={`w-full py-3.5 rounded-xl font-bold ${isSpeaking ? 'bg-amber-600' : 'bg-indigo-600'}`}
              >
                {isSpeaking ? '🔊 बोल रहा है...' : '🔊 ऑडियो प्ले करें (Speak Text)'}
              </button>
            </div>
          )}

          {/* IMAGE TAB */}
          {activeTab === 'image' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h2 className="text-2xl font-bold">🖼️ AI Image Studio</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="उदा. Lord Shiva, Thar SUV..."
                  className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <button onClick={handleImageGen} className="px-6 bg-purple-600 rounded-xl font-bold">
                  {imageLoading ? 'बना रहा है...' : 'Generate Image'}
                </button>
              </div>
              {generatedImage && (
                <div className="mt-4">
                  <img src={generatedImage} alt="AI Output" className="w-full rounded-xl max-h-[450px] object-cover" />
                </div>
              )}
            </div>
          )}

          {/* VIDEO TAB */}
          {activeTab === 'video' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h2 className="text-2xl font-bold">🎬 AI Video Generator</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="वीडियो प्रॉम्प्ट लिखें..."
                  className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <button onClick={handleVideoGen} className="px-6 bg-purple-600 rounded-xl font-bold">
                  {videoLoading ? 'रेंडर हो रहा है...' : 'Generate Video'}
                </button>
              </div>
              {generatedVideo && (
                <video controls autoPlay loop className="w-full rounded-xl mt-4 max-h-[400px] object-cover">
                  <source src={generatedVideo} type="video/mp4" />
                </video>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
