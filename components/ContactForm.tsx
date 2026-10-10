"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "auto";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const disabled = status === "sending" || !turnstileReady || !turnstileToken;

  useEffect(() => {
    if (!SITE_KEY) {
      setError("Защитата на формата не е конфигурирана. Моля, обади се по телефона.");
      return;
    }

    let mounted = true;
    const init = () => {
      if (!mounted || !window.turnstile || !turnstileContainer.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(turnstileContainer.current, {
        sitekey: SITE_KEY,
        theme: "auto",
        callback: (token) => {
          if (!mounted) return;
          setTurnstileToken(token);
          setError(null);
        },
        "expired-callback": () => {
          if (mounted) setTurnstileToken("");
        },
        "error-callback": () => {
          if (!mounted) return;
          setTurnstileToken("");
          setError("Проверката за сигурност не успя. Презареди страницата и опитай отново.");
        },
      });
      setTurnstileReady(true);
    };

    if (window.turnstile) {
      init();
    } else {
      let script = document.querySelector<HTMLScriptElement>("script[data-vss-turnstile]");
      if (!script) {
        script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.vssTurnstile = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", init);
      // The existing script may already have loaded before the listener was added.
      if (window.turnstile) init();
      return () => {
        mounted = false;
        script?.removeEventListener("load", init);
        if (widgetId.current && window.turnstile) {
          window.turnstile.remove(widgetId.current);
          widgetId.current = null;
        }
      };
    }

    return () => {
      mounted = false;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);

    if (!turnstileToken) {
      setStatus("error");
      setError("Изчакай проверката за сигурност и опитай отново.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      car: String(fd.get("car") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      turnstileToken,
    };

    if (!payload.name || !payload.phone || !payload.message) {
      setStatus("error");
      setError("Моля попълни име, телефон и съобщение.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.error || "Неуспешно изпращане.");

      setStatus("ok");
      form.reset();
      window.location.assign("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Грешка при изпращане.");
      setTurnstileToken("");
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    }
  }

  return (
    <div className="panel rounded-3xl p-6">
      <div className="text-sm text-vss-muted">Форма за запитване</div>
      <div className="mt-2 text-xl font-extrabold">Разкажи ни за автомобила</div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Име и фамилия" name="name" placeholder="Иван Иванов" required disabled={status === "sending"} />
          <Field label="Телефон" name="phone" placeholder="08xx xxx xxx" required disabled={status === "sending"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Имейл (по желание)" name="email" placeholder="you@email.com" disabled={status === "sending"} />
          <Field label="Автомобил" name="car" placeholder="Марка / Модел / Двигател / Година" disabled={status === "sending"} />
        </div>

        <div>
          <label className="text-sm text-vss-muted" htmlFor="contact-message">Съобщение</label>
          <textarea
            id="contact-message"
            name="message"
            required
            disabled={status === "sending"}
            rows={5}
            placeholder="Какво целиш? (тунинг / диагностика)"
            className="mt-2 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-vss-accent/60"
          />
        </div>

        <div ref={turnstileContainer} className="min-h-[65px]" aria-label="Проверка за сигурност" />
        {!turnstileReady && SITE_KEY && (
          <p className="text-xs text-vss-muted">Зареждане на проверката за сигурност…</p>
        )}

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm" role="alert">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-vss-accent text-black hover:opacity-90 disabled:opacity-60 transition"
        >
          {status === "sending" ? "Изпращане..." : "Изпрати запитване"}
        </button>

        <p className="text-xs text-vss-muted leading-relaxed">
          С изпращането на запитване се съгласяваш да се свържем с теб по телефон/имейл.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  disabled,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-vss-muted" htmlFor={`contact-${name}`}>{label}</label>
      <input
        id={`contact-${name}`}
        name={name}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-vss-accent/60"
      />
    </div>
  );
}
