import { useState } from 'react';
import { RoundButton } from './RoundButton';

const QUESTIONS = [
  { ask: 'Type the number seventeen in digits.', answer: '17' },
  { ask: 'Type the number forty-two in digits.', answer: '42' },
];

export function ParentGate({ children, onCancel }) {
  const [q] = useState(() => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  if (open) return children;
  return (
    <div role="dialog" aria-labelledby="gate-title" className="parent-gate">
      <h2 id="gate-title">For grown-ups</h2>
      <label htmlFor="gate-answer">{q.ask}</label>
      <input id="gate-answer" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} />
      <RoundButton onClick={() => setOpen(value.trim() === q.answer)}>Continue</RoundButton>
      <RoundButton tone="sky" onClick={onCancel}>Back to the garden</RoundButton>
    </div>
  );
}
