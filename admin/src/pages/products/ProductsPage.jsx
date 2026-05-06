import React, { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  Save,
  X,
  ImagePlus,
  Star,
  Flame,
  Package,
} from 'lucide-react'
import { productsService } from '../../services/productsService'
import { mediaService } from '../../services/mediaService'
import StateBlock from '../../components/ui/StateBlock'

const STATUS_CONFIG = {
  published: { label: 'Published', cls: 'badge-success', icon: <CheckCircle size={12} /> },
  draft: { label: 'Draft', cls: 'badge-neutral', icon: <Clock size={12} /> },
  scheduled: { label: 'Scheduled', cls: 'badge-info', icon: <Calendar size={12} /> },
}

const STATUS_OPTIONS = ['draft', 'published', 'scheduled']
const PUBLIC_SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://zmslizzafrontend.vercel.app').replace(/\/+$/, '')

const emptySpecificationGroup = () => ({
  category: '',
  items: [{ label: '', value: '' }],
})

const emptyFeature = () => ({
  title: '',
  description: '',
  benefit: '',
  image: '',
})

const emptyPackage = () => ({
  title: '',
  itemsText: '',
})

const emptyFaq = () => ({
  q: '',
  a: '',
})

const emptyForm = {
  name: '',
  tagline: '',
  badge: '',
  category: 'Embroidery Machine',
  modelNo: '',
  priceDisplay: '',
  priceNote: 'Get Latest Price',
  image: '',
  description: '',
  keySpecsText: '',
  keyFeaturesText: '',
  galleryImages: [],
  specifications: [emptySpecificationGroup()],
  features: [emptyFeature()],
  applicationsText: '',
  packageIncludes: [emptyPackage()],
  faqs: [emptyFaq()],
  isFeatured: false,
  isPopular: false,
  status: 'draft',
  scheduledAt: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywordsText: '',
}

const splitLines = (value) =>
  String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)

const joinLines = (items = []) => (Array.isArray(items) ? items.filter(Boolean).join('\n') : '')

const normalizeSpecifications = (groups = []) =>
  groups
    .map((group) => ({
      category: String(group.category || '').trim(),
      items: (Array.isArray(group.items) ? group.items : [])
        .map((item) => ({
          label: String(item.label || '').trim(),
          value: String(item.value || '').trim(),
        }))
        .filter((item) => item.label && item.value),
    }))
    .filter((group) => group.category && group.items.length > 0)

const normalizeFeatures = (features = []) =>
  features
    .map((feature) => ({
      title: String(feature.title || '').trim(),
      description: String(feature.description || '').trim(),
      benefit: String(feature.benefit || '').trim(),
      image: String(feature.image || '').trim(),
    }))
    .filter((feature) => feature.title)

const normalizePackages = (packages = []) =>
  packages
    .map((pkg) => ({
      title: String(pkg.title || '').trim(),
      items: splitLines(pkg.itemsText),
    }))
    .filter((pkg) => pkg.title && pkg.items.length > 0)

const normalizeFaqs = (faqs = []) =>
  faqs
    .map((faq) => ({
      q: String(faq.q || '').trim(),
      a: String(faq.a || '').trim(),
    }))
    .filter((faq) => faq.q && faq.a)

const buildPayload = (form) => ({
  name: String(form.name || '').trim(),
  tagline: String(form.tagline || '').trim(),
  badge: String(form.badge || '').trim(),
  category: String(form.category || '').trim(),
  modelNo: String(form.modelNo || '').trim(),
  priceDisplay: String(form.priceDisplay || '').trim(),
  priceNote: String(form.priceNote || '').trim(),
  image: String(form.image || '').trim(),
  description: String(form.description || '').trim(),
  keySpecs: splitLines(form.keySpecsText),
  keyFeatures: splitLines(form.keyFeaturesText),
  galleryImages: (Array.isArray(form.galleryImages) ? form.galleryImages : []).map((item) => String(item || '').trim()).filter(Boolean),
  specifications: normalizeSpecifications(form.specifications),
  features: normalizeFeatures(form.features),
  applications: splitLines(form.applicationsText),
  packageIncludes: normalizePackages(form.packageIncludes),
  faqs: normalizeFaqs(form.faqs),
  isFeatured: Boolean(form.isFeatured),
  isPopular: Boolean(form.isPopular),
  status: form.status,
  scheduledAt: form.status === 'scheduled' && form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
  seoTitle: String(form.seoTitle || '').trim(),
  seoDescription: String(form.seoDescription || '').trim(),
  seoKeywords: splitLines(form.seoKeywordsText),
})

