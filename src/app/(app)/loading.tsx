export default function AppLoading() {
  return (
    <div className="min-h-screen bg-[#07070B] text-slate-100 flex flex-col p-4 sm:p-8 space-y-8 animate-pulse">
      {/* Top Navbar Skeleton */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div className="h-5 w-32 bg-white/10 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-white/10 rounded-xl" />
          <div className="w-8 h-8 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-white/10 rounded-lg" />
            <div className="h-4 w-72 bg-white/5 rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-white/10 rounded-xl" />
            <div className="h-9 w-32 bg-white/10 rounded-xl" />
          </div>
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="h-44 rounded-3xl bg-white/[0.04] border border-white/5 p-6 space-y-4">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="h-5 w-28 bg-white/10 rounded" />
            <div className="h-3 w-40 bg-white/5 rounded" />
          </div>
          <div className="h-44 rounded-3xl bg-white/[0.04] border border-white/5 p-6 space-y-4">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="h-5 w-28 bg-white/10 rounded" />
            <div className="h-3 w-40 bg-white/5 rounded" />
          </div>
          <div className="h-44 rounded-3xl bg-white/[0.04] border border-white/5 p-6 space-y-4">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="h-5 w-28 bg-white/10 rounded" />
            <div className="h-3 w-40 bg-white/5 rounded" />
          </div>
        </div>

        {/* Large Panel Skeleton */}
        <div className="h-96 rounded-3xl bg-white/[0.03] border border-white/5 p-8 space-y-4">
          <div className="h-6 w-52 bg-white/10 rounded" />
          <div className="h-4 w-96 bg-white/5 rounded" />
          <div className="pt-8 grid grid-cols-2 gap-4">
            <div className="h-20 bg-white/5 rounded-2xl" />
            <div className="h-20 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
