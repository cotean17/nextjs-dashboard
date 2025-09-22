'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function handle(term: string) {
    const params = new URLSearchParams(searchParams as unknown as string);
    if (term) params.set('query', term);
    else params.delete('query');
    params.set('page', '1'); // reset paging on new search
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <input
      className="w-72 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none"
      placeholder={placeholder}
      defaultValue={searchParams.get('query') ?? ''}
      onChange={(e) => handle(e.target.value)}
    />
  );
}
