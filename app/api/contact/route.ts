
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

type DatabaseConfig = {
  url: string;
  key: string;
};

const MAX_BODY_BYTES = 16 * 1024;

const userError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

function field(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validPhone(phone: string): boolean {
  // Allows digits, spaces, +, brackets, hyphens and dots.
  if (!/^\+?[\d\s().-]+$/.test(phone)) return false;

  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

// Read the body with a real byte limit.
// Do not trust Content-Length alone.
async function readLimitedJson(req: Request): Promise<unknown> {
  const reader = req.body?.getReader();

  if (!reader) {
    throw new Error("invalid_body");
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      total += value.byteLength;

      if (total > MAX_BODY_BYTES) {
        throw new Error("body_too_large");
      }

      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  const buffer = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder("utf-8", {
    fatal: true,
  }).decode(buffer);

  return JSON.parse(text);
}

async function verifyTurnstile(
  token: string,
  secret: string
): Promise<boolean> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }).toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    console.error(
      "Contact: Turnstile HTTP status",
      response.status
    );
    return false;
  }

  const result: {
    success?: boolean;
    hostname?: string;
  } = await response.json();

  return (
    result.success === true &&
    (
      result.hostname === "vssauto.net" ||
      result.hostname === "www.vssauto.net"
    )
  );
}

// Server only. Never expose this key to browser code.
// Supabase secret keys bypass Row Level Security.
function dbConfig(): DatabaseConfig | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY;

  if (
    !url ||
    !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) ||
    !key
  ) {
    return null;
  }

  return {
    url: `${url}/rest/v1/contact_inquiries`,
    key,
  };
}

