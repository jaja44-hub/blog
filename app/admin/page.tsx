import { redirect } from "next/navigation";
import { hasAnyAdminSession } from "@/lib/admin-auth";
import AdminWorkspace from "@/components/AdminWorkspace";

export default async function AdminPage() {
  const authStatus = await hasAnyAdminSession();
  if (!authStatus.authenticated) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="mb-3 text-sm font-medium text-ochre">Editorial workspace</p>
      <h1 className="mb-3 font-display text-4xl font-semibold text-ink">Content command center</h1>
      <p className="mb-10 max-w-2xl text-stone">Create research-ready drafts and move them through the editorial workflow. Public publishing remains separate until a draft is explicitly released.</p>
      <AdminWorkspace />
    </main>
  );
}