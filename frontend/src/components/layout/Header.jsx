import { useState, useEffect } from 'react'
import { Menu, X, MessageCircle, Languages, ChevronDown } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { AppLink } from '../shared/AppLink.jsx'
import { LANGUAGES, useTranslation } from '../../i18n/index.js'
import { SUPPORT_WHATSAPP_URL } from '../../constants/contact.js'

const PRIMARY_NAV_ITEMS = [
    { key: 'nav.home', page: 'home' },
    { key: 'nav.about', page: 'about' },
    { key: 'nav.products', page: 'products' },
    { key: 'nav.gallery', page: 'gallery' },
    { key: 'nav.industries', page: 'industries' },
    { key: 'nav.blog', page: 'blog' },
    { key: 'nav.contact', page: 'contact' },
]

const PRODUCTS_DROPDOWN_ITEMS = [
    { key: 'navDropdown.allMachines', page: 'products' },
    { key: 'navDropdown.computerized', page: 'product-category', id: 'computerized-embroidery-machines' },
    { key: 'navDropdown.sequin', page: 'product-category', id: 'sequin-embroidery-machines' },
    { key: 'navDropdown.bead', page: 'product-category', id: 'bead-embroidery-machines' },
    { key: 'navDropdown.coding', page: 'product-category', id: 'coding-machines' },
    { key: 'navDropdown.spareParts', page: 'product-category', id: 'spare-parts' },
]

const INDUSTRIES_DROPDOWN_ITEMS = [
    { key: 'navDropdown.industriesOverview', page: 'industries' },
    { key: 'navDropdown.applications', page: 'applications' },
    { key: 'navDropdown.services', page: 'services' },
    { key: 'navDropdown.faq', page: 'faq' },
]

