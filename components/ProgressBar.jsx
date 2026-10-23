const TONES = {
  blue: 'bg-gradient-to-r from-blue-600 to-sky-400',
  teal: 'bg-gradient-to-r from-cyan-600 to-teal-400',
  indigo: 'bg-gradient-to-r from-indigo-600 to-violet-400',
  slate: 'bg-gradient-to-r from-slate-700 to-slate-500',
  emerald: 'bg-gradient-to-r from-emerald-600 to-teal-400',
  amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
};

export default function ProgressBar({ value = 0, tone = 'blue', className = '', label }) {
  const percent = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>{label}</span>
          <span className="tabular-nums text-slate-700">{percent}%</span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${TONES[tone] || TONES.blue}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
