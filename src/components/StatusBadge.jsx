import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  const statusConfig = {
    paid: { label: "Paid", className: "status-paid" },
    pending: { label: "Pending", className: "status-pending" },
    draft: { label: "Draft", className: "status-draft" },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`status-badge ${config.className}`} aria-label={`Status: ${config.label}`}>
      <span className="status-dot" aria-hidden="true" />
      {config.label}
    </span>
  );
}