import React from 'react';
import { styles } from '../styles/index.js';

export function Badge({ variant = 'default', children, onClick, style = {} }) {
  return (
    <span
      style={{ ...styles.badge(variant), ...style }}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}

export default Badge;
