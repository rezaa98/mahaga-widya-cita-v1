import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Download, FileText, Hash, UserRound } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import RichTextRenderer from '@/components/RichTextRenderer'
import { getPayloadClient, journalAuthors, journalCitation, journalHref, journalListHref, mediaAlt, mediaURL, publishedJournalWhere, richTextToPlain } from '../_journal'
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type RouteParams = { locale: string; slug: string }

async function getJournal({ locale, slug }: RouteParams) {
  try {
    const payload = await getPayloadClient()
    const result: any = await payload.find({ collection: 'journals' as any, where: publishedJournalWhere([{ slug: { equals: slug } }]), locale: locale as any, depth: 1, limit: 1 } as any)
    return result.docs?.[0]
  } catch (err) {
    console.error('[JournalDetail] Failed to load journal (collection may not exist):', err)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const resolved = await params; const journal = await getJournal(resolved)
  if (!journal) return { title: resolved.locale === 'en' ? 'Journal not found' : 'Jurnal tidak ditemukan' }
  const title = journal.meta?.title || journal.metaTitle || `${journal.title} | Mahaga Widya Cita`
  const description = journal.meta?.description || journal.metaDescription || richTextToPlain(journal.abstract).slice(0, 160) || journal.title
  const image = journal.meta?.image ? (typeof journal.meta.image === 'object' ? journal.meta.image.url : null) : (mediaURL(journal.ogImage) || mediaURL(journal.coverImage))
  const url = `https://mahagawidyacita.co.id${journalHref(resolved.locale, journal.slug || journal.id)}`
  return { title, description, alternates: { canonical: journal.canonicalUrl || url }, openGraph: { title, description, type: 'article', url, images: image ? [{ url: image }] : [] }, twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] } }
}

