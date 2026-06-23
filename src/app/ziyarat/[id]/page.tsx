import { redirect } from 'next/navigation';
import { ziyarats } from '@/data/ziyarats';

export const dynamic = "force-static";

export function generateStaticParams() {
  return ziyarats.map(z => ({ id: z.id }));
}

export default async function ZiyaratIdRedirect({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  redirect(`/fa/ziyarat/${resolvedParams.id}`);
}
