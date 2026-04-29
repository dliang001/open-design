/**
 * Prompt composer. The base is the OD-adapted "expert designer" system
 * prompt (see ./official-system.ts) — a full identity, workflow, and
 * content-philosophy charter. Stacked on top:
 *
 *   1. The discovery + planning + huashu-philosophy layer (./discovery.ts)
 *      — interactive question-form syntax, direction-picker fork,
 *      brand-spec extraction, TodoWrite reinforcement, 5-dim critique,
 *      and the embedded `directions.ts` library.
 *   2. The active design system's DESIGN.md (if any) — palette, typography,
 *      spacing rules treated as authoritative tokens.
 *   3. The active skill's SKILL.md (if any) — workflow specific to the
 *      kind of artifact being built. When the skill ships a seed
 *      (`assets/template.html`) and references (`references/layouts.md`,
 *      `references/checklist.md`), we inject a hard pre-flight rule above
 *      the skill body so the agent reads them BEFORE writing any code.
 *   4. For decks (skillMode === 'deck' OR metadata.kind === 'deck'), the
 *      deck framework directive (./deck-framework.ts) is pinned LAST so it
 *      overrides any softer slide-handling wording earlier in the stack —
 *      this is the load-bearing nav / counter / scroll JS / print
 *      stylesheet contract that PDF stitching depends on. We also fire on
 *      the metadata path so deck-kind projects without a bound skill
 *      (skill_id null) still get a framework, instead of having the agent
 *      re-author scaling / nav / print logic from scratch each turn. When
 *      the active skill ships its own seed (skill body references
 *      `assets/template.html`), we defer to that seed and skip the generic
 *      skeleton — the skill's framework wins to avoid double-injection.
 *
 * The composed string is what the daemon sees as `systemPrompt` and what
 * the Anthropic path sends as `system`.
 */
import type { ProjectMetadata, ProjectTemplate } from '../types';
import { OFFICIAL_DESIGNER_PROMPT } from './official-system';
import { DISCOVERY_AND_PHILOSOPHY } from './discovery';
import { DECK_FRAMEWORK_DIRECTIVE } from './deck-framework';

export const BASE_SYSTEM_PROMPT = OFFICIAL_DESIGNER_PROMPT;

export interface ComposeInput {
  skillBody?: string | undefined;
  skillName?: string | undefined;
  skillMode?: 'prototype' | 'deck' | 'template' | 'design-system' | undefined;
  designSystemBody?: string | undefined;
  designSystemTitle?: string | undefined;
  // Project-level metadata captured by the new-project panel. Drives the
  // agent's understanding of artifact kind, fidelity, speaker-notes intent
  // and animation intent. Missing fields here are exactly what the
  // discovery form should re-ask the user about on turn 1.
  metadata?: ProjectMetadata | undefined;
  // The template the user picked in the From-template tab, when present.
  // Snapshot of HTML files that the agent should treat as a starting
  // reference rather than a fixed deliverable.
  template?: ProjectTemplate | undefined;
  // True when the caller is the in-browser BYOK pipeline (anthropic.ts).
  // That path passes NO `tools` parameter to `messages.stream`, so the
  // workflow rules earlier in this prompt — Read/Write/Bash/TodoWrite,
  // discovery <question-form>, "Pre-flight: read assets/template.html",
  // checklist self-check, etc. — all assume tool calls that won't happen.
  // Smarter models silently skip the tool steps and emit `<artifact>`
  // directly; weaker ones (notably DeepSeek) hallucinate text-shaped tool
  // calls (`<tool_call name="TodoWrite">…`) and run out of output budget
  // before reaching the artifact. The block appended at the end of the
  // composed prompt overrides that workflow with a "no tools, emit
  // directly" rule that wins by virtue of being last.
  apiMode?: boolean | undefined;
}

