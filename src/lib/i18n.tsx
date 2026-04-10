import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "ar" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.features": { en: "Features", ar: "المميزات" },
  "nav.forStudents": { en: "For Students", ar: "للطلاب" },
  "nav.forCompanies": { en: "For Employers", ar: "لأصحاب العمل" },
  "nav.signin": { en: "Sign In", ar: "تسجيل الدخول" },
  "nav.signup": { en: "Sign Up", ar: "إنشاء حساب" },
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.logout": { en: "Logout", ar: "تسجيل الخروج" },

  // Hero
  "hero.title1": { en: "HireQimah", ar: "HireQimah" },
  "hero.title2": { en: "Where Saudi Talent", ar: "حيث يبني الكفاءات" },
  "hero.title3": { en: "Builds Its Qimah", ar: "السعودية قيمتها" },
  "hero.subtitle": {
    en: "HireQimah helps companies identify the most job-ready graduates and helps students prepare for real Saudi labor market demand — powered by verified data and AI analysis of 100+ live job postings.",
    ar: "هايركيمة تساعد الشركات في تحديد أكثر الخريجين جاهزية للتوظيف، وتساعد الطلاب على الاستعداد لمتطلبات سوق العمل السعودي الحقيقية — مدعومة ببيانات موثّقة وتحليل ذكاء اصطناعي لأكثر من 100 إعلان وظيفي.",
  },
  "hero.check1": { en: "Transparent Employment Readiness Scores (ERS)", ar: "مؤشرات جاهزية وظيفية شفافة (ERS)" },
  "hero.check2": { en: "Market-driven certification and skill valuations", ar: "تقييم الشهادات والمهارات وفقاً لمتطلبات السوق" },
  "hero.check3": { en: "Verified academic records and project portfolios", ar: "سجلات أكاديمية وملفات مشاريع موثّقة" },
  "hero.cta.student": { en: "Sign Up as Student", ar: "سجّل كطالب" },
  "hero.cta.hr": { en: "Sign Up as HR", ar: "سجّل كموارد بشرية" },
  "hero.cta.university": { en: "Sign Up as University", ar: "سجّل كجامعة" },
  "hero.tagline": { en: "The first Employment Readiness Infrastructure for Saudi Arabia", ar: "أول بنية تحتية للجاهزية الوظيفية في المملكة العربية السعودية" },

  // ERS Section
  "ers.title": { en: "How ERS Works", ar: "كيف يعمل مؤشر ERS" },
  "ers.desc": { en: "The Employment Readiness Score combines multiple verified data sources into one transparent, market-driven score.", ar: "يجمع مؤشر الجاهزية الوظيفية عدة مصادر بيانات موثّقة في درجة واحدة شفافة مبنية على متطلبات السوق." },
  "ers.step1.title": { en: "Upload Verified Records", ar: "رفع السجلات الموثّقة" },
  "ers.step1.desc": { en: "Transcripts, certifications, and projects are verified with SHA-256 integrity checks.", ar: "يتم التحقق من السجلات الأكاديمية والشهادات والمشاريع عبر فحوصات سلامة SHA-256." },
  "ers.step2.title": { en: "AI Market Analysis", ar: "تحليل السوق بالذكاء الاصطناعي" },
  "ers.step2.desc": { en: "We analyze 100+ real Saudi job postings to determine which skills and certifications matter.", ar: "نحلل أكثر من 100 إعلان وظيفي سعودي حقيقي لتحديد المهارات والشهادات المطلوبة." },
  "ers.step3.title": { en: "Dynamic Scoring", ar: "تقييم ديناميكي" },
  "ers.step3.desc": { en: "Each category (Academic, Certifications, Projects, Soft Skills) is scored with market-driven weights.", ar: "كل فئة (أكاديمي، شهادات، مشاريع، مهارات شخصية) تُقيّم بأوزان مبنية على السوق." },
  "ers.step4.title": { en: "Ranked & Discoverable", ar: "مُصنّف وقابل للاكتشاف" },
  "ers.step4.desc": { en: "Students appear on leaderboards. Employers filter by ERS, major, and certifications.", ar: "يظهر الطلاب في لوحات التصنيف. يفلتر أصحاب العمل حسب ERS والتخصص والشهادات." },

  // Companies section
  "companies.title": { en: "Why Companies Trust ERS", ar: "لماذا تثق الشركات بمؤشر ERS" },
  "companies.desc": { en: "ERS eliminates guesswork in graduate hiring by providing verified, market-calibrated readiness signals.", ar: "يُزيل ERS التخمين في توظيف الخريجين من خلال إشارات جاهزية موثّقة ومُعايرة وفق السوق." },
  "companies.verified.title": { en: "Verified Documents", ar: "وثائق موثّقة" },
  "companies.verified.desc": { en: "Every transcript and certification is integrity-checked. No inflated credentials pass through.", ar: "كل سجل أكاديمي وشهادة يخضع لفحص سلامة. لا تمر أوراق اعتماد مُضخّمة." },
  "companies.market.title": { en: "Real Market Data", ar: "بيانات سوق حقيقية" },
  "companies.market.desc": { en: "Scores reflect actual Saudi job demand from LinkedIn, Bayt, GulfTalent, Indeed, and Jadarat.", ar: "الدرجات تعكس الطلب الوظيفي السعودي الفعلي من لينكدإن، بيت، جلف تالنت، إنديد، وجدارات." },
  "companies.transparent.title": { en: "Full Transparency", ar: "شفافية كاملة" },
  "companies.transparent.desc": { en: "HR can see exactly how each score component was calculated — no black boxes.", ar: "يمكن لمسؤولي الموارد البشرية رؤية كيفية حساب كل مكوّن — لا صناديق سوداء." },

  // Universities section
  "uni.title": { en: "How Universities Benefit", ar: "كيف تستفيد الجامعات" },
  "uni.cohort.title": { en: "Cohort Analytics", ar: "تحليلات الدُفعات" },
  "uni.cohort.desc": { en: "Track average ERS by department and identify underperforming programs before graduation.", ar: "تتبّع متوسط ERS حسب القسم وحدّد البرامج الأقل أداءً قبل التخرج." },
  "uni.congruence.title": { en: "Market Congruence", ar: "تطابق السوق" },
  "uni.congruence.desc": { en: "See if your graduate supply matches employer demand with the Market Congruence Index.", ar: "تعرّف ما إذا كان عرض خريجيك يتوافق مع طلب أصحاب العمل." },
  "uni.curriculum.title": { en: "Curriculum Alignment", ar: "توافق المناهج" },
  "uni.curriculum.desc": { en: "Skill demand heatmaps show which certifications and skills employers actually require.", ar: "خرائط الطلب المهاري تُظهر الشهادات والمهارات المطلوبة فعلياً." },

  // Stakeholders
  "stakeholders.title": { en: "Built for Every Stakeholder", ar: "مصمّمة لكل أصحاب المصلحة" },
  "stakeholders.students.title": { en: "Students", ar: "الطلاب" },
  "stakeholders.students.desc": { en: "Build a verified employability profile. Get AI career roadmaps. Track your ERS against peers.", ar: "ابنِ ملفاً وظيفياً موثّقاً. احصل على خرائط طريق مهنية بالذكاء الاصطناعي. قارن ERS مع أقرانك." },
  "stakeholders.employers.title": { en: "Employers", ar: "أصحاب العمل" },
  "stakeholders.employers.desc": { en: "Discover ranked talent. Filter by skills, certifications, and ERS. Manage a full hiring pipeline.", ar: "اكتشف الكفاءات المُصنّفة. فلتر حسب المهارات والشهادات وERS. أدِر خط توظيف كامل." },
  "stakeholders.universities.title": { en: "Universities", ar: "الجامعات" },
  "stakeholders.universities.desc": { en: "Monitor student readiness by cohort. Align curriculum with market demand. Verify records.", ar: "تابع جاهزية الطلاب حسب الدُفعة. وائم المناهج مع متطلبات السوق. تحقّق من السجلات." },

  // Capabilities
  "capabilities.title": { en: "Platform Capabilities", ar: "قدرات المنصة" },
  "cap.ers": { en: "Dynamic ERS Engine", ar: "محرك ERS الديناميكي" },
  "cap.ai": { en: "AI Career Roadmaps", ar: "خرائط طريق مهنية ذكية" },
  "cap.cert": { en: "Certification Intelligence", ar: "ذكاء الشهادات" },
  "cap.market": { en: "Live Market Dashboard", ar: "لوحة بيانات السوق الحيّة" },
  "cap.leaderboard": { en: "National Leaderboards", ar: "لوحات التصنيف الوطنية" },

  // Leaderboard
  "leaderboard.title": { en: "National Talent Leaderboards", ar: "لوحات تصنيف الكفاءات الوطنية" },
  "leaderboard.desc": { en: "Ranked by ERS with verification badges for certified transcripts, projects, and credentials.", ar: "مُصنّفة حسب ERS مع شارات توثيق للسجلات والمشاريع والشهادات المُعتمدة." },
  "leaderboard.cta": { en: "View Leaderboard", ar: "عرض لوحة التصنيف" },

  // Vision 2030
  "vision.title": { en: "Aligned with Saudi Vision 2030", ar: "متوافقة مع رؤية السعودية 2030" },
  "vision.desc": { en: "HireQimah supports Saudi Arabia's workforce transformation by connecting education outcomes with labor market demand and enabling transparent employability signals.", ar: "تدعم هايركيمة تحوّل القوى العاملة في المملكة العربية السعودية من خلال ربط مخرجات التعليم بمتطلبات سوق العمل وتمكين إشارات جاهزية وظيفية شفافة." },

  // Final CTA
  "cta.title": { en: "Start Building Your Qimah", ar: "ابدأ ببناء قيمتك" },
  "cta.already": { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },

  // Footer
  "footer.tagline": { en: "Employability Intelligence Platform", ar: "منصة ذكاء الجاهزية الوظيفية" },
  "footer.about": { en: "About", ar: "عن المنصة" },
  "footer.team": { en: "Team", ar: "الفريق" },
  "footer.security": { en: "Security", ar: "الأمان" },
  "footer.privacy": { en: "Privacy", ar: "الخصوصية" },
  "footer.terms": { en: "Terms", ar: "الشروط" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.leaderboard": { en: "Leaderboard", ar: "التصنيف" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("hq-lang") as Lang) || "ar";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("hq-lang", l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: string) => translations[key]?.[lang] ?? key;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
