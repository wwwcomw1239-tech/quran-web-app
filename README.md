# القرآن الكريم - Quran Web App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)

**موقع القرآن الكريم - استمع إلى تلاوات عطرة**

[الموقع الحي](#) | [التوثيق](#التوثيق) | [المساهمة](#المساهمة)

</div>

---

## 📖 نظرة عامة

تطبيق ويب حديث يوفر تجربة استماع مميزة لتلاوات القرآن الكريم بأصوات أكثر من 55 قارئ. يتميز بتصميم عصري، دعم كامل للغة العربية، وإمكانية تحميل السور للاستماع بدون اتصال.

### ✨ المميزات الرئيسية

- 🎤 **أكثر من 55 قارئ** - مجموعة واسعة من القراء المعروفين
- 📜 **114 سورة** - جميع سور القرآن الكريم مع معلومات تفصيلية
- 🎵 **مشغل صوتي متقدم** - تحكم كامل، تكرار، تشغيل عشوائي
- 🔍 **بحث متقدم** - بالاسم العربي أو الإنجليزي أو الرقم
- ⭐ **المفضلة** - حفظ السور المفضلة
- ⬇️ **تحميل** - تنزيل السور للاستماع بدون إنترنت
- 🌓 **الوضع الفاتح/الداكن** - تبديل تلقائي حسب النظام
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة

---

## 🛠️ التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|----------|
| **Next.js** | 16.1.1 | إطار العمل الأساسي |
| **React** | 19.0 | واجهة المستخدم |
| **TypeScript** | 5.x | اللغة |
| **Tailwind CSS** | 4.x | التصميم |
| **shadcn/ui** | latest | مكونات UI |
| **Zustand** | 5.0.6 | إدارة الحالة |
| **Framer Motion** | 12.x | الرسوم المتحركة |
| **Lucide React** | latest | الأيقونات |

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

3. **إعداد متغيرات البيئة**
   ```bash
   # إنشاء ملف .env من القالب
   cp .env.example .env
   ```
   
   ثم قم بتعديل الملف `.env`:
   ```
   DATABASE_URL=file:/path/to/your/local/database.db
   ```

4. **تشغيل التطبيق**
   ```bash
   # وضع التطوير
   npm run dev

   # أو
   bun dev
   ```

5. **فتح المتصفح**
   ```
   http://localhost:3000
   ```

---

## 📁 هيكل المشروع

```
quran-web-app/
├── src/
│   ├── app/                    # صفحات Next.js (App Router)
│   │   ├── page.tsx           # الصفحة الرئيسية
│   │   ├── layout.tsx         # التخطيط الرئيسي
│   │   └── globals.css        # الأنماط العامة
│   ├── components/
│   │   ├── quran/             # مكونات التطبيق
│   │   │   ├── Header.tsx
│   │   │   ├── ReciterSelector.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   ├── SurahList.tsx
│   │   │   ├── AudioPlayerBar.tsx
│   │   │   ├── DownloadDialog.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                # مكونات shadcn/ui
│   ├── data/
│   │   ├── surahs.ts          # بيانات السور
│   │   └── reciters.ts        # بيانات القراء
│   ├── hooks/                 # الخطافات المخصصة
│   └── lib/                   # الأدوات المساعدة
├── public/                    # الملفات الثابتة
├── prisma/                    # مخطط قاعدة البيانات
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎤 القراء المتاحون

يتضمن التطبيق مجموعة واسعة من القراء، منها:

- محمد صديق المنشاوي
- مشاري راشد العفاسي
- محمود خليل الحصري
- ماهر المعيقلي
- عبد الرحمن السديس
- سعد الغامدي
- أبو بكر الشاطري
- ياسر الدوسري
- خالد الجليل
- أحمد بن علي العجمي
- وعشرات القراء الآخرين...

---

## 🔧 أوامر متاحة

```bash
# تشغيل خادم التطوير
npm run dev

# بناء التطبيق للإنتاج
npm run build

# تشغيل الإنتاج
npm run start

# فحص الكود
npm run lint

# إدارة قاعدة البيانات
npm run db:push      # تطبيق المخطط
npm run db:generate  # إنشاء Prisma Client
npm run db:migrate   # إنشاء ترحيل
```

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
- مكونات UI من [shadcn/ui](https://ui.shadcn.com)
- الأيقونات من [Lucide](https://lucide.dev)

---

<div align="center">

**صنع بـ ❤️ للمسلمين حول العالم**

</div>
