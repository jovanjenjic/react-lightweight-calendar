import React from 'react';
import { add, sub, format } from 'date-fns';
import Styleguide from '../../StyleGuide/StyleGuide';
import { CurrentView } from '../Calendar.types';
import CalendarView from '../CalendarWrapper';
import dataViewConfig from '../../../dataProps';
import { TimeDateFormat } from '../Calendar.constants';

const stringDaysComponent = "*[data-cy='StringDays']";
const calendarInside = "*[data-cy='MonthViewInside']";
const verticalBorders = "*[data-cy='VerticalBorders']";
const weekRow = "*[data-cy='WeekRow']";
const colorDotsComponent = "*[data-cy='ColorDots']";
const calendarNavigation = "*[data-cy='CalendarNavigation']";
const navigationLeftButton = "*[data-cy='NavigationLeftButton']";
const navigationRightButton = "*[data-cy='NavigationRightButton']";
const navigationNowButton = "*[data-cy='NavigationNowButton']";
const navigationTimeDateText = "*[data-cy='NavigationTimeDateText']";
const colorDot = "*[data-cy='ColorDot']";
const dayNumber = "*[data-cy='DayNumber']";

const CURRENT_TIME_DATE = '2023-06-03';

const colorDots = [
  {
    color: 'rgb(222, 111, 55)',
    text: 'Text about blue color',
    date: '2023-06-02',
  },
  {
    color: 'rgb(252, 111, 5)',
    text: 'Text about red color',
    date: '2023-06-03',
  },
  {
    color: 'rgb(222, 11, 55)',
    text: 'Text about green color',
    date: '2023-06-04',
  },
  {
    color: 'rgb(22, 111, 55)',
    text: 'Text about green color',
    date: '2023-06-05',
  },
];

// Object that will be used to display the color dot for each day, but also for the legend below the calendar
const prepareIndicatorDots = () => {
  const newValue = { dateKeys: {}, colorKeys: {} };
  colorDots.forEach((dot) => {
    newValue.dateKeys[dot.date] = dot;
    newValue.colorKeys[dot.color] = dot;
  });
  return newValue;
};

const CalendarComponent = (params) => {
  const [currentDate, setCurrentDate] = React.useState(CURRENT_TIME_DATE);
  const dataView = dataViewConfig(currentDate, setCurrentDate);

  return (
    <>
      <Styleguide />
      <CalendarView {...dataView} {...params} colorDots={colorDots} />
    </>
  );
};

const checkAreSubcomponentsExist = () => {
  cy.get(stringDaysComponent).should('exist');
  cy.get(calendarInside).should('exist');
  cy.get(verticalBorders).should('exist');
  cy.get(weekRow).should('exist');
  cy.get(calendarNavigation).should('exist');
  cy.get(colorDotsComponent).should('exist');
  cy.get(dayNumber).each((day) => {
    if (day.attr('data-day-type') === 'current') {
      cy.wrap(day).should('have.css', 'background-color', 'rgb(240, 131, 0)');
      cy.wrap(day).should('have.css', 'color', 'rgb(255, 255, 255)');
    } else if (day.attr('data-day-type') === 'disabled') {
      cy.wrap(day).should('have.css', 'color', 'rgb(160, 174, 192)');
    } else {
      cy.wrap(day).should('have.css', 'color', 'rgb(61, 71, 87)');
    }
  });
};

const numberOfRowsAndColumns = () => {
  cy.get(weekRow).should('have.length', 5);
  cy.get(verticalBorders).children().should('have.length', 7);
};

const navigateToPrevMonth = () => {
  cy.get(navigationLeftButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(
      sub(new Date(CURRENT_TIME_DATE), { months: 1 }),
      TimeDateFormat.MONTH_YEAR,
    ),
  );
};

const navigateToNextMonth = () => {
  cy.get(navigationRightButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(
      add(new Date(CURRENT_TIME_DATE), { months: 1 }),
      TimeDateFormat.MONTH_YEAR,
    ),
  );
};

const navigateToNextThenOnToday = () => {
  cy.get(navigationRightButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(
      add(new Date(CURRENT_TIME_DATE), { months: 1 }),
      TimeDateFormat.MONTH_YEAR,
    ),
  );
  cy.get(navigationNowButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(new Date(), TimeDateFormat.MONTH_YEAR),
  );
};

const checkIndicatorDots = () => {
  const preparedIndicatorDotsDateKey = prepareIndicatorDots().dateKeys;
  const preparedIndicatorDotsColorKey = prepareIndicatorDots().colorKeys;
  Object.keys(preparedIndicatorDotsDateKey).forEach((date) => {
    cy.get(`${colorDot}[data-date=${date}]`).should(
      'have.css',
      'background-color',
      preparedIndicatorDotsDateKey[date].color,
    );
  });

  cy.get(colorDotsComponent)
    .children()
    .should('have.length', Object.keys(preparedIndicatorDotsColorKey).length)
    .each(($dots, index) => {
      const color = Object.keys(preparedIndicatorDotsColorKey)[index];
      const text = preparedIndicatorDotsColorKey[color].text;
      cy.wrap($dots)
        .children()
        .first()
        .should('have.css', 'background-color', color);
      cy.wrap($dots).children().last().should('have.text', text);
    });
};

describe('Calendar month view', () => {
  beforeEach(() => {
    cy.mount(<CalendarComponent currentView={CurrentView.MONTH} />);
  });

  it('should render correctly', () => {
    checkAreSubcomponentsExist();
  });

  it('should has 5 rows for every week in month and 7 columns for every day in week', () => {
    numberOfRowsAndColumns();
  });

  it('should navigate to the previous month on left arrow click', () => {
    navigateToPrevMonth();
  });

  it('should navigate to the next month on right arrow click', () => {
    navigateToNextMonth();
  });

  it('should navigate to the next month then go on current month on Now click', () => {
    navigateToNextThenOnToday();
  });

  it('should has appropriate color dots', () => {
    checkIndicatorDots();
  });
});
