import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import StatusBadge from "./StatusBadge";
import Modal from "./Modal";
import { formatDate, formatCurrency, calculateTotal } from "../utils/formatters";
import "./InvoiceDetail.css";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoiceById, deleteInvoice, markAsPaid } = useInvoices();
  const invoice = getInvoiceById(id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!invoice) {
    return (
      <div className="invoice-detail-page">
        <div className="not-found">
          <h2>Invoice not found</h2>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Go back to invoices
          </button>
        </div>
      </div>
    );
  }

  const total = invoice.total || calculateTotal(invoice.items || []);

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    setShowDeleteModal(false);
    navigate("/");
  };

  const handleMarkAsPaid = () => {
    markAsPaid(invoice.id);
  };

  return (
    <div className="invoice-detail-page">
      <button className="btn-back" onClick={() => navigate("/")}>
        ← Go back
      </button>

      <header className="detail-header">
        <div className="detail-status-row">
          <span className="detail-status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="detail-actions">
          <button
            className="btn-edit"
            onClick={() => navigate(`/invoice/${invoice.id}/edit`)}
          >
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
          {invoice.status === "pending" && (
            <button className="btn-mark-paid" onClick={handleMarkAsPaid}>
              Mark as Paid
            </button>
          )}
        </div>
      </header>

      <main className="detail-card">
        <div className="detail-top">
          <div>
            <h2 className="detail-id">
              <span className="hash">#</span>
              {invoice.id}
            </h2>
            <p className="detail-description">{invoice.description}</p>
          </div>
          <div className="detail-sender-address">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="detail-dates">
          <div className="detail-date-group">
            <span className="detail-label">Invoice Date</span>
            <span className="detail-value">{formatDate(invoice.createdAt)}</span>
          </div>
          <div className="detail-date-group">
            <span className="detail-label">Payment Due</span>
            <span className="detail-value">
              {formatDate(
                new Date(
                  new Date(invoice.createdAt).getTime() +
                    invoice.paymentTerms * 24 * 60 * 60 * 1000
                )
              )}
            </span>
          </div>
        </div>

        <div className="detail-addresses">
          <div className="detail-bill-to">
            <span className="detail-label">Bill To</span>
            <span className="detail-value detail-client-name">{invoice.clientName}</span>
            <p>{invoice.clientAddress.street}</p>
            <p>{invoice.clientAddress.city}</p>
            <p>{invoice.clientAddress.postCode}</p>
            <p>{invoice.clientAddress.country}</p>
          </div>
          <div className="detail-sent-to">
            <span className="detail-label">Sent to</span>
            <span className="detail-value">{invoice.clientEmail}</span>
          </div>
        </div>

        <div className="detail-items">
          <div className="detail-items-header">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          {invoice.items.map((item) => (
            <div key={item.id} className="detail-items-row">
              <span className="detail-item-name">{item.name}</span>
              <span className="detail-item-qty">{item.quantity}</span>
              <span className="detail-item-price">{formatCurrency(item.price)}</span>
              <span className="detail-item-total">{formatCurrency(item.quantity * item.price)}</span>
            </div>
          ))}
        </div>

        <div className="detail-total-row">
          <span className="detail-total-label">Amount Due</span>
          <span className="detail-total-value">{formatCurrency(total)}</span>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        actions={
          <>
            <button
              className="btn-cancel"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete invoice #{invoice.id}? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
}