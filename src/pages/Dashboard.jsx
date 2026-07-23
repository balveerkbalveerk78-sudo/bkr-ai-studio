export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold text-violet-400">
        🚀 BKR AI Studio Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-900 rounded-xl p-4">📈 Live Market</div>
        <div className="bg-slate-900 rounded-xl p-4">⭐ Watchlist</div>
        <div className="bg-slate-900 rounded-xl p-4">💼 Portfolio</div>
        <div className="bg-slate-900 rounded-xl p-4">🤖 AI Assistant</div>
      </div>
    </div>
  );
}
