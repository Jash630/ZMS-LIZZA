import { useState, useEffect } from 'react'
import { Menu, X, MessageCircle } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

const NAV_ITEMS = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Products', page: 'products' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Services', page: 'services' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact', page: 'contact' },
]

export function Header() {
    const { currentPage, navigateTo } = useNavigation()
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
                    {NAV_ITEMS.map(({ label, page }) => (

                        <a key={page}
                            href="#"
                            onClick={(e) => { e.preventDefault(); go(page) }}
                            className="text-[15px] transition-colors hover:text-[var(--accent-orange)] cursor-pointer"
                            style={{
                                color: activePage === page ? 'var(--accent-orange)' : isScrolled ? 'var(--dark-gray)' : 'var(--charcoal)',
                                fontWeight: activePage === page ? 600 : 500,
                            }}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => go('contact')}
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '15px' }}
                    >
                        Request Demo
                    </button>

                    <a href="https://wa.me/919876543210"
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
                        {NAV_ITEMS.map(({ label, page }) => (

                            <a key={page}
                                href="#"
                                onClick={(e) => { e.preventDefault(); go(page) }}
                                className="py-2 transition-colors hover:text-[var(--accent-orange)]"
                                style={{ color: activePage === page ? 'var(--accent-orange)' : 'var(--dark-gray)', fontWeight: activePage === page ? 600 : 500 }}
                            >
                                {label}
                            </a>
                        ))}
                        <button
                            onClick={() => go('contact')}
                            className="mt-4 px-6 py-3 rounded-lg"
                            style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600 }}
                        >
                            Request Demo
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}
