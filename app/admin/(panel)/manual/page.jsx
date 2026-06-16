import React from 'react';

export default function AdminManualPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="border-b border-slate-200 dark:border-slate-800 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">ІНСТРУКЦІЯ АДМІНІСТРАТОРА</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">KompasCRM</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            <strong>KompasCRM</strong> — це внутрішня система управління для співробітників компанії <strong>Kompas Migracji</strong>. Ця інструкція допоможе вам освоїти основні функції панелі адміністратора.
          </p>
        </div>

        <div className="p-6 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
              Вхід у систему
            </h2>
            <div className="ml-10 text-slate-600 dark:text-slate-300 space-y-2">
              <p>• Перейдіть за адресою <code>/admin</code>.</p>
              <p>• Система доступу базується на ролях (RBAC). Ви бачитимете лише ті модулі та розділи, до яких маєте доступ згідно з вашою посадою.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
              Робота з Лідами (Клієнтами)
            </h2>
            <div className="ml-10 text-slate-600 dark:text-slate-300 space-y-3">
              <p>Усі звернення з сайту (через форму, чатбота, месенджери) автоматично потрапляють у таблицю лідів.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Перегляд лідів:</strong> На головній панелі адміністрування ви побачите список нових заявок.</li>
                <li><strong>Статуси:</strong> Кожен лід має свій статус (наприклад: "Новий", "В роботі", "Успішно"). Ви можете змінювати статус після контакту з клієнтом.</li>
                <li><strong>Фільтрація:</strong> Зручні фільтри дозволяють швидко знаходити клієнтів за статусом, датою чи джерелом.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
              Інтеграція AI-Агентів (Primus)
            </h2>
            <div className="ml-10 text-slate-600 dark:text-slate-300 space-y-3">
              <p>KompasCRM оснащена інноваційною системою автономних AI-агентів, які допомагають в рутинних завданнях.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Дашборд Агентів (<code>/admin/agents</code>):</strong> Тут ви можете побачити статус усіх активних AI-співробітників компанії.</li>
                <li><strong>Головний Агент (God Agent):</strong> Координує роботу всіх інших агентів.</li>
                <li>
                  <strong>Взаємодія з Агентами:</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>У кожному модулі системи доступна бічна панель <strong>AI Agent Console</strong>.</li>
                    <li>Консоль показує активність агента (його цілі, пам'ять та поточні завдання).</li>
                    <li><strong>Командний рядок:</strong> Ви можете відправляти текстові команди безпосередньо агенту через консоль.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
              Модулі CRM
            </h2>
            <div className="ml-10 text-slate-600 dark:text-slate-300 space-y-3">
              <p>Завдяки модульній структурі, CRM підтримує до 21 різного напрямку роботи (наприклад, "Booking", "Livechat" тощо).</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Навігація:</strong> Використовуйте бічне меню для перемикання між модулями.</li>
                <li>Контекст AI-консолі автоматично адаптується до модуля, в якому ви зараз знаходитесь.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">5</span>
              Додаткові можливості та безпека
            </h2>
            <div className="ml-10 text-slate-600 dark:text-slate-300 space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Моніторинг:</strong> Система кожні 5 хвилин автоматично перевіряє "серцебиття" агентів. Якщо виникає помилка, адміністратор отримує сповіщення.</li>
                <li><strong>Оформлення:</strong> Адмін-панель використовує сучасний дизайн з елементами Glassmorphism та підтримує загальну стилістику компанії.</li>
              </ul>
              
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-sm">У разі виникнення технічних проблем звертайтеся до адміністратора системи або розробників.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
