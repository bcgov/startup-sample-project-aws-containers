import moment from 'moment';

export const dateToString = (dateObj) => moment(dateObj).format('YYYY/MM/DD');

export const stringToDate = (dateStr) => moment(dateStr, 'YYYY/MM/DD');
