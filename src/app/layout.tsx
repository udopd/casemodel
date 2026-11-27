import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { WORKBENCH_COPY_RU } from '@/i18n/ru';
import './globals.css';

export const metadata: Metadata = {
  title: `${WORKBENCH_COPY_RU.appName} — ${WORKBENCH_COPY_RU.appTagline}`,
  description: WORKBENCH_COPY_RU.landing.subtitle,
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh bg-[#F8FAFC] text-slate-900">{children}</body>
    </html>
  );
}
