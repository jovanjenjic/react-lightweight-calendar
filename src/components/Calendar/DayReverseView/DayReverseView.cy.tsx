import React from 'react';
import { add, sub, format } from 'date-fns';
import Styleguide from '../../StyleGuide/StyleGuide';
import { CurrentView } from '../Calendar.types';
import CalendarView from '../CalendarWrapper';
import dataViewConfig from '../../../dataProps';
import { TimeDateFormat } from '../Calendar.constants';

const stringDayComponent = "*[data-cy='StringDay']";
const calendarInside = "*[data-cy='DayViewInside']";
const colorDotsComponent = "*[data-cy='ColorDots']";
const calendarNavigation = "*[data-cy='CalendarNavigation']";
const navigationLeftButton = "*[data-cy='NavigationLeftButton']";
const navigationRightButton = "*[data-cy='NavigationRightButton']";
const navigationNowButton = "*[data-cy='NavigationNowButton']";
const navigationTimeDateText = "*[data-cy='NavigationTimeDateText']";
const colorDot = "*[data-cy='ColorDot']";
const dayNumber = "*[data-cy='DayNumber']";
const hourRows = "*[data-cy='HourRows']";
const currentMinutLine = "*[data-cy='CurrentMinutLine']";
const hours = "*[data-cy='Hours']";

const RANDOM_TIME_DATE = '2023-06-03';
const CURRENT_TIME_DATE = new Date();

const colorDots = [
  {
    color: 'rgb(252, 111, 5)',
    text: 'Text about red color',
    date: '2023-06-03',
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

const checkAreSubcomponentsExist = (isCurrentDay = false) => {
  cy.get(stringDayComponent).should('exist');
  cy.get(calendarInside).should('exist');
  cy.get(calendarNavigation).should('exist');
  cy.get(colorDotsComponent).should('exist');
  if (isCurrentDay) {
    cy.get(currentMinutLine).should('exist');
  } else {
    cy.get(currentMinutLine).should('not.exist');
  }
  cy.get(dayNumber).each((day) => {
    if (isCurrentDay) {
      cy.wrap(day).should('have.css', 'background-color', 'rgb(240, 131, 0)');
      cy.wrap(day).should('have.css', 'color', 'rgb(255, 255, 255)');
    } else {
      cy.wrap(day).should('have.css', 'color', 'rgb(61, 71, 87)');
    }
  });
};

const numberOfHours = () => {
  cy.get(hourRows).children().should('have.length', 24);
  cy.get(hours).should('have.length', 24);
};

const navigateToPrevDay = (testTimeDate) => {
  cy.get(navigationLeftButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(sub(new Date(testTimeDate), { days: 1 }), TimeDateFormat.MONTH_YEAR),
  );
  cy.get(stringDayComponent).should(
    'have.text',
    format(
      sub(new Date(testTimeDate), { days: 1 }),
      TimeDateFormat.SHORT_WEEKDAY,
    ),
  );
};

const navigateToNextDay = (testTimeDate) => {
  cy.get(navigationRightButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(add(new Date(testTimeDate), { days: 1 }), TimeDateFormat.MONTH_YEAR),
  );
  cy.get(stringDayComponent).should(
    'have.text',
    format(
      add(new Date(testTimeDate), { days: 1 }),
      TimeDateFormat.SHORT_WEEKDAY,
    ),
  );
};

const navigateToNextThenOnToday = (testTimeDate) => {
  cy.get(navigationRightButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(add(new Date(testTimeDate), { days: 1 }), TimeDateFormat.MONTH_YEAR),
  );
  cy.get(stringDayComponent).should(
    'have.text',
    format(
      add(new Date(testTimeDate), { days: 1 }),
      TimeDateFormat.SHORT_WEEKDAY,
    ),
  );
  cy.get(navigationNowButton).click();
  cy.get(navigationTimeDateText).should(
    'have.text',
    format(new Date(), TimeDateFormat.MONTH_YEAR),
  );
  cy.get(stringDayComponent).should(
    'have.text',
    format(new Date(), TimeDateFormat.SHORT_WEEKDAY),
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

describe('Calendar day view, random day', () => {
  beforeEach(() => {
    cy.mount(
      <CalendarComponent
        currentView={CurrentView.DAY}
        currentDateProp={RANDOM_TIME_DATE}
      />,
    );
  });

  it('should render correctly', () => {
    checkAreSubcomponentsExist();
  });

  it('should has 24 row for every hour in day', () => {
    numberOfHours();
  });

  it('should navigate to the previous day on left arrow click', () => {
    navigateToPrevDay(RANDOM_TIME_DATE);
  });

  it('should navigate to the next day on right arrow click', () => {
    navigateToNextDay(RANDOM_TIME_DATE);
  });

  it('should navigate to the next day then go on current day on Now click', () => {
    navigateToNextThenOnToday(RANDOM_TIME_DATE);
  });

  it('should has appropriate color dots', () => {
    checkIndicatorDots();
  });
});

describe('Calendar day view, current day', () => {
  beforeEach(() => {
    cy.mount(
      <CalendarComponent
        currentView={CurrentView.DAY}
        currentDateProp={CURRENT_TIME_DATE}
      />,
    );
  });

  it('should render correctly', () => {
    checkAreSubcomponentsExist(true);
  });

  it('should has 24 row for every hour in day', () => {
    numberOfHours();
  });

  it('should navigate to the previous day on left arrow click', () => {
    navigateToPrevDay(CURRENT_TIME_DATE);
  });

  it('should navigate to the next day on right arrow click', () => {
    navigateToNextDay(CURRENT_TIME_DATE);
  });

  it('should navigate to the next day then go on current day on Now click', () => {
    navigateToNextThenOnToday(CURRENT_TIME_DATE);
  });
});
