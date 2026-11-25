import { addDays, startOfMonth } from 'date-fns';
import { de, fr, ja, srLatn, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { useMemo, useState, type CSSProperties } from 'react';
import Calendar from '../../src';
import { COLORS, dateKey, monthEvents, weekEvents, type Event } from '../data';
import {
  Controls,
  Field,
  Frame,
  useCalendarState,
  type Example,
} from './shared';

/* -------------------------------------------------------------------------- */

function CustomRendering({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const data = useMemo(() => weekEvents(), []);
  const dots = useMemo(() => {
    const today = new Date();
    return [
      { color: COLORS.red, text: 'Deadline', date: dateKey(addDays(today, 2)) },
      {
        color: COLORS.green,
        text: 'Payday',
        date: dateKey(addDays(today, -1)),
      },
    ];
  }, []);

  return (
    <Frame height={700}>
      <Calendar<Event>
        theme={theme}
        data={data}
        currentView={view}
        onViewChange={setView}
        views={['MONTH', 'WEEK_TIME', 'DAY']}
        currentDate={date}
        setCurrentDate={setDate}
        activeTimeDateField="startTime-endTime"
        colorDots={dots}
        renderNavigation={({
          title,
          goToPrevious,
          goToNext,
          goToToday,
          views,
          onViewChange,
          view: current,
        }) => (
          <div className="pg-custom-nav">
            <button onClick={goToPrevious} aria-label="Previous">
              ◀
            </button>
            <button onClick={goToToday}>Now</button>
            <button onClick={goToNext} aria-label="Next">
              ▶
            </button>
            <strong>{title}</strong>
            <span className="pg-spacer" />
            {views.map((v) => (
              <button
                key={v}
                className={v === current ? 'is-active' : ''}
                onClick={() => onViewChange?.(v)}
              >
                {v.replace('_', ' ').toLowerCase()}
              </button>
            ))}
          </div>
        )}
        renderDayHeader={({ weekdayLabel, dayNumber, isToday, colorDot }) => (
          <div className={`pg-dayhead ${isToday ? 'is-today' : ''}`}>
            <span>{weekdayLabel}</span>
            <b>{dayNumber}</b>
            {colorDot && (
              <small style={{ color: colorDot.color }}>{colorDot.text}</small>
            )}
          </div>
        )}
        renderDayNumber={({ dayNumber, isToday, colorDot }) => (
          <span
            className={`pg-daynum ${isToday ? 'is-today' : ''}`}
            title={colorDot?.text}
          >
            {dayNumber}
            {colorDot && <i style={{ background: colorDot.color }} />}
          </span>
        )}
        renderHourLabel={({ hour }) => (
          <span className="pg-hour">{String(hour).padStart(2, '0')}h</span>
        )}
        renderItem={(item, isHovered, info) => (
          <div
            className="pg-card"
            style={
              {
                '--c': item.bgColor ?? COLORS.blue,
                boxShadow: isHovered
                  ? '0 4px 12px rgb(0 0 0 / .25)'
                  : undefined,
              } as CSSProperties
            }
          >
            <strong>{item.title}</strong>
            {!info.isCompact && info.timeLabel && <span>{info.timeLabel}</span>}
            {!info.isCompact && item.location && (
              <span>📍 {item.location}</span>
            )}
          </div>
        )}
        renderHeaderItem={(item, { isFromPrevious, isFromNext }) => (
          <div
            className="pg-allday"
            style={{ '--c': item.bgColor ?? COLORS.blue } as CSSProperties}
          >
            {isFromPrevious && '← '}
            {item.title}
            {isFromNext && ' →'}
          </div>
        )}
        renderMoreLink={({ count }) => (
          <span className="pg-more">＋{count}</span>
        )}
        renderLegend={(legendDots) => (
          <div className="pg-legend">
            {legendDots.map((dot) => (
              <span key={dot.date}>
                <i style={{ background: dot.color }} /> {dot.text} · {dot.date}
              </span>
            ))}
          </div>
        )}
      />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */

const THEMES: Record<
  string,
  { label: string; style: CSSProperties; theme?: 'dark' }
> = {
  google: { label: 'Default', style: {} },
  dark: { label: 'Dark', style: {}, theme: 'dark' },
  brand: {
    label: 'Brand (purple)',
    style: {
      '--rlc-primary': '#7c3aed',
      '--rlc-event-bg': '#7c3aed',
      '--rlc-today-bg': '#7c3aed',
      '--rlc-border': '#e9e3f7',
      '--rlc-radius': '16px',
      '--rlc-font-family': 'Georgia, serif',
    } as CSSProperties,
  },
  compact: {
    label: 'Compact',
    style: {
      '--rlc-font-size': '12px',
      '--rlc-hour-height': '32px',
      '--rlc-item-height': '18px',
      '--rlc-gutter-width': '44px',
    } as CSSProperties,
  },
  ocean: {
    label: 'Ocean, dark',
    theme: 'dark',
    style: {
      '--rlc-bg': '#0b1e2d',
      '--rlc-surface': '#12324a',
      '--rlc-border': '#1d3f58',
      '--rlc-primary': '#5eead4',
      '--rlc-today-text': '#05231f',
      '--rlc-event-bg': '#0f766e',
      '--rlc-now-color': '#fbbf24',
    } as CSSProperties,
  },
};

function Theming({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const data = useMemo(
    () => weekEvents().map((event) => ({ ...event, bgColor: undefined })),
    [],
  );
  const [key, setKey] = useState('brand');
  const preset = THEMES[key];
  return (
    <>
      <Controls>
        <Field label="Preset">
          <select value={key} onChange={(e) => setKey(e.target.value)}>
            {Object.entries(THEMES).map(([k, t]) => (
              <option key={k} value={k}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <code className="pg-code">{JSON.stringify(preset.style)}</code>
      </Controls>
      <Frame height={640}>
        <Calendar
          theme={preset.theme ?? theme}
          style={preset.style}
          data={data}
          currentView={view}
          onViewChange={setView}
          views={['MONTH', 'WEEK_TIME', 'DAY']}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
        />
      </Frame>
    </>
  );
}

/* -------------------------------------------------------------------------- */

const LOCALES: Record<
  string,
  {
    locale: Locale;
    labels: Record<string, string>;
    views: Record<string, string>;
  }
> = {
  en: {
    locale: enUS,
    labels: { today: 'Today', allDay: 'All day' },
    views: {},
  },
  de: {
    locale: de,
    labels: {
      today: 'Heute',
      allDay: 'Ganztägig',
      previous: 'Zurück',
      next: 'Weiter',
    },
    views: { MONTH: 'Monat', WEEK_TIME: 'Woche', DAY: 'Tag' },
  },
  fr: {
    locale: fr,
    labels: {
      today: "Aujourd'hui",
      allDay: 'Journée',
      previous: 'Précédent',
      next: 'Suivant',
    },
    views: { MONTH: 'Mois', WEEK_TIME: 'Semaine', DAY: 'Jour' },
  },
  sr: {
    locale: srLatn,
    labels: {
      today: 'Danas',
      allDay: 'Ceo dan',
      previous: 'Prethodno',
      next: 'Sledeće',
    },
    views: { MONTH: 'Mesec', WEEK_TIME: 'Nedelja', DAY: 'Dan' },
  },
  ja: {
    locale: ja,
    labels: { today: '今日', allDay: '終日', previous: '前へ', next: '次へ' },
    views: { MONTH: '月', WEEK_TIME: '週', DAY: '日' },
  },
};

function Localization({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const data = useMemo(() => monthEvents(), []);
  const [lang, setLang] = useState('sr');
  const { locale, labels, views } = LOCALES[lang];
  return (
    <>
      <Controls>
        <Field label="Language">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="sr">Srpski</option>
            <option value="ja">日本語</option>
          </select>
        </Field>
        <span className="pg-muted">
          24-hour clock, first day of the week and labels follow the language.
        </span>
      </Controls>
      <Frame height={640}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          onViewChange={setView}
          views={['MONTH', 'WEEK_TIME', 'DAY']}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          locale={locale}
          weekStartsOn={locale.options?.weekStartsOn ?? 1}
          timeDateFormat={
            lang === 'en' ? undefined : { hour: 'HH:mm', time: 'HH:mm' }
          }
          labels={{
            ...labels,
            more: (n) => (lang === 'en' ? `+${n} more` : `+${n}`),
            views,
          }}
        />
      </Frame>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Booking({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { date, setDate } = useCalendarState('MONTH');
  const first = startOfMonth(new Date());
  const bookings = useMemo<Event[]>(
    () => [
      {
        id: 'b1',
        title: 'Smith family',
        startTime: dateKey(addDays(first, 3)),
        endTime: dateKey(addDays(first, 7)),
        bgColor: COLORS.teal,
      },
      {
        id: 'b2',
        title: 'J. Novak',
        startTime: dateKey(addDays(first, 10)),
        endTime: dateKey(addDays(first, 12)),
        bgColor: COLORS.indigo,
      },
      {
        id: 'b3',
        title: 'Conference group',
        startTime: dateKey(addDays(first, 15)),
        endTime: dateKey(addDays(first, 21)),
        bgColor: COLORS.orange,
      },
      {
        id: 'b4',
        title: 'Weekend guests',
        startTime: dateKey(addDays(first, 25)),
        endTime: dateKey(addDays(first, 27)),
        bgColor: COLORS.purple,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <Controls>
        <span className="pg-muted">
          renderCellContent shows a nightly price on free days.{' '}
          {selected && `Selected: ${selected}`}
        </span>
      </Controls>
      <Frame height={680}>
        <Calendar<Event>
          theme={theme}
          data={bookings}
          currentView="MONTH"
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          dayMaxItems={2}
          onCellClick={({ date: day }) => setSelected(day)}
          renderCellContent={({ date: day, items, isCurrentMonth }) =>
            isCurrentMonth && !items.length ? (
              <span className="pg-price">
                €{[89, 99, 119, 149][day.getDay() % 4]}
              </span>
            ) : null
          }
        />
      </Frame>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function DotsExample({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('MONTH');
  const data = useMemo(() => weekEvents(), []);
  const [clicked, setClicked] = useState('');
  const dots = useMemo(() => {
    const first = startOfMonth(new Date());
    return [
      {
        color: COLORS.red,
        text: 'Deadline',
        date: dateKey(addDays(first, 11)),
      },
      {
        color: COLORS.green,
        text: 'Public holiday',
        date: dateKey(addDays(first, 18)),
      },
      {
        color: COLORS.yellow,
        text: 'On call',
        date: dateKey(addDays(first, 4)),
      },
      {
        color: COLORS.yellow,
        text: 'On call',
        date: dateKey(addDays(first, 5)),
      },
    ];
  }, []);
  return (
    <>
      <Controls>
        <span className="pg-muted">
          {clicked
            ? `onColorDotClick: ${clicked}`
            : 'Click a dot or a legend entry.'}
        </span>
      </Controls>
      <Frame height={640}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          onViewChange={setView}
          views={['MONTH', 'WEEK_TIME']}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          colorDots={dots}
          onColorDotClick={(dot) => setClicked(`${dot.text} (${dot.date})`)}
        />
      </Frame>
    </>
  );
}

export const customizationExamples: Example[] = [
  {
    id: 'custom-rendering',
    group: 'Customization',
    title: 'Render every part',
    description:
      'renderNavigation, renderDayHeader, renderDayNumber, renderHourLabel, renderItem, renderHeaderItem, renderMoreLink and renderLegend. The calendar still does all the layout.',
    Component: CustomRendering,
  },
  {
    id: 'theming',
    group: 'Customization',
    title: 'Theming',
    description:
      'A handful of CSS variables restyle everything, and theme="dark" switches the palette.',
    Component: Theming,
  },
  {
    id: 'localization',
    group: 'Customization',
    title: 'Localization',
    description: 'date-fns locales, translated labels and a 24-hour clock.',
    Component: Localization,
  },
  {
    id: 'booking',
    group: 'Customization',
    title: 'Booking calendar',
    description:
      'Whole-day bookings as bars, with prices from renderCellContent on free days.',
    Component: Booking,
  },
  {
    id: 'color-dots',
    group: 'Customization',
    title: 'Color dots',
    description: 'Mark days and get a legend generated from the colors.',
    Component: DotsExample,
  },
];
