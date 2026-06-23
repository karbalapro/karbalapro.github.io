import { Metadata } from 'next';
import LivePageClient from "./LivePageClient";

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
      title: "Live Ziyarat | Karbala Pro",
      description: "Live broadcast from the holy shrines of Imam Hussain and Hazrat Abbas.",
    };
  } else if (lang === 'ar') {
    return {
      title: "البث المباشر | Karbala Pro",
      description: "البث المباشر من العتبات المقدسة للإمام الحسين وأبي الفضل العباس.",
    };
  }

  // default to FA
  return {
    title: "پخش زنده کربلا | Karbala Pro",
    description: "پخش زنده و مستقیم از حرم مطهر امام حسین (ع) و حضرت ابوالفضل العباس (ع).",
  };
}

export default async function LivePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return <LivePageClient routeLang={resolvedParams.lang} />;
}
