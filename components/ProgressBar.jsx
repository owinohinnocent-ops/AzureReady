
export default function ProgressBar({ value = 0, max = 100 }) {
  const percentage = max > 0
    ? Math.min(100, Math.max(0, (value / max) * 100))
    : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        width: "100%",
        height: "8px",
        backgroundColor: "#e5e7eb",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: "#2563eb",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
