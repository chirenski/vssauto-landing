import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { Section, SectionHeading } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

const CONTACT_EMAIL = "office@vssauto.net";
// User provided: 0882127787
const CONTACT_PHONE_DISPLAY = "0882 12 77 87";
const CONTACT_PHONE_TEL = "+359882127787";

/**
 * Location: use your Google Business listing name.
 * Since you fixed it in Google as "VSSauto Ltd", we use destination query to that POI.
 * This avoids wrong geocoding by free-form address.
 */
const BUSINESS_NAME = "VSSauto Ltd";
const BUSINESS_CITY = "Sofia";
const LOCATION_LABEL = "VSSauto Ltd (гр.София)";
const MAPS_DESTINATION_QUERY = `${BUSINESS_NAME}, ${BUSINESS_CITY}`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAPS_DESTINATION_QUERY
)}`;

const services = [
  {
    id: "service-ecu",
    title: "Чиптунинг (ECU Remap)",
    body: "Оптимизация на мощност и въртящ момент според двигателя, конфигурацията и състоянието на автомобила.",
  },
  {
    id: "service-tcu",
    title: "TCU / DSG / Автоматик",
    body: "Настройки на трансмисията (при налична поддръжка) за по-добро поведение и по бърза смяна на предавки.",
  },
  {
    id: "service-diagnostics",
    title: "Професионална диагностика и откриване на проблеми",
    body: "Проверка на грешки, живи данни, тестове на компоненти и насоки за ремонт.",
  },
  {
    id: "service-software",
    title: "Софтуерни решения и корекции",
    body: "Решения за специфични софтуерни казуси след анализ и диагностика.",
  },
  {
    id: "service-prepurchase",
    title: "Проверка преди покупка",
    body: "Диагностика и оценка на ключови системи, както и цялостно сътояние преди покупка на употребяван автомобил.",
  },
  {
    id: "service-consult",
    title: "Консултация и план",
    body: "Практични препоръки  = без излишни разходи.",
  },
];

const steps = [
  {
    title: "Проверка и диагностика",
    body: "Професионална диагностика, проверка на всички параметри. При проблеми — първо ги решаваме.",
  },
  {
    title: "Архив на оригинален софтуер",
    body: "Запазваме оригиналния файл и при нужда може да се възстанови по всяко време.",
  },
  {
    title: "Настройка според целта",
    body: "Подход според конфигурацията и реалното състояние.",
  },
  {
    title: "Тест и контрол",
    body: "Проверка на логове, поведение и финални корекции при нужда.",
  },
];

const faqs = [
  {
    q: "Колко време отнема?",
    a: "Зависи от автомобила и услугата. Започваме с диагностика и оценка на състоянието.",
  },
  {
    q: "Безопасен ли е чиптунингът?",
    a: "Когато се прави спрямо състоянието на автомобила и с контрол на параметри — рискът се минимизира.",
  },
  {
    q: "Може ли да се върне фабричният софтуер?",
    a: "Да — пазим оригиналния файл и при нужда може да се върне.",
  },
  {
    q: "Работите ли по дизел/бензин/турбо?",
    a: "Да, при наличие на поддръжка за конкретния ECU/TCU и след диагностика.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="fade-in">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-24">
          <div className="panel accent-ring rounded-3xl p-7 md:p-10">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap gap-2.5 mb-5">
                  <Pill>София</Pill>
                  <Pill>ECU/TCU</Pill>
                  <Pill>Диагностика</Pill>
                </div>

                <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-vss-heading">
                  VSS Auto — чиптунинг и диагностика, направени професионално.
                </h1>

                <p className="mt-5 text-base md:text-lg text-vss-muted leading-relaxed">
                  Софтуерни решения за ECU/TCU, оптимизация на мощност и въртящ момент,
                  индивидуален подход и контрол на ключови параметри. Фокусът ни е надеждност и
                  реални резултати.
                </p>

                <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:text-base text-vss-muted">
                  <li>• Stage 1 / Stage 2 (по заявка и според автомобила)</li>
                  <li>• Индивидуални настройки, а не „случайни файлове“</li>
                  <li>• Диагностика и анализ преди/след</li>
                  <li>• Консултация и поддръжка</li>
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <PrimaryButton href="#contact" className="text-base">
                    Запитване
                  </PrimaryButton>
                  <SecondaryButton href={`tel:${CONTACT_PHONE_TEL}`} className="text-base">
                    {CONTACT_PHONE_DISPLAY}
                  </SecondaryButton>
                  <SecondaryButton href={`mailto:${CONTACT_EMAIL}`} className="text-base">
                    {CONTACT_EMAIL}
                  </SecondaryButton>
                </div>

                <p className="mt-5 text-sm text-vss-muted/80">
                  Настройките се извършват според състоянието на автомобила и конкретната конфигурация.
                </p>
              </div>

              <div className="w-full md:w-[380px]">
                <div className="panel rounded-3xl p-6 md:p-7 fade-in fade-in-d2">
                  <p className="text-sm text-vss-muted/80">Бърза заявка</p>

                  <div className="mt-2 text-xl md:text-2xl font-display font-bold tracking-tight text-vss-heading">
                    Свържи се с нас
                  </div>

                  <div className="mt-5 grid gap-3.5 text-sm md:text-base">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-vss-muted">Локация</span>
                      <a
                        className="text-right underline decoration-white/15 hover:decoration-white/40 text-vss-heading font-semibold"
                        href={MAPS_DIRECTIONS_URL}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Отвори Google Maps с упътвания до сервиза"
                        title="Отвори Google Maps с упътвания"
                      >
                        {LOCATION_LABEL}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-vss-muted">Телефон</span>
                      <a
                        className="text-right underline decoration-white/15 hover:decoration-white/40 text-vss-heading font-semibold tabular-nums"
                        href={`tel:${CONTACT_PHONE_TEL}`}
                        aria-label={`Телефон ${CONTACT_PHONE_DISPLAY}`}
                      >
                        {CONTACT_PHONE_DISPLAY}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-vss-muted">Имейл</span>
                      <a
                        className="text-right underline decoration-white/15 hover:decoration-white/40 text-vss-heading font-semibold"
                        href={`mailto:${CONTACT_EMAIL}`}
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>

                    <div className="pt-2">
                      <SecondaryButton href="#contact" className="w-full text-base">
                        Попитай за твоя автомобил
                      </SecondaryButton>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-vss-muted">
                    <a
                      className="underline decoration-white/10 hover:decoration-white/30"
                      href={MAPS_DIRECTIONS_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Отвори локация в Google Maps →
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about">
        <SectionHeading
          title="Какво правим"
          subtitle="В VSS Auto предлагаме софтуерни услуги за автомобилна електроника — чиптунинг, диагностика и решения за ECU/TCU. Целта ни е автомобилът да върви по-добре, но и да остане надежден."
        />
      </Section>

      {/* SERVICES */}
      <Section id="services">
        <SectionHeading title="Услуги" subtitle="Подходът ни е практичен: диагностика → решение → тест." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <Card title={s.title} body={s.body} />
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process">
        <SectionHeading title="Процес" subtitle="Ясни стъпки и контрол на параметри — без излишен риск." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((st, idx) => (
            <Card key={st.title} eyebrow={`Стъпка ${idx + 1}`} title={st.title} body={st.body} />
          ))}
        </div>
      </Section>

      {/* WHY US */}
      <Section id="why">
        <SectionHeading title="Защо VSS Auto" subtitle="Фокус върху надеждност, прозрачност и реални резултати." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Надеждност" body="Не гоним само цифри — следим температури, налягания, лимити и поведение." />
          <Card title="Индивидуален подход" body="Всяка настройка е според конкретния автомобил, състояние и цел." />
          <Card title="Прозрачност" body="Обясняваме какво се прави и защо. Даваме насоки за поддръжка." />
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionHeading title="Често задавани въпроси" subtitle="Кратки отговори на най-честите въпроси." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f) => (
            <div key={f.q} className="panel rounded-3xl p-6 md:p-7">
              <div className="text-lg md:text-xl font-display font-bold tracking-tight text-vss-heading">{f.q}</div>
              <p className="mt-3 text-sm md:text-base text-vss-muted leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <SectionHeading
          title="Свържи се с нас"
          subtitle="Изпрати запитване с модел, двигател, година и какво целиш (тунинг / диагностика)."
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="panel rounded-3xl p-6 md:p-7">
              <div className="text-sm text-vss-muted/80">Контакти</div>

              <div className="mt-2 font-display text-xl md:text-2xl font-extrabold tracking-tight text-vss-heading">
                VSS Auto
              </div>

              <div className="mt-5 grid gap-2.5 text-sm md:text-base">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-vss-muted">Локация</span>
                  <a
                    className="text-right underline decoration-white/15 hover:decoration-white/40 text-vss-heading font-semibold"
                    href={MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {LOCATION_LABEL}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-vss-muted">Телефон</span>
                  <a
                    className="text-right underline decoration-white/15 hover:decoration-white/40 text-vss-heading font-semibold tabular-nums"
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    aria-label={`Телефон ${CONTACT_PHONE_DISPLAY}`}
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-vss-muted">Имейл</span>
                  <a
                    className="text-right underline decoration-white/15 hover:decoration-white/40 text-vss-heading font-semibold"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <p className="mt-6 text-sm text-vss-muted leading-relaxed">
                С изпращането на запитване се съгласяваш да се свържем с теб по телефон/имейл.
              </p>

              <div className="mt-5 text-sm text-vss-muted">
                Линкове:{" "}
                <Link className="underline decoration-white/15 hover:decoration-white/40" href="/privacy">
                  Политика за поверителност
                </Link>
                {" · "}
                <Link className="underline decoration-white/15 hover:decoration-white/40" href="/terms">
                  Общи условия
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
