import React, { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { leadsAPI, messagesAPI } from "../utils/api"
import { Zap, Sparkles } from "lucide-react"

const TYPES = ["Email", "LinkedIn DM", "WhatsApp"]
const TONES = ["Professional", "Friendly", "Casual", "Urgent", "Value-focused"]

export default function Generate() {
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: () => leadsAPI.getAll().then(r => Array.isArray(r.data) ? r.data : []) })
  const [config, setConfig] = useState({ lead_id:"", message_type:"Email", tone:"Professional", sender_name:"Mohammed Raza", offer:"I build AI chatbots and automation tools that save businesses 10+ hours a week." })
  const [result, setResult] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkDone, setBulkDone] = useState(null)

  const singleMutation = useMutation({ mutationFn: messagesAPI.generate, onSuccess: (r) => setResult(r.data) })

  const handleBulk = async () => {
    setBulkLoading(true)
    const r = await messagesAPI.generateBulk({ message_type: config.message_type, tone: config.tone, sender_name: config.sender_name, offer: config.offer })
    setBulkDone(r.data.generated)
    setBulkLoading(false)
  }

  const inp = {background:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"8px 12px",color:"#fff",fontSize:"0.875rem",outline:"none",width:"100%"}

  return (
    <div style={{background:"#030712",minHeight:"100vh",padding:"2rem",color:"#f9fafb"}}>
      <h2 style={{fontSize:"1.5rem",fontWeight:"700",color:"#fff",marginBottom:"4px"}}>Generate Messages</h2>
      <p style={{color:"#9ca3af",fontSize:"0.875rem",marginBottom:"1.5rem"}}>AI writes personalised outreach for every lead.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div style={{background:"#111827",borderRadius:"12px",padding:"1.25rem",border:"1px solid #1f2937"}}>
            <h3 style={{color:"#d1d5db",fontSize:"0.875rem",fontWeight:"600",marginBottom:"1rem"}}>Your info</h3>
            <div style={{marginBottom:"12px"}}>
              <label style={{color:"#9ca3af",fontSize:"0.75rem",display:"block",marginBottom:"4px"}}>Your name</label>
              <input value={config.sender_name} onChange={e => setConfig(p=>({...p,sender_name:e.target.value}))} style={inp} />
            </div>
            <div>
              <label style={{color:"#9ca3af",fontSize:"0.75rem",display:"block",marginBottom:"4px"}}>What you offer</label>
              <textarea value={config.offer} onChange={e => setConfig(p=>({...p,offer:e.target.value}))} rows={3} style={{...inp,resize:"none"}} />
            </div>
          </div>
          <div style={{background:"#111827",borderRadius:"12px",padding:"1.25rem",border:"1px solid #1f2937"}}>
            <h3 style={{color:"#d1d5db",fontSize:"0.875rem",fontWeight:"600",marginBottom:"1rem"}}>Settings</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={{color:"#9ca3af",fontSize:"0.75rem",display:"block",marginBottom:"4px"}}>Message type</label>
                <select value={config.message_type} onChange={e => setConfig(p=>({...p,message_type:e.target.value}))} style={inp}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:"#9ca3af",fontSize:"0.75rem",display:"block",marginBottom:"4px"}}>Tone</label>
                <select value={config.tone} onChange={e => setConfig(p=>({...p,tone:e.target.value}))} style={inp}>
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{background:"#111827",borderRadius:"12px",padding:"1.25rem",border:"1px solid #1f2937"}}>
            <h3 style={{color:"#d1d5db",fontSize:"0.875rem",fontWeight:"600",marginBottom:"1rem"}}>Single lead</h3>
            <select value={config.lead_id} onChange={e => setConfig(p=>({...p,lead_id:parseInt(e.target.value)}))} style={{...inp,marginBottom:"12px"}}>
              <option value="">Select a lead...</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.name} — {l.company}</option>)}
            </select>
            <button onClick={() => singleMutation.mutate(config)} disabled={!config.lead_id || singleMutation.isPending}
              style={{width:"100%",padding:"8px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"0.875rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              <Sparkles size={15} />{singleMutation.isPending ? "Generating..." : "Generate message"}
            </button>
          </div>
          <button onClick={handleBulk} disabled={bulkLoading || leads.length === 0}
            style={{width:"100%",padding:"12px",background:"#059669",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"0.875rem",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            <Zap size={15} />{bulkLoading ? "Generating..." : "Bulk generate for all " + leads.length + " leads"}
          </button>
          {bulkDone && <p style={{color:"#34d399",fontSize:"0.875rem",textAlign:"center"}}>Generated {bulkDone} messages!</p>}
        </div>
        <div style={{background:"#111827",borderRadius:"12px",padding:"1.25rem",border:"1px solid #1f2937"}}>
          <h3 style={{color:"#d1d5db",fontSize:"0.875rem",fontWeight:"600",marginBottom:"1rem"}}>Preview</h3>
          {result ? (
            <div>
              <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
                <span style={{fontSize:"0.75rem",background:"rgba(99,102,241,0.2)",color:"#a5b4fc",padding:"2px 8px",borderRadius:"9999px"}}>{result.message_type}</span>
                <span style={{fontSize:"0.75rem",background:"#374151",color:"#d1d5db",padding:"2px 8px",borderRadius:"9999px"}}>{result.tone}</span>
              </div>
              <pre style={{fontSize:"0.875rem",color:"#e5e7eb",whiteSpace:"pre-wrap",lineHeight:"1.6",fontFamily:"system-ui"}}>{result.content}</pre>
            </div>
          ) : <p style={{color:"#4b5563",fontSize:"0.875rem"}}>Generate a message to preview it here.</p>}
        </div>
      </div>
    </div>
  )
}

