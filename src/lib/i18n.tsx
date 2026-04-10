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
  "hero.headline": {
    en: "Know Where You Stand.\nGet Where You Want.",
    ar: "اعرف مستواك…\nوابدأ طريقك المهني بثقة",
  },
  "hero.subtitle": {
    en: "Build a strong profile, understand your job readiness, and get closer to internships and job opportunities in Saudi Arabia.",
    ar: "ابنِ ملفك المهني، وقيّم جاهزيتك لسوق العمل، وقرّب نفسك من فرص التدريب والتوظيف داخل المملكة.",
  },
  "hero.cta.start": { en: "Start Your Profile", ar: "ابدأ ملفك" },
  "hero.cta.rankings": { en: "View Rankings", ar: "استعرض الترتيب" },

  // For Students
  "students.title": { en: "For Students", ar: "للطلاب" },
  "students.desc": {
    en: "Track your readiness, improve your skills, and stand out for internships and jobs.",
    ar: "تابع جاهزيتك، وطوّر مهاراتك، وخلّك الخيار الأفضل لفرص التدريب والتوظيف.",
  },
  "students.f1.title": { en: "Readiness Score", ar: "درجة الجاهزية" },
  "students.f1.desc": {
    en: "See a clear score that shows how prepared you are for real job opportunities.",
    ar: "شوف درجة واضحة تبيّن مدى استعدادك لفرص العمل الحقيقية.",
  },
  "students.f2.title": { en: "Career Roadmap", ar: "خريطة المسار المهني" },
  "students.f2.desc": {
    en: "Get personalized guidance on what skills and certifications to build next.",
    ar: "احصل على توجيه مخصّص عن المهارات والشهادات اللي تحتاج تبنيها.",
  },
  "students.f3.title": { en: "National Rankings", ar: "الترتيب الوطني" },
  "students.f3.desc": {
    en: "Compare your readiness with peers across universities and majors.",
    ar: "قارن جاهزيتك مع زملائك في مختلف الجامعات والتخصصات.",
  },

  // For Employers
  "employers.title": { en: "For Employers", ar: "لأصحاب العمل" },
  "employers.desc": {
    en: "Discover students who are actually ready to contribute from day one.",
    ar: "اكتشف طلاب جاهزين فعليًا للعمل والمساهمة من أول يوم.",
  },
  "employers.f1.title": { en: "Verified Profiles", ar: "ملفات موثّقة" },
  "employers.f1.desc": {
    en: "Every credential is integrity-checked — no inflated CVs.",
    ar: "كل شهادة وسجل أكاديمي يتم التحقق منه — بدون سير ذاتية مُبالغ فيها.",
  },
  "employers.f2.title": { en: "Smart Filters", ar: "فلاتر ذكية" },
  "employers.f2.desc": {
    en: "Filter by readiness score, skills, certifications, and university.",
    ar: "فلتر حسب درجة الجاهزية، المهارات، الشهادات، والجامعة.",
  },
  "employers.f3.title": { en: "Shortlists", ar: "قوائم المرشحين" },
  "employers.f3.desc": {
    en: "Save and manage your top candidates in one place.",
    ar: "احفظ وأدِر أفضل المرشحين في مكان واحد.",
  },

  // For Universities
  "uni.title": { en: "For Universities", ar: "للجامعات" },
  "uni.desc": {
    en: "Understand how your students are performing beyond grades.",
    ar: "تابع مستوى جاهزية طلابك لسوق العمل بشكل عملي، بعيدًا عن الدرجات فقط.",
  },
  "uni.f1.title": { en: "Cohort Analytics", ar: "تحليلات الدُفعات" },
  "uni.f1.desc": {
    en: "Track average readiness by department and identify gaps early.",
    ar: "تتبّع متوسط الجاهزية حسب القسم وحدّد الفجوات بشكل مبكر.",
  },
  "uni.f2.title": { en: "Market Alignment", ar: "توافق مع السوق" },
  "uni.f2.desc": {
    en: "See if your graduates match what employers are actually looking for.",
    ar: "اعرف إذا خريجينك يتوافقون مع اللي يبحث عنه أصحاب العمل فعلاً.",
  },
  "uni.f3.title": { en: "Skills Insights", ar: "رؤى المهارات" },
  "uni.f3.desc": {
    en: "Discover which skills and certifications the market demands most.",
    ar: "اكتشف المهارات والشهادات الأكثر طلبًا في سوق العمل.",
  },

  // ERS
  "ers.title": { en: "What is ERS?", ar: "ما هي درجة الجاهزية (ERS)؟" },
  "ers.desc": {
    en: "ERS is a score that reflects how prepared you are for real job opportunities — based on your skills, certifications, and projects.",
    ar: "درجة الجاهزية (ERS) تعكس مدى استعدادك الفعلي لسوق العمل بناءً على مهاراتك، وشهاداتك، ومشاريعك.",
  },
  "ers.step1.title": { en: "Build Your Profile", ar: "ابنِ ملفك" },
  "ers.step1.desc": { en: "Upload your transcripts, certifications, and projects.", ar: "ارفع سجلاتك الأكاديمية وشهاداتك ومشاريعك." },
  "ers.step2.title": { en: "Get Evaluated", ar: "احصل على التقييم" },
  "ers.step2.desc": { en: "Your profile is scored based on real market demand.", ar: "ملفك يتم تقييمه بناءً على متطلبات سوق العمل الفعلية." },
  "ers.step3.title": { en: "Improve & Compete", ar: "طوّر ونافس" },
  "ers.step3.desc": { en: "Follow your roadmap to close skill gaps and climb the rankings.", ar: "اتبع خريطتك لسد الفجوات المهارية وتسلّق الترتيب." },

  // Leaderboard
  "leaderboard.title": { en: "National Rankings", ar: "الترتيب الوطني" },
  "leaderboard.desc": {
    en: "See how students rank across the Kingdom — by readiness score, university, and major.",
    ar: "شوف ترتيب الطلاب على مستوى المملكة — حسب درجة الجاهزية، الجامعة، والتخصص.",
  },
  "leaderboard.cta": { en: "View Rankings", ar: "استعرض الترتيب" },

  // Vision 2030
  "vision.title": { en: "Supporting Saudi Vision 2030", ar: "ندعم رؤية السعودية 2030" },
  "vision.desc": {
    en: "HireQimah connects education outcomes with labor market needs — helping students, employers, and universities work toward a stronger workforce.",
    ar: "هايركيمة تربط مخرجات التعليم بمتطلبات سوق العمل — لمساعدة الطلاب وأصحاب العمل والجامعات في بناء قوى عاملة أقوى.",
  },

  // Final CTA
  "cta.title": { en: "Ready to Start?", ar: "مستعد تبدأ؟" },
  "cta.subtitle": {
    en: "Create your profile and discover where you stand.",
    ar: "أنشئ ملفك واكتشف وين مستواك.",
  },
  "cta.already": { en: "Already have an account?", ar: "عندك حساب؟" },

  // Footer
  "footer.tagline": { en: "Career Readiness Platform", ar: "منصة الجاهزية المهنية" },
  "footer.about": { en: "About", ar: "عن المنصة" },
  "footer.team": { en: "Team", ar: "الفريق" },
  "footer.security": { en: "Security", ar: "الأمان" },
  "footer.privacy": { en: "Privacy", ar: "الخصوصية" },
  "footer.terms": { en: "Terms", ar: "الشروط" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.leaderboard": { en: "Rankings", ar: "الترتيب" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },

  // Role Select
  "role.welcome": { en: "Welcome Back", ar: "أهلاً بعودتك" },
  "role.create": { en: "Create Your Account", ar: "أنشئ حسابك" },
  "role.selectSignin": { en: "Select your role to sign in", ar: "اختر دورك لتسجيل الدخول" },
  "role.selectSignup": { en: "Select your role to get started", ar: "اختر دورك للبدء" },
  "role.student": { en: "Student", ar: "طالب" },
  "role.student.desc": {
    en: "Build your profile, track your readiness, and find internship and job opportunities.",
    ar: "ابنِ ملفك، تابع جاهزيتك، واكتشف فرص التدريب والتوظيف.",
  },
  "role.hr": { en: "HR / Company", ar: "موارد بشرية / شركة" },
  "role.hr.desc": {
    en: "Find verified, job-ready graduates and manage your hiring pipeline.",
    ar: "اعثر على خريجين موثّقين وجاهزين للعمل وأدِر عملية التوظيف.",
  },
  "role.university": { en: "University", ar: "جامعة" },
  "role.university.desc": {
    en: "Monitor student readiness, upload records, and track market alignment.",
    ar: "تابع جاهزية الطلاب، ارفع السجلات، وراقب توافق مخرجاتك مع السوق.",
  },
  "role.continueAs": { en: "Continue as", ar: "المتابعة كـ" },
  "role.alreadyHave": { en: "Already have an account?", ar: "عندك حساب؟" },
  "role.noAccount": { en: "Don't have an account?", ar: "ما عندك حساب؟" },
  "role.adminAccess": { en: "Administrator Access", ar: "دخول المسؤول" },
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
