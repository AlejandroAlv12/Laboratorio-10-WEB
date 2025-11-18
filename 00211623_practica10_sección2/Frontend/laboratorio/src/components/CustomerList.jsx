import React, { useEffect, useState } from "react";
import API from "../utils/api";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get("/api/customers");
        setCustomers(response.data || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err.response?.data?.message || err.message || "Error al obtener clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Listado de Clientes</h2>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : customers.length === 0 ? (
        <p>No hay clientes para mostrar.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Código</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.address}</td>
                <td>{c.phone}</td>
                <td>{c.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
