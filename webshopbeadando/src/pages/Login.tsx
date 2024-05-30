import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem("accessToken", data.accessToken);
      setIsLoggedIn(true);
      navigate("/");
      await new Promise<void>((resolve) => {
        window.location.reload();
        resolve();
      });
    } catch (error) {
      setError("Failed to log in");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/bejelentkezés");
  };

  const token = localStorage.getItem("accessToken");
  if (token) {
    return (
      <div className="full-page-container">
        <div className="login-container">
          <h2>Bejelentkezve</h2>
          <button onClick={handleLogout}>Kilépés</button>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-bg">
      <div className="login-container">
        <h2 className="login-title">Bejelentkezés</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Email cím:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Jelszó:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-button">Bejelentkezés</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
