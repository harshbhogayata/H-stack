import './InvoiceSummary.css';

export function InvoiceSummary({ client, amount, due }) {
  return (
    <section className="invoice-summary">
      <h3>{client}</h3>
      <p className="invoice-summary__amount">{amount}</p>
      <p className="invoice-summary__due">Due {due}</p>
    </section>
  );
}
