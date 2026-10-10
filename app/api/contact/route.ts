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

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }).toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error("Contact: Turnstile HTTP status", response.status);
    return false;
  }
  const result: { success?: boolean; hostname?: string } = await response.json();
  return result.success === true &&
    (result.hostname === "vssauto.net" || result.hostname === "www.vssauto.net");
}

// Only called on the server. A Supabase secret key bypasses RLS:
// never add NEXT_PUBLIC_ to either environment variable.
function dbConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !key) return null;
  return { url: `${url}/rest/v1/contact_inquiries`, key };
}

async function dbInsert(
  db: { url: string; key: string },
  inquiry: { id: string; name: string; phone: string; email: string | null; car: string | null; message: string }
): Promise<boolean> {
  const response = await fetch(db.url, {
    method: "POST",
    headers: {
      apikey: db.key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...inquiry, email_status: "pending" }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) console.error("Contact: Supabase insert rejected", response.status);
  return response.ok;
}

async function dbUpdate(
  db: { url: string; key: string },
  id: string,
  values: { email_status: "sent" | "failed"; resend_email_id?: string; emailed_at?: string; email_error?: string }
): Promise<void> {
  try {
    const response = await fetch(`${db.url}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: db.key,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(values),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) console.error("Contact: Supabase status update rejected", response.status);
  } catch (error) {
    console.error("Contact: Supabase status update failed", error instanceof Error ? error.name : "unknown");
  }
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return userError("Невалидни данни.");
    body = parsed as Payload;
  } catch {
    return userError("Невалидни данни.");
  }

  const name = field(body.name);
  const phone = field(body.phone);
  const email = field(body.email);
  const car = field(body.car);
  const message = field(body.message);
  const turnstileToken = field(body.turnstileToken);

  if (!name || !phone || !message) return userError("Попълни име, телефон и съобщение.");
  if (name.length > 120 || phone.length > 50 || email.length > 254 || car.length > 200 || message.length > 5000) {
    return userError("Някое от полетата е прекалено дълго.");
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return userError("Невалиден имейл адрес.");
  if (!turnstileToken || turnstileToken.length > 2048) {
    return userError("Липсва валидна проверка за сигурност. Презареди страницата.");
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    console.error("Contact: TURNSTILE_SECRET_KEY missing");
    return userError("Формата временно не е достъпна. Моля, обади се по телефона.", 503);
  }
  try {
    if (!(await verifyTurnstile(turnstileToken, turnstileSecret))) {
      return userError("Проверката за сигурност не успя. Опитай отново.");
    }
  } catch (error) {
    console.error("Contact: Turnstile unavailable", error instanceof Error ? error.name : "unknown");
    return userError("Проверката за сигурност временно не е достъпна. Опитай отново.", 503);
  }

  const db = dbConfig();
  if (!db) {
    console.error("Contact: SUPABASE_URL or SUPABASE_SECRET_KEY missing or invalid");
    return userError("Временно не можем да приемем запитването. Моля, обади се по телефона.", 503);
  }

  // Save first. Do not claim receipt if the backup database cannot store the inquiry.
  const id = crypto.randomUUID();
  try {
    const saved = await dbInsert(db, {
      id, name, phone, email: email || null, car: car || null, message,
    });
    if (!saved) return userError("Временно не можем да приемем запитването. Моля, обади се по телефона.", 503);
  } catch (error) {
    console.error("Contact: Supabase insert failed", error instanceof Error ? error.name : "unknown");
    return userError("Временно не можем да приемем запитването. Моля, обади се по телефона.", 503);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Contact: RESEND_API_KEY missing; inquiry saved", id);
    await dbUpdate(db, id, { email_status: "failed", email_error: "missing_resend_key" });
    return NextResponse.json({ ok: true, saved: true, emailSent: false });
  }

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeCar = escapeHtml(car);
  const safeMessage = escapeHtml(message);
  const phoneLink = escapeHtml(phone.replace(/[^\d+]/g, ""));
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#222">
      <h2 style="color:#f58a00">Ново запитване от VSS Auto</h2>
      <p><strong>Име:</strong> ${safeName}</p>
      <p><strong>Телефон:</strong> <a href="tel:${phoneLink}">${safePhone}</a></p>
      <p><strong>Имейл:</strong> ${email ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : "—"}</p>
      <p><strong>Автомобил:</strong> ${safeCar || "—"}</p>
      <p><strong>Съобщение:</strong></p>
      <div style="white-space:pre-wrap;padding:16px;background:#f5f5f5;border-left:4px solid #f58a00">${safeMessage}</div>
      <p style="font-size:12px;color:#777">Изпратено от контактната форма на vssauto.net</p>
    </div>
  `;
  const text = [
    "Ново запитване от vssauto.net", `Име: ${name}`, `Телефон: ${phone}`,
    `Имейл: ${email || "—"}`, `Автомобил: ${car || "—"}`, "", "Съобщение:", message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "VSS Auto <noreply@vssauto.net>",
        to: [process.env.CONTACT_TO || "office@vssauto.net"],
        ...(email ? { reply_to: email } : {}),
        subject: `Ново запитване от сайта — ${name.replace(/[\r\n]/g, " ")}`,
        html, text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const details: unknown = await response.json().catch(() => null);
      const code = details && typeof details === "object" && "name" in details
        ? String((details as { name?: unknown }).name).slice(0, 80) : "unknown";
      console.error("Contact: Resend rejected; inquiry saved", { id, status: response.status, code });
      await dbUpdate(db, id, { email_status: "failed", email_error: `resend_http_${response.status}` });
      return NextResponse.json({ ok: true, saved: true, emailSent: false });
    }

    const result: unknown = await response.json().catch(() => null);
    const resendId = result && typeof result === "object" && "id" in result && typeof (result as { id?: unknown }).id === "string"
      ? (result as { id: string }).id : undefined;
    await dbUpdate(db, id, {
      email_status: "sent",
      emailed_at: new Date().toISOString(),
      ...(resendId ? { resend_email_id: resendId } : {}),
    });
    return NextResponse.json({ ok: true, saved: true, emailSent: true });
  } catch (error) {
    console.error("Contact: email transport error; inquiry saved", {
      id, type: error instanceof Error ? error.name : "unknown",
    });
    await dbUpdate(db, id, { email_status: "failed", email_error: "transport_error" });
    return NextResponse.json({ ok: true, saved: true, emailSent: false });
  }
}
