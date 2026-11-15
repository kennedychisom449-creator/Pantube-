
"use client";

import { useState } from "react";
import { createSupabaseClient } from "../lib/supabase";

export default function Home() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createSupabaseClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Your Pantube account has been created successfully. Welcome!");
        } else {
          setMessage("Account created! Please check your email to verify your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setMessage("Login successful! Welcome back to Pantube.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as const,
      background: "linear-gradient(135deg, #f4f2ff, #ffffff 55%, #fff0f5)"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "22px 7%",
      background: "#ffffff",
      borderBottom: "1px solid #eeeeF5"
    },
    logo: {
      fontSize: "30px",
      fontWeight: 900,
      color: "#635bff",
      letterSpacing: "-1.5px"
    },
    main: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "55px 20px"
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      background: "#ffffff",
      padding: "35px",
      borderRadius: "22px",
      boxShadow: "0 15px 55px rgba(45, 40, 100, 0.10)"
    },
    input: {
      width: "100%",
      padding: "15px",
      border: "1px solid #e2e3ed",
      borderRadius: "10px",
      marginTop: "8px",
      marginBottom: "18px",
      outline: "none",
      background: "#ffffff",
      color: "#171923"
    },
    button: {
      width: "100%",
      padding: "15px",
      border: "none",
      borderRadius: "10px",
      background: "#635bff",
      color: "#ffffff",
      fontWeight: 700,
      fontSize: "16px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>Pan<span style={{ color: "#ff4f81" }}>tube</span></div>
        <span style={{ color: "#73788c", fontSize: "13px" }}>
          Connect. Share. Grow.
        </span>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "42px", marginBottom: "12px" }}>🌍</div>
            <h1 style={{ fontSize: "27px", margin: "0 0 10px", color: "#171923" }}>
              {mode === "signup" ? "Join Pantube" : "Welcome back"}
            </h1>
            <p style={{ color: "#73788c", lineHeight: 1.6, margin: 0 }}>
              {mode === "signup"
                ? "Create an account and connect with people around the world."
                : "Log in to continue your Pantube experience."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              style={{
                ...styles.button,
                background: mode === "signup" ? "#635bff" : "#f0efff",
                color: mode === "signup" ? "#ffffff" : "#635bff"
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              style={{
                ...styles.button,
                background: mode === "login" ? "#635bff" : "#f0efff",
                color: mode === "login" ? "#ffffff" : "#635bff"
              }}
            >
              Log in
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <label htmlFor="display-name" style={{ fontWeight: 600, color: "#333" }}>
                  Display name
                </label>
                <input
                  id="display-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  style={styles.input}
                />
              </>
            )}

            <label htmlFor="email" style={{ fontWeight: 600, color: "#333" }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <label htmlFor="password" style={{ fontWeight: 600, color: "#333" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={styles.input}
            />

            {error && (
              <p role="alert" style={{ color: "#d93050", fontSize: "14px" }}>
                {error}
              </p>
            )}

            {message && (
              <p role="status" style={{ color: "#16834a", fontSize: "14px" }}>
                {message}
              </p>
            )}

            <button type="submit" disabled={loading} style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1
            }}>
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Create my account"
                  : "Log in to Pantube"}
            </button>
          </form>

          <p style={{
            textAlign: "center",
            color: "#73788c",
            fontSize: "13px",
            marginTop: "22px",
            lineHeight: 1.6
          }}>
            By continuing, you agree to use Pantube respectfully and follow our community guidelines.
          </p>
        </section>
      </main>

      <footer style={{
        textAlign: "center",
        padding: "22px",
        color: "#73788c",
        fontSize: "13px"
      }}>
        © {new Date().getFullYear()} Pantube. Connect. Share. Grow.
      </footer>
    </div>
  );
}