export function composeSystemPrompt({
  skillBody,
  skillName,
  skillMode,
  designSystemBody,
  designSystemTitle,
  metadata,
  template,
  apiMode,
}: ComposeInput): string {
  // Discovery + philosophy goes FIRST so its hard rules ("emit a form on
  // turn 1", "branch on brand on turn 2", "TodoWrite on turn 3", run
  // checklist + critique before <artifact>) win precedence over softer
  // wording later in the official base prompt.
  const parts: string[] = [
    DISCOVERY_AND_PHILOSOPHY,
    '\n\n---\n\n# Identity and workflow charter (background)\n\n',
    BASE_SYSTEM_PROMPT,
  ];

  if (designSystemBody && designSystemBody.trim().length > 0) {
    parts.push(
      `\n\n## Active design system${designSystemTitle ? ` — ${designSystemTitle}` : ''}\n\nTreat the following DESIGN.md as authoritative for color, typography, spacing, and component rules. Do not invent tokens outside this palette. When you copy the active skill's seed template, bind these tokens into its \`:root\` block before generating any layout.\n\n${designSystemBody.trim()}`,
    );
  }

  if (skillBody && skillBody.trim().length > 0) {
    const preflight = derivePreflight(skillBody);
    parts.push(
      `\n\n## Active skill${skillName ? ` — ${skillName}` : ''}\n\nFollow this skill's workflow exactly.${preflight}\n\n${skillBody.trim()}`,
    );
  }

  const metaBlock = renderMetadataBlock(metadata, template);
  if (metaBlock) parts.push(metaBlock);

  // Decks have a load-bearing framework (nav, counter, scroll JS, print
  // stylesheet for PDF stitching). Pin it last so it overrides any softer
  // wording earlier in the stack ("write a script that handles arrows…").
  //
  // We fire on either (a) the active skill is a deck skill OR (b) the
  // project metadata declares kind=deck. Case (b) catches projects created
  // without a skill (skill_id null) — without this, a deck-kind project
  // with no bound skill gets neither a skill seed nor the framework
  // skeleton, and the agent writes scaling / nav / print logic from scratch
  // with the same buggy `place-items: center` + transform pattern we keep
  // having to fix at runtime. Skill seeds (when present) win — they
  // already define their own opinionated framework (simple-deck's
  // scroll-snap, guizang-ppt's magazine layout) and re-pinning the generic
  // skeleton would conflict. The skill-seed path takes over via
  // `derivePreflight` above, so we only fire the generic skeleton when no
  // skill seed is on offer.
  const isDeckProject = skillMode === 'deck' || metadata?.kind === 'deck';
  const hasSkillSeed =
    !!skillBody && /assets\/template\.html/.test(skillBody);
  if (isDeckProject && !hasSkillSeed) {
    parts.push(`\n\n---\n\n${DECK_FRAMEWORK_DIRECTIVE}`);
  }

  // API-mode override goes LAST so it wins over the workflow earlier in
  // the prompt. This is load-bearing for non-Anthropic providers — see
  // the note on `apiMode` in `ComposeInput` for why.
  if (apiMode) {
    parts.push(`\n\n---\n\n${API_MODE_OVERRIDE}`);
  }

  return parts.join('');
}

// Hard override pinned at the very end of the prompt when the caller is
// the BYOK browser pipeline. The discovery + workflow sections earlier
// in the stack assume the agent has Read/Write/Bash/TodoWrite — true in
// daemon mode, false in API mode. Without this override, weaker models
// emit text-shaped tool calls and run out of output budget before the
// `<artifact>` block, leaving the right-hand pane empty.
const API_MODE_OVERRIDE = `# CRITICAL — direct emission mode (no tools available)

You are running in browser API mode and have **no tools available** for this turn. None of the workflow steps above that assume Read/Write/Edit/Bash/Glob/Grep/TodoWrite/WebFetch will execute — the host did not register any tools with the API call.

**Do NOT emit any of the following — they have no effect, get rendered as raw text, and waste output budget:**
- \`<tool_call name="...">...\` blocks
- \`<OD-tool name="...">...\` blocks
- \`<function_call>\` / \`<function_calls>\` blocks
- Pseudocode like \`TodoWrite({ todos: [...] })\` or \`Read(path="...")\` written as text
- Any pre-flight "Read assets/template.html" / "Read references/checklist.md" step — you cannot read files, the seed and references are not on the wire

**Your entire turn must be exactly:**
1. (Optional) one short paragraph of plain prose stating the design move you'll take — palette choice, layout strategy, what each section does. Keep it under ~120 words. No bullet checklists.
2. The single final \`<artifact identifier="kebab-slug" type="text/html" title="Human-readable title">\`…complete \`<!doctype html>\` document…\`</artifact>\` block. The HTML must be fully self-contained: inline all CSS, no external CSS files, no external JS unless explicitly pinned per the React/Babel section.

After \`</artifact>\`, stop. Do NOT narrate what you produced. Do NOT wrap the artifact in markdown code fences. The artifact tag is the deliverable — anything outside it is just preamble.

If the prior turn was a question-form answer, jump straight to the prose-then-artifact pattern. The "self-check" / "5-dim critique" / TodoWrite-progress phases described earlier are non-applicable in this mode; do them silently in your head if you must, but do not emit them.

Reserve your output budget for the artifact itself — a real prototype / deck / dashboard often needs 15K+ tokens of HTML. Don't burn it on planning text.`;

