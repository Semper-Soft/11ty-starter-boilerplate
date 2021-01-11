const { DateTime } = require('luxon');

module.exports = {
  dateToISO: (date, zone = 'local') => {
    return DateTime.fromJSDate(date, { zone }).toISO({
      includeOffset: false,
      suppressMilliseconds: true
    });
  }
};
