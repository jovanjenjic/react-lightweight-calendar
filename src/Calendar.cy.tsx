import { useState } from 'react';
import Calendar, { type CalendarProps, type CalendarView } from './index';

// Wednesday, June 4 2025. Items are built in local time so the tests pass in any zone.
const DATE = '2025-06-04';
const at = (day: number, h: number, m = 0) =>
  new Date(2025, 5, day, h, m).toISOString();

type Item = {
  id: string | number;
  title: string;
  start: string;
  end: string;
  bgColor?: string;
  allDay?: boolean;
};

const items: Item[] = [
  { id: 'a', title: 'Overlap A', start: at(4, 9), end: at(4, 10, 30) },
  { id: 'b', title: 'Overlap B', start: at(4, 9, 30), end: at(4, 11) },
  { id: 'solo', title: 'Solo', start: at(5, 14), end: at(5, 15) },
  {
    id: 'conf',
    title: 'Conference',
    start: '2025-06-02',
    end: '2025-06-05',
    bgColor: '#8e24aa',
  },
  { id: 'night', title: 'Night shift', start: at(6, 22), end: at(7, 2) },
];

function Harness(
  props: Partial<CalendarProps<Item>> & { initialView?: CalendarView },
) {
  const { initialView = 'WEEK_TIME', ...rest } = props;
  const [date, setDate] = useState<string | Date>(DATE);
  const [view, setView] = useState<CalendarView>(initialView);
  return (
    <div style={{ height: 700 }}>
      <Calendar<Item>
        data={items}
        activeTimeDateField="start-end"
        currentView={view}
        onViewChange={setView}
        currentDate={date}
        setCurrentDate={setDate}
        scrollToHour={8}
        {...rest}
      />
    </div>
  );
}

