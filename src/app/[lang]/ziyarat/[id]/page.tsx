import { Metadata } from 'next';
import ZiyaratReaderClient from "./ZiyaratReaderClient";
import { ziyarats } from "@/data/ziyarats";

export const dynamic = "force-static";

export function generateStaticParams() {
  const languages = ['fa', 'en', 'ar'];
  const params: { lang: string, id: string }[] = [];
  
  for (const lang of languages) {
    for (const ziyarat of ziyarats) {
      params.push({ lang, id: ziyarat.id });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, id } = resolvedParams;
  
  const ziyarat = ziyarats.find(z => z.id === id);
  if (!ziyarat) {
    return { title: "Not Found" };
  }

  let title = ziyarat.id === 'ashura' ? 'زیارت عاشورا' : 'زیارت وارث';
  let desc = 'قرائت تعاملی زیارت با ترجمه و صوت';
  
  if (lang === 'en') {
    title = ziyarat.id === 'ashura' ? 'Ziyarat Ashura' : 'Ziyarat Warith';
    desc = 'Interactive reading with translation and audio.';
  } else if (lang === 'ar') {
    title = ziyarat.id === 'ashura' ? 'زيارة عاشوراء' : 'زيارة وارث';
    desc = 'قراءة تفاعلية مع الترجمة والصوت.';
  }
  
  return {
    title: `${title} | Karbala Pro`,
    description: desc,
  };
}

export default async function ZiyaratIdPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const resolvedParams = await params;
  return <ZiyaratReaderClient routeLang={resolvedParams.lang} id={resolvedParams.id} />;
}
