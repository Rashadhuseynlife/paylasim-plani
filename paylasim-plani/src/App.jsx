import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  ImagePlus, X, Plus, Sparkles, Loader2, RefreshCw, Copy, Download,
  AlertCircle, Check, Calendar, Layers, Unlink, CheckCircle2, Circle,
  RotateCcw, FileText, XCircle, Info, Sun, Moon,
} from 'lucide-react';
import fabrikaIconDark from './assets/fabrika-icon-dark.svg';
import fabrikaIconLight from './assets/fabrika-icon-light.svg';
import azerbaijanFlagSrc from './assets/azerbaijan.svg';
import russiaFlagSrc from './assets/russia.svg';

/* ====================================================================
   İNTERFEYS TƏRCÜMƏ LÜĞƏTİ (AZ / RU)
   Bu, tətbiqin interfeys dilini idarə edir (düymələr, başlıqlar,
   izahatlar). AI-a göndərilən caption promptları ilə HEÇ BİR ƏLAQƏSİ
   yoxdur — caption dili ayrıca "Rus dili tərcüməsi" checkbox-ı ilə
   idarə olunur (yuxarıda izah edildiyi kimi, bunlar tamamilə ayrı
   sistemlərdir).
   ==================================================================== */
const TRANSLATIONS = {
  az: {
    appSubtitle: 'Sosial Media Planlayıcı',
    appTitle: 'Aylıq Paylaşım Planı',
    appDesc: 'Şəkilləri yüklə, AI kateqoriyaları təxmin etsin, captionları əlavə et — sənin üçün ay boyu məntiqli ardıcıllıqla paylaşım planı qurulsun.',
    darkModeOn: 'Qaranlıq görünüşə keç',
    darkModeOff: 'İşıqlı görünüşə keç',
    tabPhotos: '1. Şəkillər',
    tabCategories: '2. Kateqoriyalar',
    tabCaptions: '3. Captionlar',
    tabPlan: '4. Plan',
    aiProvider: 'AI Provayder',
    aiFallbackAnthropic: '⚡ Limit olduqda avtomatik OpenAI → Gemini-yə keçəcək.',
    aiKeysNote: 'Açarlar Cloudflare Worker-də saxlanılır.',
    aiFallbackOther: '⚡ Açarlar Cloudflare Worker-də saxlanılır. Limit olduqda avtomatik yedəyə keçər.',
    russianToggle: '🇷🇺 Rus dili tərcüməsini caption-a əlavə et (AZ + RU bir caption-da)',
    venueTitle: 'Məkan',
    venueDesc: 'Bu planın hansı məkana aid olduğunu seç. Caption yazanda da bu ad istifadə ediləcək.',
    venueAddPlaceholder: 'Yeni məkan əlavə et (məs. Nargile Club)',
    addBtn: 'Əlavə et',
    venueSelected: 'Seçildi',
    uploadTitle: 'Şəkilləri yüklə',
    uploadDrag: 'Şəkilləri buraya sürüklə, yaxud kliklə',
    uploadHint: 'JPG, PNG və s. — istənilən fayl adı qəbul olunur, nömrələnmə avtomatikdir',
    photosUploaded: 'Yüklənmiş şəkillər',
    selectModeBtn: 'Seç',
    deleteModeBtn: 'Sil',
    carouselBtn: 'Karusel et',
    unlinkBtn: 'Ayır',
    deleteSelectedBtn: 'Seçilənləri sil',
    deleteAllBtn: 'Hamısını sil',
    confirmDeleteAll: 'Silməyi təsdiqlə',
    filterAll: 'Hamısı',
    filterCarousel: 'Karusellər',
    filterSingle: 'Tək şəkillər',
    nextBtn: 'Növbəti',
    categoriesTitle: 'Kateqoriya siyahısı',
    categoriesDesc: 'AI yalnız bu siyahıdan seçəcək.',
    categoryAddPlaceholder: 'Yeni kateqoriya (məs. Şirniyyat)',
    photoCategoriesTitle: 'Şəkillərin kateqoriyası',
    photoCategoriesProgress: 'şəkil kateqoriyalandı.',
    aiGuessBtn: 'AI ilə təxmin et',
    aiGuessingBtn: 'AI təxmin edir...',
    cat1Placeholder: '— 1ci kateqoriya —',
    cat2Placeholder: '+ 2ci kateqoriya (istəyə bağlı)',
    otherCategory: 'Digər',
    productNamePlaceholder: 'Məhsul adı (məs. Strawberry Cheesecake)',
    personNamePlaceholder: 'Şəxs adı (məs. DJ Vugarixx)',
    backBtn: 'Geri',
    captionsManualTitle: 'Captionları yapışdır',
    captionsManualDesc: 'Öz captionlarını yaz, ya generate etdiklərini kopyalayıb buraya yapışdır. Hər captionu şəkil nömrəsi ilə başla — məs.',
    captionsManualExample: '1. Şəhərin ən gözəl mənzərəsi',
    aiCaptionGenTitle: 'AI Caption Generator',
    aiCaptionGenDesc: 'AI hər şəkli görür və caption yazır. İstəsən şablon göndər — AI o üslubda yazacaq.',
    captionGuideLabel: 'ŞABLON (İSTƏYƏ BAĞLI) — ÖZ CAPTIONLARINDAN NÜMUNƏ YAPIŞDIR',
    generateAllBtn: 'Hamısı üçün caption yaz',
    generatingBtn: 'Yazılır...',
    copyAllBtn: 'Hamısını kopyala',
    addAllToPasteBtn: 'Paste bölməsinə əlavə et',
    planSectionTitle: 'Plan',
    monthLabel: 'Ay',
    yearLabel: 'İl',
    generatePlanBtn: 'Plan yarat',
    reshuffleBtn: 'Yenidən qarışdır',
    savePlanBtn: 'Planı saxla',
    savedBtn: 'Saxlanıldı',
    editBtn: 'Redaktə',
    copyBtn: 'Kopyala',
    doneBtn: 'Tamamlandı',
    carouselLabel: 'Karusel',
  },
  ru: {
    appSubtitle: 'Планировщик соцсетей',
    appTitle: 'Месячный план публикаций',
    appDesc: 'Загрузи фото, AI определит категории, добавь подписи — для тебя будет составлен логичный план публикаций на весь месяц.',
    darkModeOn: 'Включить тёмный режим',
    darkModeOff: 'Включить светлый режим',
    tabPhotos: '1. Фото',
    tabCategories: '2. Категории',
    tabCaptions: '3. Подписи',
    tabPlan: '4. План',
    aiProvider: 'AI Провайдер',
    aiFallbackAnthropic: '⚡ При лимите автоматически переключится на OpenAI → Gemini.',
    aiKeysNote: 'Ключи хранятся в Cloudflare Worker.',
    aiFallbackOther: '⚡ Ключи хранятся в Cloudflare Worker. При лимите переключится на резервный.',
    russianToggle: '🇷🇺 Добавить русский перевод к подписи (AZ + RU в одной подписи)',
    venueTitle: 'Место',
    venueDesc: 'Выбери, к какому месту относится этот план. Это название будет использовано и при написании подписи.',
    venueAddPlaceholder: 'Добавить новое место (напр. Nargile Club)',
    addBtn: 'Добавить',
    venueSelected: 'Выбрано',
    uploadTitle: 'Загрузить фото',
    uploadDrag: 'Перетащи фото сюда или нажми',
    uploadHint: 'JPG, PNG и др. — любое имя файла подходит, нумерация автоматическая',
    photosUploaded: 'Загруженные фото',
    selectModeBtn: 'Выбрать',
    deleteModeBtn: 'Удалить',
    carouselBtn: 'Сделать карусель',
    unlinkBtn: 'Разделить',
    deleteSelectedBtn: 'Удалить выбранные',
    deleteAllBtn: 'Удалить всё',
    confirmDeleteAll: 'Подтвердить удаление',
    filterAll: 'Все',
    filterCarousel: 'Карусели',
    filterSingle: 'Одиночные',
    nextBtn: 'Далее',
    categoriesTitle: 'Список категорий',
    categoriesDesc: 'AI будет выбирать только из этого списка.',
    categoryAddPlaceholder: 'Новая категория (напр. Десерт)',
    photoCategoriesTitle: 'Категории фото',
    photoCategoriesProgress: 'фото категоризировано.',
    aiGuessBtn: 'Угадать с помощью AI',
    aiGuessingBtn: 'AI угадывает...',
    cat1Placeholder: '— 1-я категория —',
    cat2Placeholder: '+ 2-я категория (необязательно)',
    otherCategory: 'Другое',
    productNamePlaceholder: 'Название продукта (напр. Strawberry Cheesecake)',
    personNamePlaceholder: 'Имя человека (напр. DJ Vugarixx)',
    backBtn: 'Назад',
    captionsManualTitle: 'Вставить подписи',
    captionsManualDesc: 'Напиши свои подписи или скопируй сгенерированные и вставь сюда. Начинай каждую подпись с номера фото — напр.',
    captionsManualExample: '1. Лучший вид города',
    aiCaptionGenTitle: 'AI Генератор подписей',
    aiCaptionGenDesc: 'AI видит каждое фото и пишет подпись. Можешь отправить образец — AI напишет в этом стиле.',
    captionGuideLabel: 'ОБРАЗЕЦ (НЕОБЯЗАТЕЛЬНО) — ВСТАВЬ ПРИМЕР СВОИХ ПОДПИСЕЙ',
    generateAllBtn: 'Написать подписи для всех',
    generatingBtn: 'Пишется...',
    copyAllBtn: 'Скопировать все',
    addAllToPasteBtn: 'Добавить в поле вставки',
    planSectionTitle: 'План',
    monthLabel: 'Месяц',
    yearLabel: 'Год',
    generatePlanBtn: 'Создать план',
    reshuffleBtn: 'Перемешать снова',
    savePlanBtn: 'Сохранить план',
    savedBtn: 'Сохранено',
    editBtn: 'Редактировать',
    copyBtn: 'Копировать',
    doneBtn: 'Готово',
    carouselLabel: 'Карусель',
  },
};

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];


/* ====================================================================
   DÜZƏLİŞ QEYDLƏRİ
   1. TypeScript sintaksisi (interface, generic, "as X", "!") tamamilə
      silindi — fayl .jsx kimi sadə Babel/JSX mühitində compile olunur.
   2. PALETTE-ə əlavə rənglər əlavə olundu — əvvəlcə 9 rəng/10 default
      kateqoriya uyğunsuzluğu var idi, 10-cu kateqoriya 1-ci ilə eyni
      rəngi alırdı (idx % PALETTE.length = 9 % 9 = 0).
   3. getCatColor indi ikili kateqoriya sətirlərini ("Qəhvə / Şərab") də
      dəstəkləyir — əvvəlcə belə sətirlər həmişə "Digər" rənginə düşürdü.
   4. removeCategory ikili kateqoriya sətirlərindəki orfan adları da
      təmizləyir (əvvəlcə yalnız tam uyğunluğa baxılırdı).
   5. "1ci kateqoriya" sıfırlananda (boş seçim) yarımçıq " / Cat2" sətri
      yaranması düzəldildi — indi cat2 varsa o, əsas kateqoriyaya keçir.
   6. buildSequence-də sort comparator daxilindəki Math.random()
      çıxarıldı (qeyri-stabil comparator idi) — indi massiv sort-dan
      əvvəl qarışdırılır, sort sabit meyarla işləyir.
   7. exportPDF-də caption/kateqoriya/məkan adı HTML-ə yapışdırılmadan
      əvvəl escape olunur (əvvəlcə unescaped HTML injection riski var idi).
   8. ScheduleView-da yuxarı/aşağı sıralama düymələri indi filtr aktiv
      olanda (Qalan/Paylaşılan) düzgün GÖRÜNƏN qonşu posta görə işləyir —
      əvvəlcə gizli postlar arasında "görünməz" yerdəyişmə ola bilirdi.
   9. Fayl adından nömrə çıxarma məntiqi yaxşılaşdırıldı — əvvəlcə
      "IMG_2024_01.jpg" kimi adlarda "2024" tutulurdu, "01" yox.
   10. Kateqoriya/caption/karusel dəyişəndən sonra köhnəlmiş (stale) plan
       üçün xəbərdarlıq banner-i əlavə olundu.
   ==================================================================== */

/* ---------------------------------------------------------------- */
/* window.storage polyfill — claude.ai artifact sandbox-da bu API     */
/* hazır gəlir, amma müstəqil saytda (Pages) mövcud deyil. Eyni        */
/* interfeysi localStorage üzərində təmin edirik ki, kodun qalan      */
/* hissəsi dəyişmədən işləsin. "shared" parametri burada nəzərə        */
/* alınmır (hamısı brauzerin öz localStorage-ində saxlanılır).        */
/* ---------------------------------------------------------------- */
if (typeof window !== 'undefined' && !window.storage) {
  const PREFIX = 'pp-storage:';
  window.storage = {
    async get(key) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        if (raw === null) return null;
        return { key, value: raw, shared: false };
      } catch {
        return null;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, value);
        return { key, value, shared: false };
      } catch {
        return null;
      }
    },
    async delete(key) {
      try {
        localStorage.removeItem(PREFIX + key);
        return { key, deleted: true, shared: false };
      } catch {
        return null;
      }
    },
    async list(prefix = '') {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const fullKey = localStorage.key(i);
          if (fullKey && fullKey.startsWith(PREFIX)) {
            const bare = fullKey.slice(PREFIX.length);
            if (bare.startsWith(prefix)) keys.push(bare);
          }
        }
        return { keys, prefix, shared: false };
      } catch {
        return null;
      }
    },
  };
}


// Photo:       { id, filename, number, dataUrl, category }
// Carousel:    { id, numbers }
// PostItem:    { id, type: 'single'|'carousel', category, caption, coverNumber, photos }
// ScheduleDay: { day, posts }
// Toast:       { id, message, type: 'success'|'error'|'info' }

/* ---------------------------------------------------------------- */
/* Constants                                                          */
/* ---------------------------------------------------------------- */

const DEFAULT_CATEGORIES = [
  'İnteryer', 'FastFood', 'Desert', 'Qəhvə', 'İçki', 'Şərab',
  'Qonaqlar', 'Heyət', 'Eksteryer', 'Atmosfer',
];

const INITIAL_VENUE_PRESETS = ['Vista', 'Jasett', 'Belfast'];

