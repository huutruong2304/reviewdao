//exercise 1:
const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const shortMonthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dateConfig = (date) => ({
    day: daysArr[date.getDay()],
    date: date.getDate() + 1,
    date_2digit: (date.getDate() + 1).toString().length == 1 ? (date.getDate() + 1).toString() + '0' : (date.getDate() + 1).toString(),
    month: monthsArr[date.getMonth()],
    shortMonth: shortMonthsArr[date.getMonth()],
    numberMonth_1digit: date.getMonth() + 1,
    numberMonth_2digit: (date.getMonth() + 1).toString().length == 1 ? (date.getMonth() + 1).toString() + '0' : (date.getMonth() + 1).toString(),
    year: date.getFullYear(),
    year_2digit: date.getFullYear().toString().slice(2, 4),
    time24h_full: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
    time24h_short: date.getHours() + ':' + date.getMinutes(),
    time12h_full: date.getHours() > 12 ? (date.getHours() - 12 + ':' + date.getMinutes() + ':' + date.getSeconds() + ' PM') : (date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' AM'),
    time12h_short: date.getHours() > 12 ? (date.getHours() - 12 + ':' + date.getMinutes() + ' PM') : (date.getHours() + ':' + date.getMinutes() + ' AM'),
    full: date.toString()
})

const formatDateFull = (date) => {
    // console.log(date)
    var value = dateConfig(date)
        // console.log(value)
    return value.time24h_short + ' ' + value.shortMonth + ' ' + value.date + ', ' + value.year
}

module.exports = formatDateFull