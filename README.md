# نور القرآن - Noor Al-Quran

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare)

**نور القرآن - استمع إلى تلاوات عطرة من كتاب الله**

[الموقع الحي](https://quran-web-app-2dr.pages.dev/) | [GitHub Pages](https://wwwcomw1239-tech.github.io/quran-web-app/) | [التوثيق](#التوثيق)

</div>

---

## 📖 نظرة عامة

**نور القرآن** هو تطبيق ويب حديث يوفر تجربة استماع مميزة لتلاوات القرآن الكريم بأصوات **100 قارئ** من أشهر القراء حول العالم. يتميز بتصميم عصري وأنيق، دعم كامل للغتين العربية والإنجليزية، ومكتبة ضخمة من الكتب الإسلامية.

### ✨ المميزات الرئيسية

- 🎤 **100 قارئ** - أكبر مجموعة من القراء المعروفين
- 📜 **114 سورة** - جميع سور القرآن الكريم مع معلومات تفصيلية
- 📚 **343 كتاب إسلامي** - مكتبة شاملة من كتب أهل السنة
- 🎵 **مشغل صوتي متقدم** - تحكم كامل، تكرار، تشغيل عشوائي
- 🔍 **بحث متقدم** - بالاسم العربي أو الإنجليزي أو الرقم
- ⭐ **المفضلة** - حفظ السور المفضلة
- ⬇️ **تحميل** - تنزيل السور والكتب للاستماع بدون إنترنت
- 🌍 **ثنائي اللغة** - دعم كامل للعربية والإنجليزية مع RTL/LTR
- 🌓 **الوضع الفاتح/الداكن** - تبديل تلقائي أو يدوي
- 📱 **PWA** - يمكن تثبيته كتطبيق على الهاتف
- ☁️ **Cloudflare Proxy** - تجاوز الحجب الجغرافي للكتب

---

## 🛠️ التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|----------|
| **Next.js** | 16.1.1 | إطار العمل الأساسي |
| **React** | 19.0 | واجهة المستخدم |
| **TypeScript** | 5.x | اللغة |
| **Tailwind CSS** | 4.x | التصميم |
| **shadcn/ui** | latest | مكونات UI |
| **Cloudflare Workers** | - | Proxy للكتب المحجوبة |

---

## 🚀 التثبيت والتشغيل

### المتطلبات

- Node.js 18+
- npm أو yarn أو bun

### خطوات التثبيت

1. **استنساخ المستودع**
   ```bash
   git clone https://github.com/wwwcomw1239-tech/quran-web-app.git
   cd quran-web-app
   ```

2. **تثبيت التبعيات**
   ```bash
   # باستخدام npm
   npm install

   # أو باستخدام yarn
   yarn install

   # أو باستخدام bun
   bun install
   ```

3. **تشغيل التطبيق**
   ```bash
   # وضع التطوير
   npm run dev

   # أو
   bun dev
   ```

4. **فتح المتصفح**
   ```
   http://localhost:3000
   ```

---

## 📁 هيكل المشروع

```
noor-al-quran/
├── src/
│   ├── app/                    # صفحات Next.js (App Router)
│   │   ├── page.tsx           # الصفحة الرئيسية
│   │   ├── layout.tsx         # التخطيط الرئيسي
│   │   └── globals.css        # الأنماط العامة
│   ├── components/
│   │   ├── quran/             # مكونات التطبيق
│   │   │   ├── Header.tsx     # العنوان مع Language Switcher
│   │   │   ├── AnnouncementBanner.tsx
│   │   │   ├── ReciterSelector.tsx
│   │   │   ├── SurahList.tsx
│   │   │   ├── AudioPlayerBar.tsx
│   │   │   ├── BooksLibrary.tsx
│   │   │   ├── DownloadDialog.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                # مكونات shadcn/ui
│   ├── data/
│   │   ├── surahs.ts          # بيانات السور
│   │   └── reciters.ts        # بيانات القراء (100 قارئ)
│   ├── lib/
│   │   ├── i18n/              # نظام التعدد اللغوي
│   │   └── proxy.ts           # Cloudflare Proxy
│   └── hooks/                 # الخطافات المخصصة
├── public/
│   └── icons/                 # أيقونات PWA
├── package.json
└── wrangler.toml              # إعدادات Cloudflare Workers
```

---

## 🎤 القراء المتاحون (100 قارئ)

### القراء الأكثر شهرة
- محمد صديق المنشاوي
- مشاري راشد العفاسي
- محمود خليل الحصري
- ماهر المعيقلي
- عبد الرحمن السديس
- سعود الشريم
- سعد الغامدي
- أبو بكر الشاطري
- ياسر الدوسري
- خالد الجليل
- أحمد بن علي العجمي

### القراء الجدد (15)
- حسن صالح
- محمد المحيسني
- عبدالله كامل
- ياسر سلامة
- محمود خليل الحصري (ورش)
- هيثم الجدعاني
- الدوكالي محمد العالم
- خالد المهنا
- عادل الكلباني
- عبدالعزيز الزهراني
- محمد عثمان خان
- عبدالمحسن الحارثي
- أحمد الحذيفي
- جمال الدين الزيلعي
- عبدالباسط عبدالصمد (مجود)

---

## 📚 المكتبة المقروءة (343 كتاب)

### الأقسام
- **التفسير** - تفسير الطبري، ابن كثير، القرطبي، الرازي، وغيرها
- **علوم القرآن** - الإتقان، البرهان، مباحث في علوم القرآن
- **التجويد والقراءات** - القراءات السبع، أصول رواية ورش
- **إعراب القرآن** - إعراب القرآن من البحر المحيط
- **أسباب النزول** - لباب النقول، الصحيح المسند
- **غريب القرآن** - مفردات ألفاظ القرآن

---

## 🌐 روابط النشر

| المنصة | الرابط |
|--------|--------|
| **Cloudflare Pages** | https://quran-web-app-2dr.pages.dev/ |
| **GitHub Pages** | https://wwwcomw1239-tech.github.io/quran-web-app/ |
| **Proxy Worker** | https://quran-proxy.wwwcomw1239.workers.dev/ |

---

## 🔧 أوامر متاحة

```bash
# تشغيل خادم التطوير
npm run dev

# بناء التطبيق للإنتاج
npm run build

# بناء للنشر على Cloudflare
npm run build:cf

# نشر Cloudflare Worker
npm run deploy:worker
```

---

## 🌍 دعم اللغات

- **العربية (AR)** - اللغة الافتراضية، RTL
- **English (EN)** - LTR layout

---

## 🤝 المساهمة

نرحب بالمساهمات! اتبع الخطوات التالية:

1. افتح Fork للمستودع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بإجراء التغييرات
4. أرسل التغييرات (`git commit -m 'Add amazing feature'`)
5. ادفع إلى الفرع (`git push origin feature/amazing-feature`)
6. افتح Pull Request

---

## 📄 الترخيص

هذا المشروع مفتوح المصدر. يمكنك استخدامه وتعديله بحرية.

---

## 🙏 شكر وتقدير

- جميع التلاوات من موقع [Mp3Quran](https://mp3quran.net)
- جميع الكتب من [Archive.org](https://archive.org)
- مكونات UI من [shadcn/ui](https://ui.shadcn.com)
- الأيقونات من [Lucide](https://lucide.dev)
- النشر على [Cloudflare](https://cloudflare.com)

---

<div align="center">

**صنع بـ ❤️ للمسلمين حول العالم**

**نور القرآن - Noor Al-Quran**

</div>
