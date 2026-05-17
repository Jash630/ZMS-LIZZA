import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Languages,
  ChevronDown,
} from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { AppLink } from '../shared/AppLink.jsx'
import { LANGUAGES, useTranslation } from '../../i18n/index.js'
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_MAP_URL, SUPPORT_PHONE_DISPLAY, SUPPORT_TEL_URL, SUPPORT_WHATSAPP_URL } from '../../constants/contact.js'

const QUICK_LINKS = [
  { key: 'nav.home', page: 'home' },
  { key: 'nav.about', page: 'about' },
  { key: 'nav.products', page: 'products' },
  { key: 'nav.gallery', page: 'gallery' },
  { key: 'nav.services', page: 'services' },
]

const RESOURCE_LINKS = [
  { key: 'nav.blog', page: 'blog' },
  { key: 'nav.industries', page: 'industries' },
  { key: 'nav.applications', page: 'applications' },
  { key: 'nav.faq', page: 'faq' },
  { key: 'footer.contactUs', page: 'contact' },
]

const SOCIALS = [{ Icon: Facebook }, { Icon: Instagram }, { Icon: Linkedin }, { Icon: Youtube }]

export function Footer() {
  const { navigateTo } = useNavigation()
  const { lang, setLang, t } = useTranslation()

  return (
    <footer style={{ backgroundColor: 'var(--charcoal)' }}>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--gradient-red) 0%, var(--gradient-purple) 50%, var(--gradient-blue) 100%)' }} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              aria-label="Go to home"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <img
                src="/bgr_logo.png"
                alt="ZMS LIZZA"
                style={{ height: '64px', width: 'auto', maxWidth: '320px', objectFit: 'contain', marginBottom: '18px' }}
              />
            </button>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
              {t('footer.tagline')}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.7', marginBottom: '24px' }}>
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon }, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor = 'var(--accent-orange)'
                    event.currentTarget.style.color = 'var(--accent-orange)'
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    event.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ key, page }) => (
                <li key={key}>
                  <AppLink
                    page={page}
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.color = 'var(--accent-orange)'
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {key.includes('.') ? t(key) : key}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>{t('footer.resources')}</h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map(({ key, page }) => (
                <li key={key}>
                  <AppLink
                    page={page}
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.color = 'var(--accent-orange)'
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {key.includes('.') ? t(key) : key}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>{t('footer.contactUs')}</h4>
            <ul className="space-y-4">
              {[
                { Icon: MapPin, text: COMPANY_ADDRESS, href: COMPANY_MAP_URL, iconColor: 'var(--accent-orange)' },
                { Icon: Phone, text: SUPPORT_PHONE_DISPLAY, href: SUPPORT_TEL_URL, iconColor: 'var(--accent-orange)' },
                { Icon: Mail, text: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}`, iconColor: 'var(--accent-orange)' },
                { Icon: MessageCircle, text: t('footer.whatsAppUs'), href: SUPPORT_WHATSAPP_URL, iconColor: 'var(--whatsapp-green)' },
                { Icon: Clock, text: t('footer.businessHours'), href: null, iconColor: 'var(--accent-orange)' },
              ].map(({ Icon, text, href, iconColor }, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon size={18} style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }} />
                  {href ? (
                    <a
                      href={href}
                      style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color = iconColor
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color = 'rgba(255,255,255,0.7)'
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
            <div className="mt-6">
              <label style={{ color: 'rgba(255,255,255,0.82)', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                {t('lang.title')}
              </label>
              <div
                className="relative rounded-xl p-[1px]"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.55), rgba(255,107,53,0.5))' }}
              >
                <div className="relative rounded-[11px]" style={{ backgroundColor: 'rgba(15,23,42,0.68)' }}>
                  <Languages size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.82)' }} />
                  <select
                    value={lang}
                    onChange={(event) => setLang(event.target.value)}
                    className="w-full appearance-none pl-9 pr-9 py-2 rounded-[11px] border border-transparent"
                    style={{ backgroundColor: 'transparent', color: 'white', fontSize: '13px', fontWeight: 700 }}
                  >
                    {LANGUAGES.map((item) => (
                      <option key={item.code} value={item.code} style={{ color: '#111827' }}>
                        {item.flag} {item.nativeName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.8)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            {t('footer.footerLine')}
          </p>
          <div className="flex gap-6">
            {[t('footer.privacyPolicy'), t('footer.terms')].map((link) => (
              <a
                key={link}
                href="#"
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = 'var(--accent-orange)'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = 'rgba(255,255,255,0.6)'
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