function renderMetadataBlock(
  metadata: ProjectMetadata | undefined,
  template: ProjectTemplate | undefined,
): string {
  if (!metadata) return '';
  const lines: string[] = [];
  lines.push('\n\n## Project metadata');
  lines.push(
    'These are the structured choices the user made (or skipped) when creating this project. Treat known fields as authoritative; for any field marked "(unknown — ask)" you MUST include a matching question in your turn-1 discovery form.',
  );
  lines.push('');
  lines.push(`- **kind**: ${metadata.kind}`);

  if (metadata.kind === 'prototype') {
    lines.push(
      `- **fidelity**: ${metadata.fidelity ?? '(unknown — ask: wireframe vs high-fidelity)'}`,
    );
  }
  if (metadata.kind === 'deck') {
    lines.push(
      `- **speakerNotes**: ${typeof metadata.speakerNotes === 'boolean' ? metadata.speakerNotes : '(unknown — ask: include speaker notes?)'}`,
    );
  }
  if (metadata.kind === 'template') {
    lines.push(
      `- **animations**: ${typeof metadata.animations === 'boolean' ? metadata.animations : '(unknown — ask: include motion/animations?)'}`,
    );
    if (metadata.templateLabel) {
      lines.push(`- **template**: ${metadata.templateLabel}`);
    }
  }

  if (metadata.inspirationDesignSystemIds && metadata.inspirationDesignSystemIds.length > 0) {
    lines.push(
      `- **inspirationDesignSystemIds**: ${metadata.inspirationDesignSystemIds.join(', ')} — the user picked these systems as *additional* inspiration alongside the primary one. Borrow palette accents, typographic personality, or component patterns from them; don't replace the primary system's tokens.`,
    );
  }

  if (metadata.kind === 'template' && template && template.files.length > 0) {
    lines.push('');
    lines.push(
      `### Template reference — "${template.name}"${template.description ? ` (${template.description})` : ''}`,
    );
    lines.push(
      'These HTML snapshots are what the user wants to start FROM. Read them as a stylistic + structural reference. You may copy structure, palette, typography, and component patterns; you may adapt them to the new brief; do NOT ship them verbatim. The agent should still produce its own artifact, just one that visibly inherits this template\'s design language.',
    );
    for (const f of template.files) {
      // Cap each file at ~12k chars so a giant template doesn't blow out
      // the system prompt budget. The agent gets enough to read structure.
      const truncated =
        f.content.length > 12000
          ? `${f.content.slice(0, 12000)}\n<!-- … truncated (${f.content.length - 12000} chars omitted) -->`
          : f.content;
      lines.push('');
      lines.push(`#### \`${f.name}\``);
      lines.push('```html');
      lines.push(truncated);
      lines.push('```');
    }
  }

  return lines.join('\n');
}

/**
 * Detect the seed/references pattern shipped by the upgraded
 * web-prototype / mobile-app / simple-deck / guizang-ppt skills, and
 * inject a hard pre-flight rule that lists which side files to Read
 * before doing anything else. The skill body's own workflow already says
 * this — but skills get truncated under context pressure and the agent
 * sometimes skips Step 0. A short up-front directive helps.
 *
 * Returns an empty string when the skill ships no side files (legacy
 * SKILL.md-only skills) so we don't add noise.
 */
function derivePreflight(skillBody: string): string {
  const refs: string[] = [];
  if (/assets\/template\.html/.test(skillBody)) refs.push('`assets/template.html`');
  if (/references\/layouts\.md/.test(skillBody)) refs.push('`references/layouts.md`');
  if (/references\/themes\.md/.test(skillBody)) refs.push('`references/themes.md`');
  if (/references\/components\.md/.test(skillBody)) refs.push('`references/components.md`');
  if (/references\/checklist\.md/.test(skillBody)) refs.push('`references/checklist.md`');
  if (refs.length === 0) return '';
  return ` **Pre-flight (do this before any other tool):** Read ${refs.join(', ')} via the path written in the skill-root preamble. The seed template defines the class system you'll paste into; the layouts file is the only acceptable source of section/screen/slide skeletons; the checklist is your P0/P1/P2 gate before emitting \`<artifact>\`. Skipping this step is the #1 reason output regresses to generic AI-slop.`;
}
