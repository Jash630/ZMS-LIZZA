import { useEffect, useMemo, useState } from 'react'
import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { Search, ChevronRight, User, Calendar, Clock, ArrowRight, Send, Tag } from 'lucide-react'
import { publicService } from '../services/publicService.js'

const CATEGORY_COLORS = {
  Product:      { bg: '#1B2E4B', text: '#fff' },
  Guide:        { bg: '#8B2F97', text: '#fff' },
  News:         { bg: '#FF6B35', text: '#fff' },
  'Case Study': { bg: '#10B981', text: '#fff' },
  Announcement: { bg: '#EF4444', text: '#fff' },
}

const DEFAULT_CAT_COLOR = { bg: '#1B2E4B', text: '#fff' }

const POPULAR_TOPICS = [
  'Embroidery Trends', 'Machine Maintenance', 'European Technology',
  'Textile Industry', 'Sequin Techniques', 'Productivity Tips',
  'Quality Control', 'Business Growth',
]

const normalizeCategory = (value) => String(value || '').toLowerCase().replace(/[ &]/g, '')

function CategoryBadge({ category, small }) {
  const colors = CATEGORY_COLORS[category] || DEFAULT_CAT_COLOR
  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      fontSize: small ? '11px' : '12px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: small ? '3px 10px' : '4px 14px',
      borderRadius: '4px',
      display: 'inline-block',
    }}>
      {category}
    </span>
  )
}

