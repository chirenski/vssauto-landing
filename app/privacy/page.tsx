import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="panel rounded-3xl p-8 md:p-10">
        <div className="text-sm text-vss-muted">Последна актуализация: 11 януари 2026 г.</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          Политика за поверителност
        </h1>

        <p className="mt-6 text-vss-muted leading-relaxed">
          Настоящата политика обяснява как VSS Auto ("ние", "нас") обработва лични данни при използване на сайта vssauto.net, включително при изпращане на запитване чрез контактната форма.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">1. Администратор на данни</h2>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>Наименование: VSS Auto</li>
          <li>Локация: гр. София</li>
          <li>Контакт: <a className="underline decoration-white/20 hover:decoration-white/50" href="mailto:office@vssauto.net">office@vssauto.net</a></li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">2. Какви данни събираме</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          При изпращане на запитване можем да обработваме:
        </p>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>Име и фамилия</li>
          <li>Телефон</li>
          <li>Имейл (по желание)</li>
          <li>Информация за автомобила (марка/модел/двигател/година — ако предоставиш)</li>
          <li>Текст на съобщението</li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">3. За какво използваме данните</h2>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>За да отговорим на твоето запитване и да уточним детайли по услугата</li>
          <li>За планиране на посещение (ако е приложимо)</li>
          <li>За подобряване на обслужването и комуникацията</li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">4. Правно основание</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Обработването се извършва на основание легитимен интерес (комуникация с потенциални клиенти) и/или предприемане на стъпки по твое искане преди сключване на договор (отговор на запитване).
        </p>

        <h2 className="mt-10 text-xl font-extrabold">5. Съхранение</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Съхраняваме данните само за срок, необходим за обработка на запитването и последваща комуникация. Ако запитването премине в реално обслужване, част от информацията може да бъде съхранявана за счетоводни и законови цели.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">6. Споделяне на данни</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Не продаваме лични данни. Данните могат да бъдат обработвани от доставчици на техническа инфраструктура (хостинг/имейл), единствено за да функционира услугата.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">7. "Бисквитки"</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Сайтът може да използва технически необходими "бисквитки" (cookies) за нормална работа. Ако добавим аналитични/маркетингови инструменти, ще актуализираме тази политика.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">8. Твоите права</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Имаш право на достъп, корекция, изтриване, ограничаване на обработването, възражение и преносимост на данните, когато е приложимо. За упражняване на права ни пиши на имейла по-долу.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">9. Контакт</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          За въпроси и искания относно лични данни: {" "}
          <a
            className="underline decoration-white/20 hover:decoration-white/50"
            href="mailto:office@vssauto.net"
          >
            office@vssauto.net
          </a>
          .
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-vss-accent text-black hover:opacity-90 transition">
            Към началната
          </Link>
          <Link href="/terms" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition">
            Общи условия
          </Link>
        </div>
      </div>
    </div>
  );
}
