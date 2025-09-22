'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get('page') ?? '1');

  if (totalPages <= 1) return null;

  const makeLink = (page: number) => {
    const params = new URLSearchParams(searchParams as unknown as string);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={makeLink(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className="rounded border px-3 py-1 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Previous
      </Link>
      <span className="text-sm">Page {currentPage} of {totalPages}</span>
      <Link
        href={makeLink(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage >= totalPages}
        className="rounded border px-3 py-1 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Next
      </Link>
    </div>
  );
}
