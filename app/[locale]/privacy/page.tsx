import Link from 'next/link';

function Section({ num, title, children }: { num?: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: '#f97316', margin: '0 0 10px', textTransform: 'uppercase' }}>
        {num != null ? `${num}. ` : ''}{title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.75, color: '#111', margin: '0 0 10px' }}>{children}</p>;
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 font-display">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary no-underline mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          На головну
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">POLITYKA PRYWATNOŚCI</p>
        <h1 className="text-3xl md:text-4xl font-black text-black mb-2 leading-tight tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-gray-700 mb-12">Zgodnie z RODO / According to GDPR</p>

        <Section num={1} title="Administrator danych">
          <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 10 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>DOMUS V Sp. z o.o.</p>
            {[['Adres','ul. Dzieci Warszawy 27c/49, 02-495 Warszawa'],['NIP','5223350030'],['KRS','0001198474'],['E-mail','info@kompasmigracji.com']].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', minWidth: 110, paddingTop: 1 }}>{label}</span>
                <span style={{ fontSize: 14, color: '#cbd5e1' }}>{val}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section num={2} title="Zakres przetwarzanych danych">
          <P>Przetwarzamy dane podane przez użytkownika w formularzu kontaktowym: imię, adres e-mail, numer telefonu oraz treść wiadomości.</P>
        </Section>

        <Section num={3} title="Cel przetwarzania">
          <P>Dane są przetwarzane wyłącznie w celu udzielenia odpowiedzi na zapytanie oraz świadczenia usług doradztwa migracyjnego.</P>
        </Section>

        <Section num={4} title="Podstawa prawna (RODO)">
          <P>Podstawą prawną przetwarzania jest zgoda osoby, której dane dotyczą (art. 6 ust. 1 lit. a RODO) lub uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).</P>
        </Section>

        <Section num={5} title="Prawa użytkownika">
          <P>Użytkownik ma prawo do dostępu, sprostowania, usunięcia, ograniczenia przetwarzania danych, a także prawo do wniesienia sprzeciwu i skargi do organu nadzorczego (UODO).</P>
        </Section>

        <Section num={6} title="Okres przechowywania">
          <P>Dane przechowywane są przez okres niezbędny do realizacji celu, nie dłużej niż 2 lata od ostatniego kontaktu.</P>
        </Section>

        <Section num={7} title="Kontakt">
          <P>W sprawach dotyczących ochrony danych osobowych prosimy o kontakt: info@kompasmigracji.com</P>
        </Section>

        <div className="border-t border-soft pt-8 mt-4">
          <p className="text-base text-gray-700 leading-relaxed">
            DOMUS V Sp. z o.o. — Warszawa, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
