export default function CvStudioLoading() {
  return (
    <div className="min-h-screen bg-[#07070B] text-slate-100 p-4 sm:p-8 flex flex-col space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="h-7 w-36 bg-white/10 rounded-lg" />
          <div className="h-4 w-60 bg-white/5 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-white/10 rounded-xl" />
          <div className="h-9 w-32 bg-white/10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="h-32 rounded-3xl bg-white/[0.03] border border-white/5 p-6" />
          <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/5 p-6" />
        </div>

        {/* PDF Preview skeleton */}
        <div className="lg:col-span-7">
          <div className="h-[600px] rounded-3xl bg-white/[0.04] border border-white/10" />
        </div>
      </div>
    </div>
  );
}
