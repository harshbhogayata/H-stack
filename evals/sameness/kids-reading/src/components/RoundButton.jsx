export function RoundButton({ children, tone = 'leaf', ...props }) {
  return (
    <button
      type="button"
      className={`round-button round-button--${tone}`}
      style={{ minHeight: 'var(--sprout-tap)', borderRadius: 'var(--sprout-radius-pill)', fontSize: 'var(--sprout-text-body)' }}
      {...props}
    >
      {children}
    </button>
  );
}
