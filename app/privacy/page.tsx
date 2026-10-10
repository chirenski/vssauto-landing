import Link from "next/link";

const contactEmail = "office@vssauto.net";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="panel rounded-3xl p-8 md:p-10">
        <div className="text-sm text-vss-muted">
          Последна актуализация: 10 октомври 2026 г.
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          Политика за поверителност
        </h1>

        <p className="mt-6 text-vss-muted leading-relaxed">
          Настоящата политика описва как ВСС Ауто ЕООД (VSS Auto) обработва
          личните данни на посетителите на vssauto.net и на лицата, които
          изпращат запитвания чрез контактната форма.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">1. Администратор на личните данни</h2>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>Наименование: ВСС Ауто ЕООД</li>
          <li>ЕИК: 208669835</li>
          <li>Търговско наименование: VSS Auto</li>
          <li>Град: София, България</li>
          <li>
            Имейл за контакт: <a className="underline decoration-white/20 hover:decoration-white/50" href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">2. Какви данни обработваме</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          При изпращане на запитване обработваме предоставените от Вас име,
          телефон, незадължителен имейл адрес, информация за автомобила и
          съдържание на съобщението. За техническата сигурност на сайта могат
          да се обработват и IP адрес, информация за браузъра и данни,
          свързани с проверките срещу автоматизирани заявки.
        </p>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Моля, не изпращайте чрез формата чувствителни лични данни, които
          не са необходими за Вашето запитване.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">3. Цели и правни основания</h2>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li>Отговор на запитвания, консултация и подготовка на заявена услуга — чл. 6, пар. 1, буква „б“ от GDPR, когато се предприемат стъпки преди договор по Ваше искане.</li>
          <li>Защита от спам, злоупотреби и технически атаки — чл. 6, пар. 1, буква „е“ от GDPR (легитимен интерес), при съобразяване с Вашите права.</li>
          <li>Спазване на приложими законови задължения — чл. 6, пар. 1, буква „в“ от GDPR, когато е необходимо.</li>
        </ul>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Изпращането на запитване не представлява съгласие за получаване
          на рекламни съобщения.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">4. Срокове за съхранение</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Запитванията, които не са довели до поръчка или предоставяне на
          услуга, се съхраняват до 6 месеца от получаването им, след което
          се изтриват или анонимизират. Ако запитването доведе до реална
          услуга, съответната необходима информация може да се съхранява
          за срока, приложим към договорната документация, счетоводните
          задължения или установяването и защитата на правни претенции.
        </p>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Сроковете се прилагат и към копията на информацията в използваните
          системи, доколкото това е под наш контрол, като се отчитат
          приложимите технически срокове за резервни копия и журнални записи.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">5. Доставчици на услуги</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          За поддръжката на сайта и обработването на запитвания използваме:
        </p>
        <ul className="mt-3 text-vss-muted leading-relaxed list-disc pl-5">
          <li><strong>Vercel</strong> — хостинг на сайта и изпълнение на сървърните функции.</li>
          <li><strong>Cloudflare</strong> — защита на сайта, ограничаване на заявки и Turnstile.</li>
          <li><strong>Supabase</strong> — съхранение на клиентски запитвания.</li>
          <li><strong>Resend</strong> — изпращане на уведомления за запитвания.</li>
          <li><strong>Zoho Mail</strong> — получаване и обработване на електронната кореспонденция.</li>
        </ul>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Не продаваме личните Ви данни. Доставчиците обработват данни
          според ролята си и приложимите договорни условия.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">6. Сигурност и защита от спам</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Използваме HTTPS, защитни HTTP настройки, ограничаване на честотата
          на заявките и Cloudflare Turnstile, за да защитаваме контактната
          форма. Turnstile може да обработва технически данни за браузъра,
          устройството и мрежовата връзка за откриване на злоупотреби.
          Достъпът до базата с клиентски запитвания е ограничен.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">7. Бисквитки и подобни технологии</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Сайтът и услугите за неговата защита могат да използват технически
          необходими бисквитки и подобни механизми. Ако в бъдеще добавим
          аналитични или маркетингови технологии, ще предоставим съответната
          информация и възможности за избор, когато законът ги изисква.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">8. Обработване извън ЕИП</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Някои доставчици могат да обработват лични данни извън Европейското
          икономическо пространство. За такива трансфери се прилагат
          съответните механизми за защита по GDPR, когато са необходими.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">9. Вашите права</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Съгласно GDPR и при предвидените в него условия имате право на
          достъп, коригиране, изтриване, ограничаване на обработването,
          възражение и преносимост на данните. Имате право да подадете
          жалба до Комисията за защита на личните данни (КЗЛД).
        </p>
        <p className="mt-3 text-vss-muted leading-relaxed">
          За упражняване на права или въпроси пишете на{" "}
          <a className="underline decoration-white/20 hover:decoration-white/50" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">10. Промени в политиката</h2>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Политиката може да бъде актуализирана при промяна на използваните
          услуги, начина на обработване или законовите изисквания. Актуалната
          версия ще бъде публикувана на тази страница.
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
