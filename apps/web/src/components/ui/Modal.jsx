import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { theme } from '../../styles/theme.js';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
  },
  container: {
    position: 'fixed',
    inset: 0,
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  panel: {
    width: '100%',
    maxWidth: '480px',
    background: theme.colors.bgCard,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.xl,
    boxShadow: `${theme.shadows['2xl']}, ${theme.colors.glowAccentSubtle}`,
    overflow: 'hidden',
  },
  panelLarge: {
    maxWidth: '640px',
  },
  panelFullscreen: {
    maxWidth: '95vw',
    maxHeight: '95vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: theme.colors.textPrimary,
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: 'transparent',
    border: 'none',
    borderRadius: theme.radius.md,
    color: theme.colors.textMuted,
    cursor: 'pointer',
    transition: theme.transition.fast,
  },
  body: {
    padding: '24px',
    color: theme.colors.textSecondary,
    fontSize: '14px',
    lineHeight: 1.6,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    borderTop: `1px solid ${theme.colors.border}`,
    background: theme.colors.bgSurface,
  },
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'default',
  showCloseButton = true,
}) {
  const sizeStyles = {
    default: {},
    large: styles.panelLarge,
    fullscreen: styles.panelFullscreen,
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" style={{ position: 'relative', zIndex: theme.zIndex.modal }} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div style={styles.overlay} />
        </Transition.Child>

        <div style={styles.container}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel style={{ ...styles.panel, ...sizeStyles[size] }}>
              {(title || showCloseButton) && (
                <div style={styles.header}>
                  {title && <Dialog.Title style={styles.title}>{title}</Dialog.Title>}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      style={styles.closeButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.colors.bgCardHover;
                        e.currentTarget.style.color = theme.colors.textPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = theme.colors.textMuted;
                      }}
                    >
                      <XMarkIcon style={{ width: '20px', height: '20px' }} />
                    </button>
                  )}
                </div>
              )}

              <div style={styles.body}>{children}</div>

              {footer && <div style={styles.footer}>{footer}</div>}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
