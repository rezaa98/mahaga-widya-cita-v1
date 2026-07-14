import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';

export async function GET() {
  const payload = await getPayload({ config: configPromise });
  const db = payload.db as any;
  const drizzle = db.drizzle;
  const run = (q: string) => drizzle.execute(sql.raw(q));
  const e = (s: string) => s.replace(/'/g, "''");

  try {
    const log: string[] = [];
    
    const translations: Record<string, { role?: string, expertise?: string, bio?: string }> = {
      'Dr. Hendra Saputra, M.Sos.': {
        expertise: 'Government Sociology & Regional Autonomy'
      },
      'Nurul Aini, M.Pd.': {
        expertise: 'Professional Education & Curriculum'
      },
      'Rudi Ardiansyah, M.Kom.': {
        expertise: 'Information Systems & Cyber Security'
      },
      'Dr. Bambang Wiyono, S.H., M.H.': {
        expertise: 'Administrative Law & Public Regulation'
      },
      'Sari Dewi Purnama, S.Psi., M.Si.': {
        expertise: 'Organizational Psychology & HR Management'
      },
      'THATA DEBORA AGNESIA': {
        expertise: 'Manager'
      },
      'SHILLA H. VALSI, S.AP.,M.AP': {
        role: 'Director',
        expertise: 'Digital Transformation & IT Governance',
        bio: 'Public sector digital transformation specialist with experience leading SPBE projects in 15+ government agencies. CISA and COBIT 2019 certified.'
      },
      'SİKİN M.NOR,SP.,MM': {
        role: 'Commissioner',
        expertise: 'Public Administration & Government Policy',
        bio: 'Professor of Public Administration with 30+ years of experience in bureaucratic reform and strengthening government governance. Active as a consultant in various national ministries and agencies.'
      },
      'DR(C) . BRIAN L.DJUMATY, S,SI., M.SI.,C.ED': {
        role: 'President Commissioner',
        expertise: 'Public Policy & Bureaucratic Reform',
        bio: 'Doctor of public policy specializing in bureaucratic reform and public service innovation. Author of more than 20 scientific journals and speaker at 100+ national and international forums.'
      }
    };

    for (const [name, trans] of Object.entries(translations)) {
      const updates = [];
      if (trans.role) updates.push(`role = '${e(trans.role)}'`);
      if (trans.expertise) updates.push(`expertise = '${e(trans.expertise)}'`);
      if (trans.bio) updates.push(`bio = '${e(trans.bio)}'`);
      
      if (updates.length > 0) {
        await run(`
          UPDATE team_members_locales 
          SET ${updates.join(', ')}
          WHERE "_locale" = 'en' AND name = '${e(name)}'
        `);
        log.push(`✅ team_members EN '${name}' updated`);
      }
    }

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack?.slice(0, 500) });
  }
}
