'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/* ---------- Auth action ---------- */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
    return undefined; // no error message -> login succeeded
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

/* ---------- DB ---------- */
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* ---------- Validation ---------- */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/* ---------- Create ---------- */
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate without throwing
  const validated = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    } satisfies State;
  }

  const { customerId, amount, status } = validated.data;
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    return { message: 'Database Error: Failed to Create Invoice.' } satisfies State;
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/* ---------- Update ---------- */
/* Signature kept as (id, formData) so your current Edit form works. */
export async function updateInvoice(id: string, formData: FormData) {
  // Validate (throwing here is fine; error.tsx/not-found.tsx will catch)
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = Math.round(amount * 100);

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch {
    throw new Error('Failed to Update Invoice');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/* ---------- Delete ---------- */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch {
    throw new Error('Failed to Delete Invoice');
  }
  revalidatePath('/dashboard/invoices');
}
