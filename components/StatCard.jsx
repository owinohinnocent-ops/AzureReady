
export default function StatCard({
  title,
  value,
  description,
}) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        {title}
      </p>

      <div
        style={{
          marginTop: "8px",
          fontSize: "28px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}
      </div>

      {description && (
        <p
          style={{
            marginBottom: 0,
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
