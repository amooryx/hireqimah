import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "ar" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Lang, string>> = {
  // ─── Navbar ───
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.features": { en: "Features", ar: "المميزات" },
  "nav.forStudents": { en: "For Students", ar: "للطلاب" },
  "nav.forCompanies": { en: "For Employers", ar: "لأصحاب العمل" },
  "nav.signin": { en: "Sign In", ar: "تسجيل الدخول" },
  "nav.signup": { en: "Sign Up", ar: "إنشاء حساب" },
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.logout": { en: "Logout", ar: "تسجيل الخروج" },

  // ─── Hero ───
  "hero.headline": {
    en: "Know Where You Stand.\nGet Where You Want.",
    ar: "اعرف مستواك…\nوابدأ طريقك المهني بثقة",
  },
  "hero.subtitle": {
    en: "Build your professional profile, measure your job readiness, and compete with students from universities across Saudi Arabia for internship and employment opportunities.",
    ar: "ابنِ ملفك المهني، وقيّم جاهزيتك لسوق العمل، وابدأ تنافس طلاب من مختلف جامعات المملكة على فرص التدريب والتوظيف.",
  },
  "hero.cta.start": { en: "Start Your Profile", ar: "ابدأ ملفك" },
  "hero.cta.rankings": { en: "View Rankings", ar: "استعرض الترتيب" },
  "hero.joinStudent": { en: "Join as Student", ar: "التسجيل كطالب" },
  "hero.joinEmployer": { en: "Join as Employer", ar: "التسجيل كجهة توظيف" },
  "hero.joinUniversity": { en: "Join as University", ar: "التسجيل كجامعة" },

  // ─── For Students ───
  "students.title": { en: "For Students", ar: "للطلاب" },
  "students.desc": {
    en: "Track your real level, work on developing your skills, and compete with students from different universities to reach internship and job opportunities faster.",
    ar: "تابع مستواك الحقيقي، واشتغل على تطوير مهاراتك، ونافس طلاب من مختلف الجامعات عشان توصل لفرص التدريب والوظائف بشكل أسرع.",
  },
  "students.f1.title": { en: "Readiness Score", ar: "درجة الجاهزية" },
  "students.f1.desc": { en: "See a clear evaluation of your actual readiness compared to today's job market demands.", ar: "شوف تقييم واضح يوضح جاهزيتك الفعلية مقارنة بمتطلبات سوق العمل اليوم." },
  "students.f2.title": { en: "Career Roadmap", ar: "خريطة المسار المهني" },
  "students.f2.desc": { en: "Get a clear roadmap showing exactly what you need to learn and develop to improve your chances in the job market.", ar: "احصل على خريطة واضحة تبين لك بالضبط إيش تحتاج تتعلم وتطوّر عشان ترفع فرصك في سوق العمل." },
  "students.f3.title": { en: "National Rankings", ar: "الترتيب الوطني" },
  "students.f3.desc": { en: "See your ranking among students across the Kingdom and start competing to reach the top.", ar: "شوف ترتيبك بين طلاب المملكة، وابدأ تنافس بشكل حقيقي للوصول لأعلى المراتب." },

  // ─── For Employers ───
  "employers.title": { en: "For Employers", ar: "لأصحاب العمل" },
  "employers.desc": {
    en: "Discover students who are actually ready to contribute from day one — based on verified data and real evaluation, not just a CV.",
    ar: "اكتشف طلاب جاهزين فعليًا للعمل والمساهمة من أول يوم.\nبناءً على بيانات موثوقة وتقييم حقيقي — مو مجرد سيرة ذاتية.",
  },
  "employers.f1.title": { en: "Verified Profiles", ar: "ملفات موثّقة" },
  "employers.f1.desc": { en: "Every credential is integrity-checked — no inflated CVs.", ar: "كل شهادة وسجل أكاديمي يتم التحقق منه — بدون سير ذاتية مُبالغ فيها." },
  "employers.f2.title": { en: "Smart Filters", ar: "فلاتر ذكية" },
  "employers.f2.desc": { en: "Filter by readiness score, skills, certifications, and university.", ar: "فلتر حسب درجة الجاهزية، المهارات، الشهادات، والجامعة." },
  "employers.f3.title": { en: "Shortlists", ar: "قوائم المرشحين" },
  "employers.f3.desc": { en: "Save and manage your top candidates in one place.", ar: "احفظ وأدِر أفضل المرشحين في مكان واحد." },

  // ─── For Universities ───
  "uni.title": { en: "For Universities", ar: "للجامعات" },
  "uni.desc": {
    en: "Track your students' job readiness practically, and discover the gaps that need development before graduation.",
    ar: "تابع مستوى جاهزية طلابك بشكل عملي، واكتشف الفجوات اللي تحتاج تطوير قبل التخرج.",
  },
  "uni.f1.title": { en: "Cohort Analytics", ar: "تحليلات الدُفعات" },
  "uni.f1.desc": { en: "Track average readiness by department and identify gaps early.", ar: "تتبّع متوسط الجاهزية حسب القسم وحدّد الفجوات بشكل مبكر." },
  "uni.f2.title": { en: "Market Alignment", ar: "توافق مع السوق" },
  "uni.f2.desc": { en: "See if your graduates match what employers are actually looking for.", ar: "اعرف إذا خريجينك يتوافقون مع اللي يبحث عنه أصحاب العمل فعلاً." },
  "uni.f3.title": { en: "Skills Insights", ar: "رؤى المهارات" },
  "uni.f3.desc": { en: "Discover which skills and certifications the market demands most.", ar: "اكتشف المهارات والشهادات الأكثر طلبًا في سوق العمل." },

  // ─── ERS ───
  "ers.title": { en: "What is ERS?", ar: "ما هي درجة الجاهزية (ERS)؟" },
  "ers.desc": {
    en: "ERS reflects how prepared you are for real job opportunities — based on your skills, certifications, projects, and alignment with actual market demands.",
    ar: "درجة الجاهزية (ERS) تعكس مدى استعدادك الفعلي لسوق العمل بناءً على مهاراتك، وشهاداتك، ومشاريعك.\nوتعتمد أيضًا على مدى توافقك مع المهارات المطلوبة فعليًا في سوق العمل.",
  },
  "ers.step1.title": { en: "Build Your Profile", ar: "ابنِ ملفك" },
  "ers.step1.desc": { en: "Upload your transcripts, certifications, and projects.", ar: "ارفع سجلاتك الأكاديمية وشهاداتك ومشاريعك." },
  "ers.step2.title": { en: "Get Evaluated", ar: "احصل على التقييم" },
  "ers.step2.desc": { en: "Your profile is scored based on real market demand.", ar: "ملفك يتم تقييمه بناءً على متطلبات سوق العمل الفعلية." },
  "ers.step3.title": { en: "Improve & Compete", ar: "طوّر ونافس" },
  "ers.step3.desc": { en: "Follow your roadmap to close skill gaps and climb the rankings.", ar: "اتبع خريطتك لسد الفجوات المهارية وتسلّق الترتيب." },

  // ─── Leaderboard ───
  "leaderboard.title": { en: "National Rankings", ar: "الترتيب الوطني" },
  "leaderboard.desc": { en: "See how students rank across the Kingdom — by readiness score, university, and major.", ar: "شوف ترتيب الطلاب على مستوى المملكة — حسب درجة الجاهزية، الجامعة، والتخصص." },
  "leaderboard.cta": { en: "View Rankings", ar: "استعرض الترتيب" },
  "leaderboard.heading": { en: "National Leaderboard", ar: "الترتيب الوطني" },
  "leaderboard.subtitle": { en: "Top students ranked by Employability Readiness Score", ar: "أفضل الطلاب حسب درجة الجاهزية المهنية" },
  "leaderboard.students": { en: "Students", ar: "الطلاب" },
  "leaderboard.universities": { en: "Universities", ar: "الجامعات" },
  "leaderboard.allUnis": { en: "All Universities", ar: "جميع الجامعات" },
  "leaderboard.allMajors": { en: "All Majors", ar: "جميع التخصصات" },
  "leaderboard.allRegions": { en: "All Regions", ar: "جميع المناطق" },
  "leaderboard.noStudents": { en: "No students found.", ar: "لا يوجد طلاب." },
  "leaderboard.studentsCount": { en: "students", ar: "طالب" },
  "leaderboard.avgERS": { en: "Avg ERS", ar: "متوسط ERS" },
  "leaderboard.footer": { en: "Powered by HireQimah · Updated in real-time", ar: "بدعم من HireQimah · يُحدّث تلقائياً" },
  "leaderboard.you": { en: "You", ar: "أنت" },

  // ─── Vision 2030 ───
  "vision.title": { en: "Supporting Saudi Vision 2030", ar: "ندعم رؤية السعودية 2030" },
  "vision.desc": {
    en: "HireQimah connects education outcomes with labor market needs — helping students, employers, and universities work toward a stronger workforce.",
    ar: "HireQimah تربط مخرجات التعليم بمتطلبات سوق العمل — لمساعدة الطلاب وأصحاب العمل والجامعات في بناء قوى عاملة أقوى.",
  },

  // ─── Final CTA ───
  "cta.title": { en: "Ready to Start Your Journey?", ar: "مستعد تبدأ رحلتك؟" },
  "cta.subtitle": { en: "Start now, know your level, and compete for internship and job opportunities across the Kingdom.", ar: "ابدأ الآن، اعرف مستواك، وابدأ تنافس على فرص التدريب والوظائف في المملكة." },
  "cta.already": { en: "Already have an account?", ar: "عندك حساب؟" },

  // ─── Footer ───
  "footer.tagline": { en: "Career Readiness Platform", ar: "منصة الجاهزية المهنية" },
  "footer.about": { en: "About", ar: "عن المنصة" },
  "footer.team": { en: "Team", ar: "الفريق" },
  "footer.security": { en: "Security", ar: "الأمان" },
  "footer.privacy": { en: "Privacy", ar: "الخصوصية" },
  "footer.terms": { en: "Terms", ar: "الشروط" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.leaderboard": { en: "Rankings", ar: "الترتيب" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },

  // ─── Role Select ───
  "role.welcome": { en: "Welcome Back", ar: "أهلاً بعودتك" },
  "role.create": { en: "Create Your Account", ar: "أنشئ حسابك" },
  "role.selectSignin": { en: "Select your role to sign in", ar: "اختر دورك لتسجيل الدخول" },
  "role.selectSignup": { en: "Select your role to get started", ar: "اختر دورك للبدء" },
  "role.student": { en: "Student", ar: "طالب" },
  "role.student.desc": { en: "Build your profile, track your readiness, and find internship and job opportunities.", ar: "ابنِ ملفك، تابع جاهزيتك، واكتشف فرص التدريب والتوظيف." },
  "role.hr": { en: "HR / Company", ar: "موارد بشرية / شركة" },
  "role.hr.desc": { en: "Find verified, job-ready graduates and manage your hiring pipeline.", ar: "اعثر على خريجين موثّقين وجاهزين للعمل وأدِر عملية التوظيف." },
  "role.university": { en: "University", ar: "جامعة" },
  "role.university.desc": { en: "Monitor student readiness, upload records, and track market alignment.", ar: "تابع جاهزية الطلاب، ارفع السجلات، وراقب توافق مخرجاتك مع السوق." },
  "role.continueAs": { en: "Continue as", ar: "المتابعة كـ" },
  "role.alreadyHave": { en: "Already have an account?", ar: "عندك حساب؟" },
  "role.noAccount": { en: "Don't have an account?", ar: "ما عندك حساب؟" },
  "role.adminAccess": { en: "Administrator Access", ar: "دخول المسؤول" },

  // ─── About ───
  "about.title": { en: "About HireQimah", ar: "عن HireQimah" },
  "about.desc": { en: "HireQimah is a career readiness platform that connects Saudi graduates with employers by measuring real employability — not just grades.", ar: "HireQimah منصة جاهزية مهنية تربط الخريجين السعوديين بأصحاب العمل من خلال قياس الجاهزية الفعلية — مو بس الدرجات." },
  "about.mission": { en: "Our Mission", ar: "مهمتنا" },
  "about.mission.desc": { en: "We believe that grades alone don't predict job readiness. HireQimah's Employment Readiness Score combines verified academic records, industry certifications, real projects, and market-driven skill analysis to give every stakeholder a transparent, trustworthy signal of graduate employability.", ar: "نؤمن إن الدرجات وحدها ما تقيس الجاهزية المهنية. درجة الجاهزية في HireQimah تجمع بين السجلات الأكاديمية الموثّقة، والشهادات المهنية، والمشاريع الحقيقية، وتحليل المهارات المطلوبة في السوق — عشان نعطي الجميع مقياس شفاف وموثوق." },
  "about.values": { en: "What We Stand For", ar: "قيمنا" },
  "about.transparency": { en: "Transparency", ar: "الشفافية" },
  "about.transparency.desc": { en: "Every readiness score is explainable. Students, employers, and universities can see exactly how readiness is measured.", ar: "كل درجة جاهزية قابلة للتفسير. الطلاب وأصحاب العمل والجامعات يقدرون يشوفون كيف تُحسب بالضبط." },
  "about.alignment": { en: "Market Alignment", ar: "توافق مع السوق" },
  "about.alignment.desc": { en: "Our scoring is driven by real Saudi labor market demand — not static rubrics or outdated benchmarks.", ar: "تقييمنا مبني على متطلبات سوق العمل السعودي الفعلية — مو معايير ثابتة أو قديمة." },
  "about.meritocracy": { en: "Meritocracy", ar: "الجدارة" },
  "about.meritocracy.desc": { en: "Rankings are based on verified accomplishments. We fight credential inflation with document integrity checks.", ar: "الترتيب يعتمد على إنجازات موثّقة. نحارب تضخم الشهادات بالتحقق من صحة الوثائق." },
  "about.vision2030": { en: "Aligned with Saudi Vision 2030", ar: "متوافقون مع رؤية السعودية 2030" },
  "about.vision2030.desc": { en: "HireQimah directly supports the Kingdom's goals of increasing youth employment, improving education-to-employment pathways, and building a knowledge-based economy.", ar: "HireQimah تدعم أهداف المملكة في زيادة توظيف الشباب، وتحسين الربط بين التعليم وسوق العمل، وبناء اقتصاد معرفي." },
  "about.cta": { en: "Ready to experience it?", ar: "مستعد تجرّب؟" },

  // ─── Contact ───
  "contact.title": { en: "Contact Us", ar: "تواصل معنا" },
  "contact.desc": { en: "Have a question, partnership inquiry, or feedback? We'd love to hear from you.", ar: "عندك سؤال أو استفسار عن شراكة أو ملاحظة؟ يسعدنا نسمع منك." },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.hq": { en: "Headquarters", ar: "المقر الرئيسي" },
  "contact.hqValue": { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
  "contact.phone": { en: "Phone", ar: "الهاتف" },
  "contact.partnerships": { en: "Partnership Inquiries", ar: "استفسارات الشراكات" },
  "contact.partnerships.desc": { en: "For university or corporate partnership requests, email", ar: "لطلبات الشراكة مع الجامعات أو الشركات، راسلونا على" },
  "contact.name": { en: "Name", ar: "الاسم" },
  "contact.namePlaceholder": { en: "Your full name", ar: "الاسم الكامل" },
  "contact.emailPlaceholder": { en: "you@example.com", ar: "you@example.com" },
  "contact.subject": { en: "Subject", ar: "الموضوع" },
  "contact.subjectPlaceholder": { en: "How can we help?", ar: "كيف نقدر نساعدك؟" },
  "contact.message": { en: "Message", ar: "الرسالة" },
  "contact.messagePlaceholder": { en: "Your message...", ar: "رسالتك..." },
  "contact.send": { en: "Send Message", ar: "إرسال" },
  "contact.sent": { en: "Message Sent!", ar: "تم الإرسال!" },
  "contact.sentDesc": { en: "We'll get back to you within 1-2 business days.", ar: "بنرد عليك خلال ١-٢ يوم عمل." },

  // ─── Privacy ───
  "privacy.title": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "privacy.updated": { en: "Last updated: February 2026", ar: "آخر تحديث: فبراير 2026" },
  "privacy.s1.title": { en: "1. Data We Collect", ar: "١. البيانات التي نجمعها" },
  "privacy.s1.intro": { en: "HireQimah collects the following data to provide career readiness scoring and opportunity matching:", ar: "تجمع HireQimah البيانات التالية لتقديم تقييم الجاهزية المهنية ومطابقة الفرص:" },
  "privacy.s1.i1": { en: "Academic Records: University transcripts, GPA, major, and degree information.", ar: "السجلات الأكاديمية: كشوف الدرجات، المعدل التراكمي، التخصص، ومعلومات الدرجة العلمية." },
  "privacy.s1.i2": { en: "Conduct & Attendance: Disciplinary records and academic warnings provided by partner universities.", ar: "السلوك والحضور: السجلات التأديبية والإنذارات الأكاديمية من الجامعات الشريكة." },
  "privacy.s1.i3": { en: "Professional Certifications: Certification names, verification IDs, and point values.", ar: "الشهادات المهنية: أسماء الشهادات، أرقام التحقق، وقيم النقاط." },
  "privacy.s1.i4": { en: "Activities & Soft Skills: Events, leadership roles, competitions, and community contributions.", ar: "الأنشطة والمهارات: الفعاليات، الأدوار القيادية، المسابقات، والمساهمات المجتمعية." },
  "privacy.s1.i5": { en: "Account Information: Name, university email, role, and encrypted password.", ar: "معلومات الحساب: الاسم، البريد الجامعي، الدور، وكلمة المرور المشفّرة." },
  "privacy.s2.title": { en: "2. Employment Readiness Score (ERS)", ar: "٢. درجة الجاهزية المهنية (ERS)" },
  "privacy.s2.desc": { en: "The ERS is calculated using a transparent, weighted formula:", ar: "تُحسب درجة الجاهزية بمعادلة شفافة ومرجّحة:" },
  "privacy.s2.i1": { en: "40% Academic Performance (from verified transcripts)", ar: "٤٠٪ الأداء الأكاديمي (من كشوف الدرجات الموثّقة)" },
  "privacy.s2.i2": { en: "25% Certifications (difficulty-based points)", ar: "٢٥٪ الشهادات المهنية (نقاط حسب الصعوبة)" },
  "privacy.s2.i3": { en: "15% Projects", ar: "١٥٪ المشاريع" },
  "privacy.s2.i4": { en: "10% Soft Skills & Activities", ar: "١٠٪ المهارات الناعمة والأنشطة" },
  "privacy.s2.i5": { en: "10% Conduct & Attendance", ar: "١٠٪ السلوك والحضور" },
  "privacy.s2.note": { en: "The scoring model and certification point values are standardized and publicly transparent.", ar: "نموذج التقييم وقيم نقاط الشهادات موحّدة وشفافة للجميع." },
  "privacy.s3.title": { en: "3. Who Can See Your Data", ar: "٣. من يمكنه الاطلاع على بياناتك" },
  "privacy.s3.i1": { en: "HR & Companies: Can view your verified profile and ERS breakdown when you apply or appear in search results.", ar: "الموارد البشرية والشركات: يمكنهم الاطلاع على ملفك الموثّق وتفاصيل درجة الجاهزية عند التقديم أو الظهور في نتائج البحث." },
  "privacy.s3.i2": { en: "University Admins: Can upload and manage attendance, conduct, and activity records for their students.", ar: "إدارة الجامعة: يمكنهم رفع وإدارة سجلات الحضور والسلوك والأنشطة لطلابهم." },
  "privacy.s3.i3": { en: "System Admin: Manages platform governance, certification approval, and scoring weights.", ar: "مسؤول النظام: يدير حوكمة المنصة، واعتماد الشهادات، وأوزان التقييم." },
  "privacy.s3.i4": { en: "Other Students: Can see your leaderboard ranking and badges, but not your detailed records.", ar: "الطلاب الآخرون: يشوفون ترتيبك وشاراتك، لكن ما يقدرون يطلعون على تفاصيل سجلاتك." },
  "privacy.s4.title": { en: "4. Security Practices", ar: "٤. ممارسات الأمان" },
  "privacy.s4.i1": { en: "Passwords are hashed and never stored in plain text.", ar: "كلمات المرور تُشفَّر ولا تُخزَّن كنص عادي." },
  "privacy.s4.i2": { en: "Session management with automatic timeout after inactivity.", ar: "إدارة الجلسات مع انتهاء تلقائي بعد فترة عدم النشاط." },
  "privacy.s4.i3": { en: "Rate limiting on login attempts to prevent brute-force attacks.", ar: "تحديد عدد محاولات تسجيل الدخول لمنع هجمات القوة الغاشمة." },
  "privacy.s4.i4": { en: "Role-based access control (RBAC) preventing unauthorized data access.", ar: "التحكم بالوصول حسب الأدوار لمنع الوصول غير المصرّح به." },
  "privacy.s4.i5": { en: "Input sanitization to prevent XSS and injection attacks.", ar: "تنقية المدخلات لمنع هجمات XSS والحقن." },
  "privacy.s5.title": { en: "5. Data Retention", ar: "٥. الاحتفاظ بالبيانات" },
  "privacy.s5.desc": { en: "Your data is retained for the duration of your active account. You may request account deletion by contacting our admin team. Upon deletion, all personal data will be permanently removed.", ar: "بياناتك تُحفظ طوال فترة نشاط حسابك. يمكنك طلب حذف حسابك بالتواصل مع فريق الدعم. عند الحذف، تُزال جميع البيانات الشخصية نهائياً." },
  "privacy.s6.title": { en: "6. Contact", ar: "٦. التواصل" },
  "privacy.s6.desc": { en: "For privacy concerns, contact us at privacy@hireqimah.com or visit our", ar: "لأي استفسار عن الخصوصية، تواصل معنا على privacy@hireqimah.com أو زر صفحة" },
  "privacy.contactPage": { en: "Contact page", ar: "التواصل" },

  // ─── Terms ───
  "terms.title": { en: "Terms & Conditions", ar: "الشروط والأحكام" },
  "terms.updated": { en: "Last updated: February 2026", ar: "آخر تحديث: فبراير 2026" },
  "terms.s1.title": { en: "1. User Responsibilities", ar: "١. مسؤوليات المستخدم" },
  "terms.s1.i1": { en: "All information provided must be accurate and truthful.", ar: "جميع المعلومات المقدّمة يجب أن تكون دقيقة وصحيحة." },
  "terms.s1.i2": { en: "Students must use their official university email to register.", ar: "يجب على الطلاب استخدام بريدهم الجامعي الرسمي للتسجيل." },
  "terms.s1.i3": { en: "Users must not attempt to manipulate scores, leaderboards, or records.", ar: "يُمنع محاولة التلاعب بالدرجات أو الترتيب أو السجلات." },
  "terms.s1.i4": { en: "Any attempt to falsify records will result in account suspension.", ar: "أي محاولة لتزوير السجلات ستؤدي إلى تعليق الحساب." },
  "terms.s2.title": { en: "2. Misconduct Consequences", ar: "٢. عواقب المخالفات" },
  "terms.s2.i1": { en: "Cheating incidents reported by universities are recorded and reduce scores.", ar: "حالات الغش المُبلّغ عنها من الجامعات تُسجَّل وتؤثر على الدرجات." },
  "terms.s2.i2": { en: "Case history is visible to HR during application review.", ar: "سجل المخالفات يظهر لجهات التوظيف أثناء مراجعة الطلبات." },
  "terms.s2.i3": { en: "Repeated misconduct may lead to permanent account suspension.", ar: "تكرار المخالفات قد يؤدي لتعليق الحساب بشكل دائم." },
  "terms.s2.i4": { en: "Falsified certifications will be flagged and removed.", ar: "الشهادات المزوّرة سيتم الإبلاغ عنها وحذفها." },
  "terms.s3.title": { en: "3. Certification Verification", ar: "٣. التحقق من الشهادات" },
  "terms.s3.i1": { en: "Certifications must be submitted with valid verification links when available.", ar: "يجب تقديم الشهادات مع روابط التحقق عند توفرها." },
  "terms.s3.i2": { en: "Certification approval is managed exclusively by the System Admin.", ar: "اعتماد الشهادات يُدار حصريًا من مسؤول النظام." },
  "terms.s3.i3": { en: "Point values are fixed and standardized across all students.", ar: "قيم النقاط ثابتة وموحّدة لجميع الطلاب." },
  "terms.s3.i4": { en: "Universities do not have authority to approve certification points.", ar: "الجامعات لا تملك صلاحية اعتماد نقاط الشهادات." },
  "terms.s4.title": { en: "4. HR Usage Guidelines", ar: "٤. إرشادات استخدام الموارد البشرية" },
  "terms.s4.i1": { en: "HR accounts must represent legitimate organizations.", ar: "حسابات الموارد البشرية يجب أن تمثّل جهات حقيقية." },
  "terms.s4.i2": { en: "Student data must be used solely for recruitment purposes.", ar: "بيانات الطلاب تُستخدم فقط لأغراض التوظيف." },
  "terms.s4.i3": { en: "HR cannot modify student academic records or scores.", ar: "لا يمكن لجهات التوظيف تعديل السجلات الأكاديمية أو الدرجات." },
  "terms.s4.i4": { en: "Talent pool data must not be shared outside the hiring organization.", ar: "بيانات المرشحين لا يُسمح بمشاركتها خارج الجهة الموظِّفة." },
  "terms.s5.title": { en: "5. Platform Governance", ar: "٥. حوكمة المنصة" },
  "terms.s5.desc": { en: "HireQimah reserves the right to modify scoring weights and platform features to maintain fairness and alignment with Saudi market needs and Vision 2030 objectives.", ar: "تحتفظ HireQimah بالحق في تعديل أوزان التقييم وميزات المنصة للحفاظ على العدالة والتوافق مع متطلبات السوق السعودي وأهداف رؤية 2030." },
  "terms.s6.title": { en: "6. Contact", ar: "٦. التواصل" },
  "terms.s6.desc": { en: "For questions about these terms, visit our Contact page or email legal@hireqimah.com.", ar: "لأي استفسار عن هذه الشروط، زر صفحة التواصل أو راسلنا على legal@hireqimah.com." },

  // ─── Founders ───
  "founders.title": { en: "Our Team", ar: "فريقنا" },
  "founders.desc": { en: "The people building Saudi Arabia's career readiness platform.", ar: "الفريق الذي يبني منصة الجاهزية المهنية في المملكة." },
  "founders.teamName": { en: "Founding Team", ar: "الفريق المؤسس" },
  "founders.teamRole": { en: "HireQimah Leadership", ar: "قيادة HireQimah" },
  "founders.teamBio": { en: "HireQimah was founded by a team of Saudi technologists and workforce development experts who saw a critical gap between what universities measure and what employers actually need.", ar: "تأسست HireQimah على يد فريق من التقنيين السعوديين وخبراء تطوير القوى العاملة الذين لاحظوا فجوة كبيرة بين ما تقيسه الجامعات وما يحتاجه أصحاب العمل فعلاً." },
  "founders.joinMission": { en: "Join Our Mission", ar: "انضم لمهمتنا" },
  "founders.joinDesc": { en: "We're always looking for talented individuals passionate about transforming employability in Saudi Arabia. Reach out at", ar: "نبحث دائمًا عن أشخاص موهوبين وشغوفين بتطوير الجاهزية المهنية في المملكة. تواصل معنا على" },

  // ─── Security ───
  "security.title": { en: "Security Statement", ar: "بيان الأمان" },
  "security.desc": { en: "HireQimah is built with enterprise-grade security to protect student data, employer workflows, and institutional records.", ar: "HireQimah مبنية بمعايير أمان مؤسسية لحماية بيانات الطلاب وعمليات التوظيف وسجلات المؤسسات." },
  "security.auth": { en: "Authentication & Access Control", ar: "المصادقة والتحكم بالوصول" },
  "security.auth.i1": { en: "JWT-based authentication with inactivity timeout", ar: "مصادقة JWT مع انتهاء الجلسة عند عدم النشاط" },
  "security.auth.i2": { en: "Role-based access control with server-side enforcement", ar: "تحكم بالوصول حسب الأدوار مع تطبيق من جانب الخادم" },
  "security.auth.i3": { en: "Account lockout after failed login attempts", ar: "قفل الحساب بعد محاولات تسجيل دخول فاشلة" },
  "security.auth.i4": { en: "Rate limiting on authentication endpoints", ar: "تحديد معدل الطلبات على نقاط المصادقة" },
  "security.auth.i5": { en: "Strong password requirements with complexity rules", ar: "متطلبات كلمة مرور قوية مع قواعد تعقيد" },
  "security.privacy": { en: "Data Privacy & PDPL Compliance", ar: "خصوصية البيانات والتوافق مع نظام حماية البيانات" },
  "security.privacy.i1": { en: "Row-Level Security on all database tables", ar: "أمان على مستوى الصفوف في جميع جداول قاعدة البيانات" },
  "security.privacy.i2": { en: "Students control visibility of their profiles", ar: "الطلاب يتحكمون في إظهار ملفاتهم" },
  "security.privacy.i3": { en: "Sensitive documents accessible only via signed URLs", ar: "الوثائق الحساسة متاحة فقط عبر روابط موقّعة" },
  "security.privacy.i4": { en: "Compliant with Saudi Personal Data Protection Law (PDPL)", ar: "متوافق مع نظام حماية البيانات الشخصية السعودي" },
  "security.infra": { en: "Infrastructure Security", ar: "أمان البنية التحتية" },
  "security.infra.i1": { en: "HTTPS enforced with HSTS preloading", ar: "HTTPS مفعّل مع HSTS" },
  "security.infra.i2": { en: "Content Security Policy (CSP) headers", ar: "ترويسات سياسة أمان المحتوى (CSP)" },
  "security.infra.i3": { en: "X-Frame-Options: DENY to prevent clickjacking", ar: "X-Frame-Options: DENY لمنع الاختراق عبر الإطارات" },
  "security.infra.i4": { en: "No sensitive data logged to console", ar: "لا يتم تسجيل بيانات حساسة في وحدة التحكم" },
  "security.docs": { en: "Document Integrity", ar: "سلامة الوثائق" },
  "security.docs.i1": { en: "SHA-256 hashing of all uploaded documents", ar: "تجزئة SHA-256 لجميع الوثائق المرفوعة" },
  "security.docs.i2": { en: "File type validation (PDF, PNG, JPG only, max 10MB)", ar: "التحقق من نوع الملف (PDF, PNG, JPG فقط، حد أقصى 10MB)" },
  "security.docs.i3": { en: "Randomized file storage paths", ar: "مسارات تخزين عشوائية للملفات" },
  "security.docs.i4": { en: "Audit trail for all document operations", ar: "سجل تدقيق لجميع عمليات الوثائق" },
  "security.owasp": { en: "OWASP Top 10 Mitigations", ar: "حماية ضد أهم 10 تهديدات OWASP" },
  "security.owasp.i1": { en: "Input validation on all forms and API endpoints", ar: "التحقق من المدخلات في جميع النماذج ونقاط API" },
  "security.owasp.i2": { en: "Parameterized database queries (no raw SQL)", ar: "استعلامات قاعدة بيانات مُعاملة (بدون SQL مباشر)" },
  "security.owasp.i3": { en: "CSRF protection via SameSite cookie attributes", ar: "حماية CSRF عبر خصائص SameSite للكوكيز" },
  "security.owasp.i4": { en: "BOLA prevention through user-scoped policies", ar: "منع BOLA عبر سياسات مخصصة للمستخدم" },
  "security.owasp.i5": { en: "Dependency scanning and security audits", ar: "فحص التبعيات وتدقيق أمني" },
  "security.contact": { en: "For security inquiries, contact", ar: "للاستفسارات الأمنية، تواصل مع" },

  // ─── Login ───
  "login.title": { en: "Login", ar: "تسجيل الدخول" },
  "login.studentDesc": { en: "Access your readiness score, roadmap & opportunities", ar: "اطّلع على درجة جاهزيتك ومسارك المهني والفرص المتاحة" },
  "login.hrDesc": { en: "Search verified candidates & manage opportunities", ar: "ابحث عن مرشحين موثّقين وأدِر فرص التوظيف" },
  "login.uniDesc": { en: "Manage student records & track readiness", ar: "أدِر سجلات الطلاب وتابع الجاهزية" },
  "login.adminDesc": { en: "Manage platform settings & governance", ar: "إدارة إعدادات المنصة والحوكمة" },
  "login.email": { en: "Email", ar: "البريد الإلكتروني" },
  "login.password": { en: "Password", ar: "كلمة المرور" },
  "login.signingIn": { en: "Signing in...", ar: "جارِ تسجيل الدخول..." },
  "login.signInAs": { en: "Sign In as", ar: "تسجيل الدخول كـ" },
  "login.forgotPassword": { en: "Forgot Password?", ar: "نسيت كلمة المرور؟" },
  "login.noAccount": { en: "Don't have an account?", ar: "ما عندك حساب؟" },
  "login.otherPortals": { en: "Other login portals:", ar: "بوابات دخول أخرى:" },
  "login.studentLogin": { en: "Student Login", ar: "دخول الطلاب" },
  "login.hrLogin": { en: "HR Login", ar: "دخول الموارد البشرية" },
  "login.uniLogin": { en: "University Login", ar: "دخول الجامعات" },

  // ─── Signup ───
  "signup.createAccount": { en: "Create Account", ar: "إنشاء حساب" },
  "signup.creating": { en: "Creating Account...", ar: "جارِ إنشاء الحساب..." },
  "signup.studentAccount": { en: "Create Student Account", ar: "إنشاء حساب طالب" },
  "signup.hrAccount": { en: "Create HR Account", ar: "إنشاء حساب موارد بشرية" },
  "signup.uniAccount": { en: "Create University Account", ar: "إنشاء حساب جامعة" },
  "signup.studentDesc": { en: "Create your student profile & track your readiness", ar: "أنشئ ملفك الطلابي وتابع جاهزيتك" },
  "signup.hrDesc": { en: "Find verified Saudi talent", ar: "اعثر على كفاءات سعودية موثّقة" },
  "signup.uniDesc": { en: "Partner & manage student verification", ar: "كن شريكًا وأدِر توثيق الطلاب" },
  "signup.fullName": { en: "Full Name", ar: "الاسم الكامل" },
  "signup.email": { en: "Email", ar: "البريد الإلكتروني" },
  "signup.emailUniOnly": { en: "Email (University email only)", ar: "البريد الإلكتروني (البريد الجامعي فقط)" },
  "signup.nationality": { en: "Nationality", ar: "الجنسية" },
  "signup.university": { en: "University", ar: "الجامعة" },
  "signup.selectUniversity": { en: "Select university", ar: "اختر الجامعة" },
  "signup.major": { en: "Major", ar: "التخصص" },
  "signup.selectMajor": { en: "Select major", ar: "اختر التخصص" },
  "signup.selectUniFirst": { en: "Select university first", ar: "اختر الجامعة أولاً" },
  "signup.gpaScale": { en: "GPA Scale", ar: "مقياس المعدل" },
  "signup.selectScale": { en: "Select scale", ar: "اختر المقياس" },
  "signup.gpa": { en: "GPA", ar: "المعدل التراكمي" },
  "signup.companyName": { en: "Company Name", ar: "اسم الشركة" },
  "signup.position": { en: "Position", ar: "المنصب" },
  "signup.industry": { en: "Industry", ar: "القطاع" },
  "signup.uniName": { en: "University Name", ar: "اسم الجامعة" },
  "signup.officialDomain": { en: "Official Domain Email", ar: "البريد الرسمي للجامعة" },
  "signup.adminContact": { en: "Admin Contact", ar: "رقم التواصل" },
  "signup.password": { en: "Password", ar: "كلمة المرور" },
  "signup.passwordHint": { en: "Min 12 chars, uppercase, lowercase, number, special", ar: "١٢ حرف على الأقل، أحرف كبيرة وصغيرة، رقم، ورمز خاص" },
  "signup.confirmPassword": { en: "Confirm Password", ar: "تأكيد كلمة المرور" },
  "signup.alreadyHave": { en: "Already have an account?", ar: "عندك حساب؟" },
  "signup.checkEmail": { en: "Check Your Email", ar: "تحقق من بريدك" },
  "signup.checkEmailDesc": { en: "We've sent a verification link to your email. Please verify your account before signing in.", ar: "أرسلنا رابط تحقق لبريدك الإلكتروني. يرجى تأكيد حسابك قبل تسجيل الدخول." },
  "signup.goToSignIn": { en: "Go to Sign In", ar: "الذهاب لتسجيل الدخول" },
  "signup.alreadySignedIn": { en: "Already Signed In", ar: "مسجّل دخولك بالفعل" },
  "signup.alreadySignedInDesc": { en: "You are currently signed in. Would you like to log out and create a new account?", ar: "أنت مسجّل الدخول حاليًا. هل تريد تسجيل الخروج وإنشاء حساب جديد؟" },
  "signup.returnDashboard": { en: "Return to Dashboard", ar: "العودة للوحة التحكم" },
  "signup.logoutRegister": { en: "Log Out & Register", ar: "تسجيل الخروج والتسجيل" },

  // ─── Forgot Password ───
  "forgot.title": { en: "Forgot Password", ar: "نسيت كلمة المرور" },
  "forgot.desc": { en: "Enter your email to receive a reset link.", ar: "أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين." },
  "forgot.checkEmail": { en: "Check Your Email", ar: "تحقق من بريدك" },
  "forgot.sent": { en: "A password reset link has been sent to your email.", ar: "تم إرسال رابط إعادة تعيين كلمة المرور لبريدك." },
  "forgot.checkInbox": { en: "Check your inbox at", ar: "تحقق من صندوق الوارد في" },
  "forgot.followLink": { en: "and follow the link to reset your password.", ar: "واتبع الرابط لإعادة تعيين كلمة المرور." },
  "forgot.backToSignIn": { en: "Back to Sign In", ar: "العودة لتسجيل الدخول" },
  "forgot.sending": { en: "Sending...", ar: "جارِ الإرسال..." },
  "forgot.sendReset": { en: "Send Reset Link", ar: "إرسال رابط إعادة التعيين" },

  // ─── Student Dashboard ───
  "dash.welcome": { en: "Welcome, {name}", ar: "أهلاً، {name}" },
  "dash.ersScore": { en: "ERS Score", ar: "درجة الجاهزية" },
  "dash.rank": { en: "Rank", ar: "الترتيب" },
  "dash.certifications": { en: "Certifications", ar: "الشهادات" },
  "dash.interviews": { en: "Interviews", ar: "المقابلات" },
  "dash.ers": { en: "ERS", ar: "الجاهزية" },
  "dash.leaderboard": { en: "Rank", ar: "الترتيب" },
  "dash.docs": { en: "Documents", ar: "المستندات" },
  "dash.opportunities": { en: "Opportunities", ar: "الفرص" },
  "dash.roadmap": { en: "Roadmap", ar: "المسار" },
  "dash.jobs": { en: "Jobs", ar: "الوظائف" },
  "dash.skills": { en: "Skills", ar: "المهارات" },
  "dash.notifications": { en: "Notifications", ar: "الإشعارات" },
  "dash.share": { en: "Share", ar: "مشاركة" },
  "dash.profile": { en: "Profile", ar: "الملف" },
  "dash.profileComplete": { en: "Profile Completeness", ar: "اكتمال الملف" },
  "dash.scoreBreakdown": { en: "Explainable Score Breakdown", ar: "تفصيل الدرجة" },
  "dash.academic": { en: "Academic Performance", ar: "الأداء الأكاديمي" },
  "dash.projects": { en: "Projects", ar: "المشاريع" },
  "dash.softSkills": { en: "Soft Skills", ar: "المهارات الناعمة" },
  "dash.conduct": { en: "Conduct & Attendance", ar: "السلوك والحضور" },
  "dash.synergy": { en: "Synergy", ar: "التكامل" },
  "dash.national": { en: "National", ar: "وطني" },
  "dash.decayApplied": { en: "Skill Decay Applied", ar: "تناقص المهارات" },
  "dash.majorTrack": { en: "Major Track", ar: "مسار التخصص" },
  "dash.weightsCustomized": { en: "weights customized for your field", ar: "أوزان مخصصة لتخصصك" },
  "dash.uploadTranscript": { en: "Upload Transcript", ar: "رفع السجل الأكاديمي" },
  "dash.uploadCertificate": { en: "Upload Certificate", ar: "رفع شهادة" },
  "dash.uploadProject": { en: "Upload Project", ar: "رفع مشروع" },
  "dash.transcripts": { en: "Transcripts", ar: "السجلات الأكاديمية" },
  "dash.noTranscripts": { en: "No transcripts uploaded yet", ar: "لم يتم رفع سجلات أكاديمية بعد" },
  "dash.noCertificates": { en: "No certifications uploaded yet", ar: "لم يتم رفع شهادات بعد" },
  "dash.noProjects": { en: "No projects uploaded yet", ar: "لم يتم رفع مشاريع بعد" },
  "dash.verified": { en: "Verified", ar: "موثّق" },
  "dash.pending": { en: "Pending", ar: "قيد المراجعة" },
  "dash.profileLinkCopied": { en: "Profile link copied!", ar: "تم نسخ رابط الملف!" },
  "dash.global": { en: "National", ar: "وطني" },
  "dash.university": { en: "University", ar: "جامعة" },
  "dash.major": { en: "Major", ar: "تخصص" },
  "dash.target": { en: "Target", ar: "الهدف" },
  "dash.uploaded": { en: "Uploaded successfully", ar: "تم الرفع بنجاح" },
  "dash.pendingVerification": { en: "Pending verification", ar: "بانتظار التحقق" },
  "dash.fileTooLarge": { en: "File too large", ar: "الملف كبير جداً" },
  "dash.maxSize": { en: "Max 10MB", ar: "الحد الأقصى 10 ميقابايت" },
  "dash.invalidFormat": { en: "Invalid format", ar: "صيغة غير صالحة" },
  "dash.onlyPdfPngJpg": { en: "Only PDF, PNG, JPG", ar: "PDF, PNG, JPG فقط" },
  "dash.uploadFailed": { en: "Upload failed", ar: "فشل الرفع" },
  "dash.interviewAccepted": { en: "Interview accepted", ar: "تم قبول المقابلة" },
  "dash.interviewDeclined": { en: "Interview declined", ar: "تم رفض المقابلة" },
  "dash.accept": { en: "Accept", ar: "قبول" },
  "dash.decline": { en: "Decline", ar: "رفض" },
  "dash.noInterviews": { en: "No interview requests yet", ar: "لا توجد طلبات مقابلات بعد" },
  "dash.noNotifications": { en: "No notifications", ar: "لا توجد إشعارات" },
  "dash.markAllRead": { en: "Mark all as read", ar: "تحديد الكل كمقروء" },
  "dash.noSkills": { en: "No skills added yet", ar: "لم يتم إضافة مهارات بعد" },
  "dash.noJobs": { en: "No job opportunities available", ar: "لا توجد فرص وظيفية متاحة" },
  "dash.jobPostings": { en: "Job Postings", ar: "الوظائف المتاحة" },
  "dash.marketTrends": { en: "Market Trends", ar: "اتجاهات السوق" },
  "dash.certCatalog": { en: "Certification Catalog", ar: "كتالوج الشهادات" },
  "dash.badges": { en: "Badges", ar: "الشارات" },
  "dash.activityFeed": { en: "Activity Feed", ar: "سجل النشاط" },

  // ─── HR Dashboard ───
  "hr.title": { en: "Talent Discovery", ar: "اكتشاف المواهب" },
  "hr.subtitle": { en: "Find verified, job-ready Saudi graduates", ar: "اعثر على خريجين سعوديين موثّقين وجاهزين للعمل" },
  "hr.candidates": { en: "Candidates", ar: "المرشحون" },
  "hr.shortlisted": { en: "Shortlisted", ar: "القائمة المختصرة" },
  "hr.pipeline": { en: "Pipeline", ar: "مسار التوظيف" },
  "hr.analytics": { en: "Analytics", ar: "التحليلات" },
  "hr.postings": { en: "Job Postings", ar: "الوظائف" },
  "hr.search": { en: "Search candidates...", ar: "البحث عن مرشحين..." },
  "hr.minERS": { en: "Min ERS", ar: "أدنى جاهزية" },
  "hr.filterUni": { en: "University", ar: "الجامعة" },
  "hr.filterMajor": { en: "Major", ar: "التخصص" },
  "hr.all": { en: "All", ar: "الكل" },
  "hr.viewProfile": { en: "View Profile", ar: "عرض الملف" },
  "hr.shortlist": { en: "Shortlist", ar: "إضافة للقائمة" },
  "hr.removeShortlist": { en: "Remove", ar: "إزالة" },
  "hr.sendInterview": { en: "Send Interview Request", ar: "إرسال طلب مقابلة" },
  "hr.noCandidates": { en: "No candidates found", ar: "لم يتم العثور على مرشحين" },
  "hr.noShortlist": { en: "No shortlisted candidates", ar: "لا يوجد مرشحون في القائمة" },
  "hr.jobsAnalyzed": { en: "Jobs Analyzed", ar: "وظائف تم تحليلها" },
  "hr.companies": { en: "Companies", ar: "الشركات" },
  "hr.sources": { en: "Sources", ar: "المصادر" },
  "hr.lastRefresh": { en: "Last Refresh", ar: "آخر تحديث" },
  "hr.createPosting": { en: "Create Job Posting", ar: "إنشاء وظيفة" },
  "hr.jobTitle": { en: "Job Title", ar: "المسمى الوظيفي" },
  "hr.description": { en: "Description", ar: "الوصف" },
  "hr.location": { en: "Location", ar: "الموقع" },
  "hr.sector": { en: "Sector", ar: "القطاع" },
  "hr.requiredSkills": { en: "Required Skills", ar: "المهارات المطلوبة" },
  "hr.active": { en: "Active", ar: "نشط" },
  "hr.inactive": { en: "Inactive", ar: "غير نشط" },

  // ─── Admin Dashboard ───
  "admin.title": { en: "Platform Administration", ar: "إدارة المنصة" },
  "admin.subtitle": { en: "Centralized governance & monitoring", ar: "الحوكمة والمراقبة المركزية" },
  "admin.totalUsers": { en: "Total Users", ar: "إجمالي المستخدمين" },
  "admin.students": { en: "Students", ar: "الطلاب" },
  "admin.hrUsers": { en: "HR Users", ar: "مستخدمو الموارد البشرية" },
  "admin.universities": { en: "Universities", ar: "الجامعات" },
  "admin.overview": { en: "Overview", ar: "نظرة عامة" },
  "admin.studentMgmt": { en: "Student Management", ar: "إدارة الطلاب" },
  "admin.auditLogs": { en: "Audit Logs", ar: "سجل التدقيق" },
  "admin.marketIntel": { en: "Market Intelligence", ar: "ذكاء السوق" },
  "admin.userDistribution": { en: "User Distribution", ar: "توزيع المستخدمين" },
  "admin.recentAudit": { en: "Recent Activity", ar: "النشاط الأخير" },
  "admin.name": { en: "Name", ar: "الاسم" },
  "admin.email": { en: "Email", ar: "البريد" },
  "admin.uni": { en: "University", ar: "الجامعة" },
  "admin.ers": { en: "ERS", ar: "الجاهزية" },
  "admin.action": { en: "Action", ar: "الإجراء" },
  "admin.time": { en: "Time", ar: "الوقت" },
  "admin.user": { en: "User", ar: "المستخدم" },

  // ─── University Dashboard ───
  "uniDash.title": { en: "University Dashboard", ar: "لوحة تحكم الجامعة" },
  "uniDash.subtitle": { en: "Student readiness analytics & market alignment", ar: "تحليلات جاهزية الطلاب وتوافق السوق" },
  "uniDash.totalStudents": { en: "Total Students", ar: "إجمالي الطلاب" },
  "uniDash.avgERS": { en: "Average ERS", ar: "متوسط الجاهزية" },
  "uniDash.certifiedStudents": { en: "Certified Students", ar: "طلاب حاصلون على شهادات" },
  "uniDash.marketReadiness": { en: "Market Readiness", ar: "الجاهزية السوقية" },
  "uniDash.cohortAnalytics": { en: "Cohort Analytics", ar: "تحليلات الدُفعات" },
  "uniDash.studentRecords": { en: "Student Records", ar: "سجلات الطلاب" },
  "uniDash.skillGaps": { en: "Skill Gaps", ar: "فجوات المهارات" },
  "uniDash.uploads": { en: "Records Upload", ar: "رفع السجلات" },
  "uniDash.uploadConduct": { en: "Upload Conduct Records", ar: "رفع سجلات السلوك" },
  "uniDash.uploadAttendance": { en: "Upload Attendance Records", ar: "رفع سجلات الحضور" },
  "uniDash.topCerts": { en: "Top Certifications", ar: "أبرز الشهادات" },
  "uniDash.marketDemand": { en: "Market Demanded Skills", ar: "المهارات المطلوبة في السوق" },
  "uniDash.ersDistribution": { en: "ERS Distribution", ar: "توزيع الجاهزية" },
  "uniDash.excellent": { en: "Excellent (80+)", ar: "ممتاز (٨٠+)" },
  "uniDash.good": { en: "Good (60-79)", ar: "جيد (٦٠-٧٩)" },
  "uniDash.developing": { en: "Developing (40-59)", ar: "قيد التطوير (٤٠-٥٩)" },
  "uniDash.needsWork": { en: "Needs Work (<40)", ar: "يحتاج عمل (<٤٠)" },

  // ─── Common ───
  "common.required": { en: "Required", ar: "مطلوب" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.delete": { en: "Delete", ar: "حذف" },
  "common.edit": { en: "Edit", ar: "تعديل" },
  "common.close": { en: "Close", ar: "إغلاق" },
  "common.loading": { en: "Loading...", ar: "جارِ التحميل..." },
  "common.noData": { en: "No data available", ar: "لا توجد بيانات" },
  "common.viewAll": { en: "View All", ar: "عرض الكل" },
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

  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = translations[key]?.[lang] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };
  
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
