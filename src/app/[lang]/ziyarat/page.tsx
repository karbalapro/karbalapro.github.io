import { Metadata } from 'next';
import ZiyaratListClient from "./ZiyaratListClient";

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
      title: "Ziyarats | Karbala Pro",
      description: "Interactive texts and audio of Ziyarat Ashura and Ziyarat Warith in three languages.",
    };
  } else if (lang === 'ar') {
    return {
      title: "الزيارات | Karbala Pro",
      description: "النصوص التفاعلية والصوت لزيارة عاشوراء وزيارة وارث بثلاث لغات.",
    };
  }

  // default to FA
  return {
    title: "زیارت‌نامه‌ها | Karbala Pro",
    description: "متن تعاملی و قرائت صوتی زیارت عاشورا و زیارت وارث با ترجمه سه‌زبانه.",
  };
}

export default async function ZiyaratPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return <ZiyaratListClient routeLang={resolvedParams.lang} />;
}
