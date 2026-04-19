import React, { useState } from "react"
import { scraperAPI } from "../utils/api"
import { Search } from "lucide-react"

export default function Scraper() {
  const [tab, setTab] = useState("apollo")
  const [form, setForm] = useState({ query:"", domain:"", url:"", limit:10 })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    try {
      const fn = { apollo: scraperAPI.apollo, hunter: scraperAPI.hunter, web: scraperAPI.web }[tab]
      const r = await fn({ ...form })
      setResult(r.data)
    } catch(e) { setResult({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Find Leads</h2>
      <p className="text-gray-400 text-sm mb-6">Import leads from Apollo, Hunter, or scrape any website.</p>
      <div className="flex gap-2 mb-6">
        {["apollo","hunter","web"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (tab===t ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white")}>
            {t === "apollo" ? "Apollo.io" : t === "hunter" ? "Hunter.io" : "Web Scraper"}
          </button>
        ))}
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        {tab === "apollo" && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-400 mb-1 block">Job title</label>
              <input value={form.query} onChange={e => setForm(p=>({...p,query:e.target.value}))} placeholder="CEO, Founder..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Domain (optional)</label>
              <input value={form.domain} onChange={e => setForm(p=>({...p,domain:e.target.value}))} placeholder="company.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" /></div>
          </div>
        )}
        {tab === "hunter" && (
          <div><label className="text-xs text-gray-400 mb-1 block">Company domain</label>
            <input value={form.domain} onChange={e => setForm(p=>({...p,domain:e.target.value}))} placeholder="company.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" /></div>
        )}
        {tab === "web" && (
          <div><label className="text-xs text-gray-400 mb-1 block">Website URL</label>
            <input value={form.url} onChange={e => setForm(p=>({...p,url:e.target.value}))} placeholder="https://company.com/team" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" /></div>
        )}
        <div className="mt-4 flex items-center gap-4">
          <div><label className="text-xs text-gray-400 mb-1 block">Limit</label>
            <input type="number" value={form.limit} onChange={e => setForm(p=>({...p,limit:parseInt(e.target.value)}))} min={1} max={50} className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" /></div>
          <button onClick={run} disabled={loading} className="mt-5 flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors">
            <Search size={15} />{loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          {result.error ? <p className="text-red-400 text-sm">{result.error}</p> : (
            <>
              <p className="text-sm text-emerald-400 mb-4">Found {result.found} leads</p>
              <div className="space-y-2">
                {result.leads?.map((l,i) => (
                  <div key={i} className="flex items-center gap-4 text-sm bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-white font-medium w-32 truncate">{l.name || "—"}</span>
                    <span className="text-gray-400 w-32 truncate">{l.company}</span>
                    <span className="text-gray-500 w-32 truncate">{l.role}</span>
                    <span className="text-indigo-400 truncate">{l.email}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