const PALETTE = [
  { bg: 'bg-amber-100', text: 'text-amber-800', dot: '#d97706' },
  { bg: 'bg-rose-100', text: 'text-rose-800', dot: '#e11d48' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: '#059669' },
  { bg: 'bg-sky-100', text: 'text-sky-800', dot: '#0284c7' },
  { bg: 'bg-violet-100', text: 'text-violet-800', dot: '#7c3aed' },
  { bg: 'bg-orange-100', text: 'text-orange-800', dot: '#ea580c' },
  { bg: 'bg-teal-100', text: 'text-teal-800', dot: '#0d9488' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', dot: '#c026d3' },
  { bg: 'bg-lime-100', text: 'text-lime-800', dot: '#65a30d' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: '#0891b2' },
  { bg: 'bg-pink-100', text: 'text-pink-800', dot: '#db2777' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: '#4f46e5' },
];
const OTHER_COLOR = { bg: 'bg-stone-200', text: 'text-stone-600', dot: '#78716c' };
const GROUP_RINGS = ['ring-orange-400', 'ring-emerald-400', 'ring-violet-400', 'ring-sky-400', 'ring-rose-400', 'ring-amber-400'];
const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','İyun','İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'];

// YENİ: Çoxlu AI provayder dəstəyi. Claude bu mühitdə açarsız işləyir
// (açar artifact sandbox-u tərəfindən avtomatik əlavə edilir); OpenAI və
// Gemini üçün istifadəçi öz API açarını daxil etməlidir.
const AI_PROVIDERS = [
  { id: 'anthropic', label: 'Claude', needsKey: false, defaultModel: 'claude-sonnet-4-6' },
  { id: 'openai', label: 'OpenAI', needsKey: false, defaultModel: 'gpt-4o-mini' },
  { id: 'gemini', label: 'Google Gemini', needsKey: false, defaultModel: 'gemini-2.0-flash' },
];

function getCatColor(cat, categories) {
  if (!cat) return OTHER_COLOR;
  const direct = categories.indexOf(cat);
  if (direct !== -1) return PALETTE[direct % PALETTE.length];
  // İkili kateqoriya sətri olsa ("Qəhvə / Şərab"), əsas (birinci) hissəyə görə rəngləndir
  const primary = cat.split(' / ')[0];
  const idx = categories.indexOf(primary);
  if (idx === -1) return OTHER_COLOR;
  return PALETTE[idx % PALETTE.length];
}

function newCarouselId() {
  return `car_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------------------------------------------------------------- */
/* Helpers                                                            */
/* ---------------------------------------------------------------- */

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeDataURL(dataUrl, maxDim) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height) {
        if (width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
      } else {
        if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.src = dataUrl;
  });
}

function parseCaptions(text) {
  const map = new Map();
  if (!text) return map;
  const regex = /(?:^|\n)\s*(\d+)\s*[.)]\s*/g;
  const matches = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push({ num: parseInt(m[1], 10), markerStart: m.index, textStart: m.index + m[0].length });
  }
  for (let i = 0; i < matches.length; i++) {
    const end = i + 1 < matches.length ? matches[i + 1].markerStart : text.length;
    map.set(matches[i].num, text.slice(matches[i].textStart, end).trim());
  }
  return map;
}

function distributeDays(n, days) {
  const base = Math.floor(n / days);
  const rem = n % days;
  return Array.from({ length: days }, (_, i) => {
    const a = Math.floor((i + 1) * rem / days);
    const b = Math.floor(i * rem / days);
    return base + (a - b);
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildSequence(items) {
  // Video və şəkilləri ayırırıq, sonra videoları şəkillərin arasına
  // bərabər aralıqlarla "səpələyirik" ki, hamısı bir yerə yığılmasın.
  const videos = items.filter((it) => it.isVideo);
  const photosOnly = items.filter((it) => !it.isVideo);

  // Şəkillər üçün əvvəlki kateqoriya-balanslaşdırılmış ardıcıllığı qur
  const groups = {};
  photosOnly.forEach((it) => { (groups[it.category] = groups[it.category] || []).push(it); });
  const cats = Object.keys(groups).map((cat) => ({ cat, queue: shuffle(groups[cat]) }));
  const photoSeq = [];
  let last = null;
  while (cats.some((c) => c.queue.length > 0)) {
    let avail = cats.filter((c) => c.queue.length > 0 && c.cat !== last);
    if (avail.length === 0) avail = cats.filter((c) => c.queue.length > 0);
    avail = shuffle(avail);
    avail.sort((a, b) => b.queue.length - a.queue.length);
    const chosen = avail[0];
    photoSeq.push(chosen.queue.shift());
    last = chosen.cat;
  }

  if (videos.length === 0) return photoSeq;

  // Videoları şəkil ardıcıllığının arasına bərabər aralıqlarla yerləşdir.
  // Məs. 25 şəkil + 5 video → hər ~5 şəkildən sonra 1 video.
  const shuffledVideos = shuffle(videos);
  const result = [];
  const totalSlots = photoSeq.length + shuffledVideos.length;
  const videoInterval = photoSeq.length > 0 ? totalSlots / shuffledVideos.length : 1;
  let nextVideoSlot = videoInterval / 2; // birinci videoyu da əvvələ yığmamaq üçün yarımçıq sürüşdürürük
  let videoIdx = 0;
  let photoIdx = 0;

  for (let slot = 0; slot < totalSlots; slot++) {
    if (videoIdx < shuffledVideos.length && slot >= nextVideoSlot) {
      result.push(shuffledVideos[videoIdx]);
      videoIdx++;
      nextVideoSlot += videoInterval;
    } else if (photoIdx < photoSeq.length) {
      result.push(photoSeq[photoIdx]);
      photoIdx++;
    } else if (videoIdx < shuffledVideos.length) {
      result.push(shuffledVideos[videoIdx]);
      videoIdx++;
    }
  }
  return result;
}

function buildPostItems(photos, carousels, captionsMap) {
  const grouped = new Set();
  carousels.forEach((c) => c.numbers.forEach((n) => grouped.add(n)));
  const items = [];

  carousels.forEach((c) => {
    const members = c.numbers
      .map((n) => photos.find((p) => p.number === n))
      .filter(Boolean)
      .sort((a, b) => a.number - b.number);
    if (members.length === 0) return;
    const counts = {};
    members.forEach((m) => { const cat = m.category || 'Digər'; counts[cat] = (counts[cat] || 0) + 1; });
    let category = members[0].category || 'Digər';
    let max = 0;
    Object.entries(counts).forEach(([cat, cnt]) => { if (cnt > max) { max = cnt; category = cat; } });
    const cover = members[0];
    items.push({
      id: `carousel:${members.map((m) => m.number).join('-')}`,
      type: 'carousel', category,
      caption: captionsMap.get(cover.number) || '',
      coverNumber: cover.number,
      photos: members,
      isVideo: members.some((m) => m.isVideo), // carousel-də 1 video varsa, video kimi say
    });
  });

  photos.forEach((p) => {
    if (p.number != null && grouped.has(p.number)) return;
    items.push({
      id: `photo:${p.number != null ? p.number : p.id}`,
      type: 'single',
      category: p.category || 'Digər',
      caption: p.number != null ? (captionsMap.get(p.number) || '') : '',
      coverNumber: p.number,
      photos: [p],
      isVideo: !!p.isVideo,
    });
  });
  return items;
}

// Plan generasiya olunanda istifadə edilən "girişlərin" imzası — sonradan
// kateqoriya/caption/karusel dəyişib-dəyişmədiyini (planın köhnəlib-köhnəlmədiyini) yoxlamaq üçün.
function computeDataSignature(photos, carousels, captionsMap) {
  return JSON.stringify({
    photos: photos.map((p) => [p.id, p.category]),
    carousels: carousels.map((c) => [c.id, c.numbers]),
    captions: [...captionsMap.entries()],
  });
}

/* ---------------------------------------------------------------- */
/* useDebounce hook                                                   */
/* ---------------------------------------------------------------- */

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ---------------------------------------------------------------- */
/* Toast system                                                       */
/* ---------------------------------------------------------------- */

function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${t.type === 'success' ? 'bg-emerald-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-stone-800 text-white'}`}
        >
          {t.type === 'success' && <Check size={16} />}
          {t.type === 'error' && <XCircle size={16} />}
          {t.type === 'info' && <Info size={16} />}
          {t.message}
          <button onClick={() => remove(t.id)} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = 'info', duration = 3500) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);
  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

/* ---------------------------------------------------------------- */
/* PDF Export                                                         */
/* ---------------------------------------------------------------- */

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

