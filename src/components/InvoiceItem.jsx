import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, calculateTotal } from "../utils/formatters";
import "./InvoiceItem.css";

export default function InvoiceItem({ invoice }) {
  const navigate = useNavigate();
  const total = invoice.total || calculateTotal(invoice.items || []);

  return (
    <article
      className="invoice-item"
      onClick={() => navigate(`/invoice/${invoice.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/invoice/${invoice.id}`);
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`Invoice ${invoice.id} for ${invoice.clientName}`}
    >
      <div className="invoice-item-id">
        <span className="hash">#</span>
        {invoice.id}
      </div>
      <div className="invoice-item-date">
        Due {formatDate(invoice.createdAt)}
      </div>
      <div className="invoice-item-client">{invoice.clientName}</div>
      <div className="invoice-item-total">{formatCurrency(total)}</div>
      <StatusBadge status={invoice.status} />
    </article>
  );
}