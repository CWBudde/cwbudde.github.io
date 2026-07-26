export const LOCALES = ['en', 'de', 'pt-BR'] as const

export type Locale = (typeof LOCALES)[number]

export const FALLBACK_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  'pt-BR': 'Português',
}

/**
 * English is the source of truth: every other locale is typed against it, so a
 * missing or misspelled key fails the build rather than silently rendering the
 * key name. Repository names and descriptions are never translated — they come
 * straight from GitHub.
 */
const en = {
  header: {
    eyebrow: 'Portfolio',
    tagline: 'Public projects, experiments, and deployable demos from GitHub.',
    githubProfile: 'GitHub profile',
  },
  stats: {
    eyebrow: 'The archive',
    repositories: 'Repositories',
    original: 'Original',
    forks: 'Forks',
    languages: 'Languages',
    stars: 'Stars',
    span: 'Span',
  },
  featured: {
    eyebrow: 'Live demos',
    title: 'Recent repositories with live demos',
    empty: 'No repository has shipped a live demo in the last six months.',
  },
  activity: {
    eyebrow: 'Activity',
    title: 'Every repository, plotted as one signal',
    description:
      'One impulse per repository, scaled by the stars it earned. Point at the trace to read a repository out.',
    axisY: 'Y: stars, log scale',
    axisX: 'X: creation order',
    axisXFallback: 'X: order of last update',
    hint: 'Point at the trace to measure',
    canvasLabel:
      'Waveform of every public repository, with height by star count.',
    stars: 'Stars',
    language: 'Language',
    created: 'Created',
    updated: 'Updated',
    fork: 'fork',
  },
  grid: {
    eyebrow: 'Repository index',
    title: 'All repositories',
    searchPlaceholder: 'Search repositories',
    searchLabel: 'Search repositories',
    languageLabel: 'Filter by language',
    allLanguages: 'All languages',
    sortLabel: 'Sort order',
    empty: 'No repositories match the current filters.',
    sort: {
      'stars-desc': 'Most stars',
      'stars-asc': 'Fewest stars',
      'updated-desc': 'Recently updated',
      'updated-asc': 'Least recently updated',
      'name-asc': 'Name (A–Z)',
      'name-desc': 'Name (Z–A)',
    },
  },
  card: {
    noDescription: 'No description provided.',
    liveDemo: 'Live demo',
    fork: 'Forked repository',
  },
  errors: {
    retry: 'Try again',
  },
  footer: {
    note: 'Live demo links point to verified GitHub Pages deployments or configured homepage URLs.',
  },
  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  language: {
    label: 'Language',
  },
  unknownLanguage: 'Unknown',
} as const

export type Translation = {
  readonly [K in keyof typeof en]: (typeof en)[K] extends string
    ? string
    : { readonly [P in keyof (typeof en)[K]]: (typeof en)[K][P] extends string ? string : Record<string, string> }
}

const de: Translation = {
  header: {
    eyebrow: 'Portfolio',
    tagline: 'Öffentliche Projekte, Experimente und lauffähige Demos von GitHub.',
    githubProfile: 'GitHub-Profil',
  },
  stats: {
    eyebrow: 'Das Archiv',
    repositories: 'Repositories',
    original: 'Eigene',
    forks: 'Forks',
    languages: 'Sprachen',
    stars: 'Sterne',
    span: 'Zeitraum',
  },
  featured: {
    eyebrow: 'Live-Demos',
    title: 'Aktuelle Repositories mit Live-Demo',
    empty: 'In den letzten sechs Monaten ist keine Live-Demo dazugekommen.',
  },
  activity: {
    eyebrow: 'Aktivität',
    title: 'Alle Repositories als ein Signal',
    description:
      'Ein Impuls je Repository, skaliert nach der Anzahl der Sterne. Zeige auf die Kurve, um ein Repository abzulesen.',
    axisY: 'Y: Sterne, logarithmisch',
    axisX: 'X: Reihenfolge der Erstellung',
    axisXFallback: 'X: Reihenfolge der letzten Änderung',
    hint: 'Zeige auf die Kurve, um zu messen',
    canvasLabel:
      'Kurve aller öffentlichen Repositories, mit der Höhe nach Anzahl der Sterne.',
    stars: 'Sterne',
    language: 'Sprache',
    created: 'Erstellt',
    updated: 'Aktualisiert',
    fork: 'Fork',
  },
  grid: {
    eyebrow: 'Repository-Verzeichnis',
    title: 'Alle Repositories',
    searchPlaceholder: 'Repositories durchsuchen',
    searchLabel: 'Repositories durchsuchen',
    languageLabel: 'Nach Sprache filtern',
    allLanguages: 'Alle Sprachen',
    sortLabel: 'Sortierung',
    empty: 'Keine Repositories passen zu den aktuellen Filtern.',
    sort: {
      'stars-desc': 'Meiste Sterne',
      'stars-asc': 'Wenigste Sterne',
      'updated-desc': 'Zuletzt aktualisiert',
      'updated-asc': 'Am längsten unverändert',
      'name-asc': 'Name (A–Z)',
      'name-desc': 'Name (Z–A)',
    },
  },
  card: {
    noDescription: 'Keine Beschreibung hinterlegt.',
    liveDemo: 'Live-Demo',
    fork: 'Geforktes Repository',
  },
  errors: {
    retry: 'Erneut versuchen',
  },
  footer: {
    note: 'Live-Demo-Links verweisen auf geprüfte GitHub-Pages-Deployments oder hinterlegte Homepage-URLs.',
  },
  theme: {
    label: 'Darstellung',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
  },
  language: {
    label: 'Sprache',
  },
  unknownLanguage: 'Unbekannt',
}

