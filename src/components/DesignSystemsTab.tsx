import { useEffect, useMemo, useState } from 'react';
import { useT } from '../i18n';
import type { DesignSystemSummary } from '../types';

interface Props {
  systems: DesignSystemSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
}

const CATEGORY_ORDER = [
  'Starter',
  'AI & LLM',
  'Developer Tools',
  'Productivity & SaaS',
  'Backend & Data',
  'Design & Creative',
  'Fintech & Crypto',
  'E-Commerce & Retail',
  'Media & Consumer',
  'Automotive',
];

// Show at most this many tag pills inline; the rest collapse behind a
// "more…" affordance so the filter row doesn't wrap into multiple lines on
// systems with sparse-but-many tags.
const TAG_PILL_LIMIT = 12;

export function DesignSystemsTab({ systems, selectedId, onSelect, onPreview }: Props) {
  const t = useT();
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [tag, setTag] = useState<string>('All');
  const [showAllTags, setShowAllTags] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const s of systems) cats.add(s.category || 'Uncategorized');
    const ordered: string[] = [];
    for (const c of CATEGORY_ORDER) if (cats.has(c)) ordered.push(c);
    for (const c of [...cats].sort()) if (!ordered.includes(c)) ordered.push(c);
    return ['All', ...ordered];
  }, [systems]);

  // Aggregate tag frequencies across the visible-by-category subset so the
  // pill row reflects what the user can actually narrow down to right now.
  // Tags from the current category appear ranked by frequency desc → name asc.
  const tagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of systems) {
      if (category !== 'All' && (s.category || 'Uncategorized') !== category) continue;
      for (const t of s.tags ?? []) {
        if (!t) continue;
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [systems, category]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return systems.filter((s) => {
      if (category !== 'All' && (s.category || 'Uncategorized') !== category) return false;
      if (tag !== 'All' && !(s.tags ?? []).includes(tag)) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        (s.tags ?? []).some((t) => t.includes(q))
      );
    });
  }, [systems, filter, category, tag]);

  // The category metadata coming from each design system is authored in
  // English. We translate the well-known buckets (All / Uncategorized) but
  // pass the rest through unchanged so user-facing labels stay aligned with
  // the underlying tags.
  const renderCategory = (c: string) => {
    if (c === 'All') return t('ds.categoryAll');
    if (c === 'Uncategorized') return t('ds.categoryUncategorized');
    return c;
  };

  // If the active tag is no longer a member of the visible set after the
  // category changed, fall back to "All" so the list isn't silently empty.
  useEffect(() => {
    if (tag === 'All') return;
    if (!tagOptions.some((o) => o.name === tag)) setTag('All');
  }, [tag, tagOptions]);

  const visibleTags = showAllTags ? tagOptions : tagOptions.slice(0, TAG_PILL_LIMIT);
  const hasOverflow = tagOptions.length > visibleTags.length;

  return (
    <div className="tab-panel">
      <div className="tab-panel-toolbar">
        <input
          placeholder={t('ds.searchPlaceholder')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setTag('All');
            setShowAllTags(false);
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {renderCategory(c)}
            </option>
          ))}
        </select>
      </div>
      {tagOptions.length > 0 ? (
        <div
          className="examples-filter-row"
          role="tablist"
          aria-label={t('ds.tagsLabel')}
        >
          <span className="examples-filter-label">{t('ds.tagsLabel')}</span>
          <button
            type="button"
            role="tab"
            aria-selected={tag === 'All'}
            className={`filter-pill ${tag === 'All' ? 'active' : ''}`}
            onClick={() => setTag('All')}
          >
            {t('ds.tagAll')}
          </button>
          {visibleTags.map((opt) => (
            <button
              key={opt.name}
              type="button"
              role="tab"
              aria-selected={tag === opt.name}
              className={`filter-pill ${tag === opt.name ? 'active' : ''}`}
              onClick={() => setTag(opt.name)}
              title={`${opt.name} (${opt.count})`}
            >
              {opt.name}
              <span className="filter-pill-count">{opt.count}</span>
            </button>
          ))}
          {hasOverflow ? (
            <button
              type="button"
              className="filter-pill"
              onClick={() => setShowAllTags(true)}
              title={`+${tagOptions.length - visibleTags.length}`}
            >
              {`+${tagOptions.length - visibleTags.length}`}
            </button>
          ) : null}
        </div>
      ) : null}
      {filtered.length === 0 ? (
        <div className="tab-empty">{t('ds.emptyNoMatch')}</div>
      ) : (
        <div className="ds-list">
          {filtered.map((s) => {
            const active = s.id === selectedId;
            return (
              <div
                key={s.id}
                className={`ds-row ${active ? 'active' : ''}`}
                onClick={() => onSelect(s.id)}
              >
                <div className="ds-row-body">
                  <div className="ds-row-title">
                    {s.title}
                    {active ? (
                      <span className="ds-row-default">
                        {t('ds.badgeDefault')}
                      </span>
                    ) : null}
                  </div>
                  <div className="ds-row-summary">{s.summary || s.category}</div>
                </div>
                {s.swatches && s.swatches.length > 0 ? (
                  <div className="ds-row-swatches" aria-hidden>
                    {s.swatches.map((c, i) => (
                      <span
                        key={i}
                        className="ds-row-swatch"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                ) : null}
                <button
                  className="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(s.id);
                  }}
                  title={t('ds.previewTitle')}
                >
                  {t('ds.preview')}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
