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

type MediaAsset = {
  id: string;
  storage_key: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  credit: string | null;
  license: string | null;
  created_at: string;
  updated_at: string;
};

type MediaTag = {
  id: string;
  media_id: string | null;
  tag: string | null;
  relevance_score: number | null;
  created_at: string;
};

type GoogleAdsCampaign = {
  id: string;
  campaign_name: string | null;
  campaign_id: string | null;
  campaign_type: string | null;
  status: string | null;
  budget_daily: number | null;
  budget_total: number | null;
  start_date: string | null;
  end_date: string | null;
  target_locations: any;
  target_keywords: any;
  target_audience: any;
  created_at: string;
  updated_at: string;
};

type GoogleAdsPerformance = {
  id: string;
  campaign_id: string | null;
  date: string | null;
  impressions: number | null;
  clicks: number | null;
  cost: number | null;
  conversions: number | null;
  conversion_value: number | null;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  created_at: string;
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
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [showMedia, setShowMedia] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [mediaTags, setMediaTags] = useState<MediaTag[]>([]);
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([]);
  const [showGoogleAds, setShowGoogleAds] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<GoogleAdsCampaign | null>(null);
  const [campaignPerformance, setCampaignPerformance] = useState<GoogleAdsPerformance[]>([]);
  const [adSenseUnits, setAdSenseUnits] = useState<any[]>([]);
  const [showAdSense, setShowAdSense] = useState(false);
  const [adSensePerformance, setAdSensePerformance] = useState<any[]>([]);
  const [searchConsoleData, setSearchConsoleData] = useState<any[]>([]);
  const [showSearchConsole, setShowSearchConsole] = useState(false);

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

  async function loadMedia() {
    const response = await fetch("/api/admin/media");
    const result = await response.json();
    if (response.ok) {
      setMediaAssets(result.assets ?? []);
      setShowMedia(true);
    } else {
      setMessage(result.error ?? "Could not load media assets.");
    }
  }

  async function loadMediaTags(mediaId: string) {
    const response = await fetch(`/api/admin/media/tags?media_id=${mediaId}`);
    const result = await response.json();
    if (response.ok) {
      setMediaTags(result.tags ?? []);
    } else {
      setMessage(result.error ?? "Could not load media tags.");
    }
  }

  async function createMediaAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Media asset created: ${result.asset.original_filename}` : result.error ?? "Media asset could not be created.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadMedia();
    }
  }

  async function updateMediaAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMedia) return;
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedMedia.id, ...Object.fromEntries(form.entries()) })
    });
    const result = await response.json();
    setMessage(response.ok ? "Media asset updated." : result.error ?? "Media asset could not be updated.");
    if (response.ok) {
      await loadMedia();
      setSelectedMedia(null);
    }
  }

  async function deleteMediaAsset(id: string) {
    const response = await fetch(`/api/admin/media?id=${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(response.ok ? "Media asset deleted." : result.error ?? "Media asset could not be deleted.");
    if (response.ok) {
      await loadMedia();
    }
  }

  async function addMediaTag(mediaId: string, tag: string) {
    const response = await fetch("/api/admin/media/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media_id: mediaId, tag })
    });
    const result = await response.json();
    setMessage(response.ok ? `Tag added: ${result.tag.tag}` : result.error ?? "Tag could not be added.");
    if (response.ok) {
      await loadMediaTags(mediaId);
    }
  }

  async function deleteMediaTag(tagId: string, mediaId: string) {
    const response = await fetch(`/api/admin/media/tags?id=${tagId}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(response.ok ? "Tag deleted." : result.error ?? "Tag could not be deleted.");
    if (response.ok) {
      await loadMediaTags(mediaId);
    }
  }

  async function suggestTags(mediaId: string) {
    const response = await fetch(`/api/admin/media/suggest-tags?media_id=${mediaId}`);
    const result = await response.json();
    if (response.ok && result.suggested_tags && result.suggested_tags.length > 0) {
      setMessage(`Suggested ${result.suggested_tags.length} tags. Applying them now.`);
      for (const tag of result.suggested_tags) {
        await addMediaTag(mediaId, tag);
      }
    } else {
      setMessage(result.error ?? "No tag suggestions available.");
    }
  }

  async function loadGoogleAds() {
    const response = await fetch("/api/admin/google-ads/campaigns");
    const result = await response.json();
    if (response.ok) {
      setCampaigns(result.campaigns ?? []);
      setShowGoogleAds(true);
    } else {
      setMessage(result.error ?? "Could not load Google Ads campaigns.");
    }
  }

  async function loadCampaignPerformance(campaignId: string) {
    const response = await fetch(`/api/admin/google-ads/performance?campaign_id=${campaignId}`);
    const result = await response.json();
    if (response.ok) {
      setCampaignPerformance(result.performance ?? []);
    } else {
      setMessage(result.error ?? "Could not load campaign performance.");
    }
  }

  async function createCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/google-ads/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Campaign created: ${result.campaign.campaign_name}` : result.error ?? "Campaign could not be created.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadGoogleAds();
    }
  }

  async function updateCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCampaign) return;
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/google-ads/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedCampaign.id, ...Object.fromEntries(form.entries()) })
    });
    const result = await response.json();
    setMessage(response.ok ? "Campaign updated." : result.error ?? "Campaign could not be updated.");
    if (response.ok) {
      await loadGoogleAds();
      setSelectedCampaign(null);
    }
  }

  async function deleteCampaign(id: string) {
    const response = await fetch(`/api/admin/google-ads/campaigns?id=${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(response.ok ? "Campaign deleted." : result.error ?? "Campaign could not be deleted.");
    if (response.ok) {
      await loadGoogleAds();
    }
  }

  async function loadAdSense() {
    const response = await fetch("/api/admin/adsense/ad-units");
    const result = await response.json();
    if (response.ok) {
      setAdSenseUnits(result.units ?? []);
      setShowAdSense(true);
    } else {
      setMessage(result.error ?? "Could not load AdSense ad units.");
    }
  }

  async function loadAdSensePerformance(adUnitId?: string) {
    const response = await fetch(`/api/admin/adsense/performance?ad_unit_id=${adUnitId || ''}`);
    const result = await response.json();
    if (response.ok) {
      setAdSensePerformance(result.performance ?? []);
    } else {
      setMessage(result.error ?? "Could not load AdSense performance.");
    }
  }

  async function createAdSenseUnit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/adsense/ad-units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Ad unit created: ${result.unit.ad_unit_name}` : result.error ?? "Ad unit could not be created.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadAdSense();
    }
  }

  async function deleteAdSenseUnit(id: string) {
    const response = await fetch(`/api/admin/adsense/ad-units?id=${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(response.ok ? "Ad unit deleted." : result.error ?? "Ad unit could not be deleted.");
    if (response.ok) {
      await loadAdSense();
    }
  }

  async function loadSearchConsole() {
    const response = await fetch("/api/admin/search-console");
    const result = await response.json();
    if (response.ok) {
      setSearchConsoleData(result.data ?? []);
      setShowSearchConsole(true);
    } else {
      setMessage(result.error ?? "Could not load Search Console data.");
    }
  }

  async function createSearchConsoleData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/search-console", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const result = await response.json();
    setMessage(response.ok ? `Search Console data created for ${result.data.date}` : result.error ?? "Data could not be created.");
    if (response.ok) {
      event.currentTarget.reset();
      await loadSearchConsole();
    }
  }

  async function deleteSearchConsoleData(id: string) {
    const response = await fetch(`/api/admin/search-console?id=${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(response.ok ? "Search Console data deleted." : result.error ?? "Data could not be deleted.");
    if (response.ok) {
      await loadSearchConsole();
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
          <button type="button" onClick={loadMedia} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Media library</button>
          <button type="button" onClick={loadGoogleAds} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Google Ads</button>
          <button type="button" onClick={loadAdSense} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">AdSense</button>
          <button type="button" onClick={loadSearchConsole} className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Search Console</button>
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
      {showMedia && (
        <section className="mt-12 max-w-2xl border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Media library</h2>
            <button type="button" onClick={() => setShowMedia(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          {mediaAssets.length > 0 && (
            <div className="mb-6 space-y-3">
              {mediaAssets.map((asset) => (
                <div key={asset.id} className="border border-line p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-ochre">{asset.mime_type || 'Unknown type'} · {asset.file_size ? `${(asset.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}</p>
                      <p className="mt-1 font-display text-lg font-semibold text-ink">{asset.original_filename || asset.storage_key}</p>
                      {asset.width && asset.height && (
                        <p className="mt-1 text-sm text-stone">Dimensions: {asset.width} × {asset.height}px</p>
                      )}
                      {asset.alt_text && (
                        <p className="mt-1 text-sm text-stone">Alt: {asset.alt_text}</p>
                      )}
                      {asset.caption && (
                        <p className="mt-1 text-sm text-stone">Caption: {asset.caption}</p>
                      )}
                      {asset.credit && (
                        <p className="mt-1 text-sm text-stone">Credit: {asset.credit}</p>
                      )}
                      {asset.license && (
                        <p className="mt-1 text-sm text-stone">License: {asset.license}</p>
                      )}
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMedia(asset);
                          loadMediaTags(asset.id);
                        }}
                        className="text-sm text-teal underline underline-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMediaAsset(asset.id)}
                        className="text-sm text-red-600 underline underline-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {selectedMedia?.id === asset.id && (
                    <div className="mt-4 border-t border-line pt-4">
                      <h3 className="mb-3 font-display text-lg font-semibold text-ink">Edit media asset</h3>
                      <form onSubmit={updateMediaAsset} className="space-y-3">
                        <input name="alt_text" defaultValue={asset.alt_text || ''} placeholder="Alt text (accessibility)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        <input name="caption" defaultValue={asset.caption || ''} placeholder="Caption" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        <input name="credit" defaultValue={asset.credit || ''} placeholder="Credit/attribution" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        <input name="license" defaultValue={asset.license || ''} placeholder="License (e.g., CC BY 4.0)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        <div className="flex gap-3">
                          <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Save changes</button>
                          <button type="button" onClick={() => setSelectedMedia(null)} className="rounded-md border border-line px-4 py-3 text-sm text-teal hover:border-teal">Cancel</button>
                        </div>
                      </form>
                      <div className="mt-4">
                        <h4 className="mb-2 font-display text-sm font-semibold text-ink">Tags</h4>
                        {mediaTags.length > 0 ? (
                          <div className="mb-2 flex flex-wrap gap-2">
                            {mediaTags.map((tag) => (
                              <span key={tag.id} className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1 text-sm text-teal">
                                {tag.tag}
                                <button
                                  type="button"
                                  onClick={() => deleteMediaTag(tag.id, asset.id)}
                                  className="text-teal hover:text-red-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mb-2 text-sm text-stone">No tags yet.</p>
                        )}
                        <div className="mb-2">
                          <button
                            type="button"
                            onClick={() => suggestTags(asset.id)}
                            className="text-sm text-teal underline underline-offset-2"
                          >
                            Suggest tags
                          </button>
                        </div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const tagInput = form.elements.namedItem('tag') as HTMLInputElement;
                            if (tagInput.value.trim()) {
                              addMediaTag(asset.id, tagInput.value.trim());
                              tagInput.value = '';
                            }
                          }}
                          className="flex gap-2"
                        >
                          <input name="tag" placeholder="Add tag" className="flex-1 rounded-md border border-line bg-parchment px-4 py-2 text-sm" />
                          <button type="submit" className="rounded-md border border-line px-4 py-2 text-sm text-teal hover:border-teal">Add</button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!selectedMedia && (
            <form onSubmit={createMediaAsset} className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-ink">Add new media asset</h3>
              <input name="storage_key" required placeholder="Storage key (e.g., /uploads/image.jpg)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="original_filename" placeholder="Original filename" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="mime_type" placeholder="MIME type (e.g., image/jpeg)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                <input name="file_size" type="number" placeholder="File size (bytes)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="width" type="number" placeholder="Width (px)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                <input name="height" type="number" placeholder="Height (px)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              </div>
              <input name="alt_text" placeholder="Alt text (accessibility)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="caption" placeholder="Caption" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="credit" placeholder="Credit/attribution" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="license" placeholder="License (e.g., CC BY 4.0)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Add media asset</button>
            </form>
          )}
        </section>
      )}
      {showGoogleAds && (
        <section className="mt-12 max-w-2xl border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Google Ads campaigns</h2>
            <button type="button" onClick={() => setShowGoogleAds(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          {campaigns.length > 0 && (
            <div className="mb-6 space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-line p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-ochre">{campaign.status || 'Unknown'} · {campaign.campaign_type || 'General'}</p>
                      <p className="mt-1 font-display text-lg font-semibold text-ink">{campaign.campaign_name || 'Untitled Campaign'}</p>
                      {campaign.campaign_id && (
                        <p className="mt-1 text-sm text-stone">Google ID: {campaign.campaign_id}</p>
                      )}
                      <div className="mt-2 flex gap-4 text-sm text-stone">
                        <span>Daily Budget: {campaign.budget_daily ? `$${campaign.budget_daily}` : 'N/A'}</span>
                        <span>Total Budget: {campaign.budget_total ? `$${campaign.budget_total}` : 'N/A'}</span>
                      </div>
                      {campaign.start_date && campaign.end_date && (
                        <p className="mt-1 text-sm text-stone">
                          {campaign.start_date} to {campaign.end_date}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          loadCampaignPerformance(campaign.id);
                        }}
                        className="text-sm text-teal underline underline-offset-2"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCampaign(campaign.id)}
                        className="text-sm text-red-600 underline underline-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {selectedCampaign?.id === campaign.id && (
                    <div className="mt-4 border-t border-line pt-4">
                      <h3 className="mb-3 font-display text-lg font-semibold text-ink">Campaign details</h3>
                      <form onSubmit={updateCampaign} className="space-y-3">
                        <input name="campaign_name" defaultValue={campaign.campaign_name || ''} placeholder="Campaign name" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <input name="budget_daily" type="number" step="0.01" defaultValue={campaign.budget_daily || ''} placeholder="Daily budget" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                          <input name="budget_total" type="number" step="0.01" defaultValue={campaign.budget_total || ''} placeholder="Total budget" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <input name="start_date" type="date" defaultValue={campaign.start_date || ''} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                          <input name="end_date" type="date" defaultValue={campaign.end_date || ''} className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Save changes</button>
                          <button type="button" onClick={() => setSelectedCampaign(null)} className="rounded-md border border-line px-4 py-3 text-sm text-teal hover:border-teal">Cancel</button>
                        </div>
                      </form>
                      <div className="mt-4">
                        <h4 className="mb-2 font-display text-sm font-semibold text-ink">Performance</h4>
                        {campaignPerformance.length > 0 ? (
                          <div className="space-y-2">
                            {campaignPerformance.slice(0, 7).map((perf) => (
                              <div key={perf.id} className="text-sm text-stone border-b border-line pb-2">
                                <span className="font-medium">{perf.date}</span>
                                <span className="ml-4">Impressions: {perf.impressions || 0}</span>
                                <span className="ml-4">Clicks: {perf.clicks || 0}</span>
                                <span className="ml-4">Cost: ${perf.cost || 0}</span>
                                <span className="ml-4">CTR: {perf.ctr ? `${(perf.ctr * 100).toFixed(2)}%` : 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-stone">No performance data yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!selectedCampaign && (
            <form onSubmit={createCampaign} className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-ink">Add new campaign</h3>
              <input name="campaign_name" required placeholder="Campaign name" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="campaign_id" placeholder="Google Ads campaign ID (optional)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="campaign_type" placeholder="Campaign type (e.g., search, display)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                <input name="status" placeholder="Status (e.g., active, paused)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="budget_daily" type="number" step="0.01" placeholder="Daily budget" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                <input name="budget_total" type="number" step="0.01" placeholder="Total budget" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="start_date" type="date" placeholder="Start date" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
                <input name="end_date" type="date" placeholder="End date" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              </div>
              <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Add campaign</button>
            </form>
          )}
        </section>
      )}
      {showAdSense && (
        <section className="mt-12 max-w-2xl border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-5 font-display text-2xl font-semibold text-ink">AdSense ad units</h2>
            <button type="button" onClick={() => setShowAdSense(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          {adSenseUnits.length > 0 && (
            <div className="mb-6 space-y-3">
              {adSenseUnits.map((unit) => (
                <div key={unit.id} className="border border-line p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-ochre">{unit.status || 'Unknown'} · {unit.ad_unit_type || 'General'}</p>
                      <p className="mt-1 font-display text-lg font-semibold text-ink">{unit.ad_unit_name || 'Untitled Unit'}</p>
                      {unit.ad_unit_id && (
                        <p className="mt-1 text-sm text-stone">AdSense ID: {unit.ad_unit_id}</p>
                      )}
                      {unit.placement && (
                        <p className="mt-1 text-sm text-stone">Placement: {unit.placement}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAdSenseUnit(unit.id)}
                      className="ml-4 text-sm text-red-600 underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={createAdSenseUnit} className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink">Add new ad unit</h3>
            <input name="ad_unit_name" required placeholder="Ad unit name" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <input name="ad_unit_id" placeholder="AdSense ad unit ID (optional)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="ad_unit_type" placeholder="Ad unit type (e.g., display, video)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="placement" placeholder="Placement (e.g., header, sidebar)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            </div>
            <input name="status" placeholder="Status (e.g., active, paused)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Add ad unit</button>
          </form>
        </section>
      )}
      {showSearchConsole && (
        <section className="mt-12 max-w-2xl border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Search Console data</h2>
            <button type="button" onClick={() => setShowSearchConsole(false)} className="text-sm text-teal underline underline-offset-2">Close</button>
          </div>
          {searchConsoleData.length > 0 && (
            <div className="mb-6 space-y-3">
              {searchConsoleData.map((data) => (
                <div key={data.id} className="border border-line p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-ochre">{data.date || 'Unknown date'}</p>
                      <div className="mt-2 flex gap-4 text-sm text-stone">
                        <span>Impressions: {data.impressions || 0}</span>
                        <span>Clicks: {data.clicks || 0}</span>
                        <span>CTR: {data.ctr ? `${(data.ctr * 100).toFixed(2)}%` : 'N/A'}</span>
                        <span>Avg Position: {data.avg_position || 'N/A'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSearchConsoleData(data.id)}
                      className="ml-4 text-sm text-red-600 underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={createSearchConsoleData} className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink">Add Search Console data</h3>
            <input name="date" type="date" required placeholder="Date" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="impressions" type="number" placeholder="Impressions" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="clicks" type="number" placeholder="Clicks" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="ctr" type="number" step="0.0001" placeholder="CTR (0-1)" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
              <input name="avg_position" type="number" step="0.1" placeholder="Average position" className="w-full rounded-md border border-line bg-parchment px-4 py-3" />
            </div>
            <button type="submit" className="rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-tealDeep">Add data</button>
          </form>
        </section>
      )}
      {message && <p className="mt-4 text-sm text-stone" role="status">{message}</p>}
    </section>
  );
}