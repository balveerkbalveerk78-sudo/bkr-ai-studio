export default function MarketCards() {
  const data = [
    { name: "NIFTY 50", value: "Loading...", color: "text-green-400" },
    { name: "SENSEX", value: "Loading...", color: "text-green-400" },
    { name: "BANK NIFTY", value: "Loading...", color: "text-blue-400" },
    { name: "AI Assistant", value: "Ready", color: "text-purple-400" }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {data.map((item) => (
        <div key={item.name} className="bg-slate-900 rounded-xl p-4 border border-slate-700">
          <h3 className="text-gray-400">{item.name}</h3>
          <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
