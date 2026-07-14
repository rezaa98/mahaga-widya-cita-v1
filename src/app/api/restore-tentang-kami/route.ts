import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { translateDocumentJSON } from '@/utils/translate';
import { TentangKami } from '@/globals/TentangKami';

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

    const defaultData = extractDefaults(TentangKami.fields);

    // Overwrite missing array defaults for tentang-kami
    defaultData.coreValues = [
      { letter: "F", name: "Foresight", desc: "Berpikir Jauh Ke Depan, Merancang Masa Depan Pembangunan.", icon: "Eye" },
      { letter: "U", name: "Unit", desc: "Mengutamakan Kerja Sama Lintas Sektor Dan Pemangku Kepentingan.", icon: "Network" },
      { letter: "T", name: "Transformation", desc: "Mendorong Perubahan Nyata Melalui Pemberdayaan Dan Pengembangan.", icon: "Rocket" },
      { letter: "U", name: "Understanding", desc: "Memahami Kebutuhan Masyarakat Dan Dinamika Daerah Secara Mendalam.", icon: "Brain" },
      { letter: "R", name: "Responsibility", desc: "Bertindak Dengan Tanggung Jawab Dan Komitmen Terhadap Hasil.", icon: "Shield" },
      { letter: "I", name: "Integrity", desc: "Menjaga Kejujuran, Etika, Dan Akuntabilitas Dalam Setiap Langkah.", icon: "UserCheck" },
      { letter: "S", name: "Sustainability", desc: "Berorientasi Pada Dampak Jangka Panjang Dan Berkelanjutan.", icon: "Leaf" },
      { letter: "T", name: "Technology", desc: "Memanfaatkan Teknologi Untuk Tata Kelola Dan Perencanaan Yang Lebih Baik.", icon: "Cpu" },
      { letter: "I", name: "Innovation", desc: "Terus Berinovasi Untuk Menjawab Tantangan Masa Kini Dan Mendatang.", icon: "Lightbulb" },
      { letter: "C", name: "Collaboration", desc: "Membangun Sinergi Dengan Masyarakat, Pemerintah, Dan Mitra Profesional.", icon: "Handshake" }
    ];

    defaultData.stats = [
      { value: "500+", label: "Klien & Mitra", icon: "Users" },
      { value: "50+", label: "Tenaga Ahli", icon: "Award" },
      { value: "100+", label: "Proyek dan Studi", icon: "Target" },
      { value: "Nasional", label: "Cakupan Layanan", icon: "Globe" },
      { value: "Banyak", label: "Dipercaya Pemerintah & Swasta", icon: "Building2" },
    ];

    defaultData.misi = [
      { title: "Memberikan Solusi Strategis", text: "Menyediakan layanan konsultasi terintegrasi yang menghasilkan solusi praktis, terukur, dan berkelanjutan bagi pemerintah, dunia usaha, dan berbagai institusi." },
      { title: "Mendorong Pengambilan Keputusan Berbasis Data", text: "Mendukung penyusunan kebijakan dan strategi bisnis melalui riset berkualitas, analisis data, serta kajian strategis yang komprehensif." },
      { title: "Mengembangkan Sumber Daya Manusia", text: "Meningkatkan kapasitas organisasi melalui pengembangan kompetensi, pelatihan profesional, konsultasi SDM, dan penyediaan tenaga profesional." },
      { title: "Mempercepat Transformasi Digital", text: "Mendorong peningkatan efisiensi, tata kelola, dan kualitas layanan melalui penerapan teknologi dan inovasi digital." },
      { title: "Membangun Kemitraan Jangka Panjang", text: "Menjalin hubungan kerja yang dilandasi integritas, profesionalisme, akuntabilitas, dan kolaborasi untuk menciptakan keberhasilan bersama." },
      { title: "Menciptakan Dampak Berkelanjutan", text: "Menghasilkan solusi yang memberikan manfaat ekonomi, sosial, dan lingkungan secara berkelanjutan bagi klien dan masyarakat." }
    ];

    // Delete existing records to avoid validation on corrupted arrays
    // Workaround: if we pass the full arrays, Payload will replace them!
    
    // Restore ID
    await payload.updateGlobal({
      slug: 'tentang-kami',
      locale: 'id',
      data: defaultData,
      context: { skipAutoTranslate: true }
    });
    
    // Translate to EN
    console.log(`Translating tentang-kami to EN...`);
    const translatedData = await translateDocumentJSON(defaultData, 'English');

    // Restore EN
    await payload.updateGlobal({
      slug: 'tentang-kami',
      locale: 'en',
      data: translatedData,
      context: { skipAutoTranslate: true }
    });
    
    console.log(`✅ tentang-kami fully restored and translated!`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
