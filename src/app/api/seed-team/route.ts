import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

const management = [
  { initials: "EL", name: "Prof. Dr. Hj. Endang Larasati, M.S.", category: "management", role: "Direktur Utama", expertise: "Administrasi Publik & Kebijakan Pemerintahan", bio: "Guru Besar Administrasi Publik dengan pengalaman 30+ tahun di bidang reformasi birokrasi dan penguatan tata kelola pemerintahan. Aktif sebagai konsultan di berbagai kementerian dan lembaga nasional.", color: "linear-gradient(135deg, #1E6FD9, #0B2D6B)", order: 1 },
  { initials: "OR", name: "Dr. Oscar Radyan Danar, M.A.", category: "management", role: "Direktur Program", expertise: "Kebijakan Publik & Reformasi Birokrasi", bio: "Doktor kebijakan publik dengan spesialisasi reformasi birokrasi dan inovasi pelayanan publik. Penulis lebih dari 20 jurnal ilmiah dan pembicara di 100+ forum nasional dan internasional.", color: "linear-gradient(135deg, #C9970A, #A07508)", order: 2 },
  { initials: "RF", name: "Rizki Firmansyah, M.Sc.", category: "management", role: "Direktur Teknologi", expertise: "Transformasi Digital & IT Governance", bio: "Spesialis transformasi digital sektor publik dengan pengalaman memimpin proyek SPBE di 15+ instansi pemerintah. Bersertifikasi CISA dan COBIT 2019.", color: "linear-gradient(135deg, #7C3AED, #5B21B6)", order: 3 },
];

const experts = [
  { initials: "AB", name: "Prof. Dr. Ahmad Basori, M.M.", category: "expert", expertise: "Manajemen Keuangan Daerah & APBD", institution: "Universitas Indonesia", color: "linear-gradient(135deg, #059669, #047857)", order: 4 },
  { initials: "SD", name: "Sari Dewi Purnama, S.Psi., M.Si.", category: "expert", expertise: "Psikologi Organisasi & Manajemen SDM", institution: "Universitas Gadjah Mada", color: "linear-gradient(135deg, #DC2626, #B91C1C)", order: 5 },
  { initials: "BW", name: "Dr. Bambang Wiyono, S.H., M.H.", category: "expert", expertise: "Hukum Administrasi & Regulasi Publik", institution: "Universitas Diponegoro", color: "linear-gradient(135deg, #0891B2, #0E7490)", order: 6 },
  { initials: "RA", name: "Rudi Ardiansyah, M.Kom.", category: "expert", expertise: "Sistem Informasi & Keamanan Siber", institution: "Institut Teknologi Bandung", color: "linear-gradient(135deg, #D97706, #B45309)", order: 7 },
  { initials: "NA", name: "Nurul Aini, M.Pd.", category: "expert", expertise: "Pendidikan Profesional & Kurikulum", institution: "Universitas Pendidikan Indonesia", color: "linear-gradient(135deg, #7C3AED, #6D28D9)", order: 8 },
  { initials: "HS", name: "Dr. Hendra Saputra, M.Sos.", category: "expert", expertise: "Sosiologi Pemerintahan & Otonomi Daerah", institution: "Universitas Airlangga", color: "linear-gradient(135deg, #0B2D6B, #1247A8)", order: 9 },
];

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    for (const data of [...management, ...experts]) {
      await payload.create({
        collection: 'team-members',
        data,
      });
    }

    return NextResponse.json({ message: 'Team successfully seeded!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to seed team' }, { status: 500 })
  }
}
