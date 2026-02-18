import { Switch as HeadlessSwitch } from '@headlessui/react';
import { theme } from '../../styles/theme.js';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  switch: (enabled) => ({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: '44px',
    height: '24px',
    borderRadius: theme.radius.full,
    background: enabled ? theme.colors.gradientPrimary : theme.colors.gray700,
    border: 'none',
    cursor: 'pointer',
    transition: theme.transition.fast,
    boxShadow: enabled ? theme.colors.glowAccentSubtle : 'none',
    outline: 'none',
  }),
  thumb: (enabled) => ({
    display: 'block',
    width: '18px',
    height: '18px',
    borderRadius: theme.radius.full,
    background: theme.colors.textPrimary,
    boxShadow: theme.shadows.sm,
    transition: theme.transition.fast,
    transform: enabled ? 'translateX(23px)' : 'translateX(3px)',
  }),
  label: {
    fontSize: '14px',
    color: theme.colors.textPrimary,
    cursor: 'pointer',
  },
  description: {
    fontSize: '13px',
    color: theme.colors.textMuted,
    marginTop: '2px',
  },
};

export function Switch({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}) {
  return (
    <HeadlessSwitch.Group>
      <div style={styles.container}>
        <HeadlessSwitch
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          style={{
            ...styles.switch(enabled),
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <span style={styles.thumb(enabled)} />
        </HeadlessSwitch>
        {(label || description) && (
          <div>
            {label && (
              <HeadlessSwitch.Label style={styles.label}>
                {label}
              </HeadlessSwitch.Label>
            )}
            {description && (
              <HeadlessSwitch.Description style={styles.description}>
                {description}
              </HeadlessSwitch.Description>
            )}
          </div>
        )}
      </div>
    </HeadlessSwitch.Group>
  );
}

export default Switch;