describe('Calendar', () => {
  it('renders every view', () => {
    const views: CalendarView[] = [
      'MONTH',
      'WEEK',
      'WEEK_TIME',
      'DAY',
      'DAY_REVERSE',
      'WEEK_IN_PLACE',
      'DAY_IN_PLACE',
    ];
    cy.mount(<Harness initialView="MONTH" />);
    for (const view of views) {
      cy.get('.rlc-toolbar__view')
        .contains(new RegExp(`^${labelOf(view)}$`))
        .click();
      cy.get(`.rlc--view-${view.toLowerCase().replace(/_/g, '-')}`).should(
        'exist',
      );
      cy.get('.rlc-event').should('have.length.greaterThan', 0);
    }
  });

  it('does not style anything outside the calendar', () => {
    cy.mount(
      <div>
        <p id="outside" style={{ fontSize: 16 }}>
          Outside paragraph
        </p>
        <Harness />
      </div>,
    );
    cy.get('#outside').should('have.css', 'margin-top', '16px');
    cy.get('.rlc')
      .should('have.css', 'margin-top', '0px')
      .and('have.css', 'padding-top', '0px');
  });

  it('places overlapping items side by side and long items in the all-day row', () => {
    cy.mount(<Harness />);
    cy.get('.rlc-timegrid__events [title^="Overlap A"]').then(($a) => {
      cy.get('.rlc-timegrid__events [title^="Overlap B"]').then(($b) => {
        const a = $a[0].getBoundingClientRect();
        const b = $b[0].getBoundingClientRect();
        expect(b.left).to.be.greaterThan(a.left + 5);
        expect(b.top).to.be.greaterThan(a.top);
      });
    });
    cy.get('.rlc-timegrid__allday').contains('Conference');
    // The night shift crosses midnight: one piece on each day.
    cy.get('.rlc-timegrid__events [title^="Night shift"]').should(
      'have.length',
      2,
    );
  });

  it('navigates and reports dates as yyyy-MM-dd', () => {
    const setCurrentDate = cy.stub().as('set');
    cy.mount(
      <Calendar
        data={items}
        activeTimeDateField="start-end"
        currentView="WEEK"
        currentDate={DATE}
        setCurrentDate={setCurrentDate}
      />,
    );
    cy.get('.rlc-toolbar__arrow').last().click();
    cy.get('@set').should('have.been.calledWith', '2025-06-11');
    cy.get('.rlc-toolbar__arrow').first().click();
    cy.get('@set').should('have.been.calledWith', '2025-05-28');
    cy.get('.rlc-toolbar__title').should('have.text', 'June 2025');
  });

  it('passes the original items and DateInfo to callbacks', () => {
    const onItemClick = cy.stub().as('item');
    const onCellClick = cy.stub().as('cell');
    const onHourClick = cy.stub().as('hour');
    const onDayNumberClick = cy.stub().as('number');
    cy.mount(
      <Harness
        onItemClick={onItemClick}
        onCellClick={onCellClick}
        onHourClick={onHourClick}
        onDayNumberClick={onDayNumberClick}
      />,
    );
    cy.get('[title^="Solo"]').click();
    cy.get('@item')
      .should('have.been.calledOnce')
      .its('firstCall.args.0')
      .should('equal', items[2]);
    cy.get('@cell').should('not.have.been.called');
    cy.get('.rlc-timegrid__col')
      .eq(4)
      .find('.rlc-slot')
      .eq(10)
      .click({ force: true });
    cy.get('@cell').its('firstCall.args.0').should('include', {
      timeDate: '2025-06-06 10:00:00',
      hour: 10,
      date: '2025-06-06',
    });
    cy.get('.rlc-timegrid__gutter-cell')
      .eq(9)
      .find('.rlc-hour')
      .click({ force: true });
    cy.get('@hour').should('have.been.calledWith', 9);
    cy.get('.rlc-dayhead .rlc-daynum').first().click();
    cy.get('@number').should('have.been.calledWith', '2025-06-02');
  });

  it('passes DateInfo to onHourClick in day views', () => {
    const onHourClick = cy.stub().as('hour');
    cy.mount(<Harness initialView="DAY" onHourClick={onHourClick} />);
    cy.get('.rlc-timegrid__gutter-cell')
      .eq(9)
      .find('.rlc-hour')
      .click({ force: true });
    cy.get('@hour')
      .its('firstCall.args.0')
      .should('include', { hour: 9, timeDate: '2025-06-04 09:00:00' });
  });

  it('activates items with the keyboard', () => {
    const onItemClick = cy.stub().as('item');
    cy.mount(<Harness onItemClick={onItemClick} />);
    cy.get('[title^="Solo"]').focus().type('{enter}');
    cy.get('@item').should('have.been.calledOnce');
  });

  it('shows "+N more" and the list of the day', () => {
    const busy = Array.from({ length: 6 }, (_, i) => ({
      id: `busy-${i}`,
      title: `Busy ${i + 1}`,
      start: at(10, 8 + i),
      end: at(10, 9 + i),
    }));
    cy.mount(
      <Harness
        initialView="MONTH"
        data={[...items, ...busy]}
        dayMaxItems={3}
      />,
    );
    cy.get('.rlc-more')
      .should('have.length', 1)
      .and('have.text', '+4 more')
      .click();
    cy.get('.rlc-popover')
      .should('be.visible')
      .find('.rlc-event')
      .should('have.length', 6);
    cy.get('body').type('{esc}');
    cy.get('.rlc-popover').should('not.exist');
  });

  it('calls onMoreClick instead of opening the list when given', () => {
    const onMoreClick = cy.stub().as('more');
    const busy = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      title: `B${i}`,
      start: at(10, 8 + i),
      end: at(10, 9 + i),
    }));
    cy.mount(
      <Harness
        initialView="MONTH"
        data={busy}
        dayMaxItems={2}
        onMoreClick={onMoreClick}
      />,
    );
    cy.get('.rlc-more').click();
    cy.get('@more').its('firstCall.args.1').should('have.length', 5);
    cy.get('.rlc-popover').should('not.exist');
  });

  it('keeps the "+N more" list in sync with data and restores focus', () => {
    const busy = Array.from({ length: 5 }, (_, i) => ({
      id: `busy-${i}`,
      title: `Busy ${i + 1}`,
      start: at(10, 8 + i),
      end: at(10, 9 + i),
    }));
    function Live() {
      const [data, setData] = useState<Item[]>(busy);
      (window as unknown as { dropOne: () => void }).dropOne = () =>
        setData((list) => list.slice(1));
      return <Harness initialView="MONTH" data={data} dayMaxItems={2} />;
    }
    cy.mount(<Live />);
    cy.get('.rlc-more').click();
    cy.get('.rlc-popover .rlc-event').should('have.length', 5);
    cy.window().then((win) =>
      (win as unknown as { dropOne: () => void }).dropOne(),
    );
    cy.get('.rlc-popover .rlc-event').should('have.length', 4);
    cy.get('body').type('{esc}');
    cy.get('.rlc-popover').should('not.exist');
    cy.focused().should('have.class', 'rlc-more');
  });

  it('reports weekdays of the current week in MONTH', () => {
    const onDayStringClick = cy.stub().as('weekday');
    cy.mount(
      <Harness initialView="MONTH" onDayStringClick={onDayStringClick} />,
    );
    cy.get('.rlc-weekday__button').eq(0).click();
    cy.get('@weekday').its('firstCall.args.0').should('equal', '2025-06-02');
    cy.get('.rlc-weekday__button').eq(6).click();
    cy.get('@weekday').its('secondCall.args.0').should('equal', '2025-06-08');
  });

  it('keeps default labels for labels set to undefined', () => {
    const busy = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      title: `B${i}`,
      start: at(10, 8 + i),
      end: at(10, 9 + i),
    }));
    cy.mount(
      <Harness
        initialView="MONTH"
        data={busy}
        dayMaxItems={2}
        labels={{
          today: undefined,
          more: undefined,
          views: { MONTH: undefined },
        }}
      />,
    );
    cy.get('.rlc-toolbar__today').should('have.text', 'Today');
    cy.get('.rlc-toolbar__view--active').should('have.text', 'Month');
    cy.get('.rlc-more').should('have.text', '+4 more');
  });

  it('renders custom parts through render props', () => {
    cy.mount(
      <Harness
        initialView="MONTH"
        colorDots={[{ color: 'red', text: 'Deadline', date: '2025-06-12' }]}
        renderNavigation={({ title, goToNext }) => (
          <button id="custom-nav" onClick={goToNext}>
            {title}
          </button>
        )}
        renderDayNumber={({ dayNumber }) => (
          <span className="custom-number">#{dayNumber}</span>
        )}
        renderItem={(item) => <span className="custom-item">{item.title}</span>}
        renderCellContent={({ date }) => (
          <span className="custom-cell">{date.getDate()}</span>
        )}
        renderLegend={(dots) => (
          <span id="custom-legend">{dots.length} dots</span>
        )}
      />,
    );
    cy.get('.custom-item').should('exist');
    cy.get('.custom-number').first().should('contain.text', '#');
    cy.get('.custom-cell').should('have.length', 42); // May 26 – July 6
    cy.get('#custom-legend').should('have.text', '1 dots');
    cy.get('#custom-nav')
      .should('have.text', 'June 2025')
      .click()
      .should('have.text', 'July 2025');
  });

  it('renders custom day headers and hour labels', () => {
    cy.mount(
      <Harness
        renderDayHeader={({ dayNumber }) => (
          <b className="custom-head">{dayNumber}</b>
        )}
        renderHourLabel={({ hour }) => <i className="custom-hour">{hour}h</i>}
      />,
    );
    cy.get('.custom-head')
      .should('have.length', 7)
      .first()
      .should('have.text', '2');
    cy.get('.custom-hour')
      .should('have.length', 24)
      .eq(9)
      .should('have.text', '9h');
  });

  it('collapses cells with cellDisplayMode', () => {
    const busy = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      title: `Day item ${i}`,
      start: at(11, 8 + i),
      end: at(11, 9 + i),
    }));
    cy.mount(
      <Harness
        initialView="MONTH"
        data={busy}
        cellDisplayMode={{
          MONTH: { state: 'CUSTOM', inactiveCells: ['2025-06-11'] },
        }}
      />,
    );
    cy.get('.rlc-event')
      .should('have.length', 1)
      .and('contain.text', 'Day item 2');
  });

  it('applies themes and CSS variables', () => {
    cy.mount(
      <Harness
        theme="dark"
        style={{ ['--rlc-today-bg' as string]: 'rgb(255, 0, 0)' }}
        currentDate={new Date()}
      />,
    );
    cy.get('.rlc')
      .should('have.class', 'rlc--dark')
      .and('have.css', 'background-color', 'rgb(31, 31, 31)');
    cy.get('.rlc-daynum--today').should(
      'have.css',
      'background-color',
      'rgb(255, 0, 0)',
    );
  });

  it('never mutates data', () => {
    const frozen = Object.freeze(
      items.map((item) => Object.freeze({ ...item })).reverse(),
    );
    cy.mount(<Harness data={frozen as Item[]} />);
    cy.get('.rlc-event').should('have.length.greaterThan', 0);
    cy.wrap(frozen.map((i) => i.id)).should('deep.equal', [
      'night',
      'conf',
      'solo',
      'b',
      'a',
    ]);
  });

  it('fits a phone width without horizontal overflow', () => {
    cy.viewport(375, 740);
    for (const view of [
      'MONTH',
      'WEEK_TIME',
      'WEEK_IN_PLACE',
    ] as CalendarView[]) {
      cy.mount(<Harness initialView={view} />);
      cy.get('.rlc').then(($root) => {
        const root = $root[0];
        expect(root.scrollWidth).to.be.at.most(root.clientWidth + 1);
      });
      cy.get('.rlc-label-narrow').first().should('be.visible');
    }
  });
});

function labelOf(view: CalendarView) {
  return {
    MONTH: 'Month',
    WEEK: 'Week',
    WEEK_TIME: 'Week schedule',
    DAY: 'Day',
    DAY_REVERSE: 'Day timeline',
    WEEK_IN_PLACE: 'Week by hour',
    DAY_IN_PLACE: 'Day by hour',
  }[view];
}
