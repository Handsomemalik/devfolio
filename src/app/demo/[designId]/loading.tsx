export default function DemoLoading() {
  return (
    <div className="min-h-screen bg-[#07070B] text-slate-100 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-10 h-10 rounded-xl border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading interactive preview archetype...</p>
      </div>
    </div>
  );
}
