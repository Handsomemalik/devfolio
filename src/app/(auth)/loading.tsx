export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-[#07070B] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 space-y-6 animate-pulse">
        <div className="space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-white/10 mx-auto" />
          <div className="h-6 w-36 bg-white/10 rounded mx-auto" />
          <div className="h-3 w-48 bg-white/5 rounded mx-auto" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-10 bg-white/5 rounded-xl border border-white/5" />
          <div className="h-10 bg-white/5 rounded-xl border border-white/5" />
          <div className="h-10 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
