
import React from "react"
import { Routes, Route, NavLink } from "react-router-dom"
import { LayoutDashboard, Users, MessageSquare, Search, Settings } from "lucide-react"
import Dashboard from "./pages/Dashboard"
import Leads from "./pages/Leads"
import Generate from "./pages/Generate"
import Scraper from "./pages/Scraper"
import Output from "./pages/Output"

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/scraper", icon: Search, label: "Find Leads" },
  { to: "/generate", icon: MessageSquare, label: "Generate" },
  { to: "/output", icon: Settings, label: "Output" },
]

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-lg font-bold text-indigo-400">LeadOutreach</h1>
          <p className="text-xs text-gray-500 mt-0.5">AI Pro System</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==="/"} className={({ isActive }) =>
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all " + (isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-950">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/scraper" element={<Scraper />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/output" element={<Output />} />
        </Routes>
      </main>
    </div>
  )
}
