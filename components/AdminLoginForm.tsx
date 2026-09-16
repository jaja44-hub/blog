"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"token" | "credentials">("token");

  async function submitToken(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        setError("The access token was not accepted.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Auth Method Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setAuthMethod("token")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            authMethod === "token"
              ? "bg-teal text-white"
              : "bg-parchment text-ink border border-line"
          }`}
        >
          Access Token
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod("credentials")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            authMethod === "credentials"
              ? "bg-teal text-white"
              : "bg-parchment text-ink border border-line"
          }`}
        >
          Email & Password
        </button>
      </div>

      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

      {authMethod === "token" ? (
        <form onSubmit={submitToken} className="space-y-4">
          <label className="block text-sm font-medium text-ink" htmlFor="admin-token">
            Access token
          </label>
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-line bg-parchment px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCredentials} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-md border border-line bg-parchment px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-line bg-parchment px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}