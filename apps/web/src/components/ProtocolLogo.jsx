import React, { useMemo, useState, useEffect } from 'react';
import { theme } from '../styles/index.js';
import { buildProtocolLogoCandidates } from '../utils/index.js';

export function ProtocolLogo({ row }) {
  const candidates = useMemo(() => buildProtocolLogoCandidates(row), [row]);
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    setLogoIndex(0);
  }, [candidates.join('|')]);

  if (logoIndex >= candidates.length) {
    return (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: theme.radius.sm,
        background: theme.colors.gradientPrimary,
        opacity: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}>
        {(row.platformName || row.provider || '?').charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={candidates[logoIndex]}
      alt={row.platformName || row.provider}
      width={32}
      height={32}
      style={{
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.bgInput,
        flexShrink: 0,
      }}
      onError={() => {
        setLogoIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : candidates.length));
      }}
    />
  );
}

export default ProtocolLogo;
