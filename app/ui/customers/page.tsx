// app/dashboard/customers/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Search from '@/app/ui/search';
import CustomersTable from '@/app/ui/customers/table';
import Pagination from '@/app/ui/pagination';
import { fetchCustomersPages } from '@/app/lib/data';

export const metadata: Metadata = { title: 'Customers' };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page ?? '1');
  const totalPages = await fetchCustomersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Search placeholder="Search customers..." />
      </div>

      <Suspense key={query + currentPage} fallback={<div>Loading…</div>}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-6 flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