function ArticleCard({ post, navigateTo }) {
  return (
    <article
      onClick={() => post.slug && navigateTo('blog-detail', post.slug)}
      style={{
        cursor: 'pointer',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e8edf4',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="blog-card"
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: '210px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <CategoryBadge category={post.category} small />
        </div>
        <img
          src={post.image}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
          className="card-img"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,20,40,0.55) 0%, transparent 55%)',
        }} />
      </div>

      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '17px', fontWeight: 700, color: '#0f1f3d', lineHeight: '1.45',
          marginBottom: '10px', flex: 1,
        }} className="card-title">
          {post.title}
        </h3>
        <p style={{ fontSize: '13.5px', color: '#6b7a90', lineHeight: '1.65', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>
        <div style={{ borderTop: '1px solid #f0f2f7', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#8a96a8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} />{post.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{post.readTime}</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B35', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.02em' }}>
            Read <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  )
}

export function BlogPage() {
  const { navigateTo } = useNavigation()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')
  const [email, setEmail]       = useState('')
  const [subscribeState, setSubscribeState] = useState({ saving: false, message: '', error: '' })
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await publicService.getPosts({ limit: 60 })
        if (!active) return
        setPosts(response.items || [])
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load blog posts.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const filtered = posts.filter(p => {
    const matchCat    = category === 'all' || normalizeCategory(p.category) === category
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featuredPost = filtered[0] || posts[0] || null
  const gridPosts    = filtered.length > 1 ? filtered.slice(1) : filtered

  const categoryOptions = useMemo(() => {
    const uniq = new Map()
    posts.forEach((post) => {
      const label = post.category || 'News'
      const value = normalizeCategory(label)
      if (!uniq.has(value)) uniq.set(value, label)
    })
    return Array.from(uniq.entries()).map(([value, label]) => ({ value, label }))
  }, [posts])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubscribeState({ saving: true, message: '', error: '' })
    try {
      const normalizedEmail = String(email || '').trim()
      if (!normalizedEmail) throw new Error('Please enter your email address.')
      const result = await publicService.subscribeNewsletter(normalizedEmail)
      setSubscribeState({ saving: false, message: result?.message || 'Subscribed successfully.', error: '' })
      setEmail('')
    } catch (err) {
      setSubscribeState({ saving: false, message: '', error: err?.message || 'Failed to subscribe. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7fb' }}>
      <style>{`
        .blog-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(15,31,61,0.12); }
        .blog-card:hover .card-img { transform: scale(1.06); }
        .blog-card:hover .card-title { color: #FF6B35; }
        .topic-tag:hover { background: #FF6B35 !important; color: #fff !important; border-color: #FF6B35 !important; }
        .search-input:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.12); }
        .subscribe-input:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.12); }
        .cat-btn { transition: all 0.18s ease; }
        .cat-btn:hover { border-color: #FF6B35 !important; color: #FF6B35 !important; }
        .cat-btn.active { background: #1B2E4B !important; color: #fff !important; border-color: #1B2E4B !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      <Header />
      <WhatsAppButton />

      {/* ── Hero Banner ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #1B2E4B 60%, #243a5e 100%)',
        paddingTop: 'calc(var(--site-header-height) + 52px)',
        paddingBottom: '52px',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={13} color="rgba(255,255,255,0.35)" />
            <span style={{ color: '#FF6B35', fontWeight: 600 }}>Blog</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,107,53,0.18)', border: '1px solid rgba(255,107,53,0.35)', borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 700, color: '#FF6B35', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>
              Industry Knowledge Hub
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Industry Insights &amp; Updates
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, maxWidth: 540, margin: '0 auto' }}>
              Stay ahead with the latest in textile technology and embroidery trends
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky Filter Bar ── */}
      <div style={{
        position: 'sticky', top: 'var(--site-header-height)', zIndex: 40,
        backgroundColor: '#fff', borderBottom: '1px solid #e8edf4',
        boxShadow: '0 2px 12px rgba(15,31,61,0.07)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 24px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
              style={{ width: '100%', padding: '10px 44px 10px 16px', borderRadius: 8, border: '1.5px solid #dde3ee', fontSize: 14, outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafd', boxSizing: 'border-box' }}
            />
            <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#FF6B35', borderRadius: 6, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={15} color="#fff" />
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setCategory('all')}
              className={`cat-btn${category === 'all' ? ' active' : ''}`}
              style={{ padding: '8px 18px', borderRadius: 6, border: '1.5px solid #dde3ee', backgroundColor: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4a5568' }}
            >
              All
            </button>
            {categoryOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCategory(opt.value)}
                className={`cat-btn${category === opt.value ? ' active' : ''}`}
                style={{ padding: '8px 18px', borderRadius: 6, border: '1.5px solid #dde3ee', backgroundColor: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4a5568' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px 60px' }}>
        {loading && <p style={{ color: '#6b7a90', padding: '40px 0' }}>Loading posts…</p>}
        {!loading && error && <p style={{ color: '#EF4444', padding: '40px 0' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

            {/* ── Main Column ── */}
            <div>

              {/* Featured Post */}
              {featuredPost && (
                <div
                  className="fade-up featured-card"
                  onClick={() => featuredPost.slug && navigateTo('blog-detail', featuredPost.slug)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #e8edf4',
                    marginBottom: 40,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    minHeight: 400,
                    boxShadow: '0 4px 24px rgba(15,31,61,0.08)',
                    transition: 'box-shadow 0.25s ease',
                  }}
                >
                  <style>{`.featured-card:hover { box-shadow: 0 12px 48px rgba(15,31,61,0.16) !important; }`}</style>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, display: 'flex', gap: 8 }}>
                      <span style={{ background: '#FF6B35', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 4, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Featured</span>
                      <CategoryBadge category={featuredPost.category} small />
                    </div>
                    <img src={featuredPost.image} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} className="feat-img" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.08) 100%)' }} />
                  </div>
                  <style>{`.featured-card:hover .feat-img { transform: scale(1.04); }`}</style>
                  <div style={{ padding: '40px 40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ width: 40, height: 3, backgroundColor: '#FF6B35', borderRadius: 2, marginBottom: 20 }} />
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f1f3d', lineHeight: 1.3, marginBottom: 14, letterSpacing: '-0.01em' }}>
                      {featuredPost.title}
                    </h2>
                    <p style={{ fontSize: 14.5, color: '#6b7a90', lineHeight: 1.7, marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {featuredPost.excerpt}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12.5, color: '#8a96a8', marginBottom: 28 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><User size={13} />{featuredPost.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} />{featuredPost.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} />{featuredPost.readTime}</span>
                    </div>
                    <button
                      style={{ alignSelf: 'flex-start', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 26px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s, transform 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e55a27'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#FF6B35'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      Read Full Article <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Grid of articles */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f1f3d', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'inline-block', width: 4, height: 24, background: '#FF6B35', borderRadius: 2 }} />
                  Latest Articles
                </h2>
                <span style={{ fontSize: 13, color: '#8a96a8', fontWeight: 500 }}>{filtered.length} articles</span>
              </div>

              {gridPosts.length === 0 && filtered.length === 1 && (
                <p style={{ color: '#8a96a8', fontSize: 14 }}>Only the featured article matches your filter.</p>
              )}
              {gridPosts.length === 0 && filtered.length === 0 && (
                <p style={{ color: '#8a96a8', fontSize: 14 }}>No articles found.</p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                {gridPosts.map((post, i) => (
                  <div key={post.id || post.slug} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                    <ArticleCard post={post} navigateTo={navigateTo} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside style={{ position: 'sticky', top: 'calc(var(--site-header-height) + 80px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Newsletter */}
              <div style={{ backgroundColor: '#0f1f3d', borderRadius: 14, padding: '28px 26px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,107,53,0.12)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,107,53,0.08)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ background: 'rgba(255,107,53,0.2)', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Send size={18} color="#FF6B35" />
                  </div>
                  <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Stay Updated</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                    Get the latest industry insights delivered to your inbox weekly.
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="subscribe-input"
                      style={{ width: '100%', padding: '11px 16px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box', transition: 'all 0.2s' }}
                    />
                    <style>{`.subscribe-input::placeholder { color: rgba(255,255,255,0.4); }`}</style>
                    <button
                      type="submit"
                      disabled={subscribeState.saving}
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', backgroundColor: '#FF6B35', color: '#fff', fontWeight: 700, fontSize: 14, cursor: subscribeState.saving ? 'not-allowed' : 'pointer', opacity: subscribeState.saving ? 0.75 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                    >
                      <Send size={15} /> {subscribeState.saving ? 'Subscribing…' : 'Subscribe Now'}
                    </button>
                    {subscribeState.message && <p style={{ marginTop: 10, fontSize: 13, color: '#34d399' }}>{subscribeState.message}</p>}
                    {subscribeState.error   && <p style={{ marginTop: 10, fontSize: 13, color: '#f87171' }}>{subscribeState.error}</p>}
                  </form>
                </div>
              </div>

              {/* Popular Topics */}
              <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '24px 22px', border: '1px solid #e8edf4' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1f3d', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag size={16} color="#FF6B35" /> Popular Topics
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {POPULAR_TOPICS.map(t => (
                    <span
                      key={t}
                      className="topic-tag"
                      style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #e8edf4', color: '#4a5568', backgroundColor: '#f8fafd', transition: 'all 0.18s ease' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '24px 22px', border: '1.5px solid #e8edf4', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <ArrowRight size={20} color="#FF6B35" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f1f3d', marginBottom: 8 }}>Ready to upgrade?</h3>
                <p style={{ fontSize: 13, color: '#6b7a90', lineHeight: 1.6, marginBottom: 18 }}>
                  Explore ZMS LIZZA embroidery machines built for Indian factories.
                </p>
                <button
                  style={{ width: '100%', padding: '11px', borderRadius: 8, border: '2px solid #0f1f3d', backgroundColor: 'transparent', color: '#0f1f3d', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0f1f3d'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f1f3d'; }}
                >
                  Request a Demo
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}