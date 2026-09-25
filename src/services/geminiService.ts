import { ReleaseNotesForm } from '../types';

export interface ReleaseNotesOutput {
  bmReleaseNotes: string; // Max 500 chars
  enReleaseNotes: string; // Max 500 chars
  bmPromoSummary: string;
  enPromoSummary: string;
  bmShortDescription: string;
  enShortDescription: string;
  generatedByAi: boolean;
}

export async function generateAiReleaseNotes(formData: ReleaseNotesForm): Promise<ReleaseNotesOutput> {
  const prompt = `Anda ialah pakar penerbitan aplikasi mudah alih Google Play Console untuk "RazifApps@nasadef®".
Hasilkan Release Notes (What's New) dan Huraian Kemaskini Aplikasi (Store Update Description) untuk aplikasi Android yang baru dikemas kini mengikut butiran berikut:

Maklumat Aplikasi:
- Nama Aplikasi: ${formData.appName}
- Versi Baharu: ${formData.version}
- Bahasa: Bahasa Melayu & Bahasa Inggeris (Bilingual)

Sebab Kemaskini / Ciri-Ciri Baharu yang Ditambah:
1. ${formData.feature1 || 'Penambahbaikan kelajuan dan prestasi memuatkan'}
2. ${formData.feature2 || 'Pembaikan isu kestabilan pada peranti versi terkini'}
3. ${formData.feature3 || 'Antaramuka paparan baharu yang lebih kemas dan responsif'}

Format Output WAJIB dalam JSON sah dengan struktur tepat seperti ini:
{
  "bmReleaseNotes": "Maksimum 480 aksara teks kemas kini Bahasa Melayu sesuai untuk petak What's New Play Console",
  "enReleaseNotes": "Maximum 480 characters update text in English suitable for Play Console What's New",
  "bmPromoSummary": "Ringkasan promo 2-3 ayat ringkas BM untuk kemaskini ini",
  "enPromoSummary": "2-3 sentences concise promo summary in English for this update",
  "bmShortDescription": "Penerangan ringkas aplikasi BM (bawah 80 aksara)",
  "enShortDescription": "Short description of the app in English (under 80 characters)"
}

Sila pastikan nada penyampaian: Profesional, mesra pengguna, dan jelas. Pastikan jumlah aksara release notes di bawah 500 aksara!`;

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        temperature: 0.7,
        systemInstruction: 'Anda adalah pakar ASO (App Store Optimization) dan Google Play Console copywriter profesional dalam dwibahasa (BM & EN).'
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        // Extract JSON from markdown fences if any
        const cleaned = data.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          bmReleaseNotes: parsed.bmReleaseNotes || '',
          enReleaseNotes: parsed.enReleaseNotes || '',
          bmPromoSummary: parsed.bmPromoSummary || '',
          enPromoSummary: parsed.enPromoSummary || '',
          bmShortDescription: parsed.bmShortDescription || '',
          enShortDescription: parsed.enShortDescription || '',
          generatedByAi: true
        };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API offline or failed, using high-fidelity local bilingual generator:', err);
  }

  // High-fidelity fallback compliant with Google Play Console 500-char limits:
  const bmNotes = `Apa yang Baharu (${formData.version}):
• ${formData.feature1 || 'Penambahbaikan kelajuan memuatkan halaman utama & enjin muat turun'}
• ${formData.feature2 || 'Pembaikan isu crash pada Android 13/14+ dan kestabilan latar'}
• ${formData.feature3 || 'Antaramuka paparan baharu yang lebih kemas dengan sokongan Mod Gelap'}
• Pengoptimuman penggunaan memori & pengurusan cache pintar.

Dibawakan oleh RazifApps@nasadef®`.trim();

  const enNotes = `What's New (${formData.version}):
• ${formData.feature1 ? `Enhancement: ${formData.feature1}` : 'Improved home page loading speed & optimized download engine'}
• ${formData.feature2 ? `Bugfix: ${formData.feature2}` : 'Fixed crashing issues on Android 13/14+ and enhanced background stability'}
• ${formData.feature3 ? `UI Update: ${formData.feature3}` : 'Refreshed modern clean UI with native Dark Mode support'}
• Better memory management & smart cache cleaner.

Powered by RazifApps@nasadef®`.trim();

  return {
    bmReleaseNotes: bmNotes.slice(0, 490),
    enReleaseNotes: enNotes.slice(0, 490),
    bmPromoSummary: `Kemaskini ${formData.version} membawakan peningkatan kelajuan signifikan, pembaikan pepijat kritikal serta rekaan paparan yang lebih moden dan lancar untuk semua peranti.`,
    enPromoSummary: `Update ${formData.version} brings significant speed improvements, critical bug fixes, and a refreshed modern interface for a smoother experience.`,
    bmShortDescription: `${formData.appName} - Versi terpantas & paling stabil oleh RazifApps@nasadef®.`,
    enShortDescription: `${formData.appName} - The fastest & most stable version by RazifApps@nasadef®.`,
    generatedByAi: false
  };
}

export async function askGeminiAppAdvisor(appName: string, userDevice: string, query: string): Promise<string> {
  const prompt = `Pengguna ingin tahu tentang aplikasi "${appName}" pada peranti mereka "${userDevice}".
Soalan pengguna: "${query}".
Berikan jawapan ringkas, teknikal tetapi mudah difahami (maksimum 3 perenggan) dalam Bahasa Melayu yang mesra, menyertakan nasihat keserasian dan tips penggunaan terbaik daripada RazifApps@nasadef®.`;

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, temperature: 0.6 })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text;
    }
  } catch (err) {
    console.warn('Gemini advisor call failed, falling back:', err);
  }

  return `Berdasarkan peranti ${userDevice}, aplikasi ${appName} sangat disyorkan. Aplikasi ini telah dioptimumkan oleh pasukan RazifApps@nasadef® dengan penggunaan memori yang cekap dan integrasi perkakasan yang lancar. Untuk prestasi terbaik, pastikan peranti mempunyai sekurang-kurangnya ruang kosong storan yang disyorkan dan gunakan akaun Rasmi Nasadef untuk kelajuan muat turun tanpa had.`;
}
