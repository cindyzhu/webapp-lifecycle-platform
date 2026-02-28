/**
 * Asset report script (OE)
 *
 * After a sub-app is built, this script reads its build output
 * and updates config/apps.json with the deployed entry URL.
 *
 * Usage:
 *   npx tsx scripts/report-assets.ts --app sub-supplier --env test --url https://supplier.xxx.pages.dev
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);

function getArg(name: string): string {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) {
    console.error(`Missing required argument: --${name}`);
    process.exit(1);
  }
  return args[idx + 1];
}

const appName = getArg('app');
const env = getArg('env') as 'test' | 'staging' | 'production';
const url = getArg('url');

const configPath = resolve(__dirname, '../config/apps.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

const app = config.apps.find((a: { name: string }) => a.name === appName);
if (!app) {
  console.error(`App "${appName}" not found in apps.json`);
  process.exit(1);
}

app.deployed[env] = url;

writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
console.log(`Updated ${appName} entry for ${env}: ${url}`);
