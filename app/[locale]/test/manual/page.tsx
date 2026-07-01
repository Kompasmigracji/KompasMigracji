import Link from 'next/link';

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 font-display">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary no-underline mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          На головну
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">ІНСТРУКЦІЯ КОРИСТУВАЧА</p>
        <h1 className="text-3xl md:text-4xl font-black text-black mb-6 leading-tight tracking-tight">Вебсайт Kompas Migracji</h1>
        
        <div className="prose prose-gray max-w-none prose-headings:text-black prose-p:text-gray-800">
          <p className="text-lg mb-8">
            Ласкаво просимо до офіційного сайту <strong>Kompas Migracji</strong> — вашого надійного партнера з легалізації та міграційних послуг у Польщі та ЄС.
            Ця інструкція допоможе вам швидко ознайомитись із можливостями нашого сайту та ефективно їх використовувати.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">1. Головна сторінка та Навігація</h2>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
            <li><strong>Навігаційне меню (Header):</strong> Дозволяє швидко перейти до потрібного розділу (Послуги, Прайс, Блог, Контакти).</li>
            <li><strong>Перемикач мови:</strong> Ви можете змінити мову сайту (Українська, Польська, Англійська, Російська) у верхньому правому куті.</li>
            <li><strong>Тема оформлення:</strong> Перемикач світлої та темної тем для зручного перегляду у будь-який час доби.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">2. Пошук та замовлення послуг</h2>
          <p className="mb-4 text-gray-700">Ми пропонуємо широкий спектр послуг, від перекладу документів до оформлення громадянства.</p>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
            <li><strong>Каталог послуг:</strong> На головній сторінці в блоці послуг або на окремій сторінці "Прайс".</li>
            <li><strong>Деталі послуг:</strong> Деякі послуги, такі як "Карта Побиту", мають окремі сторінки з детальним описом процесу та цін.</li>
            <li><strong>Як замовити:</strong> Натисніть кнопку "Отримати консультацію" або залиште заявку через контактну форму.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">3. Використання AI-Чатбота</h2>
          <p className="mb-4 text-gray-700">На нашому сайті працює розумний AI-чатбот, який готовий допомогти вам 24/7.</p>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
            <li><strong>Як відкрити:</strong> Натисніть на іконку чату в нижньому правому куті екрана.</li>
            <li><strong>Можливості:</strong> Бот відповість на ваші питання щодо міграції, легалізації та необхідних документів.</li>
            <li><strong>Мови:</strong> Бот автоматично розуміє вашу мову та відповідає нею.</li>
            <li><strong>Залишити контакти:</strong> Якщо ви хочете, щоб наш менеджер зв'язався з вами, просто напишіть боту своє ім'я та номер телефону.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">4. Зворотний зв'язок та Контакти</h2>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
            <li><strong>Контактна форма:</strong> Заповніть форму внизу сторінки або на сторінці контактів.</li>
            <li><strong>Месенджери:</strong> На сайті є швидкі кнопки для переходу у <strong>WhatsApp</strong> та <strong>Viber</strong>.</li>
            <li><strong>Відгуки:</strong> Ознайомтеся з відгуками наших клієнтів, щоб переконатися в нашій надійності.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">5. Додаткова інформація</h2>
          <ul className="list-disc pl-5 space-y-2 mb-8 text-gray-700">
            <li><strong>FAQ:</strong> У розділі поширених запитань ви знайдете відповіді на основні питання щодо переїзду та легалізації.</li>
            <li><strong>Блог:</strong> Читайте наші статті з останніми новинами та порадами щодо міграції.</li>
            <li><strong>Безпека даних:</strong> Ми поважаємо вашу конфіденційність. Усі дані обробляються відповідно до норм GDPR/RODO (деталі у розділі "Політика конфіденційності").</li>
          </ul>

          <div className="bg-gray-100 p-6 rounded-lg text-center mt-10">
            <p className="text-lg font-semibold text-gray-800 m-0">Дякуємо, що обираєте Kompas Migracji!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
