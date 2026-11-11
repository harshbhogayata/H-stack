import { DataTable, Field, Button } from '../ui';
import { PERMISSIONS, requirePermission } from '../auth/permissions';

export function CustomerSearch({ staff, results, onSearch }) {
  requirePermission(staff, PERMISSIONS.CUSTOMER_VIEW);
  return (
    <main className="ld-page">
      <h1>Customer search</h1>
      <form onSubmit={onSearch} className="ld-toolbar">
        <Field id="q" label="Name, IBAN or customer ID" hint="Minimum 3 characters.">
          <input name="q" minLength={3} />
        </Field>
        <Button type="submit" variant="primary">Search</Button>
      </form>
      <DataTable
        caption="Search results"
        columns={[{ key: 'id', header: 'Customer ID' }, { key: 'name', header: 'Name' }, { key: 'balance', header: 'Balance (EUR)', numeric: true }]}
        rows={results}
      />
    </main>
  );
}
