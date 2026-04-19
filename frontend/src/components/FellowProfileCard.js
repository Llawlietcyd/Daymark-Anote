import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSession } from './SessionContext';

export const FELLOW_PROFILE_STORAGE_KEY_PREFIX = 'dp_fellow_profile_v2';

const DEFAULT_PROFILE = {
  researchTopic: '',
  assignedProduct: '',
  paperTarget: '',
};

function fellowProfileStorageKey(userId) {
  const suffix = userId ? String(userId) : 'guest';
  return `${FELLOW_PROFILE_STORAGE_KEY_PREFIX}:${suffix}`;
}

export function readFellowProfile(userId) {
  try {
    const raw = window.localStorage.getItem(fellowProfileStorageKey(userId));
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function writeFellowProfile(userId, profile) {
  try {
    window.localStorage.setItem(fellowProfileStorageKey(userId), JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('dp-fellow-profile-updated', { detail: { profile, userId } }));
  } catch {}
}

function FellowProfileCard() {
  const { lang } = useLanguage();
  const { session } = useSession();
  const userId = session?.user_id || null;
  const [profile, setProfile] = useState(() => readFellowProfile(userId));
  const [editing, setEditing] = useState(() => {
    const p = readFellowProfile(userId);
    return !p.researchTopic && !p.assignedProduct;
  });
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  useEffect(() => {
    const nextProfile = readFellowProfile(userId);
    setProfile(nextProfile);
    setEditing(!nextProfile.researchTopic && !nextProfile.assignedProduct);
  }, [userId]);

  const copy = useMemo(
    () => (
      lang === 'zh'
        ? {
            eyebrow: 'Fellow profile',
            title: '你在 fellowship 里的身份',
            hint: '填完之后 Today 面板会显示你正在推进的 paper 和 product，让 fellowship 的 context 一直在。',
            researchLabel: 'Research topic',
            researchPlaceholder: '例如：Deletion-aware planning agents',
            productLabel: 'Assigned Anote product',
            productPlaceholder: '例如：anote-ai/Research',
            venueLabel: 'Target paper venue (optional)',
            venuePlaceholder: 'arXiv + NeurIPS workshop',
            save: '保存',
            edit: '编辑',
            empty: '还没填——点"编辑"配置一下。',
            snapshot: 'Current focus',
          }
        : {
            eyebrow: 'Fellow profile',
            title: 'Your fellowship identity',
            hint: 'Once filled, the Today panel keeps your active paper and product visible so the fellowship context is always present.',
            researchLabel: 'Research topic',
            researchPlaceholder: 'e.g. Deletion-aware planning agents',
            productLabel: 'Assigned Anote product',
            productPlaceholder: 'e.g. anote-ai/Research',
            venueLabel: 'Target paper venue (optional)',
            venuePlaceholder: 'arXiv + NeurIPS workshop',
            save: 'Save',
            edit: 'Edit',
            empty: 'Not set yet — tap Edit to configure.',
            snapshot: 'Current focus',
          }
    ),
    [lang]
  );

  const handleSave = useCallback(() => {
    const clean = {
      researchTopic: (draft.researchTopic || '').trim(),
      assignedProduct: (draft.assignedProduct || '').trim(),
      paperTarget: (draft.paperTarget || '').trim(),
    };
    setProfile(clean);
    writeFellowProfile(userId, clean);
    setEditing(false);
  }, [draft, userId]);

  const hasProfile = profile.researchTopic || profile.assignedProduct || profile.paperTarget;

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="panel-label">{copy.eyebrow}</div>
          <h2 className="mt-2 text-[22px] leading-tight text-[color:var(--text)]">{copy.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--muted)]">{copy.hint}</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="btn-ghost !rounded-[16px] !px-3">
            {copy.edit}
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-[color:var(--muted)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{copy.researchLabel}</span>
            <input
              type="text"
              value={draft.researchTopic}
              onChange={(e) => setDraft((d) => ({ ...d, researchTopic: e.target.value }))}
              placeholder={copy.researchPlaceholder}
              className="w-full rounded-[16px] border border-[color:var(--line-strong)] bg-white px-3 py-2 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--accent)]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-[color:var(--muted)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{copy.productLabel}</span>
            <input
              type="text"
              value={draft.assignedProduct}
              onChange={(e) => setDraft((d) => ({ ...d, assignedProduct: e.target.value }))}
              placeholder={copy.productPlaceholder}
              className="w-full rounded-[16px] border border-[color:var(--line-strong)] bg-white px-3 py-2 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--accent)]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-[color:var(--muted)] md:col-span-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{copy.venueLabel}</span>
            <input
              type="text"
              value={draft.paperTarget}
              onChange={(e) => setDraft((d) => ({ ...d, paperTarget: e.target.value }))}
              placeholder={copy.venuePlaceholder}
              className="w-full rounded-[16px] border border-[color:var(--line-strong)] bg-white px-3 py-2 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--accent)]"
            />
          </label>
          <div className="md:col-span-2">
            <button type="button" onClick={handleSave} className="btn-primary">
              {copy.save}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {!hasProfile ? (
            <p className="text-sm text-[color:var(--muted)]">{copy.empty}</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {profile.researchTopic && (
                <ProfileTile label={copy.researchLabel} value={profile.researchTopic} />
              )}
              {profile.assignedProduct && (
                <ProfileTile label={copy.productLabel} value={profile.assignedProduct} />
              )}
              {profile.paperTarget && (
                <ProfileTile label={copy.venueLabel} value={profile.paperTarget} />
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ProfileTile({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[color:var(--line)] bg-white/80 px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-1 text-sm text-[color:var(--text)]">{value}</div>
    </div>
  );
}

export default FellowProfileCard;
