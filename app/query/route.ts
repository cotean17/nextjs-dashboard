import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Runs the SQL and returns an array of rows: [{ amount: number, name: string }, ...]
async function listInvoices() {
  const rows = await sql/*sql*/`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
  return rows;
}

export async function GET() {
  try {
    const data = await listInvoices();
    return Response.json(data); // e.g., [{"amount":666,"name":"<customer>"}]
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Query failed' }, { status: 500 });
  }
}
