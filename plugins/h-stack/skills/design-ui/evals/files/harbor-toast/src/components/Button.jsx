import './Button.css';

export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button type="button" className={`hb-button hb-button--${variant}`} {...props}>
      {children}
    </button>
  );
}
