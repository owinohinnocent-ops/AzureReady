export default function StatCard({ icon: Icon, label, value, hint, accent = 'text-blue-600 bg-blue-50 ring-blue-100' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon ? (
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${accent}`}>
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {hint ? <p className="mt-1.5 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}
