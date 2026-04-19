import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { leadsAPI } from "../utils/api"
import { Trash2, Upload, Plus } from "lucide-react"

export default function Leads() {
  const qc = useQueryClient()
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: () => leadsAPI.getAll().then(r => Array.isArray(r.data) ? r.data : []) })
  const deleteMutation = useMutation({ mutationFn: leadsAPI.delete, onSuccess: () => qc.invalidateQueries(["leads","stats"]) })
  const [form, setForm] = useState({ name:"", company:"", role:"", email:"", industry:"" })
  const createMutation = useMutation({ mutationFn: leadsAPI.create, onSuccess: () => { qc.invalidateQueries(["leads","stats"]); setForm({ name:"",company:"",role:"",email:"",industry:"" }) } })

  const handleCSV = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await leadsAPI.uploadCSV(file)
    qc.invalidateQueries(["leads","stats"])
  }

  return (
    <div style={{background:"#030712",minHeight:"100vh",padding:"2rem",color:"#f9fafb"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <h2 style={{fontSize:"1.5rem",fontWeight:"700",color:"#fff",margin:0}}>Leads</h2>
          <p style={{color:"#9ca3af",fontSize:"0.875rem",margin:0}}>{leads.length} total leads</p>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 16px",background:"#4f46e5",color:"#fff",borderRadius:"8px",cursor:"pointer",fontSize:"0.875rem"}}>
          <Upload size={15} />Upload CSV<input type="file" accept=".csv" style={{display:"none"}} onChange={handleCSV} />
        </label>
      </div>
      <div style={{background:"#111827",borderRadius:"12px",padding:"1.25rem",marginBottom:"1.5rem",border:"1px solid #1f2937"}}>
        <h3 style={{color:"#d1d5db",fontSize:"0.875rem",fontWeight:"600",marginBottom:"1rem"}}>Add lead manually</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"12px"}}>
          {["name","company","role","email","industry"].map(f => (
            <input key={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} value={form[f]}
              onChange={e => setForm(p => ({...p,[f]:e.target.value}))}
              style={{background:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"8px 12px",color:"#fff",fontSize:"0.875rem",outline:"none"}} />
          ))}
        </div>
        <button onClick={() => createMutation.mutate(form)}
          style={{marginTop:"12px",display:"flex",alignItems:"center",gap:"8px",padding:"8px 16px",background:"#059669",color:"#fff",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"0.875rem"}}>
          <Plus size={15} />Add Lead
        </button>
      </div>
      <div style={{background:"#111827",borderRadius:"12px",overflow:"hidden",border:"1px solid #1f2937"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.875rem"}}>
          <thead>
            <tr style={{borderBottom:"1px solid #1f2937"}}>
              {["Name","Company","Role","Email","Industry","Source",""].map(h => (
                <th key={h} style={{textAlign:"left",padding:"12px 16px",color:"#9ca3af",fontSize:"0.75rem",textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} style={{borderBottom:"1px solid #1f2937"}}>
                <td style={{padding:"12px 16px",color:"#fff",fontWeight:"500"}}>{lead.name}</td>
                <td style={{padding:"12px 16px",color:"#d1d5db"}}>{lead.company}</td>
                <td style={{padding:"12px 16px",color:"#d1d5db"}}>{lead.role}</td>
                <td style={{padding:"12px 16px",color:"#9ca3af",fontSize:"0.75rem"}}>{lead.email}</td>
                <td style={{padding:"12px 16px",color:"#9ca3af"}}>{lead.industry}</td>
                <td style={{padding:"12px 16px"}}><span style={{fontSize:"0.75rem",background:"#374151",color:"#d1d5db",padding:"2px 8px",borderRadius:"9999px"}}>{lead.source}</span></td>
                <td style={{padding:"12px 16px"}}><button onClick={() => deleteMutation.mutate(lead.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <div style={{textAlign:"center",padding:"3rem",color:"#6b7280",fontSize:"0.875rem"}}>No leads yet. Add manually or upload a CSV.</div>}
      </div>
    </div>
  )
}

