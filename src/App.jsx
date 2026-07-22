import React, { useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');

  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: lang === 'hi' ? 'नमस्ते! मैं आपका BKR AI असिस्टेंट हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?' : 'Hello! I am your BKR AI Assistant. How can I help you today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [voiceText, setVoiceText] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const t = {
    hi: {
      brand: "BKR AI Studio",
      launchApp: "AI स्टूडियो खोलें",
      backToHome: "लैंडिंग पेज पर जाएं",
      heroBadge: "🚀 अगली पीढ़ी का AI प्लेटफॉर्म",
      heroTitle: "आर्टिफिशियल इंटेलिजेंस से बदलें अपना व्यवसाय",
      heroDesc: "वॉइस जनरेशन, टेक्स्ट, इमेज, वीडियो और डॉक्यूमेंट एनालिसिस - सब कुछ एक ही जगह पर।",
      getStarted: "शुरू करें",
      featuresTitle: "शक्तिशाली AI टूल्स",
      tabChat: "🤖 AI चैट",
      tabVoice: "🎙️ वॉइस जनरेटर",
      tabImage: "🖼️ AI इमेज जनरेटर",
      tabVideo: "🎬 AI वीडियो जनरेटर",
      tabDoc: "📄 PDF/डॉक्यूमेंट"
    },
    en: {
      brand: "BKR AI Studio",
      launchApp: "Launch AI Studio",
      backToHome: "Back to Home",
      heroBadge: "🚀 Next-Gen AI Platform",
      heroTitle: "Transform Your Business with AI",
      heroDesc: "Voice Generation, Chat, Image, Video, and Document Analysis - All in one place.",
      getStarted: "Get Started",
      featuresTitle: "Powerful AI Tools",
      tabChat: "🤖 AI Chat",
      tabVoice: "🎙️ Voice Generator",
      tabImage: "🖼️ AI Image Generator",
      tabVideo: "🎬 AI Video Generator",
      tabDoc: "📄 PDF/Document"
    }
  }[lang];

  const handleChat = () => {
    if (!chatPrompt.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatPrompt }]);
    setChatPrompt('');
    setChatLoading(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: "BKR AI स्टूडियो का रिस्पॉन्स प्राप्त हुआ।" }]);
      setChatLoading(false);
    }, 800);
  };

  const handleImageGen = () => {
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    setTimeout(() => {
      setGeneratedImage(`https://pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=800&height=500&seed=42`);
      setImageLoading(false);
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
              {t.launchApp} 🚀
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700"
            >
              {t.backToHome} 🏠
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
                {t.getStarted} 🚀
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
              { id: 'video', label: t.tabVideo },
              { id: 'doc', label: t.tabDoc }
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
                {chatLoading && <div className="text-indigo-400 text-sm">सोच रहा है...</div>}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder={lang === 'hi' ? "कुछ भी पूछें..." : "Ask anything..."}
                  className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <button onClick={handleChat} className="px-6 bg-indigo-600 rounded-xl font-bold">Send</button>
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h2 className="text-2xl font-bold">🖼️ AI Image Studio</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="इमेज का विवरण दर्ज करें..."
                  className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-700"
                />
                <button onClick={handleImageGen} className="px-6 bg-purple-600 rounded-xl font-bold">
                  {imageLoading ? 'बना रहा है...' : 'Generate Image'}
                </button>
              </div>
              {generatedImage && <img src={generatedImage} alt="AI Output" className="w-full rounded-xl mt-4" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
