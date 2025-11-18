import React, { useEffect, useState } from "react";
import API from "../utils/api";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  // Form state
  const [amount, setAmount] = useState("");
  const [idCustomer, setIdCustomer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    try {
      const response = await API.get("/api/sales");
      setSales(response.data);
    } catch (err) {
      setError("Error al cargar ventas");
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validaciones básicas
    if (!amount || Number(amount) <= 0) {
      setMessage("Ingrese un monto válido");
      return;
    }
    if (!idCustomer) {
      setMessage("Seleccione un cliente");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/api/sales", {
        amount: Number(amount),
        id_customer: Number(idCustomer),
      });

      setMessage(res.data.message || "Venta registrada con éxito");
      setAmount("");
      setIdCustomer("");
      // refrescar lista de ventas
      await fetchSales();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error al registrar venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registrar Venta</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <label>
            Monto: 
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
            />
          </label>
        </div>

        <div>
          <label>
            Cliente: 
            <select value={idCustomer} onChange={(e) => setIdCustomer(e.target.value)}>
              <option value="">-- Seleccionar cliente --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      {message && <p>{message}</p>}

      <h2>Listado de Ventas</h2>

      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Cliente</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>${sale.amount}</td>
              <td>{new Date(sale.created_at).toLocaleString()}</td>
              <td>{sale.customer_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesList;
