import { useEffect, useMemo, useState } from 'react'
import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { Search, ChevronRight, User, Calendar, Clock, ArrowRight, Send } from 'lucide-react'
import { publicService } from '../services/publicService.js'

const CATEGORY_COLORS = {
  Product: '#2E5EAA',
  Guide: '#8B2F97',
  News: '#FF6B35',
  'Case Study': '#10B981',
  Announcement: '#EF4444',
}

const POPULAR_TOPICS = [
  'Embroidery Trends', 'Machine Maintenance', 'European Technology',
  'Textile Industry', 'Sequin Techniques', 'Productivity Tips',
  'Quality Control', 'Business Growth',
]

const normalizeCategory = (value) => String(value || '').toLowerCase().replace(/[ &]/g, '')

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
      setSubscribeState({
        saving: false,
        message: result?.message || 'Subscribed successfully.',
        error: '',
      })
      setEmail('')
    } catch (err) {
      setSubscribeState({
        saving: false,
        message: '',
        error: err?.message || 'Failed to subscribe. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pt-36 pb-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>Blog</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Industry Insights & Updates</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>Stay ahead with the latest in textile technology and embroidery trends</p>
          </div>
        </div>
      </section>

      <div className="sticky top-[90px] z-40 bg-white shadow-sm border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none transition-all" style={{ fontSize: '15px' }} />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-orange)' }}>
              <Search size={18} color="white" />
            </div>
          </div>
          <select onChange={e => setCategory(e.target.value)} className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none" style={{ fontSize: '14px', fontWeight: 500 }}>
            <option value="all">All Categories</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          {loading && <p style={{ color: 'var(--dark-gray)' }}>Loading posts...</p>}
          {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}
          {!loading && !error && featuredPost && (
          <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ border: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--gradient-red), var(--gradient-purple), var(--gradient-blue))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden h-[400px] lg:h-auto">
                <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>Featured</div>
                <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: CATEGORY_COLORS[featuredPost.category] || 'var(--gradient-blue)', color: 'white', fontSize: '13px', fontWeight: 600 }}>{featuredPost.category}</div>
                <h2 className="mb-4" style={{ fontSize: '28px', lineHeight: '1.3' }}>{featuredPost.title}</h2>
                <p className="mb-6" style={{ fontSize: '16px', color: 'var(--dark-gray)', lineHeight: '1.7' }}>{featuredPost.excerpt}</p>
                <div className="flex flex-wrap gap-4 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
                  <span className="flex items-center gap-1"><User size={14} />{featuredPost.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} />{featuredPost.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{featuredPost.readTime}</span>
                </div>
                <button
                  className="px-8 py-4 rounded-lg font-bold flex items-center gap-2 w-fit transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}
                  onClick={() => featuredPost.slug && navigateTo('blog-detail', featuredPost.slug)}
                >
                  Read Full Article <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-12">
            <div>
              <h2 className="mb-8">Latest Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {!loading && !error && filtered.map((post) => (
                  <div
                    key={post.id || post.slug}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group cursor-pointer border border-black/5"
                    onClick={() => post.slug && navigateTo('blog-detail', post.slug)}
                  >
                    <div className="relative overflow-hidden h-56">
                      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: CATEGORY_COLORS[post.category] || '#555', color: 'white' }}>{post.category}</div>
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 line-clamp-2 group-hover:text-[var(--accent-orange)] transition-colors" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--charcoal)', lineHeight: '1.4' }}>{post.title}</h3>
                      <p className="mb-4 line-clamp-3" style={{ fontSize: '14px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-100 text-xs" style={{ color: 'var(--dark-gray)' }}>
                        <span>{post.author}</span><span>|</span><span>{post.date}</span><span>|</span><span>{post.readTime}</span>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--accent-orange)' }}>Read More -&gt;</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block space-y-8">
              <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--light-gray)' }}>
                <h3 className="mb-3" style={{ fontSize: '20px', color: 'var(--charcoal)' }}>Stay Updated</h3>
                <p className="mb-6" style={{ fontSize: '14px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>Get the latest industry insights delivered to your inbox</p>
                <form onSubmit={handleSubscribe}>
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none mb-3" style={{ fontSize: '14px' }} />
                  <button type="submit" disabled={subscribeState.saving} className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm" style={{ backgroundColor: 'var(--accent-orange)', color: 'white', opacity: subscribeState.saving ? 0.75 : 1 }}>
                    <Send size={16} /> {subscribeState.saving ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  {subscribeState.message && (
                    <p style={{ marginTop: 10, fontSize: 13, color: '#10B981' }}>{subscribeState.message}</p>
                  )}
                  {subscribeState.error && (
                    <p style={{ marginTop: 10, fontSize: 13, color: '#EF4444' }}>{subscribeState.error}</p>
                  )}
                </form>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="mb-6" style={{ fontSize: '20px', color: 'var(--charcoal)' }}>Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TOPICS.map(t => (
                    <span key={t} className="px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-orange-50 transition-all" style={{ border: '1px solid rgba(0,0,0,0.1)', color: 'var(--dark-gray)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
