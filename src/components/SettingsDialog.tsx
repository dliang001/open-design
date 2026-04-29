import { useEffect, useMemo, useState } from 'react';
import { LOCALE_LABEL, LOCALES, useI18n } from '../i18n';
import type { Locale } from '../i18n';
import { AgentIcon } from './AgentIcon';
import {
  PROVIDER_PRESETS,
  detectProvider,
  getPreset,
  type ProviderId,
} from '../providers/presets';
import type { AgentInfo, AppConfig, ExecMode } from '../types';

interface Props {
  initial: AppConfig;
  agents: AgentInfo[];
  daemonLive: boolean;
  welcome?: boolean;
  onSave: (cfg: AppConfig) => void;
  onClose: () => void;
  onRefreshAgents: () => void;
}

export function SettingsDialog({
  initial,
  agents,
  daemonLive,
  welcome,
  onSave,
  onClose,
  onRefreshAgents,
}: Props) {
  const { t, locale, setLocale } = useI18n();
  const [cfg, setCfg] = useState<AppConfig>(initial);
  const [showApiKey, setShowApiKey] = useState(false);
  const provider: ProviderId = useMemo(
    () => detectProvider(cfg.baseUrl),
    [cfg.baseUrl],
  );
  const suggestedModels = useMemo(
    () => getPreset(provider)?.models ?? [],
    [provider],
  );

  // If the daemon goes offline mid-edit, force API mode so the UI doesn't
  // pretend Local CLI is selectable.
  useEffect(() => {
    if (!daemonLive && cfg.mode === 'daemon') {
      setCfg((c) => ({ ...c, mode: 'api' }));
    }
  }, [daemonLive, cfg.mode]);

  const installedCount = useMemo(
    () => agents.filter((a) => a.available).length,
    [agents],
  );

  const setMode = (mode: ExecMode) => setCfg((c) => ({ ...c, mode }));

  // Switching provider rewrites baseUrl + (when the current model isn't
  // valid for the new provider) the model. We never wipe the API key.
  function selectProvider(id: ProviderId) {
    if (id === 'custom') {
      setCfg((c) => ({ ...c, baseUrl: '' }));
      return;
    }
    const preset = getPreset(id);
    if (!preset) return;
    setCfg((c) => {
      const nextModel = preset.models.includes(c.model)
        ? c.model
        : preset.models[0] ?? c.model;
      return { ...c, baseUrl: preset.baseUrl, model: nextModel };
    });
  }

  const canSave =
    cfg.mode === 'daemon'
      ? Boolean(cfg.agentId && agents.find((a) => a.id === cfg.agentId)?.available)
      : Boolean(cfg.apiKey.trim() && cfg.model.trim() && cfg.baseUrl.trim());

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal modal-settings"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          {welcome ? (
            <>
              <span className="kicker">{t('settings.welcomeKicker')}</span>
              <h2>{t('settings.welcomeTitle')}</h2>
              <p className="subtitle">{t('settings.welcomeSubtitle')}</p>
            </>
          ) : (
            <>
              <span className="kicker">{t('settings.kicker')}</span>
              <h2>{t('settings.title')}</h2>
              <p className="subtitle">{t('settings.subtitle')}</p>
            </>
          )}
        </header>

        <div
          className="seg-control"
          role="tablist"
          aria-label={t('settings.modeAria')}
        >
          <button
            type="button"
            role="tab"
            aria-selected={cfg.mode === 'daemon'}
            className={'seg-btn' + (cfg.mode === 'daemon' ? ' active' : '')}
            disabled={!daemonLive}
            onClick={() => setMode('daemon')}
            title={
              daemonLive
                ? t('settings.modeDaemonHelp')
                : t('settings.modeDaemonOffline')
            }
          >
            <span className="seg-title">{t('settings.modeDaemon')}</span>
            <span className="seg-meta">
              {daemonLive
                ? t('settings.modeDaemonInstalledMeta', { count: installedCount })
                : t('settings.modeDaemonOfflineMeta')}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={cfg.mode === 'api'}
            className={'seg-btn' + (cfg.mode === 'api' ? ' active' : '')}
            onClick={() => setMode('api')}
          >
            <span className="seg-title">{t('settings.modeApi')}</span>
            <span className="seg-meta">{t('settings.modeApiMeta')}</span>
          </button>
        </div>

        {cfg.mode === 'daemon' ? (
          <section className="settings-section">
            <div className="section-head">
              <div>
                <h3>{t('settings.codeAgent')}</h3>
                <p className="hint">{t('settings.codeAgentHint')}</p>
              </div>
              <button
                type="button"
                className="ghost icon-btn"
                onClick={onRefreshAgents}
                title={t('settings.rescanTitle')}
              >
                {t('settings.rescan')}
              </button>
            </div>
            {agents.length === 0 ? (
              <div className="empty-card">
                {t('settings.noAgentsDetected')}
              </div>
            ) : (
              <div className="agent-grid">
                {agents.map((a) => {
                  const active = cfg.agentId === a.id;
                  return (
                    <button
                      type="button"
                      key={a.id}
                      className={
                        'agent-card' +
                        (active ? ' active' : '') +
                        (a.available ? '' : ' disabled')
                      }
                      onClick={() =>
                        a.available && setCfg((c) => ({ ...c, agentId: a.id }))
                      }
                      disabled={!a.available}
                      aria-pressed={active}
                    >
                      <AgentIcon id={a.id} size={40} />
                      <div className="agent-card-body">
                        <div className="agent-card-name">{a.name}</div>
                        <div className="agent-card-meta">
                          {a.available ? (
                            a.version ? (
                              <span title={a.path ?? ''}>{a.version}</span>
                            ) : (
                              <span title={a.path ?? ''}>
                                {t('common.installed')}
                              </span>
                            )
                          ) : (
                            <span className="muted">
                              {t('common.notInstalled')}
                            </span>
                          )}
                        </div>
                      </div>
                      {a.available ? (
                        <span
                          className={'status-dot' + (active ? ' active' : '')}
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="settings-section">
            <div className="section-head">
              <h3>{t('settings.apiSection')}</h3>
            </div>
            <label className="field">
              <span className="field-label">{t('settings.provider')}</span>
              <div
                className="seg-control"
                role="tablist"
                aria-label={t('settings.provider')}
              >
                {PROVIDER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={provider === p.id}
                    className={'seg-btn' + (provider === p.id ? ' active' : '')}
                    onClick={() => selectProvider(p.id)}
                  >
                    <span className="seg-title">{p.label}</span>
                    <span className="seg-meta">{safeHost(p.baseUrl)}</span>
                  </button>
                ))}
                <button
                  type="button"
                  role="tab"
                  aria-selected={provider === 'custom'}
                  className={'seg-btn' + (provider === 'custom' ? ' active' : '')}
                  onClick={() => selectProvider('custom')}
                >
                  <span className="seg-title">{t('settings.providerCustom')}</span>
                  <span className="seg-meta">{t('settings.providerCustomMeta')}</span>
                </button>
              </div>
            </label>
            <label className="field">
              <span className="field-label">{t('settings.apiKey')}</span>
              <div className="field-row">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder={
                    getPreset(provider)?.keyPrefix
                      ? `${getPreset(provider)?.keyPrefix}...`
                      : 'sk-...'
                  }
                  value={cfg.apiKey}
                  onChange={(e) => setCfg({ ...cfg, apiKey: e.target.value })}
                  autoFocus
                />
                <button
                  type="button"
                  className="ghost icon-btn"
                  onClick={() => setShowApiKey((v) => !v)}
                  title={
                    showApiKey ? t('settings.hideKey') : t('settings.showKey')
                  }
                >
                  {showApiKey ? t('settings.hide') : t('settings.show')}
                </button>
              </div>
            </label>
            <label className="field">
              <span className="field-label">{t('settings.model')}</span>
              <input
                type="text"
                value={cfg.model}
                list="suggested-models"
                onChange={(e) => setCfg({ ...cfg, model: e.target.value })}
              />
              <datalist id="suggested-models">
                {suggestedModels.map((m) => (
                  <option value={m} key={m} />
                ))}
              </datalist>
              {suggestedModels.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  {suggestedModels.map((m) => {
                    const active = cfg.model === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCfg({ ...cfg, model: m })}
                        aria-pressed={active}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          lineHeight: 1.4,
                          border: '1px solid var(--border-soft)',
                          background: active ? 'var(--accent-soft, #f6e9e0)' : 'transparent',
                          color: active ? 'var(--text)' : 'var(--text-muted)',
                          fontWeight: active ? 600 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </label>
            <label className="field">
              <span className="field-label">{t('settings.baseUrl')}</span>
              <input
                type="text"
                value={cfg.baseUrl}
                onChange={(e) => setCfg({ ...cfg, baseUrl: e.target.value })}
              />
            </label>
            <p className="hint">
              {provider === 'deepseek'
                ? t('settings.deepseekHint')
                : t('settings.apiHint')}
            </p>
          </section>
        )}

        <section className="settings-section">
          <div className="section-head">
            <div>
              <h3>{t('settings.language')}</h3>
              <p className="hint">{t('settings.languageHint')}</p>
            </div>
          </div>
          <div
            className="seg-control"
            role="tablist"
            aria-label={t('settings.language')}
          >
            {LOCALES.map((code) => {
              const active = locale === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={'seg-btn' + (active ? ' active' : '')}
                  onClick={() => setLocale(code as Locale)}
                >
                  <span className="seg-title">{LOCALE_LABEL[code]}</span>
                  <span className="seg-meta">{code}</span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="modal-foot">
          <button type="button" className="ghost" onClick={onClose}>
            {welcome ? t('settings.skipForNow') : t('common.cancel')}
          </button>
          <button
            type="button"
            className="primary"
            disabled={!canSave}
            onClick={() => {
              onSave(cfg);
              onClose();
            }}
          >
            {welcome ? t('settings.getStarted') : t('common.save')}
          </button>
        </footer>
      </div>
    </div>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
