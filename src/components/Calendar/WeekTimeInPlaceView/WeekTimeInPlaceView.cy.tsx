import React from 'react';
import { add, sub, format } from 'date-fns';
import { CurrentView } from '../Calendar.types';
import CalendarView from '../CalendarWrapper';
import dataViewConfig from '../../../dataProps';
import { TimeDateFormat } from '../Calendar.constants';
import Styleguide from '../../StyleGuide/StyleGuide';

const stringDaysComponent = "*[data-cy='StringDays']";
const calendarInside = "*[data-cy='WeekTimeInPlaceViewInside']";
const colorDotsComponent = "*[data-cy='ColorDots']";
const calendarNavigation = "*[data-cy='CalendarNavigation']";
const navigationLeftButton = "*[data-cy='NavigationLeftButton']";
const navigationRightButton = "*[data-cy='NavigationRightButton']";
const navigationNowButton = "*[data-cy='NavigationNowButton']";
const navigationTimeDateText = "*[data-cy='NavigationTimeDateText']";
const colorDot = "*[data-cy='ColorDot']";
const dayNumber = "*[data-cy='DayNumber']";
const cells = "*[data-cy='Cells']";
const hours = "*[data-cy='Hours']";

const RANDOM_TIME_DATE = '2023-06-03';
const CURRENT_TIME_DATE = new Date();

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
  const [currentDate, setCurrentDate] = React.useState(params.currentDateProp);
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
  cy.get(calendarNavigation).should('exist');
  cy.get(colorDotsComponent).should('exist');
  cy.get(hours).should('exist');
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

const numOfCellsAndHours = () => {
  // 24h * 7 days = 168
  cy.get(cells).children().should('have.length', 168);
  cy.get(hours).should('have.length', 24);
};

const navigateToPrevWeek = (testTimeDate) => {
  cy.get(navigationLeftButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(
      sub(new Date(testTimeDate), { weeks: 1 }),
      TimeDateFormat.MONTH_YEAR,
    ),
  );
};

const navigateToNextWeek = (testTimeDate) => {
  cy.get(navigationRightButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(
      add(new Date(testTimeDate), { weeks: 1 }),
      TimeDateFormat.MONTH_YEAR,
    ),
  );
};

const navigateToNextThenOnToday = (testTimeDate) => {
  cy.get(navigationRightButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(
      add(new Date(testTimeDate), { weeks: 1 }),
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

describe('Calendar week time in place view, random current date', () => {
  beforeEach(() => {
    cy.mount(
      <CalendarComponent
        currentView={CurrentView.WEEK_IN_PLACE}
        currentDateProp={RANDOM_TIME_DATE}
      />,
    );
  });

  it('should render correctly', () => {
    checkAreSubcomponentsExist();
  });

  it('should has 168 cells for every hour in week and 24 hour/string on left side', () => {
    numOfCellsAndHours();
  });

  it('should navigate to the previous week on left arrow click', () => {
    navigateToPrevWeek(RANDOM_TIME_DATE);
  });

  it('should navigate to the next week on right arrow click', () => {
    navigateToNextWeek(RANDOM_TIME_DATE);
  });

  it('should navigate to the next week then go on current week on Now click', () => {
    navigateToNextThenOnToday(RANDOM_TIME_DATE);
  });

  it('should has appropriate color dots', () => {
    checkIndicatorDots();
  });
});

describe('Calendar week time in place view, current day', () => {
  beforeEach(() => {
    cy.mount(
      <CalendarComponent
        currentView={CurrentView.WEEK_IN_PLACE}
        currentDateProp={CURRENT_TIME_DATE}
      />,
    );
  });

  it('should render correctly', () => {
    checkAreSubcomponentsExist();
  });

  it('should has 168 cells for every hour in week and 24 hour/string on left side', () => {
    numOfCellsAndHours();
  });

  it('should navigate to the previous week on left arrow click', () => {
    navigateToPrevWeek(CURRENT_TIME_DATE);
  });

  it('should navigate to the next week on right arrow click', () => {
    navigateToNextWeek(CURRENT_TIME_DATE);
  });

  it('should navigate to the next week then go on current week on Now click', () => {
    navigateToNextThenOnToday(CURRENT_TIME_DATE);
  });
});
