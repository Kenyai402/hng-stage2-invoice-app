import "./Filter.css";

export default function Filter({ activeFilter, onFilterChange }) {
  const filters = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
  ];

  return (
    <fieldset className="filter-fieldset">
      <legend className="sr-only">Filter by invoice status</legend>
      {filters.map((f) => (
        <label key={f.value} className="filter-label">
          <input
            type="radio"
            name="status-filter"
            value={f.value}
            checked={activeFilter === f.value}
            onChange={() => onFilterChange(f.value)}
            className="filter-radio sr-only"
          />
          <span className={`filter-chip ${activeFilter === f.value ? "active" : ""}`}>
            {f.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}