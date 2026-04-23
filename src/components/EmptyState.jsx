import "./EmptyState.css";

export default function EmptyState({ message, onCreateNew }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📄</div>
      <h3 className="empty-state-title">{message || "No invoices found"}</h3>
      <p className="empty-state-text">
        Try adjusting your filters or create a new invoice.
      </p>
      {onCreateNew && (
        <button className="btn-primary" onClick={onCreateNew}>
          + New Invoice
        </button>
      )}
    </div>
  );
}