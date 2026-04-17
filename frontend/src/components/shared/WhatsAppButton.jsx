import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from '../../i18n/index.js'

export function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(false)
    const { t } = useTranslation()

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
            {showTooltip && (
                <div className="absolute bottom-20 right-0 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap hidden md:block"
                    style={{ backgroundColor: 'var(--charcoal)', color: 'white', fontSize: '14px', fontWeight: 500 }}
                >
                    {t('whatsapp.tooltip')}
                    <div className="absolute -bottom-1 right-6 w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--charcoal)' }} />
                </div>
            )}

            <a href="https://wa.me/919876543210?text=Hello! I am interested in ZMS LIZZA embroidery machines."
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Chat on WhatsApp"
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: 'var(--whatsapp-green)', animation: 'pulse-scale 2s ease-in-out infinite' }}
            >
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--whatsapp-green)', animation: 'pulse-ring 2s ease-out infinite' }} />
                <MessageCircle size={28} color="white" strokeWidth={2} className="relative z-10" />
            </a>
        </div>
    )
}