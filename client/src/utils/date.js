import moment from 'moment';

export const dateToString = (dateObj) => moment(new Date(dateObj)).format('YYYY/MM/DD');

export const timeTo24hString = (dateObj) => moment(new Date(dateObj)).format('HH:mm:ss');

export const stringToDate = (dateStr) => moment(dateStr, 'YYYY/MM/DD');
