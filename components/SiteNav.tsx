'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const CONTACT_EMAIL = 'office@vssauto.net';
const CONTACT_PHONE_DISPLAY = '0882 12 77 87';
const CONTACT_PHONE_TEL = '+359882127787';

const LOGIN_URL = 'https://app.vssauto.net';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61573657479398';

type ServiceItem = { label: string; href: string };

function scrollToHash(href: string) {
  if (typeof window === 'undefined') return;
  const hash = href.startsWith('#') ? href : `#${href}`;
  const id = hash.slice(1);
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', hash);
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H6.9v3h2.7v8h3.9z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 opacity-80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.3a2 2 0 0 1-.5 2.1L7.1 8.2a16 16 0 0 0 6.7 6.7l1.1-1.1a2 2 0 0 1 2.1-.5c.7.3 1.5.5 2.3.6A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 opacity-80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export default function SiteNav() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const services: ServiceItem[] = useMemo(
    () => [
      { label: 'Чиптунинг', href: '#service-ecu' },
      { label: 'TCU / DSG', href: '#service-tcu' },
      { label: 'Диагностика', href: '#service-diagnostics' },
      { label: 'Софтуерни решения', href: '#service-software' },
    ],
    []
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (servicesOpen && !dropdownRef.current?.contains(e.target as Node)) setServicesOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [servicesOpen]);

  const navLink =
    'text-[15px] font-semibold text-vss-muted hover:text-vss-heading transition rounded-xl px-2 py-1 whitespace-nowrap';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* LOGO + FB INLINE */}
          <div className="relative shrink-0">
            <Link href="/" className="block">
              <div className="relative h-14 w-[200px]">
                <Image src="/logo.png" alt="VSS Auto" fill className="object-contain" priority />
              </div>
            </Link>

            {/* FB BADGE (по-голям) */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center
                         rounded-full bg-[#1877F2] shadow-lg
                         transition hover:scale-110 hover:shadow-[0_0_0_4px_rgba(24,119,242,0.25)]"
            >
              <FacebookIcon />
            </a>
          </div>

          {/* CENTER */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setServicesOpen((v) => !v)} className={navLink}>
                Услуги ▾
              </button>
              {servicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 rounded-xl bg-black/90 border border-white/10 p-2">
                  {services.map((s) => (
                    <button
                      key={s.href}
                      onClick={() => {
                        setServicesOpen(false);
                        scrollToHash(s.href);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#process" className={navLink}>Процес</a>
            <a href="#why" className={navLink}>За нас</a>
            <a href="#faq" className={navLink}>FAQ</a>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="flex items-center gap-2 text-sm font-semibold">
                <PhoneIcon />
                {CONTACT_PHONE_DISPLAY}
              </a>
              <span className="h-5 w-px bg-white/10" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-sm font-semibold">
                <MailIcon />
                {CONTACT_EMAIL}
              </a>
            </div>

            <a href="#contact" className="rounded-2xl px-5 py-2 text-sm font-semibold bg-vss-accent text-black">
              Запитване
            </a>

            <a href={LOGIN_URL} target="_blank" rel="noreferrer" className={navLink}>
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
