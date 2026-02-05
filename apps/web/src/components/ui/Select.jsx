import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { theme } from '../../styles/theme.js';

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  button: {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    background: theme.colors.bgInput,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px 40px 12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    color: theme.colors.textPrimary,
    transition: theme.transition.fast,
    outline: 'none',
  },
  buttonFocus: {
    borderColor: theme.colors.borderAccent,
    boxShadow: `0 0 0 3px ${theme.colors.infoMuted}`,
  },
  buttonIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: theme.colors.textMuted,
    pointerEvents: 'none',
  },
  options: {
    position: 'absolute',
    zIndex: theme.zIndex.dropdown,
    marginTop: '4px',
    width: '100%',
    maxHeight: '240px',
    overflow: 'auto',
    background: theme.colors.bgElevated,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xl,
    outline: 'none',
    padding: '4px',
  },
  option: (active, selected) => ({
    position: 'relative',
    cursor: 'pointer',
    padding: '10px 40px 10px 12px',
    fontSize: '14px',
    borderRadius: theme.radius.sm,
    color: selected ? theme.colors.accent : theme.colors.textPrimary,
    background: active ? theme.colors.bgCardHover : 'transparent',
    transition: theme.transition.fast,
  }),
  checkIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    color: theme.colors.accent,
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: theme.colors.textSecondary,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
};

export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  ...props
}) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <Listbox.Button
              style={{
                ...styles.button,
                ...(open ? styles.buttonFocus : {}),
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={!selectedOption ? styles.placeholder : {}}>
                {selectedOption?.label || placeholder}
              </span>
              <ChevronUpDownIcon style={styles.buttonIcon} />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options style={styles.options}>
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {({ active, selected }) => (
                      <div
                        style={{
                          ...styles.option(active, selected),
                          opacity: option.disabled ? 0.5 : 1,
                          cursor: option.disabled ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {option.label}
                        {selected && <CheckIcon style={styles.checkIcon} />}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}

export default Select;
