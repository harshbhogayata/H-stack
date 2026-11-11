export function fail(what, hint, code = 2) {
  process.stderr.write(`logq: ${what}\n${hint ? `${hint}\n` : ''}`);
  process.exit(code);
}

export function emit(record, { json }) {
  process.stdout.write(json ? `${JSON.stringify(record)}\n` : `${record.line ?? record.name ?? ''}\n`);
}

export const useColor = () => process.stdout.isTTY && !process.env.NO_COLOR;
