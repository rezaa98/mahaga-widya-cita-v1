import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const BRAIN_DIR = '/Users/rezaa_ym/.gemini/antigravity-ide/brain/fdb797ac-bcea-4120-9f3b-dce2f956f933';

const management = [
  { initials: "EL", name: "Prof. Dr. Hj. Endang Larasati, M.S.", category: "management", role: "Direktur Utama", expertise: "Administrasi Publik & Kebijakan Pemerintahan", bio: "Guru Besar Administrasi Publik dengan pengalaman 30+ tahun di bidang reformasi birokrasi dan penguatan tata kelola pemerintahan. Aktif sebagai konsultan di berbagai kementerian dan lembaga nasional.", color: "linear-gradient(135deg, #1E6FD9, #0B2D6B)", order: 1, imageFile: "prof_endang_1783667447330.png" },
  { initials: "OR", name: "Dr. Oscar Radyan Danar, M.A.", category: "management", role: "Direktur Program", expertise: "Kebijakan Publik & Reformasi Birokrasi", bio: "Doktor kebijakan publik dengan spesialisasi reformasi birokrasi dan inovasi pelayanan publik. Penulis lebih dari 20 jurnal ilmiah dan pembicara di 100+ forum nasional dan internasional.", color: "linear-gradient(135deg, #C9970A, #A07508)", order: 2, imageFile: "dr_oscar_1783667480247.png" },
  { initials: "RF", name: "Rizki Firmansyah, M.Sc.", category: "management", role: "Direktur Teknologi", expertise: "Transformasi Digital & IT Governance", bio: "Spesialis transformasi digital sektor publik dengan pengalaman memimpin proyek SPBE di 15+ instansi pemerintah. Bersertifikasi CISA dan COBIT 2019.", color: "linear-gradient(135deg, #7C3AED, #5B21B6)", order: 3, imageFile: "rizki_firmansyah_1783667489175.png" },
];

const experts = [
  { initials: "AB", name: "Prof. Dr. Ahmad Basori, M.M.", category: "expert", expertise: "Manajemen Keuangan Daerah & APBD", institution: "Universitas Indonesia", color: "linear-gradient(135deg, #059669, #047857)", order: 4, imageFile: "prof_ahmad_1783667505471.png" },
  { initials: "SD", name: "Sari Dewi Purnama, S.Psi., M.Si.", category: "expert", expertise: "Psikologi Organisasi & Manajemen SDM", institution: "Universitas Gadjah Mada", color: "linear-gradient(135deg, #DC2626, #B91C1C)", order: 5, imageFile: "sari_dewi_1783667556008.png" },
  { initials: "BW", name: "Dr. Bambang Wiyono, S.H., M.H.", category: "expert", expertise: "Hukum Administrasi & Regulasi Publik", institution: "Universitas Diponegoro", color: "linear-gradient(135deg, #0891B2, #0E7490)", order: 6, imageFile: "dr_bambang_1783667514730.png" },
  { initials: "RA", name: "Rudi Ardiansyah, M.Kom.", category: "expert", expertise: "Sistem Informasi & Keamanan Siber", institution: "Institut Teknologi Bandung", color: "linear-gradient(135deg, #D97706, #B45309)", order: 7, imageFile: "rudi_ardiansyah_1783667564948.png" },
  { initials: "NA", name: "Nurul Aini, M.Pd.", category: "expert", expertise: "Pendidikan Profesional & Kurikulum", institution: "Universitas Pendidikan Indonesia", color: "linear-gradient(135deg, #7C3AED, #6D28D9)", order: 8, imageFile: "nurul_aini_1783667603562.png" },
  { initials: "HS", name: "Dr. Hendra Saputra, M.Sos.", category: "expert", expertise: "Sosiologi Pemerintahan & Otonomi Daerah", institution: "Universitas Airlangga", color: "linear-gradient(135deg, #0B2D6B, #1247A8)", order: 9, imageFile: "dr_hendra_1783667613293.png" },
];

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Clear existing team members to avoid duplicates
    await payload.delete({
      collection: 'team-members',
      where: {
        id: {
          exists: true,
        },
      },
    });

    for (const data of [...management, ...experts]) {
      let mediaId = null;
      
      // Upload media if file exists
      const filePath = path.join(BRAIN_DIR, data.imageFile);
      if (fs.existsSync(filePath)) {
        try {
          const media = await payload.create({
            collection: 'media',
            data: { alt: `Photo of ${data.name}` },
            filePath,
          });
          mediaId = media.id;
        } catch (mediaErr) {
          console.error(`Failed to upload media for ${data.name}`, mediaErr);
        }
      }

      const { imageFile, ...payloadData } = data;
      
      await payload.create({
        collection: 'team-members',
        data: {
          ...payloadData,
          photo: mediaId,
        },
      });
    }

    return NextResponse.json({ message: 'Team successfully seeded with generated photos!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to seed team' }, { status: 500 })
  }
}
