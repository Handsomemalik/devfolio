export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#07070B] flex flex-col items-center justify-center space-y-4">
      {/* Animated logo pulse */}
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 animate-pulse opacity-75 blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
      <p className="text-xs font-mono tracking-widest uppercase text-slate-500 animate-pulse">
        Initializing FolioNova...
      </p>
    </div>
  );
}
