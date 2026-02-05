import { Fragment } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { theme } from '../../styles/theme.js';

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  items: {
    position: 'absolute',
    right: 0,
    marginTop: '8px',
    minWidth: '180px',
    background: theme.colors.bgElevated,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.xl,
    outline: 'none',
    padding: '4px',
    zIndex: theme.zIndex.dropdown,
  },
  item: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
    background: active ? theme.colors.bgCardHover : 'transparent',
    border: 'none',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    textAlign: 'left',
    transition: theme.transition.fast,
    outline: 'none',
  }),
  itemIcon: {
    width: '16px',
    height: '16px',
    color: theme.colors.textMuted,
  },
  divider: {
    height: '1px',
    background: theme.colors.border,
    margin: '4px 0',
  },
  label: {
    padding: '8px 14px',
    fontSize: '11px',
    fontWeight: 600,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export function Menu({ trigger, items = [], align = 'right' }) {
  return (
    <HeadlessMenu as="div" style={styles.container}>
      <HeadlessMenu.Button as={Fragment}>{trigger}</HeadlessMenu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items
          style={{
            ...styles.items,
            ...(align === 'left' ? { left: 0, right: 'auto' } : {}),
          }}
        >
          {items.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={index} style={styles.divider} />;
            }
            if (item.type === 'label') {
              return (
                <div key={index} style={styles.label}>
                  {item.label}
                </div>
              );
            }
            return (
              <HeadlessMenu.Item key={index} disabled={item.disabled}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    style={{
                      ...styles.item(active),
                      opacity: item.disabled ? 0.5 : 1,
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                      color: item.danger
                        ? theme.colors.error
                        : active
                        ? theme.colors.textPrimary
                        : theme.colors.textSecondary,
                    }}
                  >
                    {item.icon && (
                      <span style={styles.itemIcon}>{item.icon}</span>
                    )}
                    {item.label}
                  </button>
                )}
              </HeadlessMenu.Item>
            );
          })}
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
}

export default Menu;
