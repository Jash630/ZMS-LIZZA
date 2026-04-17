import { useEffect, useState } from 'react'
import { useTranslation } from './index.js'
import { translateDeepRuntime } from './runtimeTranslate.js'

export function useRuntimeTranslatedValue(value) {
  const { lang } = useTranslation()
  const [translatedValue, setTranslatedValue] = useState(value)

  useEffect(() => {
    setTranslatedValue(value)

    if (!value || lang === 'en') return

    let active = true

    const run = async () => {
      const translated = await translateDeepRuntime(value, lang)
      if (!active) return
      setTranslatedValue(translated)
    }

    run()
    return () => {
      active = false
    }
  }, [value, lang])

  return translatedValue
}
