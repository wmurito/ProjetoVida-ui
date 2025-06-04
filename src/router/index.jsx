import React from "react";
import ReactDOM from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../hooks/useAuth";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);