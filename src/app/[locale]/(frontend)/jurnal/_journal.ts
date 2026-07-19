import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type Journal = any

export function journalHref(locale: string, slugOrID: string | number) {
  return `/${locale}/jurnal/${slugOrID}`
}

export function journalListHref(locale: string, search = '') {
  return `/${locale}/jurnal${search}`
}

export function mediaURL(media: unknown): string | undefined {
  return media && typeof media === 'object' && 'url' in media && typeof media.url === 'string'
    ? media.url
    : undefined
}

export function mediaAlt(media: unknown, fallback: string) {
  return media && typeof media === 'object' && 'alt' in media && typeof media.alt === 'string' && media.alt.trim()
    ? media.alt
    : fallback
}

export function richTextToPlain(value: unknown): string {
  const visit = (node: any): string => {
    if (!node || typeof node !== 'object') return ''
    const ownText = typeof node.text === 'string' ? `${node.text} ` : ''
    const children = Array.isArray(node.children) ? node.children.map(visit).join('') : ''
    return ownText + children
  }

  return visit(value).replace(/\s+/g, ' ').trim()
}

export function journalAuthors(journal: Journal) {
  return Array.isArray(journal.authors) ? journal.authors.filter((author: any) => author?.name) : []
}

export function journalCitation(journal: Journal) {
  const authors = journalAuthors(journal).map((author: any) => author.name).join(', ') || 'Mahaga Widya Cita'
  const publication = [journal.publicationYear, journal.volume && `Vol. ${journal.volume}`, journal.issue && `No. ${journal.issue}`, journal.pages && `hlm. ${journal.pages}`]
    .filter(Boolean)
    .join(', ')
  return `${authors}. (${journal.publicationYear || new Date(journal.publishedAt || journal.createdAt).getFullYear()}). ${journal.title}.${publication ? ` ${publication}.` : ''}${journal.doi ? ` https://doi.org/${journal.doi}` : ''}`
}

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

export function publishedJournalWhere(extra: Record<string, unknown>[] = []) {
  return {
    and: [
      { status: { equals: 'published' } },
      ...extra,
    ],
  }
}