const buildFormFromProduct = (product) => ({
  name: product.name || '',
  tagline: product.tagline || '',
  badge: product.badge || '',
  category: product.category || 'Embroidery Machine',
  modelNo: product.modelNo || '',
  priceDisplay: product.priceDisplay || '',
  priceNote: product.priceNote || 'Get Latest Price',
  image: product.image || '',
  description: product.description || '',
  keySpecsText: joinLines(product.keySpecs),
  keyFeaturesText: joinLines(product.keyFeatures),
  galleryImages: Array.isArray(product.galleryImages) ? product.galleryImages.filter(Boolean) : [],
  specifications: Array.isArray(product.specifications) && product.specifications.length > 0
    ? product.specifications.map((group) => ({
      category: group.category || '',
      items: Array.isArray(group.items) && group.items.length > 0
        ? group.items.map((item) => ({ label: item.label || '', value: item.value || '' }))
        : [{ label: '', value: '' }],
    }))
    : [emptySpecificationGroup()],
  features: Array.isArray(product.features) && product.features.length > 0
    ? product.features.map((feature) => ({
      title: feature.title || '',
      description: feature.description || '',
      benefit: feature.benefit || '',
      image: feature.image || '',
    }))
    : [emptyFeature()],
  applicationsText: joinLines(product.applications),
  packageIncludes: Array.isArray(product.packageIncludes) && product.packageIncludes.length > 0
    ? product.packageIncludes.map((pkg) => ({
      title: pkg.title || '',
      itemsText: joinLines(pkg.items),
    }))
    : [emptyPackage()],
  faqs: Array.isArray(product.faqs) && product.faqs.length > 0
    ? product.faqs.map((faq) => ({ q: faq.q || '', a: faq.a || '' }))
    : [emptyFaq()],
  isFeatured: Boolean(product.isFeatured),
  isPopular: Boolean(product.isPopular),
  status: product.status || 'draft',
  scheduledAt: product.scheduledAt ? new Date(product.scheduledAt).toISOString().slice(0, 16) : '',
  seoTitle: product.seoTitle || '',
  seoDescription: product.seoDescription || '',
  seoKeywordsText: joinLines(product.seoKeywords),
})

