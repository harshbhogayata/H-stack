type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' };

export function Button({ variant = 'secondary', type = 'button', ...props }: Props) {
  return <button type={type} className={`ld-button ld-button--${variant}`} {...props} />;
}
