type Props = { id: string; label: string; hint?: string; error?: string; children: React.ReactElement };

export function Field({ id, label, hint, error, children }: Props) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="ld-field">
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, { id, 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) })}
      {hint && <p id={`${id}-hint`} className="ld-field__hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="ld-field__error">{error}</p>}
    </div>
  );
}
