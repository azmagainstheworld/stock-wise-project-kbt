import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState(null); // {role: 'Owner'|'Staff', shopName}
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Auto login effect
  useEffect(() => {
    const token = localStorage.getItem("stockwise_token");
    if (token) {
      api.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("stockwise_token");
          setUser(null);
        })
        .finally(() => {
          setLoadingInitial(false);
        });
    } else {
      setLoadingInitial(false);
    }
  }, []);

  // Fetch data after user is available
  useEffect(() => {
    if (user) {
      Promise.all([
        api.get("/products"),
        api.get("/transactions"),
        api.get("/settings/threshold").catch(() => ({ data: { threshold: 5 } })) // fallback
      ]).then(([prodRes, transRes, threshRes]) => {
        setProducts(prodRes.data.data || []);
        setTransactions(transRes.data.data || []);
        setThreshold(threshRes.data.threshold ?? 5);
      }).catch(err => {
        console.error("Failed to fetch initial data", err);
      });
    } else {
      setProducts([]);
      setTransactions([]);
    }
  }, [user]);

  async function handleRegister(payload) {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("stockwise_token", res.data.token);
    setUser(res.data.user);
  }

  async function handleLogin(creds) {
    const res = await api.post("/auth/login", creds);
    localStorage.setItem("stockwise_token", res.data.token);
    setUser(res.data.user);
  }

  function handleLogout() {
    localStorage.removeItem("stockwise_token");
    setUser(null);
  }

  async function addProduct(p) {
    const res = await api.post("/products", p);
    const newProduct = res.data.data;
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }

  async function addTransaction(tx) {
    const res = await api.post("/transactions", tx);
    const { transaction, product } = res.data.data;
    
    setTransactions((prev) => [transaction, ...prev]);
    setProducts((prev) => prev.map((prod) => prod.id === product.id ? product : prod));
    
    return res.data.data;
  }

  async function updateThreshold(newThreshold) {
    const res = await api.patch("/settings/threshold", { threshold: newThreshold });
    setThreshold(res.data.threshold);
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
    setThreshold: updateThreshold,
    loadingInitial,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
