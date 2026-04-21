// Select 200 clean videos with strict content filters
import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync('scripts/verified-new.json', 'utf8'));
console.log(`Loaded ${raw.length} verified candidates.`);

// ============ BLOCKLIST ============
// Block anything that could be:
//   - Shia (scholars, imam terms, tariqa names)
//   - Female presenter / reciter
//   - Music / songs
//   - Controversial (Ali Mansour Kayali, Sherif Gaber, Adnan Ibrahim)
//   - Depictions of prophets, etc.
const BLOCK = [
  // Shia
  /كمال الحيدري|الحيدري/i, /آية الله|ايه الله/i, /السيستاني/i, /الخميني/i, /الخامنئي/i,
  /الشيرازي/i, /القزويني|ابن ماجه القزويني/i, /الموسوي/i, /الصدر\b/i,
  /ياسر الحبيب/i, /العتابي/i, /المدرسي/i, /الشيع[ةي]/i, /رافض|الرافضة/i, /تفسير المرتضى/i,
  /الثقلين/i, /دار البلاغ/i, /العاملية/i, /عاشور[اى] الحسين/i,
  /المرجع الأعلى/i, /الحسيني[ةه]/i, /الولاية/i, /أهل البيت عليهم/i,
  /الإمام المهدي المنتظر/i, /يا علي|يا حسين/i,

  // Female / mixed  
  /الشيخة /, /الدكتورة /, /القارئة /, /الأخت /, /امرأة تقرأ/,
  /مريم /i, /منى /i, /سارة /i, /ليلى /i, /دينا /i, /نادين/i, /ياسمين /i, /رنا /i,
  /سعاد /i, /فاطمة السباعي/, /البدير/,
  /\bHoda\b|\bMariam\b|\bSara\b|\bRana\b|\bDalia\b|\bYasmeen\b|\bNadine\b/i,

  // Music
  /موسيق[يىا]/i, /\bsong\b/i, /music/i, /نغم[ةه]/i,
  /أغنية|أغاني|اغاني|اغنية/i, /مغنية|مطربة|مطرب/i, /مهرجان/i,
  /DJ|ريمكس|remix/i,

  // Controversial / deviant
  /Sherif Gaber/i, /شريف جابر/i, /عدنان إبراهيم|عدنان ابراهيم/i,
  /علي منصور كيالي|كيالي/i, /محمد شحرور|شحرور/i,
  /إسلام البحيري|البحيري/i, /أحمد صبحي منصور|صبحي منصور/i,
  /ملحد|ملحدين/i, /علمانيين/i,

  // Rotana / entertainment channels (mixed content) — unsafe for scholar context
  /\bMBC\b/i, /\bروتانا\b/i, /\bOSN\b/i, /\bCBC\b/i,

  // Other blocked terms
  /حفل /, /افلام|أفلام/i, /مسلسل/i, /كليب|فيديو كليب/i,
  /رقص|راقصة/i, /\bفيلم\b/i,
  /رامز|فزورة|حزر فزر/i,
  /اختلاط|مخالطة/i,
  /ظهور بنات/,
  /فيتنس|لايف ستايل|lifestyle/i,
];

// Additional safelist — authors/channels we trust
const TRUSTED_AUTHORS = new Set([
  // Standard Sunni scholar channels
  'القناة الرسمية لفضيلة الشيخ محمد متولي الشعراوي',
  'الشيخ الشعراوي',
  'الشيخ الشعراوي | Sheikh Shaarawi',
  'فضيلة الشيخ محمد بن صالح العثيمين',
  'سماحة الشيخ العلامة محمد بن صالح العثيمين',
  'قناة الفرقان',
  'خزائن الرحمن',
  'الشيخ ابن عثيمين',
  'الشيخ ابن باز',
  'قناة مؤسسة عبد العزيز بن باز الخيرية الرسمية',
  'الشيخ صالح الفوزان',
  'العلامة الدكتور صالح الفوزان',
  'د. عثمان الخميس',
  'Dr. Othman Alkamees - الشيخ الدكتور عثمان الخميس',
  'الشيخ عبد الرزاق البدر',
  'الشيخ عبدالرزاق البدر',
  'الشيخ عبد الكريم الخضير',
  'الشيخ عبدالكريم الخضير',
  'د. مساعد الطيار',
  'الشيخ نبيل العوضي',
  'دروس الشيخ نبيل العوضي',
  'د. أيمن سويد',
  'د. أيمن سويد Dr. Ayman Swaid',
  'الشيخ عائض القرني',
  'القناة الرسمية للشيخ الدكتور عائض القرني',
  'الشيخ محمد العريفي',
  'الشيخ محمد المقرمي',
  'الشيخ المقرمي',
  'الشيخ محمد صالح المنجد',
  'الشيخ صالح المغامسي',
  'الشيخ سعيد بن مسفر',
  'الشيخ سليمان الرحيلي',
  'الشيخ سعد الشثري',
  'دروس المسجد الحرام',
  'الشيخ مصطفى العدوي',
  'الشيخ عبد المحسن العباد',
  'الشيخ محمد المختار الشنقيطي',
  'الشيخ عبد المحسن القاسم',
  'الشيخ ابن باز',
  'أقوال السلف',
  'إبراهيم خليل',
  'اكاديمية البيان',
  'مركز تفسير للدراسات القرآنية',
  'الهيئة العالمية لتدبر القرآن الكريم',
  'الشيخ خالد الجبير',
  'محبي الشيخ د. خالد الجبير',
  'د. فاضل السامرائي',
  'لمسات بيانية',
  'لمسات بيانية - أ.د. فاضل السامرائي',
  'نفحات بيانية | Dr. Fadel Al-Samarrai',
  'د. محمد راتب النابلسي',
  'د. زغلول النجار Dr. Zaghloul Al Najjar',
  'عبد الدائم الكحيل',
  'شبكة الطريق الى الله - way2allahcom',
  'اقرأ | Iqraa',
  'قناة الناس',
  'قناة زاد الفضائية',
  'دعوة أهل السنة',
  'التوحيد الدعوية',
  'قناة التوحيد الدعوية',
  'الشيخ بدر المشاري',
  'الشيخ خالد الراشد',
  'الراسخون',
]);

