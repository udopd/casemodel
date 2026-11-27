import Link from 'next/link';
import { ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { WORKBENCH_COPY_RU } from '@/i18n/ru';

export default function HomePage() {
  const { landing, appName } = WORKBENCH_COPY_RU;

  return (
    <main className="min-h-dvh bg-[#F8FAFC] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 shadow-xs">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-slate-700">
          <Layers className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
          <span>{landing.stageBadge}</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{landing.heading}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{landing.subtitle}</p>

        <div className="mt-6">
          <Link
            href="/editor/"
            data-testid="open-editor-link"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <span>{landing.openEditor}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <section
          aria-labelledby="principles-heading"
          className="mt-8 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <h2 id="principles-heading" className="text-sm font-semibold text-slate-900">
              {landing.principlesTitle} ({appName})
            </h2>
          </div>
          <ul className="space-y-2 text-[13px] text-slate-700">
            {landing.principles.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
