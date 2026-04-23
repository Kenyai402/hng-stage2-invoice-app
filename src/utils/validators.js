export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Please enter a valid email";
  return "";
};

export const validateClientName = (name) => {
  if (!name || name.trim() === "") return "Client name is required";
  if (name.trim().length < 2) return "Client name must be at least 2 characters";
  return "";
};

export const validateItems = (items) => {
  if (!items || items.length === 0) return "An item must be added";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.name || item.name.trim() === "") return `Item ${i + 1}: Name is required`;
    if (!item.quantity || item.quantity <= 0) return `Item ${i + 1}: Quantity must be positive`;
    if (!item.price || item.price <= 0) return `Item ${i + 1}: Price must be positive`;
  }
  return "";
};

export const validateInvoiceForm = (formData) => {
  const errors = {};
  
  errors.clientName = validateClientName(formData.clientName);
  errors.clientEmail = validateEmail(formData.clientEmail);
  
  if (!formData.createdAt) errors.createdAt = "Invoice date is required";
  if (!formData.paymentTerms) errors.paymentTerms = "Payment terms are required";
  
  const itemsError = validateItems(formData.items);
  if (itemsError) errors.items = itemsError;
  
  return errors;
};