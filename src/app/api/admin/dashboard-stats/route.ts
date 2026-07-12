import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    // --- Stat counts ---
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    const [
      articlesTotal,
      articlesPublished,
      articlesDraft,
      usersTotal,
      subscribersTotal,
      mediaTotal,
      contactsTotal,
      contactsRecent,
      subscribersRecent,
    ] = await Promise.all([
      payload.count({ collection: 'articles' }),
      payload.count({ collection: 'articles', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'articles', where: { status: { equals: 'draft' } } }),
      payload.count({ collection: 'users' }),
      payload.count({ collection: 'subscribers' }),
      payload.count({ collection: 'media' }),
      payload.count({ collection: 'contact-submissions' }),
      payload.count({
        collection: 'contact-submissions',
        where: { createdAt: { greater_than: thirtyDaysAgoISO } },
      }),
      payload.count({
        collection: 'subscribers',
        where: { createdAt: { greater_than: thirtyDaysAgoISO } },
      }),
    ]);

    // --- Recent Activity (merge from multiple collections) ---
    const [recentArticles, recentContacts, recentSubscribers, recentMedia] = await Promise.all([
      payload.find({
        collection: 'articles',
        limit: 5,
        sort: '-updatedAt',
        depth: 0,
      }),
      payload.find({
        collection: 'contact-submissions',
        limit: 5,
        sort: '-createdAt',
        depth: 0,
      }),
      payload.find({
        collection: 'subscribers',
        limit: 5,
        sort: '-createdAt',
        depth: 0,
      }),
      payload.find({
        collection: 'media',
        limit: 5,
        sort: '-createdAt',
        depth: 0,
      }),
    ]);

    type ActivityItem = {
      type: string;
      label: string;
      detail: string;
      time: string;
      link: string;
    };

    const activities: ActivityItem[] = [];

    recentArticles.docs.forEach((doc: any) => {
      activities.push({
        type: 'article',
        label: `Artikel "${doc.title}"`,
        detail: doc.status === 'published' ? 'dipublikasikan' : 'diperbarui (draft)',
        time: doc.updatedAt,
        link: `/admin/collections/articles/${doc.id}`,
      });
    });

    recentContacts.docs.forEach((doc: any) => {
      activities.push({
        type: 'contact',
        label: `Pesan dari ${doc.name || 'Anonim'}`,
        detail: doc.subject || 'Pesan baru masuk',
        time: doc.createdAt,
        link: `/admin/collections/contact-submissions/${doc.id}`,
      });
    });

    recentSubscribers.docs.forEach((doc: any) => {
      activities.push({
        type: 'subscriber',
        label: `Subscriber baru`,
        detail: doc.email,
        time: doc.createdAt,
        link: `/admin/collections/subscribers/${doc.id}`,
      });
    });

    recentMedia.docs.forEach((doc: any) => {
      activities.push({
        type: 'media',
        label: `Media diupload`,
        detail: (doc.filename as string) || 'File baru',
        time: doc.createdAt,
        link: `/admin/collections/media/${doc.id}`,
      });
    });

    // Sort by time descending, take top 8
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const recentActivity = activities.slice(0, 8);

    // --- Weekly articles chart (last 4 weeks) ---
    const weeklyData: number[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const count = await payload.count({
        collection: 'articles',
        where: {
          createdAt: {
            greater_than: weekStart.toISOString(),
            less_than: weekEnd.toISOString(),
          },
        },
      });
      weeklyData.push(count.totalDocs);
    }

    return NextResponse.json({
      stats: {
        articles: {
          total: articlesTotal.totalDocs,
          published: articlesPublished.totalDocs,
          draft: articlesDraft.totalDocs,
        },
        users: {
          total: usersTotal.totalDocs,
        },
        subscribers: {
          total: subscribersTotal.totalDocs,
          recentCount: subscribersRecent.totalDocs,
        },
        media: {
          total: mediaTotal.totalDocs,
        },
        contacts: {
          total: contactsTotal.totalDocs,
          recentCount: contactsRecent.totalDocs,
        },
      },
      recentActivity,
      weeklyArticles: weeklyData,
    });
  } catch (error) {
    console.error('[dashboard-stats] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
