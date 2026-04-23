export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const generateId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const r1 = letters[Math.floor(Math.random() * 26)];
  const r2 = letters[Math.floor(Math.random() * 26)];
  const nums = Math.floor(Math.random() * 9000) + 1000;
  return `${r1}${r2}${nums}`;
};

export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};