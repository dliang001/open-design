/**
 * Provider presets for the API (BYOK) execution mode.
 *
 * Both Anthropic and DeepSeek expose the same wire format
 * (`/v1/messages` Anthropic-style), so the same `@anthropic-ai/sdk`
 * client works for either as long as `baseURL` is set correctly.
 *
 * The key never leaves the browser — `loadConfig()` reads from
 * localStorage and `streamMessage()` calls the chosen base URL directly.
 */

export type ProviderId = 'anthropic' | 'deepseek' | 'custom';

export interface ProviderPreset {
  id: ProviderId;
  label: string;
  baseUrl: string;
  /** Suggested model ids — shown as a `<datalist>` so the user can still
   *  type a custom value. The first entry is used as the default when
   *  switching to this preset. */
  models: string[];
  /** Common prefix of valid keys, e.g. `sk-ant-` for Anthropic. Empty
   *  when the provider doesn't publish a stable prefix. */
  keyPrefix?: string;
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'anthropic',
    label: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    models: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-4-5'],
    keyPrefix: 'sk-ant-',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/anthropic',
    models: [
      'deepseek-v4-flash',
      'deepseek-v4-pro',
      'deepseek-chat',
      'deepseek-reasoner',
    ],
    keyPrefix: 'sk-',
  },
];

/** Match a base URL back to a preset id so the picker stays in sync when
 *  the user reopens settings. Anything we don't recognise becomes
 *  'custom' so the user can keep their own endpoint. */
export function detectProvider(baseUrl: string): ProviderId {
  const url = (baseUrl || '').trim().toLowerCase();
  if (!url) return 'anthropic';
  for (const p of PROVIDER_PRESETS) {
    if (url.startsWith(p.baseUrl.toLowerCase())) return p.id;
  }
  return 'custom';
}

export function getPreset(id: ProviderId): ProviderPreset | undefined {
  return PROVIDER_PRESETS.find((p) => p.id === id);
}
