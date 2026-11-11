import './IconButton.css';

export function IconButton({ label, icon, ...props }) {
  return (
    <button type="button" className="hb-icon-button" aria-label={label} {...props}>
      {icon}
    </button>
  );
}
