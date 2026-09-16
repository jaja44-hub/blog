import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <p className="mb-3 text-sm font-medium text-ochre">Private workspace</p>
      <h1 className="mb-3 font-display text-3xl font-semibold text-ink">Admin sign in</h1>
      <p className="mb-8 text-stone">Editorial tools are restricted to authorized administrators.</p>
      <AdminLoginForm />
    </main>
  );
}