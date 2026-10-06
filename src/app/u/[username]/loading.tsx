export default function PublicProfileLoading() {
  return (
    <div className="min-h-screen bg-[#07070B] text-slate-100 p-6 sm:p-12 flex flex-col items-center animate-pulse">
      <div className="max-w-4xl w-full space-y-12">
        {/* Floating Top Bar Skeleton */}
        <div className="h-14 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between px-6">
          <div className="h-5 w-28 bg-white/10 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-white/10 rounded-xl" />
            <div className="h-8 w-24 bg-white/10 rounded-xl" />
          </div>
        </div>

        {/* Hero Profile Skeleton */}
        <div className="pt-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="w-32 h-32 rounded-3xl bg-white/10 shrink-0" />
          <div className="space-y-4 w-full text-center sm:text-left">
            <div className="h-10 w-3/4 sm:w-1/2 bg-white/10 rounded-xl mx-auto sm:mx-0" />
            <div className="h-5 w-1/3 bg-white/10 rounded-lg mx-auto sm:mx-0" />
            <div className="h-4 w-full max-w-xl bg-white/5 rounded mx-auto sm:mx-0" />
            <div className="h-4 w-4/5 max-w-lg bg-white/5 rounded mx-auto sm:mx-0" />
            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <div className="h-7 w-20 bg-white/5 rounded-full" />
              <div className="h-7 w-24 bg-white/5 rounded-full" />
              <div className="h-7 w-16 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>

        {/* Projects / Timeline Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
            <div className="h-6 w-36 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
          </div>
          <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
            <div className="h-6 w-36 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
