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

type PostRevision = {
  id: string;
  post_id: string;
  version: number;
  body_snapshot: string;
  title_snapshot: string | null;
  editor_id: string | null;
  change_note: string | null;
  created_at: string;
};

type ContentOpportunity = {
  id: string;
  topic_suggestion: string;
  demand_score: number | null;
  competition_score: number | null;
  monetization_potential: number | null;
  estimated_effort: number | null;
  priority_score: number | null;
  status: string;
};

type KnowledgeSource = {
  id: string;
  title: string | null;
  url: string | null;
  source_type: string | null;
  credibility_score: number | null;
  link_health: string | null;
  publisher: string | null;
  jurisdiction: string | null;
  content_type: string | null;
  usage_count: number | null;
};

export default function AdminWorkspace() {
  const [message, setMessage] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [briefs, setBriefs] = useState<ResearchBrief[]>([]);
  const [revisions, setRevisions] = useState<PostRevision[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [opportunities, setOpportunities] = useState<ContentOpportunity[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [showSources, setShowSources] = useState(false);

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

  async function loadRevisions(draftId: string) {
    const response = await fetch(`/api/admin/drafts/${draftId}/revisions`);
    const result = await response.json();
    if (response.ok) {
      setRevisions(result.revisions ?? []);
      setShowRevisions(true);
    } else {
      setMessage(result.error ?? "Could not load revision history.");
    }
  }

  async function loadAnalytics() {
    const response = await fetch("/api/admin/analytics");
    const result = await response.json();
    if (response.ok) {
      setAnalyticsData(result.summary);
      setShowAnalytics(true);
    } else {
      setMessage(result.error ?? "Could not load analytics data.");
    }
  }

  async function loadOpportunities() {
    const response = await fetch("/api/admin/analytics/opportunities");
    const result = await response.json();
    if (response.ok) {
      setOpportunities(result.opportunities ?? []);
    } else {
      setMessage(result.error ?? "Could not load content opportunities.");
    }
  }

  async function createOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/analytics/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Content opportunity created: ${result.opportunity.topic_suggestion}` : result.error ?? "Content opportunity could not be created.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadOpportunities();
    }
  }

  async function loadSources() {
    const response = await fetch("/api/admin/knowledge-sources");
    const result = await response.json();
    if (response.ok) {
      setSources(result.sources ?? []);
      setShowSources(true);
    } else {
      setMessage(result.error ?? "Could not load knowledge sources.");
    }
  }

  async function createSource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/knowledge-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Knowledge source created: ${result.source.title}` : result.error ?? "Knowledge source could not be created.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadSources();
    }
  }

  async function deleteSource(sourceId: string) {
    const response = await fetch(`/api/admin/knowledge-sources/${sourceId}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(response.ok ? "Knowledge source deleted." : result.error ?? "Knowledge source could not be deleted.");
    if (response.ok) {
      await loadSources();
    }
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
          <button type="button" onClick={loadAnalytics} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Analytics</button>
          <button type="button" onClick={loadOpportunities} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Content opportunities</button>
          <button type="button" onClick={loadSources} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Knowledge sources</button>
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
            <button type="button" onClick={() => loadRevisions(selectedDraft.id)} className="rounded-md border border-line px-4 py-3 text-sm text-teal hover:border-teal">View revisions</button>
          </div>
        </form>
      )}
      {showRevisions && selectedDraft && (
        <div className="mb-12 max-w-2xl space-y-4 border-y border-line py-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Revision history</h2>
            <button type="button" onClick={() => setShowRevisions(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          {revisions.length > 0 ? (
            <div className="space-y-3">
              {revisions.map((revision) => (
                <div key={revision.id} className="border border-line p-4">
                  <p className="text-xs uppercase tracking-wide text-ochre">Version {revision.version} · {new Date(revision.created_at).toLocaleString()}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-ink">{revision.title_snapshot || "Untitled"}</p>
                  {revision.change_note && <p className="mt-1 text-sm text-stone">{revision.change_note}</p>}
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-md bg-parchment p-3 text-sm text-stone">
                    <pre className="whitespace-pre-wrap">{revision.body_snapshot.substring(0, 500)}{revision.body_snapshot.length > 500 ? "..." : ""}</pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone">No revision history available.</p>
          )}
        </div>
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
      {showAnalytics && analyticsData && (
        <section className="mt-12 max-w-2xl border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Analytics overview</h2>
            <button type="button" onClick={() => setShowAnalytics(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          <div className="space-y-4">
            <div className="border border-line p-4">
              <h3 className="font-display text-lg font-semibold text-ink">Regional performance</h3>
              {analyticsData.regional_analytics && analyticsData.regional_analytics.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {analyticsData.regional_analytics.map((region: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-stone">{region.country_code || 'Unknown'}</span>
                      <span className="text-ink">{region.total_views} views</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone">No regional data available yet.</p>
              )}
            </div>
            <div className="border border-line p-4">
              <h3 className="font-display text-lg font-semibold text-ink">Content performance</h3>
              {analyticsData.content_performance ? (
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-stone">Total posts:</span>
                    <span className="ml-2 text-ink">{analyticsData.content_performance.total_posts || 0}</span>
                  </div>
                  <div>
                    <span className="text-stone">Avg performance:</span>
                    <span className="ml-2 text-ink">{analyticsData.content_performance.avg_performance ? analyticsData.content_performance.avg_performance.toFixed(2) : 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone">No content performance data available yet.</p>
              )}
            </div>
            <div className="border border-line p-4">
              <h3 className="font-display text-lg font-semibold text-ink">Content opportunities</h3>
              {analyticsData.content_opportunities && analyticsData.content_opportunities.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {analyticsData.content_opportunities.map((opp: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-stone">{opp.status}</span>
                      <span className="text-ink">{opp.count} opportunities</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone">No content opportunities data available yet.</p>
              )}
            </div>
          </div>
        </section>
      )}
      <section className="mt-12 max-w-2xl border-t border-line pt-8">
        <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Content opportunities</h2>
        {opportunities.length > 0 && (
          <div className="mb-6 space-y-3">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border border-line p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ochre">Priority {opportunity.priority_score || 'N/A'} · {opportunity.status}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-ink">{opportunity.topic_suggestion}</p>
                    <div className="mt-2 flex gap-4 text-sm text-stone">
                      <span>Demand: {opportunity.demand_score || 'N/A'}</span>
                      <span>Competition: {opportunity.competition_score || 'N/A'}</span>
                      <span>Monetization: {opportunity.monetization_potential || 'N/A'}</span>
                    </div>
                  </div>
                  {opportunity.status === 'suggested' && (
                    <button
                      type="button"
                      onClick={() => fetch(`/api/admin/analytics/opportunities/${opportunity.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'planned' })
                      }).then(() => loadOpportunities())}
                      className="text-sm text-teal underline underline-offset-2"
                    >
                      Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={createOpportunity} className="space-y-4">
          <input name="topicSuggestion" required placeholder="Topic suggestion" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="demandScore" type="number" step="0.1" min="0" max="10" placeholder="Demand score (0-10)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <input name="competitionScore" type="number" step="0.1" min="0" max="10" placeholder="Competition score (0-10)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <input name="monetizationPotential" type="number" step="0.1" min="0" max="10" placeholder="Monetization (0-10)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          </div>
          <input name="estimatedEffort" type="number" min="1" placeholder="Estimated effort (hours)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
          <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Create opportunity</button>
        </form>
      </section>
      {showSources && (
        <section className="mt-12 max-w-2xl border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Knowledge sources library</h2>
            <button type="button" onClick={() => setShowSources(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          {sources.length > 0 && (
            <div className="mb-6 space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="border border-line p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-ochre">Credibility {source.credibility_score ? source.credibility_score.toFixed(1) : 'N/A'} · {source.source_type || 'General'}</p>
                      <p className="mt-1 font-display text-lg font-semibold text-ink">{source.title || 'Untitled'}</p>
                      {source.url && (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-teal underline underline-offset-2">{source.url}</a>
                      )}
                      <div className="mt-2 flex gap-4 text-sm text-stone">
                        <span>Publisher: {source.publisher || 'N/A'}</span>
                        <span>Jurisdiction: {source.jurisdiction || 'N/A'}</span>
                        <span>Usage: {source.usage_count || 0}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSource(source.id)}
                      className="ml-4 text-sm text-red-600 underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={createSource} className="space-y-4">
            <input name="title" required placeholder="Source title" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <input name="url" required placeholder="Source URL" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="source_type" placeholder="Source type (e.g., academic, legal, official)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="publisher" placeholder="Publisher (e.g., court, government)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="jurisdiction" placeholder="Jurisdiction (e.g., Ethiopia, East Africa)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="content_type" placeholder="Content type (e.g., law, regulation, case)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            </div>
            <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Add source</button>
          </form>
        </section>
      )}
      {message && <p className="mt-4 text-sm text-stone" role="status">{message}</p>}
    </section>
  );
}