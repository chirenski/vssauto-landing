import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  car?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
};

function readField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function invalid(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const form = new URLSearchParams({ secret, response: token });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error("Contact form: Turnstile verification HTTP error", response.status);
    return false;
  }
  const result: { success?: boolean; hostname?: string } = await response.json();
  return result.success === true &&
    (result.hostname === "vssauto.net" || result.hostname === "www.vssauto.net");
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid("Невалидни данни.");
    body = parsed as Payload;
  } catch {
    return invalid("Невалидни данни.");
  }

  const name = readField(body.name);
  const phone = readField(body.phone);
  const email = readField(body.email);
  const car = readField(body.car);
  const message = readField(body.message);
  const turnstileToken = readField(body.turnstileToken);

  if (!name || !phone || !message) return invalid("Попълни име, телефон и съобщение.");
  if (name.length > 120 || phone.length > 50 || email.length > 254 || car.length > 200 || message.length > 5000) {
    return invalid("Някое от полетата е прекалено дълго.");
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid("Невалиден имейл адрес.");
  if (!turnstileToken || turnstileToken.length > 2048) return invalid("Липсва валидна проверка за сигурност. Презареди страницата.");

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("Contact form: TURNSTILE_SECRET_KEY is missing");
    return NextResponse.json({ error: "Формата е временно недостъпна. Моля, обади се по телефона." }, { status: 500 });
  }

  try {
    if (!(await verifyTurnstile(turnstileToken, secret))) {
      return invalid("Проверката за сигурност не успя. Опитай отново.");
    }
  } catch (error) {
    console.error("Contact form: Turnstile verification failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Проверката за сигурност временно не е достъпна. Опитай отново." }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is missing");
    return NextResponse.json({ error: "Временно не можем да изпратим запитването. Моля, обади се по телефона." }, { status: 500 });
  }

  const to = process.env.CONTACT_TO || "office@vssauto.net";
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeCar = escapeHtml(car);
  const safeMessage = escapeHtml(message);
  const phoneLink = phone.replace(/[^\d+]/g, "");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#222">
      <h2 style="color:#f58a00">Ново запитване от VSS Auto</h2>
      <p><strong>Име:</strong> ${safeName}</p>
      <p><strong>Телефон:</strong> <a href="tel:${escapeHtml(phoneLink)}">${safePhone}</a></p>
      <p><strong>Имейл:</strong> ${email ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : "—"}</p>
      <p><strong>Автомобил:</strong> ${safeCar || "—"}</p>
      <p><strong>Съобщение:</strong></p>
      <div style="white-space:pre-wrap;padding:16px;background:#f5f5f5;border-left:4px solid #f58a00">${safeMessage}</div>
      <p style="font-size:12px;color:#777">Изпратено от контактната форма на vssauto.net</p>
    </div>
  `;

  const text = [
    "Ново запитване от vssauto.net",
    `Име: ${name}`,
    `Телефон: ${phone}`,
    `Имейл: ${email || "—"}`,
    `Автомобил: ${car || "—"}`,
    "",
    "Съобщение:",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "VSS Auto <noreply@vssauto.net>",
        to: [to],
        ...(email ? { reply_to: email } : {}),
        subject: `Ново запитване от сайта — ${name.replace(/[\r\n]/g, " ")}`,
        html,
        text,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const details: unknown = await response.json().catch(() => null);
      const providerCode = details && typeof details === "object" && "name" in details
        ? String((details as { name?: unknown }).name)
        : "unknown";
      console.error("Contact form: Resend rejected request", { status: response.status, providerCode });
      return NextResponse.json({ error: "Не успяхме да изпратим запитването. Моля, свържи се с нас по телефон." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form: email transport failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Временно не можем да изпратим запитването. Моля, обади се по телефона." }, { status: 500 });
  }
}
