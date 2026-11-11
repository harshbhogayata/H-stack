import { useRef, useState } from 'react';
import { Button } from './Button';
import { EyeIcon } from './icons';
import './SignupForm.css';

export function SignupForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const doneRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await onSubmit({ email, password, agreed });
    if (result.error) return setError(result.error);
    setDone(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  if (done) {
    return <h2 ref={doneRef} tabIndex={-1}>Check your inbox to confirm your account</h2>;
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <label htmlFor="signup-email">Email</label>
      <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="signup-password">Password</label>
      <div className="signup__password">
        <input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={error ? 'is-invalid' : ''} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="button" aria-label="Show password" aria-pressed={showPassword} onClick={() => setShowPassword((v) => !v)}>
          <EyeIcon aria-hidden="true" />
        </button>
      </div>

      <div className={agreed ? 'signup__check is-checked' : 'signup__check'} onClick={() => setAgreed(!agreed)}>
        <span className="signup__box" />
        I agree to the terms
      </div>

      <Button type="submit">Create account</Button>
    </form>
  );
}
