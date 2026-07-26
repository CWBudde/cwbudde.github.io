import { describe, expect, it } from 'vitest'

import { LOCALES, resolveLocale, translations } from '@/i18n/translations'

describe('resolveLocale', () => {
  it('matches an exact locale tag', () => {
    expect(resolveLocale(['pt-BR'])).toBe('pt-BR')
  })

  it('matches on the base language for regional variants', () => {
    expect(resolveLocale(['de-AT'])).toBe('de')
    expect(resolveLocale(['pt-PT'])).toBe('pt-BR')
  })

  it('is case insensitive', () => {
    expect(resolveLocale(['DE-de'])).toBe('de')
  })

  it('respects preference order and skips unsupported languages', () => {
    expect(resolveLocale(['fr', 'nl', 'de'])).toBe('de')
  })

  it('falls back to English when nothing matches', () => {
    expect(resolveLocale(['ja', 'ko'])).toBe('en')
    expect(resolveLocale([])).toBe('en')
  })
})

describe('translations', () => {
  it('covers every declared locale', () => {
    LOCALES.forEach((locale) => {
      expect(translations[locale]).toBeDefined()
    })
  })

  it('has no empty strings in any locale', () => {
    const emptyKeys: string[] = []

    const walk = (value: unknown, path: string) => {
      if (typeof value === 'string') {
        if (value.trim().length === 0) {
          emptyKeys.push(path)
        }
        return
      }

      Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
        walk(child, `${path}.${key}`)
      })
    }

    LOCALES.forEach((locale) => walk(translations[locale], locale))
    expect(emptyKeys).toEqual([])
  })

  it('keeps the same key shape across locales', () => {
    const shape = (value: unknown): unknown =>
      typeof value === 'string'
        ? 'string'
        : Object.fromEntries(
            Object.entries(value as Record<string, unknown>)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, child]) => [key, shape(child)]),
          )

    const reference = JSON.stringify(shape(translations.en))
    LOCALES.forEach((locale) => {
      expect(JSON.stringify(shape(translations[locale]))).toBe(reference)
    })
  })
})
