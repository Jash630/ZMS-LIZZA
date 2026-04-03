import React, { useEffect, useMemo, useState } from 'react'
import { Globe, TrendingUp, AlertTriangle, CheckCircle, Save } from 'lucide-react'
import { seoService } from '../../services/seoService'
import StateBlock from '../../components/ui/StateBlock'

export default function SeoPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingMeta, setSavingMeta] = useState(false)
  const [savingKeywords, setSavingKeywords] = useState(false)
  const [form, setForm] = useState({
    siteTitle: '',
    siteDescription: '',
    robots: 'index, follow',
  })
  const [keywordsText, setKeywordsText] = useState('')

  const fetchSeo = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await seoService.get()
      const nextSettings = response?.data || {}
      setSettings(nextSettings)
      setForm({
        siteTitle: nextSettings.siteTitle || '',
        siteDescription: nextSettings.siteDescription || '',
        robots: nextSettings.robots || 'index, follow',
      })
      setKeywordsText(
        (nextSettings.trackedKeywords || [])
          .map((item) => `${item.keyword}|${item.position || 0}|${item.volume || 0}|${item.change || 0}`)
          .join('\n')
      )
    } catch (err) {
      setError(err?.message || 'Failed to load SEO settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeo()
  }, [])

  const saveMeta = async () => {
    setSavingMeta(true)
    setError('')
    try {
      const response = await seoService.update(form)
      setSettings((current) => ({ ...current, ...response?.data }))
    } catch (err) {
      setError(err?.message || 'Failed to save SEO metadata.')
    } finally {
      setSavingMeta(false)
    }
  }

  const saveKeywords = async () => {
    setSavingKeywords(true)
    setError('')
    try {
      const parsed = keywordsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [keyword, position = '0', volume = '0', change = '0'] = line.split('|')
          return {
            keyword: keyword?.trim(),
            position: Number(position) || 0,
            volume: Number(volume) || 0,
            change: Number(change) || 0,
          }
        })
        .filter((item) => item.keyword)

      await seoService.updateKeywords(parsed)
      setSettings((current) => ({ ...current, trackedKeywords: parsed }))
    } catch (err) {
      setError(err?.message || 'Failed to save keywords.')
    } finally {
      setSavingKeywords(false)
    }
  }

  const keywordRows = useMemo(() => settings?.trackedKeywords || [], [settings])

  const scoreRows = useMemo(() => {
    const titleScore = Math.max(0, 100 - Math.abs(60 - (form.siteTitle?.length || 0)) * 2)
    const descScore = Math.max(0, 100 - Math.abs(160 - (form.siteDescription?.length || 0)) * 0.8)
    return [
      { page: 'Global Site Title', score: Math.round(titleScore), issues: form.siteTitle?.length > 60 ? 1 : 0 },
      { page: 'Global Site Description', score: Math.round(descScore), issues: form.siteDescription?.length > 160 ? 1 : 0 },
      { page: 'Tracked Keywords', score: keywordRows.length ? 90 : 50, issues: keywordRows.length ? 0 : 1 },
    ]
  }, [form, keywordRows.length])

  const ScoreRing = ({ score }) => {
    const color = score >= 90 ? '#10B981' : score >= 70 ? '#FF6B35' : '#E63946'
    return (
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontSize: 12, fontWeight: 800, color }}>
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
        <button className="btn btn-primary" onClick={fetchSeo}><TrendingUp size={15} /> Reload</button>
      </div>

      <StateBlock loading={loading} error={error} onRetry={fetchSeo} />

      {!loading && !error && (
        <>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} /> Global Meta Settings</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Site Title ({form.siteTitle.length}/60)</label>
                <input className="input" value={form.siteTitle} onChange={(e) => setForm((current) => ({ ...current, siteTitle: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Site Description ({form.siteDescription.length}/160)</label>
                <textarea className="input" rows={3} value={form.siteDescription} onChange={(e) => setForm((current) => ({ ...current, siteDescription: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Robots Directive</label>
                <input className="input" value={form.robots} onChange={(e) => setForm((current) => ({ ...current, robots: e.target.value }))} />
              </div>
              <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={saveMeta} disabled={savingMeta}>
                <Save size={14} /> {savingMeta ? 'Saving...' : 'Save Metadata'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontFamily: 'Syne', fontSize: 14, fontWeight: 700 }}>Page SEO Scores</div>
              <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
                <table>
                  <thead><tr><th>Page</th><th>Score</th><th>Issues</th></tr></thead>
                  <tbody>
                    {scoreRows.map((row) => (
                      <tr key={row.page}>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{row.page}</td>
                        <td><ScoreRing score={row.score} /></td>
                        <td>{row.issues === 0 ? <span className="badge badge-success"><CheckCircle size={10} /> OK</span> : <span className="badge badge-warning"><AlertTriangle size={10} /> {row.issues}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Tracked Keywords</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                Format each line as: keyword|position|volume|change
              </p>
              <textarea className="input" rows={12} value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button className="btn btn-primary btn-sm" onClick={saveKeywords} disabled={savingKeywords}>
                  <Save size={14} /> {savingKeywords ? 'Saving...' : 'Save Keywords'}
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden', marginTop: 20 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontFamily: 'Syne', fontSize: 14, fontWeight: 700 }}>Keyword Rankings</div>
            <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
              <table>
                <thead><tr><th>Keyword</th><th>Pos.</th><th>Volume</th><th>Δ</th></tr></thead>
                <tbody>
                  {keywordRows.map((row, index) => (
                    <tr key={`${row.keyword}-${index}`}>
                      <td style={{ fontSize: 12, fontWeight: 500 }}>{row.keyword}</td>
                      <td><span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: row.position <= 3 ? '#10B981' : row.position <= 10 ? 'var(--orange)' : 'var(--text-muted)' }}>#{row.position}</span></td>
                      <td><span className="mono-val">{(row.volume || 0).toLocaleString()}</span></td>
                      <td><span style={{ fontSize: 12, fontWeight: 700, color: row.change > 0 ? '#10B981' : row.change < 0 ? '#E63946' : 'var(--text-muted)' }}>{row.change > 0 ? `+${row.change}` : row.change === 0 ? '—' : row.change}</span></td>
                    </tr>
                  ))}
                  {keywordRows.length === 0 && <tr><td colSpan={4} className="table-empty">No tracked keywords yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
