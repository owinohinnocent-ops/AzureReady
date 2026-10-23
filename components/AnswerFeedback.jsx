
export default function AnswerFeedback({
  correct,
  explanation,
}) {
  return (
    <div
      role="status"
      style={{
        padding: "16px",
        borderRadius: "8px",
        marginTop: "12px",
        backgroundColor: correct ? "#dcfce7" : "#fee2e2",
        color: correct ? "#166534" : "#991b1b",
        border: `1px solid ${correct ? "#86efac" : "#fca5a5"}`,
      }}
    >
      <strong>
        {correct ? "Correct!" : "Not quite."}
      </strong>
      {explanation && (
        <p style={{ marginBottom: 0 }}>{explanation}</p>
      )}
    </div>
  );
}
