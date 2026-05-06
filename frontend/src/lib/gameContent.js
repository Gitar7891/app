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

// ============ SAHNE 4 ============
export const SCENE_4 = {
  id: "scene_4",
  title: "Sipariş Soruları — Soru Sıfatları",
  subtitle: "Sahne 4 / 5",
  accent: "soru",
  waiterIntro: [
    "Şimdi siparişinizi alabilir miyim efendim?",
    "Hangi masayı tercih edersiniz, kaç kişi olacaksınız?",
    "Kaçıncı sıradaki yere geçelim?",
    "Ne tür bir yemek arzu edersiniz, nasıl bir tatlı istersiniz?",
  ],
  dialogTokens: [
    { t: "Sipariş alıyorum efendim." },
    { t: "Hangi", isAdj: true },
    { t: "masayı tercih edersiniz?" },
    { t: "Kaç", isAdj: true },
    { t: "kişi olacaksınız?" },
    { t: "Kaçıncı", isAdj: true },
    { t: "sıradaki yere geçelim?" },
    { t: "Ne", isAdj: true },
    { t: "tür yemek arzu edersiniz?" },
    { t: "Nasıl", isAdj: true },
    { t: "bir tatlı düşünüyorsunuz?", final: true },
  ],
  rule:
    "Soru sıfatları, isimleri soru yoluyla niteler ve her zaman isimden önce gelir: hangi masa, kaç kişi, ne tür, nasıl bir, kaçıncı sıra.",
  multiSentence: [
    {
      id: "s4_q1",
      sentence: "Hangi tatlıyı seçeceksiniz?",
      words: ["Hangi", "tatlıyı", "seçeceksiniz?"],
      correct: ["Hangi"],
    },
    {
      id: "s4_q2",
      sentence: "Kaç porsiyon getirelim?",
      words: ["Kaç", "porsiyon", "getirelim?"],
      correct: ["Kaç"],
    },
    {
      id: "s4_q3",
      sentence: "Nasıl bir kahve içersiniz?",
      words: ["Nasıl", "bir", "kahve", "içersiniz?"],
      correct: ["Nasıl"],
    },
  ],
  values: "Nezaket: Garson seçenek sunarak müşteriyi yönlendirir, dayatmaz.",
};

// ============ SAHNE 5 ============
export const SCENE_5 = {
  id: "scene_5",
  title: "Tatlı Sürprizi — Belgisiz Sıfatlar",
  subtitle: "Sahne 5 / 5",
  accent: "belgisiz",
  waiterIntro: [
    "Akşamın sonuna yaklaştık efendim.",
    "Bazı masalara özel tatlı hazırladık.",
    "Birkaç çeşit dondurma da var.",
    "Hiçbir misafirimizi boş göndermeyiz; tüm masalara ikramımız olacak.",
  ],
  dialogTokens: [
    { t: "Akşamın sonuna yaklaştık." },
    { t: "Bazı", isAdj: true },
    { t: "masalara özel tatlı hazırladık." },
    { t: "Birkaç", isAdj: true },
    { t: "çeşit dondurma var." },
    { t: "Hiçbir", isAdj: true },
    { t: "misafirimizi boş göndermeyiz." },
    { t: "Tüm", isAdj: true },
    { t: "masalara ikramımız olacak.", final: true },
  ],
  rule:
    "Belgisiz sıfatlar, isimlerin sayısını ya da miktarını kesin olmayan biçimde belirtir: bazı, birkaç, hiçbir, tüm, her, birçok, bütün…",
  multiSentence: [
    {
      id: "s5_q1",
      sentence: "Her gece farklı bir özel menü hazırlıyoruz.",
      words: ["Her", "gece", "farklı", "bir", "özel", "menü", "hazırlıyoruz."],
      correct: ["Her"],
    },
    {
      id: "s5_q2",
      sentence: "Birçok müşteri bizi tercih ediyor.",
      words: ["Birçok", "müşteri", "bizi", "tercih", "ediyor."],
      correct: ["Birçok"],
    },
    {
      id: "s5_q3",
      sentence: "Bütün çocuklara şeker ikram ediyoruz.",
      words: ["Bütün", "çocuklara", "şeker", "ikram", "ediyoruz."],
      correct: ["Bütün"],
    },
  ],
  values: "Paylaşım & Misafirperverlik: Restoran herkese özen gösterir, kimseyi ayırmaz.",
};

