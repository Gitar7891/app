// Scene content, exercises, answer keys for Lezzet Dolu Sıfatlar

export const ADJ_COLORS = {
  niteleme: "#C44900",
  isaret: "#D68C45",
  sayi: "#4A6741",
  soru: "#2C4251",
  belgisiz: "#8C7A6B",
};

export const ADJ_LABELS = {
  niteleme: "Niteleme Sıfatı",
  isaret: "İşaret Sıfatı",
  sayi: "Sayı Sıfatı",
  soru: "Soru Sıfatı",
  belgisiz: "Belgisiz Sıfat",
};

// ============ SAHNE 1 ============
export const SCENE_1 = {
  id: "scene_1",
  title: "Karşılama — Niteleme Sıfatları",
  subtitle: "Sahne 1 / 3",
  waiterIntro: [
    "Hoş geldiniz! Ben Sıfat Bey.",
    "Şık restoranımıza güzel bir akşam için geldiniz.",
    "Size geniş, aydınlık bir köşe masa ayarlayayım.",
  ],
  // Dialog metni kelime kelime; is_adj=true olanlar niteleme sıfatı
  dialogTokens: [
    { t: "Hoş geldiniz!" },
    { t: "Ben Sıfat Bey." },
    { t: "Size" },
    { t: "şık", isAdj: true },
    { t: "bir masa hazırladım:" },
    { t: "geniş", isAdj: true },
    { t: "," },
    { t: "aydınlık", isAdj: true },
    { t: "ve" },
    { t: "sıcak", isAdj: true },
    { t: "bir köşe.", final: true },
  ],
  rule:
    "Niteleme sıfatları; varlıkların rengini, biçimini, durumunu veya özelliğini bildirir. (Örn. kırmızı elma, geniş masa)",
  // Ikinci egzersiz: sürükle-bırak benzeri, 3 cümlede doğru olanları seç
  multiSentence: [
    {
      id: "s1_q1",
      sentence: "Müşterimize taze ekmek getiriyoruz.",
      words: ["Müşterimize", "taze", "ekmek", "getiriyoruz."],
      correct: ["taze"],
    },
    {
      id: "s1_q2",
      sentence: "Mutfaktan sıcak, lezzetli çorbalar çıkıyor.",
      words: ["Mutfaktan", "sıcak", ",", "lezzetli", "çorbalar", "çıkıyor."],
      correct: ["sıcak", "lezzetli"],
    },
    {
      id: "s1_q3",
      sentence: "Bahçemizde büyük, yeşil ağaçlar var.",
      words: ["Bahçemizde", "büyük", ",", "yeşil", "ağaçlar", "var."],
      correct: ["büyük", "yeşil"],
    },
  ],
  values: "Misafirperverlik: Garson her cümlede nezaket ifadeleri kullanır.",
};

// ============ SAHNE 2 ============
export const SCENE_2 = {
  id: "scene_2",
  title: "Masa Yönlendirmesi — İşaret Sıfatları",
  subtitle: "Sahne 2 / 3",
  waiterIntro: [
    "Buyurun efendim, şuradaki masa sizin yeriniz.",
    "Bu sandalyeye, şu köşe koltuğa ya da o pencere kenarına oturabilirsiniz.",
    "Şu vazo hoş değil mi?",
  ],
  rule:
    "İşaret sıfatları, varlıkları yer bakımından gösterir: bu (yakın), şu (orta), o (uzak), böyle, şöyle, öyle…",
  // Mesafe görselleştirmesi — 3 nesne (yakın, orta, uzak)
  objects: [
    { id: "near", label: "Sandalye", distance: "yakın", correct: "bu" },
    { id: "mid", label: "Köşe Koltuk", distance: "orta", correct: "şu" },
    { id: "far", label: "Pencere Kenarı", distance: "uzak", correct: "o" },
  ],
  // Fill in the blank soruları
  questions: [
    {
      id: "s2_q1",
      text: "___ sandalyeye oturabilirsiniz (yanınızdaki için).",
      options: ["bu", "şu", "o"],
      answer: "bu",
      targetObject: "near",
    },
    {
      id: "s2_q2",
      text: "___ köşe koltuğa geçelim (biraz uzaktaki için).",
      options: ["bu", "şu", "o"],
      answer: "şu",
      targetObject: "mid",
    },
    {
      id: "s2_q3",
      text: "___ pencere kenarı da boş (en uzaktaki için).",
      options: ["bu", "şu", "o"],
      answer: "o",
      targetObject: "far",
    },
    {
      id: "s2_q4",
      text: "“Böyle bir akşam yemeğine doyum olmaz.” Bu cümledeki işaret sıfatı hangisidir?",
      options: ["akşam", "böyle", "doyum", "yemeğine"],
      answer: "böyle",
    },
  ],
  values: "Nezaket: Garson müşteriyi zorlamaz, seçenek sunar.",
};

// ============ SAHNE 3 ============
export const SCENE_3 = {
  id: "scene_3",
  title: "Menü — Sayı Sıfatları",
  subtitle: "Sahne 3 / 3",
  waiterIntro: [
    "Menümüzde iki çeşit çorba, beş ana yemek var.",
    "Birinci sayfada tatlılar, üçüncü sayfada içecekler bulunur.",
    "İkişer ekmek getireyim mi? Yarım porsiyon isteyen olursa da çekinmeyin.",
  ],
  rule:
    "Sayı sıfatları varlığın sayısını bildirir. Dört alt türü vardır: asıl (iki), sıra (birinci), üleştirme (ikişer), kesir (yarım).",
  categories: [
    { id: "asil", label: "Asıl Sayı", desc: "Kesin miktar", color: "#D4AF37" },
    { id: "sira", label: "Sıra Sayı", desc: "Sıra/derece", color: "#2C4251" },
    { id: "ulestirme", label: "Üleştirme", desc: "Eşit paylaşım", color: "#4A6741" },
    { id: "kesir", label: "Kesir", desc: "Parça", color: "#C44900" },
  ],
  // Kartlar: sıfat + tür anahtarı
  cards: [
    { id: "c1", phrase: "iki çorba", answer: "asil" },
    { id: "c2", phrase: "beş ana yemek", answer: "asil" },
    { id: "c3", phrase: "birinci sayfa", answer: "sira" },
    { id: "c4", phrase: "üçüncü kat", answer: "sira" },
    { id: "c5", phrase: "ikişer ekmek", answer: "ulestirme" },
    { id: "c6", phrase: "dörder kişilik", answer: "ulestirme" },
    { id: "c7", phrase: "yarım porsiyon", answer: "kesir" },
    { id: "c8", phrase: "çeyrek elma", answer: "kesir" },
  ],
  values: "Paylaşım: Üleştirme sıfatları eşit paylaşımı hatırlatır.",
};

export const SCENES = [SCENE_1, SCENE_2, SCENE_3];
