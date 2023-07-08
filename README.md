The Calendar component allows displaying a calendar with a time schedule and interactive capabilities. In this documentation, all the props that can be passed to the component to customize its appearance and behavior will be described.

**Live demo with examples: _https://64a7f9553a2478c46491aea9-hawmjlzeay.chromatic.com/?path=/story/ui-components-calendar--calendar_**

Props:

- data (Required): An array of objects representing the event data to be displayed on the calendar. Each object in the array should contain the following fields:
  - id: Unique identifier for the event (number).
  - startTime: Start time of the event in the format 'YYYY-MM-DDTHH:mm:ssZ'.
  - endTime: End time of the event in the format 'YYYY-MM-DDTHH:mm:ssZ'.
  - title: Title of the event to be displayed on the calendar (optional).
  - bgColor: Background color of the event (optional). If not provided, the default color will be used.
  - textColor: Text color of the event (optional). If not provided, the default color will be used.

- currentView (Required): The type of calendar view. It can be one of the following strings:
  - WEEK_TIME
  - DAY
  - MONTH
  - WEEK
  - WEEK_IN_PLACE
  - DAY_IN_PLACE

- currentDate (Required): The current date displayed on the calendar.

- activeTimeDateField (Required): The field based on which the elements will be positioned. It can be any time date field from the data array. It can also be an interval separated by a '-'.

- renderItem: A callback function for custom rendering of calendar elements. It takes two arguments: data (Record<string, any>) and isHovered (boolean), and should return a JSX.Element.

- renderItemText: A callback function for custom rendering of calendar element text.

- renderHeaderItem: A callback function for custom rendering of header elements in WEEK_TIME and DAY views.

- renderHeaderItemText: A callback function for custom rendering of header element text in WEEK_TIME and DAY views.

- enableHoverEffect: If set to true, it adds a 'hovered' class to each calendar element, which can be used to apply hover effects.

- setCurrentDate: A callback function that is called when the current date is changed. It takes a date string as an argument.

- colorDots: An array of objects representing color dots to be displayed on the calendar. Each object should have the following fields:
  - color: Dot color.
  - text: Information text.
  - date: Date based on which the color dot will be positioned.

- onDayNumberClick: A callback function that is called when a day number is clicked. It takes a day string as an argument.

- onDayStringClick: A callback function that is called when a day string or date is clicked. It takes a day string or Date object as an argument.

- onHourClick: A callback function that is called when an hour on the left side of the calendar is clicked. It takes a DateInfo or number as an argument.

- onColorDotClick: A callback function that is called when a color dot is clicked. It takes a ColorDotInfo object as an argument.

- onItemClick: A callback function that is called when an item on the calendar is clicked. It takes an item object as an argument.

- onCellClick: A callback function that is called when a cell on the calendar is clicked. It takes a DateInfo object as an argument.

- timeDateFormat: An object specifying the time units display format. It should have the following fields:
  - day: Format for the day in the calendar header.
  - hour: Format for the hour on the left side of the calendar.
  - monthYear: Format for the month and year in the navigation.
  - weekStartsOn: It regulates the beginning of the week. It should be an odd number from zero to six, where 0 represents Sunday.

- cellDisplayMode: This prop will not be applied on WEEK_TIME and DAY views. It allows customizing the display mode for each view. It should be an object where the keys represent the view types (WEEK_TIME, DAY, MONTH, etc.), and the values specify the display mode for each view. The display mode can be one of the following strings:
  - ALL_EXPANDED (by default)
  - ALL_COLLAPSED
  - CUSTOM
