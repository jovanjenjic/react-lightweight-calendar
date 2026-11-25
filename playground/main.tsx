import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CalendarTheme } from '../src';
import { advancedExamples } from './examples/advanced';
import { customizationExamples } from './examples/customization';
import type { Example } from './examples/shared';
import { viewExamples } from './examples/views';
import './playground.css';

const EXAMPLES: Example[] = [
  ...viewExamples,
  ...customizationExamples,
  ...advancedExamples,
];
const WIDTHS = { Desktop: '100%', Tablet: '768px', Phone: '375px' } as const;
type Width = keyof typeof WIDTHS;

const readHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '');
  return EXAMPLES.some((e) => e.id === id) ? id : EXAMPLES[0].id;
};

function App() {
  const [id, setId] = useState(readHash);
  const [theme, setTheme] = useState<CalendarTheme>('light');
  const [width, setWidth] = useState<Width>('Desktop');

  useEffect(() => {
    const onHash = () => setId(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const example = EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
  const groups = [...new Set(EXAMPLES.map((e) => e.group))];
  const pageDark =
    theme === 'dark' ||
    (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`pg ${pageDark ? 'pg--dark' : ''}`}>
      <aside className="pg-sidebar">
        <h1>React Lightweight Calendar</h1>
        <p className="pg-muted">Local examples · v3</p>
        {groups.map((group) => (
          <nav key={group}>
            <h2>{group}</h2>
            {EXAMPLES.filter((e) => e.group === group).map((e) => (
              <a
                key={e.id}
                href={`#/${e.id}`}
                className={e.id === example.id ? 'is-active' : undefined}
              >
                {e.title}
              </a>
            ))}
          </nav>
        ))}
      </aside>
      <main className="pg-main">
        <header className="pg-header">
          <div>
            <h2>{example.title}</h2>
            <p>{example.description}</p>
          </div>
          <div className="pg-toggles">
            <div className="pg-segmented" role="group" aria-label="Theme">
              {(['light', 'dark', 'auto'] as CalendarTheme[]).map((t) => (
                <button
                  key={t}
                  className={t === theme ? 'is-active' : undefined}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="pg-segmented" role="group" aria-label="Width">
              {(Object.keys(WIDTHS) as Width[]).map((w) => (
                <button
                  key={w}
                  className={w === width ? 'is-active' : undefined}
                  onClick={() => setWidth(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </header>
        <section className="pg-stage" style={{ maxWidth: WIDTHS[width] }}>
          <example.Component key={example.id} theme={theme} />
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
