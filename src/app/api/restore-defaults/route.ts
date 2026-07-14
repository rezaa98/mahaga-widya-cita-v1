import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { translateDocumentJSON } from '@/utils/translate';
import { Navbar } from '@/globals/Navbar';
import { Footer } from '@/globals/Footer';
import { Beranda } from '@/globals/Beranda';
import { TentangKami } from '@/globals/TentangKami';
import { Kontak } from '@/globals/Kontak';

function extractDefaults(fields: any[]): any {
  const result: any = {};
  for (const field of fields) {
    if (field.type === 'group' || field.type === 'tab') {
      result[field.name] = extractDefaults(field.fields);
    } else if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        Object.assign(result, extractDefaults(tab.fields));
      }
    } else if (field.name && field.defaultValue !== undefined) {
      result[field.name] = field.defaultValue;
    }
  }
  return result;
}

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    const globals = [
      { slug: 'navbar', config: Navbar },
      { slug: 'footer', config: Footer },
      { slug: 'beranda', config: Beranda },
      { slug: 'tentang-kami', config: TentangKami },
      { slug: 'kontak', config: Kontak },
    ];

    for (const g of globals) {
      console.log(`Restoring defaults for ${g.slug}...`);
      const defaultData = extractDefaults(g.config.fields);

      // Restore ID
      await payload.updateGlobal({
        slug: g.slug as any,
        locale: 'id',
        data: defaultData,
        context: { skipAutoTranslate: true }
      });
      
      // Translate to EN
      console.log(`Translating ${g.slug} to EN...`);
      const translatedData = await translateDocumentJSON(defaultData, 'English');

      // Restore EN
      await payload.updateGlobal({
        slug: g.slug as any,
        locale: 'en',
        data: translatedData,
        context: { skipAutoTranslate: true }
      });
      console.log(`✅ ${g.slug} fully restored and translated!`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
