# VSS Auto Landing (vssauto.net)

Рекламен (marketing) сайт за **VSS Auto** с тъмна визия + контакт форма.

## 1) Стартиране локално (Windows)

1. Отвори папката проекта.
2. Инсталирай зависимостите:

```bash
npm install
```

3. Създай `.env.local` (копирай от `.env.example`) и попълни SMTP данните.

4. Стартирай:

```bash
npm run dev
```

Отвори: `http://localhost:3000`

## 2) Деплой във Vercel

1. Качи проекта в GitHub / GitLab.
2. В Vercel: **New Project** → избери репото.
3. Add Environment Variables (Settings → Environment Variables):
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `CONTACT_TO` (по желание)
4. Deploy.

## 3) Контакт форма

Формата изпраща имейл през `/app/api/contact/route.ts` с **Nodemailer**.

- Препоръка: използвай **App password** (ако Zoho го изисква) вместо основната парола.
- Ако ползваш порт `587`, смени `SMTP_PORT=587`.

## 4) Страници

- `/` – начална страница (landing)
- `/privacy` – политика за поверителност
- `/terms` – общи условия
- `/thank-you` – благодарствена страница след форма
