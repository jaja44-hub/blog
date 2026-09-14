"use client";

import { useState } from "react";

type Draft = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  body_markdown: string;
  status: string;
  scheduled_for?: string | null;
};

type ResearchBrief = {
  id: string;
  title: string;
  question: string;
  priority: number;
  status: string;
};

export default function AdminWorkspace() {
  const [message, setMessage] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [briefs, setBriefs] = useState<ResearchBrief[]>([]);

  async function loadDrafts() {
    const response = await fetch("/api/admin/drafts");
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "Editorial storage is unavailable.");
      return;
    }
    setDrafts(result.posts ?? []);
  }

  async function loadBriefs() {
    const response = await fetch("/api/admin/research");
    const result = await response.json();
    if (response.ok) setBriefs(result.briefs ?? []);
  }

  async function createDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });

    const result = await response.json();
    setMessage(response.ok ? `Draft created: ${result.post.title}` : result.error ?? "Draft could not be created.");
    if (response.ok) event.currentTarget.reset();
    if (response.ok) await loadDrafts();
  }

  async function createBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Research brief created: ${result.brief.title}` : result.error ?? "Research brief could not be saved.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadBriefs();
    }
  }

  async function updateDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDraft) return;
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/drafts/${selectedDraft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? "Draft updated and revision recorded." : result.error ?? "Draft could not be updated.");
    if (response.ok) await loadDrafts();
  }

  async function changeStatus(status: string) {
    if (!selectedDraft) return;
    const response = await fetch(`/api/admin/drafts/${selectedDraft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    setMessage(response.ok ? `Draft moved to ${status}.` : result.error ?? "Status could not be changed.");
    if (response.ok) await loadDrafts();
  }

  async function importMarkdown(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const response = await fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: await file.text() })
    });
    const result = await response.json();
    setMessage(response.ok ? `Markdown imported: ${result.post.title}` : result.error ?? "Markdown could not be imported.");
    if (response.ok) await loadDrafts();
    event.target.value = "";
  }

  async function exportDraft(draft: Draft) {
    const response = await fetch(`/api/admin/drafts/${draft.id}?slug=${encodeURIComponent(draft.slug)}`);
    if (!response.ok) {
      setMessage("Draft export failed.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${draft.slug}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="border-t border-line pt-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-ink">Editorial queue</h2>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={loadDrafts} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Load drafts</button>
          <button type="button" onClick={loadBriefs} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Load research</button>
        </div>
      </div>
      {drafts.length > 0 && (
        <div className="mb-10 grid gap-3 md:grid-cols-2">
          {drafts.map((draft) => (
            <div key={draft.id} className="border border-line p-4">
              <button type="button" onClick={() => setSelectedDraft(draft)} className="w-full text-left hover:text-teal">
                <span className="text-xs uppercase tracking-wide text-ochre">{draft.status}</span>
                <span className="mt-1 block font-display text-lg font-semibold text-ink">{draft.title}</span>
                <span className="mt-1 block text-sm text-stone">{draft.category} · {draft.slug}</span>
              </button>
              <button type="button" onClick={() => exportDraft(draft)} className="mt-3 text-sm text-teal underline underline-offset-2">Export Markdown</button>
            </div>
          ))}
        </div>
      )}
      {selectedDraft && (
        <form onSubmit={updateDraft} className="mb-12 max-w-2xl space-y-4 border-y border-line py-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Edit draft</h2>
          <input name="title" defaultValue={selectedDraft.title} required className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <input name="slug" defaultValue={selectedDraft.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <input name="category" defaultValue={selectedDraft.category} required className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <textarea name="description" defaultValue={selectedDraft.description} rows={3} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <textarea name="bodyMarkdown" defaultValue={selectedDraft.body_markdown} rows={12} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Save revision</button>
            {selectedDraft.status === "draft" && <button type="button" onClick={() => changeStatus("in_review")} className="rounded-md border border-line px-4 py-3 text-sm text-teal hover:border-teal">Send to review</button>}
            {selectedDraft.status === "in_review" && <button type="button" onClick={() => changeStatus("published")} className="rounded-md bg-ochre px-4 py-3 text-sm font-medium text-white hover:opacity-90">Publish</button>}
            {selectedDraft.status !== "published" && <button type="button" onClick={() => {
              const scheduledFor = window.prompt("Enter a future ISO time, e.g. 2026-12-01T09:00:00Z");
              if (scheduledFor) fetch(`/api/admin/drafts/${selectedDraft.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scheduledFor }) }).then(() => loadDrafts());
            }} className="rounded-md border border-line px-4 py-3 text-sm text-teal hover:border-teal">Schedule</button>}
          </div>
        </form>
      )}
      <div className="max-w-2xl">
      <h2 className="mb-5 font-display text-2xl font-semibold text-ink">New draft</h2>
      <label className="mb-4 block text-sm text-stone">Import Markdown draft<input type="file" accept=".md,text/markdown" onChange={importMarkdown} className="mt-2 block w-full text-sm" /></label>
      <form onSubmit={createDraft} className="space-y-4">
        <input name="title" required placeholder="Working title" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
        <input name="slug" required placeholder="url-slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
        <input name="category" required placeholder="legal-rights" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
        <textarea name="description" placeholder="Short editorial description" rows={3} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
        <textarea name="bodyMarkdown" placeholder="Research notes or first draft in Markdown" rows={10} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
        <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Save draft</button>
      </form>
      </div>
      <section className="mt-12 max-w-2xl border-t border-line pt-8">
        <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Research planning</h2>
        {briefs.length > 0 && <div className="mb-6 space-y-3">{briefs.map((brief) => <div key={brief.id} className="border border-line p-4"><p className="text-xs uppercase tracking-wide text-ochre">Priority {brief.priority} · {brief.status}</p><p className="mt-1 font-display text-lg font-semibold text-ink">{brief.title}</p><p className="mt-1 text-sm text-stone">{brief.question}</p></div>)}</div>}
        <form onSubmit={createBrief} className="space-y-4">
          <input name="title" required placeholder="Research brief title" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <textarea name="question" required placeholder="What question should the next piece answer?" rows={3} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <div className="grid gap-4 sm:grid-cols-2"><input name="priority" type="number" min="1" max="5" defaultValue="3" className="w-full rounded-md border border-line bg-parchment px-4 py-3" /><input name="targetDate" type="date" className="w-full rounded-md border border-line bg-parchment px-4 py-3" /></div>
          <textarea name="notes" placeholder="Sources, evidence gaps, and editorial notes" rows={4} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Save research brief</button>
        </form>
      </section>
      {message && <p className="mt-4 text-sm text-stone" role="status">{message}</p>}
    </section>
  );
}