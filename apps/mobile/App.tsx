
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./src/supabase";

export default function App() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim()
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Your Pantube account has been created. Welcome!");
        } else {
          setMessage("Account created! Check your email to verify your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;

        setMessage("Welcome back to Pantube!");
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

  async function handleLogout() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      setMessage("You have logged out successfully.");
    }

    setLoading(false);
  }

  if (session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeCard}>
          <Text style={styles.logo}>
            Pan<Text style={styles.logoAccent}>tube</Text>
          </Text>

          <Text style={styles.welcomeTitle}>Welcome to Pantube!</Text>
          <Text style={styles.description}>
            You're signed in. Your social experience starts here.
          </Text>

          <Text style={styles.email}>{session.user.email}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Log out</Text>
            )}
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>
              Pan<Text style={styles.logoAccent}>tube</Text>
            </Text>
            <Text style={styles.tagline}>Connect. Share. Grow.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.emoji}>🌍</Text>

            <Text style={styles.title}>
              {mode === "signup" ? "Join Pantube" : "Welcome back"}
            </Text>

            <Text style={styles.description}>
              {mode === "signup"
                ? "Connect with people, share your ideas and grow together."
                : "Log in to continue your Pantube experience."}
            </Text>

            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, mode === "signup" && styles.activeTab]}
                onPress={() => {
                  setMode("signup");
                  setError("");
                  setMessage("");
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "signup" && styles.activeTabText
                  ]}
                >
                  Sign up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, mode === "login" && styles.activeTab]}
                onPress={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "login" && styles.activeTabText
                  ]}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            </View>

            {mode === "signup" && (
              <>
                <Text style={styles.label}>Display name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor="#999999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </>
            )}

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 8 characters"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                loading && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === "signup"
                    ? "Create my account"
                    : "Log in to Pantube"}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Connect. Share. Grow. Welcome to Pantube.
            </Text>
          </View>

          <Text style={styles.copyright}>
            © {new Date().getFullYear()} Pantube
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f4ff"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22
  },
  header: {
    alignItems: "center",
    marginBottom: 28
  },
  logo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#635bff",
    letterSpacing: -2
  },
  logoAccent: {
    color: "#ff4f81"
  },
  tagline: {
    color: "#73788c",
    fontSize: 13,
    marginTop: 5
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 25,
    elevation: 4,
    shadowColor: "#29245c",
    shadowOpacity: 0.08,
    shadowRadius: 18
  },
  emoji: {
    fontSize: 38,
    textAlign: "center",
    marginBottom: 12
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#171923",
    textAlign: "center"
  },
  description: {
    color: "#73788c",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 23
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#f0efff",
    borderRadius: 11,
    padding: 4,
    marginBottom: 22
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 9
  },
  activeTab: {
    backgroundColor: "#635bff"
  },
  tabText: {
    color: "#635bff",
    fontWeight: "700"
  },
  activeTabText: {
    color: "#ffffff"
  },
  label: {
    color: "#333333",
    fontWeight: "700",
    marginBottom: 7
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e3ed",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#171923",
    backgroundColor: "#ffffff",
    marginBottom: 17
  },
  primaryButton: {
    backgroundColor: "#635bff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800"
  },
  disabledButton: {
    opacity: 0.65
  },
  error: {
    color: "#d93050",
    marginBottom: 14,
    lineHeight: 20
  },
  message: {
    color: "#16834a",
    marginBottom: 14,
    lineHeight: 20
  },
  footerNote: {
    color: "#73788c",
    textAlign: "center",
    fontSize: 12,
    marginTop: 20
  },
  copyright: {
    color: "#85899a",
    textAlign: "center",
    fontSize: 12,
    marginTop: 25
  },
  welcomeCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28
  },
  welcomeTitle: {
    color: "#171923",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 35,
    textAlign: "center"
  },
  email: {
    color: "#635bff",
    fontWeight: "700",
    marginVertical: 20
  }
});
