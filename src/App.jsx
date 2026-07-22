import React, { useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('voice');

  // API Keys
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('bkr_gemini') || '');
  const [elevenKey, setElevenKey] = useState(localStorage.getItem('bkr_eleven') || '');

  // AI Tool States
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'नमस्ते Balveer! मैं आपका BKR AI Studio असिस्टेंट हूँ।' }
  ]);
  
  // Multi-Language Voice States
  const [voiceText, setVoiceText] = useState('');
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('hi-IN');
  const [voiceLoading, setVoiceLoading] = useState(false);

  // Image & PDF
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [docText, setDocText] = useState('');
  const [docSummary, setDocSummary] = useState('');

  const saveKeys = () => {
    localStorage.setItem('bkr_gemini', geminiKey);
    localStorage.setItem('bkr_eleven', elevenKey);
    alert('API Keys Saved Successfully!');
  };

  const handleChat = async () => {
    if (!chatPrompt.trim()) return;
    const msg = chatPrompt;
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatPrompt('');
    
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(msg)}`);
      const reply = await res.text();
      setChatMessages(prev => [...prev, { role: 'ai', content: reply || "उत्तर तैयार है।" }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "कनेक्शन में समस्या आई।" }]);
    }
  };

  // MULTI-LANGUAGE VOICE ENGINE
  const handleVoice = async () => {
    if (!voiceText.trim()) return;
    setVoiceLoading(true);

    let played = false;

    // Try ElevenLabs Multilingual V2 if Key exists
    if (elevenKey) {
      try {
        const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenKey
          },
          body: JSON.stringify({
            text: voiceText,
            model_id: "eleven_multilingual_v2"
          })
        });
        if (res.ok) {
          const blob = await res.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          audio.play();
          played = true;
        }
      } catch (e) {
        console.log("ElevenLabs fallback to Browser Speech");
      }
    }

    // Direct Browser Multi-Language Speech Engine
    if (!played) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.lang = selectedVoiceLang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    setVoiceLoading(false);
  };

  const handleImage = () => {
    if (!imagePrompt.trim()) return;
    setGeneratedImg(`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=500&nologo=true`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setDocText(uploadEvent.target.result);
      reader.readAsText(file);
    }
  };

  const downloadPDF = () => {
    const content = docSummary || docText;
    if (!content) return alert('डाउनलोड करने के लिए कोई टेक्स्ट नहीं है!');
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>BKR AI PDF</title></head><body><pre>' + content + '</pre></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={`min-h-screen font-sans ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-slate-800/50 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-xl text-white shadow-lg">B</div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">BKR AI Studio</span>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-xl bg-slate-800 text-xs">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => setCurrentView(currentView === 'dashboard' ? 'landing' : 'dashboard')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg">
            {currentView === 'dashboard' ? 'Home 🏠' : 'Open Dashboard 🚀'}
          </button>
        </div>
      </nav>

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="pt-20 px-4 max-w-6xl mx-auto pb-12">
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-indigo-400">🔑 API Keys Settings</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="Gemini Key" className="p-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"/>
              <input type="password" value={elevenKey} onChange={e => setElevenKey(e.target.value)} placeholder="ElevenLabs Key" className="p-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"/>
              <button onClick={saveKeys} className="px-4 py-2 bg-emerald-600 rounded-xl text-xs font-bold text-white">Save</button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-slate-800">
            {[
              { id: 'voice', label: '🎙️ Multi-Language Voice' },
              { id: 'chat', label: '🤖 AI Chat' },
              { id: 'pdf', label: '📄 PDF AI' },
              { id: 'image', label: '🖼️ Image Gen' },
              { id: 'video', label: '🎬 Video Gen' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>{tab.label}</button>
            ))}
          </div>

          {/* MULTI-LANGUAGE VOICE TAB */}
          {activeTab === 'voice' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-sm font-bold text-indigo-400">🎙️ Multi-Language Text-To-Speech Studio</h3>
                
                {/* LANGUAGE SELECTOR */}
                <select value={selectedVoiceLang} onChange={e => setSelectedVoiceLang(e.target.value)} className="p-2 bg-slate-950 border border-slate-800 text-xs text-indigo-300 rounded-xl outline-none font-bold">
                  <option value="hi-IN">🇮🇳 हिंदी (Hindi)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="en-IN">🇮🇳 English (Indian Accent)</option>
                  <option value="es-ES">🇪🇸 Spanish (Español)</option>
                  <option value="fr-FR">🇫🇷 French (Français)</option>
                  <option value="de-DE">🇩🇪 German (Deutsch)</option>
                  <option value="mr-IN">🇮🇳 मराठी (Marathi)</option>
                  <option value="bn-IN">🇮🇳 বাংলা (Bengali)</option>
                  <option value="ta-IN">🇮🇳 தமிழ் (Tamil)</option>
                  <option value="ar-SA">🇸🇦 Arabic (العربية)</option>
                </select>
              </div>

              <textarea rows="5" value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder="यहाँ किसी भी भाषा में लिखें..." className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
              <button onClick={handleVoice} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white">
                {voiceLoading ? 'जनरेट हो रहा है...' : '🔊 चुनी हुई भाषा में आवाज़ सुनें (Play Voice)'}
              </button>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[480px]">
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

          {/* PDF TAB */}
          {activeTab === 'pdf' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-indigo-400">📄 AI PDF & Doc Reader</h3>
                <label className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl cursor-pointer border border-slate-700 text-white">
                  📁 Upload File <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              <textarea rows="5" value={docText} onChange={e => setDocText(e.target.value)} placeholder="यहाँ पाठ लिखें..." className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
              <button onClick={downloadPDF} className="w-full py-3 bg-emerald-600 rounded-xl text-xs font-bold text-white">📥 Download PDF</button>
            </div>
          )}

          {/* IMAGE TAB */}
          {activeTab === 'image' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex gap-2">
                <input type="text" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Prompt..." className="flex-1 p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/>
                <button onClick={handleImage} className="px-6 bg-purple-600 rounded-xl text-xs font-bold text-white">Generate</button>
              </div>
              {generatedImg && <img src={generatedImg} alt="AI" className="w-full rounded-2xl mt-4 border border-slate-800 max-h-[400px] object-cover"/>}
            </div>
          )}

        </div>
      )}

      {currentView === 'landing' && (
        <div className="pt-24 px-6 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-black">BKR AI Studio</h1>
          <button onClick={() => setCurrentView('dashboard')} className="px-8 py-3.5 bg-indigo-600 rounded-xl font-bold text-white shadow-xl">Open Multi-Language App 🚀</button>
        </div>
      )}

    </div>
  );
}
