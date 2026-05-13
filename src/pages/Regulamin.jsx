import React from 'react';

export default function Regulamin() {
  return (
    <div className="min-h-screen bg-navy text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Regulamin świadczenia usług</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§1. Postanowienia ogólne</h2>
        <p className="text-slate-300">Niniejszy regulamin określa zasady korzystania z usług świadczonych przez Kompas Migracji z siedzibą w Polsce.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§2. Zakres usług</h2>
        <p className="text-slate-300">Kompas Migracji świadczy usługi doradztwa prawnego i migracyjnego, pomoc w przygotowaniu dokumentów, tłumaczenia oraz reprezentację w kontaktach z urzędami.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§3. Zasady współpracy</h2>
        <p className="text-slate-300">Warunki świadczenia poszczególnych usług ustalane są indywidualnie po bezpłatnej konsultacji wstępnej. Klient otrzymuje pisemne potwierdzenie zakresu i kosztów usługi.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§4. Płatności</h2>
        <p className="text-slate-300">Ceny usług podane są w złotych polskich (PLN). Płatność realizowana jest przelewem bankowym lub inną uzgodnioną formą. Możliwa jest płatność ratalna po uprzednim ustaleniu warunków.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§5. Odpowiedzialność</h2>
        <p className="text-slate-300">Kompas Migracji dokłada najwyższej staranności w świadczeniu usług. Wyniki postępowań urzędowych zależą od decyzji organów administracji i nie mogą być gwarantowane.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§6. Reklamacje</h2>
        <p className="text-slate-300">Reklamacje należy kierować na adres: info@kompasmigracji.com. Rozpatrzenie reklamacji następuje w terminie 14 dni roboczych.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">§7. Postanowienia końcowe</h2>
        <p className="text-slate-300">W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego. Wszelkie spory rozstrzygane są przez sąd właściwy dla siedziby usługodawcy.</p>
      </section>
    </div>
  );
}
