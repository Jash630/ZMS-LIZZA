import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en } from './translations/en.js'
import { hi } from './translations/hi.js'
import { gu } from './translations/gu.js'

const TRANSLATIONS = { en, hi, gu }
const STORAGE_KEY = 'zms-lizza-lang'
const DEFAULT_LANG = 'en'

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'EN', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'HI', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: 'GU', dir: 'ltr' },
]

const LanguageContext = createContext(null)

const resolve = (obj, path) => {
  if (!obj || !path) return undefined
  const keys = path.split('.')
  let node = obj
  for (let i = 0; i < keys.length; i++) {
    if (node == null) return undefined
    node = node[keys[i]]
  }
  return node
}

const normalizeBrowserLang = (input) => {
  const code = String(input || '').toLowerCase().split('-')[0]
  return TRANSLATIONS[code] ? code : null
}

const resolveInitialLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && TRANSLATIONS[stored]) return stored
  } catch {
    // ignore storage access errors and continue to browser detection
  }

  try {
    const browserCandidates = Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]

    for (const candidate of browserCandidates) {
      const normalized = normalizeBrowserLang(candidate)
      if (normalized) return normalized
    }
  } catch {
    // ignore browser API errors and fallback to default
  }

  return DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLangRaw] = useState(resolveInitialLanguage)

  const setLang = useCallback((code) => {
    if (!TRANSLATIONS[code]) return
    setLangRaw(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch { /* noop */ }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key, fallback) => {
    const val = resolve(TRANSLATIONS[lang], key)
    if (val !== undefined) return val
    const enVal = resolve(TRANSLATIONS.en, key)
    return enVal !== undefined ? enVal : (fallback ?? key)
  }, [lang])

  const ctx = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={ctx}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
