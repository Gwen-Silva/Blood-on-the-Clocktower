import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from 'react'
import { Language, Translations } from './types'
import en from './translations/en'
import es from './translations/es'
import ptBR from './translations/pt-BR'

const TRANSLATIONS: Record<Language, Translations> = { en, es, 'pt-BR': ptBR }

export type LanguageOption = {
  code: Language
  nativeName: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', nativeName: 'Português (Brasil)' },
  { code: 'en', nativeName: 'English' },
  { code: 'es', nativeName: 'Español' },
]

const VALID_CODES = new Set<string>(LANGUAGES.map((l) => l.code))

const STORAGE_KEY = 'grimoire_language'

function isValidLanguage(value: string): value is Language {
  return VALID_CODES.has(value)
}

function getInitialLanguage(): Language {
  // Check localStorage first
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    /* Keep this session usable with the default language. */
  }
  if (stored && isValidLanguage(stored)) {
    return stored
  }

  return 'pt-BR'
}

type I18nContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | null>(null)

type Props = {
  children: ReactNode
}

export function I18nProvider({ children }: Props) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* Keep this session usable. */
    }
  }, [])

  const t = useMemo(() => TRANSLATIONS[language], [language])

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function getLocale(language: Language): string {
  return language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR'
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Helper function to interpolate variables in strings
// Usage: interpolate("Hello {name}!", { name: "World" }) => "Hello World!"
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(vars[key] ?? `{${key}}`),
  )
}
