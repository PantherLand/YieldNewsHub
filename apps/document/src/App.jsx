import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import brandGuide from './docs/brand-guide.md?raw';
import 'highlight.js/styles/github-dark.css';

// Theme colors (matching main app)
const theme = {
  colors: {
    accent: '#A855F7',
    accentLight: '#C084FC',
    accentDark: '#7C3AED',
    bgDeep: '#000000',
    bgDark: '#0A0A0A',
    bgCard: '#111111',
    bgCardHover: '#1A1A1A',
    bgSurface: '#141414',
    gray700: '#3F3F46',
    gray800: '#27272A',
    border: 'rgba(255, 255, 255, 0.08)',
    borderAccent: 'rgba(168, 85, 247, 0.4)',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    gradientPrimary: 'linear-gradient(135deg, #A855F7 0%, #6D28D9 100%)',
    gradientGlow: 'radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
  },
};

const globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${theme.colors.bgDeep};
    color: ${theme.colors.textPrimary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: rgba(168, 85, 247, 0.3);
    color: ${theme.colors.textPrimary};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.bgDark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray700};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.accent};
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
  },
  glowOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '600px',
    background: theme.colors.gradientGlow,
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${theme.colors.border}`,
    padding: '16px 24px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: theme.colors.textPrimary,
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  badge: {
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '9999px',
    background: 'rgba(168, 85, 247, 0.15)',
    color: theme.colors.accentLight,
    border: `1px solid ${theme.colors.borderAccent}`,
    fontWeight: 600,
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '48px 24px 96px',
    position: 'relative',
    zIndex: 1,
  },
  sidebar: {
    position: 'fixed',
    left: '24px',
    top: '120px',
    width: '200px',
    display: 'none',
  },
  sidebarVisible: {
    display: 'block',
  },
  tocTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  tocLink: {
    display: 'block',
    fontSize: '13px',
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    padding: '6px 0',
    borderLeft: `2px solid transparent`,
    paddingLeft: '12px',
    transition: 'all 0.15s ease',
  },
  tocLinkActive: {
    color: theme.colors.accent,
    borderLeftColor: theme.colors.accent,
  },
  content: {
    background: theme.colors.bgCard,
    borderRadius: '16px',
    border: `1px solid ${theme.colors.border}`,
    padding: '48px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  markdown: `
    .markdown h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid ${theme.colors.border};
      background: ${theme.colors.gradientPrimary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .markdown h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin-top: 3rem;
      margin-bottom: 1rem;
      color: ${theme.colors.textPrimary};
      padding-bottom: 0.5rem;
      border-bottom: 1px solid ${theme.colors.border};
    }

    .markdown h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      color: ${theme.colors.textPrimary};
    }

    .markdown h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      color: ${theme.colors.accentLight};
    }

    .markdown p {
      color: ${theme.colors.textSecondary};
      margin-bottom: 1rem;
      line-height: 1.75;
    }

    .markdown blockquote {
      border-left: 3px solid ${theme.colors.accent};
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: ${theme.colors.textMuted};
      font-style: italic;
      background: rgba(168, 85, 247, 0.05);
      padding: 1rem 1.5rem;
      border-radius: 0 8px 8px 0;
    }

    .markdown hr {
      border: none;
      height: 1px;
      background: ${theme.colors.border};
      margin: 2rem 0;
    }

    .markdown ul, .markdown ol {
      color: ${theme.colors.textSecondary};
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .markdown li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .markdown code {
      font-family: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace;
      font-size: 0.875em;
      background: ${theme.colors.bgSurface};
      padding: 0.2em 0.4em;
      border-radius: 4px;
      color: ${theme.colors.accentLight};
    }

    .markdown pre {
      background: ${theme.colors.bgSurface};
      border: 1px solid ${theme.colors.border};
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      margin: 1.5rem 0;
    }

    .markdown pre code {
      background: transparent;
      padding: 0;
      font-size: 0.85rem;
      line-height: 1.6;
      color: ${theme.colors.textSecondary};
    }

    .markdown table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
    }

    .markdown th {
      text-align: left;
      padding: 12px 16px;
      background: ${theme.colors.bgSurface};
      border-bottom: 1px solid ${theme.colors.border};
      color: ${theme.colors.textMuted};
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .markdown td {
      padding: 12px 16px;
      border-bottom: 1px solid ${theme.colors.border};
      color: ${theme.colors.textSecondary};
    }

    .markdown tr:hover td {
      background: ${theme.colors.bgCardHover};
    }

    .markdown a {
      color: ${theme.colors.accent};
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .markdown a:hover {
      color: ${theme.colors.accentLight};
      text-decoration: underline;
    }

    .markdown strong {
      color: ${theme.colors.textPrimary};
      font-weight: 600;
    }

    .markdown em {
      color: ${theme.colors.textMuted};
      font-style: italic;
    }
  `,
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: theme.colors.textMuted,
    fontSize: '13px',
    borderTop: `1px solid ${theme.colors.border}`,
    marginTop: '48px',
  },
};

function App() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.markdown h2');
      let current = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          current = heading.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <style>{styles.markdown}</style>
      <div style={styles.container}>
        <div style={styles.glowOverlay} />

        <header style={styles.header}>
          <div style={styles.headerContent}>
            <a href="/" style={styles.logo}>
              <span style={styles.logoText}>YieldNewsHub</span>
            </a>
            <span style={styles.badge}>Brand Guide v2.0</span>
          </div>
        </header>

        <main style={styles.main}>
          <article style={styles.content}>
            <div className="markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h2: ({ children, ...props }) => {
                    const id = children
                      ?.toString()
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w-]/g, '');
                    return (
                      <h2 id={id} {...props}>
                        {children}
                      </h2>
                    );
                  },
                }}
              >
                {brandGuide}
              </ReactMarkdown>
            </div>
          </article>

          <footer style={styles.footer}>
            YieldNewsHub Design System - Built with React & Vite
          </footer>
        </main>
      </div>
    </>
  );
}

export default App;
