import { useEffect, useState } from 'react'
import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { ChevronRight, Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle, Loader, Plus, Minus, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { publicService } from '../services/publicService.js'

const FAQS = [
  { q: 'How quickly can you respond to inquiries?',     a: 'We typically respond within 2-4 hours during business hours (Monday–Saturday, 10 AM – 6 PM). For urgent matters, WhatsApp us for immediate assistance.' },
  { q: 'Can I visit without an appointment?',           a: 'Yes, walk-ins are welcome! However, booking an appointment ensures personalized attention and a dedicated machine demonstration.' },
  { q: 'Do you provide quotes over phone/email?',       a: 'Yes, we can provide preliminary quotes over phone or email. For the most accurate pricing, a showroom visit or detailed discussion is recommended.' },
  { q: 'Is installation and training included?',        a: 'Yes! Every machine purchase includes complete on-site installation (1-2 days) and comprehensive 2-day operator training. A 2-year warranty is also included.' },
  { q: 'What EMI options are available?',               a: 'We offer flexible EMI plans from 6 to 24 months through leading banks. Interest rates start from 0.99% per month. We also assist with government subsidy schemes.' },
]

export function ContactPage() {
  const { navigateTo } = useNavigation()
  const [openFAQ, setOpenFAQ]           = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess]       = useState(false)
  const [submitError, setSubmitError]   = useState('')
  const [siteSettings, setSiteSettings] = useState(null)
  const [errors, setErrors]             = useState({})
  const [form, setForm] = useState({ fullName: '', businessName: '', phone: '+91 ', email: '', city: '', machineInterest: '', helpType: '', message: '' })

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
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.phone || form.phone === '+91 ') errs.phone = 'Phone is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.helpType) errs.helpType = 'Please select how we can help'
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
      setSubmitError(err?.message || 'Failed to submit enquiry. Please try again.')
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
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>Contact</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Get in Touch</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>Have questions? Need a quote? Want to schedule a demo? We're here to help.</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-100">
              <h2 className="mb-2">Send Us a Message</h2>
              <p className="mb-8" style={{ fontSize: '15px', color: 'var(--dark-gray)' }}>We respond within 2-4 hours during business hours</p>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Full Name <span style={{ color: 'var(--gradient-red)' }}>*</span></label>
                  <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Your full name" className={baseInput} style={inputStyle('fullName')} />
                  {errors.fullName && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Business Name</label>
                  <input name="businessName" value={form.businessName} onChange={onChange} placeholder="Your company name" className={baseInput} style={{ fontSize: '15px' }} />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Phone <span style={{ color: 'var(--gradient-red)' }}>*</span></label>
                    <input name="phone" value={form.phone} onChange={onChange} placeholder="+91 98765 43210" className={baseInput} style={inputStyle('phone')} />
                    {errors.phone && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Email</label>
                    <input name="email" value={form.email} onChange={onChange} type="email" placeholder="email@example.com" className={baseInput} style={{ fontSize: '15px' }} />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>City <span style={{ color: 'var(--gradient-red)' }}>*</span></label>
                  <input name="city" value={form.city} onChange={onChange} placeholder="e.g., Surat, Gujarat" className={baseInput} style={inputStyle('city')} />
                  {errors.city && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.city}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Machine Interest</label>
                  <select name="machineInterest" value={form.machineInterest} onChange={onChange} className={baseInput} style={{ fontSize: '15px' }}>
                    <option value="">Select Machine Type</option>
                    <option value="high-speed">High-Speed Embroidery</option>
                    <option value="sequins">Sequins Machines</option>
                    <option value="beads">Beads Machines</option>
                    <option value="coding">Coding Machines</option>
                    <option value="multi-function">Multi-Function Machines</option>
                    <option value="guidance">Not Sure / Need Guidance</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>How can we help? <span style={{ color: 'var(--gradient-red)' }}>*</span></label>
                  <select name="helpType" value={form.helpType} onChange={onChange} className={baseInput} style={inputStyle('helpType')}>
                    <option value="">Select an option</option>
                    <option value="quote">Request a Quote</option>
                    <option value="demo">Schedule a Demo</option>
                    <option value="support">Technical Support</option>
                    <option value="service">Service Request</option>
                    <option value="inquiry">General Inquiry</option>
                    <option value="emi">EMI/Financing</option>
                  </select>
                  {errors.helpType && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.helpType}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Message</label>
                  <textarea name="message" value={form.message} onChange={onChange} rows={4} placeholder="Tell us more about your requirements..." className={baseInput + " resize-none"} style={{ fontSize: '15px' }} />
                </div>
                <button type="submit" disabled={isSubmitting || isSuccess}
                  className="w-full py-4 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70"
                  style={{ backgroundColor: isSuccess ? '#10B981' : 'var(--accent-orange)', color: 'white', height: '56px' }}>
                  {isSubmitting ? <><Loader size={20} className="animate-spin" /> Submitting...</>
                   : isSuccess   ? <><CheckCircle size={20} /> Sent Successfully!</>
                   :               <><Send size={20} /> Submit Inquiry</>}
                </button>
                {submitError && <p style={{ color: '#EF4444', fontSize: 13 }}>{submitError}</p>}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              {[
                { Icon: Phone,         label: 'Call Us',   value: siteSettings?.general?.phone || '+91 98765 43210',          sub: 'Mon-Sat, 10 AM - 6 PM',           href: `tel:${(siteSettings?.general?.phone || '+919876543210').replace(/\s+/g, '')}`, ic: 'var(--accent-orange)', bg: 'rgba(46,94,170,0.05)'  },
                { Icon: MessageCircle, label: 'WhatsApp',  value: siteSettings?.general?.whatsapp || '+91 98765 43210',       sub: 'Quick response guaranteed',       href: `https://wa.me/${(siteSettings?.general?.whatsapp || '+919876543210').replace(/\D/g, '')}`, ic: '#25D366',              bg: 'rgba(37,211,102,0.05)' },
                { Icon: Mail,          label: 'Email',     value: siteSettings?.general?.email || 'info@zmslizza.com',        sub: "We'll respond within 24 hours",   href: `mailto:${siteSettings?.general?.email || 'info@zmslizza.com'}`, ic: 'var(--accent-orange)', bg: 'rgba(245,247,250,1)'  },
                { Icon: MapPin,        label: 'Showroom',  value: siteSettings?.general?.address || 'Ring Road, Surat 395002',sub: 'Schedule a visit to see machines',href: 'https://maps.google.com/?q=Surat', ic: 'var(--accent-orange)', bg: 'white' },
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
                    <p className="font-bold mb-2" style={{ color: 'var(--charcoal)', fontSize: '16px' }}>Business Hours</p>
                    <p style={{ color: 'var(--dark-gray)', fontSize: '14px' }}><strong>Monday – Saturday:</strong> 10:00 AM – 6:00 PM</p>
                    <p style={{ color: 'var(--dark-gray)', fontSize: '14px' }}><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="font-bold mb-4" style={{ color: 'var(--charcoal)', fontSize: '16px' }}>Follow Us</p>
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
          <h2 className="text-center mb-8">Find Us on the Map</h2>
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
            <h2 className="mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
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
