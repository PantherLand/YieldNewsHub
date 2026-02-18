import { useState } from 'react';
import { theme } from '../../styles/theme.js';

const styles = {
  card: {
    background: theme.colors.bgCard,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    transition: theme.transition.normal,
  },
  cardHover: {
    borderColor: theme.colors.borderAccent,
    boxShadow: `${theme.shadows.lg}, ${theme.colors.glowAccentSubtle}`,
  },
  cardGlow: {
    boxShadow: theme.colors.glowAccent,
  },
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.colors.textPrimary,
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: theme.colors.textMuted,
    marginTop: '4px',
  },
  body: {
    padding: '24px',
  },
  footer: {
    padding: '16px 24px',
    borderTop: `1px solid ${theme.colors.border}`,
    background: theme.colors.bgSurface,
  },
};

export function Card({
  children,
  hoverable = false,
  glow = false,
  onClick,
  style = {},
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyles = {
    ...styles.card,
    ...(hoverable && isHovered ? styles.cardHover : {}),
    ...(glow ? styles.cardGlow : {}),
    cursor: onClick || hoverable ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, style = {} }) {
  return (
    <div style={{ ...styles.header, ...style }}>
      <div>
        {title && <h3 style={styles.title}>{title}</h3>}
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, style = {} }) {
  return <div style={{ ...styles.body, ...style }}>{children}</div>;
}

export function CardFooter({ children, style = {} }) {
  return <div style={{ ...styles.footer, ...style }}>{children}</div>;
}

// Stat Card Variant
export function StatCard({ label, value, change, accent = false, icon }) {
  return (
    <Card>
      <CardBody
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '12px',
              color: theme.colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: accent ? theme.colors.accent : theme.colors.textPrimary,
              margin: 0,
            }}
          >
            {value}
          </p>
          {change !== undefined && (
            <p
              style={{
                fontSize: '13px',
                color: change >= 0 ? theme.colors.success : theme.colors.error,
                marginTop: '4px',
              }}
            >
              {change >= 0 ? '+' : ''}
              {change}%
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: theme.radius.lg,
              background: theme.colors.infoMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.accent,
            }}
          >
            {icon}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default Card;
