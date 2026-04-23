import { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId, calculateTotal } from "../utils/formatters";

const InvoiceContext = createContext();

const initialInvoices = [
  {
    id: "RT3080",
    createdAt: "2026-04-19",
    paymentTerms: 30,
    description: "Website Redesign",
    clientName: "Alex Johnson",
    clientEmail: "alex@example.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [
      { id: "1", name: "Brand Guidelines", quantity: 1, price: 1800.9 },
      { id: "2", name: "UI Design", quantity: 2, price: 1200.0 },
    ],
  },
  {
    id: "XM9141",
    createdAt: "2026-04-21",
    paymentTerms: 14,
    description: "Logo Design",
    clientName: "Sarah Miller",
    clientEmail: "sarah@example.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "45 Oak Avenue",
      city: "Manchester",
      postCode: "M1 2AB",
      country: "United Kingdom",
    },
    items: [{ id: "1", name: "Logo Design", quantity: 1, price: 600.0 }],
  },
  {
    id: "RG0314",
    createdAt: "2026-04-22",
    paymentTerms: 7,
    description: "App Prototype",
    clientName: "James Brown",
    clientEmail: "james@example.com",
    status: "draft",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "78 River Road",
      city: "Bristol",
      postCode: "BS1 4CD",
      country: "United Kingdom",
    },
    items: [
      { id: "1", name: "Wireframes", quantity: 3, price: 400.0 },
      { id: "2", name: "Prototype", quantity: 1, price: 1500.0 },
    ],
  },
];

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useLocalStorage("invoices", initialInvoices);

  const addInvoice = useCallback(
    (invoiceData) => {
      const newInvoice = {
        ...invoiceData,
        id: generateId(),
        status: invoiceData.status || "pending",
      };
      newInvoice.total = calculateTotal(newInvoice.items);
      setInvoices((prev) => [newInvoice, ...prev]);
      return newInvoice;
    },
    [setInvoices]
  );

  const updateInvoice = useCallback(
    (id, updatedData) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? { ...updatedData, id, total: calculateTotal(updatedData.items) }
            : inv
        )
      );
    },
    [setInvoices]
  );

  const deleteInvoice = useCallback(
    (id) => {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    },
    [setInvoices]
  );

  const markAsPaid = useCallback(
    (id) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: "paid" } : inv
        )
      );
    },
    [setInvoices]
  );

  const getInvoiceById = useCallback(
    (id) => {
      return invoices.find((inv) => inv.id === id) || null;
    },
    [invoices]
  );

  const value = useMemo(
    () => ({
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
      getInvoiceById,
    }),
    [invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid, getInvoiceById]
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return context;
}