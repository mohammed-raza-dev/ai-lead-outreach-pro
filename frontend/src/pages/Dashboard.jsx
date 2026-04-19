import React from "react"
import { useQuery } from "@tanstack/react-query"
import { leadsAPI, messagesAPI } from "../utils/api"
import { Users, MessageSquare, Building2, Zap } from "lucide-react"

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className={"inline-flex p-2 rounded-lg mb-3 " + color}><Icon size={20} /></div>
      <p className="text-2xl font-bold text-white">{value ?? "..."}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => leadsAPI.getStats().then(r => r.data) })
  const { data: msgs } = useQuery({ queryKey: ["messages"], queryFn: () => messagesAPI.getAll().then(r => r.data) })
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
      <p className="text-gray-400 text-sm mb-8">Welcome back. Here is your outreach overview.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Leads" value={stats?.total_leads} color="bg-indigo-500/20 text-indigo-400" />
        <StatCard icon={MessageSquare} label="Messages Generated" value={msgs?.length} color="bg-emerald-500/20 text-emerald-400" />
        <StatCard icon={Building2} label="Unique Companies" value={stats?.unique_companies} color="bg-violet-500/20 text-violet-400" />
        <StatCard icon={Zap} label="Sources" value={stats?.sources?.length} color="bg-amber-500/20 text-amber-400" />
      </div>
      {stats?.sources?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Lead sources</h3>
          <div className="flex flex-wrap gap-2">
            {stats.sources.map(s => <span key={s} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}
