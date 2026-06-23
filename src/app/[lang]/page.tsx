import { Metadata } from 'next';
import PersonaGallery from "@/components/PersonaGallery";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { lang: 'fa' },
    { lang: 'en' },
    { lang: 'ar' }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  
  if (lang === 'en') {
    return {
      title: "Ashura Encyclopedia & Interactive Ziyarat | Karbala Pro",
      description: "The most comprehensive encyclopedia of the personas of Karbala (over 274 personas) with interactive reading of Ziyarat Ashura and Ziyarat Warith in three languages.",
    };
  } else if (lang === 'ar') {
    return {
      title: "موسوعة عاشوراء والزيارات التفاعلية | Karbala Pro",
      description: "الموسوعة الأشمل لشخصيات واقعة كربلاء (أكثر من 274 شخصية) مع القراءة التفاعلية لزيارة عاشوراء وزيارة وارث بثلاث لغات.",
    };
  }

  // default to FA
  return {
    title: "دانشنامه عاشورا و زیارت‌نامه‌های تعاملی | Karbala Pro",
    description: "جامع‌ترین دایرةالمعارف شخصیت‌های واقعه کربلا (بیش از ۲۷۴ شخصیت) به همراه قرائت تعاملی زیارت عاشورا و زیارت وارث با ترجمه سه‌زبانه.",
  };
}

export default async function LangHome({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return (
    <main className="min-h-screen text-foreground overflow-x-hidden">
      <PersonaGallery routeLang={resolvedParams.lang} />
    </main>
  );
}
