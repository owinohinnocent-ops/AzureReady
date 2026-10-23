
export default function TopicCard({
  topic,
  onClick,
}) {
  const title = topic?.title ?? topic?.name ?? "Topic";
  const description = topic?.description ?? "";
  const questionCount = topic?.questionCount ?? topic?.question_count;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "20px",
        textAlign: "left",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#111827" }}>
        {title}
      </h3>

      {description && (
        <p style={{ color: "#6b7280" }}>{description}</p>
      )}

      {questionCount != null && (
        <p style={{ marginBottom: 0, color: "#2563eb" }}>
          {questionCount} questions
        </p>
      )}
    </button>
  );
}
