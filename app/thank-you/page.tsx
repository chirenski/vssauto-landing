import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="panel rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Благодарим!</h1>
        <p className="mt-3 text-vss-muted leading-relaxed">
          Получихме запитването ти. Ще се свържем с теб възможно най-бързо.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-vss-accent text-black hover:opacity-90 transition"
          >
            Към началната страница
          </Link>
          <a
            href="mailto:office@vssauto.net"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            office@vssauto.net
          </a>
        </div>
      </div>
    </div>
  );
}
