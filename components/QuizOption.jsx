
export default function QuizOption({
  option,
  selected = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{
        display: "block",
        width: "100%",
        padding: "12px 16px",
        marginBottom: "8px",
        textAlign: "left",
        border: selected ? "2px solid #2563eb" : "1px solid #d1d5db",
        borderRadius: "8px",
        backgroundColor: selected ? "#eff6ff" : "#ffffff",
        color: "#111827",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {option}
    </button>
  );
}
