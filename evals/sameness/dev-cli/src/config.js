import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const home = os.homedir();
export const configDir = path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), 'logq');
export const dataDir = path.join(process.env.XDG_DATA_HOME || path.join(home, '.local', 'share'), 'logq');
const file = path.join(configDir, 'config.json');

const DEFAULTS = { limit: 1000, color: 'auto', timeFormat: 'iso' };

export function readConfig() {
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch (err) {
    if (err.code === 'ENOENT') return { ...DEFAULTS };
    throw err;
  }
}

export function writeConfig(config) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
}
