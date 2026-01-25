import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type Payload = {
  name: string;
  phone: string;
  email?: string;
  car?: string;
  message: string;
};

function getEnv(name: string, required = true) {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing env: ${name}`);
  return v || "";
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Невалидни данни." }, { status: 400 });
  }

  const name = (data.name || "").trim();
  const phone = (data.phone || "").trim();
  const email = (data.email || "").trim();
  const car = (data.car || "").trim();
  const message = (data.message || "").trim();

  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "Липсват задължителни полета." },
      { status: 400 }
    );
  }

  try {
    const host = getEnv("SMTP_HOST");
    const port = Number(getEnv("SMTP_PORT"));
    const user = getEnv("SMTP_USER");
    const pass = getEnv("SMTP_PASS");

    const to = process.env.CONTACT_TO || "office@vssauto.net";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `Ново запитване (vssauto.net) — ${name}`;

    const text = [
      "Ново запитване от сайта vssauto.net",
      "",
      `Име: ${name}`,
      `Телефон: ${phone}`,
      `Имейл: ${email || "-"}`,
      `Автомобил: ${car || "-"}`,
      "",
      "Съобщение:",
      message,
    ].join("\n");

    await transporter.sendMail({
      from: `VSS Auto <${user}>`,
      to,
      replyTo: email || undefined,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Mail error";
    return NextResponse.json(
      { error: "Грешка при изпращане. (SMTP)", details: msg },
      { status: 500 }
    );
  }
}
