import { useState } from "react";
import {
    loginUser,
    registerUser,
    setAuthState,
    getApiErrorMessage,
} from "../../services/api";
import "./Auth.css";

export default function Auth() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [identifier, setIdentifier] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            if (mode === "register") {
                const res = await registerUser({ username, email, password });
                setAuthState(res.data.token, res.data.user);
            } else {
                const res = await loginUser({ identifier, password });
                setAuthState(res.data.token, res.data.user);
            }
            window.location.href = "/";
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell auth">
            <div className="page-head">
                <h2 className="page-title">{mode === "login" ? "Welcome back" : "Create account"}</h2>
                <p className="page-subtitle">
                    {mode === "login"
                        ? "Log in to keep your sessions saved."
                        : "Register to start saving your AI history."}
                </p>
            </div>

            <div className="auth__layout card panel">
                <div className="auth__toggle">
                    <button
                        className={`auth__tab ${mode === "login" ? "auth__tab--active" : ""}`}
                        onClick={() => setMode("login")}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={`auth__tab ${mode === "register" ? "auth__tab--active" : ""}`}
                        onClick={() => setMode("register")}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                {mode === "register" ? (
                    <div className="auth__fields">
                        <label className="field">
                            <span className="field__label">Username</span>
                            <input
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Email</span>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Password</span>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                            />
                        </label>
                    </div>
                ) : (
                    <div className="auth__fields">
                        <label className="field">
                            <span className="field__label">Email or username</span>
                            <input
                                className="input"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Email or username"
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Password</span>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                            />
                        </label>
                    </div>
                )}

                {error ? <div className="auth__error">{error}</div> : null}

                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Working..." : mode === "login" ? "Login" : "Register"}
                </button>
            </div>
        </div>
    );
}
