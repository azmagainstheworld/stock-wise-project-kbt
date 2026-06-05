import React, { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState(null); // {role: 'Owner'|'Staff', shopName}

  const [products, setProducts] = useState([
    { id: 1, name: "Tepung Terigu", sku: "SKU-001", price: 25000, stock: 50 },
    { id: 2, name: "Gula Pasir", sku: "SKU-002", price: 15000, stock: 30 },
  ]);

  const [transactions, setTransactions] = useState([]);

  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    // Example: persist to localStorage for dev convenience
    const raw = localStorage.getItem("stockwise_data");
    if (raw) {
      const parsed = JSON.parse(raw);
      setProducts(parsed.products || []);
      setTransactions(parsed.transactions || []);
      setThreshold(parsed.threshold ?? 5);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "stockwise_data",
      JSON.stringify({ products, transactions, threshold }),
    );
  }, [products, transactions, threshold]);

  function handleRegister(payload) {
    // TODO: Integrasi API Express JS dengan Axios
    setUser(payload);
  }

  function handleLogin(creds) {
    // TODO: Integrasi API Express JS dengan Axios
    // Simulasi autentikasi: terima role dan shop
    setUser(creds);
  }

  function handleLogout() {
    // Logout: clear user state
    setUser(null);
  }

  function addProduct(p) {
    // p: {name, sku, price, stock}
    setProducts((prev) => [...prev, { id: Date.now(), ...p }]);
  }

  function addTransaction(tx) {
    // tx: {productId, type: 'in'|'out'|'return', qty, note, date}
    setTransactions((prev) => [{ id: Date.now(), ...tx }, ...prev]);
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === tx.productId) {
          const delta =
            tx.type === "in" ? tx.qty : tx.type === "out" ? -tx.qty : -tx.qty;
          return { ...prod, stock: Math.max(0, prod.stock + delta) };
        }
        return prod;
      }),
    );
  }

  const value = {
    user,
    handleRegister,
    handleLogin,
    handleLogout,
    products,
    addProduct,
    transactions,
    addTransaction,
    threshold,
    setThreshold,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
