"use client";
import React, { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const TRANSLATIONS = {
  uk: {
    title: "📜 Доктрина Kompas Migracji",
    preambleTitle: "Преамбула",
    preamble: [
      "Ми живемо в епоху великого переселення народів.",
      "Мільйони людей залишили свої домівки не тому, що хотіли пригод, а тому, що життя змусило їх шукати безпечніше майбутнє.",
      "Разом із валізами вони перевезли свої сім’ї, мрії, страхи, документи, суперечки, спадщину, відповідальність і надію.",
      "Людина опинилася між двома світами.",
      "Між Україною і Європою.",
      "Між страхом і необхідністю приймати рішення.",
      "Саме тому виник Kompas Migracji.",
      "Не як юридична компанія.",
      "Не як інформаційний портал.",
      "А як система орієнтування."
    ],
    sections: [
      {
        id: "I", title: "Людина важливіша за систему",
        content: ["Закони існують для людей.", "Не люди — для законів.", "Наша робота починається там, де людина перестає розуміти, що відбувається.", "Ми повертаємо ясність."]
      },
      {
        id: "II", title: "Ми проводимо через хаос",
        content: ["Ми не ведемо людей за руку.", "Ми не створюємо залежності.", "Ми показуємо карту.", "Наша мета — щоб людина могла пройти шлях самостійно."]
      },
      {
        id: "III", title: "Ми перекладаємо складне людською мовою",
        content: ["Складність не є ознакою професіоналізму.", "Ми пояснюємо так, щоб зрозуміла людина без юридичної освіти."]
      },
      {
        id: "IV", title: "Ми шукаємо першопричини",
        content: ["Нас цікавить не лише питання:", "“Що сталося?”", "Нас цікавить:", "Чому?", "Як?", "Що буде далі?", "Які правила цієї гри?"]
      },
      {
        id: "V", title: "Ми дивимося на кілька ходів уперед",
        content: ["Стратег не пророкує.", "Стратег бачить закономірності.", "Ми допомагаємо людям ухвалювати рішення, які залишаться правильними через роки."]
      },
      {
        id: "VI", title: "Ми захищаємо справедливість",
        content: ["Ми не займаємо сторону конфлікту.", "Ми займаємо сторону справедливості.", "Ми не розпалюємо ненависть.", "Ми шукаємо рішення."]
      },
      {
        id: "VII", title: "Ми не торгуємо страхом",
        content: ["Страх може привернути увагу.", "Але довіру будує лише чесність.", "Ми не перебільшуємо ризики.", "Не обіцяємо неможливого.", "Не створюємо паніку."]
      },
      {
        id: "VIII", title: "Ми говоримо мовою історій",
        content: ["Люди не живуть статтями законів.", "Вони живуть власними історіями.", "Тому ми починаємо не з кодексів.", "Ми починаємо з людини."]
      },
      {
        id: "IX", title: "Ми ставимо питання, які люди бояться поставити",
        content: ["Наше завдання — озвучити те, про що мовчать.", "Поставити незручне питання.", "Знайти чесну відповідь.", "Навіть якщо вона складна."]
      },
      {
        id: "X", title: "Ми залишаємо людині шлях",
        content: ["Після кожної розмови людина повинна знати:", "Що робити сьогодні.", "Що зробити завтра.", "Куди звернутися.", "Що перевірити.", "Якого рішення уникнути."]
      },
      {
        id: "XI", title: "Ми будуємо культуру відповідальності",
        content: ["Свобода без відповідальності руйнує.", "Відповідальність без свободи пригнічує.", "Ми шукаємо рівновагу."]
      },
      {
        id: "XII", title: "Наш метод",
        content: ["Кожне питання проходить через однакові етапи.", "1. Побачити проблему.", "2. Зрозуміти її причину.", "3. Побачити систему.", "4. Знайти правила.", "5. Запропонувати рішення.", "6. Пояснити його простою мовою."]
      },
      {
        id: "XIII", title: "Наш голос",
        content: ["Ми не кричимо.", "Ми не повчаємо.", "Ми не принижуємо.", "Ми говоримо спокійно.", "Тому що впевненість не потребує гучності."]
      },
      {
        id: "XIV", title: "Наш символ",
        content: ["Компас показує не мету.", "Компас показує напрямок.", "Шлях людина проходить сама.", "Ми лише допомагаємо не заблукати."]
      }
    ]
  },
  ru: {
    title: "📜 Доктрина Kompas Migracji",
    preambleTitle: "Преамбула",
    preamble: [
      "Мы живем в эпоху великого переселения народов.",
      "Миллионы людей покинули свои дома не потому, что искали приключений, а потому, что жизнь заставила их искать более безопасное будущее.",
      "Вместе с чемоданами они перевезли свои семьи, мечты, страхи, документы, споры, наследие, ответственность и надежду.",
      "Человек оказался между двумя мирами.",
      "Между Украиной и Европой.",
      "Между страхом и необходимостью принимать решения.",
      "Именно поэтому возник Kompas Migracji.",
      "Не как юридическая компания.",
      "Не как информационный портал.",
      "А как система ориентирования."
    ],
    sections: [
      { id: "I", title: "Человек важнее системы", content: ["Законы существуют для людей.", "Не люди — для законов.", "Наша работа начинается там, где человек перестает понимать, что происходит.", "Мы возвращаем ясность."] },
      { id: "II", title: "Мы проводим через хаос", content: ["Мы не ведем людей за руку.", "Мы не создаем зависимости.", "Мы показываем карту.", "Наша цель — чтобы человек мог пройти путь самостоятельно."] },
      { id: "III", title: "Мы переводим сложное на человеческий язык", content: ["Сложность не является признаком профессионализма.", "Мы объясняем так, чтобы понял человек без юридического образования."] },
      { id: "IV", title: "Мы ищем первопричины", content: ["Нас интересует не только вопрос:", "“Что произошло?”", "Нас интересует:", "Почему?", "Как?", "Что будет дальше?", "Каковы правила этой игры?"] },
      { id: "V", title: "Мы смотрим на несколько ходов вперед", content: ["Стратег не пророчествует.", "Стратег видит закономерности.", "Мы помогаем людям принимать решения, которые останутся правильными спустя годы."] },
      { id: "VI", title: "Мы защищаем справедливость", content: ["Мы не занимаем сторону конфликта.", "Мы занимаем сторону справедливости.", "Мы не разжигаем ненависть.", "Мы ищем решения."] },
      { id: "VII", title: "Мы не торгуем страхом", content: ["Страх может привлечь внимание.", "Но доверие строит только честность.", "Мы не преувеличиваем риски.", "Не обещаем невозможного.", "Не создаем панику."] },
      { id: "VIII", title: "Мы говорим на языке историй", content: ["Люди не живут статьями законов.", "Они живут собственными историями.", "Поэтому мы начинаем не с кодексов.", "Мы начинаем с человека."] },
      { id: "IX", title: "Мы задаем вопросы, которые люди боятся задать", content: ["Наша задача — озвучить то, о чем молчат.", "Задать неудобный вопрос.", "Найти честный ответ.", "Даже если он сложный."] },
      { id: "X", title: "Мы оставляем человеку путь", content: ["После каждого разговора человек должен знать:", "Что делать сегодня.", "Что сделать завтра.", "Куда обратиться.", "Что проверить.", "Какого решения избежать."] },
      { id: "XI", title: "Мы строим культуру ответственности", content: ["Свобода без ответственности разрушает.", "Ответственность без свободы подавляет.", "Мы ищем равновесие."] },
      { id: "XII", title: "Наш метод", content: ["Каждый вопрос проходит через одинаковые этапы.", "1. Увидеть проблему.", "2. Понять ее причину.", "3. Увидеть систему.", "4. Найти правила.", "5. Предложить решение.", "6. Объяснить его простым языком."] },
      { id: "XIII", title: "Наш голос", content: ["Мы не кричим.", "Мы не поучаем.", "Мы не унижаем.", "Мы говорим спокойно.", "Потому что уверенность не нуждается в громкости."] },
      { id: "XIV", title: "Наш символ", content: ["Компас показывает не цель.", "Компас показывает направление.", "Путь человек проходит сам.", "Мы лишь помогаем не заблудиться."] }
    ]
  },
  pl: {
    title: "📜 Doktryna Kompas Migracji",
    preambleTitle: "Preambuła",
    preamble: [
      "Żyjemy w epoce wielkiej wędrówki ludów.",
      "Miliony ludzi opuściły swoje domy nie dlatego, że szukały przygód, ale dlatego, że życie zmusiło ich do szukania bezpieczniejszej przyszłości.",
      "Wraz z walizkami przewieźli swoje rodziny, marzenia, lęki, dokumenty, spory, dziedzictwo, odpowiedzialność i nadzieję.",
      "Człowiek znalazł się między dwoma światami.",
      "Między Ukrainą a Europą.",
      "Między strachem a koniecznością podejmowania decyzji.",
      "Właśnie dlatego powstał Kompas Migracji.",
      "Nie jako firma prawnicza.",
      "Nie jako portal informacyjny.",
      "Ale jako system orientacji."
    ],
    sections: [
      { id: "I", title: "Człowiek jest ważniejszy niż system", content: ["Prawa istnieją dla ludzi.", "Nie ludzie dla praw.", "Nasza praca zaczyna się tam, gdzie człowiek przestaje rozumieć, co się dzieje.", "Przywracamy jasność."] },
      { id: "II", title: "Przeprowadzamy przez chaos", content: ["Nie prowadzimy ludzi za rękę.", "Nie tworzymy zależności.", "Pokazujemy mapę.", "Naszym celem jest, aby człowiek mógł przejść drogę samodzielnie."] },
      { id: "III", title: "Tłumaczymy trudne na język ludzki", content: ["Złożoność nie jest oznaką profesjonalizmu.", "Tłumaczymy tak, aby zrozumiał człowiek bez wykształcenia prawniczego."] },
      { id: "IV", title: "Szukamy przyczyn pierwotnych", content: ["Interesuje nas nie tylko pytanie:", "“Co się stało?”", "Interesuje nas:", "Dlaczego?", "Jak?", "Co będzie dalej?", "Jakie są zasady tej gry?"] },
      { id: "V", title: "Patrzymy kilka ruchów do przodu", content: ["Strateg nie prorokuje.", "Strateg widzi prawidłowości.", "Pomagamy ludziom podejmować decyzje, które pozostaną właściwe przez lata."] },
      { id: "VI", title: "Bronimy sprawiedliwości", content: ["Nie opowiadamy się po żadnej ze stron konfliktu.", "Stoimy po stronie sprawiedliwości.", "Nie podsycanie nienawiści.", "Szukamy rozwiązań."] },
      { id: "VII", title: "Nie handlujemy strachem", content: ["Strach może przyciągnąć uwagę.", "Ale zaufanie buduje tylko uczciwość.", "Nie wyolbrzymiamy ryzyk.", "Nie obiecujemy niemożliwego.", "Nie tworzymy paniki."] },
      { id: "VIII", title: "Mówimy językiem historii", content: ["Ludzie nie żyją artykułami praw.", "Żyją własnymi historiami.", "Dlatego nie zaczynamy od kodeksów.", "Zaczynamy od człowieka."] },
      { id: "IX", title: "Zadajemy pytania, których ludzie boją się zadać", content: ["Naszym zadaniem jest nagłośnienie tego, o czym się milczy.", "Zadać niewygodne pytanie.", "Znaleźć szczerą odpowiedź.", "Nawet jeśli jest trudna."] },
      { id: "X", title: "Zostawiamy człowiekowi drogę", content: ["Po każdej rozmowie człowiek musi wiedzieć:", "Co robić dzisiaj.", "Co zrobić jutro.", "Gdzie się zwrócić.", "Co sprawdzić.", "Jakiej decyzji unikać."] },
      { id: "XI", title: "Budujemy kulturę odpowiedzialności", content: ["Wolność bez odpowiedzialności niszczy.", "Odpowiedzialność bez wolności przytłacza.", "Szukamy równowagi."] },
      { id: "XII", title: "Nasza metoda", content: ["Każde pytanie przechodzi przez te same etapy.", "1. Zobaczyć problem.", "2. Zrozumieć jego przyczynę.", "3. Zobaczyć system.", "4. Znaleźć zasady.", "5. Zaproponować rozwiązanie.", "6. Wyjaśnić to prostym językiem."] },
      { id: "XIII", title: "Nasz głos", content: ["Nie krzyczymy.", "Nie pouczamy.", "Nie poniżamy.", "Mówimy spokojnie.", "Ponieważ pewność siebie nie wymaga głośności."] },
      { id: "XIV", title: "Nasz symbol", content: ["Kompas nie pokazuje celu.", "Kompas pokazuje kierunek.", "Człowiek przechodzi drogę sam.", "My tylko pomagamy nie zabłądzić."] }
    ]
  },
  en: {
    title: "📜 Doctrine of Kompas Migracji",
    preambleTitle: "Preamble",
    preamble: [
      "We live in an era of great human migration.",
      "Millions of people have left their homes not because they wanted adventure, but because life forced them to seek a safer future.",
      "Along with their suitcases, they brought their families, dreams, fears, documents, disputes, heritage, responsibilities, and hope.",
      "A person finds themselves between two worlds.",
      "Between Ukraine and Europe.",
      "Between fear and the need to make decisions.",
      "That is why Kompas Migracji was created.",
      "Not as a law firm.",
      "Not as an information portal.",
      "But as an orientation system."
    ],
    sections: [
      { id: "I", title: "People are more important than the system", content: ["Laws exist for people.", "Not people for laws.", "Our work begins where a person stops understanding what is happening.", "We restore clarity."] },
      { id: "II", title: "We guide through chaos", content: ["We do not hold people by the hand.", "We do not create dependency.", "We show the map.", "Our goal is for a person to walk the path on their own."] },
      { id: "III", title: "We translate the complex into human language", content: ["Complexity is not a sign of professionalism.", "We explain things so that a person without legal education can understand."] },
      { id: "IV", title: "We look for root causes", content: ["We are interested not only in the question:", "“What happened?”", "We are interested in:", "Why?", "How?", "What happens next?", "What are the rules of this game?"] },
      { id: "V", title: "We look several moves ahead", content: ["A strategist does not prophesize.", "A strategist sees patterns.", "We help people make decisions that will remain right for years to come."] },
      { id: "VI", title: "We defend justice", content: ["We do not take sides in a conflict.", "We take the side of justice.", "We do not incite hatred.", "We look for solutions."] },
      { id: "VII", title: "We do not trade in fear", content: ["Fear can attract attention.", "But trust is built only on honesty.", "We do not exaggerate risks.", "We do not promise the impossible.", "We do not create panic."] },
      { id: "VIII", title: "We speak the language of stories", content: ["People do not live by articles of law.", "They live by their own stories.", "That is why we do not start with codes.", "We start with the person."] },
      { id: "IX", title: "We ask the questions people are afraid to ask", content: ["Our task is to voice what is kept silent.", "To ask an uncomfortable question.", "To find an honest answer.", "Even if it is difficult."] },
      { id: "X", title: "We leave a person with a path", content: ["After every conversation, a person must know:", "What to do today.", "What to do tomorrow.", "Where to turn.", "What to check.", "What decision to avoid."] },
      { id: "XI", title: "We build a culture of responsibility", content: ["Freedom without responsibility destroys.", "Responsibility without freedom oppresses.", "We seek balance."] },
      { id: "XII", title: "Our method", content: ["Every question goes through the same stages.", "1. See the problem.", "2. Understand its cause.", "3. See the system.", "4. Find the rules.", "5. Propose a solution.", "6. Explain it in plain language."] },
      { id: "XIII", title: "Our voice", content: ["We do not shout.", "We do not preach.", "We do not humiliate.", "We speak calmly.", "Because confidence does not need volume."] },
      { id: "XIV", title: "Our symbol", content: ["A compass does not point to the destination.", "A compass points the direction.", "The person walks the path themselves.", "We only help them not to get lost."] }
    ]
  },
  rom: {
    title: "📜 Doctrina Kompas Migracji",
    preambleTitle: "Preambul",
    preamble: [
      "Trăim într-o epocă a marii migrații a popoarelor.",
      "Milioane de oameni și-au părăsit casele nu pentru că voiau aventură, ci pentru că viața i-a forțat să caute un viitor mai sigur.",
      "Împreună cu valizele, și-au adus familiile, visele, fricile, documentele, disputele, moștenirea, responsabilitățile și speranța.",
      "Un om se află între două lumi.",
      "Între Ucraina și Europa.",
      "Între frică și nevoia de a lua decizii.",
      "De aceea a apărut Kompas Migracji.",
      "Nu ca o firmă de avocatură.",
      "Nu ca un portal informațional.",
      "Ci ca un sistem de orientare."
    ],
    sections: [
      { id: "I", title: "Omul este mai important decât sistemul", content: ["Legile există pentru oameni.", "Nu oamenii pentru legi.", "Munca noastră începe acolo unde un om încetează să mai înțeleagă ce se întâmplă.", "Restabilim claritatea."] },
      { id: "II", title: "Conducem prin haos", content: ["Nu ținem oamenii de mână.", "Nu creăm dependență.", "Arătăm harta.", "Scopul nostru este ca omul să poată parcurge drumul singur."] },
      { id: "III", title: "Traducem complexul în limbaj uman", content: ["Complexitatea nu este un semn de profesionalism.", "Explicăm în așa fel încât un om fără educație juridică să poată înțelege."] },
      { id: "IV", title: "Căutăm cauzele fundamentale", content: ["Ne interesează nu doar întrebarea:", "“Ce s-a întâmplat?”", "Ne interesează:", "De ce?", "Cum?", "Ce se întâmplă mai departe?", "Care sunt regulile acestui joc?"] },
      { id: "V", title: "Privim cu câteva mutări înainte", content: ["Un strateg nu profetizează.", "Un strateg vede tipare.", "Ajutăm oamenii să ia decizii care vor rămâne corecte peste ani."] },
      { id: "VI", title: "Apărăm dreptatea", content: ["Nu luăm partea nimănui într-un conflict.", "Suntem de partea dreptății.", "Nu instigăm la ură.", "Căutăm soluții."] },
      { id: "VII", title: "Nu facem comerț cu frica", content: ["Frica poate atrage atenția.", "Dar încrederea se construiește doar pe onestitate.", "Nu exagerăm riscurile.", "Nu promitem imposibilul.", "Nu creăm panică."] },
      { id: "VIII", title: "Vorbim limba poveștilor", content: ["Oamenii nu trăiesc prin articole de lege.", "Ei trăiesc prin propriile povești.", "De aceea nu începem cu codurile.", "Începem cu persoana."] },
      { id: "IX", title: "Punem întrebările pe care oamenii se tem să le pună", content: ["Sarcina noastră este să dăm voce a ceea ce se tace.", "Să punem o întrebare incomodă.", "Să găsim un răspuns sincer.", "Chiar dacă este dificil."] },
      { id: "X", title: "Lăsăm omului un drum", content: ["După fiecare conversație, omul trebuie să știe:", "Ce să facă astăzi.", "Ce să facă mâine.", "Unde să se adreseze.", "Ce să verifice.", "Ce decizie să evite."] },
      { id: "XI", title: "Construim o cultură a responsabilității", content: ["Libertatea fără responsabilitate distruge.", "Responsabilitatea fără libertate oprimă.", "Căutăm echilibrul."] },
      { id: "XII", title: "Metoda noastră", content: ["Fiecare întrebare trece prin aceleași etape.", "1. Să vezi problema.", "2. Să-i înțelegi cauza.", "3. Să vezi sistemul.", "4. Să găsești regulile.", "5. Să propui o soluție.", "6. Să o explici în limbaj simplu."] },
      { id: "XIII", title: "Vocea noastră", content: ["Nu strigăm.", "Nu dăm lecții.", "Nu umilim.", "Vorbim calm.", "Pentru că încrederea în sine nu are nevoie de volum ridicat."] },
      { id: "XIV", title: "Simbolul nostru", content: ["O busolă nu arată destinația.", "O busolă arată direcția.", "Omul parcurge drumul singur.", "Noi doar ajutăm să nu se rătăcească."] }
    ]
  }
};

export default function DoctrinePage({ params: { locale } }: { params: { locale: string } }) {
  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS['uk'];

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500/30">
      <Header />
      
      <main className="pt-32 pb-24 px-4 sm:px-8 max-w-4xl mx-auto relative z-10">
        
        {/* Background Gradients */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-white/5 border border-black/10 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/50 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 hover:opacity-100 transition-opacity backdrop-blur-md" />
            <span className="text-4xl filter drop-shadow-sm">📜</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 pb-2">
            {t.title.replace('📜 ', '')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full opacity-80" />
        </motion.div>

        <div className="space-y-12">
          
          {/* Preamble */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-center uppercase text-gray-400 dark:text-gray-500 letter-spacing-widest text-sm">
              {t.preambleTitle}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
              {t.preamble.map((line, idx) => (
                <p key={idx} className={idx === t.preamble.length - 1 ? 'font-bold text-xl mt-8 text-black dark:text-white' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-center py-8">
            <div className="w-px h-24 bg-gradient-to-b from-black/20 to-transparent dark:from-white/20" />
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 gap-8">
            {t.sections.map((sec, i) => (
              <motion.div 
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-500 rounded-3xl p-8 sm:p-10"
              >
                <div className="absolute top-8 right-8 text-6xl font-black text-black/5 dark:text-white/5 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:text-blue-500/10">
                  {sec.id}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white pr-16">
                  {sec.title}
                </h3>
                
                <div className="space-y-3 relative z-10 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {sec.content.map((line, idx) => (
                    <p key={idx} className={idx === sec.content.length - 1 && sec.content.length > 1 ? 'font-semibold text-gray-900 dark:text-gray-200 mt-6' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
