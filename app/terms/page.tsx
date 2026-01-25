import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="panel rounded-3xl p-8 md:p-10">
        <div className="text-sm text-vss-muted">Последна актуализация: 11 януари 2026 г.</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          Общи условия
        </h1>

        <p className="mt-6 text-vss-muted leading-relaxed">
          Настоящите общи условия уреждат използването на сайта vssauto.net и изпращането на запитвания към VSS Auto.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">1. За нас</h2>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>Наименование: VSS Auto</li>
          <li>Локация: гр. София</li>
          <li>Контакт: <a className="underline decoration-white/20 hover:decoration-white/50" href="mailto:office@vssauto.net">office@vssauto.net</a></li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">2. Какво представлява сайтът</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Сайтът има рекламна и информационна цел. Информацията не представлява обвързващо обещание за конкретен резултат, гаранция или оферта с фиксирана цена.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">3. Запитвания и комуникация</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          При изпращане на запитване се съгласяваш да се свържем с теб по предоставения телефон/имейл за уточняване на детайли. Запитването не създава автоматично договорно отношение.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">4. Услуги и резултати</h2>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>Резултатите от чиптунинг/софтуерни настройки зависят от конкретния автомобил, конфигурация и техническо състояние.</li>
          <li>Преди изпълнение може да се изиска диагностика/проверка и/или допълнителна информация.</li>
          <li>При установени технически проблеми може да предложим отстраняване на причините преди софтуерни промени.</li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">5. Отговорност</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          VSS Auto не носи отговорност за вреди, причинени от некоректна експлоатация, липса на поддръжка, предходни модификации, скрити дефекти или неправилни данни, предоставени от клиента. При реално обслужване конкретните условия се уточняват допълнително.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">6. Интелектуална собственост</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Съдържанието на сайта (текстове, лого, визуални елементи) е собственост на VSS Auto или се използва с право. Не е разрешено копиране и използване без изрично разрешение.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">7. Промени</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Можем да актуализираме тези условия при промени в сайта/услугите. Актуалната версия е публикувана на тази страница.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-vss-accent text-black hover:opacity-90 transition">
            Към началната
          </Link>
          <Link href="/privacy" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition">
            Политика за поверителност
          </Link>
        </div>
      </div>
    </div>
  );
}
