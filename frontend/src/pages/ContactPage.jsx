import { useEffect, useState } from 'react'
import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { ChevronRight, Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle, Loader, Plus, Minus, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { publicService } from '../services/publicService.js'
import { useTranslation } from '../i18n/index.js'
import { SUPPORT_PHONE_DISPLAY, buildTelUrl, buildWhatsAppUrl } from '../constants/contact.js'

export function ContactPage() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const [openFAQ, setOpenFAQ]           = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess]       = useState(false)
  const [submitError, setSubmitError]   = useState('')
  const [siteSettings, setSiteSettings] = useState(null)
  const [errors, setErrors]             = useState({})
  const [form, setForm] = useState({ fullName: '', businessName: '', phone: '+91 ', email: '', city: '', machineInterest: '', helpType: '', message: '' })
  const faqs = Array.isArray(t('contact.faqs', [])) ? t('contact.faqs', []) : []

  useEffect(() => {
    let active = true
    publicService.getSettings()
      .then((settings) => {
        if (!active) return
        setSiteSettings(settings)
      })
      .catch(() => {
        if (!active) return
        setSiteSettings(null)
      })
    return () => { active = false }
  }, [])

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (submitError) setSubmitError('')
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    const emailValue = String(form.email || '').trim()
    if (!form.fullName.trim()) errs.fullName = t('contact.validation.fullName')
    if (!form.phone || form.phone === '+91 ') errs.phone = t('contact.validation.phone')
    if (!emailValue) errs.email = t('contact.validation.email')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) errs.email = t('contact.validation.emailFormat')
    if (!form.city.trim()) errs.city = t('contact.validation.city')
    if (!form.helpType) errs.helpType = t('contact.validation.helpType')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setIsSubmitting(true)
      setSubmitError('')
      await publicService.submitLead(form)
      setIsSubmitting(false)
      setIsSuccess(true)
      setForm({ fullName: '', businessName: '', phone: '+91 ', email: '', city: '', machineInterest: '', helpType: '', message: '' })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err) {
      setIsSubmitting(false)
      setSubmitError(err?.message || t('contact.submitError'))
    }
  }

  const inputStyle = (field) => ({ fontSize: '15px', borderColor: errors[field] ? '#EF4444' : undefined })
  const baseInput  = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--accent-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)] focus:ring-opacity-20 transition-all"

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-12 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3.25rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>{t('common.home')}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('contact.breadcrumb')}</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">{t('contact.title')}</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-100">
              <h2 className="mb-2">{t('contact.formTitle')}</h2>
              <p className="mb-8" style={{ fontSize: '15px', color: 'var(--dark-gray)' }}>{t('contact.formSubtitle')}</p>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.fullName')} <span style={{ color: 'var(--gradient-red)' }}>{t('common.required')}</span></label>
                  <input name="fullName" value={form.fullName} onChange={onChange} placeholder={t('contact.placeholders.fullName')} className={baseInput} style={inputStyle('fullName')} />
                  {errors.fullName && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.businessName')}</label>
                  <input name="businessName" value={form.businessName} onChange={onChange} placeholder={t('contact.placeholders.businessName')} className={baseInput} style={{ fontSize: '15px' }} />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.phone')} <span style={{ color: 'var(--gradient-red)' }}>{t('common.required')}</span></label>
                    <input name="phone" value={form.phone} onChange={onChange} placeholder={t('contact.placeholders.phone')} className={baseInput} style={inputStyle('phone')} />
                    {errors.phone && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.email')} <span style={{ color: 'var(--gradient-red)' }}>{t('common.required')}</span></label>
                    <input name="email" value={form.email} onChange={onChange} type="email" placeholder={t('contact.placeholders.email')} className={baseInput} style={inputStyle('email')} />
                    {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.city')} <span style={{ color: 'var(--gradient-red)' }}>{t('common.required')}</span></label>
                  <input name="city" value={form.city} onChange={onChange} placeholder={t('contact.placeholders.city')} className={baseInput} style={inputStyle('city')} />
                  {errors.city && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.city}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.machineInterest')}</label>
                  <select name="machineInterest" value={form.machineInterest} onChange={onChange} className={baseInput} style={{ fontSize: '15px' }}>
                    <option value="">{t('contact.machineOptions.select')}</option>
                    <option value="high-speed">{t('contact.machineOptions.highSpeed')}</option>
                    <option value="sequins">{t('contact.machineOptions.sequins')}</option>
                    <option value="beads">{t('contact.machineOptions.beads')}</option>
                    <option value="coding">{t('contact.machineOptions.coding')}</option>
                    <option value="multi-function">{t('contact.machineOptions.multiFunction')}</option>
                    <option value="guidance">{t('contact.machineOptions.guidance')}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.howCanWeHelp')} <span style={{ color: 'var(--gradient-red)' }}>{t('common.required')}</span></label>
                  <select name="helpType" value={form.helpType} onChange={onChange} className={baseInput} style={inputStyle('helpType')}>
                    <option value="">{t('contact.helpOptions.select')}</option>
                    <option value="quote">{t('contact.helpOptions.quote')}</option>
                    <option value="demo">{t('contact.helpOptions.demo')}</option>
                    <option value="support">{t('contact.helpOptions.support')}</option>
                    <option value="service">{t('contact.helpOptions.service')}</option>
                    <option value="inquiry">{t('contact.helpOptions.inquiry')}</option>
                    <option value="emi">{t('contact.helpOptions.emi')}</option>
                  </select>
                  {errors.helpType && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.helpType}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{t('contact.message')}</label>
                  <textarea name="message" value={form.message} onChange={onChange} rows={4} placeholder={t('contact.placeholders.message')} className={baseInput + " resize-none"} style={{ fontSize: '15px' }} />
                </div>
                <button type="submit" disabled={isSubmitting || isSuccess}
                  className="w-full py-4 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70"
                  style={{ backgroundColor: isSuccess ? '#10B981' : 'var(--accent-orange)', color: 'white', height: '56px' }}>
                  {isSubmitting ? <><Loader size={20} className="animate-spin" /> {t('contact.submitting')}</>
                   : isSuccess   ? <><CheckCircle size={20} /> {t('contact.success')}</>
                   :               <><Send size={20} /> {t('contact.submitBtn')}</>}
                </button>
                {submitError && <p style={{ color: '#EF4444', fontSize: 13 }}>{submitError}</p>}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              {[
                { Icon: Phone,         label: t('contact.callUs'),   value: siteSettings?.general?.phone || SUPPORT_PHONE_DISPLAY,          sub: t('footer.businessHours'),           href: buildTelUrl(siteSettings?.general?.phone || SUPPORT_PHONE_DISPLAY), ic: 'var(--accent-orange)', bg: 'rgba(46,94,170,0.05)'  },
                { Icon: MessageCircle, label: t('contact.whatsApp'),  value: siteSettings?.general?.whatsapp || SUPPORT_PHONE_DISPLAY,       sub: t('contact.quickResponse'),       href: buildWhatsAppUrl(siteSettings?.general?.whatsapp || SUPPORT_PHONE_DISPLAY), ic: '#25D366',              bg: 'rgba(37,211,102,0.05)' },
                { Icon: Mail,          label: t('contact.emailLabel'),     value: siteSettings?.general?.email || 'info@zmslizza.com',        sub: t('contact.emailResponse'),   href: `mailto:${siteSettings?.general?.email || 'info@zmslizza.com'}`, ic: 'var(--accent-orange)', bg: 'rgba(245,247,250,1)'  },
                { Icon: MapPin,        label: t('contact.showroom'),  value: siteSettings?.general?.address || 'Ring Road, Surat 395002',sub: t('contact.scheduleVisit'),href: 'https://maps.google.com/?q=Surat', ic: 'var(--accent-orange)', bg: 'white' },
              ].map(({ Icon, label, value, sub, href, ic, bg }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="block rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: bg }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ic }}>
                      <Icon size={24} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--dark-gray)' }}>{label}</p>
                      <p className="font-bold mb-1" style={{ color: 'var(--charcoal)', fontSize: '17px', lineHeight: '1.4' }}>{value}</p>
                      <p style={{ fontSize: '13px', color: 'var(--dark-gray)' }}>{sub}</p>
                    </div>
                  </div>
                </a>
              ))}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,107,53,0.08)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-orange)' }}>
                    <Clock size={24} color="white" />
                  </div>
                  <div>
                    <p className="font-bold mb-2" style={{ color: 'var(--charcoal)', fontSize: '16px' }}>{t('contact.businessHours')}</p>
                    <p style={{ color: 'var(--dark-gray)', fontSize: '14px' }}><strong>{t('contact.monSat')}</strong> {t('contact.monSatTime')}</p>
                    <p style={{ color: 'var(--dark-gray)', fontSize: '14px' }}><strong>{t('contact.sunday')}</strong> {t('contact.sundayClosed')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="font-bold mb-4" style={{ color: 'var(--charcoal)', fontSize: '16px' }}>{t('contact.followUs')}</p>
                <div className="flex gap-3">
                  {[[Facebook,'#1877F2'],[Instagram,'#E4405F'],[Linkedin,'#0A66C2'],[Youtube,'#FF0000']].map(([Icon, color], i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: color }}>
                      <Icon size={20} color="white" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-center mb-8">{t('contact.mapTitle')}</h2>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41710393128!2d72.73762887910156!3d21.159431400000012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sus!4v1647890123456!5m2!1sen!2sus"
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" title="ZMS LIZZA Location" />
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">{t('contact.faqTitle')}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                  <span style={{ fontSize: '16px', fontWeight: 600, color: openFAQ === i ? 'var(--accent-orange)' : 'var(--charcoal)', lineHeight: '1.5' }}>{faq.q}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center ml-4 flex-shrink-0" style={{ backgroundColor: openFAQ === i ? 'var(--accent-orange)' : 'var(--light-gray)' }}>
                    {openFAQ === i ? <Minus size={18} color="white" /> : <Plus size={18} style={{ color: 'var(--dark-gray)' }} />}
                  </div>
                </button>
                {openFAQ === i && <div className="px-6 pb-5" style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.7' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
