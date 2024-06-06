import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/Login.css";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profil");
    }
  }, [isLoggedIn, navigate]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
    return re.test(password);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;
    if (!username) {
      setUsernameError("Mező kitöltése kötelező");
      valid = false;
    } else if (!validateEmail(username)) {
      setUsernameError("Hibás e-mail formátum");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Mező kitöltése kötelező");
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy darab kisbetűt és számot");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Hibás felhasználónév vagy jelszó");
      }

      const data = await response.json();
      login(data.accessToken);  
      setError(""); 
      navigate("/", { replace: true }); 
    } catch (error) {
      setError("Hibás felhasználónév vagy jelszó, próbálja meg újra");
    }
  };

  return (
    <div className="custom-bg">
      <div className="login-container">
        {isLoggedIn ? (
          <div>
            <h2>Bejelentkezve</h2>
            <button onClick={logout}>Kilépés</button>
          </div>
        ) : (
          <div>
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
                  autoComplete="email"
                />
                {usernameError && <div className="error-message">{usernameError}</div>}
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
                  autoComplete="current-password"
                />
                {passwordError && <div className="error-message">{passwordError}</div>}
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="submit-button">Bejelentkezés</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
