import Link from "next/link";

const CONTACT_EMAIL = "office@vssauto.net";
// User provided: 0882127787
const CONTACT_PHONE_DISPLAY = "0882 12 77 87";
const CONTACT_PHONE_TEL = "+359882127787";

const BUSINESS_NAME = "VSSauto Ltd";
const BUSINESS_CITY = "Sofia";
const LOCATION_LABEL = "VSSauto Ltd гр.София";
const MAPS_DESTINATION_QUERY = `${BUSINESS_NAME}, ${BUSINESS_CITY}`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAPS_DESTINATION_QUERY
)}`;

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-extrabold tracking-tight">VSS Auto</div>
            <div className="mt-1 text-sm text-vss-muted">
              Чиптунинг • ECU/TCU софтуер • Диагностика
            </div>

            <div className="mt-3 text-sm">
              <div className="text-vss-muted">Локация</div>
              <a
                className="underline decoration-white/20 hover:decoration-white/50"
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
              >
                {LOCATION_LABEL}
              </a>

              <div className="mt-3 text-vss-muted">Контакти</div>
              <div className="mt-1">
                <a className="underline decoration-white/20 hover:decoration-white/50" href={`tel:${CONTACT_PHONE_TEL}`}>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
              <div className="mt-1">
                <a className="underline decoration-white/20 hover:decoration-white/50" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="text-sm text-vss-muted">
            <div className="font-semibold text-vss-text mb-2">Навигация</div>
            <div className="grid gap-2">
              <a className="hover:text-vss-text" href="#services">Услуги</a>
              <a className="hover:text-vss-text" href="#process">Процес</a>
              <a className="hover:text-vss-text" href="#contact">Контакт</a>
              <a
                className="hover:text-vss-text underline decoration-white/10 hover:decoration-white/30"
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Локация (Maps)
              </a>
            </div>
          </div>

          <div className="text-sm text-vss-muted">
            <div className="font-semibold text-vss-text mb-2">Документи</div>
            <div className="grid gap-2">
              <Link className="hover:text-vss-text" href="/privacy">
                Политика за поверителност
              </Link>
              <Link className="hover:text-vss-text" href="/terms">
                Общи условия
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-xs text-vss-muted">
          <div>© {new Date().getFullYear()} VSS Auto. Всички права запазени.</div>
          <div>
            Този сайт е с рекламна цел. Резултатите зависят от състоянието и конфигурацията на автомобила.
          </div>
        </div>
      </div>
    </footer>
  );
}
