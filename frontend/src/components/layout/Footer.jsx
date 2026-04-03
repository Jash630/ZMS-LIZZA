import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

const QUICK_LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'About Us', page: 'about' },
  { label: 'Products', page: 'products' },
  { label: 'Gallery', page: 'gallery' },
  { label: 'Services', page: 'services' },
]

const RESOURCE_LINKS = [
  { label: 'Blog', page: 'blog' },
  { label: 'Contact Us', page: 'contact' },
  { label: 'Request Demo', page: 'contact' },
]

const SOCIALS = [{ Icon: Facebook }, { Icon: Instagram }, { Icon: Linkedin }, { Icon: Youtube }]

export function Footer() {
  const { navigateTo } = useNavigation()

  return (
    <footer style={{ backgroundColor: 'var(--charcoal)' }}>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--gradient-red) 0%, var(--gradient-purple) 50%, var(--gradient-blue) 100%)' }} />

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src="/bgr_logo.png"
              alt="ZMS LIZZA"
              style={{ height: '58px', width: 'auto', maxWidth: '320px', objectFit: 'contain', marginBottom: '16px' }}
            />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
              European Technology for Indian Excellence
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.7', marginBottom: '24px' }}>
              Leading manufacturer of high-performance embroidery machines, serving textile factories across India.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon }, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-orange)'
                    e.currentTarget.style.color = 'var(--accent-orange)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, page }) => (
                <li key={label}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      navigateTo(page)
                    }}
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent-orange)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>Resources</h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map(({ label, page }) => (
                <li key={label}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      navigateTo(page)
                    }}
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent-orange)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>Contact Us</h4>
            <ul className="space-y-4">
              {[
                { Icon: MapPin, text: 'Surat, Gujarat, India', href: null, iconColor: 'var(--accent-orange)' },
                { Icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210', iconColor: 'var(--accent-orange)' },
                { Icon: Mail, text: 'info@zmslizza.com', href: 'mailto:info@zmslizza.com', iconColor: 'var(--accent-orange)' },
                { Icon: MessageCircle, text: 'WhatsApp Us', href: 'https://wa.me/919876543210', iconColor: 'var(--whatsapp-green)' },
                { Icon: Clock, text: 'Mon-Sat, 10 AM - 6 PM', href: null, iconColor: 'var(--accent-orange)' },
              ].map(({ Icon, text, href, iconColor }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon size={18} style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }} />
                  {href ? (
                    <a
                      href={href}
                      style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = iconColor
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                      }}
                    >
                      {text}
                    </a>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            © 2026 LIZZA INDIA PVT. LTD. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms & Conditions'].map((link) => (
              <a
                key={link}
                href="#"
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-orange)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
