import copy from '../copy/en.json';
import { RoundButton } from '../components/RoundButton';
import { loadProgress } from '../data/progress';

export function GardenScreen({ onShelf, onGrownUps }) {
  const progress = loadProgress();
  return (
    <main className="garden" style={{ background: 'var(--sprout-cream)', fontFamily: 'var(--sprout-font)' }}>
      <h1 style={{ fontSize: 'var(--sprout-text-title)' }}>{copy.garden.title.replace('{name}', progress.name)}</h1>
      <p>{progress.sprouts.length ? copy.garden.growing : copy.garden.empty}</p>
      <RoundButton onClick={onShelf}>{copy.garden.toShelf}</RoundButton>
      <RoundButton tone="sky" onClick={onGrownUps}>{copy.garden.grownUps}</RoundButton>
    </main>
  );
}
