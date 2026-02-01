import { NextResponse } from "next/server";

type Payload = {
  name: string;
  phone: string;
  email?: string;
  car?: string;
  message: string;
};

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
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const to = process.env.CONTACT_TO || "office@vssauto.net";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff8c00;">Ново запитване от vssauto.net</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Име:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Телефон:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              <a href="tel:${phone.replace(/\s/g, '')}">${phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Имейл:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${email ? `<a href="mailto:${email}">${email}</a>` : '-'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Автомобил:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${car || '-'}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-left: 4px solid #ff8c00;">
          <p style="font-weight: bold; margin-top: 0;">Съобщение:</p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px; text-align: center;">
          Изпратено от vssauto.net
        </p>
      </div>
    `;

    const textContent = [
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

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VSS Auto <onboarding@resend.dev>",
        to: [to],
        reply_to: email || undefined,
        subject: `Ново запитване — ${name}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email изпратен успешно:", result);

    return NextResponse.json({ ok: true });
    
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("Email error:", msg);
    
    return NextResponse.json(
      { error: "Грешка при изпращане. Моля свържи се по телефон." },
      { status: 500 }
    );
  }
}
