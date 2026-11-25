export function DashboardSkeleton() {
  return (
    <div aria-label="Cargando los reportes" className="space-y-5" role="status">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div className="report-card h-32 animate-pulse p-5" key={index}><div className="h-3 w-28 rounded bg-slate-200" /><div className="mt-5 h-6 w-36 rounded bg-slate-200" /><div className="mt-3 h-3 w-24 rounded bg-slate-100" /></div>)}
      </div>
      <div className="report-card h-80 animate-pulse p-6"><div className="h-4 w-40 rounded bg-slate-200" /><div className="mt-8 h-56 rounded-xl bg-slate-100" /></div>
      <div className="grid gap-5 xl:grid-cols-2">{Array.from({ length: 2 }, (_, index) => <div className="report-card h-72 animate-pulse p-6" key={index}><div className="h-4 w-36 rounded bg-slate-200" /><div className="mt-6 space-y-4">{Array.from({ length: 4 }, (_, row) => <div className="h-7 rounded bg-slate-100" key={row} />)}</div></div>)}</div>
    </div>
  );
}
