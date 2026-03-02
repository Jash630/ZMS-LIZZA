import React, { useState } from 'react'
import { Globe, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const SEO_PAGES = [
  { page:'Homepage',            score:92, issues:0 },
  { page:'Product: ZJ-Series',  score:78, issues:2 },
  { page:'About Us',            score:85, issues:1 },
  { page:'Contact & Demo',      score:70, issues:3 },
  { page:'Blog Index',          score:88, issues:0 },
]
const KEYWORDS = [
  { kw:'embroidery machine manufacturer india', pos:3,  change:+2, vol:2400 },
  { kw:'ZJ series embroidery',                  pos:1,  change:0,  vol:480  },
  { kw:'industrial embroidery machine price',   pos:8,  change:-1, vol:5400 },
  { kw:'best embroidery machine for factory',   pos:12, change:+4, vol:1900 },
  { kw:'ZMS LIZZA machine',                     pos:1,  change:0,  vol:320  },
]

export default function SeoPage() {
  const [title, setTitle] = useState('ZMS LIZZA – Best Embroidery Machine Manufacturer in India | ZJ Series')
  const [desc,  setDesc]  = useState('ZMS LIZZA European Technology offers premium multi-head embroidery machines for Indian textile factories. Get a free demo today!')

  const ScoreRing = ({ score }) => {
    const color = score>=90 ? '#10B981' : score>=70 ? '#FF6B35' : '#E63946'
    return (
      <div style={{ width:36, height:36, borderRadius:'50%', border:`3px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontSize:12, fontWeight:800, color }}>
        {score}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">SEO <span className="gradient-text">Manager</span></h1>
          <p className="page-subtitle">Search engine optimization tools</p>
        </div>
        <button className="btn btn-primary"><TrendingUp size={15}/> Run Audit</button>
      </div>

      <div className="card" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ fontFamily:'Syne', fontSize:15, fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}><Globe size={16}/> Global Meta Settings</h3>
        <div style={{ display:'grid', gap:14 }}>
          {[['Site Title ('+title.length+'/60)', title, setTitle, 60],['Meta Description ('+desc.length+'/160)', desc, setDesc, 160]].map(([label,val,setter,max],i)=>(
            <div key={i} style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>{label}</label>
              {i===0 ? <input className="input" value={val} onChange={e=>setter(e.target.value)}/> : <textarea className="input" rows={3} value={val} onChange={e=>setter(e.target.value)} style={{ resize:'vertical' }}/>}
              <div style={{ height:3, background:'var(--bg-tertiary)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(val.length/max*100,100)}%`, background: val.length>max?'#E63946':'#10B981', borderRadius:2 }}/>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-sm" style={{ alignSelf:'flex-start' }}>Save Changes</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', fontFamily:'Syne', fontSize:14, fontWeight:700 }}>Page SEO Scores</div>
          <div className="table-container" style={{ borderRadius:0, border:'none' }}>
            <table>
              <thead><tr><th>Page</th><th>Score</th><th>Issues</th></tr></thead>
              <tbody>
                {SEO_PAGES.map((p,i)=>(
                  <tr key={i}>
                    <td style={{ fontWeight:600, fontSize:13 }}>{p.page}</td>
                    <td><ScoreRing score={p.score}/></td>
                    <td>{p.issues===0 ? <span className="badge badge-success"><CheckCircle size={10}/> OK</span> : <span className="badge badge-warning"><AlertTriangle size={10}/> {p.issues}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', fontFamily:'Syne', fontSize:14, fontWeight:700 }}>Keyword Rankings</div>
          <div className="table-container" style={{ borderRadius:0, border:'none' }}>
            <table>
              <thead><tr><th>Keyword</th><th>Pos.</th><th>Volume</th><th>Δ</th></tr></thead>
              <tbody>
                {KEYWORDS.map((k,i)=>(
                  <tr key={i}>
                    <td style={{ fontSize:12, fontWeight:500 }}>{k.kw}</td>
                    <td><span style={{ fontFamily:'Syne', fontWeight:800, fontSize:16, color: k.pos<=3?'#10B981':k.pos<=10?'var(--orange)':'var(--text-muted)' }}>#{k.pos}</span></td>
                    <td><span className="mono-val">{k.vol.toLocaleString()}</span></td>
                    <td><span style={{ fontSize:12, fontWeight:700, color: k.change>0?'#10B981':k.change<0?'#E63946':'var(--text-muted)' }}>{k.change>0?`+${k.change}`:k.change===0?'—':k.change}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}