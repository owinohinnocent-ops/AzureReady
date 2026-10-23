
export default function AttemptList({ attempts = [] }) {
  if (!attempts.length) {
    return (
      <p style={{ color: "#6b7280", padding: "12px 0" }}>
        No quiz attempts yet.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {attempts.map((attempt, index) => (
        <div
          key={attempt.id ?? index}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        >
          <strong>
            {attempt.topicTitle ?? attempt.topic ?? "Quiz attempt"}
          </strong>

          <p style={{ marginBottom: 0, color: "#6b7280" }}>
            Score: {attempt.score ?? 0}%
            {attempt.date
              ? ` · ${new Date(attempt.date).toLocaleDateString()}`
              : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
