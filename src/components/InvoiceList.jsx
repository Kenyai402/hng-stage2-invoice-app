import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import InvoiceItem from "./InvoiceItem";
import Filter from "./Filter";
import EmptyState from "./EmptyState";
import ThemeToggle from "./ThemeToggle";
import "./InvoiceList.css";

export default function InvoiceList() {
  const { invoices } = useInvoices();
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const filteredInvoices = activeFilter === "all"
    ? invoices
    : invoices.filter((inv) => inv.status === activeFilter);

  const invoiceCount = filteredInvoices.length;

  return (
    <div className="invoice-list-page">
      <header className="invoice-list-header">
        <div className="header-left">
          <h1 className="page-title">Invoices</h1>
          <p className="invoice-count">
            {invoiceCount === 0
              ? "No invoices"
              : `There are ${invoiceCount} total invoice${invoiceCount !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="header-right">
          <Filter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <ThemeToggle />
          <button
            className="btn-primary btn-new-invoice"
            onClick={() => navigate("/invoice/new")}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">New Invoice</span>
          </button>
        </div>
      </header>

      <main className="invoice-list-main">
        {filteredInvoices.length === 0 ? (
          <EmptyState
            message={
              activeFilter === "all"
                ? "No invoices yet"
                : `No ${activeFilter} invoices`
            }
            onCreateNew={() => navigate("/invoice/new")}
          />
        ) : (
          <div className="invoice-list">
            {filteredInvoices.map((invoice) => (
              <InvoiceItem key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}