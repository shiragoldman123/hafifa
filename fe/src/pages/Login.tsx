// src/pages/Login.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =  "http://localhost:3002/api";

export function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = document.cookie.includes("access_token=");
    
    if (hasToken) {
      navigate("/");
      return;
    }

    const relayState = "/"; 
    window.location.href = `${API_URL}/auth/login?RelayState=${encodeURIComponent(relayState)}`;
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Redirecting to login...</h2>
    </div>
  );
}