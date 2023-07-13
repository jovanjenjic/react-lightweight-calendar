## React Lightweight Calendar Component Documentation

### Information

The `Calendar` component allows you to visualize entities. It provides various customization options to tailor the appearance and behavior of the calendar to your needs.

It can be designed for displaying various entities such as events, orders, activity calendars, reservations, bookings, rentals etc. It can be used for any entity that has at least one field in the ISO 8601 format. Each element on the calendar can be positioned based on a single field, based on any field that the data array contains, or based on any interval defined by separating two time date fields with a `-`.

**Storybook usage example:** https://64a7f9553a2478c46491aea9-irakdchkma.chromatic.com/?path=/story/ui-components-calendar--calendar

The component is written in TypeScript and is covered by over 60 tests. The calendar was developed using pure html, css and js (ts). The only library the calendar relies on during development is `date-fns`. 
The plan is to continue developing additional views and functionalities. The priority for developing other features is based on the emerging needs.

### Images

| WEEK_TIME | DAY | MONTH | WEEK  | WEEK_IN_PLACE | DAY_IN_PLACE |
| :---:         |     :---:      |         :---: | :---: | :---:         | :---:         |
| [IMAGE LINK](https://github.com/jovanjenjic/react-lightweight-calendar/assets/57072437/a0ed5178-73d3-4e2f-ad10-b2fa7e1c0d31)   | [IMAGE LINK](https://github.com/jovanjenjic/react-lightweight-calendar/assets/57072437/130776e2-437a-4335-a759-ea94f5784a6c)     | [IMAGE LINK](https://github.com/jovanjenjic/react-lightweight-calendar/assets/57072437/6a1612b3-f5d3-494c-9776-2f0c791a1ff1)    |   [IMAGE LINK](https://github.com/jovanjenjic/react-lightweight-calendar/assets/57072437/4648f562-8841-4751-b246-e06ffdb82020)    |    [IMAGE LINK](https://github.com/jovanjenjic/react-lightweight-calendar/assets/57072437/17af45bb-1ef7-471b-bc64-6094d4849933)           |     [IMAGE LINK](https://github.com/jovanjenjic/react-lightweight-calendar/assets/57072437/cf27dfec-2b31-4dd5-9631-e61e3b5a7e58)         |

### Props

The `Calendar` component accepts the following props:

- `data` (_REQUIRED_): An array of item (for example event) objects that will be displayed on the calendar. Each item object should have the following properties:
  - `id`: A unique identifier for the item.
  - `startTime`: The start time of the item in ISO 8601 format. (it doesn't have to be strictly called the _startTime_)
  - `endTime`: The end time of the item in ISO 8601 format. (it doesn't have to be strictly called the _endTime_)
  - `title`: The title or label for the item (optional).
  - `bgColor`: The background color of the item (optional).
  - `textColor`: The text color of the item (optional).

- `currentView` _(DEFAULT: MONTH)_: A string indicating the current view of the calendar. It can be one of the following options:
  - `WEEK_TIME`: Display the calendar in a week view with a timeline.
  - `DAY`: Display the calendar in a day view with a timeline.
  - `MONTH`: Display the calendar in a month view with a timeline.
  - `WEEK`: Display the calendar in a week view with a timeline (similar as `MONTH` view).
  - `WEEK_IN_PLACE`: Display the calendar in a week view without a timeline. It is intended for grouping elements based on the start time interval. It can only be used to show the schedule of elements by hours
  - `DAY_IN_PLACE`: Display the calendar in a day view without a timeline. It is intended for grouping elements based on the start time interval. It can only be used to show the schedule of elements by hours

- `currentDate` _(REQUIRED, DEFAULT: now)_: The current date displayed on the calendar in the format 'YYYY-MM-DD'.

- `setCurrentDate`: A callback function that is called when the current date is changed. It receives the new date as a parameter. If not sent, the **navigation** will not be visible

- `activeTimeDateField` _(required)_: The field based on which the events will be positioned on the calendar. It can be any time date field from the `data` array. It can also be an interval separated by a '-'. (`startTime`, `endTime`, `createdAt`, `updatedAt`, `startTime-endTime`, `createdAt-updated`...)

- `weekStartsOn`: A number that regulates which day the week starts on. The numbers range from 0 to 6, where 0 represents Sunday, 1 represents Monday, and so on.

- `renderItem`: A callback function for custom rendering of each element. It receives the item data and a boolean indicating if the element is currently being hovered over.

- `renderItemText`: A callback function for custom rendering of the text content of each element. It receives the item data.

- `renderHeaderItem`: A callback function for custom rendering of the header element in the `WEEK_TIME` and `DAY` views. It receives the header item data and additional information about the element's position.

- `renderHeaderItemText`: A callback function for custom rendering of the text content of the header element in the `WEEK_TIME` and `DAY` views. It receives the header item data.

- `enableHoverEffect`: A boolean value that determines whether a 'hovered' class name will be added to each hovered element. This can be used to apply custom styling to the hovered elements.

- `colorDots`: An array of color dot objects that can be used to mark specific dates on the calendar. Each color dot object should have the following properties:
  - `color`: The color of the dot.
  - `text`: Information text associated with the dot.
  - `date`: The date on which the dot will be positioned.

- `timeDateFormat`: An object that defines the format of time units displayed on the calendar. More about acceptable formats: https://date-fns.org/v2.29.3/docs/format.
  - `day`: The format for displaying the day in the calendar header.
  - `hour`: The format for displaying the hour on the left side of the calendar.
  - `monthYear`: The text for displaying the month and year in the navigation.

- `onDayNumberClick`: A callback function that is called when a day number is clicked. It receives the clicked day as a parameter.

- `onDayStringClick`: A callback function that is called when a day text is clicked. It receives the clicked day as a parameter.

- `onHourClick`: A callback function that is called when an hour on the left side of the calendar is clicked. It receives the clicked hour as a parameter.

- `onColorDotClick`: A callback function that is called when a color dot is clicked. It receives the clicked color dot information as a parameter.

- `onItemClick`: A callback function that is called when an item is clicked. It receives the clicked item data as a parameter.

- `onCellClick`: A callback function that is called when a cell on the calendar is clicked. It receives the clicked cell date information as a parameter.

- `cellDisplayMode`: An object that controls the display mode of the cells in the calendar. It should have the following structure:
  - `[CURRENT_VIEW]`: The current view of the calendar (e.g., `WEEK_TIME`, `DAY`, `MONTH`, etc.).
    - `inactiveCells`: An array of inactive cell dates that should be hidden.
    - `state`: The state of the cell display mode. It can be one of the following options:
      - `ALL_EXPANDED`: Show all cells expanded (default).
      - `ALL_COLLAPSED`: Show all cells collapsed.
      - `CUSTOM`: Use a custom display mode for cells.
     
### Custom Styling

Access any component by **className** and apply whatever style you want

#### Example

```css
/* CalendarCustomStyles.css */

.week-time-header__number {
    color: #205c97
}

.week-time-view-inside {
  background-color: #f8faff;
}
```

```jsx
    import './CalendarCustomStyles';

    ...

    <Calendar
      data={[
        {
          id: '1',
          startTime: '2023-06-02T01:10:00Z',
          endTime: '2023-06-02T03:10:00Z',
          title: 'Conference',
        },
      ]}
      currentView='WEEK_TIME'
      currentDate='2023-06-01'
      activeTimeDateField='startTime-endTime'
    />

  ...
```

### Usage Example

```jsx
import React from 'react';
import Calendar from 'react-lightweight-calendar';

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-02');
  return (
    <Calendar
      data={[
        {
          id: '1',
          startTime: '2023-06-02T01:10:00Z',
          endTime: '2023-06-02T03:10:00Z',
          title: 'Conference',
        },
        {
          id: '2',
          startTime: '2023-06-02T01:00:00Z',
          endTime: '2023-06-02T02:00:00Z',
          title: 'Meet up',
        },
        {
          id: '3',
          startTime: '2023-06-02T04:20:00Z',
          endTime: '2023-06-02T05:20:00Z',
          title: 'Codefair',
          bgColor: 'rgb(129, 205, 242)',
          textColor: 'white',
        },
      ]}
      currentView='WEEK_TIME'
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      activeTimeDateField='startTime-endTime' // Or just startTime or just endTime
      weekStartsOn={1} // Monday
      // If you want additional customization, uncomment the code and make the appropriate changes
      // renderItem={(data, isHovered) => {
        // Custom rendering of event element
        // return (
              // <>
                // <div>{data.title}</div>
                // <div>{data.id}</div>
              // </>
          // )
        // console.log(data, isHovered);
      // }}
      // renderItemText={(data) => {
        // Custom rendering of event element text
        // return <p>{data.title}</p>;
      // }}
      // renderHeaderItem={(data, extras) => {
        // Custom rendering of header element
        // return <div>{data.startTime}-{date.endTime}</div>;
      // }}
      // renderHeaderItemText={(data) => {
        // Custom rendering of header element text
        // return <p>{data.title}</p>;
      // }}
      enableHoverEffect={true}
      colorDots={[
        {
          color: 'red',
          text: 'Busy day',
          date: '2023-06-02',
        },
      ]}
      timeDateFormat={{
        day: 'EEEE',
        hour: 'hh a',
        monthYear: 'LLLL yyyy',
      }}
      onDayNumberClick={(day) => {
        // Handle day number click
        console.log(day);
      }}
      onDayStringClick={(day) => {
        // Handle day text click
        console.log(day);
      }}
      onHourClick={(value) => {
        // Handle hour click
        console.log(value);
      }}
      onColorDotClick={(value) => {
        // Handle color dot click
        console.log(value);
      }}
      onItemClick={(item) => {
        // Handle event item click
        console.log(item);
      }}
      onCellClick={(value) => {
        // Handle cell click
        console.log(value);
      }}
      cellDisplayMode={{
        WEEK_TIME: {
          inactiveCells: ['2023-05-29'],
          state: 'CUSTOM',
        },
      }}
    />
  );
};
      
export default MyCalendar;
```

### Licence

The MIT License. Unauthorized copying is prohibited under the MIT License.

### Contact info

For more information or questions, you can contact me via:

- email: jovan.jenjic@gmail.com
- Linkedin profile: https://www.linkedin.com/in/jovan-jenji%C4%87/
     
