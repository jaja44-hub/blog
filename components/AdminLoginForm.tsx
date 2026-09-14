"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
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
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">
        Sign in
      </button>
    </form>
  );
}