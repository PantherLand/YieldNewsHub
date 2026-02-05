import React, { useState, useEffect } from 'react';
import { theme } from '../styles/index.js';

export function ChainLogo({ src, label }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        lineHeight: 1,
        background: 'rgba(100, 116, 139, 0.2)',
        color: theme.colors.textMuted,
        border: `1px solid ${theme.colors.border}`,
      }}>
        {(label || '?').charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      width={12}
      height={12}
      style={{ borderRadius: '50%' }}
      onError={() => setFailed(true)}
    />
  );
}

export default ChainLogo;
