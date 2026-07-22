import React, { useState, useEffect } from 'react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('hi');
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');

  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatPromptMessages] = useState([
    { role: 'ai', content: lang === 'hi' ? 'नमस्ते! मैं आपका BKR AI असिस्टेंट हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?' : 'Hello! I am your BKR AI Assistant. How can I help you today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [voiceText, setVoiceText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Rachel');
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);

  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [docFile, setDocFile] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = {
    hi: {
      brand: "BKR AI Studio",
      navHome: "होम",
      navAbout: "हमारे बारे में",
      navServices: "सेवाएं",
      navPricing: "प्राइजिंग",
      navFAQ: "सवाल-जवाब",
      navContact: "संपर्क",
      launchApp: "AI स्टूडियो खोलें",
      backToHome: "लैंडिंग पेज पर जाएं",
      heroBadge: "🚀 अगली पीढ़ी का AI प्लेटफॉर्म",
      heroTitle: "आर्टिफिशियल इंटेलिजेंस से बदलें अपना व्यवसाय",
      heroDesc: "वॉइस जनरेशन, टेक्स्ट, इमेज, वीडियो और डॉक्यूमेंट एनालिसिस - सब कुछ एक ही जगह पर।",
      getStarted: "शुरू करें",
      viewServices: "सेवाएं देखें",
      featuresTitle: "शक्तिशाली AI टूल्स",
      pricingTitle: "सरल एवं पारदर्शी प्लान्स",
      contactTitle: "हमसे संपर्क करें",
      sendMsg: "संदेश भेजें",
      tabChat: "🤖 AI चैट (Gemini)",
      tabVoice: "🎙️ वॉइस जनरेटर (ElevenLabs)",
      tabImage: "🖼️ AI इमेज जनरेटर",
      tabVideo: "🎬 AI वीडियो जनरेटर",
      tabDoc: "📄 PDF/डॉक्यूमेंट एनालिसिस"
    },
    en: {
      brand: "BKR AI Studio",
      navHome: "Home",
      navAbout: "About Us",
      navServices: "Services",
      navPricing: "Pricing",
      navFAQ: "FAQ",
      navContact: "Contact",
      launchApp: "Launch AI Studio",
      backToHome: "Back to Home",
      heroBadge: "🚀 Next-Gen AI Platform",
      heroTitle: "Transform Your Business with AI",
      heroDesc: "Voice Generation, Chat, Image, Video, and Document Analysis - All in one place.",
      getStarted: "Get Started",
      viewServices: "View Services",
      featuresTitle: "Powerful AI Tools",
      pricingTitle: "Simple & Transparent Pricing",
      contactTitle: "Get In Touch",
      sendMsg: "Send Message",
      tabChat: "🤖 AI Chat (Gemini)",
      tabVoice: "🎙️ Voice Generator (ElevenLabs)",
      tabImage: "🖼️ AI Image Generator",
      tabVideo: "🎬 AI Video Generator",
      tabDoc: "📄 PDF/Document Analysis"
    }
  }[lang];

  const handleChat = async () => {
    if (!chatPrompt.trim()) return;
    const userMsg = chatPrompt;
    setChatPromptMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatPrompt('');
    setChatLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: userMsg }] }] })
        });
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "उत्तर प्राप्त नहीं हुआ।";
        setChatPromptMessages(prev => [...prev, { role: 'ai', content: reply }]);
      } else {
        setTimeout(() => {
          setChatPromptMessages(prev => [...prev, { 
            role: 'ai', 
            content: (lang === 'hi' ? "Gemini API कनेक्टेड है! (Vercel में VITE_GEMINI_API_KEY दर्ज करें)" : "Gemini API ready! (Add VITE_GEMINI_API_KEY in Vercel)") 
          }]);
        }, 800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleVoice = async () => {
    if (!voiceText.trim()) return;
    setVoiceLoading(true);
    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (apiKey) {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: voiceText,
            model_id: "eleven_multilingual_v2"
          })
        });
        const blob = await res.blob();
        setAudioUrl(URL.createObjectURL(blob));
      } else {
        alert(lang === 'hi' ? "कृपया Vercel में VITE_ELEVENLABS_API_KEY जोड़ें।" : "Please add VITE_ELEVENLABS_API_KEY in Vercel.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVoiceLoading(false);
    }
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
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            B
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t.brand}
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <button onClick={() => setCurrentView('landing')} className="hover:text-indigo-400">{t.navHome}</button>
          <a href="#services" className="hover:text-indigo-400">{t.navServices}</a>
          <a href="#pricing" className="hover:text-indigo-400">{t.navPricing}</a>
          <a href="#contact" className="hover:text-indigo-400">{t.navContact}</a>
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

      {/* LANDING VIEW */}
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

          <section id="services" className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-extrabold text-center mb-12">{t.featuresTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="text-4xl mb-4">🎙️</div>
                <h3 className="text-xl font-bold mb-2">Voice Generator & Cloning</h3>
                <p className="text-slate-400 text-sm">ElevenLabs API द्वारा उच्च गुणवत्ता वाली आवाज और वॉइस क्लोनिंग जनरेट करें।</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI Chat & Reasoning</h3>
                <p className="text-slate-400 text-sm">Google Gemini AI के पावरफुल मॉडल से स्मार्ट चैट और समस्या समाधान प्राप्त करें।</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-xl font-bold mb-2">AI Image & Video Studio</h3>
                <p className="text-slate-400 text-sm">प्रॉम्प्ट दर्ज करके सेकंडों में फोटो और वीडियो बनाएं।</p>
              </div>
            </div>
          </section>

          <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-extrabold text-center mb-12">{t.pricingTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                <h3 className="text-xl font-bold">Free Trial</h3>
                <div className="text-4xl font-black my-4">₹0</div>
                <button onClick={() => setCurrentView('dashboard')} className="w-full py-2.5 rounded-xl bg-slate-700">Try Free</button>
              </div>
              <div className="p-8 rounded-2xl bg-indigo-900/40 border-2 border-indigo-500 text-center">
                <h3 className="text-xl font-bold">Pro Creator</h3>
                <div className="text-4xl font-black my-4">₹999 <span className="text-sm">/mo</span></div>
                <button onClick={() => setCurrentView('dashboard')} className="w-full py-2.5 rounded-xl bg-indigo-600 font-semibold">Get Pro</button>
              </div>
              <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                <h3 className="text-xl font-bold">Agency Plan</h3>
                <div className="text-4xl font-black my-4">₹2,999 <span className="text-sm">/mo</span></div>
                <button onClick={() => setCurrentView('dashboard')} className="w-full py-2.5 rounded-xl bg-slate-700">Contact Sales</button>
              </div>
            </div>
          </section>

          <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
            © 2026 BKR AI Studio. All rights reserved.
          </footer>
        </div>
      )}

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="pt-20 px-4 lg:px-8 max-w-7xl mx-auto pb-12">
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
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 flex flex-col h-[550px]">
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
                {chatLoading && <div className="text-indigo-400 text-sm">BKR AI सोच रहा है...</div>}
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

          {activeTab === 'voice' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h2 className="text-2xl font-bold">🎙️ ElevenLabs AI Voice Studio</h2>
              <textarea
                rows="4"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="यहाँ टेक्स्ट लिखें..."
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
              ></textarea>
              <button onClick={handleVoice} disabled={voiceLoading} className="w-full py-3.5 bg-indigo-600 rounded-xl font-bold">
                {voiceLoading ? 'बना रहा है...' : 'ऑडियो जनरेट करें'}
              </button>
              {audioUrl && <audio controls src={audioUrl} className="w-full mt-4" />}
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

          {activeTab === 'video' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-12 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold mb-2">AI Video Generator</h2>
              <p className="text-slate-400">Runway AI द्वारा संचालित वीडियो जनरेशन मॉड्यूल जल्द आ रहा है!</p>
            </div>
          )}

          {activeTab === 'doc' && (
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              <h2 className="text-2xl font-bold">📄 AI PDF & Document Analyzer</h2>
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center bg-slate-900/50">
                <input type="file" onChange={(e) => setDocFile(e.target.files[0])} className="hidden" id="docUpload" />
                <label htmlFor="docUpload" className="cursor-pointer text-indigo-400 hover:underline">
                  {docFile ? docFile.name : "PDF या फ़ाइल अपलोड करने के लिए क्लिक करें"}
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919000000000?text=Hello%20BKR%20AI%20Studio"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl"
      >
        💬
      </a>
    </div>
  );
}
export default App;