async function dbInsert(
  db: DatabaseConfig,
  inquiry: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    car: string | null;
    message: string;
  }
): Promise<boolean> {
  const response = await fetch(db.url, {
    method: "POST",
    headers: {
      apikey: db.key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      ...inquiry,
      email_status: "pending",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    console.error(
      "Contact: Supabase insert rejected",
      response.status
    );
  }

  return response.ok;
}

async function dbUpdate(
  db: DatabaseConfig,
  id: string,
  values: {
    email_status: "sent" | "failed";
    resend_email_id?: string;
    emailed_at?: string;
    email_error?: string;
  }
): Promise<void> {
  try {
    const response = await fetch(
      `${db.url}?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: db.key,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(values),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      console.error(
        "Contact: Supabase status update rejected",
        response.status
      );
    }
  } catch (error) {
    console.error(
      "Contact: Supabase status update failed",
      error instanceof Error ? error.name : "unknown"
    );
  }
}

export async function POST(req: Request) {
  let body: Payload;

  const contentType = req.headers.get("content-type") || "";

  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return userError("Невалиден формат на заявката.", 415);
  }

  const declaredLength = Number(
    req.headers.get("content-length")
  );

  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_BODY_BYTES
  ) {
    return userError(
      "Заявката е прекалено голяма.",
      413
    );
  }

  try {
    const parsed: unknown = await readLimitedJson(req);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return userError("Невалидни данни.");
    }

    body = parsed as Payload;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "body_too_large"
    ) {
      return userError(
        "Заявката е прекалено голяма.",
        413
      );
    }

    return userError("Невалидни данни.");
  }

  const name = field(body.name);
  const phone = field(body.phone);
  const email = field(body.email);
  const car = field(body.car);
  const message = field(body.message);
  const turnstileToken = field(body.turnstileToken);

  if (!name || !phone || !message) {
    return userError(
      "Попълни име, телефон и съобщение."
    );
  }

  if (
    name.length > 120 ||
    phone.length > 50 ||
    email.length > 254 ||
    car.length > 200 ||
    message.length > 5000
  ) {
    return userError(
      "Някое от полетата е прекалено дълго."
    );
  }

  if (!validPhone(phone)) {
    return userError(
      "Въведи валиден телефонен номер."
    );
  }

  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return userError("Невалиден имейл адрес.");
  }

  if (
    !turnstileToken ||
    turnstileToken.length > 2048
  ) {
    return userError(
      "Липсва валидна проверка за сигурност. Презареди страницата."
    );
  }

  const turnstileSecret =
    process.env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret) {
    console.error(
      "Contact: TURNSTILE_SECRET_KEY missing"
    );

    return userError(
      "Формата временно не е достъпна. Моля, обади се по телефона.",
      503
    );
  }

  try {
    const verified = await verifyTurnstile(
      turnstileToken,
      turnstileSecret
    );

    if (!verified) {
      return userError(
        "Проверката за сигурност не успя. Опитай отново."
      );
    }
  } catch (error) {
    console.error(
      "Contact: Turnstile unavailable",
      error instanceof Error ? error.name : "unknown"
    );

    return userError(
      "Проверката за сигурност временно не е достъпна. Опитай отново.",
      503
    );
  }

  const db = dbConfig();

  if (!db) {
    console.error(
      "Contact: SUPABASE_URL or SUPABASE_SECRET_KEY missing or invalid"
    );

    return userError(
      "Временно не можем да приемем запитването. Моля, обади се по телефона.",
      503
    );
  }

  // Save the inquiry before attempting email delivery.
  const id = crypto.randomUUID();

  try {
    const saved = await dbInsert(db, {
      id,
      name,
      phone,
      email: email || null,
      car: car || null,
      message,
    });

    if (!saved) {
      return userError(
        "Временно не можем да приемем запитването. Моля, обади се по телефона.",
        503
      );
    }
  } catch (error) {
    console.error(
      "Contact: Supabase insert failed",
      error instanceof Error ? error.name : "unknown"
    );

    return userError(
      "Временно не можем да приемем запитването. Моля, обади се по телефона.",
      503
    );
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.error(
      "Contact: RESEND_API_KEY missing; inquiry saved",
      id
    );

    await dbUpdate(db, id, {
      email_status: "failed",
      email_error: "missing_resend_key",
    });

    return NextResponse.json({
      ok: true,
      saved: true,
      emailSent: false,
    });
  }

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeCar = escapeHtml(car);
  const safeMessage = escapeHtml(message);

  const phoneLink = escapeHtml(
    phone.replace(/[^\d+]/g, "")
  );

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#222">
      <h2 style="color:#f58a00">Ново запитване от VSS Auto</h2>
      <p><strong>Име:</strong> ${safeName}</p>
      <p><strong>Телефон:</strong> <a href="tel:${phoneLink}">${safePhone}</a></p>
      <p><strong>Имейл:</strong> ${
        email
          ? `<a href="mailto:${safeEmail}">${safeEmail}</a>`
          : "—"
      }</p>
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

  const contactEmail =
    process.env.CONTACT_EMAIL ||
    "office@vssauto.net";

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "VSS Auto <noreply@vssauto.net>",
          to: [contactEmail],
          ...(email ? { reply_to: email } : {}),
          subject: `Ново запитване от сайта — ${name.replace(/[\r\n]/g, " ")}`,
          html,
          text,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      const details: unknown = await response
        .json()
        .catch(() => null);

      const code =
        details &&
        typeof details === "object" &&
        "name" in details
          ? String(
              (details as { name?: unknown }).name
            ).slice(0, 80)
          : "unknown";

      console.error(
        "Contact: Resend rejected; inquiry saved",
        {
          id,
          status: response.status,
          code,
        }
      );

      await dbUpdate(db, id, {
        email_status: "failed",
        email_error: `resend_http_${response.status}`,
      });

      return NextResponse.json({
        ok: true,
        saved: true,
        emailSent: false,
      });
    }

    const result: unknown = await response
      .json()
      .catch(() => null);

    const resendId =
      result &&
      typeof result === "object" &&
      "id" in result &&
      typeof (result as { id?: unknown }).id === "string"
        ? (result as { id: string }).id
        : undefined;

    await dbUpdate(db, id, {
      email_status: "sent",
      emailed_at: new Date().toISOString(),
      ...(resendId
        ? { resend_email_id: resendId }
        : {}),
    });

    return NextResponse.json({
      ok: true,
      saved: true,
      emailSent: true,
    });
  } catch (error) {
    console.error(
      "Contact: email transport error; inquiry saved",
      {
        id,
        type:
          error instanceof Error
            ? error.name
            : "unknown",
      }
    );

    await dbUpdate(db, id, {
      email_status: "failed",
      email_error: "transport_error",
    });

    return NextResponse.json({
      ok: true,
      saved: true,
      emailSent: false,
    });
  }
}
