import { useState } from 'react';
import { theme } from '../../styles/theme.js';

const styles = {
  container: {
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: theme.colors.textSecondary,
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: theme.colors.bgInput,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    color: theme.colors.textPrimary,
    transition: theme.transition.fast,
    outline: 'none',
    fontFamily: theme.fonts.sans,
  },
  inputFocus: {
    borderColor: theme.colors.borderAccent,
    boxShadow: `0 0 0 3px ${theme.colors.infoMuted}`,
  },
  inputError: {
    borderColor: theme.colors.error,
    boxShadow: `0 0 0 3px ${theme.colors.errorMuted}`,
  },
  inputWithIcon: {
    paddingLeft: '44px',
  },
  leftIcon: {
    position: 'absolute',
    left: '14px',
    color: theme.colors.textMuted,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: '14px',
    color: theme.colors.textMuted,
    display: 'flex',
    alignItems: 'center',
  },
  hint: {
    marginTop: '6px',
    fontSize: '12px',
    color: theme.colors.textMuted,
  },
  error: {
    marginTop: '6px',
    fontSize: '12px',
    color: theme.colors.error,
  },
};

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  hint,
  leftIcon,
  rightIcon,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyles = {
    ...styles.input,
    ...(isFocused && !error ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
    ...(leftIcon ? styles.inputWithIcon : {}),
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.inputWrapper}>
        {leftIcon && <span style={styles.leftIcon}>{leftIcon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyles}
          {...props}
        />
        {rightIcon && <span style={styles.rightIcon}>{rightIcon}</span>}
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {!error && hint && <div style={styles.hint}>{hint}</div>}
    </div>
  );
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  hint,
  rows = 4,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const textareaStyles = {
    ...styles.input,
    ...(isFocused && !error ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
    resize: 'vertical',
    minHeight: '100px',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={textareaStyles}
        {...props}
      />
      {error && <div style={styles.error}>{error}</div>}
      {!error && hint && <div style={styles.hint}>{hint}</div>}
    </div>
  );
}

export default Input;
