import { redirect } from 'next/navigation';
import { isPrintCategoryId } from '@/config/print-categories';

interface PrintCategoryRedirectProps {
  params: Promise<{ group: string }>;
}

/** Legacy path — use `/studio?section=print&group=…` with shared studio navigation. */
export default async function PrintCategoryRedirect({ params }: PrintCategoryRedirectProps) {
  const { group } = await params;
  if (!isPrintCategoryId(group)) {
    redirect('/studio?section=print');
  }
  redirect(`/studio?section=print&group=${group}`);
}
