import { getMemories } from "@/app/actions/memories";
import MemoriesForm from "@/components/MemoriesForm";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import faUi from '@/locales/fa/ui.json';
import enUi from '@/locales/en/ui.json';
import arUi from '@/locales/ar/ui.json';

const dictionaries: Record<string, any> = {
  fa: faUi,
  en: enUi,
  ar: arUi,
};
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = dictionaries[lang] || dictionaries['fa'];
  
  return {
    title: `${dict.memoriesTitle} | Karbala`,
    description: dict.memoriesDesc,
  };
}

export default async function MemoriesPage({ params }: Props) {
  const { lang } = await params;
  const dict = dictionaries[lang] || dictionaries['fa'];
  
  // Fetch approved memories
  const memories = await getMemories(lang) || [];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-bold tracking-widest uppercase mb-4">
            {dict.community}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            {dict.memoriesTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed">
            {dict.memoriesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Memories Wall (Left Side) */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
              {dict.recentMemories}
            </h2>
            
            {memories.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </div>
                <p className="text-white/60 text-lg">{dict.noMemoriesYet}</p>
                <p className="text-white/40 text-sm mt-2">{dict.beFirstToShare}</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {memories.map((memory: any) => (
                  <div key={memory.id} className="break-inside-avoid bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors shadow-lg">
                    
                    {memory.content && (
                      <p className="text-white/80 leading-loose text-lg mb-6 whitespace-pre-wrap font-serif">
                        "{memory.content}"
                      </p>
                    )}

                    {memory.audio_url && (
                      <div className="mb-6 -mx-2">
                        <CustomAudioPlayer src={memory.audio_url} />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-amber-500 font-bold">{memory.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{memory.name}</h4>
                        <span className="text-white/40 text-xs">
                          {new Date(memory.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form (Right Side) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <MemoriesForm />
          </div>

        </div>
      </div>
    </main>
  );
}
