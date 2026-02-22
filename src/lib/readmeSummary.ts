const readmeSummaryCache = new Map<string, string | null>()
const readmeSummaryInflight = new Map<string, Promise<string | null>>()

function isSkippableBadgeLine(line: string): boolean {
  return /^!?\[.*\]\(.*\)$/.test(line.trim()) || /^\[!\[.*\]\(.*\)\]\(.*\)$/.test(line.trim())
}

function isLikelyNoiseLine(line: string): boolean {
  const trimmed = line.trim()

  if (trimmed.length === 0) {
    return true
  }

  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('```') ||
    trimmed.startsWith('---') ||
    trimmed.startsWith('<!--') ||
    trimmed.startsWith('<img') ||
    trimmed.startsWith('<p') ||
    trimmed.startsWith('</') ||
    trimmed.startsWith('<div')
  ) {
    return true
  }

  return isSkippableBadgeLine(trimmed)
}

function normalizeMarkdownLine(line: string): string {
  return line
    .trim()
    .replace(/^\s{0,3}>\s?/, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+\.\s+/, '')
}

export function extractReadmeFirstParagraph(markdown: string): string | null {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const paragraphLines: string[] = []
  let inFrontMatter = false
  let frontMatterClosed = false

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index]
    const trimmedLine = rawLine.trim()

    if (index === 0 && trimmedLine === '---') {
      inFrontMatter = true
      continue
    }

    if (inFrontMatter && trimmedLine === '---') {
      inFrontMatter = false
      frontMatterClosed = true
      continue
    }

    if (inFrontMatter || (!frontMatterClosed && index === 0 && trimmedLine === '+++')) {
      continue
    }

    if (trimmedLine.length === 0) {
      if (paragraphLines.length > 0) {
        break
      }
      continue
    }

    if (isLikelyNoiseLine(trimmedLine)) {
      if (paragraphLines.length > 0) {
        break
      }
      continue
    }

    const normalized = normalizeMarkdownLine(trimmedLine)
    if (normalized.length === 0) {
      continue
    }

    paragraphLines.push(normalized)
  }

  if (paragraphLines.length === 0) {
    return null
  }

  return paragraphLines.join(' ')
}

export async function fetchReadmeSummary(
  fullName: string,
  signal?: AbortSignal,
): Promise<string | null> {
  if (readmeSummaryCache.has(fullName)) {
    return readmeSummaryCache.get(fullName) ?? null
  }

  if (readmeSummaryInflight.has(fullName)) {
    return readmeSummaryInflight.get(fullName) ?? null
  }

  const request = fetch(`https://api.github.com/repos/${fullName}/readme`, {
    signal,
    headers: {
      Accept: 'application/vnd.github.raw+json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        return null
      }

      const markdown = await response.text()
      return extractReadmeFirstParagraph(markdown)
    })
    .catch(() => null)
    .then((summary) => {
      readmeSummaryCache.set(fullName, summary)
      return summary
    })
    .finally(() => {
      readmeSummaryInflight.delete(fullName)
    })

  readmeSummaryInflight.set(fullName, request)
  return request
}
