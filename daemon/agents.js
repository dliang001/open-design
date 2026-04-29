import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, readFileSync } from 'node:fs';
import { delimiter } from 'node:path';
import path from 'node:path';

const execFileP = promisify(execFile);

// Each entry defines how to invoke the agent in non-interactive "one-shot" mode.
// `buildArgs(prompt, imagePaths)` returns argv for the child process. The
// daemon decides what `prompt` actually is:
//   - With no quirks: the full composed prompt (systemPrompt + transcript +
//     cwdHint + attachments). Subject to Windows ~32 KB command-line limit.
//   - With `promptViaStdin: true`: an empty string. The composed prompt
//     goes via child.stdin instead. The CLI must read from stdin in
//     non-interactive mode (Gemini does — its -p is "appended to input
//     on stdin (if any)").
//   - On Windows when the prompt would blow the argv limit: a tiny
//     bootstrap message — "Read the file at <path> for your complete
//     instructions" — and the real composed prompt is written to a
//     dot-prefixed file in cwd. Universal because every code agent we
//     support has a Read tool. Borrowed from nexu-io/open-design upstream.
// `streamFormat` hints to the daemon how to interpret stdout:
//   - 'claude-stream-json' : line-delimited JSON emitted by Claude Code's
//     `--output-format stream-json`. Daemon parses it into typed events
//     (text / thinking / tool_use / tool_result / status) for the UI.
//   - 'plain' (default)    : raw text, forwarded chunk-by-chunk.
export const AGENT_DEFS = [
  {
    id: 'claude',
    name: 'Claude Code',
    bin: 'claude',
    versionArgs: ['--version'],
    buildArgs: (prompt) => [
      '-p',
      prompt,
      '--output-format',
      'stream-json',
      '--verbose',
      '--include-partial-messages',
    ],
    streamFormat: 'claude-stream-json',
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    bin: 'codex',
    versionArgs: ['--version'],
    buildArgs: (prompt) => ['exec', prompt],
    streamFormat: 'plain',
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    bin: 'gemini',
    versionArgs: ['--version'],
    // Gemini's --help: `-p, --prompt    Prompt. Appended to input on
    // stdin (if any).` So we pipe the composed prompt via stdin and
    // pass an empty -p; result is the stdin content. Keeps argv tiny.
    buildArgs: () => [],
    promptViaStdin: true,
    streamFormat: 'plain',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    bin: 'opencode',
    versionArgs: ['--version'],
    buildArgs: (prompt) => ['run', prompt],
    streamFormat: 'plain',
  },
  {
    id: 'cursor-agent',
    name: 'Cursor Agent',
    bin: 'cursor-agent',
    versionArgs: ['--version'],
    buildArgs: (prompt) => ['-p', prompt],
    streamFormat: 'plain',
  },
  {
    id: 'qwen',
    name: 'Qwen Code',
    bin: 'qwen',
    versionArgs: ['--version'],
    buildArgs: (prompt) => ['-p', prompt],
    streamFormat: 'plain',
  },
];

export function resolveOnPath(bin) {
  const exts =
    process.platform === 'win32'
      ? (process.env.PATHEXT || '.EXE;.CMD;.BAT').split(';')
      : [''];
  const dirs = (process.env.PATH || '').split(delimiter);
  for (const dir of dirs) {
    for (const ext of exts) {
      const full = path.join(dir, bin + ext);
      if (full && existsSync(full)) return full;
    }
  }
  return null;
}

// On Windows, npm-installed CLIs ship as .CMD shim wrappers. Spawning a
// .cmd directly is blocked by Node 20.12+ (CVE-2024-27980 mitigation,
// returns EINVAL); the only escape with raw spawn is `shell: true`,
// which routes through cmd.exe and inherits its ~8 KB command-line
// limit. Our composed prompts are 20–50 KB once the system prompt and
// skill body are folded in, so the cmd.exe path quickly hits
// ENAMETOOLONG.
//
// This helper reads the .CMD shim and extracts the underlying real
// executable so we can spawn it directly via CreateProcess, which
// raises the limit to ~32 KB and skips both the EINVAL ban and shell
// quoting. Two shim shapes cover the CLIs we ship:
//
//   1. Claude Code-style — direct .exe forwarder:
//        "%dp0%\…\bin\claude.exe"   %*
//
//   2. npm-cmd-shim — node + script forwarder:
//        & "%_prog%"  "%dp0%\…\dist\index.js" %*
//
// Returns `{ exe, prepend }` so callers can do `spawn(exe,
// [...prepend, ...args])`. Returns null if the shim doesn't match
// either shape — caller falls back to `shell: true` for that case.
export function unwrapWindowsShim(cmdPath) {
  if (!cmdPath || !/\.cmd$/i.test(cmdPath)) return null;
  let content;
  try {
    content = readFileSync(cmdPath, 'utf8');
  } catch {
    return null;
  }
  const dir = path.dirname(cmdPath);

  // Pattern 1 — direct .exe wrapper. The rest of the line after the
  // path is `%*` (forward all args). Allow extra whitespace.
  const exeMatch = content.match(/"%dp0%\\(.+?\.exe)"\s+%\*/i);
  if (exeMatch) {
    const exePath = path.join(dir, exeMatch[1]);
    if (existsSync(exePath)) return { exe: exePath, prepend: [] };
  }

  // Pattern 2 — npm-cmd-shim: spawns node (or a sibling node.exe) with
  // a .js script. We try a sibling `node.exe` first because the shim
  // uses it when present; otherwise fall back to the system `node` on
  // PATH (we let resolveOnPath handle that).
  const nodeMatch = content.match(/"%_prog%"\s+"%dp0%\\(.+?\.js)"\s+%\*/i);
  if (nodeMatch) {
    const scriptPath = path.join(dir, nodeMatch[1]);
    if (existsSync(scriptPath)) {
      const localNode = path.join(dir, 'node.exe');
      const exe = existsSync(localNode)
        ? localNode
        : (resolveOnPath('node') || 'node');
      return { exe, prepend: [scriptPath] };
    }
  }

  return null;
}

async function probe(def) {
  const resolved = resolveOnPath(def.bin);
  if (!resolved) return { ...stripFns(def), available: false };
  let version = null;
  try {
    const { stdout } = await execFileP(resolved, def.versionArgs, { timeout: 3000 });
    version = stdout.trim().split('\n')[0];
  } catch {
    // binary exists but --version failed; still mark available
  }
  return { ...stripFns(def), available: true, path: resolved, version };
}

function stripFns(def) {
  const { buildArgs, ...rest } = def;
  return rest;
}

export async function detectAgents() {
  return Promise.all(AGENT_DEFS.map(probe));
}

export function getAgentDef(id) {
  return AGENT_DEFS.find((a) => a.id === id) || null;
}
