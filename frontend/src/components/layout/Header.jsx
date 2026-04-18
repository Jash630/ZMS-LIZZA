import { useState, useEffect } from 'react'
import { Menu, X, MessageCircle, Languages, ChevronDown } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { LANGUAGES, useTranslation } from '../../i18n/index.js'
import { SUPPORT_WHATSAPP_URL } from '../../constants/contact.js'

const NAV_ITEMS = [
    { key: 'nav.home', page: 'home' },
    { key: 'nav.about', page: 'about' },
    { key: 'nav.products', page: 'products' },
    { key: 'nav.gallery', page: 'gallery' },
    { key: 'nav.services', page: 'services' },
    { key: 'nav.blog', page: 'blog' },
    { key: 'nav.contact', page: 'contact' },
]

export function Header() {
    const { currentPage, navigateTo } = useNavigation()
    const { lang, setLang, t } = useTranslation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const activePage = currentPage === 'blog-detail' ? 'blog' : currentPage === 'product-detail' ? 'products' : currentPage

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
                        className="h-8 sm:h-10 w-auto max-w-[170px] sm:max-w-[240px] object-contain"
                    />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {NAV_ITEMS.map(({ key, page }) => (

                        <a key={page}
                            href="#"
                            onClick={(e) => { e.preventDefault(); go(page) }}
                            className="text-[15px] transition-colors hover:text-[var(--accent-orange)] cursor-pointer"
                            style={{
                                color: activePage === page ? 'var(--accent-orange)' : isScrolled ? 'var(--dark-gray)' : 'var(--charcoal)',
                                fontWeight: activePage === page ? 600 : 500,
                            }}
                        >
                            {t(key)}
                        </a>
                    ))}
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
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '15px' }}
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

                        {NAV_ITEMS.map(({ key, page }) => (

                            <a key={page}
                                href="#"
                                onClick={(e) => { e.preventDefault(); go(page) }}
                                className="py-2 transition-colors hover:text-[var(--accent-orange)]"
                                style={{ color: activePage === page ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: activePage === page ? 600 : 500 }}
                            >
                                {t(key)}
                            </a>
                        ))}
                        <button
                            onClick={() => go('contact')}
                            className="mt-4 px-6 py-3 rounded-lg"
                            style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600 }}
                        >
                            {t('header.requestDemo')}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}
