import PersonaGallery from "@/components/PersonaGallery";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'fa' ? 'شخصیت‌ها | کربلا' : lang === 'ar' ? 'الشخصيات | كربلاء' : 'Personas | Karbala',
  };
}

export default async function PersonasPage({ params }: Props) {
  const { lang } = await params;
  
  return (
    <main className="min-h-screen text-foreground overflow-x-hidden">
      <PersonaGallery routeLang={lang} />
    </main>
  );
}