export function Header() {
    const { currentPage, pageSlug, navigateTo } = useNavigation()
    const { lang, setLang, t } = useTranslation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
    const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false)
    const activePage = currentPage === 'blog-detail'
      ? 'blog'
      : currentPage === 'product-detail' || currentPage === 'product-category'
        ? 'products'
        : currentPage

    const industriesGroupActive = ['industries', 'applications', 'services', 'faq'].includes(activePage)

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const go = (page) => { navigateTo(page); setMobileOpen(false) }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-transparent backdrop-blur-sm'
                }`}
            style={{ height: 'var(--site-header-height)' }}
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">

                {/* Logo */}
                <div className="cursor-pointer" onClick={() => go('home')}>
                    <img
                        src="/bgr_logo.png"
                        alt="ZMS LIZZA"
                        className="h-10 sm:h-12 lg:h-14 w-auto max-w-[190px] sm:max-w-[250px] object-contain"
                    />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-7">
                    {PRIMARY_NAV_ITEMS.map(({ key, page }) => {
                        if (page === 'products') {
                            return (
                                <div key={page} className="relative group">
                                    <AppLink
                                        page={page}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-[15px] transition-colors hover:text-[var(--accent-orange)] cursor-pointer inline-flex items-center gap-1"
                                        style={{
                                            color: activePage === 'products' ? 'var(--accent-orange)' : isScrolled ? 'var(--dark-gray)' : 'var(--charcoal)',
                                            fontWeight: activePage === 'products' ? 600 : 500,
                                        }}
                                    >
                                        {key.includes('.') ? t(key) : key}
                                        <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                                    </AppLink>

                                    <div className="absolute left-1/2 top-full z-50 pt-3 opacity-0 pointer-events-none -translate-x-1/2 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0">
                                        <div
                                            className="min-w-[250px] rounded-2xl border shadow-xl p-2"
                                            style={{
                                                backgroundColor: 'rgba(255,255,255,0.98)',
                                                borderColor: 'rgba(15,23,42,0.08)',
                                                backdropFilter: 'blur(12px)',
                                            }}
                                        >
                                            {PRODUCTS_DROPDOWN_ITEMS.map((item) => (
                                                <AppLink
                                                    key={`${item.page}-${item.id || 'all'}`}
                                                    page={item.page}
                                                    id={item.id}
                                                    className="block rounded-xl px-4 py-3 text-[14px] transition-colors"
                                                    style={{
                                                        color: item.id && item.id === pageSlug ? 'var(--accent-orange)' : item.page === 'products' && currentPage === 'products' ? 'var(--accent-orange)' : 'var(--charcoal)',
                                                        fontWeight: item.id && item.id === pageSlug ? 700 : item.page === 'products' && currentPage === 'products' ? 700 : 500,
                                                    }}
                                                    onMouseEnter={(event) => {
                                                        event.currentTarget.style.backgroundColor = 'rgba(255,107,53,0.08)'
                                                    }}
                                                    onMouseLeave={(event) => {
                                                        event.currentTarget.style.backgroundColor = 'transparent'
                                                    }}
                                                >
                                                    {t(item.key)}
                                                </AppLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        if (page === 'industries') {
                            return (
                                <div key={page} className="relative group">
                                    <AppLink
                                        page={page}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-[15px] transition-colors hover:text-[var(--accent-orange)] cursor-pointer inline-flex items-center gap-1"
                                        style={{
                                            color: industriesGroupActive ? 'var(--accent-orange)' : isScrolled ? 'var(--dark-gray)' : 'var(--charcoal)',
                                            fontWeight: industriesGroupActive ? 600 : 500,
                                        }}
                                    >
                                        {key.includes('.') ? t(key) : key}
                                        <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                                    </AppLink>

                                    <div
                                        className="absolute left-1/2 top-full z-50 pt-3 opacity-0 pointer-events-none -translate-x-1/2 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
                                    >
                                        <div
                                            className="min-w-[190px] rounded-2xl border shadow-xl p-2"
                                            style={{
                                                backgroundColor: 'rgba(255,255,255,0.98)',
                                                borderColor: 'rgba(15,23,42,0.08)',
                                                backdropFilter: 'blur(12px)',
                                            }}
                                        >
                                            {INDUSTRIES_DROPDOWN_ITEMS.map((item) => (
                                                <AppLink
                                                    key={item.page}
                                                    page={item.page}
                                                    className="block rounded-xl px-4 py-3 text-[14px] transition-colors"
                                                    style={{
                                                        color: activePage === item.page ? 'var(--accent-orange)' : 'var(--charcoal)',
                                                        fontWeight: activePage === item.page ? 700 : 500,
                                                    }}
                                                    onMouseEnter={(event) => {
                                                        event.currentTarget.style.backgroundColor = 'rgba(255,107,53,0.08)'
                                                    }}
                                                    onMouseLeave={(event) => {
                                                        event.currentTarget.style.backgroundColor = 'transparent'
                                                    }}
                                                >
                                                    {t(item.key)}
                                                </AppLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                        <AppLink key={page}
                            page={page}
                            onClick={() => setMobileOpen(false)}
                            className="text-[15px] transition-colors hover:text-[var(--accent-orange)] cursor-pointer"
                            style={{
                                color: activePage === page ? 'var(--accent-orange)' : isScrolled ? 'var(--dark-gray)' : 'var(--charcoal)',
                                fontWeight: activePage === page ? 600 : 500,
                            }}
                        >
                            {key.includes('.') ? t(key) : key}
                        </AppLink>
                    )})}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <label className="hidden md:flex items-center gap-2" style={{ color: isScrolled ? 'var(--charcoal)' : 'var(--charcoal)' }}>
                        <span className="text-xs font-semibold">{t('lang.title')}</span>
                        <div
                            className="relative rounded-xl p-[1px]"
                            style={{ background: 'linear-gradient(135deg, rgba(46,94,170,0.55), rgba(230,57,70,0.45))' }}
                        >
                            <div className="relative rounded-[11px]" style={{ backgroundColor: '#fff' }}>
                                <Languages size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gradient-blue)' }} />
                                <select
                                    value={lang}
                                    onChange={(event) => setLang(event.target.value)}
                                    className="appearance-none pl-8 pr-8 py-1.5 rounded-[11px] border border-transparent"
                                    style={{ backgroundColor: 'transparent', fontSize: '13px', fontWeight: 700, color: 'var(--charcoal)', minWidth: '130px' }}
                                >
                                    {LANGUAGES.map((item) => (
                                        <option key={item.code} value={item.code}>{item.flag} {item.nativeName}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--dark-gray)' }} />
                            </div>
                        </div>
                    </label>

                    <button
                        onClick={() => go('contact')}
                        className="hidden md:flex items-center justify-center px-4 lg:px-5 py-2.5 rounded-lg transition-all hover:scale-[1.03] hover:shadow-lg"
                        style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '14px', minWidth: '136px' }}
                    >
                        {t('header.requestDemo')}
                    </button>

                    <a href={SUPPORT_WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all hover:scale-105"
                        style={{ borderColor: 'var(--whatsapp-green)', color: 'var(--whatsapp-green)' }}
                    >
                        <MessageCircle size={20} />
                    </a>
                    <button
                        type="button"
                        aria-label="Toggle menu"
                        className="lg:hidden p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ color: 'var(--charcoal)' }}
                    >
                        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t shadow-lg max-h-[calc(100vh-var(--site-header-height))] overflow-auto">
                    <nav className="flex flex-col p-5 gap-3">
                        <label className="mb-2" style={{ color: 'var(--charcoal)' }}>
                            <span className="block text-xs font-semibold mb-1">{t('lang.title')}</span>
                            <div
                                className="relative rounded-xl p-[1px]"
                                style={{ background: 'linear-gradient(135deg, rgba(46,94,170,0.5), rgba(230,57,70,0.4))' }}
                            >
                                <div className="relative rounded-[11px]" style={{ backgroundColor: '#fff' }}>
                                    <Languages size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--gradient-blue)' }} />
                                    <select
                                        value={lang}
                                        onChange={(event) => setLang(event.target.value)}
                                        className="w-full appearance-none pl-9 pr-9 py-2 rounded-[11px] border border-transparent"
                                        style={{ backgroundColor: 'transparent', fontSize: '14px', fontWeight: 700, color: 'var(--charcoal)' }}
                                    >
                                        {LANGUAGES.map((item) => (
                                            <option key={item.code} value={item.code}>{item.flag} {item.nativeName}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--dark-gray)' }} />
                                </div>
                            </div>
                        </label>

                        {PRIMARY_NAV_ITEMS.map(({ key, page }) => {
                            if (page === 'products') {
                                return (
                                    <div key={page} className="rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                                        <button
                                            type="button"
                                            onClick={() => setMobileProductsOpen((current) => !current)}
                                            className="w-full flex items-center justify-between transition-colors hover:text-[var(--accent-orange)]"
                                            style={{ color: activePage === 'products' ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: activePage === 'products' ? 600 : 500 }}
                                        >
                                            <span>{key.includes('.') ? t(key) : key}</span>
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {mobileProductsOpen && (
                                            <div className="mt-2 flex flex-col gap-1 border-t pt-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                                {PRODUCTS_DROPDOWN_ITEMS.map((item) => (
                                                    <AppLink
                                                        key={`${item.page}-${item.id || 'all'}`}
                                                        page={item.page}
                                                        id={item.id}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="py-2 pl-2 rounded-lg"
                                                        style={{ color: item.id && item.id === pageSlug ? 'var(--accent-orange)' : item.page === 'products' && currentPage === 'products' ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: item.id && item.id === pageSlug ? 600 : item.page === 'products' && currentPage === 'products' ? 600 : 500 }}
                                                    >
                                                        {t(item.key)}
                                                    </AppLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            if (page === 'industries') {
                                return (
                                    <div key={page} className="rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                                        <button
                                            type="button"
                                            onClick={() => setMobileIndustriesOpen((current) => !current)}
                                            className="w-full flex items-center justify-between transition-colors hover:text-[var(--accent-orange)]"
                                            style={{ color: industriesGroupActive ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: industriesGroupActive ? 600 : 500 }}
                                        >
                                            <span>{key.includes('.') ? t(key) : key}</span>
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${mobileIndustriesOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {mobileIndustriesOpen && (
                                            <div className="mt-2 flex flex-col gap-1 border-t pt-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                                {INDUSTRIES_DROPDOWN_ITEMS.map((item) => (
                                                    <AppLink
                                                        key={item.page}
                                                        page={item.page}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="py-2 pl-2 rounded-lg"
                                                        style={{ color: activePage === item.page ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: activePage === item.page ? 600 : 500 }}
                                                    >
                                                        {t(item.key)}
                                                    </AppLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            return (
                                <AppLink key={page}
                                    page={page}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-2 transition-colors hover:text-[var(--accent-orange)]"
                                    style={{ color: activePage === page ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: activePage === page ? 600 : 500 }}
                                >
                                    {key.includes('.') ? t(key) : key}
                                </AppLink>
                            )
                        })}
                        <button
                            onClick={() => go('contact')}
                            className="mt-4 px-5 py-3 rounded-lg"
                            style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '14px' }}
                        >
                            {t('header.requestDemo')}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}
