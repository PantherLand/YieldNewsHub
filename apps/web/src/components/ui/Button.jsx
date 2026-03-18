import { theme } from '../../styles/theme.js';

const variants = {
  primary: {
    background: theme.colors.gradientPrimary,
    color: theme.colors.textPrimary,
    border: 'none',
    boxShadow: theme.shadows.accent,
  },
  secondary: {
    background: theme.colors.gray800,
    color: theme.colors.textPrimary,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: theme.colors.textSecondary,
    border: 'none',
    boxShadow: 'none',
  },
  outline: {
    background: 'transparent',
    color: theme.colors.accent,
    border: `1px solid ${theme.colors.borderAccent}`,
    boxShadow: 'none',
  },
  danger: {
    background: theme.colors.error,
    color: theme.colors.textPrimary,
    border: 'none',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
  },
};

const sizes = {
  sm: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: theme.radius.sm,
  },
  md: {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: theme.radius.md,
  },
  lg: {
    padding: '14px 28px',
    fontSize: '16px',
    borderRadius: theme.radius.lg,
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: theme.transition.fast,
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: theme.fonts.sans,
    outline: 'none',
    ...variantStyles,
    ...sizeStyles,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = theme.colors.glowAccent;
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variantStyles.boxShadow || 'none';
      }}
      {...props}
    >
      {loading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="60"
            strokeLinecap="round"
          />
        </svg>
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

export default Button;
