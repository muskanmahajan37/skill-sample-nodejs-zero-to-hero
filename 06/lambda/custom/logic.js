const moment = require('moment-timezone'); // will help us do all the birthday math

module.exports = {
    getBirthdayData(day, month, year, timezone) {
        timezone = timezone ? timezone : 'Europe/Paris'; // so it works on the simulator, replace with line above once done with testing
        const today = moment().tz(timezone).startOf('day');
        const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        if(today.isAfter(nextBirthday))
            nextBirthday.add('years', 1);
        const age = today.diff(wasBorn, 'years');
        const daysLeft = nextBirthday.startOf('day').diff(today, 'days'); // same days returns 0

        return {
            daysLeft: daysLeft,
            age: age
        }
    },
    createReminderData(daysLeft, timezone, locale, message) {
        timezone = timezone ? timezone : 'Europe/Paris'; // so it works on the simulator, replace with your time zone
        moment.locale(locale);
        const now = moment().tz(timezone);
        const scheduled = now.startOf('day').add(daysLeft, 'days');
        console.log('Reminder schedule: ' + scheduled.format('YYYY-MM-DDTHH:mm:00.000'));

        return {
            requestTime: now.format('YYYY-MM-DDTHH:mm:00.000'),
            trigger: {
                type: 'SCHEDULED_ABSOLUTE',
                scheduledTime: scheduled.format('YYYY-MM-DDTHH:mm:00.000'),
                timeZoneId: timezone,
            },
            alertInfo: {
              spokenInfo: {
                content: [{
                  locale: locale,
                  text: message,
                }],
              },
            },
            pushNotification: {
              status: 'ENABLED',
            },
          };
    }
}