export default async function JournalDetailPage({ params }: { params: Promise<RouteParams> }) {
  const resolved = await params; const journal = await getJournal(resolved)
  if (!journal) notFound()
  let related: any[] = []
  try {
    const payload = await getPayloadClient(); const categoryID = typeof journal.category === 'object' ? journal.category?.id : journal.category
    const relatedResult: any = await payload.find({ collection: 'journals' as any, where: publishedJournalWhere([{ id: { not_equals: journal.id } }, ...(categoryID ? [{ category: { equals: categoryID } }] : [])]), locale: resolved.locale as any, depth: 1, sort: '-publishedAt', limit: 3 } as any)
    related = relatedResult.docs || []
  } catch (err) {
    console.error('[JournalDetail] Failed to load related journals:', err)
  }
  const cover = mediaURL(journal.coverImage); const document = mediaURL(journal.document); const authors = journalAuthors(journal); const isEn = resolved.locale === 'en'; const dateLocale = isEn ? 'en-US' : 'id-ID'
  const citation = journalCitation(journal)
  const schema = { '@context': 'https://schema.org', '@type': 'ScholarlyArticle', headline: journal.title, datePublished: journal.publishedAt || undefined, inLanguage: journal.language || resolved.locale, author: authors.map((author: any) => ({ '@type': 'Person', name: author.name, affiliation: author.affiliation ? { '@type': 'Organization', name: author.affiliation } : undefined })), abstract: richTextToPlain(journal.abstract), keywords: Array.isArray(journal.keywords) ? journal.keywords.map((keyword: any) => keyword.keyword || keyword).filter(Boolean).join(', ') : undefined, pagination: journal.pages || undefined, sameAs: journal.doi ? `https://doi.org/${journal.doi}` : undefined, url: `https://mahagawidyacita.co.id${journalHref(resolved.locale, journal.slug || journal.id)}` }
  
  const categoryName = typeof journal.category === 'object' && journal.category?.name ? journal.category.name : (isEn ? 'Publication' : 'Publikasi');

  return <><Navbar /><main style={{ paddingTop: 112, minHeight: '100vh', background: '#f8f9fa', paddingBottom: 64 }}><div className="container" style={{ maxWidth: 960 }}>
    <Breadcrumbs items={[
      { label: isEn ? 'All journals' : 'Semua jurnal', href: journalListHref(resolved.locale) },
      { label: journal.title }
    ]} />
    <article className="card" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
    <div className={cover ? 'journal-detail-hero journal-detail-hero--with-cover' : 'journal-detail-hero'}><div><span className="badge badge-primary">{typeof journal.category === 'object' && journal.category?.name ? journal.category.name : (isEn ? 'Publication' : 'Publikasi')}</span><h1 style={{ color: '#1a2b4c', lineHeight: 1.18, margin: '18px 0' }}>{journal.title}</h1><div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: '#64748b', fontSize: 14 }}><span><Calendar size={15} style={{ verticalAlign: 'text-bottom', marginRight: 5 }} />{new Date(journal.publishedAt || journal.createdAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>{journal.publicationYear && <span>{journal.publicationYear}</span>}{journal.doi && <a href={`https://doi.org/${journal.doi}`} rel="noreferrer" target="_blank">DOI: {journal.doi}</a>}</div></div>{cover && <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: 12, background: '#e8eef7' }}><Image alt={mediaAlt(journal.coverImage, journal.title)} fill priority sizes="(max-width: 768px) 100vw, 340px" src={cover} style={{ objectFit: 'cover' }} /></div>}</div>
    <section style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid #e5e7eb' }}><h2>{isEn ? 'Authors' : 'Penulis'}</h2><div style={{ display: 'grid', gap: 12 }}>{authors.length ? authors.map((author: any, index: number) => <div key={author.id || index} style={{ display: 'flex', gap: 10, color: '#475569' }}><UserRound size={18} /><div><strong>{author.name}</strong>{author.affiliation && <div style={{ fontSize: 14 }}>{author.affiliation}</div>}{author.publicProfile && <a href={author.publicProfile} rel="noreferrer" target="_blank">{isEn ? 'Profile' : 'Profil'}</a>}</div></div>) : <p>Mahaga Widya Cita</p>}</div></section>
    <section className="article-content" style={{ marginTop: 32 }}><h2>{isEn ? 'Abstract' : 'Abstrak'}</h2><RichTextRenderer content={journal.abstract} />{journal.content && <><h2>{isEn ? 'Full discussion' : 'Pembahasan'}</h2><RichTextRenderer content={journal.content} /></>}</section>
    {document && <section style={{ marginTop: 32, background: '#f1f5f9', padding: 20, borderRadius: 12, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><FileText color="var(--color-primary-600)" /><div><strong>{isEn ? 'Full journal document' : 'Dokumen jurnal lengkap'}</strong><div style={{ color: '#64748b', fontSize: 14 }}>PDF</div></div></div><a className="btn btn-primary" download href={document}><Download size={16} /> {isEn ? 'Download PDF' : 'Unduh PDF'}</a></section>}
    {(journal.volume || journal.issue || journal.pages || journal.issn) && <section style={{ marginTop: 32 }}><h2>{isEn ? 'Publication details' : 'Detail publikasi'}</h2><dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, margin: 0 }}>{[['Volume', journal.volume], ['Issue', journal.issue], [isEn ? 'Pages' : 'Halaman', journal.pages], ['ISSN', journal.issn]].filter(([, value]) => value).map(([label, value]) => <div key={String(label)} style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}><dt style={{ color: '#64748b', fontSize: 13 }}>{label}</dt><dd style={{ margin: '4px 0 0' }}>{value}</dd></div>)}</dl></section>}
    <section style={{ marginTop: 32 }}><h2>{isEn ? 'Citation' : 'Sitasi'}</h2><p style={{ padding: 16, borderRadius: 8, background: '#f8fafc', color: '#475569' }}><Hash size={16} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />{citation}</p></section>
  </article>{related.length > 0 && <section style={{ marginTop: 48 }}><h2 style={{ color: '#1a2b4c' }}>{isEn ? 'Related journals' : 'Jurnal terkait'}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>{related.map((item: any) => <Link className="card" href={journalHref(resolved.locale, item.slug || item.id)} key={item.id} style={{ padding: 18, textDecoration: 'none' }}><strong style={{ color: '#1a2b4c' }}>{item.title}</strong><p style={{ color: '#64748b', fontSize: 13 }}>{journalAuthors(item).map((author: any) => author.name).join(', ')}</p></Link>)}</div></section>}</div></main><script dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} type="application/ld+json" /><Footer /><WhatsAppFloat /></>
}
