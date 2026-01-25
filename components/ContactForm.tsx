"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const disabled = useMemo(() => status === "sending", [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      car: String(fd.get("car") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.message) {
      setStatus("error");
      setError("Моля попълни име, телефон и съобщение.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Неуспешно изпращане.");
      }

      setStatus("ok");
      (e.target as HTMLFormElement).reset();
      window.location.href = "/thank-you";
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Грешка при изпращане.");
    }
  }

  return (
    <div className="panel rounded-3xl p-6">
      <div className="text-sm text-vss-muted">Форма за запитване</div>
      <div className="mt-2 text-xl font-extrabold">Разкажи ни за автомобила</div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Име и фамилия" name="name" placeholder="Иван Иванов" required disabled={disabled} />
          <Field label="Телефон" name="phone" placeholder="08xx xxx xxx" required disabled={disabled} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Имейл (по желание)" name="email" placeholder="you@email.com" disabled={disabled} />
          <Field label="Автомобил" name="car" placeholder="Марка / Модел / Двигател / Година" disabled={disabled} />
        </div>

        <div>
          <label className="text-sm text-vss-muted">Съобщение</label>
          <textarea
            name="message"
            required
            disabled={disabled}
            rows={5}
            placeholder="Какво целиш? (тунинг / диагностика)"
            className="mt-2 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-vss-accent/60"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
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
      <label className="text-sm text-vss-muted">{label}</label>
      <input
        name={name}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-vss-accent/60"
      />
    </div>
  );
}
