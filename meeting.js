export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const brief = String(body?.brief || '').trim();
    if (!brief) return json({ error: 'Brief wajib diisi.' }, 400);
    if (brief.length > 1200) return json({ error: 'Brief terlalu panjang (maksimum 1200 karakter).' }, 413);
    const key = env.GEMINI_API_KEY;
    if (!key) return json({ error: 'GEMINI_API_KEY belum diatur sebagai Secret di Cloudflare Pages.' }, 503);
    const team = Array.isArray(body?.team) ? body.team.slice(0, 6) : [];
    const prompt = `Kamu adalah Nexus Office AI, koordinator tim kreatif virtual. Buat output kerja yang nyata dan spesifik berdasarkan brief. Jangan mengklaim telah membuat file, mengirim pesan, membuka aplikasi, atau melakukan aksi eksternal. Agen yang tersedia: ${team.map(a => `${String(a.name || '').slice(0,30)} (${String(a.role || '').slice(0,50)}): ${String(a.desc || '').slice(0,160)}`).join('; ')}.\n\nFormat jawaban:\n1. RINGKASAN BRIEF\n2. RENCANA TIAP AGEN (sebut nama agen dan tugas/hasil spesifik masing-masing)\n3. HASIL KERJA / DRAF UTAMA\n4. CHECKLIST DAN HAL YANG PERLU DIKONFIRMASI\nBila brief kurang detail, sebutkan asumsi yang digunakan. Jawab dalam Bahasa Indonesia santai-profesional.\n\nBRIEF USER:\n${brief}`;
    const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2200 } })
    });
    const payload = await upstream.json();
    if (!upstream.ok) {
      console.error('Gemini error', upstream.status, payload?.error?.message);
      return json({ error: 'Gemini menolak permintaan. Periksa API key, kuota, dan nama model di pengaturan.' }, 502);
    }
    const result = (payload.candidates || []).flatMap(c => c.content?.parts || []).map(p => p.text || '').join('\n').trim();
    if (!result) return json({ error: 'Model AI tidak mengembalikan teks.' }, 502);
    return json({ result, model });
  } catch (err) {
    console.error('Nexus API error', err);
    return json({ error: 'Permintaan gagal diproses. Coba lagi.' }, 500);
  }
}

export async function onRequestGet() {
  return json({ ok: true, service: 'Nexus Office AI', endpoint: '/api/meeting', method: 'POST' });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
