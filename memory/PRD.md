# Lezzet Dolu Sıfatlar — PRD

## Original Problem Statement
Türkiye Maarif Modeli'ne uygun, 6. sınıf Türkçe dersi "Sıfat Türleri" konusunu öğretmek üzere tasarlanmış etkileşimli bir restoran simülasyon oyunu. Oyuncu yeni gelen müşteri, rehber ise Garson Sıfat Bey. 6 sahne öngörülmüştür; MVP olarak Sahne 1-2-3 + Öğretmen Paneli teslim edilmiştir.

## User Choices
- Sesli anlatım: **Tarayıcı Web Speech API (ücretsiz, Türkçe)**
- Veri saklama: **MongoDB + Öğretmen Paneli**
- Tema: **Sıcak sarı-turuncu Türk lokantası teması**
- Kapsam: **MVP (Sahne 1-2-3) önce, kalan sahneler sonra**
- Öğretmen raporu: **Var**

## Architecture
- **Backend**: FastAPI + Motor (MongoDB), `/api` prefix, 6 endpoint
- **Frontend**: React 19 + react-router-dom 7 + Tailwind + shadcn/ui + sonner
- **Tasarım**: Fraunces (display) + Literata (body) + JetBrains Mono (sayılar). Terracotta (#C44900), Saffron (#D68C45), Cream (#F9F6F0), Wood (#3E2723), Gold (#D4AF37) paleti
- **TTS**: Tarayıcı SpeechSynthesis API (lang=tr-TR)

## User Personas
- **Birincil**: 11-12 yaşında 6. sınıf öğrencisi (Türkçe dersi)
- **İkincil**: Türkçe öğretmeni (sınıf raporu için)

## Core Requirements (Static)
- 6 sahnelik tasarım: Karşılama → Masa → Menü → Sipariş → Beklenmedik Müşteri → Boss
- Tümevarım yöntemi (örnek → kural)
- Anlık geri bildirim (toast tabanlı)
- Sürükle-bırak/tıklama/çoktan seçmeli mekanikler
- Türk lokantası atmosferi
- Maarif Modeli değerleri (misafirperverlik, nezaket, paylaşım)

## Implemented (2026-02 — Iteration 3)
- ✅ **Sahne 6 (Boss): Şef'in Sınavı** — 15 karışık cümle, her sıfat için 3 katmanlı puan
  - Tespit (sıfatı tıkla): +1 · Tür seçimi (5 buton): +2 · Gerekçe (textarea, anahtar kelime auto-grade): +3
  - 15 × 6 = max 90 puan
  - 5 sıfat türünden 3'er soru; tasarım: koyu kahverengi şef başlığı + altın aksan
- ✅ Öğretmen paneli: 6 sahne sütunu/kartı (lg:grid-cols-6, colSpan=11)
- ✅ Hesap fişi: 6 satır
- ✅ Landing: "6 sahnelik", hero metni güncellendi (5 sıfat türü + Boss)
- ✅ E2E test: tam akış 126/126 puan ile geçti (Scene 6 Boss perfect 90/90)

**Yeni grand total**: 36 + 90 = **126 puan**

## Implemented (2026-02 — Iteration 2)
- ✅ **Sahne 4: Soru Sıfatları** — sipariş alma diyaloğu, 5 token (hangi/kaç/kaçıncı/ne/nasıl) + 3 cümle alıştırması (max 8 puan)
- ✅ **Sahne 5: Belgisiz Sıfatlar** — tatlı sürprizi diyaloğu, 4 token (bazı/birkaç/hiçbir/tüm) + 3 cümle (her/birçok/bütün, max 7 puan)
- ✅ Generic `IdentifyScene` bileşeni (DRY için) — Sahne 4 ve 5 paylaşıyor
- ✅ Öğretmen paneli: 5 sahne sütunu + breakdown kartları (lg:grid-cols-5)
- ✅ Hesap fişi: 5 satırlı sahne özeti
- ✅ Landing: "5 sahnelik" güncellendi
- ✅ E2E test: tam akış 36/36 puan ile geçti (Scene 1: 9 + 2: 4 + 3: 8 + 4: 8 + 5: 7)

## Implemented (2026-02 — Iteration 1)
- ✅ Landing sayfası (rezervasyon defteri tarzı isim girişi)
- ✅ Sahne 1: Niteleme sıfatları — diyalog içinde tıklama + 3 cümle alıştırması (max 9 puan)
- ✅ Sahne 2: İşaret sıfatları — 3 nesne mesafe görselleştirmesi + 4 çoktan seçmeli (max 4 puan)
- ✅ Sahne 3: Sayı sıfatları — 8 kart, 4 alt tür kategorisine yerleştirme (max 8 puan)
- ✅ Hesap fişi tarzı sonuç ekranı
- ✅ Öğretmen paneli: stat kartları, sahne ortalamaları, oturum tablosu, filtreleme
- ✅ Web Speech API ile Türkçe TTS (her diyalogda play/stop butonu)
- ✅ MongoDB persistence: oturum oluşturma, sahne kayıt, tamamlama
- ✅ Backend pytest: 11/11 geçti
- ✅ E2E Playwright: tam akış 21/21 puan ile geçti

**Toplam max puan**: Scene 1 (9) + Scene 2 (4) + Scene 3 (8) = **21**

## Backlog (P0/P1/P2)

### P0 — Sonraki Iteration
- [ ] **Canlı Turnuva Modu**: Öğretmen oda kodu oluşturur, öğrenciler katılır, aynı anda Boss seviyeyi çözer, canlı liderlik tablosu (websocket veya polling)

### P1
- [ ] Öğretmen paneli: oturum detay sayfası (her cevabın ayrıntısı)
- [ ] PDF rapor indirme (öğretmen için)
- [ ] Yanlış yapılan sıfatların özeti / "tekrar et" modu
- [ ] Sınıf bazında karşılaştırma grafiği (recharts)

### P2
- [ ] Erişilebilirlik: klavye navigasyonu, ARIA etiketleri ekleme
- [ ] Mobil dokunmatik için sürükle-bırak (Sahne 3)
- [ ] Avatar seçimi (öğrenci için)
- [ ] Liderlik tablosu (sınıf içi)
- [ ] FastAPI lifespan handler'a geçiş (deprecation)

## Known Limitations
- Web Speech API ses kalitesi tarayıcıya bağlıdır (Edge/Chrome'da daha iyi Türkçe)
- Sürükle-bırak yerine "tıkla → kategori seç" akışı (mobil dostu)
- 6 sahne yerine 3 sahne MVP teslim edildi (kullanıcı tercihi)
