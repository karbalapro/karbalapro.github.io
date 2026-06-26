import { Metadata } from 'next';
import InteractiveMap from '@/components/InteractiveMap';
import HistoryTimeline from '@/components/HistoryTimeline';

// Import locales directly for Server Components
import faUi from '@/locales/fa/ui.json';
import enUi from '@/locales/en/ui.json';
import arUi from '@/locales/ar/ui.json';

const dictionaries: Record<string, any> = {
  fa: faUi,
  en: enUi,
  ar: arUi,
};

interface Props {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = dictionaries[lang] || dictionaries['fa'];
  
  return {
    title: `${dict.historyTitle} | Karbala Pro`,
    description: dict.historySubtitle,
  };
}

export default async function HistoryPage({ params }: Props) {
  const { lang } = await params;
  const dict = dictionaries[lang] || dictionaries['fa'];
  
  return (
    <div className="min-h-screen bg-[#050505] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {dict.historyTitle}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {dict.historySubtitle}
          </p>
        </div>

        {/* Interactive Map Section */}
        <section className="mb-24">
          <InteractiveMap />
        </section>

        {/* Timeline Section */}
        <section>
          <HistoryTimeline />
        </section>

      </div>
    </div>
  );
}
