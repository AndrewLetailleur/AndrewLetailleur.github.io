export class SystemInfo
    {

    }

export class DateInfo
    {
    static TimeDifference(dateStart)
        {

        return Date.now() - dateStart.getTime();
        }

    static DayDifference(dateStart, dateEnd)
        {
        //Get Time Diff / ([Milliseconds in a day] * ([seconds in min] * [mins in hours]) * [hours in day]
        return this.TimeDifference(dateStart) / (1000 * 3600 * 24);
        }

    /**
     *@type {Date} date
     */
    static GetUTCDate(date)
        {
        return `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`
        }
    }