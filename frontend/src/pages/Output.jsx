import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { messagesAPI } from "../utils/api"
import { Download } from "lucide-react"

const TYPES = ["All", "Email", "LinkedIn DM", "WhatsApp"]

export default function Output() {
  const [filter, setFilter] = useState("All")
  const [expanded, setExpanded] = useState(null)
  const { data: messages = [] } = useQuery({ queryKey: ["messages", filter], queryFn: () => messagesAPI.getAll(filter === "All" ? null : filter).then(r => Array.isArray(r.data) ? r.data : []) })

  return (
    <div style={{background:"#030712",minHeight:"100vh",padding:"2rem",color:"#f9fafb"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <h2 style={{fontSize:"1.5rem",fontWeight:"700",color:"#fff",margin:0}}>Output</h2>
          <p style={{color:"#9ca3af",fontSize:"0.875rem",margin:0}}>{messages.length} messages generated</p>
        </div>
        <button onClick={messagesAPI.exportCSV} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 16px",background:"#1f2937",color:"#fff",borderRadius:"8px",border:"1px solid #374151",cursor:"pointer",fontSize:"0.875rem"}}>
          <Download size={15} />Export CSV
        </button>
      </div>
      <div style={{display:"flex",gap:"8px",marginBottom:"1.5rem"}}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{padding:"6px 16px",borderRadius:"8px",fontSize:"0.875rem",border:"none",cursor:"pointer",background: filter===t ? "#4f46e5" : "#1f2937",color: filter===t ? "#fff" : "#9ca3af"}}>
            {t}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        {messages.map(msg => (
          <div key={msg.id} style={{background:"#111827",borderRadius:"12px",overflow:"hidden",border:"1px solid #1f2937"}}>
            <button onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",background:"none",border:"none",cursor:"pointer",color:"#fff"}}>
              <div style={{textAlign:"left"}}>
                <p style={{fontSize:"0.875rem",fontWeight:"500",color:"#fff",margin:0}}>{msg.lead_name} <span style={{color:"#6b7280"}}>·</span> <span style={{color:"#9ca3af"}}>{msg.lead_company}</span></p>
                <p style={{fontSize:"0.75rem",color:"#6b7280",margin:0}}>{msg.lead_role}</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontSize:"0.75rem",background:"rgba(99,102,241,0.2)",color:"#a5b4fc",padding:"2px 8px",borderRadius:"9999px"}}>{msg.message_type}</span>
                <span style={{fontSize:"0.75rem",background:"#374151",color:"#9ca3af",padding:"2px 8px",borderRadius:"9999px"}}>{msg.tone}</span>
                <span style={{color:"#6b7280",fontSize:"0.75rem"}}>{expanded === msg.id ? "▲" : "▼"}</span>
              </div>
            </button>
            {expanded === msg.id && (
              <div style={{padding:"0 20px 20px",borderTop:"1px solid #1f2937"}}>
                <pre style={{marginTop:"16px",fontSize:"0.875rem",color:"#d1d5db",whiteSpace:"pre-wrap",lineHeight:"1.6",fontFamily:"system-ui",background:"rgba(31,41,55,0.5)",borderRadius:"8px",padding:"16px"}}>{msg.content}</pre>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && <div style={{textAlign:"center",padding:"4rem",color:"#4b5563",fontSize:"0.875rem"}}>No messages yet. Go to Generate to create some.</div>}
      </div>
    </div>
  )
}

