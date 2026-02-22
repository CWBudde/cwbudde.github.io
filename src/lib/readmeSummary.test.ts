import { describe, expect, it } from 'vitest'

import { extractReadmeFirstParagraph } from '@/lib/readmeSummary'

describe('extractReadmeFirstParagraph', () => {
  it('skips top-level heading and returns the first paragraph', () => {
    const markdown = `# Project Title

This is the first paragraph.
It has two lines.

## Usage
More content`

    expect(extractReadmeFirstParagraph(markdown)).toBe(
      'This is the first paragraph. It has two lines.',
    )
  })

  it('skips badge lines before the first paragraph', () => {
    const markdown = `# Project

![CI](https://example.com/ci.svg)
[![Coverage](https://example.com/cov.svg)](https://example.com)

Library for DSP experiments.
`

    expect(extractReadmeFirstParagraph(markdown)).toBe('Library for DSP experiments.')
  })

  it('accepts blockquote/list-like intro lines as text paragraph', () => {
    const markdown = `# Project

> High-performance FFT toolkit.
> Optimized for realtime workloads.
`

    expect(extractReadmeFirstParagraph(markdown)).toBe(
      'High-performance FFT toolkit. Optimized for realtime workloads.',
    )
  })
})
