import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-navy text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Polityka prywatności / Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Administrator danych</h2>
        <p className="text-slate-300">Administratorem danych osobowych jest Kompas Migracji. Kontakt: info@kompasmigracji.com</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Zakres przetwarzanych danych</h2>
        <p className="text-slate-300">Przetwarzamy dane podane przez użytkownika w formularzu kontaktowym: imię, adres e-mail, numer telefonu oraz treść wiadomości.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Cel przetwarzania</h2>
        <p className="text-slate-300">Dane są przetwarzane wyłącznie w celu udzielenia odpowiedzi na zapytanie oraz świadczenia usług doradztwa migracyjnego.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Podstawa prawna (RODO)</h2>
        <p className="text-slate-300">Podstawą prawną przetwarzania jest zgoda osoby, której dane dotyczą (art. 6 ust. 1 lit. a RODO) lub uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Prawa użytkownika</h2>
        <p className="text-slate-300">Użytkownik ma prawo do dostępu, sprostowania, usunięcia, ograniczenia przetwarzania danych, a także prawo do wniesienia sprzeciwu i skargi do organu nadzorczego (UODO).</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Okres przechowywania</h2>
        <p className="text-slate-300">Dane przechowywane są przez okres niezbędny do realizacji celu, nie dłużej niż 2 lata od ostatniego kontaktu.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Kontakt</h2>
        <p className="text-slate-300">W sprawach dotyczących ochrony danych osobowych prosimy o kontakt: info@kompasmigracji.com</p>
      </section>
    </div>
  );
}
