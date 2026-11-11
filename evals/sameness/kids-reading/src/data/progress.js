const KEY = 'sprout.progress.v2';

export function loadProgress() {
  const raw = globalThis.localStorage?.getItem(KEY);
  return raw ? JSON.parse(raw) : { name: 'Reader', seeds: 0, sprouts: [], storiesRead: [], dailyGoalMinutes: 10, reminders: true };
}

export function saveProgress(progress) {
  globalThis.localStorage?.setItem(KEY, JSON.stringify(progress));
}