function isBlocked(video) {
  const text = `${video.title || ''} ${video.author || ''} ${video.scholar || ''}`;
  return BLOCK.some((re) => re.test(text));
}

// Phase 1: drop blocked  
const afterBlock = raw.filter((v) => !isBlocked(v));
console.log(`After blocklist: ${afterBlock.length} / ${raw.length}`);

// Phase 2: dedup by title (strip variations)
const titleSeen = new Set();
const unique = [];
for (const v of afterBlock) {
  const k = (v.title || '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (!k || k.length < 10) continue;
  if (titleSeen.has(k)) continue;
  titleSeen.add(k);
  unique.push(v);
}
console.log(`After dedup: ${unique.length}`);

// Phase 3: prefer trusted authors; balance categories
const TARGET_PER_CATEGORY = {
  'تفسير القرآن': 100,
  'تدبر وتأملات': 60,
  'أحكام التلاوة والتجويد': 10, // limited pool in candidates
  'علوم القرآن': 10,
  'قصص القرآن': 10,
  'إعجاز القرآن': 10,
};
const GRAND_TOTAL = 200;

// Split into trusted/other per category
const byCat = {};
for (const v of unique) {
  const c = v.category;
  if (!byCat[c]) byCat[c] = { trusted: [], other: [] };
  if (TRUSTED_AUTHORS.has(v.author) || TRUSTED_AUTHORS.has(v.scholar)) {
    byCat[c].trusted.push(v);
  } else {
    byCat[c].other.push(v);
  }
}

const selected = [];
const remainingByCat = {};
for (const [cat, target] of Object.entries(TARGET_PER_CATEGORY)) {
  const bucket = byCat[cat] || { trusted: [], other: [] };
  const take = [];
  for (const v of bucket.trusted) {
    if (take.length >= target) break;
    take.push(v);
  }
  for (const v of bucket.other) {
    if (take.length >= target) break;
    take.push(v);
  }
  selected.push(...take);
  remainingByCat[cat] = { trusted: bucket.trusted.slice(take.length), other: bucket.other.slice(Math.max(0, take.length - bucket.trusted.length)) };
}

// Fill remaining up to GRAND_TOTAL from any category (trusted first)
function fillUp() {
  while (selected.length < GRAND_TOTAL) {
    let added = false;
    for (const cat of Object.keys(byCat)) {
      if (selected.length >= GRAND_TOTAL) break;
      const r = remainingByCat[cat];
      if (!r) continue;
      if (r.trusted.length > 0) {
        selected.push(r.trusted.shift()); added = true;
      } else if (r.other.length > 0) {
        selected.push(r.other.shift()); added = true;
      }
    }
    if (!added) break;
  }
}
fillUp();

console.log(`\nSelected: ${selected.length}`);
const catCount = {};
for (const v of selected) catCount[v.category] = (catCount[v.category] || 0) + 1;
console.log('Distribution:', catCount);

// Show scholar distribution (top 20)
const schCount = {};
for (const v of selected) schCount[v.scholar] = (schCount[v.scholar] || 0) + 1;
console.log('\nTop scholars:');
Object.entries(schCount).sort((a,b) => b[1]-a[1]).slice(0, 20).forEach(([k, v]) => console.log(`  ${v}  ${k}`));

fs.writeFileSync('scripts/selected-200.json', JSON.stringify(selected, null, 2));
console.log(`\n✅ Wrote ${selected.length} selected videos to scripts/selected-200.json`);