const ptBR: Translation = {
  header: {
    eyebrow: 'Portfólio',
    tagline: 'Projetos públicos, experimentos e demos executáveis do GitHub.',
    githubProfile: 'Perfil no GitHub',
  },
  stats: {
    eyebrow: 'O acervo',
    repositories: 'Repositórios',
    original: 'Próprios',
    forks: 'Forks',
    languages: 'Linguagens',
    stars: 'Estrelas',
    span: 'Período',
  },
  featured: {
    eyebrow: 'Demos ao vivo',
    title: 'Repositórios recentes com demo ao vivo',
    empty: 'Nenhum repositório publicou uma demo ao vivo nos últimos seis meses.',
  },
  activity: {
    eyebrow: 'Atividade',
    title: 'Todos os repositórios como um sinal',
    description:
      'Um impulso por repositório, dimensionado pelas estrelas que recebeu. Aponte para o traço para ler um repositório.',
    axisY: 'Y: estrelas, escala log',
    axisX: 'X: ordem de criação',
    axisXFallback: 'X: ordem da última atualização',
    hint: 'Aponte para o traço para medir',
    canvasLabel:
      'Forma de onda de todos os repositórios públicos, com altura pelo número de estrelas.',
    stars: 'Estrelas',
    language: 'Linguagem',
    created: 'Criado em',
    updated: 'Atualizado em',
    fork: 'fork',
  },
  grid: {
    eyebrow: 'Índice de repositórios',
    title: 'Todos os repositórios',
    searchPlaceholder: 'Buscar repositórios',
    searchLabel: 'Buscar repositórios',
    languageLabel: 'Filtrar por linguagem',
    allLanguages: 'Todas as linguagens',
    sortLabel: 'Ordenação',
    empty: 'Nenhum repositório corresponde aos filtros atuais.',
    sort: {
      'stars-desc': 'Mais estrelas',
      'stars-asc': 'Menos estrelas',
      'updated-desc': 'Atualizados recentemente',
      'updated-asc': 'Sem atualização há mais tempo',
      'name-asc': 'Nome (A–Z)',
      'name-desc': 'Nome (Z–A)',
    },
  },
  card: {
    noDescription: 'Sem descrição.',
    liveDemo: 'Demo ao vivo',
    fork: 'Repositório bifurcado',
  },
  errors: {
    retry: 'Tentar de novo',
  },
  footer: {
    note: 'Os links de demo apontam para deploys verificados do GitHub Pages ou para URLs de homepage configuradas.',
  },
  theme: {
    label: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
    system: 'Sistema',
  },
  language: {
    label: 'Idioma',
  },
  unknownLanguage: 'Desconhecida',
}

export const translations: Record<Locale, Translation> = {
  en,
  de,
  'pt-BR': ptBR,
}

/**
 * Picks the best supported locale for a list of browser preferences,
 * matching on the base language so `de-AT` and `pt-PT` still find a home.
 */
export function resolveLocale(preferred: readonly string[]): Locale {
  for (const candidate of preferred) {
    const exact = LOCALES.find((locale) => locale.toLowerCase() === candidate.toLowerCase())
    if (exact) {
      return exact
    }

    const base = candidate.split('-')[0].toLowerCase()
    const byBase = LOCALES.find((locale) => locale.split('-')[0].toLowerCase() === base)
    if (byBase) {
      return byBase
    }
  }

  return FALLBACK_LOCALE
}