async function exportPDF(schedule, monthIndex, year, published, venueName) {
  const monthName = MONTHS[monthIndex];
  const venueLabel = venueName ? ` — ${escapeHtml(venueName)}` : '';

  const rows = schedule.flatMap((day) =>
    day.posts.map((post) => {
      const done = published.has(post.id);
      const tag = post.type === 'carousel' ? `Karusel (${post.photos.length})` : post.type === 'special' ? '🎉 Xüsusi gün' : 'Şəkil';
      const imgThumb = post.photos.slice(0, 3).map((ph) =>
        `<img src="${ph.dataUrl}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;margin-right:3px;border:1px solid #e5e7eb;" />`
      ).join('');
      return `
        <tr style="background:${done ? '#f0fdf4' : '#fff'}">
          <td style="padding:8px 10px;font-weight:700;color:#444;white-space:nowrap;font-size:15px">${String(day.day).padStart(2,'0')}</td>
          <td style="padding:8px 10px">${imgThumb}</td>
          <td style="padding:8px 10px;font-size:12px"><strong>${escapeHtml(post.category)}</strong><br/><span style="color:#999">${tag}</span></td>
          <td style="padding:8px 10px;font-style:italic;font-size:12px;color:#333;max-width:260px">${post.caption ? escapeHtml(post.caption) : '<span style="color:#aaa">—</span>'}</td>
          <td style="padding:8px 10px;text-align:center;font-size:18px">${done ? '✅' : '<span style="color:#ddd">○</span>'}</td>
        </tr>`;
    })
  ).join('');

  const html = `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8"/>
<title>${escapeHtml(monthName)} ${year}${venueLabel} — Paylaşım Planı</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 24px 32px; color: #222; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  p.sub { color: #888; font-size: 12px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #1c1917; color: #fff; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 11px; letter-spacing:.05em; text-transform:uppercase; }
  tr { border-bottom: 1px solid #e7e5e4; }
  @media print { body { padding: 10mm; } img { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<h1>${escapeHtml(monthName)} ${year}${venueLabel} — Paylaşım Planı</h1>
<p class="sub">Cəmi ${schedule.flatMap(d=>d.posts).length} post · ${published.size} paylaşıldı</p>
<table>
  <thead>
    <tr>
      <th>Gün</th><th>Şəkil</th><th>Kateqoriya / Növ</th><th>Caption</th><th>✓</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<script>window.onload=function(){setTimeout(function(){window.print();},500);}<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // window.open async funksiya içindən bloklanır — birbaşa <a> click istifadə edirik
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ---------------------------------------------------------------- */
/* AI provider abstraction (Claude / OpenAI / Gemini)                 */
/* ---------------------------------------------------------------- */

// Cloudflare Worker proxy URL — bütün AI sorğuları buradan keçir.
// Fallback məntiqi Worker-in özündə işləyir: Claude → OpenAI → Gemini.
const WORKER_URL = 'https://cold-meadow-6bb3.rashadhuseyn1993.workers.dev';

// Bütün AI çağırışları Worker vasitəsilə gedir.
// Provider seçilir, Worker həm açarı, həm fallback-i idarə edir.
async function callAI({ provider, model, system, userText, imageBase64, maxTokens = 200, signal }) {
  // Anthropic üçün məzmun formatı
  const anthropicContent = [{ type: 'text', text: userText }];
  if (imageBase64) anthropicContent.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } });

  // OpenAI/Worker üçün məzmun formatı
  const openaiContent = [{ type: 'text', text: userText }];
  if (imageBase64) openaiContent.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } });

// Bütün AI çağırışları (Claude daxil) Worker vasitəsilə gedir.
// Brauzerdən birbaşa api.anthropic.com-a sorğu CORS tərəfindən
// bloklanır (yalnız claude.ai artifact sandbox-u istisnadır), ona
// görə xarici saytda işlədikdə hamısı Worker-dən keçməlidir.
if (provider === 'anthropic') {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        provider: 'anthropic',
        model: model || 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages: [{ role: 'user', content: anthropicContent }],
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const err = new Error(`HTTP ${res.status}: ${JSON.stringify(errData).slice(0, 150)}`);
      if (res.status === 429 || res.status === 529) err.isRateLimit = true;
      if (errData?.error?.type === 'overloaded_error' || errData?.error?.type === 'rate_limit_error') err.isRateLimit = true;
      throw err;
    }
    const data = await res.json();
    if (data._fallback) console.info(`AI fallback: ${provider} → ${data._provider}`);
    const tb = (data.content || []).find((b) => b.type === 'text');
    return tb?.text?.trim() || '';
  }

  // OpenAI və Gemini — Worker proxy vasitəsilə (açarlar Worker-də)
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      provider,
      model: model || (provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini'),
      max_tokens: maxTokens,
      ...(system ? { system } : {}),
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: openaiContent },
      ],
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const err = new Error(`HTTP ${res.status}: ${JSON.stringify(errData).slice(0, 150)}`);
    if (res.status === 429 || res.status === 529) err.isRateLimit = true;
    throw err;
  }
  const data = await res.json();
  // Worker cavabında hansı provayderın işlədiyini bildiririk (log üçün)
  if (data._fallback) console.info(`AI fallback: ${provider} → ${data._provider}`);
  // OpenAI formatı
  if (data.choices) return data.choices?.[0]?.message?.content?.trim() || '';
  // Gemini formatı
  if (data.candidates) return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  return '';
}

function isRateLimitOrOverload(err) {
  if (!err) return false;
  const msg = String(err.message || err).toLowerCase();
  return (
    msg.includes('429') || msg.includes('529') ||
    msg.includes('overloaded') || msg.includes('rate_limit') ||
    msg.includes('rate limit') || msg.includes('too many requests')
  );
}

/* ---------------------------------------------------------------- */
/* callAIWithFallback — avtomatik yedək AI dəstəyi                   */
/* ---------------------------------------------------------------- */
// Claude (Anthropic) limit/overload xətası verəndə, əgər istifadəçi
// OpenAI və ya Gemini açarı daxil edibsə, avtomatik həmin provayderə
// keçir. onFallback(fromLabel, toLabel) callback-i UI bildirişi üçün.
async function callAIWithFallback({ primaryProvider, aiSettings, onFallback, ...callArgs }) {
  // Fallback ardıcıllığı: anthropic → openai → gemini
  const FALLBACK_ORDER = ['anthropic', 'openai', 'gemini'];

  // Seçilmiş provayderdən başlayırıq
  const startIdx = FALLBACK_ORDER.indexOf(primaryProvider);
  const sequence = startIdx === -1
    ? [primaryProvider, ...FALLBACK_ORDER]
    : FALLBACK_ORDER.slice(startIdx);

  let lastErr = null;

  for (const providerId of sequence) {
    const cfg = aiSettings[providerId] || {};
    // Açarlar Worker-də saxlanılır, burada yoxlama lazım deyil

    try {
      const result = await callAI({
        ...callArgs,
        provider: providerId,
        apiKey: '', // açar Worker-dədir
        model: cfg.model,
      });
      // Əvvəlki provayderdan fallback olmuşdusa bildiriş ver
      if (providerId !== primaryProvider && onFallback) {
        const fromLabel = AI_PROVIDERS.find((p) => p.id === primaryProvider)?.label || primaryProvider;
        const toLabel = AI_PROVIDERS.find((p) => p.id === providerId)?.label || providerId;
        onFallback(fromLabel, toLabel);
      }
      return result;
    } catch (err) {
      lastErr = err;
      // İstifadəçi dayandırma düyməsinə basıbsa (AbortError), fallback-a
      // keçmədən dərhal atırıq — yedək provayderə keçmək məntiqsizdir.
      if (err.name === 'AbortError') throw err;
      // Yalnız limit/overload xətasında fallback edirik
      // Digər xətalarda (auth xətası, şəbəkə xətası) dərhal atırıq
      const shouldFallback = err.isRateLimit || isRateLimitOrOverload(err);
      if (!shouldFallback) throw err;
      // Növbəti provayderə keç
    }
  }

  // Bütün provayderlar uğursuz oldu
  throw lastErr || new Error('Bütün AI provayderlər cavab vermədi');
}

/* ---------------------------------------------------------------- */
/* Sub-components                                                     */
/* ---------------------------------------------------------------- */

function RussianFlag({ className = '' }) {
  return <img src={russiaFlagSrc} alt="RU" className={`flex-shrink-0 rounded-sm inline-block ${className}`} style={{ width: 14, height: 10, objectFit: 'cover' }} />;
}

function AzerbaijanFlag({ className = '' }) {
  return <img src={azerbaijanFlagSrc} alt="AZ" className={`flex-shrink-0 rounded-sm inline-block ${className}`} style={{ width: 14, height: 10, objectFit: 'cover' }} />;
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-16 text-stone-400 dark:text-stone-500">
      <ImagePlus className="mx-auto mb-3" size={32} />
      <p>{text}</p>
    </div>
  );
}

/* --- PhotoGrid --- */
function PhotoGrid({ photos, categories, carousels, selectMode, deleteMode, selected, onToggleSelect, onRemove }) {
  const groupIndexOf = (number) => {
    if (number == null) return -1;
    return carousels.findIndex((c) => c.numbers.includes(number));
  };
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {photos.map((p) => {
        const gIdx = groupIndexOf(p.number);
        const ring = gIdx !== -1 ? GROUP_RINGS[gIdx % GROUP_RINGS.length] : null;
        const isSel = p.number != null && selected.has(p.number);
        const color = p.category ? getCatColor(p.category, categories) : null;
        return (
          <div
            key={p.id}
            onClick={() => { if (selectMode && p.number != null) onToggleSelect(p.number); }}
            className={`relative group rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 aspect-square ${selectMode ? 'cursor-pointer' : ''} ${isSel ? 'ring-2 ring-orange-500' : ring ? `ring-2 ${ring}` : ''}`}
          >
            <img src={p.dataUrl} alt={p.filename} className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 bg-stone-900/70 text-white text-xs font-semibold rounded-md px-1.5 py-0.5">
              {p.number != null ? p.number : '?'}
            </div>
            {!selectMode && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(p.id); }}
                className={`absolute top-1 right-1 bg-red-500 text-white rounded-md p-1 transition-opacity ${deleteMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              ><X size={12} /></button>
            )}
            {selectMode && (
              <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center border ${isSel ? 'bg-orange-500 border-orange-500' : 'bg-white/70 border-stone-300'}`}>
                {isSel && <Check size={12} className="text-white" />}
              </div>
            )}
            {gIdx !== -1 && !selectMode && (
              <div className="absolute bottom-1 right-1 bg-stone-900/70 text-white rounded-md p-1"><Layers size={10} /></div>
            )}
            {color && (
              <div className={`absolute bottom-0 inset-x-0 text-[10px] font-medium text-center py-0.5 truncate px-1 ${color.bg} ${color.text}`}>
                {p.category}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* --- CarouselManager --- */
function CarouselManager({ photos, carousels, suggestedCarousels, onConfirmSuggestion, onDismissSuggestion, onRemoveCarousel, uiLang = 'az' }) {
  return (
    <>
      {suggestedCarousels.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
          <h3 className="menu-font text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-600" /> {uiLang === 'ru' ? 'AI предлагает карусели' : 'AI təklif etdiyi karusellər'}
          </h3>
          <p className="text-stone-500 text-sm mb-3 dark:text-stone-400">{uiLang === 'ru' ? 'Эти фото очень похожи — можешь объединить их в один пост.' : 'Bu şəkillər çox oxşardır — istəsən birlikdə tək bir post kimi planlaşdır.'}</p>
          <div className="space-y-2">
            {suggestedCarousels.map((nums) => (
              <div key={nums.join(',')} className="flex items-center gap-2 flex-wrap border border-stone-100 rounded-xl p-2">
                <div className="flex -space-x-2">
                  {nums.map((n) => {
                    const ph = photos.find((x) => x.number === n);
                    return ph ? <img key={n} src={ph.dataUrl} className="w-10 h-10 rounded-lg object-cover border-2 border-white" alt={ph.filename} /> : null;
                  })}
                </div>
                <span className="text-sm text-stone-500 dark:text-stone-400">{uiLang === 'ru' ? 'Фото' : 'Şəkillər'}: {nums.join(', ')}</span>
                <div className="ml-auto flex gap-2">
                  <button onClick={() => onConfirmSuggestion(nums)} className="text-emerald-600 border border-emerald-200 rounded-lg px-2 py-1 text-xs flex items-center gap-1 hover:bg-emerald-50"><Check size={12} /> {uiLang === 'ru' ? 'Подтвердить' : 'Təsdiqlə'}</button>
                  <button onClick={() => onDismissSuggestion(nums)} className="text-stone-400 border border-stone-200 rounded-lg px-2 py-1 text-xs flex items-center gap-1 hover:bg-stone-50 dark:text-stone-500 dark:border-stone-700"><X size={12} /> {uiLang === 'ru' ? 'Отклонить' : 'Rədd et'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {carousels.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
          <h3 className="menu-font text-lg font-semibold mb-3 flex items-center gap-2"><Layers size={16} /> {uiLang === 'ru' ? 'Карусели' : 'Karusellər'}</h3>
          <div className="space-y-2">
            {carousels.map((c, ci) => (
              <div key={c.id} className={`flex items-center gap-2 flex-wrap rounded-xl p-2 ring-2 ${GROUP_RINGS[ci % GROUP_RINGS.length]}`}>
                <div className="flex -space-x-2">
                  {c.numbers.map((n) => {
                    const ph = photos.find((x) => x.number === n);
                    return ph ? <img key={n} src={ph.dataUrl} className="w-10 h-10 rounded-lg object-cover border-2 border-white" alt={ph.filename} /> : null;
                  })}
                </div>
                <span className="text-sm text-stone-500 dark:text-stone-400">{uiLang === 'ru' ? 'Фото' : 'Şəkillər'}: {c.numbers.join(', ')} · {uiLang === 'ru' ? 'как 1 пост в плане' : 'planda 1 post kimi'}</span>
                <button onClick={() => onRemoveCarousel(c.id)} className="ml-auto text-stone-400 border border-stone-200 rounded-lg px-2 py-1 text-xs flex items-center gap-1 hover:bg-stone-50 dark:text-stone-500 dark:border-stone-700">
                  <Unlink size={12} /> {uiLang === 'ru' ? 'Разделить' : 'Ayır'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* --- ScheduleView --- */
function ScheduleView({ schedule, monthIndex, year, published, categories, onTogglePublished, onResetPublished, onCopy, onDownload, onExportPDF, copyStatus, onReorderPost, onEditCaption, onMovePostToDay, uiLang = 'az' }) {
  const [filter, setFilter] = useState('all');
  const [editingCaption, setEditingCaption] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [copiedCaption, setCopiedCaption] = useState(null);
  const [movingPostId, setMovingPostId] = useState(null);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const allPosts = schedule.flatMap((d) => d.posts);
  const totalPosts = allPosts.length;
  const doneCount = allPosts.filter((p) => published.has(p.id)).length;
  const monthsList = uiLang === 'ru' ? MONTHS_RU : MONTHS;

  const startEdit = (post) => {
    setEditingCaption(post.id);
    setEditValue(post.caption);
  };
  const saveEdit = (postId) => {
    onEditCaption(postId, editValue);
    setEditingCaption(null);
  };
  const copyCaption = async (postId, caption) => {
    await navigator.clipboard.writeText(caption);
    setCopiedCaption(postId);
    setTimeout(() => setCopiedCaption(null), 1800);
  };

  // Hazırkı filtrə görə bir postun görünüb-görünməməsini yoxlayan funksiya —
  // sıralama düymələri bunu istifadə edərək həqiqi GÖRÜNƏN qonşunu tapır.
  const isVisible = (post) => filter === 'all' || (filter === 'done' ? published.has(post.id) : !published.has(post.id));

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="menu-font text-xl font-semibold">{monthsList[monthIndex]} {year}</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onCopy} className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-stone-50 dark:border-stone-700">
            <Copy size={14} /> {copyStatus || (uiLang === 'ru' ? 'Копировать как текст' : 'Mətn kimi kopyala')}
          </button>
          <button onClick={onDownload} className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-stone-50 dark:border-stone-700">
            <Download size={14} /> .txt
          </button>
          <button onClick={onExportPDF} className="bg-orange-600 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-orange-700">
            <FileText size={14} /> {uiLang === 'ru' ? 'Скачать PDF' : 'PDF yüklə'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 dark:text-stone-400">
          <span>{doneCount}/{totalPosts} {uiLang === 'ru' ? 'опубликовано' : 'paylaşıldı'}</span>
          {doneCount > 0 && (
            <button onClick={onResetPublished} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 dark:text-stone-500">
              <RotateCcw size={12} /> {uiLang === 'ru' ? 'Сбросить' : 'Sıfırla'}
            </button>
          )}
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden dark:bg-stone-800">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalPosts ? (doneCount / totalPosts * 100) : 0}%` }} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: 'all', label: uiLang === 'ru' ? `Все (${totalPosts})` : `Hamısı (${totalPosts})` },
          { id: 'pending', label: uiLang === 'ru' ? `Осталось (${totalPosts - doneCount})` : `Qalan (${totalPosts - doneCount})` },
          { id: 'done', label: uiLang === 'ru' ? `Опубликовано (${doneCount})` : `Paylaşılan (${doneCount})` },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`text-xs px-3 py-1.5 rounded-full border ${filter === f.id ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-stone-100">
        {schedule.map((day) => {
          const visiblePosts = day.posts.filter(isVisible);
          if (filter !== 'all' && visiblePosts.length === 0) return null;
          return (
            <div key={day.day} className="py-4 first:pt-0">
              <div className="flex items-center mb-3">
                <span className="menu-font text-2xl font-semibold text-stone-800 w-12 flex-shrink-0 dark:text-stone-200">{String(day.day).padStart(2, '0')}</span>
                {day.specialLabel && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 font-medium mr-2 flex-shrink-0">
                    🎉 {day.specialLabel}
                  </span>
                )}
                <span className="dotted-leader" />
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  {filter === 'all'
                    ? (uiLang === 'ru' ? `${day.posts.length} публикаций` : `${day.posts.length} paylaşım`)
                    : `${visiblePosts.length}/${day.posts.length}`}
                </span>
              </div>
              {visiblePosts.length === 0 ? (
                <p className="text-sm text-stone-400 ml-12 dark:text-stone-500">
                  {day.specialLabel
                    ? (uiLang === 'ru' ? '— текст пока не написан —' : '— hələ caption yazılmayıb —')
                    : (uiLang === 'ru' ? '— нет публикаций —' : '— paylaşım yoxdur —')}
                </p>
              ) : (
                <div className="space-y-3 ml-0 sm:ml-12">
                  {day.posts.map((post, postIdx) => {
                    if (!isVisible(post)) return null;
                    const color = getCatColor(post.category, categories);
                    const isDone = published.has(post.id);
                    const isEditingThis = editingCaption === post.id;
                    const isCopied = copiedCaption === post.id;

                    // Görünən əvvəlki/növbəti postun həqiqi indeksini tapırıq
                    let prevVisibleIdx = -1;
                    for (let i = postIdx - 1; i >= 0; i--) { if (isVisible(day.posts[i])) { prevVisibleIdx = i; break; } }
                    let nextVisibleIdx = -1;
                    for (let i = postIdx + 1; i < day.posts.length; i++) { if (isVisible(day.posts[i])) { nextVisibleIdx = i; break; } }

                    return (
                      <div key={post.id} className={`flex gap-3 rounded-xl p-2.5 transition-colors ${isDone ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-stone-50 dark:bg-stone-900'}`}>
                        {/* Reorder arrows */}
                        <div className="flex flex-col justify-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => onReorderPost(day.day, postIdx, prevVisibleIdx)}
                            disabled={prevVisibleIdx === -1}
                            className="text-stone-300 hover:text-stone-500 disabled:opacity-20 disabled:cursor-not-allowed leading-none"
                            title={uiLang === 'ru' ? 'Переместить вверх' : 'Yuxarı köçür'}
                          >▲</button>
                          <button
                            onClick={() => onReorderPost(day.day, postIdx, nextVisibleIdx)}
                            disabled={nextVisibleIdx === -1}
                            className="text-stone-300 hover:text-stone-500 disabled:opacity-20 disabled:cursor-not-allowed leading-none"
                            title={uiLang === 'ru' ? 'Переместить вниз' : 'Aşağı köçür'}
                          >▼</button>
                        </div>

                        {post.type === 'carousel' ? (
                          <div className="relative w-16 h-16 flex-shrink-0">
                            {post.photos.slice(0, 3).map((ph, idx) => (
                              <img key={ph.id} src={ph.dataUrl} alt={ph.filename}
                                className="absolute w-12 h-12 rounded-lg object-cover border-2 border-white"
                                style={{ left: idx * 8, top: idx * 8, zIndex: 10 - idx }} />
                            ))}
                            <div className="absolute bottom-0 right-0 bg-stone-900 text-white text-[9px] rounded-full px-1.5 py-0.5 flex items-center gap-0.5 z-20">
                              <Layers size={9} /> {post.photos.length}
                            </div>
                          </div>
                        ) : post.type === 'special' ? (
                          <div className="w-16 h-16 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center flex-shrink-0 text-2xl flex-shrink-0">
                            🎉
                          </div>
                        ) : (
                          <div className="relative flex-shrink-0">
                            <img src={post.photos[0].dataUrl} alt={post.photos[0].filename} className="w-16 h-16 rounded-lg object-cover" />
                            {post.photos[0].isVideo && (
                              <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[9px] rounded-full px-1.5 py-0.5 z-20 leading-none">
                                🎬
                              </div>
                            )}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${post.type === 'special' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' : `${color.bg} ${color.text}`}`}>{post.category}</span>
                            {post.type === 'carousel' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-600 flex items-center gap-0.5 dark:bg-stone-700 dark:text-stone-300">
                                <Layers size={9} /> {uiLang === 'ru' ? 'Карусель' : 'Karusel'}
                              </span>
                            )}
                          </div>
                          {isEditingThis ? (
                            <div className="mt-1">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={3}
                                className="w-full border border-orange-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none dark:bg-stone-800 dark:border-orange-500 dark:text-stone-200"
                                autoFocus
                              />
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => saveEdit(post.id)} className="text-xs bg-stone-900 text-white rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-stone-700">
                                  <Check size={11} /> {uiLang === 'ru' ? 'Сохранить' : 'Saxla'}
                                </button>
                                <button onClick={() => setEditingCaption(null)} className="text-xs border border-stone-200 rounded-lg px-2.5 py-1 hover:bg-stone-100 dark:border-stone-700">
                                  {uiLang === 'ru' ? 'Отмена' : 'Ləğv et'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {post.caption ? (
                                <p className={`text-sm italic menu-font leading-snug ${isDone ? 'text-stone-400 dark:text-stone-500 line-through' : 'text-stone-700 dark:text-stone-300'}`}>"{post.caption}"</p>
                              ) : (
                                <p className="text-xs text-amber-600 flex items-center gap-1"><AlertCircle size={12} /> {uiLang === 'ru' ? 'Подпись не найдена' : 'Caption tapılmadı'}</p>
                              )}
                              <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
                                <button
                                  onClick={() => startEdit(post)}
                                  className="text-[10px] border border-stone-200 rounded-md px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 flex items-center gap-0.5 dark:text-stone-400 dark:border-stone-700"
                                  title={uiLang === 'ru' ? 'Редактировать' : 'Redaktə et'}
                                >✏️ {uiLang === 'ru' ? 'Редактировать' : 'Redaktə'}</button>
                                {post.caption && (
                                  <button
                                    onClick={() => copyCaption(post.id, post.caption)}
                                    className="text-[10px] border border-stone-200 rounded-md px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 flex items-center gap-0.5 dark:text-stone-400 dark:border-stone-700"
                                    title={uiLang === 'ru' ? 'Копировать' : 'Kopyala'}
                                  >{isCopied ? (uiLang === 'ru' ? '✓ Скопировано' : '✓ Kopyalandı') : (uiLang === 'ru' ? '📋 Копировать' : '📋 Kopyala')}</button>
                                )}
                                {movingPostId === post.id ? (
                                  <select
                                    autoFocus
                                    defaultValue={day.day}
                                    onChange={(e) => {
                                      const toDay = parseInt(e.target.value, 10);
                                      onMovePostToDay(post.id, day.day, toDay);
                                      setMovingPostId(null);
                                    }}
                                    onBlur={() => setMovingPostId(null)}
                                    className="text-[10px] border border-orange-300 rounded-md px-1 py-0.5 bg-white dark:bg-stone-800 dark:text-stone-200"
                                  >
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                                      <option key={d} value={d}>{d}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <button
                                    onClick={() => setMovingPostId(post.id)}
                                    className="text-[10px] border border-stone-200 rounded-md px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 flex items-center gap-0.5 dark:text-stone-400 dark:border-stone-700"
                                    title={uiLang === 'ru' ? 'Перенести на другой день' : 'Başqa günə köçür'}
                                  >📅 {uiLang === 'ru' ? 'Перенести' : 'Günü dəyiş'}</button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <button onClick={() => onTogglePublished(post.id)} className="flex-shrink-0 self-start" title={uiLang === 'ru' ? 'Отметить как опубликовано' : 'Paylaşıldı kimi işarələ'}>
                          {isDone ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-stone-300 hover:text-stone-400" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Main App                                                           */
/* ---------------------------------------------------------------- */

export default function App() {
  const [photos, setPhotos] = useState([]);
  // ── Geri qaytar (undo) ───────────────────────────────────────────
  // Yalnız son əməliyyatı geri qaytarır. Şəkil/karusel silmə kimi
  // dağıdıcı əməliyyatlardan əvvəl bura bir "snapshot" qoyulur.
  const [undoSnapshot, setUndoSnapshot] = useState(null);

  // ── Toplu redaktə (kateqoriya tab-ında) ──────────────────────────
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkProductName, setBulkProductName] = useState('');
  const [bulkPersonName, setBulkPersonName] = useState('');

  const [venueName, setVenueName] = useState('');
  const [venuePresets, setVenuePresets] = useState(INITIAL_VENUE_PRESETS);
  const [newVenueInput, setNewVenueInput] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCat, setNewCat] = useState('');
  const [captionsRaw, setCaptionsRaw] = useState('');
  const [monthIndex, setMonthIndex] = useState(5);
  const [year, setYear] = useState(2026);
  // Xüsusi günlər (Party, tədbir və s.) — plan generasiyası bu günlərə
  // toxunmur, sənin yazdığın caption olduğu kimi qalır, şəkil tələb olunmur.
  // Format: { [day]: { label: 'Party', caption: '...' } }
  const [specialDays, setSpecialDays] = useState({});
  // Rus dili tərcüməsi — aktiv olanda hər caption AZ + RU formatında yazılır
  const [includeRussian, setIncludeRussian] = useState(false);
  // İnterfeys dili (AZ/RU) — bu, caption dilindən tamamilə ayrı bir sistemdir
  const [uiLang, setUiLang] = useState(() => {
    try { return localStorage.getItem('pp-ui-lang') || 'az'; } catch { return 'az'; }
  });
  const t = useCallback((key) => TRANSLATIONS[uiLang]?.[key] ?? TRANSLATIONS.az[key] ?? key, [uiLang]);
  const toggleUiLang = useCallback(() => {
    setUiLang((prev) => {
      const next = prev === 'az' ? 'ru' : 'az';
      try { localStorage.setItem('pp-ui-lang', next); } catch { /* ignore */ }
      return next;
    });
  }, []);
  const [schedule, setSchedule] = useState(null);
  // ── Çoxlu məkan profili ──────────────────────────────────────────
  // Hər profil öz şəkillərini, kateqoriyalarını, planlarını saxlayır.
  // Profil adı bütün storage açarlarına prefiks kimi əlavə olunur.
  const [profiles, setProfiles] = useState(() => {
    try {
      const raw = localStorage.getItem('pp-profiles');
      const list = raw ? JSON.parse(raw) : ['Əsas'];
      return list.length > 0 ? list : ['Əsas'];
    } catch { return ['Əsas']; }
  });
  const [activeProfile, setActiveProfile] = useState(() => {
    try { return localStorage.getItem('pp-active-profile') || 'Əsas'; } catch { return 'Əsas'; }
  });
  const profilePrefix = activeProfile === 'Əsas' ? '' : `${activeProfile}::`;

  const persistProfiles = useCallback((list) => {
    try { localStorage.setItem('pp-profiles', JSON.stringify(list)); } catch { /* ignore */ }
  }, []);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [newProfileInput, setNewProfileInput] = useState('');

  const [aiLoading, setAiLoading] = useState(false);
  // Dayandırma (abort) üçün hər AI funksiyasının öz controller referansı —
  // istifadəçi "Dayandır" düyməsinə basanda davam edən fetch sorğuları
  // ləğv edilir, əlavə token xərclənmir.
  const aiAbortRef = useRef(null);
  const [aiProgress, setAiProgress] = useState({ done: 0, total: 0 });
  const [activeTab, setActiveTab] = useState('photos');
  const [dragOver, setDragOver] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [carousels, setCarousels] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [suggestedCarousels, setSuggestedCarousels] = useState([]);
  const [aiCarouselLoading, setAiCarouselLoading] = useState(false);
  const aiCarouselAbortRef = useRef(null);
  const [published, setPublished] = useState(new Set());
  const [savedPlanKeys, setSavedPlanKeys] = useState([]);
  const [captionGuide, setCaptionGuide] = useState('');
  const [aiCaptions, setAiCaptions] = useState(new Map());
  const [captionGenLoading, setCaptionGenLoading] = useState(false);
  const captionGenAbortRef = useRef(null);
  const [captionGenProgress, setCaptionGenProgress] = useState({ done: 0, total: 0 });
  const [copiedGenCaption, setCopiedGenCaption] = useState(null);
  const [regenLoadingNums, setRegenLoadingNums] = useState(new Set());

  // switchProfile/addProfile/removeProfile bura (bütün lazımi state-lərdən
  // sonra) köçürülüb — əvvəlcə daha yuxarıda idi, amma orda hələ təyin
  // olunmamış state-lərə (carousels, schedule, aiCaptions və s.) istinad
  // etdiyi üçün build zamanı "Cannot access before initialization" xətası
  // yaranırdı (minifaylaşdırılmış kodda dəyişən sıralanması TDZ-ə düşürdü).
  const switchProfile = useCallback((name) => {
    setActiveProfile(name);
    try { localStorage.setItem('pp-active-profile', name); } catch { /* ignore */ }
    // Profil dəyişəndə işlək state-i sıfırla — aşağıdaki useEffect yeni
    // profilin datasını window.storage-dən yükləyəcək.
    setPhotos([]);
    setCarousels([]);
    setSuggestedCarousels([]);
    setSelected(new Set());
    setSchedule(null);
    setPublished(new Set());
    setAiCaptions(new Map());
    setCaptionsRaw('');
    setCategories(DEFAULT_CATEGORIES);
    setVenueName('');
  }, []);

  const addProfile = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed || profiles.includes(trimmed)) return;
    const next = [...profiles, trimmed];
    setProfiles(next);
    persistProfiles(next);
    switchProfile(trimmed);
  }, [profiles, persistProfiles, switchProfile]);

  const removeProfile = useCallback((name) => {
    if (name === 'Əsas' || profiles.length <= 1) return;
    const next = profiles.filter((p) => p !== name);
    setProfiles(next);
    persistProfiles(next);
    if (activeProfile === name) switchProfile(next[0] || 'Əsas');
  }, [profiles, persistProfiles, activeProfile, switchProfile]);

  // YENİ: çoxlu AI provayder dəstəyi
  const [aiProvider, setAiProvider] = useState('anthropic');
  const [aiSettings, setAiSettings] = useState({
    anthropic: { key: '', model: 'claude-sonnet-4-6' },
    openai: { key: '', model: 'gpt-4o-mini' },
    gemini: { key: '', model: 'gemini-2.0-flash' },
  });
  // SƏHV DÜZƏLİŞİ: "Hamısını sil" düyməsi window.confirm() istifadə edirdi —
  // bu, sandboxed (məs. artifact preview) iframe-lərdə bloklanır və sakitcə
  // false qaytarır, ona görə silmə heç vaxt icra olunmurdu. İndi öz daxili
  // təsdiq UI-mizi istifadə edirik.
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  // API açarı yoxlama statusu
  const [keyVerifyStatus, setKeyVerifyStatus] = useState({});
  const fileInputRef = useRef(null);
  const { toasts, add: addToast, remove: removeToast } = useToast();

  // pushUndoSnapshot/performUndo/toggleBulkSelect/applyBulkEdit bura (bütün
  // lazımi state-lərdən, xüsusən carousels və addToast-dan sonra) köçürülüb
  // — əvvəlcə daha yuxarıda idi, amma hələ təyin olunmamış dəyişənlərə
  // istinad etdiyi üçün build zamanı "Cannot access before initialization"
  // xətası yaranırdı.
  const pushUndoSnapshot = useCallback((photosSnap, carouselsSnap) => {
    setUndoSnapshot({ photos: photosSnap, carousels: carouselsSnap });
  }, []);
  const performUndo = useCallback(() => {
    if (!undoSnapshot) return;
    setPhotos(undoSnapshot.photos);
    setCarousels(undoSnapshot.carousels);
    setUndoSnapshot(null);
  }, [undoSnapshot]);

  const toggleBulkSelect = useCallback((photoId) => {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId); else next.add(photoId);
      return next;
    });
  }, []);

  const applyBulkEdit = useCallback(() => {
    if (bulkSelected.size === 0) return;
    pushUndoSnapshot(photos, carousels);
    setPhotos((prev) => prev.map((p) => {
      if (!bulkSelected.has(p.id)) return p;
      const updated = { ...p };
      if (bulkCategory) updated.category = bulkCategory;
      if (bulkProductName.trim()) updated.productName = bulkProductName.trim();
      if (bulkPersonName.trim()) updated.personName = bulkPersonName.trim();
      return updated;
    }));
    addToast(`${bulkSelected.size} ${uiLang === 'ru' ? 'фото обновлено' : 'şəkil yeniləndi'}`, 'success');
    setBulkSelected(new Set());
    setBulkCategory('');
    setBulkProductName('');
    setBulkPersonName('');
    setBulkEditMode(false);
  }, [bulkSelected, bulkCategory, bulkProductName, bulkPersonName, photos, carousels, pushUndoSnapshot, addToast, uiLang]);

  /* ---------------------------------------------------------------- */
  /* Dark mode — sistem ayarına görə avtomatik başlayır, istifadəçi    */
  /* düymə ilə dəyişdirə bilər, seçim localStorage-də yadda saxlanılır */
  /* ---------------------------------------------------------------- */
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('pp-dark-mode');
      if (saved === 'true') return true;
      if (saved === 'false') return false;
    } catch { /* ignore */ }
    // İstifadəçi heç vaxt əl ilə seçmədiyi halda, sistem ayarına bax
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    // İstifadəçi əl ilə seçim etməyibsə, sistem ayarı dəyişəndə də izlə
    let userChose = false;
    try { userChose = localStorage.getItem('pp-dark-mode') !== null; } catch { /* ignore */ }
    if (userChose || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      try { localStorage.setItem('pp-dark-mode', String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Debounced captions for performance
  const debouncedCaptionsRaw = useDebounce(captionsRaw, 300);
  const captionsMap = useMemo(() => parseCaptions(debouncedCaptionsRaw), [debouncedCaptionsRaw]);

  const matchedCount = photos.filter((p) => p.number != null && captionsMap.has(p.number)).length;
  const categorizedCount = photos.filter((p) => p.category).length;
  const allPosts = schedule ? schedule.flatMap((d) => d.posts) : [];
  const totalPosts = allPosts.length;
  const doneCount = allPosts.filter((p) => published.has(p.id)).length;

  // Plan generasiya olunandan sonra kateqoriya/caption/karusel dəyişsə,
  // bu "imza" fərqlənəcək və Plan tabında xəbərdarlıq göstəriləcək.
  const scheduleSignatureRef = useRef(null);
  const currentSignature = useMemo(
    () => computeDataSignature(photos, carousels, captionsMap),
    [photos, carousels, captionsMap]
  );
  const isScheduleStale = !!schedule && scheduleSignatureRef.current !== null && scheduleSignatureRef.current !== currentSignature;

  /* ----------------------------- handlers ----------------------------- */

  // Promise.all for parallel image reading
  const handleFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    try {
      const newPhotos = await Promise.all(
        files.map(async (file) => {
          const dataUrl = await readFileAsDataURL(file);
          const thumb = await resizeDataURL(dataUrl, 480);
          return {
            id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
            filename: file.name,
            number: null, // Müvəqqəti null — aşağıda ardıcıl nömrə veriləcək
            dataUrl: thumb,
            category: '',
          };
        })
      );

      setPhotos((prev) => {
        // Mövcud şəkillərin ən böyük nömrəsini tap
        const maxNum = prev.reduce((m, p) => Math.max(m, p.number ?? 0), 0);
        // Yeni şəkillərə ardıcıl nömrə ver
        const numbered = newPhotos.map((p, i) => ({ ...p, number: maxNum + i + 1 }));
        return [...prev, ...numbered];
      });

      setSchedule(null);
      addToast(`${newPhotos.length} şəkil yükləndi`, 'success');
    } catch {
      addToast('Şəkil yükləmə xətası baş verdi', 'error');
    }
  }, [addToast]);

  const removePhoto = useCallback((id) => {
    pushUndoSnapshot(photos, carousels);
    const photo = photos.find((p) => p.id === id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (photo && photo.number != null) {
      const n = photo.number;
      setCarousels((prev) => prev.map((c) => ({ ...c, numbers: c.numbers.filter((x) => x !== n) })).filter((c) => c.numbers.length >= 2));
      setSuggestedCarousels((prev) => prev.filter((nums) => !nums.includes(n)));
      setSelected((prev) => { const next = new Set(prev); next.delete(n); return next; });
    }
    setSchedule(null);
  }, [photos, carousels, pushUndoSnapshot]);

  const addCategory = useCallback(() => {
    const name = newCat.trim();
    if (!name) return;
    if (categories.includes(name)) { addToast('Bu kateqoriya artıq mövcuddur', 'info'); return; }
    setCategories((prev) => [...prev, name]);
    setNewCat('');
  }, [newCat, categories, addToast]);

  const removeCategory = useCallback((name) => {
    setCategories((prev) => prev.filter((c) => c !== name));
    // İkili kateqoriya sətirlərində ("Qəhvə / Şərab") da silinmiş adı təmizləyirik —
    // sadəcə tam uyğunluğa baxmaq orfan adlar saxlayırdı.
    setPhotos((prev) => prev.map((p) => {
      if (!p.category) return p;
      const parts = p.category.split(' / ').filter((c) => c !== name);
      const next = parts.join(' / ');
      return next === p.category ? p : { ...p, category: next };
    }));
  }, []);

  const setPhotoCategory = useCallback((id, cat) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, category: cat } : p)));
  }, []);

  // Məhsul adı və şəxs adı — isteğe bağlı, caption generasiyasında istifadə olunur
  const setPhotoProductName = useCallback((id, name) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, productName: name } : p)));
  }, []);

  const setPhotoPersonName = useCallback((id, name) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, personName: name } : p)));
  }, []);

  // Video thumbnail işarəsi — plan generasiyası şəkil/video nisbətini
  // nəzərə alaraq məntiqli ardıcıllıq qurmaq üçün bunu istifadə edir
  const togglePhotoIsVideo = useCallback((ids) => {
    setPhotos((prev) => {
      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
      // Qrupun cari vəziyyətini yoxla (əgər hamısı video isə, sıfırla; əks halda hamısını video et)
      const allVideo = prev.filter((p) => idSet.has(p.id)).every((p) => p.isVideo);
      return prev.map((p) => (idSet.has(p.id) ? { ...p, isVideo: !allVideo } : p));
    });
  }, []);

  const togglePhotoSelect = useCallback((number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number); else next.add(number);
      return next;
    });
  }, []);

  const createCarouselFromSelection = useCallback(() => {
    if (selected.size < 2) return;
    const numbers = [...selected].sort((a, b) => a - b);
    const id = newCarouselId();
    setCarousels((prev) => [
      ...prev.map((c) => ({ ...c, numbers: c.numbers.filter((n) => !numbers.includes(n)) })).filter((c) => c.numbers.length >= 2),
      { id, numbers },
    ]);
    setSuggestedCarousels((prev) => prev.filter((s) => !s.some((n) => numbers.includes(n))));
    setSelected(new Set());
    // selectMode stays active so user can immediately select next carousel group
    setSchedule(null);
    addToast('Karusel yaradıldı — növbəti qrupu seçə bilərsiniz', 'success');
  }, [selected, addToast]);

  const removeCarousel = useCallback((carouselId) => {
    pushUndoSnapshot(photos, carousels);
    setCarousels((prev) => prev.filter((c) => c.id !== carouselId));
    setSchedule(null);
  }, [photos, carousels, pushUndoSnapshot]);

  const confirmSuggestion = useCallback((numbers) => {
    const id = newCarouselId();
    setCarousels((prev) => [
      ...prev.map((c) => ({ ...c, numbers: c.numbers.filter((n) => !numbers.includes(n)) })).filter((c) => c.numbers.length >= 2),
      { id, numbers },
    ]);
    setSuggestedCarousels((prev) => prev.filter((s) => s.join(',') !== numbers.join(',')));
    setSchedule(null);
    addToast('Karusel təsdiqləndi', 'success');
  }, [addToast]);

  const dismissSuggestion = useCallback((numbers) => {
    setSuggestedCarousels((prev) => prev.filter((s) => s.join(',') !== numbers.join(',')));
  }, []);

  /* -------------------- AI (pulsuz — proxy yox) -------------------- */
  // NOTE: Bu tətbiq Anthropic-in Claude.ai artifact mühitində işləyir.
  // API açarı artifact sandbox-u tərəfindən avtomatik əlavə edilir,
  // istifadəçi açarını görə bilmir. Real xarici deployment üçün
  // backend proxy qurulması tövsiyə olunur.
  const runAI = useCallback(async () => {
    if (photos.length === 0 || categories.length === 0) return;
    const cfg = aiSettings[aiProvider] || {};
    const controller = new AbortController();
    aiAbortRef.current = controller;
    setAiLoading(true);
    setAiProgress({ done: 0, total: photos.length });

    const cats = [...categories, 'Digər'];
    const catList = cats.join('\n- ');
    const normStr = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');
    const matchCat = (raw) => {
      if (!raw) return 'Digər';
      const cleaned = raw.replace(/["""''*#\-]/g, '').trim();
      if (cats.includes(cleaned)) return cleaned;
      const n = normStr(cleaned);
      return cats.find((c) => normStr(c) === n)
        || cats.find((c) => normStr(c).includes(n) || n.includes(normStr(c)))
        || 'Digər';
    };

    const photoList = [...photos];
    let aiDoneCount = 0;
    const categoryResults = new Map();
    let hadError = false;
    let wasAborted = false;

    const fetchCategory = async (p) => {
      try {
        const raw = await callAIWithFallback({
          primaryProvider: aiProvider,
          aiSettings,
          onFallback: (from, to) => addToast(`⚡ ${from} limiti → ${to}-ə keçildi`, 'info'),
          userText: `Bu şəkilə bax. Yalnız aşağıdakı siyahıdan BİR kateqoriya adı yaz — başqa heç nə əlavə etmə:\n- ${catList}`,
          imageBase64: p.dataUrl.split(',')[1],
          maxTokens: 20,
          signal: controller.signal,
        });
        return matchCat(raw);
      } catch (e) {
        if (e.name === 'AbortError') throw e;
        hadError = true;
        console.error('Category fetch error:', e);
        return p.category || 'Digər';
      }
    };

    const CONCURRENCY = 3;
    try {
      for (let i = 0; i < photoList.length; i += CONCURRENCY) {
        if (controller.signal.aborted) { wasAborted = true; break; }
        const chunk = photoList.slice(i, i + CONCURRENCY);
        const results = await Promise.all(chunk.map((p) => fetchCategory(p)));
        results.forEach((cat, idx) => {
          categoryResults.set(chunk[idx].id, cat);
          aiDoneCount++;
        });
        const snap = new Map(categoryResults);
        setPhotos((prev) => prev.map((p) => snap.has(p.id) ? { ...p, category: snap.get(p.id) } : p));
        setAiProgress({ done: aiDoneCount, total: photoList.length });
      }
    } catch (e) {
      if (e.name === 'AbortError') wasAborted = true;
      else throw e;
    }

    setAiLoading(false);
    aiAbortRef.current = null;
    setSchedule(null);
    if (wasAborted) addToast(uiLang === 'ru' ? 'Остановлено' : 'Dayandırıldı', 'info');
    else if (hadError) addToast('Bəzi şəkillər "Digər" kateqoriyasına yerləşdirildi', 'error');
    else addToast('AI kateqoriyalaşdırma tamamlandı ✓', 'success');
  }, [photos, categories, aiProvider, aiSettings, addToast, uiLang]);

  const stopAI = useCallback(() => {
    if (aiAbortRef.current) aiAbortRef.current.abort();
  }, []);



  const runAICarousel = useCallback(async () => {
    if (photos.length < 2) return;
    const cfg = aiSettings[aiProvider] || {};
    const controller = new AbortController();
    aiCarouselAbortRef.current = controller;
    setAiCarouselLoading(true);

    const alreadyGrouped = new Set();
    carousels.forEach((c) => c.numbers.forEach((n) => alreadyGrouped.add(n)));
    const eligible = photos.filter((p) => p.number != null && !alreadyGrouped.has(p.number));
    if (eligible.length < 2) {
      addToast('Qruplaşdırılmamış ən azı 2 şəkil lazımdır', 'info');
      setAiCarouselLoading(false);
      aiCarouselAbortRef.current = null;
      return;
    }

    // Step 1: Get a short visual description + subject tag for each photo (concurrency=4)
    const descriptions = [];
    let doneDesc = 0;
    let wasAborted = false;

    const fetchDesc = async (p) => {
      try {
        const raw0 = await callAIWithFallback({
          primaryProvider: aiProvider,
          aiSettings,
          onFallback: (from, to) => addToast(`⚡ ${from} limiti → ${to}-ə keçildi`, 'info'),
          system: 'Restoran şəkilini analiz et. JSON formatında cavab ver: {"subject":"əsas mövzu 2-3 sözdə","detail":"spesifik detallar 5-7 sözdə"}. Başqa heç nə yazma.',
          userText: 'Bu şəkili təsvir et.',
          imageBase64: p.dataUrl.split(',')[1],
          maxTokens: 80,
          signal: controller.signal,
        });
        const raw = raw0.replace(/```json|```/g, '').trim();
        const m = raw.match(/\{[\s\S]*?\}/);
        if (m) {
          const parsed = JSON.parse(m[0]);
          return { photoId: p.id, number: p.number, subject: parsed.subject || '', detail: parsed.detail || '' };
        }
        return { photoId: p.id, number: p.number, subject: raw.slice(0, 40), detail: '' };
      } catch (e) {
        if (e.name === 'AbortError') throw e;
        return { photoId: p.id, number: p.number, subject: '', detail: '' };
      }
    };

    try {
      const CONCURRENCY = 4;
      for (let i = 0; i < eligible.length; i += CONCURRENCY) {
        if (controller.signal.aborted) { wasAborted = true; break; }
        const chunk = eligible.slice(i, i + CONCURRENCY);
        const results = await Promise.all(chunk.map((p) => fetchDesc(p)));
        results.forEach((r) => descriptions.push(r));
        doneDesc += chunk.length;
        addToast(`Şəkillər analiz edilir: ${doneDesc}/${eligible.length}`, 'info');
      }
    } catch (e) {
      if (e.name === 'AbortError') wasAborted = true;
      else throw e;
    }

    // Step 2: Find similar pairs by sending descriptions (no images) to AI
    // Group descriptions into chunks of 20 for matching
    const newSuggestions = [];
    const usedNumbers = new Set();

    if (!wasAborted) {
      const matchChunkSize = 20;
      for (let i = 0; i < descriptions.length; i += matchChunkSize) {
        if (controller.signal.aborted) { wasAborted = true; break; }
        const chunk = descriptions.slice(i, i + matchChunkSize);
        const descText = chunk.map((d) => `#${d.number}: mövzu="${d.subject}" detal="${d.detail}"`).join('\n');
        try {
          const raw0 = await callAIWithFallback({
            primaryProvider: aiProvider,
            aiSettings,
            onFallback: (from, to) => addToast(`⚡ ${from} limiti → ${to}-ə keçildi`, 'info'),
            system: 'Sən Instagram karusel planlayıcısısan. Şəkil təsvirlərini analiz et, eyni mövzunu fərqli bucaqdan göstərən şəkilləri tap. Yalnız JSON array cavab ver, başqa heç nə yazma.',
            userText: `Bu şəkillərin arasında hansılar eyni yeməyi/içkini/yeri fərqli bucaqdan göstərir? Karusel üçün qruplaşdır.\n\nŞəkillər:\n${descText}\n\nCavab formatı: [{"numbers":[1,3]},{"numbers":[2,7,9]}]. Əgər oxşar yoxdursa: []`,
            maxTokens: 600,
            signal: controller.signal,
          });
          const raw = raw0.replace(/```json|```/g, '').trim();
          const m = raw.match(/\[[\s\S]*\]/);
          if (m) {
            const parsed = JSON.parse(m[0]);
            parsed.forEach(({ numbers }) => {
              if (!Array.isArray(numbers) || numbers.length < 2) return;
              const sorted = [...numbers].sort((a, b) => a - b);
              if (!sorted.some((n) => usedNumbers.has(n))) {
                newSuggestions.push(sorted);
                sorted.forEach((n) => usedNumbers.add(n));
              }
            });
          }
        } catch (e) {
          if (e.name === 'AbortError') { wasAborted = true; break; }
          /* ignore other errors */
        }
      }
    }

    if (newSuggestions.length > 0) {
      setSuggestedCarousels((prev) => {
        const seen = new Set(prev.map((s) => s.join(',')));
        const merged = [...prev];
        newSuggestions.forEach((nums) => {
          const key = nums.join(',');
          if (!seen.has(key)) { merged.push(nums); seen.add(key); }
        });
        return merged;
      });
      addToast(`${newSuggestions.length} karusel təklifi tapıldı ✓`, 'success');
    } else if (wasAborted) {
      addToast(uiLang === 'ru' ? 'Остановлено' : 'Dayandırıldı', 'info');
    } else {
      addToast('Oxşar şəkil tapılmadı', 'info');
    }
    setAiCarouselLoading(false);
    aiCarouselAbortRef.current = null;
  }, [photos, carousels, aiProvider, aiSettings, addToast, uiLang]);

  const stopAICarousel = useCallback(() => {
    if (aiCarouselAbortRef.current) aiCarouselAbortRef.current.abort();
  }, []);



  const runCaptionGen = useCallback(async () => {
    if (photos.length === 0) return;
    const cfg = aiSettings[aiProvider] || {};
    const controller = new AbortController();
    captionGenAbortRef.current = controller;
    setCaptionGenLoading(true);
    const venueRef = venueName.trim() || 'bizim kafemiz';
    const guideSection = captionGuide.trim()
      ? `\n\nNümunə üslub (bu cür yaz, amma cümlələri hərfi-hərfinə təkrarlama):\n${captionGuide.trim()}`
      : '';

    // Carousel üzvlərini qruplaşdır — hər carousel bir "iş vahidi"dir
    const carouselNumberSet = new Set(carousels.flatMap((c) => c.numbers));
    const carouselMap = new Map(); // cover number → carousel member photos[]
    carousels.forEach((c) => {
      const members = c.numbers
        .map((n) => photos.find((p) => p.number === n))
        .filter(Boolean)
        .sort((a, b) => a.number - b.number);
      if (members.length > 0) carouselMap.set(members[0].number, members);
    });

    // İş siyahısı: ya tək şəkil, ya carousel (bir caption)
    const workItems = [];
    photos.forEach((p) => {
      if (p.number == null) return;
      if (carouselNumberSet.has(p.number)) {
        // Yalnız cover şəkil üçün bir iş əlavə et
        if (carouselMap.has(p.number)) {
          workItems.push({ type: 'carousel', cover: p, members: carouselMap.get(p.number) });
        }
        // Digər carousel üzvlərini keç
      } else {
        workItems.push({ type: 'single', cover: p, members: [p] });
      }
    });

    setCaptionGenProgress({ done: 0, total: workItems.length });
    const resultMap = new Map(aiCaptions);
    let captionDoneCount = 0;
    let hadError = false;

    // Bu çağırış daxilində artıq yazılmış caption-ların başlanğıc hissələrini
    // (ilk 6-8 söz) izləyirik — AI-a "bunları təkrarlama" deyə göstəririk ki,
    // "Vista-da..." kimi eyni qəlibdən çoxlu caption yaranmasın.
    const usedOpenings = [];
    const CTA_STYLES = [
      'sual ver (məs. "Bunu sınamısınız?")',
      'birbaşa dəvət et (məs. "Gəlin görüşək")',
      'duyğu/atmosfer təsviri ilə başla (heç bir CTA sözü olmadan)',
      'qısa bir fakt və ya iddia ilə başla',
      'emoji ilə açılan qısa bir ifadə ilə başla',
      'müştərinin təcrübəsini təsvir edərək başla ("Hər dəfə... ")',
    ];

    const fetchCaption = async (item, idx) => {
      try {
        const isCarousel = item.type === 'carousel';

        // Məhsul adı / Şəxs adı — carousel-də hər hansı üzvdə varsa, istifadə et
        const productNames = [...new Set(item.members.map((m) => m.productName?.trim()).filter(Boolean))];
        const personNames = [...new Set(item.members.map((m) => m.personName?.trim()).filter(Boolean))];

        let extraInfo = '';
        if (productNames.length > 0) {
          extraInfo += `\nMəhsulun adı: ${productNames.join(', ')}. Bu adı captionda təbii şəkildə istifadə et.`;
        }
        if (personNames.length > 0) {
          extraInfo += `\nŞəkildəki şəxs(lər): ${personNames.join(', ')}. Bu ad(lar)ı captionda təbii şəkildə istifadə et.`;
        }

        const russianSection = includeRussian
          ? `\n\nMÜHÜM: Captionu əvvəlcə Azərbaycan dilində yaz. Sonra İKİ boş sətirdən sonra, ayrıca bir sətirdə YALNIZ 🇷🇺 emojisini yaz, sonra YENİ sətirdə həmin mətnin rus dilinə tərcüməsini yaz. Format dəqiq belə olsun (sətr sonlarına diqqət et):\n[Azərbaycan dilində caption]\n\n🇷🇺\n[Rus dilində tərcümə]\nBaşqa heç bir başlıq, izahat və ya əlavə mətn yazma — yalnız bu üç hissəni (AZ mətn, 🇷🇺, RU mətn) yaz.`
          : '';

        // Təkrarçılığı önləmək üçün: əvvəlki başlanğıclar siyahısı + bu caption
        // üçün təyin olunmuş üslub göstərişi.
        const ctaStyle = CTA_STYLES[idx % CTA_STYLES.length];
        const varietySection = usedOpenings.length > 0
          ? `\n\nÇOX VACİB: Bu caption "${venueRef}" sözü ilə BAŞLAMASIN (artıq ${usedOpenings.length} caption "${venueRef}-da/də" ilə başlayıb, təkrar olmasın). Bu captionun açılış cümləsi: ${ctaStyle}. Əvvəlki captionların başlanğıcları: ${usedOpenings.map((o) => `"${o}..."`).join(', ')} — bunlardan fərqli bir cümlə qurusu istifadə et.`
          : `\n\nBu captionun açılış cümləsi: ${ctaStyle}.`;

        const langGuard = `\n\nDİQQƏT: Mətn YALNIZ Azərbaycan dilində olmalıdır (Türkiyə türkcəsi YOX). Türk dilinə xas sözlər (məs. "çok", "güzel", "harika", "şimdi", "değil") işlətmə — onların Azərbaycanca qarşılığını yaz (məs. "çox", "gözəl", "əla", "indi", "deyil").`;

        const userText = isCarousel
          ? `Bu ${item.members.length} şəkillik Instagram carousel-i üçün Azərbaycanca tək bir caption yaz. Məkan: "${venueRef}". Bütün şəkillər birlikdə paylaşılacaq. Maksimum 2 cümlə olsun (1 cümlə də kifayətdir, uzatmaq lazım deyil). Yalnız caption mətni yaz, başqa heç nə əlavə etmə.${extraInfo}${guideSection}${varietySection}${langGuard}${russianSection}`
          : `Bu restoran şəkili üçün Azərbaycanca Instagram caption yaz. Məkan: "${venueRef}". Maksimum 2 cümlə olsun (1 cümlə də kifayətdir, uzatmaq lazım deyil). Yalnız caption mətni yaz, başqa heç nə əlavə etmə.${extraInfo}${guideSection}${varietySection}${langGuard}${russianSection}`;

        const text = await callAIWithFallback({
          primaryProvider: aiProvider,
          aiSettings,
          onFallback: (from, to) => addToast(`⚡ ${from} limiti → ${to}-ə keçildi`, 'info'),
          userText,
          // Cover şəkilini göndər (carousel üçün ilk şəkil)
          imageBase64: item.cover.dataUrl.split(',')[1],
          maxTokens: includeRussian ? 450 : 250,
          signal: controller.signal,
        });

        if (text) {
          // Azərbaycan hissəsinin (RU tərcüməsi varsa, ilk bloku) ilk bir neçə
          // sözünü "açılış" kimi yadda saxlayırıq ki, sonrakı çağırışlar bunu
          // təkrarlamasın.
          const azPart = text.split('\n\n')[0];
          const openingWords = azPart.trim().split(/\s+/).slice(0, 6).join(' ');
          if (openingWords) usedOpenings.push(openingWords);
        }
        return text || null;
      } catch (e) {
        if (e.name === 'AbortError') throw e;
        console.error('Caption fetch error:', e);
        return null;
      }
    };

    // QEYD: əvvəlcə paralel (Promise.all) işləyirdi, amma bu, hər çağırışın
    // əvvəlki nəticələri görməsinə mane olurdu və captionlar bir-birinə çox
    // bənzəyirdi (məs. çoxu "Vista-da..." ilə başlayırdı). İndi ardıcıl
    // (sequential) işləyir — hər addım əvvəlki açılışları nəzərə alır.
    let wasAborted = false;
    try {
      for (let i = 0; i < workItems.length; i++) {
        if (controller.signal.aborted) { wasAborted = true; break; }
        const item = workItems[i];
        const caption = await fetchCaption(item, i);
        if (caption === null) {
          hadError = true;
        } else {
          resultMap.set(item.cover.number, caption);
          if (item.type === 'carousel') {
            item.members.forEach((m) => {
              if (m.number !== item.cover.number) resultMap.delete(m.number);
            });
          }
        }
        captionDoneCount++;
        setAiCaptions(new Map(resultMap));
        setCaptionGenProgress({ done: captionDoneCount, total: workItems.length });
      }
    } catch (e) {
      if (e.name === 'AbortError') wasAborted = true;
      else throw e;
    }

    setCaptionGenLoading(false);
    captionGenAbortRef.current = null;
    if (wasAborted) addToast(uiLang === 'ru' ? 'Остановлено' : 'Dayandırıldı', 'info');
    else if (hadError) addToast('Bəzi şəkillər üçün caption yazıla bilmədi', 'error');
    else addToast(`${resultMap.size} caption hazırlandı! ✓`, 'success');
  }, [photos, carousels, captionGuide, aiCaptions, venueName, aiProvider, aiSettings, addToast, includeRussian, uiLang]);

  const stopCaptionGen = useCallback(() => {
    if (captionGenAbortRef.current) captionGenAbortRef.current.abort();
  }, []);

  const copyAllAiCaptions = useCallback(async () => {
    const carouselNumberSet = new Set(carousels.flatMap((c) => c.numbers));
    const coverNumbers = new Set(carousels.map((c) => {
      const members = c.numbers.map((n) => photos.find((p) => p.number === n)).filter(Boolean).sort((a, b) => a.number - b.number);
      return members[0]?.number;
    }).filter(Boolean));

    const lines = photos
      .filter((p) => p.number != null && aiCaptions.has(p.number))
      .filter((p) => !carouselNumberSet.has(p.number) || coverNumbers.has(p.number))
      .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
      .map((p) => `${p.number}. ${aiCaptions.get(p.number)}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(lines);
      addToast('Hamısı kopyalandı', 'success');
    } catch {
      addToast('Kopyalama alınmadı', 'error');
    }
  }, [photos, carousels, aiCaptions, addToast]);

  const addAllAiCaptionsToPaste = useCallback(() => {
    const carouselNumberSet = new Set(carousels.flatMap((c) => c.numbers));
    const coverNumbers = new Set(carousels.map((c) => {
      const members = c.numbers.map((n) => photos.find((p) => p.number === n)).filter(Boolean).sort((a, b) => a.number - b.number);
      return members[0]?.number;
    }).filter(Boolean));

    const lines = photos
      .filter((p) => p.number != null && aiCaptions.has(p.number))
      .filter((p) => !carouselNumberSet.has(p.number) || coverNumbers.has(p.number))
      .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
      .map((p) => `${p.number}. ${aiCaptions.get(p.number)}`)
      .join('\n\n');
    if (!lines) return;
    setCaptionsRaw(lines);
    addToast('Bütün captionlar paste bölməsinə əlavə edildi', 'success');
  }, [photos, carousels, aiCaptions, addToast]);

  const regenOneCaption = useCallback(async (photo) => {
    if (photo.number == null) return;
    const photoNum = photo.number;
    const cfg = aiSettings[aiProvider] || {};
    setRegenLoadingNums((prev) => new Set([...prev, photoNum]));
    const venueRef = venueName.trim() || 'bizim kafemiz';
    const guideSection = captionGuide.trim()
      ? `\n\nNümunə üslub (bu cür yaz, amma cümlələri hərfi-hərfinə təkrarlama):\n${captionGuide.trim()}`
      : '';
    const langGuard = `\n\nDİQQƏT: Mətn YALNIZ Azərbaycan dilində olmalıdır (Türkiyə türkcəsi YOX). Türk dilinə xas sözlər (məs. "çok", "güzel", "harika", "şimdi", "değil") işlətmə — onların Azərbaycanca qarşılığını yaz (məs. "çox", "gözəl", "əla", "indi", "deyil").`;
    const russianSection = includeRussian
      ? `\n\nMÜHÜM: Captionu əvvəlcə Azərbaycan dilində yaz. Sonra İKİ boş sətirdən sonra, ayrıca bir sətirdə YALNIZ 🇷🇺 emojisini yaz, sonra YENİ sətirdə həmin mətnin rus dilinə tərcüməsini yaz. Format dəqiq belə olsun (sətr sonlarına diqqət et):\n[Azərbaycan dilində caption]\n\n🇷🇺\n[Rus dilində tərcümə]\nBaşqa heç bir başlıq, izahat və ya əlavə mətn yazma — yalnız bu üç hissəni (AZ mətn, 🇷🇺, RU mətn) yaz.`
      : '';
    const varietySection = `\n\nBu captionun açılış cümləsi "${venueRef}" sözü ilə BAŞLAMASIN — fərqli, orijinal bir açılış tap (sual, duyğu təsviri, qısa fakt, və ya emoji ilə açılan ifadə ola bilər).`;
    try {
      const caption = await callAIWithFallback({
        primaryProvider: aiProvider,
        aiSettings,
        onFallback: (from, to) => addToast(`⚡ ${from} limiti → ${to}-ə keçildi`, 'info'),
        userText: `Bu restoran şəkili üçün Azərbaycanca Instagram caption yaz. Məkan: "${venueRef}". Maksimum 2 cümlə olsun (1 cümlə də kifayətdir, uzatmaq lazım deyil). Yalnız caption mətni yaz, başqa heç nə əlavə etmə.${guideSection}${varietySection}${langGuard}${russianSection}`,
        imageBase64: photo.dataUrl.split(',')[1],
        maxTokens: includeRussian ? 450 : 250,
      });
      if (caption) {
        setAiCaptions((prev) => new Map([...prev, [photoNum, caption]]));
        addToast(`#${photoNum} yenidən yazıldı ✓`, 'success');
      } else {
        throw new Error('Boş cavab gəldi');
      }
    } catch (err) {
      addToast(`#${photoNum} yazıla bilmədi: ${err instanceof Error ? err.message : 'xəta'}`, 'error');
    }
    setRegenLoadingNums((prev) => { const n = new Set(prev); n.delete(photoNum); return n; });
  }, [venueName, captionGuide, aiProvider, aiSettings, addToast, includeRussian]);

  // Load saved plan keys, venue presets and AI config — profil dəyişəndə yenidən yüklənir
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.list(`${profilePrefix}plan-`, false);
        if (res && res.keys) setSavedPlanKeys(res.keys.filter((k) => k.startsWith(`${profilePrefix}plan-`)));
      } catch { /* ignore */ }
      try {
        const vRes = await window.storage.get(`${profilePrefix}venue-presets`, false);
        if (vRes && vRes.value) {
          const saved = JSON.parse(vRes.value);
          if (Array.isArray(saved) && saved.length > 0) setVenuePresets(saved);
          else setVenuePresets(INITIAL_VENUE_PRESETS);
        } else {
          setVenuePresets(INITIAL_VENUE_PRESETS);
        }
      } catch { /* ignore */ }
      // AI konfiqurasiyası bütün profillərə aiddir, profil-spesifik deyil
      try {
        const aiRes = await window.storage.get('ai-config', false);
        if (aiRes && aiRes.value) {
          const cfg = JSON.parse(aiRes.value);
          if (cfg.provider) setAiProvider(cfg.provider);
          if (cfg.settings) setAiSettings((prev) => ({ ...prev, ...cfg.settings }));
        }
      } catch { /* ignore */ }
    })();
  }, [profilePrefix]);

  const persistAiConfig = useCallback(async (nextProvider, nextSettings) => {
    try { await window.storage.set('ai-config', JSON.stringify({ provider: nextProvider, settings: nextSettings }), false); } catch { /* ignore */ }
  }, []);

  // API açarını yoxla — kiçik test sorğusu göndərir
  const verifyApiKey = useCallback(async (providerId) => {
    const cfg = aiSettings[providerId] || {};
    // Worker-dəki açarla yoxlama edilir
    setKeyVerifyStatus((prev) => ({ ...prev, [providerId]: 'loading' }));
    try {
      await callAI({
        provider: providerId,
        apiKey: '', // Worker-dədir
        model: cfg.model,
        userText: 'Salam',
        maxTokens: 5,
      });
      setKeyVerifyStatus((prev) => ({ ...prev, [providerId]: 'ok' }));
    } catch {
      setKeyVerifyStatus((prev) => ({ ...prev, [providerId]: 'error' }));
    }
  }, [aiSettings]);

  const updateAiProvider = useCallback((id) => {
    setAiProvider(id);
    persistAiConfig(id, aiSettings);
  }, [aiSettings, persistAiConfig]);

  const updateAiKey = useCallback((providerId, key) => {
    setAiSettings((prev) => {
      const next = { ...prev, [providerId]: { ...prev[providerId], key } };
      persistAiConfig(aiProvider, next);
      return next;
    });
  }, [aiProvider, persistAiConfig]);

  const updateAiModel = useCallback((providerId, model) => {
    setAiSettings((prev) => {
      const next = { ...prev, [providerId]: { ...prev[providerId], model } };
      persistAiConfig(aiProvider, next);
      return next;
    });
  }, [aiProvider, persistAiConfig]);

  const addVenuePreset = useCallback(async () => {
    const name = newVenueInput.trim();
    if (!name) return;
    if (venuePresets.includes(name)) { addToast('Bu məkan artıq mövcuddur', 'info'); return; }
    const next = [...venuePresets, name];
    setVenuePresets(next);
    setVenueName(name);
    setNewVenueInput('');
    try { await window.storage.set(`${profilePrefix}venue-presets`, JSON.stringify(next), false); } catch { /* ignore */ }
  }, [newVenueInput, venuePresets, addToast, profilePrefix]);

  const removeVenuePreset = useCallback(async (name) => {
    const next = venuePresets.filter((v) => v !== name);
    setVenuePresets(next);
    if (venueName === name) setVenueName('');
    try { await window.storage.set(`${profilePrefix}venue-presets`, JSON.stringify(next), false); } catch { /* ignore */ }
  }, [venuePresets, venueName, profilePrefix]);

  const saveCurrentPlan = useCallback(async () => {
    if (!schedule) return;
    const key = `${profilePrefix}plan-${year}-${monthIndex}`;
    const data = { schedule, published: [...published], monthIndex, year, venueName };
    try {
      await window.storage.set(key, JSON.stringify(data), false);
      setSavedPlanKeys((prev) => prev.includes(key) ? prev : [...prev, key]);
      addToast(`${MONTHS[monthIndex]} ${year} planı saxlandı`, 'success');
    } catch {
      addToast('Plan saxlanıla bilmədi', 'error');
    }
  }, [schedule, published, monthIndex, year, venueName, addToast, profilePrefix]);

  const loadPlan = useCallback(async (key) => {
    try {
      const res = await window.storage.get(key, false);
      if (!res || !res.value) { addToast('Plan tapılmadı', 'error'); return; }
      const data = JSON.parse(res.value);
      setSchedule(data.schedule);
      setPublished(new Set(data.published || []));
      setMonthIndex(data.monthIndex ?? monthIndex);
      setYear(data.year ?? year);
      if (data.venueName) setVenueName(data.venueName);
      // Plan yükləndikdən sonra dərhal "köhnəlmiş" xəbərdarlığı çıxmasın —
      // imzanı hazırkı dataya görə təyin edirik.
      scheduleSignatureRef.current = computeDataSignature(photos, carousels, captionsMap);
      addToast(`${MONTHS[data.monthIndex ?? monthIndex]} ${data.year ?? year} planı yükləndi`, 'success');
      setActiveTab('plan');
    } catch {
      addToast('Plan yüklənə bilmədi', 'error');
    }
  }, [addToast, monthIndex, year, photos, carousels, captionsMap]);

  const deleteSavedPlan = useCallback(async (key) => {
    try {
      await window.storage.delete(key, false);
      setSavedPlanKeys((prev) => prev.filter((k) => k !== key));
      addToast('Plan silindi', 'success');
    } catch {
      addToast('Plan silinə bilmədi', 'error');
    }
  }, [addToast]);

  // Xüsusi gün (Party/tədbir) idarəetməsi — bu günlər plan generasiyasında
  // toxunulmaz qalır, AI/random sıralama bunları nəzərə almır.
  const setSpecialDay = useCallback((day, label, caption) => {
    setSpecialDays((prev) => ({ ...prev, [day]: { label, caption } }));
    setSchedule(null);
  }, []);

  const removeSpecialDay = useCallback((day) => {
    setSpecialDays((prev) => {
      const next = { ...prev };
      delete next[day];
      return next;
    });
    setSchedule(null);
  }, []);

  const generateSchedule = useCallback(async () => {
    if (photos.length === 0) return;
    const items = buildPostItems(photos, carousels, captionsMap);
    const seq = buildSequence(items);
    const days = new Date(year, monthIndex + 1, 0).getDate();

    // Xüsusi günlər (Party və s.) — bu günlər rezerv olunur, AI/random
    // ardıcıllıq onlara toxunmur. Qalan şəkil/video yalnız "boş" günlərə paylanır.
    const specialDayNums = Object.keys(specialDays).map(Number).filter((d) => d >= 1 && d <= days);
    const specialDaySet = new Set(specialDayNums);
    const regularDaysCount = days - specialDaySet.size;

    const counts = regularDaysCount > 0 ? distributeDays(seq.length, regularDaysCount) : [];
    const result = [];
    let idx = 0;
    let regularDayCursor = 0;

    for (let d = 1; d <= days; d++) {
      if (specialDaySet.has(d)) {
        // Xüsusi gün — şəkil yoxdur, sadəcə yazılmış caption (varsa)
        const sd = specialDays[d];
        result.push({
          day: d,
          posts: sd.caption ? [{
            id: `special:${d}`,
            type: 'special',
            category: sd.label || 'Xüsusi gün',
            caption: sd.caption,
            coverNumber: null,
            photos: [],
          }] : [],
          specialLabel: sd.label || (uiLang === 'ru' ? 'Особый день' : 'Xüsusi gün'),
        });
      } else {
        const c = counts[regularDayCursor] || 0;
        result.push({ day: d, posts: seq.slice(idx, idx + c) });
        idx += c;
        regularDayCursor++;
      }
    }

    setSchedule(result);
    scheduleSignatureRef.current = computeDataSignature(photos, carousels, captionsMap);

    try {
      const res = await window.storage.get(`${profilePrefix}published-${year}-${monthIndex}`, false);
      const arr = res && res.value ? JSON.parse(res.value) : [];
      setPublished(new Set(arr));
    } catch {
      setPublished(new Set());
    }
    addToast('Plan yaradıldı', 'success');
  }, [photos, carousels, captionsMap, year, monthIndex, addToast, profilePrefix, specialDays, uiLang]);

  const togglePublished = useCallback((postId) => {
    setPublished((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      window.storage.set(`${profilePrefix}published-${year}-${monthIndex}`, JSON.stringify([...next]), false).catch(() => {});
      return next;
    });
  }, [year, monthIndex, profilePrefix]);

  const resetPublished = useCallback(async () => {
    setPublished(new Set());
    try { await window.storage.delete(`${profilePrefix}published-${year}-${monthIndex}`, false); } catch { /* nothing */ }
  }, [year, monthIndex, profilePrefix]);

  const formatExport = useCallback(() => {
    if (!schedule) return '';
    const lines = [
      `${MONTHS[monthIndex].toUpperCase()} ${year} — PAYLAŞIM PLANI`,
      '='.repeat(36), '',
    ];
    schedule.forEach((day) => {
      lines.push(`Gün ${day.day}`);
      if (day.posts.length === 0) lines.push('  (paylaşım yoxdur)');
      day.posts.forEach((post) => {
        const mark = published.has(post.id) ? '[✓ paylaşıldı] ' : '';
        const files = post.photos.map((ph) => ph.filename).join(', ');
        const tag = post.type === 'carousel' ? `Karusel (${post.photos.length} şəkil)` : post.type === 'special' ? '🎉 Xüsusi gün' : 'Şəkil';
        lines.push(post.type === 'special'
          ? `  • [${post.category}] ${tag}`
          : `  • ${mark}[${post.category}] ${tag}: ${files}`);
        lines.push(post.caption ? `    "${post.caption}"` : `    (caption tapılmadı — şəkil №${post.coverNumber})`);
      });
      lines.push('');
    });
    return lines.join('\n');
  }, [schedule, monthIndex, year, published]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatExport());
      setCopyStatus('Kopyalandı!');
      addToast('Panoya kopyalandı', 'success');
    } catch {
      setCopyStatus('Alınmadı');
      addToast('Kopyalama alınmadı', 'error');
    }
    setTimeout(() => setCopyStatus(''), 2000);
  }, [formatExport, addToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([formatExport()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paylasim-plani-${MONTHS[monthIndex]}-${year}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('.txt faylı yükləndi', 'success');
  }, [formatExport, monthIndex, year, addToast]);

  const handleExportPDF = useCallback(() => {
    if (!schedule) return;
    exportPDF(schedule, monthIndex, year, published, venueName);
    addToast('PDF hazırlanır — yeni pəncərədə açılacaq, Ctrl+P ilə çap et', 'success');
  }, [schedule, monthIndex, year, published, venueName, addToast]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleReorderPost = useCallback((dayNum, fromIdx, toIdx) => {
    setSchedule((prev) => {
      if (!prev) return prev;
      return prev.map((day) => {
        if (day.day !== dayNum) return day;
        const posts = [...day.posts];
        if (toIdx < 0 || toIdx >= posts.length) return day;
        const [moved] = posts.splice(fromIdx, 1);
        posts.splice(toIdx, 0, moved);
        return { ...day, posts };
      });
    });
  }, []);

  const handleEditCaption = useCallback((postId, newCaption) => {
    setSchedule((prev) => {
      if (!prev) return prev;
      return prev.map((day) => ({
        ...day,
        posts: day.posts.map((p) => p.id === postId ? { ...p, caption: newCaption } : p),
      }));
    });
  }, []);

  // Postu bir gündən başqa bir günə köçürür (məs. ayın 7-dən 16-na)
  const handleMovePostToDay = useCallback((postId, fromDay, toDay) => {
    if (fromDay === toDay) return;
    setSchedule((prev) => {
      if (!prev) return prev;
      let movedPost = null;
      const withoutPost = prev.map((day) => {
        if (day.day !== fromDay) return day;
        const idx = day.posts.findIndex((p) => p.id === postId);
        if (idx === -1) return day;
        const posts = [...day.posts];
        movedPost = posts.splice(idx, 1)[0];
        return { ...day, posts };
      });
      if (!movedPost) return prev;
      return withoutPost.map((day) => {
        if (day.day !== toDay) return day;
        return { ...day, posts: [...day.posts, movedPost] };
      });
    });
  }, []);

  /* ------------------------------- Tabs ------------------------------- */

  const tabs = [
    { id: 'photos', label: t('tabPhotos'), done: photos.length > 0 },
    { id: 'categories', label: t('tabCategories'), done: photos.length > 0 && categorizedCount === photos.length },
    { id: 'captions', label: t('tabCaptions'), done: matchedCount > 0 && matchedCount === photos.length },
    { id: 'plan', label: t('tabPlan'), done: !!schedule },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .menu-font { font-family: 'Fraunces', serif; }
        .dotted-leader { flex:1; border-bottom:1px dotted #b8ada0; margin:0 10px; height:1px; transform:translateY(-4px); }
        .dark .dotted-leader { border-bottom-color: #57534e; }
      `}</style>

      <ToastContainer toasts={toasts} remove={removeToast} />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute left-0 top-0">
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="px-3 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 transition-colors text-xs font-semibold flex items-center gap-1.5"
              >
                <Layers size={13} /> {activeProfile}
              </button>
              {profileMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg p-2 z-40 text-left">
                  <p className="text-[10px] uppercase tracking-wide text-stone-400 dark:text-stone-500 px-2 pt-1 pb-1.5">
                    {uiLang === 'ru' ? 'Профили' : 'Profillər'}
                  </p>
                  {profiles.map((p) => (
                    <div key={p} className="flex items-center gap-1">
                      <button
                        onClick={() => { switchProfile(p); setProfileMenuOpen(false); }}
                        className={`flex-1 text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 ${p === activeProfile ? 'bg-stone-100 dark:bg-stone-800 font-medium' : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'}`}
                      >
                        {p === activeProfile && <Check size={12} className="text-emerald-500" />}
                        <span className={p === activeProfile ? '' : 'pl-[18px]'}>{p}</span>
                      </button>
                      {p !== 'Əsas' && (
                        <button onClick={() => removeProfile(p)} className="p-1.5 text-stone-300 hover:text-red-400 rounded-lg">
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-stone-100 dark:border-stone-700 mt-2 pt-2 flex gap-1.5 px-1">
                    <input
                      value={newProfileInput}
                      onChange={(e) => setNewProfileInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { addProfile(newProfileInput); setNewProfileInput(''); } }}
                      placeholder={uiLang === 'ru' ? 'Новый профиль' : 'Yeni profil'}
                      className="flex-1 text-xs border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 dark:bg-stone-800 dark:text-stone-200"
                    />
                    <button
                      onClick={() => { addProfile(newProfileInput); setNewProfileInput(''); }}
                      className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg px-2 py-1.5"
                    ><Plus size={12} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {undoSnapshot && (
              <button
                onClick={performUndo}
                title={uiLang === 'ru' ? 'Отменить последнее действие' : 'Son əməliyyatı geri qaytar'}
                className="px-2.5 py-2 rounded-full border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:border-orange-300 transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <RotateCcw size={13} /> {uiLang === 'ru' ? 'Отмена' : 'Geri qaytar'}
              </button>
            )}
            <button
              onClick={toggleUiLang}
              title="AZ / RU"
              className="px-2.5 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 transition-colors flex items-center gap-1"
            >
              {uiLang === 'az' ? <RussianFlag /> : <AzerbaijanFlag />}
            </button>
            <button
              onClick={toggleDarkMode}
              title={darkMode ? t('darkModeOff') : t('darkModeOn')}
              className="p-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 transition-colors dark:text-stone-400"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-orange-700/70 dark:text-orange-400/80 mb-2">{t('appSubtitle')}</p>
          <h1 className="menu-font text-3xl md:text-4xl font-semibold text-stone-900 dark:text-stone-50">{t('appTitle')}</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm max-w-md mx-auto">
            {t('appDesc')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeTab === tab.id ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}`}>
              {tab.done && <Check size={14} className={activeTab === tab.id ? 'text-emerald-400' : 'text-emerald-500'} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Provider Settings — kateqoriya/karusel/caption funksiyalarının hamısı bunu istifadə edir */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 mb-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide flex items-center gap-1.5 flex-shrink-0">
            <Sparkles size={12} /> {t('aiProvider')}
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {AI_PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => updateAiProvider(p.id)}
                className={`text-xs px-3 py-1.5 rounded-full border ${aiProvider === p.id ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {/* Açar inputları silindi — açarlar Cloudflare Worker-də saxlanılır */}
          <span className="text-[11px] text-stone-400 dark:text-stone-500 w-full sm:w-auto">
            {aiProvider === 'anthropic'
              ? <><span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('aiFallbackAnthropic')}</span> {t('aiKeysNote')}</>
              : <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('aiFallbackOther')}</span>
            }
          </span>
          <label className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300 cursor-pointer border-t border-stone-100 dark:border-stone-700 w-full pt-3 mt-1">
            <input
              type="checkbox"
              checked={includeRussian}
              onChange={(e) => setIncludeRussian(e.target.checked)}
              className="rounded border-stone-300 dark:border-stone-600 text-orange-600 focus:ring-orange-400"
            />
            <RussianFlag />
            {uiLang === 'ru' ? 'Добавить русский перевод к подписи (AZ + RU в одной подписи)' : 'Rus dili tərcüməsini caption-a əlavə et (AZ + RU bir caption-da)'}
          </label>
        </div>

        {/* ---- TAB 1: PHOTOS ---- */}
        {activeTab === 'photos' && (
          <div className="space-y-5">
            {/* Venue name section */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
              <h3 className="menu-font text-lg font-semibold mb-1">{t('venueTitle')}</h3>
              <p className="text-stone-500 text-sm mb-3 dark:text-stone-400">{t('venueDesc')}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {venuePresets.map((v) => (
                  <div key={v} className={`flex items-center gap-1 rounded-full border transition-colors ${venueName === v ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'}`}>
                    <button
                      onClick={() => setVenueName(venueName === v ? '' : v)}
                      className="pl-3 pr-2 py-1.5 text-sm"
                    >{v}</button>
                    <button
                      onClick={() => removeVenuePreset(v)}
                      className={`pr-2 py-1.5 hover:opacity-60 transition-opacity ${venueName === v ? 'text-white/70' : 'text-stone-400'}`}
                      title="Sil"
                    ><X size={12} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newVenueInput}
                  onChange={(e) => setNewVenueInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addVenuePreset(); }}
                  placeholder={t('venueAddPlaceholder')}
                  className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:placeholder-stone-500"
                />
                <button onClick={addVenuePreset} disabled={!newVenueInput.trim()} className="bg-stone-900 text-white rounded-lg px-3 py-2 text-sm flex items-center gap-1 hover:bg-stone-800 disabled:opacity-40">
                  <Plus size={14} /> {t('addBtn')}
                </button>
              </div>
              {venueName && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><Check size={12} /> {t('venueSelected')}: <strong>{venueName}</strong></p>
              )}
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/30' : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-500'}`}
            >
              <ImagePlus className="mx-auto mb-3 text-stone-400 dark:text-stone-500" size={36} />
              <p className="text-stone-700 font-medium dark:text-stone-300">{t('uploadDrag')}</p>
              <p className="text-stone-400 text-sm mt-1 dark:text-stone-500">{t('uploadHint')}</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }} />
            </div>

            {photos.length > 0 && (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-stone-500 dark:text-stone-400">{photos.length} {t('photosUploaded')}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={runAICarousel}
                      disabled={aiCarouselLoading || photos.length < 2}
                      className="bg-orange-600 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-orange-700 disabled:opacity-50"
                    >
                      {aiCarouselLoading ? <><Loader2 size={14} className="animate-spin" /> {uiLang === 'ru' ? 'Поиск...' : 'Axtarılır...'}</> : <><Sparkles size={14} /> {uiLang === 'ru' ? 'AI предложение карусели' : 'AI karusel təklifi'}</>}
                    </button>
                    {aiCarouselLoading && (
                      <button onClick={stopAICarousel} className="bg-red-600 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-red-700">
                        <XCircle size={14} /> {uiLang === 'ru' ? 'Стоп' : 'Dayandır'}
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectMode((s) => { if (!s) setDeleteMode(false); return !s; }); setSelected(new Set()); }}
                      className={`rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 border ${selectMode ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                    >
                      <Layers size={14} /> {selectMode ? (uiLang === 'ru' ? 'Закрыть выбор' : 'Seçimi bağla') : (uiLang === 'ru' ? 'Выбрать для карусели' : 'Karusel seç')}
                    </button>
                    <button
                      onClick={() => { setDeleteMode((d) => { if (!d) setSelectMode(false); return !d; }); setSelected(new Set()); }}
                      className={`rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 border ${deleteMode ? 'bg-red-600 text-white border-red-600' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                    >
                      <X size={14} /> {deleteMode ? (uiLang === 'ru' ? 'Закрыть удаление' : 'Silməni bağla') : (uiLang === 'ru' ? 'Удалить фото' : 'Şəkil sil')}
                    </button>
                    {!confirmDeleteAll ? (
                      <button
                        onClick={() => setConfirmDeleteAll(true)}
                        className="rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 border border-red-200 text-red-500 bg-white hover:bg-red-50 dark:bg-stone-900"
                      >
                        <X size={14} /> {t('deleteAllBtn')}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 border border-red-200 rounded-lg px-2 py-1 bg-red-50 dark:bg-stone-900">
                        <span className="text-xs text-red-600">{uiLang === 'ru' ? 'Вы уверены?' : 'Əminsiniz?'}</span>
                        <button
                          onClick={() => {
                            pushUndoSnapshot(photos, carousels);
                            setPhotos([]);
                            setCarousels([]);
                            setSuggestedCarousels([]);
                            setSelected(new Set());
                            setSchedule(null);
                            setConfirmDeleteAll(false);
                            addToast(uiLang === 'ru' ? 'Все фото удалены' : 'Bütün şəkillər silindi', 'info');
                          }}
                          className="text-xs bg-red-600 text-white rounded-md px-2 py-1 hover:bg-red-700"
                        >{uiLang === 'ru' ? 'Да, удалить' : 'Bəli, sil'}</button>
                        <button
                          onClick={() => setConfirmDeleteAll(false)}
                          className="text-xs border border-stone-200 rounded-md px-2 py-1 hover:bg-stone-100 dark:border-stone-700"
                        >{uiLang === 'ru' ? 'Отмена' : 'Ləğv et'}</button>
                      </div>
                    )}
                  </div>
                </div>
                {selectMode && (
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    {uiLang === 'ru'
                      ? 'Выбери 2+ фото для карусели, затем нажми "Сделать карусель" на панели ниже. Потом выбери другие фото для новой группы.'
                      : 'Karusel etmək üçün 2+ şəkil seç, aşağıdakı çubuqda "Karusel et" klikləyin. Sonra yeni qrup üçün başqa şəkilləri seç.'}
                  </p>
                )}
                {deleteMode && (
                  <p className="text-xs text-red-400">{uiLang === 'ru' ? 'Нажми ✕ на фото, которое хочешь удалить.' : 'Silmək istədiyiniz şəkilin ✕ düyməsinə basın.'}</p>
                )}

                <PhotoGrid
                  photos={photos} categories={categories} carousels={carousels}
                  selectMode={selectMode} deleteMode={deleteMode} selected={selected}
                  onToggleSelect={togglePhotoSelect} onRemove={removePhoto}
                />

                {/* Sticky carousel confirm bar — always visible in select mode */}
                {selectMode && (
                  <div className="sticky bottom-4 z-30">
                    <div className="bg-stone-900 text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-xl">
                      <span className="text-sm">
                        {selected.size === 0
                          ? (uiLang === 'ru' ? 'Выбери фото для карусели' : 'Karusel üçün şəkillər seçin')
                          : (uiLang === 'ru' ? `Выбрано фото: ${selected.size}` : `${selected.size} şəkil seçildi`)}
                      </span>
                      <div className="flex gap-2">
                        {selected.size >= 2 && (
                          <button onClick={createCarouselFromSelection} className="bg-orange-500 hover:bg-orange-400 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 font-medium">
                            <Layers size={14} /> {t('carouselBtn')} ({selected.size})
                          </button>
                        )}
                        <button onClick={() => { setSelectMode(false); setSelected(new Set()); }} className="bg-stone-700 hover:bg-stone-600 text-white rounded-lg px-3 py-2 text-sm">
                          {uiLang === 'ru' ? 'Закрыть' : 'Bağla'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <CarouselManager
                  photos={photos} carousels={carousels} suggestedCarousels={suggestedCarousels}
                  onConfirmSuggestion={confirmSuggestion} onDismissSuggestion={dismissSuggestion}
                  onRemoveCarousel={removeCarousel}
                  uiLang={uiLang}
                />
              </>
            )}
          </div>
        )}

        {/* ---- TAB 2: CATEGORIES ---- */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {photos.length === 0 ? <EmptyState text={uiLang === 'ru' ? 'Сначала загрузи фото.' : 'Əvvəlcə şəkilləri yüklə.'} /> : (
              <>
                <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
                  <h3 className="menu-font text-lg font-semibold mb-3">{t('categoriesTitle')}</h3>
                  <p className="text-stone-500 text-sm mb-3 dark:text-stone-400">{t('categoriesDesc')}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map((c, i) => (
                      <span key={c} className={`flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-sm font-medium ${PALETTE[i % PALETTE.length].bg} ${PALETTE[i % PALETTE.length].text}`}>
                        {c}
                        <button onClick={() => removeCategory(c)} className="hover:opacity-60"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newCat} onChange={(e) => setNewCat(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }}
                      placeholder={t('categoryAddPlaceholder')}
                      className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:placeholder-stone-500" />
                    <button onClick={addCategory} className="bg-stone-900 text-white rounded-lg px-3 py-2 text-sm flex items-center gap-1 hover:bg-stone-800">
                      <Plus size={14} /> {t('addBtn')}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h3 className="menu-font text-lg font-semibold">{t('photoCategoriesTitle')}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => { setBulkEditMode((v) => !v); setBulkSelected(new Set()); }}
                        className={`rounded-lg px-3 py-2 text-sm flex items-center gap-1.5 border ${bulkEditMode ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                      >
                        <Layers size={14} /> {uiLang === 'ru' ? (bulkEditMode ? 'Закрыть массовое' : 'Массовое редактирование') : (bulkEditMode ? 'Toplunu bağla' : 'Toplu redaktə')}
                      </button>
                      <button onClick={runAI} disabled={aiLoading || categories.length === 0}
                        className="bg-orange-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-orange-700 disabled:opacity-50">
                        {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {aiLoading ? `${uiLang === 'ru' ? 'Анализ' : 'Təhlil edilir'} (${aiProgress.done}/${aiProgress.total})` : t('aiGuessBtn')}
                      </button>
                      {aiLoading && (
                        <button onClick={stopAI} className="bg-red-600 text-white rounded-lg px-3 py-2 text-sm flex items-center gap-1.5 hover:bg-red-700">
                          <XCircle size={14} /> {uiLang === 'ru' ? 'Остановить' : 'Dayandır'}
                        </button>
                      )}
                    </div>
                  </div>
                  {categorizedCount > 0 && <p className="text-sm text-stone-500 mb-3 dark:text-stone-400">{categorizedCount}/{photos.length} {t('photoCategoriesProgress')}</p>}

                  {bulkEditMode && (
                    <div className="mb-4 p-3 rounded-xl border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30">
                      <p className="text-xs text-stone-600 dark:text-stone-300 mb-2">
                        {uiLang === 'ru'
                          ? `Выбрано фото: ${bulkSelected.size}. Заполни поля, которые хочешь применить ко всем выбранным.`
                          : `${bulkSelected.size} şəkil seçildi. Hamısına tətbiq etmək istədiyin sahələri doldur.`}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <select value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)}
                          className="text-sm border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 dark:bg-stone-900 dark:text-stone-200">
                          <option value="">{uiLang === 'ru' ? '— категория не меняется —' : '— kateqoriya dəyişmir —'}</option>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input value={bulkProductName} onChange={(e) => setBulkProductName(e.target.value)}
                          placeholder={t('productNamePlaceholder')}
                          className="text-sm border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 dark:bg-stone-900 dark:text-stone-200 flex-1 min-w-[160px]" />
                        <input value={bulkPersonName} onChange={(e) => setBulkPersonName(e.target.value)}
                          placeholder={t('personNamePlaceholder')}
                          className="text-sm border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 dark:bg-stone-900 dark:text-stone-200 flex-1 min-w-[160px]" />
                      </div>
                      <button
                        onClick={applyBulkEdit}
                        disabled={bulkSelected.size === 0 || (!bulkCategory && !bulkProductName.trim() && !bulkPersonName.trim())}
                        className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Check size={13} /> {uiLang === 'ru' ? `Применить к ${bulkSelected.size}` : `${bulkSelected.size}-na tətbiq et`}
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(() => {
                      // Carousel üzvlərini qruplaşdır — bir kart kimi göstər
                      const carouselNumberSet = new Set(carousels.flatMap((c) => c.numbers));
                      const processedNumbers = new Set();
                      const items = [];

                      // Əvvəlcə carousel qruplarını əlavə et
                      carousels.forEach((c) => {
                        const members = c.numbers
                          .map((n) => photos.find((p) => p.number === n))
                          .filter(Boolean)
                          .sort((a, b) => a.number - b.number);
                        if (members.length === 0) return;
                        members.forEach((m) => processedNumbers.add(m.number));
                        items.push({ type: 'carousel', members, cover: members[0] });
                      });

                      // Sonra tək şəkilləri əlavə et
                      photos.forEach((p) => {
                        if (p.number != null && processedNumbers.has(p.number)) return;
                        items.push({ type: 'single', members: [p], cover: p });
                      });

                      return items.map((item) => {
                        const p = item.cover;
                        const parts = p.category ? p.category.split(' / ') : ['', ''];
                        const cat1 = parts[0] || '';
                        const cat2 = parts[1] || '';
                        const allMemberIds = item.members.map((m) => m.id);
                        const isBulkSelected = allMemberIds.every((id) => bulkSelected.has(id));

                        return (
                          <div key={item.type === 'carousel' ? `carousel-${item.members.map(m => m.number).join('-')}` : p.id}
                            className={`flex items-center gap-3 border rounded-xl p-2 transition-colors ${bulkEditMode && isBulkSelected ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-600' : 'border-stone-200 dark:border-stone-700'}`}>
                            {bulkEditMode && (
                              <input
                                type="checkbox"
                                checked={isBulkSelected}
                                onChange={() => {
                                  setBulkSelected((prev) => {
                                    const next = new Set(prev);
                                    if (isBulkSelected) allMemberIds.forEach((id) => next.delete(id));
                                    else allMemberIds.forEach((id) => next.add(id));
                                    return next;
                                  });
                                }}
                                className="flex-shrink-0 w-4 h-4 rounded border-stone-300 dark:border-stone-600 text-orange-600 focus:ring-orange-400"
                              />
                            )}
                            {/* Şəkil(lər) */}
                            {item.type === 'carousel' ? (
                              <div className="relative flex-shrink-0 w-12 h-12">
                                {item.members.slice(0, 3).map((m, idx) => (
                                  <img key={m.id} src={m.dataUrl} alt={m.filename}
                                    className="absolute w-10 h-10 rounded-lg object-cover border-2 border-white dark:border-stone-800"
                                    style={{ left: idx * 6, top: idx * 6, zIndex: 10 - idx }} />
                                ))}
                                <div className="absolute bottom-0 right-0 bg-stone-900 text-white text-[9px] rounded-full px-1 py-0.5 z-20 flex items-center gap-0.5">
                                  <Layers size={8} /> {item.members.length}
                                </div>
                              </div>
                            ) : (
                              <div className="relative flex-shrink-0">
                                <img src={p.dataUrl} alt={p.filename} className="w-12 h-12 rounded-lg object-cover" />
                                {p.isVideo && (
                                  <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] rounded-full px-1 py-0.5 z-20 leading-none">
                                    🎬
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-stone-500 truncate dark:text-stone-400">
                                {item.type === 'carousel'
                                  ? `Karusel: ${item.members.map(m => m.filename).join(', ')}`
                                  : p.filename}
                              </p>
                              <select value={cat1} onChange={(e) => {
                                const newCat = e.target.value;
                                // Carousel üçün bütün üzvlərə eyni kateqoriyanı tətbiq et
                                const applyTo = item.type === 'carousel' ? item.members : [p];
                                applyTo.forEach((m) => {
                                  if (!newCat) {
                                    setPhotoCategory(m.id, cat2 || '');
                                  } else {
                                    setPhotoCategory(m.id, cat2 && cat2 !== newCat ? `${newCat} / ${cat2}` : newCat);
                                  }
                                });
                              }}
                                className="w-full mt-1 text-sm border border-stone-200 rounded-md px-1.5 py-1 bg-white dark:bg-stone-900 dark:border-stone-700 dark:text-stone-200">
                                <option value="">{t('cat1Placeholder')}</option>
                                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                <option value="Digər">{t('otherCategory')}</option>
                              </select>
                              {cat1 && (
                                <select value={cat2} onChange={(e) => {
                                  const newCat2 = e.target.value;
                                  const applyTo = item.type === 'carousel' ? item.members : [p];
                                  applyTo.forEach((m) => {
                                    setPhotoCategory(m.id, newCat2 && newCat2 !== cat1 ? `${cat1} / ${newCat2}` : cat1);
                                  });
                                }}
                                  className="w-full mt-1 text-xs border border-stone-100 rounded-md px-1.5 py-1 bg-stone-50 text-stone-500 dark:bg-stone-950 dark:text-stone-400 dark:border-stone-700">
                                  <option value="">{t('cat2Placeholder')}</option>
                                  {categories.filter(c => c !== cat1).map((c) => <option key={c} value={c}>{c}</option>)}
                                  {cat1 !== 'Digər' && <option value="Digər">{t('otherCategory')}</option>}
                                </select>
                              )}
                              {/* Məhsul adı və Şəxs adı — isteğe bağlı, caption generasiyasında istifadə olunur */}
                              <input
                                type="text"
                                value={p.productName || ''}
                                onChange={(e) => {
                                  const applyTo = item.type === 'carousel' ? item.members : [p];
                                  applyTo.forEach((m) => setPhotoProductName(m.id, e.target.value));
                                }}
                                placeholder={t('productNamePlaceholder')}
                                className="w-full mt-1 text-xs border border-stone-100 rounded-md px-1.5 py-1 bg-white text-stone-600 placeholder-stone-400 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 dark:placeholder-stone-500"
                              />
                              <input
                                type="text"
                                value={p.personName || ''}
                                onChange={(e) => {
                                  const applyTo = item.type === 'carousel' ? item.members : [p];
                                  applyTo.forEach((m) => setPhotoPersonName(m.id, e.target.value));
                                }}
                                placeholder={t('personNamePlaceholder')}
                                className="w-full mt-1 text-xs border border-stone-100 rounded-md px-1.5 py-1 bg-white text-stone-600 placeholder-stone-400 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 dark:placeholder-stone-500"
                              />
                              <label className="flex items-center gap-1.5 mt-1.5 text-[11px] text-stone-500 dark:text-stone-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.type === 'carousel' ? item.members.every((m) => m.isVideo) : !!p.isVideo}
                                  onChange={() => togglePhotoIsVideo(item.members.map((m) => m.id))}
                                  className="rounded border-stone-300 dark:border-stone-600 text-red-600 focus:ring-red-400"
                                />
                                🎬 {uiLang === 'ru' ? 'Это видео (превью)' : 'Bu videodur (thumbnail)'}
                              </label>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ---- TAB 3: CAPTIONS ---- */}
        {activeTab === 'captions' && (
          <div className="space-y-5">
            {/* ---- AI GENERATOR SECTION ---- */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-orange-500" />
                <h3 className="menu-font text-lg font-semibold">{t('aiCaptionGenTitle')}</h3>
              </div>
              <p className="text-stone-500 text-sm mb-4 dark:text-stone-400">
                {t('aiCaptionGenDesc')}
              </p>

              <div className="mb-3">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5 dark:text-stone-400">
                  {t('captionGuideLabel')}
                </label>
                <textarea
                  value={captionGuide}
                  onChange={(e) => setCaptionGuide(e.target.value)}
                  rows={4}
                  placeholder={'1. Çiyələk və matça — bir-birini tamamlayan dadların ən gözəl nümunəsi. 🍓🍵\nVista-da bu harmoniyanı hiss edin. ✨\n\n2. Hər fincanın arxasında peşəkarlıq dayanır. ☕🤍\nChemex ilə hazırlanmış qəhvələrimizi sınayın.'}
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:placeholder-stone-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={runCaptionGen}
                  disabled={captionGenLoading || photos.length === 0}
                  className="bg-orange-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-orange-700 disabled:opacity-50"
                >
                  {captionGenLoading
                    ? <><Loader2 size={14} className="animate-spin" /> {t('generatingBtn')} ({captionGenProgress.done}/{captionGenProgress.total})</>
                    : <><Sparkles size={14} /> {uiLang === 'ru' ? 'Написать подпись' : 'Caption yaz'}</>}
                </button>
                {captionGenLoading && (
                  <button onClick={stopCaptionGen} className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-red-700">
                    <XCircle size={14} /> {uiLang === 'ru' ? 'Остановить' : 'Dayandır'}
                  </button>
                )}
                {aiCaptions.size > 0 && !captionGenLoading && (
                  <>
                    <button
                      onClick={addAllAiCaptionsToPaste}
                      className="bg-stone-900 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-stone-700"
                    >
                      <Check size={14} /> {uiLang === 'ru' ? 'Подтвердить подписи' : 'Captionları təsdiqlə'}
                    </button>
                    <button
                      onClick={copyAllAiCaptions}
                      className="border border-stone-200 rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-stone-50 dark:border-stone-700"
                    >
                      <Copy size={14} /> {t('copyAllBtn')}
                    </button>
                  </>
                )}
              </div>

              {aiCaptions.size > 0 && (
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
                  {photos.map((p) => {
                    const cap = p.number != null ? aiCaptions.get(p.number) : undefined;
                    const isCopied = copiedGenCaption === p.number;
                    return (
                      <div key={p.id} className="flex gap-3 border border-stone-100 rounded-xl p-3 bg-stone-50 dark:bg-stone-950">
                        <img src={p.dataUrl} alt={p.filename} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-stone-400 font-mono mb-1 dark:text-stone-500">#{p.number ?? '?'} — {p.filename}</p>
                          {cap ? (
                            <>
                              <p className="text-sm text-stone-700 leading-snug dark:text-stone-300">{cap}</p>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={async () => {
                                    await navigator.clipboard.writeText(cap);
                                    setCopiedGenCaption(p.number);
                                    setTimeout(() => setCopiedGenCaption(null), 1800);
                                  }}
                                  className="text-[10px] border border-stone-200 rounded-md px-1.5 py-0.5 text-stone-500 hover:bg-white flex items-center gap-0.5 dark:text-stone-400 dark:border-stone-700"
                                >
                                  {isCopied ? <><Check size={10} /> Kopyalandı</> : <><Copy size={10} /> Kopyala</>}
                                </button>
                                <button
                                  onClick={() => regenOneCaption(p)}
                                  disabled={regenLoadingNums.has(p.number)}
                                  className="text-[10px] border border-orange-200 bg-orange-50 rounded-md px-1.5 py-0.5 text-orange-600 hover:bg-orange-100 flex items-center gap-0.5 disabled:opacity-50"
                                >
                                  {regenLoadingNums.has(p.number) ? <><Loader2 size={10} className="animate-spin" /> Yazılır...</> : <><RefreshCw size={10} /> Yenidən yaz</>}
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-stone-400 italic dark:text-stone-500">caption gözlənilir...</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ---- PASTE SECTION ---- */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
              <h3 className="menu-font text-lg font-semibold mb-1">{t('captionsManualTitle')}</h3>
              <p className="text-stone-500 text-sm mb-3 dark:text-stone-400">
                {t('captionsManualDesc')} <span className="font-mono bg-stone-100 px-1 rounded dark:bg-stone-800">{t('captionsManualExample')}</span>
              </p>
              <textarea value={captionsRaw} onChange={(e) => setCaptionsRaw(e.target.value)} rows={12}
                placeholder={uiLang === 'ru' ? '1. Лучший вид города здесь 🌆\n2. Так начинается утро с кофе ☕' : '1. Şəhərin ən gözəl mənzərəsi burada 🌆\n2. Səhərə qəhvə ilə başlamağın əsl adı budur ☕'}
                className="w-full border border-stone-200 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:placeholder-stone-500" />
            </div>

            {photos.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
                <h3 className="menu-font text-lg font-semibold mb-3">{uiLang === 'ru' ? 'Соответствие' : 'Uyğunluq'}</h3>
                <p className="text-sm text-stone-500 mb-3 dark:text-stone-400">{matchedCount}/{photos.length} {uiLang === 'ru' ? 'подписей фото найдено.' : 'şəklin captionu tapıldı.'}</p>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {photos.map((p) => {
                    const has = p.number != null && captionsMap.has(p.number);
                    return (
                      <div key={p.id} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-stone-400 font-mono text-xs dark:text-stone-500">{p.number ?? '?'}</span>
                        <span className="flex-1 truncate text-stone-600 dark:text-stone-300">
                          {has ? captionsMap.get(p.number) : <em className="text-stone-400 dark:text-stone-500">{uiLang === 'ru' ? 'подпись не найдена' : 'caption tapılmadı'}</em>}
                        </span>
                        {has ? <Check size={14} className="text-emerald-500 flex-shrink-0" /> : <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- TAB 4: PLAN ---- */}
        {activeTab === 'plan' && (
          <div className="space-y-5">
            {/* Saved plans */}
            {savedPlanKeys.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
                <h3 className="menu-font text-lg font-semibold mb-3">{uiLang === 'ru' ? 'Сохранённые планы' : 'Saxlanmış planlar'}</h3>
                <div className="flex flex-wrap gap-2">
                  {savedPlanKeys.map((key) => {
                    // key = [profil::]plan-YYYY-M
                    const withoutPrefix = key.includes('::') ? key.split('::')[1] : key;
                    const parts = withoutPrefix.replace('plan-', '').split('-');
                    const y = parts[0]; const m = parseInt(parts[1]);
                    const monthsList = uiLang === 'ru' ? MONTHS_RU : MONTHS;
                    const label = `${monthsList[m] || m} ${y}`;
                    return (
                      <div key={key} className="flex items-center gap-1 border border-stone-200 rounded-lg overflow-hidden dark:border-stone-700">
                        <button onClick={() => loadPlan(key)} className="px-3 py-1.5 text-sm hover:bg-stone-50 text-stone-700 dark:text-stone-300">{label}</button>
                        <button onClick={() => deleteSavedPlan(key)} className="px-2 py-1.5 text-stone-300 hover:text-red-400 hover:bg-red-50 border-l border-stone-200 dark:border-stone-700"><X size={12} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
              <h3 className="menu-font text-lg font-semibold mb-1">
                {uiLang === 'ru' ? '🎉 Особые дни' : '🎉 Xüsusi günlər'}
              </h3>
              <p className="text-stone-500 text-sm mb-3 dark:text-stone-400">
                {uiLang === 'ru'
                  ? 'Отметь дни с особым событием (Party, мероприятие). Эти дни не получат случайное фото — только текст, который ты укажешь.'
                  : 'Party və ya xüsusi tədbir olan günləri işarələ. Bu günlərə təsadüfi şəkil düşməyəcək — yalnız yazdığın mətn (caption) görünəcək.'}
              </p>
              {(() => {
                const daysInSelectedMonth = new Date(year, monthIndex + 1, 0).getDate();
                const dayNums = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);
                return (
                  <div className="grid grid-cols-7 gap-1.5 mb-3">
                    {dayNums.map((d) => {
                      const isSpecial = !!specialDays[d];
                      return (
                        <button
                          key={d}
                          onClick={() => {
                            if (isSpecial) removeSpecialDay(d);
                            else setSpecialDay(d, uiLang === 'ru' ? 'Party' : 'Party', '');
                          }}
                          className={`text-xs rounded-lg py-1.5 border transition-colors ${isSpecial ? 'bg-orange-100 border-orange-400 text-orange-700 dark:bg-orange-950/40 dark:border-orange-600 dark:text-orange-400' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-400'}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
              {Object.keys(specialDays).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-700">
                  {Object.entries(specialDays)
                    .map(([d, v]) => [parseInt(d, 10), v])
                    .sort((a, b) => a[0] - b[0])
                    .map(([d, v]) => (
                      <div key={d} className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-stone-400 dark:text-stone-500 w-6 flex-shrink-0">{d}.</span>
                        <input
                          value={v.label}
                          onChange={(e) => setSpecialDay(d, e.target.value, v.caption)}
                          placeholder={uiLang === 'ru' ? 'Название (напр. Party)' : 'Ad (məs. Party)'}
                          className="text-xs border border-stone-200 dark:border-stone-700 rounded-md px-2 py-1 w-32 dark:bg-stone-900 dark:text-stone-200"
                        />
                        <input
                          value={v.caption}
                          onChange={(e) => setSpecialDay(d, v.label, e.target.value)}
                          placeholder={uiLang === 'ru' ? 'Подпись (напр. DJ Vugarixx)' : 'Caption (məs. DJ Vugarixx bu axşam)'}
                          className="text-xs border border-stone-200 dark:border-stone-700 rounded-md px-2 py-1 flex-1 min-w-[160px] dark:bg-stone-900 dark:text-stone-200"
                        />
                        <button onClick={() => removeSpecialDay(d)} className="text-stone-300 hover:text-red-400 flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 dark:bg-stone-900 dark:border-stone-700">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-xs text-stone-500 block mb-1 dark:text-stone-400">{t('monthLabel')}</label>
                  <select value={monthIndex} onChange={(e) => setMonthIndex(parseInt(e.target.value))}
                    className="border border-stone-200 rounded-lg px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
                    {(uiLang === 'ru' ? MONTHS_RU : MONTHS).map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1 dark:text-stone-400">{t('yearLabel')}</label>
                  <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value) || year)}
                    className="border border-stone-200 rounded-lg px-3 py-2 text-sm w-24 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200" />
                </div>
                <button onClick={generateSchedule} disabled={photos.length === 0}
                  className="bg-orange-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-orange-700 disabled:opacity-50 shadow-md shadow-orange-600/20 transition-all hover:shadow-lg hover:shadow-orange-600/30">
                  <Calendar size={16} /> {t('generatePlanBtn')}
                </button>
                {schedule && (
                  <>
                    <button onClick={generateSchedule} className="bg-white border border-stone-200 rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-stone-50 dark:bg-stone-900 dark:border-stone-700">
                      <RefreshCw size={14} /> {t('reshuffleBtn')}
                    </button>
                    <button onClick={saveCurrentPlan} className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-emerald-700">
                      <Check size={14} /> {t('savePlanBtn')}
                    </button>
                  </>
                )}
              </div>

              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
                  {categories.map((c, i) => (
                    <span key={c} className={`text-xs px-2 py-1 rounded-full ${PALETTE[i % PALETTE.length].bg} ${PALETTE[i % PALETTE.length].text}`}>
                      {c} · {photos.filter((p) => (p.category || 'Digər') === c).length}
                    </span>
                  ))}
                  {photos.some((p) => !p.category || !categories.includes(p.category)) && (
                    <span className={`text-xs px-2 py-1 rounded-full ${OTHER_COLOR.bg} ${OTHER_COLOR.text}`}>
                      Digər · {photos.filter((p) => !p.category || !categories.includes(p.category)).length}
                    </span>
                  )}
                </div>
              )}

              {isScheduleStale && (
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2 text-sm">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {uiLang === 'ru'
                    ? 'Вы изменили категории, подписи или карусели — этот план может быть устаревшим. Обновите его кнопкой "Перемешать снова".'
                    : 'Kateqoriya, caption və ya karusellərdə dəyişiklik etmisiniz — bu plan köhnəlmiş ola bilər. "Yenidən qarışdır" düyməsi ilə yeniləyin.'}
                </div>
              )}
            </div>

            {schedule && (
              <ScheduleView
                schedule={schedule} monthIndex={monthIndex} year={year}
                published={published} categories={categories}
                onTogglePublished={togglePublished} onResetPublished={resetPublished}
                onCopy={handleCopy} onDownload={handleDownload} onExportPDF={handleExportPDF}
                copyStatus={copyStatus}
                onReorderPost={handleReorderPost}
                onEditCaption={handleEditCaption}
                onMovePostToDay={handleMovePostToDay}
                uiLang={uiLang}
              />
            )}
          </div>
        )}

        {/* Footer — Fabrika Media loqosu və müəllif */}
        <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center gap-2">
          <a
            href="https://www.instagram.com/fabrikamedia.az/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
            title="Fabrika Media — Instagram"
          >
            <img
              src={darkMode ? fabrikaIconLight : fabrikaIconDark}
              alt="Fabrika Media"
              className="h-6 w-auto"
            />
          </a>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {uiLang === 'ru' ? 'Создано' : 'Created by'}{' '}
            <a
              href="https://www.instagram.com/rush.dp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-600 dark:hover:text-stone-300 underline-offset-2 hover:underline"
            >
              Rashad Huseyn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