// ============ SAHNE 6 — BOSS ============
// Each question: identify adj (+1) → pick type (+2) → write justification (+3)
// justKeywords: any of these (case-insensitive, Turkish) in user's reasoning grants full +3
export const SCENE_6 = {
  id: "scene_6",
  title: "Şef'in Sınavı — Genel Tekrar",
  subtitle: "Sahne 6 / 6 · BOSS",
  accent: "#3E2723",
  intro: [
    "Akşam bitti, şefimiz size son bir sınav hazırladı.",
    "Her cümlede sıfatı bulun, türünü seçin ve neden öyle olduğunu kısaca yazın.",
    "Tespit +1 · Tür +2 · Gerekçe +3 puan",
  ],
  questions: [
    // NITELEME (3)
    {
      id: "b1",
      sentence: "Bahçemizdeki kırmızı güller çok güzel.",
      words: ["Bahçemizdeki", "kırmızı", "güller", "çok", "güzel"],
      correctAdj: "kırmızı",
      correctType: "niteleme",
      justKeywords: ["niteleme", "renk", "özellik", "nitelik", "nasıl"],
    },
    {
      id: "b2",
      sentence: "Sıcak çorbamız sofraya geldi.",
      words: ["Sıcak", "çorbamız", "sofraya", "geldi"],
      correctAdj: "Sıcak",
      correctType: "niteleme",
      justKeywords: ["niteleme", "durum", "özellik", "nitelik"],
    },
    {
      id: "b3",
      sentence: "Yeşil bir ev gördüm.",
      words: ["Yeşil", "bir", "ev", "gördüm"],
      correctAdj: "Yeşil",
      correctType: "niteleme",
      justKeywords: ["niteleme", "renk", "özellik"],
    },
    // ISARET (3)
    {
      id: "b4",
      sentence: "Bu masaya oturalım.",
      words: ["Bu", "masaya", "oturalım"],
      correctAdj: "Bu",
      correctType: "isaret",
      justKeywords: ["işaret", "yakın", "gösterir", "yer"],
    },
    {
      id: "b5",
      sentence: "Şu kitabı okumalısın.",
      words: ["Şu", "kitabı", "okumalısın"],
      correctAdj: "Şu",
      correctType: "isaret",
      justKeywords: ["işaret", "orta", "gösterir", "yer"],
    },
    {
      id: "b6",
      sentence: "O çocuk hızlı koşuyor.",
      words: ["O", "çocuk", "hızlı", "koşuyor"],
      correctAdj: "O",
      correctType: "isaret",
      justKeywords: ["işaret", "uzak", "gösterir", "yer"],
    },
    // SAYI (3)
    {
      id: "b7",
      sentence: "Üç tane elma aldım.",
      words: ["Üç", "tane", "elma", "aldım"],
      correctAdj: "Üç",
      correctType: "sayi",
      justKeywords: ["sayı", "asıl", "miktar", "kaç"],
    },
    {
      id: "b8",
      sentence: "Birinci sırada bekliyoruz.",
      words: ["Birinci", "sırada", "bekliyoruz"],
      correctAdj: "Birinci",
      correctType: "sayi",
      justKeywords: ["sayı", "sıra", "kaçıncı", "derece"],
    },
    {
      id: "b9",
      sentence: "Yarım ekmek yedik.",
      words: ["Yarım", "ekmek", "yedik"],
      correctAdj: "Yarım",
      correctType: "sayi",
      justKeywords: ["sayı", "kesir", "parça", "yarım"],
    },
    // SORU (3)
    {
      id: "b10",
      sentence: "Hangi kitabı okudun?",
      words: ["Hangi", "kitabı", "okudun"],
      correctAdj: "Hangi",
      correctType: "soru",
      justKeywords: ["soru", "sorar", "isim", "önce"],
    },
    {
      id: "b11",
      sentence: "Kaç kişi geldi?",
      words: ["Kaç", "kişi", "geldi"],
      correctAdj: "Kaç",
      correctType: "soru",
      justKeywords: ["soru", "miktar", "sayı", "sorar"],
    },
    {
      id: "b12",
      sentence: "Nasıl bir araba istiyorsun?",
      words: ["Nasıl", "bir", "araba", "istiyorsun"],
      correctAdj: "Nasıl",
      correctType: "soru",
      justKeywords: ["soru", "nitelik", "sorar", "özellik"],
    },
    // BELGISIZ (3)
    {
      id: "b13",
      sentence: "Bazı insanlar geç kaldı.",
      words: ["Bazı", "insanlar", "geç", "kaldı"],
      correctAdj: "Bazı",
      correctType: "belgisiz",
      justKeywords: ["belgisiz", "belirsiz", "kesin değil", "miktar"],
    },
    {
      id: "b14",
      sentence: "Birkaç çocuk parka gitti.",
      words: ["Birkaç", "çocuk", "parka", "gitti"],
      correctAdj: "Birkaç",
      correctType: "belgisiz",
      justKeywords: ["belgisiz", "belirsiz", "az", "kesin değil"],
    },
    {
      id: "b15",
      sentence: "Hiçbir öğrenci kalmamış.",
      words: ["Hiçbir", "öğrenci", "kalmamış"],
      correctAdj: "Hiçbir",
      correctType: "belgisiz",
      justKeywords: ["belgisiz", "yokluk", "olumsuz", "kesin değil"],
    },
  ],
  values:
    "Düzenli çalışma: Akşam boyunca öğrendiklerini şefimize göstererek emeğini taçlandırırsın.",
};

export const SCENES = [SCENE_1, SCENE_2, SCENE_3, SCENE_4, SCENE_5, SCENE_6];
