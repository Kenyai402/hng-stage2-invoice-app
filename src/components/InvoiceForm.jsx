import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import { validateInvoiceForm } from "../utils/validators";
import { calculateTotal, formatCurrency } from "../utils/formatters";
import Modal from "./Modal";
import "./InvoiceForm.css";

const emptyItem = { id: Date.now().toString(), name: "", quantity: 1, price: 0 };

const emptyForm = {
  clientName: "",
  clientEmail: "",
  createdAt: new Date().toISOString().split("T")[0],
  paymentTerms: 30,
  description: "",
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  items: [{ ...emptyItem }],
  status: "pending",
};

export default function InvoiceForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { invoices, addInvoice, updateInvoice } = useInvoices();

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const invoice = invoices.find((inv) => inv.id === id);
      if (invoice) {
        setFormData({
          clientName: invoice.clientName || "",
          clientEmail: invoice.clientEmail || "",
          createdAt: invoice.createdAt || "",
          paymentTerms: invoice.paymentTerms || 30,
          description: invoice.description || "",
          senderAddress: invoice.senderAddress || { street: "", city: "", postCode: "", country: "" },
          clientAddress: invoice.clientAddress || { street: "", city: "", postCode: "", country: "" },
          items: invoice.items.length > 0 ? invoice.items : [{ ...emptyItem }],
          status: invoice.status || "pending",
        });
      }
    }
  }, [isEditing, id, invoices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsFormDirty(true);
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    setIsFormDirty(true);
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });

    if (errors.items) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.items;
        return next;
      });
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem, id: Date.now().toString() }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (status = "pending") => {
    const newFormData = { ...formData, status };
    const validationErrors = validateInvoiceForm(newFormData);
    
    const hasErrors = Object.values(validationErrors).some((v) => v !== "");
    
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    if (isEditing) {
      updateInvoice(id, newFormData);
    } else {
      addInvoice(newFormData);
    }

    setIsFormDirty(false);
    navigate("/");
  };

  const handleDiscard = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate("/");
    }
  };

  const total = calculateTotal(formData.items);

  return (
    <div className="invoice-form-page">
      <button className="btn-back" onClick={handleDiscard}>
        ← Go back
      </button>

      <h2 className="form-title">
        {isEditing ? `Edit #${id}` : "New Invoice"}
      </h2>

      <form onSubmit={(e) => e.preventDefault()} className="invoice-form" noValidate>
        {/* Bill From */}
        <fieldset className="form-section">
          <legend className="section-title">Bill From</legend>
          <div className="form-group full-width">
            <label htmlFor="sender-street">Street Address</label>
            <input
              id="sender-street"
              name="senderAddress.street"
              type="text"
              value={formData.senderAddress.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sender-city">City</label>
              <input
                id="sender-city"
                name="senderAddress.city"
                type="text"
                value={formData.senderAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="sender-postCode">Post Code</label>
              <input
                id="sender-postCode"
                name="senderAddress.postCode"
                type="text"
                value={formData.senderAddress.postCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="sender-country">Country</label>
            <input
              id="sender-country"
              name="senderAddress.country"
              type="text"
              value={formData.senderAddress.country}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* Bill To */}
        <fieldset className="form-section">
          <legend className="section-title">Bill To</legend>
          <div className="form-group full-width">
            <label htmlFor="clientName">Client's Name *</label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              value={formData.clientName}
              onChange={handleChange}
              className={errors.clientName ? "input-error" : ""}
              required
            />
            {errors.clientName && <span className="error-text">{errors.clientName}</span>}
          </div>
          <div className="form-group full-width">
            <label htmlFor="clientEmail">Client's Email *</label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={handleChange}
              className={errors.clientEmail ? "input-error" : ""}
              required
            />
            {errors.clientEmail && <span className="error-text">{errors.clientEmail}</span>}
          </div>
          <div className="form-group full-width">
            <label htmlFor="client-street">Street Address</label>
            <input
              id="client-street"
              name="clientAddress.street"
              type="text"
              value={formData.clientAddress.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client-city">City</label>
              <input
                id="client-city"
                name="clientAddress.city"
                type="text"
                value={formData.clientAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="client-postCode">Post Code</label>
              <input
                id="client-postCode"
                name="clientAddress.postCode"
                type="text"
                value={formData.clientAddress.postCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="client-country">Country</label>
            <input
              id="client-country"
              name="clientAddress.country"
              type="text"
              value={formData.clientAddress.country}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="createdAt">Invoice Date *</label>
              <input
                id="createdAt"
                name="createdAt"
                type="date"
                value={formData.createdAt}
                onChange={handleChange}
                className={errors.createdAt ? "input-error" : ""}
                required
              />
              {errors.createdAt && <span className="error-text">{errors.createdAt}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="paymentTerms">Payment Terms</label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
              >
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">Project Description</label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* Items List */}
        <fieldset className="form-section">
          <legend className="section-title">Item List</legend>
          {errors.items && <span className="error-text item-error">{errors.items}</span>}
          
          <div className="items-header">
            <span className="item-label-name">Item Name</span>
            <span className="item-label-qty">Qty.</span>
            <span className="item-label-price">Price</span>
            <span className="item-label-total">Total</span>
            <span className="item-label-action"></span>
          </div>

          {formData.items.map((item, index) => (
            <div key={item.id} className="item-row">
              <input
                type="text"
                className="item-name"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                placeholder="Item name"
                aria-label={`Item ${index + 1} name`}
              />
              <input
                type="number"
                className="item-qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                min="1"
                aria-label={`Item ${index + 1} quantity`}
              />
              <input
                type="number"
                className="item-price"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                aria-label={`Item ${index + 1} price`}
              />
              <span className="item-total">{formatCurrency(item.quantity * item.price)}</span>
              <button
                type="button"
                className="btn-remove-item"
                onClick={() => removeItem(index)}
                aria-label={`Remove item ${index + 1}`}
              >
                🗑️
              </button>
            </div>
          ))}

          <button type="button" className="btn-add-item" onClick={addItem}>
            + Add New Item
          </button>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <div className="form-actions-left">
            <button type="button" className="btn-discard" onClick={handleDiscard}>
              Discard
            </button>
          </div>
          <div className="form-actions-right">
            <button
              type="button"
              className="btn-draft"
              onClick={() => handleSubmit("draft")}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="btn-save"
              onClick={() => handleSubmit("pending")}
            >
              Save & Send
            </button>
          </div>
        </div>
      </form>

      {/* Discard Modal */}
      <Modal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Discard Changes?"
        actions={
          <>
            <button
              className="btn-cancel"
              onClick={() => setShowDiscardModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={() => {
                setShowDiscardModal(false);
                setIsFormDirty(false);
                navigate("/");
              }}
            >
              Discard
            </button>
          </>
        }
      >
        <p>Are you sure you want to discard your changes? This cannot be undone.</p>
      </Modal>
    </div>
  );
}