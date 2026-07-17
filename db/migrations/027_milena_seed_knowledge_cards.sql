-- Мілена / Міленіум — стартовий набір карток знань (12 тем).
-- ВАЖЛИВО: жодна картка тут не має status='actual' і жодна не містить
-- вигаданих цін/строків/держзборів — усе, чого я не знаю напевно, позначено
-- як "уточнюється на консультації". Це навмисно: бот, побудований на цих
-- картках, завжди ескалює до людини (Мілени/Олександра), поки власник не
-- підтвердить конкретну картку реальними цінами й не позначить її 'actual'.
-- Ідемпотентно: ON CONFLICT DO NOTHING на всіх INSERT.

-- ── 1. Карта побиту — тимчасова (на основі роботи) ─────────────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000001', 'Карта побиту', 'Тимчасова (на основі роботи)', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Перше звернення', 'Питає про тимчасову карту побиту на основі роботи',
   ARRAY['карта побиту','тимчасова карта побиту','karta pobytu czasowego','дозвіл на проживання','вид на жительство','посвідка на побит','робоча карта побиту','карту побиту через роботу'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('residence_temp_001', '00000000-0000-4000-8000-000000000001', 'Перше звернення', 'Питає про тимчасову карту побиту на основі роботи',
   ARRAY['підстава подачі','чи є роботодавець','чи вже подано документи','воєводський ужонд'],
   $$Тимчасова карта побиту на основі роботи оформлюється через воєводський ужонд за місцем проживання. Точний перелік документів і вартість супроводу залежать від вашої ситуації.$$,
   $$Для оформлення тимчасової карти побиту на основі працевлаштування зазвичай потрібні: чинний закордонний паспорт, документи, що підтверджують підставу перебування (наприклад трудовий договір), підтвердження джерела доходу та місця проживання. Наша команда аналізує ситуацію, готує повний пакет документів, супроводжує подачу та контролює хід справи в ужонді.$$,
   $$Остаточний перелік документів і вартість супроводу визначаються індивідуально після безкоштовної консультації — тут наведено лише загальну інформацію, ціни та строки уточнюються окремо.$$,
   $$На якій підставі плануєте подавати документи (робота, навчання, возз'єднання сім'ї) і чи вже було звернення до ужонду раніше?$$,
   'offer_consultation',
   ARRAY['відмова в минулому','судове оскарження','прострочений термін перебування'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Карта побиту — постійна ──────────────────────────────────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000002', 'Карта побиту', 'Постійна', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'Перше звернення', 'Питає про постійну карту побиту',
   ARRAY['постійна карта побиту','karta pobytu stalego','сталий побит','постійний вид на жительство'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('residence_perm_001', '00000000-0000-4000-8000-000000000002', 'Перше звернення', 'Питає про постійну карту побиту',
   ARRAY['скільки років проживання в Польщі','підстава для постійного побиту','чи є перерви у проживанні'],
   $$Постійна карта побиту доступна після певного періоду безперервного легального проживання в Польщі за визначеною підставою. Точні умови залежать від вашої ситуації.$$,
   $$Право на постійний побит зазвичай пов'язане з тривалістю та безперервністю легального перебування, а також підставою проживання. Ми аналізуємо вашу історію перебування, перевіряємо відповідність умовам і готуємо повний пакет документів для подачі.$$,
   $$Точні строки проживання, необхідні для постійного побиту, та повний перелік документів уточнюються на консультації — законодавство і практика ужондів можуть відрізнятися залежно від підстави.$$,
   $$Скільки років ви безперервно проживаєте в Польщі і на якій підставі (робота, навчання, шлюб)?$$,
   'offer_consultation',
   ARRAY['перерви у легальному перебуванні','судове оскарження','відмова в минулому'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 3. Карта побиту — возз'єднання сім'ї / на основі шлюбу ─────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000003', 'Карта побиту', 'Возз''єднання сім''ї / на основі шлюбу', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'Перше звернення', 'Питає про карту побиту через возз''єднання сім''ї чи шлюб',
   ARRAY['возз''єднання сім''ї','карта побиту на основі шлюбу','карта побиту через дружину','карта побиту через чоловіка','сімейна карта побиту','łączenie rodzin'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('residence_family_001', '00000000-0000-4000-8000-000000000003', 'Перше звернення', 'Питає про карту побиту через возз''єднання сім''ї чи шлюб',
   ARRAY['громадянство подружжя','чи зареєстрований шлюб в Польщі','чи є діти','підстава перебування другого з подружжя'],
   $$Карта побиту на основі возз'єднання сім'ї чи шлюбу залежить від громадянства й статусу другого з подружжя. Уточнимо деталі на консультації.$$,
   $$Процедура і перелік документів відрізняються залежно від того, чи другий з подружжя є громадянином Польщі/ЄС, чи також іноземцем з певним статусом перебування. Зазвичай потрібні: свідоцтво про шлюб, документи, що підтверджують спільне проживання, підтвердження доходу приймаючої сторони.$$,
   $$Конкретна процедура (возз'єднання сім'ї чи інша підстава) визначається після аналізу громадянства і статусу обох сторін — уточнюється на консультації.$$,
   $$Яке громадянство має ваш(а) чоловік/дружина, і чи шлюб уже зареєстрований у Польщі?$$,
   'offer_consultation',
   ARRAY['один з подружжя неповнолітній','спір між подружжям','сумніви установи щодо дійсності шлюбу'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 4. Нотаріус — загальна довіреність ──────────────────────────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000004', 'Нотаріус', 'Загальна довіреність (представництво в держустановах)', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000004', '00000000-0000-4000-8000-000000000004', 'Перше звернення', 'Питає про загальну довіреність',
   ARRAY['загальна довіреність','довіреність на держустанови','довіреність для представництва','pełnomocnictwo ogólne','потрібна довіреність'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('poa_general_001', '00000000-0000-4000-8000-000000000004', 'Перше звернення', 'Питає про загальну довіреність',
   ARRAY['країна використання документа','конкретна дія','дані довірителя','дані представника'],
   $$Для загальної довіреності на представництво в державних установах потрібні паспортні дані сторін і опис дій, які представник має право виконувати.$$,
   $$Базово потрібно надати закордонний паспорт довірителя, дані представника, а також чіткий опис дій, на які видається довіреність (наприклад подача документів, отримання довідок). Ми готуємо текст довіреності та організовуємо посвідчення у нотаріуса.$$,
   $$Точний зміст довіреності залежить від конкретної установи, в якій вона буде використовуватися — уточнюється індивідуально.$$,
   $$Для яких саме дій потрібна довіреність, і в якій країні вона буде використовуватися?$$,
   'collect_documents',
   ARRAY['декілька довірителів з різними інтересами','спір між сторонами'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000004', '00000000-0000-4000-8000-000000000004', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000004', '00000000-0000-4000-8000-000000000004', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 5. Нотаріус — довіреність на нерухомість (готовий приклад з ТЗ) ────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000005', 'Нотаріус', 'Довіреність на нерухомість', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000005', '00000000-0000-4000-8000-000000000005', 'Збір документів', 'Які документи потрібні',
   ARRAY['які документи','що треба для довіреності','довіреність на квартиру','хочу продати квартиру через представника','довіреність на нерухомість'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('notary_real_estate_documents_001', '00000000-0000-4000-8000-000000000005', 'Збір документів', 'Які документи потрібні',
   ARRAY['країна використання документа','вид нерухомості','дані довірителя','дані представника','конкретна дія'],
   $$Для підготовки довіреності на нерухомість потрібні паспортні дані сторін, ідентифікаційні коди та дані майна.$$,
   $$Базово потрібно надати закордонний паспорт довірителя, документи представника, ідентифікаційні коди, адресу та характеристики майна, а також опис дії, яку представник повинен виконати.$$,
   $$Остаточний перелік залежить від виду угоди та вимог установи, у якій документ буде використано.$$,
   $$У якій країні буде використовуватися довіреність і яку саме дію має виконати представник?$$,
   'collect_documents',
   ARRAY['спадкова справа','декілька власників','неповнолітній власник','спір між сторонами'],
   'needs_legal_review', 'KeyCRM historical templates')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000005', '00000000-0000-4000-8000-000000000005', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000005', '00000000-0000-4000-8000-000000000005', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 6. Нотаріус — довіреність на авто ───────────────────────────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000006', 'Нотаріус', 'Довіреність на авто', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000006', '00000000-0000-4000-8000-000000000006', 'Перше звернення', 'Питає про довіреність на автомобіль',
   ARRAY['довіреність на авто','довіреність на автомобіль','pełnomocnictwo na samochód','довіреність продати авто','довіреність керувати авто'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('poa_vehicle_001', '00000000-0000-4000-8000-000000000006', 'Перше звернення', 'Питає про довіреність на автомобіль',
   ARRAY['країна реєстрації авто','конкретна дія (продаж, керування, реєстрація)','дані довірителя','дані представника'],
   $$Для довіреності на автомобіль потрібні дані власника й представника, а також чітко визначена дія — продаж, керування чи реєстраційні дії.$$,
   $$Зазвичай потрібно надати документи на автомобіль, паспортні дані власника та представника, і чітко вказати обсяг повноважень (наприклад лише керування, або також право продажу).$$,
   $$Точний перелік документів залежить від країни реєстрації авто та конкретної дії — уточнюється на консультації.$$,
   $$Яка саме дія потрібна — керування, продаж чи реєстраційні питання, і в якій країні зареєстровано авто?$$,
   'collect_documents',
   ARRAY['авто в заставі чи кредиті','спір між співвласниками'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000006', '00000000-0000-4000-8000-000000000006', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000006', '00000000-0000-4000-8000-000000000006', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 7. Нотаріус — засвідчення перекладу/копії документів ───────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000007', 'Нотаріус', 'Засвідчення перекладу/копії документів', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000007', '00000000-0000-4000-8000-000000000007', 'Перше звернення', 'Питає про засвідчення перекладу чи копії',
   ARRAY['засвідчення перекладу','нотаріальна копія','засвідчена копія документа','переклад з засвідченням','потрібен присяжний переклад'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('notary_translation_001', '00000000-0000-4000-8000-000000000007', 'Перше звернення', 'Питає про засвідчення перекладу чи копії',
   ARRAY['який документ','мова перекладу','де буде використано документ'],
   $$Засвідчення перекладу чи копії документа залежить від типу документа й того, де він буде використовуватись.$$,
   $$Ми допомагаємо організувати присяжний переклад та нотаріальне засвідчення копій документів для використання в польських чи українських установах.$$,
   $$Вартість і строки залежать від обсягу документа та мовної пари — уточнюється на консультації.$$,
   $$Який саме документ потрібно перекласти/засвідчити, і для якої установи він призначений?$$,
   'collect_documents',
   ARRAY[]::text[],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000007', '00000000-0000-4000-8000-000000000007', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000007', '00000000-0000-4000-8000-000000000007', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 8. Сімейні справи — реєстрація шлюбу в Польщі ───────────────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000008', 'Сімейні справи', 'Реєстрація шлюбу в Польщі', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000008', '00000000-0000-4000-8000-000000000008', 'Перше звернення', 'Питає про одруження в Польщі',
   ARRAY['одруження в Польщі','реєстрація шлюбу','шлюб з іноземцем','хочу одружитися в польщі','zawarcie małżeństwa'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('marriage_register_001', '00000000-0000-4000-8000-000000000008', 'Перше звернення', 'Питає про одруження в Польщі',
   ARRAY['громадянство обох сторін','чи були попередні шлюби','чи є документ про можливість укладення шлюбу'],
   $$Реєстрація шлюбу в Польщі з іноземцем зазвичай вимагає документа про відсутність перешкод для шлюбу за законодавством вашої країни; за відсутності такого документа може знадобитися дозвіл суду.$$,
   $$Процедура залежить від громадянства обох сторін і наявності документа, що підтверджує можливість укладення шлюбу. Якщо такого документа немає, альтернативний шлях — звернення до польського суду за дозволом. Ми супроводжуємо весь процес: аналіз ситуації, підготовку документів, комунікацію з реєстром актів цивільного стану (USC).$$,
   $$Точний перелік документів і процедура визначаються після аналізу громадянства сторін та наявних документів — уточнюється на консультації.$$,
   $$Яке громадянство має кожна сторона, і чи були попередні шлюби в когось із вас?$$,
   'offer_consultation',
   ARRAY['один з наречених неповнолітній','попередній шлюб не розірвано офіційно'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000008', '00000000-0000-4000-8000-000000000008', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000008', '00000000-0000-4000-8000-000000000008', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 9. Сімейні справи — легалізація (транскрипція) шлюбу за кордоном ───────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-000000000009', 'Сімейні справи', 'Легалізація шлюбу, укладеного за кордоном', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-000000000009', '00000000-0000-4000-8000-000000000009', 'Перше звернення', 'Питає про транскрипцію/легалізацію шлюбу',
   ARRAY['легалізація шлюбу','транскрипція шлюбу','визнання шлюбу в Польщі','шлюб укладений за кордоном','transkrypcja aktu małżeństwa'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('marriage_legalize_001', '00000000-0000-4000-8000-000000000009', 'Перше звернення', 'Питає про транскрипцію/легалізацію шлюбу',
   ARRAY['країна реєстрації шлюбу','чи є апостиль/легалізація на документі','чи потрібен переклад'],
   $$Шлюб, укладений за кордоном, для визнання в Польщі зазвичай потребує транскрипції свідоцтва про шлюб до польського реєстру.$$,
   $$Транскрипція передбачає подання іноземного свідоцтва про шлюб (з апостилем/легалізацією та присяжним перекладом за потреби) до відповідного органу реєстрації актів цивільного стану в Польщі.$$,
   $$Вимоги щодо апостилю/легалізації залежать від країни реєстрації шлюбу — уточнюється індивідуально.$$,
   $$У якій країні зареєстровано шлюб, і чи є на свідоцтві апостиль або консульська легалізація?$$,
   'collect_documents',
   ARRAY['документи відсутні або втрачені','розбіжності в даних сторін'],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-000000000009', '00000000-0000-4000-8000-000000000009', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-000000000009', '00000000-0000-4000-8000-000000000009', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 10. Сімейні справи — зміна прізвища ─────────────────────────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-00000000000a', 'Сімейні справи', 'Зміна прізвища', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-00000000000a', '00000000-0000-4000-8000-00000000000a', 'Перше звернення', 'Питає про зміну прізвища',
   ARRAY['зміна прізвища','зміна прізвища після шлюбу','зміна прізвища після розлучення','zmiana nazwiska'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('name_change_001', '00000000-0000-4000-8000-00000000000a', 'Перше звернення', 'Питає про зміну прізвища',
   ARRAY['причина зміни (шлюб/розлучення/інше)','чи потрібна зміна в документах, виданих в Україні чи Польщі'],
   $$Зміна прізвища після шлюбу чи розлучення оформлюється через відповідний реєстр актів цивільного стану, залежно від країни, де відбулася подія.$$,
   $$Процедура і перелік документів відрізняються залежно від того, чи потрібно оновити українські документи, польські, чи обидва. Ми допомагаємо визначити правильний порядок дій та супроводжуємо оформлення.$$,
   $$Конкретний порядок дій залежить від вашої ситуації — уточнюється на консультації.$$,
   $$Прізвище змінюється у зв'язку зі шлюбом чи розлученням, і які документи потрібно оновити — українські, польські чи обидва?$$,
   'offer_consultation',
   ARRAY[]::text[],
   'needs_legal_review', 'seed — потребує підтвердження реальними цінами від Мілени')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-00000000000a', '00000000-0000-4000-8000-00000000000a', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-00000000000a', '00000000-0000-4000-8000-00000000000a', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── 11. Сімейні справи — розлучення (складна справа, агресивний handoff) ───
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-00000000000b', 'Сімейні справи', 'Розлучення', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-00000000000b', '00000000-0000-4000-8000-00000000000b', 'Перше звернення', 'Питає про розлучення',
   ARRAY['розлучення','хочу розлучитися','rozwód','мені потрібне розлучення'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('divorce_001', '00000000-0000-4000-8000-00000000000b', 'Перше звернення', 'Питає про розлучення',
   ARRAY['де зареєстровано шлюб','чи є діти','чи згодні обидва на розлучення'],
   $$Розлучення — це справа, яка потребує індивідуального юридичного аналізу. Одразу передаємо ваш запит спеціалісту.$$,
   $$Питання розлучення (особливо за наявності дітей, майнових питань чи розбіжностей між подружжям) вимагає детального юридичного аналізу конкретної ситуації, тому ми одразу залучаємо до розмови нашого спеціаліста.$$,
   $$Загальна інформація тут не замінює юридичну консультацію — деталі вашої справи розгляне спеціаліст.$$,
   NULL,
   NULL,
   ARRAY['будь-яке звернення щодо розлучення'],
   'needs_legal_review', 'seed — навмисно завжди ескалює, складна справа')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-00000000000b', '00000000-0000-4000-8000-00000000000b', 'Перше звернення', ARRAY['phone_pl'], ARRAY['full_name_latin','preferred_contact'], 'Кваліфікація', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-00000000000b', '00000000-0000-4000-8000-00000000000b', 'Складна справа — розлучення', 'Олександр', 'urgent')
ON CONFLICT (id) DO NOTHING;

-- ── 12. Загальне — консультація / "не знаю з чого почати" ──────────────────
INSERT INTO services (id, direction, subservice, status) VALUES
  ('00000000-0000-4000-8000-00000000000c', 'Загальне', 'Консультація / не знаю з чого почати', 'needs_legal_review')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intents (id, service_id, stage, intent_label, trigger_phrases) VALUES
  ('00000000-0000-4001-8000-00000000000c', '00000000-0000-4000-8000-00000000000c', 'Перше звернення', 'Не знає з чого почати, просить консультацію',
   ARRAY['консультація','не знаю з чого почати','потрібна допомога','з чого почати','хочу консультацію'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_cards (id, service_id, stage, intent, required_context, answer_short, answer_full, disclaimer, next_question, next_action, handoff_condition, status, source) VALUES
  ('consultation_general_001', '00000000-0000-4000-8000-00000000000c', 'Перше звернення', 'Не знає з чого почати, просить консультацію',
   ARRAY[]::text[],
   $$Ми з радістю допоможемо визначити, яка послуга підходить саме для вашої ситуації — розкажіть коротко, з чим ви зіткнулися.$$,
   $$Компас Міграції супроводжує мігрантів у питаннях легалізації, нотаріальних дій та сімейних справ у Польщі. Щоб запропонувати найкращий варіант, розкажіть коротко про вашу ситуацію, і ми зорієнтуємо вас або одразу з'єднаємо зі спеціалістом.$$,
   NULL,
   $$Розкажіть, будь ласка, коротко, з якою ситуацією ви зіткнулися?$$,
   'offer_consultation',
   ARRAY[]::text[],
   'needs_legal_review', 'seed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dialog_flows (id, service_id, current_stage, required_fields, optional_fields, next_stage_on_complete, max_clarifying_questions) VALUES
  ('00000000-0000-4002-8000-00000000000c', '00000000-0000-4000-8000-00000000000c', 'Перше звернення', ARRAY[]::text[], ARRAY['phone_pl'], 'Перше звернення', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-00000000000c', '00000000-0000-4000-8000-00000000000c', 'Картка потребує юридичної перевірки', 'Мілена', 'normal')
ON CONFLICT (id) DO NOTHING;

-- ── Фолбек-правила передачі (service_id = NULL) ─────────────────────────────
INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-0000000000fd', NULL, 'Картка потребує юридичної перевірки (загальний фолбек)', 'Мілена', 'urgent')
ON CONFLICT (id) DO NOTHING;

INSERT INTO handoff_rules (id, service_id, condition_label, handoff_to, priority) VALUES
  ('00000000-0000-4003-8000-0000000000fe', NULL, 'Складна справа (загальний фолбек)', 'Олександр', 'urgent')
ON CONFLICT (id) DO NOTHING;
