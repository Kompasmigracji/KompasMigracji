import { useLocale } from 'next-intl';
import { doctrineData } from '@/lib/doctrine';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const data = doctrineData[locale as keyof typeof doctrineData] || doctrineData.uk;
  return {
    title: `${data.title} | Kompas Migracji`,
    description: data.preamble.title
  };
}

export default function DoctrinePage() {
  const locale = useLocale();
  const data = doctrineData[locale as keyof typeof doctrineData] || doctrineData.uk;

  return (
    <main className="min-h-screen pb-24 pt-32 bg-[#fbfbfd] dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-black/5 dark:border-white/10 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            {data.title}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Preamble */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center uppercase tracking-widest text-sm text-blue-500">
            {data.preamble.title}
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10" />
            {data.preamble.content.map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Sections */}
        <div className="space-y-12">
          {data.sections.map((section, idx) => (
            <section key={idx} className="relative group">
              <div className="absolute -left-4 md:-left-12 top-0 text-5xl md:text-6xl font-black text-black/5 dark:text-white/5 select-none transition-colors group-hover:text-blue-500/10">
                {section.num}
              </div>
              <div className="relative z-10 pl-4 md:pl-0 border-l-2 md:border-l-0 border-blue-500 md:border-transparent">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="hidden md:flex w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 items-center justify-center text-sm">
                    {section.num}
                  </span>
                  {section.title}
                </h3>
                <div className="space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
