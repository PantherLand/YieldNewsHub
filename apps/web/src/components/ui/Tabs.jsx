import { Tab } from '@headlessui/react';
import { theme } from '../../styles/theme.js';

const styles = {
  list: {
    display: 'flex',
    gap: '4px',
    background: theme.colors.bgCard,
    padding: '6px',
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
  },
  tab: (selected) => ({
    padding: '10px 20px',
    borderRadius: theme.radius.md,
    border: 'none',
    background: selected ? theme.colors.gradientPrimary : 'transparent',
    color: selected ? theme.colors.textPrimary : theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    transition: theme.transition.fast,
    boxShadow: selected ? theme.colors.glowAccentSubtle : 'none',
    letterSpacing: '0.3px',
    outline: 'none',
  }),
  panels: {
    marginTop: '16px',
  },
  panel: {
    outline: 'none',
  },
};

export function Tabs({ tabs = [], defaultIndex = 0, onChange }) {
  return (
    <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <Tab.List style={styles.list}>
        {tabs.map((tab, index) => (
          <Tab key={index} style={({ selected }) => styles.tab(selected)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {tab.icon}
              {tab.label}
            </span>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels style={styles.panels}>
        {tabs.map((tab, index) => (
          <Tab.Panel key={index} style={styles.panel}>
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

// Simple Tab List without Panels (for navigation)
export function TabList({ tabs = [], activeIndex = 0, onChange }) {
  return (
    <div style={styles.list}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onChange?.(index)}
          style={styles.tab(index === activeIndex)}
          onMouseEnter={(e) => {
            if (index !== activeIndex) {
              e.currentTarget.style.background = theme.colors.bgCardHover;
            }
          }}
          onMouseLeave={(e) => {
            if (index !== activeIndex) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default Tabs;
