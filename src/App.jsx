import { Routes, Route } from "react-router-dom";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/invoice/new" element={<InvoiceForm />} />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
        <Route path="/invoice/:id/edit" element={<InvoiceForm />} />
      </Routes>
    </div>
  );
}