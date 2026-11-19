// Leonida Trophy Guide — the entrypoint (Node 22, standard library only).
//
// What this program does: it takes this repository's guide — the static files in
// app/ and the screenshots in screenshots/ — and lays them out in the output
// directory, then writes dossier.json there with the vendored make.fun library.
// The dossier is the summary the judge reads: the screenshots, the first load's
// files and bytes, and the guide's source.
//
// The guide itself needs no build step: app/index.html opens in any static file
// server with app/ at its root, and works in desktop Chrome with the network off.
// vendor/makefun-frontend.ts is the kit's copy and must stay untouched: the scorer
// rebuilds dossier.json with its own copy and requires a byte-for-byte match.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.)
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's own limits: at most 4 screenshots and none over
// 256 KiB, at most 993 files and directories in app/ totalling 48 MiB, and the
// dossier text capped at 160 KiB. The scorer refuses anything past those limits,
// so the build refuses it here first.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