const StatCard = ({ icon, label, value, tone = 'var(--orange)' }) => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${tone}18`, color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
  </div>
)

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState({ total: 0, featured: 0, popular: 0, published: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const summary = useMemo(() => {
    const published = products.filter((product) => product.status === 'published').length
    return `${meta.total || products.length} products | ${published} published on this page`
  }, [products, meta.total])

  const loadProducts = async (nextPage = page) => {
    setLoading(true)
    setError('')
    try {
      const [listResponse, statsResponse] = await Promise.all([
        productsService.list({
          page: nextPage,
          limit: 10,
          status: filter === 'all' ? undefined : filter,
          search: search || undefined,
        }),
        productsService.stats(),
      ])

      const nextProducts = listResponse?.data || []
      const byStatus = statsResponse?.data?.byStatus || []
      const totalPublished = byStatus.find((item) => item._id === 'published')?.count || 0

      setProducts(nextProducts)
      setMeta(listResponse?.meta || { page: nextPage, totalPages: 1, total: 0 })
      setPage(nextPage)
      setStats({
        total: listResponse?.meta?.total || nextProducts.length,
        featured: nextProducts.filter((product) => product.isFeatured).length,
        popular: nextProducts.filter((product) => product.isPopular).length,
        published: totalPublished,
      })
    } catch (err) {
      setError(err?.message || 'Failed to fetch products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1)
    }, 250)
    return () => clearTimeout(timer)
  }, [search, filter])

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const updateListItem = (key, index, value) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }))
  }

  const removeListItem = (key, index, fallbackFactory) => {
    setForm((current) => {
      const nextItems = current[key].filter((_, itemIndex) => itemIndex !== index)
      return {
        ...current,
        [key]: nextItems.length > 0 ? nextItems : [fallbackFactory()],
      }
    })
  }

  const addListItem = (key, factory) => {
    setForm((current) => ({
      ...current,
      [key]: [...current[key], factory()],
    }))
  }

  const updateSpecificationGroup = (groupIndex, field, value) => {
    setForm((current) => ({
      ...current,
      specifications: current.specifications.map((group, index) => (
        index === groupIndex ? { ...group, [field]: value } : group
      )),
    }))
  }

  const updateSpecificationItem = (groupIndex, itemIndex, field, value) => {
    setForm((current) => ({
      ...current,
      specifications: current.specifications.map((group, index) => (
        index === groupIndex
          ? {
            ...group,
            items: group.items.map((item, nestedIndex) => (
              nestedIndex === itemIndex ? { ...item, [field]: value } : item
            )),
          }
          : group
      )),
    }))
  }

  const addSpecificationItem = (groupIndex) => {
    setForm((current) => ({
      ...current,
      specifications: current.specifications.map((group, index) => (
        index === groupIndex ? { ...group, items: [...group.items, { label: '', value: '' }] } : group
      )),
    }))
  }

  const removeSpecificationItem = (groupIndex, itemIndex) => {
    setForm((current) => ({
      ...current,
      specifications: current.specifications.map((group, index) => {
        if (index !== groupIndex) return group
        const nextItems = group.items.filter((_, nestedIndex) => nestedIndex !== itemIndex)
        return { ...group, items: nextItems.length > 0 ? nextItems : [{ label: '', value: '' }] }
      }),
    }))
  }

  const openCreate = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm(buildFormFromProduct(product))
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setForm(emptyForm)
    setEditingProduct(null)
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = buildPayload(form)
      if (!editingProduct?._id && !payload.image) {
        throw new Error('Please upload or provide a main product image before creating the product.')
      }
      if (editingProduct?._id) {
        await productsService.update(editingProduct._id, payload)
      } else {
        await productsService.create(payload)
      }
      closeForm()
      await loadProducts(1)
    } catch (err) {
      setError(err?.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleMainImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setError('')
    try {
      const response = await mediaService.upload(file)
      const uploadedUrl = response?.data?.url
      if (!uploadedUrl) throw new Error('Upload succeeded but no image URL was returned.')
      updateForm('image', uploadedUrl)
    } catch (err) {
      setError(err?.message || 'Failed to upload product image.')
    } finally {
      setImageUploading(false)
      event.target.value = ''
    }
  }

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setGalleryUploading(true)
    setError('')
    try {
      const uploaded = await Promise.all(files.map((file) => mediaService.upload(file)))
      const urls = uploaded.map((item) => item?.data?.url).filter(Boolean)
      if (urls.length === 0) throw new Error('Upload succeeded but no gallery image URLs were returned.')
      setForm((current) => ({ ...current, galleryImages: [...current.galleryImages, ...urls] }))
    } catch (err) {
      setError(err?.message || 'Failed to upload gallery images.')
    } finally {
      setGalleryUploading(false)
      event.target.value = ''
    }
  }

  const removeGalleryImage = (index) => {
    setForm((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    try {
      await productsService.remove(product._id)
      await loadProducts(page)
    } catch (err) {
      setError(err?.message || 'Failed to delete product.')
    }
  }

  const openPublicProduct = (product) => {
    const target = product?.slug || product?._id
    if (!target) {
      setError('Cannot open public product because slug is missing.')
      return
    }
    const url = `${PUBLIC_SITE_URL}/?page=product-detail&product=${encodeURIComponent(target)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products <span className="gradient-text">Catalog</span></h1>
          <p className="page-subtitle">{summary}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> New Product</button>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Package size={18} />} label="Total Products" value={stats.total} tone="var(--blue)" />
        <StatCard icon={<CheckCircle size={18} />} label="Published" value={stats.published} tone="#10B981" />
        <StatCard icon={<Star size={18} />} label="Featured on Page" value={stats.featured} tone="var(--purple)" />
        <StatCard icon={<Flame size={18} />} label="Popular on Page" value={stats.popular} tone="var(--orange)" />
      </div>

      <div className="card posts-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar-input" />
        </div>
        <div className="toolbar-filters">
          {['all', 'published', 'draft', 'scheduled'].map((status) => (
            <button key={status} className={`filter-tab ${filter === status ? 'active' : ''}`} onClick={() => setFilter(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={() => loadProducts(page)} />

      {!loading && !error && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead>
                <tr><th>Product</th><th>Category</th><th>Status</th><th>Flags</th><th>Author</th><th>Updated</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} className="table-empty">No products found.</td></tr>
                ) : products.map((product) => (
                  <tr key={product._id} className="animate-fade-in">
                    <td>
                      <div className="post-title-cell" style={{ maxWidth: 420 }}>
                        <div className="post-title-dot" />
                        <div style={{ overflow: 'hidden' }}>
                          <div className="post-title-text">{product.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.modelNo || 'No model'} {product.priceDisplay ? `| ${product.priceDisplay}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{product.category || 'N/A'}</span></td>
                    <td>
                      <span className={`badge ${(STATUS_CONFIG[product.status] || STATUS_CONFIG.draft).cls}`}>
                        {(STATUS_CONFIG[product.status] || STATUS_CONFIG.draft).icon} {(STATUS_CONFIG[product.status] || STATUS_CONFIG.draft).label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {product.isFeatured && <span className="badge badge-warning"><Star size={11} /> Featured</span>}
                        {product.isPopular && <span className="badge badge-danger"><Flame size={11} /> Popular</span>}
                        {!product.isFeatured && !product.isPopular && <span className="badge badge-neutral">Standard</span>}
                      </div>
                    </td>
                    <td>
                      <div className="author-cell">
                        <div className="avatar avatar-sm">{product.author?.name?.[0] || 'U'}</div>
                        <span>{product.author?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td><span className="table-date">{new Date(product.updatedAt || product.createdAt).toLocaleDateString()}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-icon btn-ghost btn-sm" title="View" onClick={() => setPreviewItem(product)}><Eye size={14} /></button>
                        <button className="btn btn-icon btn-ghost btn-sm" title="Edit" onClick={() => openEdit(product)}><Edit2 size={14} /></button>
                        <button className="btn btn-icon btn-danger btn-sm" title="Delete" onClick={() => deleteProduct(product)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => loadProducts(page - 1)}>Previous</button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
              Page {meta.page || page} of {meta.totalPages || 1}
            </span>
            <button className="btn btn-sm btn-ghost" disabled={page >= (meta.totalPages || 1)} onClick={() => loadProducts(page + 1)}>Next</button>
          </div>
        </div>
      )}

      {formOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 1080, maxHeight: '92vh', overflow: 'auto', padding: 20 }}>
            <form onSubmit={submitForm} style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 20 }}>{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
                <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={closeForm}><X size={15} /></button>
              </div>

              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <input className="input" placeholder="Product Name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
                <input className="input" placeholder="Tagline" value={form.tagline} onChange={(e) => updateForm('tagline', e.target.value)} />
                <input className="input" placeholder="Badge" value={form.badge} onChange={(e) => updateForm('badge', e.target.value)} />
                <input className="input" placeholder="Category" value={form.category} onChange={(e) => updateForm('category', e.target.value)} />
                <input className="input" placeholder="Model Number" value={form.modelNo} onChange={(e) => updateForm('modelNo', e.target.value)} />
                <input className="input" placeholder="Price Display" value={form.priceDisplay} onChange={(e) => updateForm('priceDisplay', e.target.value)} />
                <input className="input" placeholder="Price Note" value={form.priceNote} onChange={(e) => updateForm('priceNote', e.target.value)} />
                <select className="input" value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
                  {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              {form.status === 'scheduled' && (
                <input
                  className="input"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => updateForm('scheduledAt', e.target.value)}
                />
              )}

              <textarea className="input" rows={4} placeholder="Product Description" value={form.description} onChange={(e) => updateForm('description', e.target.value)} required />

              <div className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <strong>Main Product Image</strong>
                  <label className="btn btn-ghost btn-sm" style={{ cursor: imageUploading ? 'not-allowed' : 'pointer' }}>
                    <ImagePlus size={14} /> {imageUploading ? 'Uploading...' : 'Upload Main Image'}
                    <input type="file" accept="image/*" hidden onChange={handleMainImageUpload} disabled={imageUploading} />
                  </label>
                </div>
                <input className="input" placeholder="Main image URL" value={form.image} onChange={(e) => updateForm('image', e.target.value)} />
                {form.image && <img src={form.image} alt="Main product preview" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />}
              </div>

              <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <strong>Gallery Images</strong>
                  <label className="btn btn-ghost btn-sm" style={{ cursor: galleryUploading ? 'not-allowed' : 'pointer' }}>
                    <ImagePlus size={14} /> {galleryUploading ? 'Uploading...' : 'Upload Gallery Images'}
                    <input type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} disabled={galleryUploading} />
                  </label>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {form.galleryImages.map((imageUrl, index) => (
                    <div key={`${imageUrl}-${index}`} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8, alignItems: 'center' }}>
                      <input
                        className="input"
                        value={imageUrl}
                        onChange={(e) => {
                          const nextImages = [...form.galleryImages]
                          nextImages[index] = e.target.value
                          updateForm('galleryImages', nextImages)
                        }}
                      />
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeGalleryImage(index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateForm('galleryImages', [...form.galleryImages, ''])}>Add Gallery URL</button>
                </div>
                {form.galleryImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                    {form.galleryImages.filter(Boolean).map((imageUrl) => (
                      <img key={imageUrl} src={imageUrl} alt="Gallery preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                <textarea className="input" rows={6} placeholder="Key Specs (one per line)" value={form.keySpecsText} onChange={(e) => updateForm('keySpecsText', e.target.value)} />
                <textarea className="input" rows={6} placeholder="Key Features (one per line)" value={form.keyFeaturesText} onChange={(e) => updateForm('keyFeaturesText', e.target.value)} />
                <textarea className="input" rows={6} placeholder="Applications (one per line)" value={form.applicationsText} onChange={(e) => updateForm('applicationsText', e.target.value)} />
                <textarea className="input" rows={6} placeholder="SEO Keywords (one per line)" value={form.seoKeywordsText} onChange={(e) => updateForm('seoKeywordsText', e.target.value)} />
              </div>

              <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Specifications</strong>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListItem('specifications', emptySpecificationGroup)}>Add Group</button>
                </div>
                {form.specifications.map((group, groupIndex) => (
                  <div key={`spec-${groupIndex}`} className="card" style={{ padding: 14, display: 'grid', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8 }}>
                      <input className="input" placeholder="Group Name" value={group.category} onChange={(e) => updateSpecificationGroup(groupIndex, 'category', e.target.value)} />
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeListItem('specifications', groupIndex, emptySpecificationGroup)}>Remove Group</button>
                    </div>
                    {group.items.map((item, itemIndex) => (
                      <div key={`spec-item-${groupIndex}-${itemIndex}`} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', gap: 8 }}>
                        <input className="input" placeholder="Label" value={item.label} onChange={(e) => updateSpecificationItem(groupIndex, itemIndex, 'label', e.target.value)} />
                        <input className="input" placeholder="Value" value={item.value} onChange={(e) => updateSpecificationItem(groupIndex, itemIndex, 'value', e.target.value)} />
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeSpecificationItem(groupIndex, itemIndex)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addSpecificationItem(groupIndex)}>Add Item</button>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Feature Blocks</strong>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListItem('features', emptyFeature)}>Add Feature</button>
                </div>
                {form.features.map((feature, index) => (
                  <div key={`feature-${index}`} className="card" style={{ padding: 14, display: 'grid', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: 8 }}>
                      <input className="input" placeholder="Feature Title" value={feature.title} onChange={(e) => updateListItem('features', index, { ...feature, title: e.target.value })} />
                      <input className="input" placeholder="Feature Benefit" value={feature.benefit} onChange={(e) => updateListItem('features', index, { ...feature, benefit: e.target.value })} />
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeListItem('features', index, emptyFeature)}>Remove</button>
                    </div>
                    <textarea className="input" rows={3} placeholder="Feature Description" value={feature.description} onChange={(e) => updateListItem('features', index, { ...feature, description: e.target.value })} />
                    <input className="input" placeholder="Optional Feature Image URL" value={feature.image} onChange={(e) => updateListItem('features', index, { ...feature, image: e.target.value })} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Package Includes</strong>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListItem('packageIncludes', emptyPackage)}>Add Section</button>
                  </div>
                  {form.packageIncludes.map((pkg, index) => (
                    <div key={`package-${index}`} className="card" style={{ padding: 12, display: 'grid', gap: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8 }}>
                        <input className="input" placeholder="Section Title" value={pkg.title} onChange={(e) => updateListItem('packageIncludes', index, { ...pkg, title: e.target.value })} />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeListItem('packageIncludes', index, emptyPackage)}>Remove</button>
                      </div>
                      <textarea className="input" rows={4} placeholder="Items (one per line)" value={pkg.itemsText} onChange={(e) => updateListItem('packageIncludes', index, { ...pkg, itemsText: e.target.value })} />
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>FAQs</strong>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListItem('faqs', emptyFaq)}>Add FAQ</button>
                  </div>
                  {form.faqs.map((faq, index) => (
                    <div key={`faq-${index}`} className="card" style={{ padding: 12, display: 'grid', gap: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8 }}>
                        <input className="input" placeholder="Question" value={faq.q} onChange={(e) => updateListItem('faqs', index, { ...faq, q: e.target.value })} />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeListItem('faqs', index, emptyFaq)}>Remove</button>
                      </div>
                      <textarea className="input" rows={3} placeholder="Answer" value={faq.a} onChange={(e) => updateListItem('faqs', index, { ...faq, a: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <input className="input" placeholder="SEO Title" value={form.seoTitle} onChange={(e) => updateForm('seoTitle', e.target.value)} />
                <input className="input" placeholder="SEO Description" value={form.seoDescription} onChange={(e) => updateForm('seoDescription', e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm('isFeatured', e.target.checked)} />
                  Featured Product
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <input type="checkbox" checked={form.isPopular} onChange={(e) => updateForm('isPopular', e.target.checked)} />
                  Popular Product
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 960, maxHeight: '92vh', overflow: 'auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 20 }}>Preview Product</h3>
              <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => setPreviewItem(null)}><X size={15} /></button>
            </div>

            {previewItem.image && (
              <img
                src={previewItem.image}
                alt={previewItem.name}
                style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 14 }}
              />
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <span className={`badge ${(STATUS_CONFIG[previewItem.status] || STATUS_CONFIG.draft).cls}`}>
                {(STATUS_CONFIG[previewItem.status] || STATUS_CONFIG.draft).label}
              </span>
              {previewItem.category && <span className="badge badge-info">{previewItem.category}</span>}
              {previewItem.badge && <span className="badge badge-warning">{previewItem.badge}</span>}
            </div>
            <h4 style={{ fontSize: 28, marginBottom: 6 }}>{previewItem.name}</h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{previewItem.tagline || 'No tagline provided.'}</p>
            <p style={{ color: 'var(--text-primary)', marginBottom: 14 }}>{previewItem.description || 'No description provided.'}</p>

            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 16 }}>
              <div className="card" style={{ padding: 14 }}>
                <strong>Pricing</strong>
                <p style={{ marginTop: 8 }}>{previewItem.priceDisplay || 'No price display set.'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{previewItem.priceNote || 'No price note set.'}</p>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <strong>Quick Specs</strong>
                <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                  {(previewItem.keySpecs || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>

            {Array.isArray(previewItem.galleryImages) && previewItem.galleryImages.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <strong>Gallery</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 10 }}>
                  {previewItem.galleryImages.map((imageUrl) => (
                    <img key={imageUrl} src={imageUrl} alt="Gallery item" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setPreviewItem(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => openPublicProduct(previewItem)} disabled={previewItem.status !== 'published'}>
                Open Public Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
