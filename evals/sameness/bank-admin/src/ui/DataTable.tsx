type Column<T> = { key: keyof T; header: string; numeric?: boolean };

export function DataTable<T extends { id: string }>({ columns, rows, caption }: { columns: Column<T>[]; rows: T[]; caption: string }) {
  return (
    <table className="ld-table">
      <caption>{caption}</caption>
      <thead><tr>{columns.map((c) => <th key={String(c.key)} scope="col">{c.header}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>{columns.map((c) => <td key={String(c.key)} className={c.numeric ? 'ld-num' : undefined}>{String(r[c.key])}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
