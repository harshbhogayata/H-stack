type Props = { title: string; consequence: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void };

export function ConfirmDialog({ title, consequence, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="ld-confirm-title" aria-describedby="ld-confirm-body" className="ld-dialog">
      <h2 id="ld-confirm-title">{title}</h2>
      <p id="ld-confirm-body">{consequence}</p>
      <button type="button" className="ld-button ld-button--secondary" onClick={onCancel}>Cancel</button>
      <button type="button" className="ld-button ld-button--primary" onClick={onConfirm}>{confirmLabel}</button>
    </div>
  );
}
