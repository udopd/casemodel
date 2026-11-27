'use client';

import { browserClockPort } from '@/adapters/runtime/browser-ports';
import { WorkbenchShell } from '@/components/workbench/WorkbenchShell';

export function EditorEntry() {
  return <WorkbenchShell clock={browserClockPort} />;
}
