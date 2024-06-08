import dayjs from 'dayjs';
import { FilterType } from '../const';

function getDuration(startTime, endTime) {
  const days = dayjs(endTime).diff(dayjs(startTime), 'days');
  const hours = dayjs(endTime).diff(dayjs(startTime), 'hours') % 24;
  const minutes = dayjs(endTime).diff(dayjs(startTime), 'minute') % 60;
  const formatDays = days !== 0 ? `${days}D ` : '';
  const formatHours = hours !== 0 ? `${hours}H ` : '';
  const formatMinutes = minutes !== 0 ? `${minutes}M` : '';
  return formatDays + formatHours + formatMinutes;
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}
function sortPointsByDuration(pointA, pointB) {
  const pointAMinutes = dayjs(pointA.dateTo).diff(
    dayjs(pointA.dateFrom),
    'minute'
  );
  const pointBMinutes = dayjs(pointB.dateTo).diff(
    dayjs(pointB.dateFrom),
    'minute'
  );
  const diff = pointAMinutes - pointBMinutes;
  if (diff > 0) {
    return -1;
  } else if (diff < 0) {
    return 1;
  }
  return 0;
}

function sortPointsByPrice(pointA, pointB) {
  const diff = pointA.basePrice - pointB.basePrice;
  if (diff > 0) {
    return -1;
  } else if (diff < 0) {
    return 1;
  }
  return 0;
}
const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB);
const isDurationEqual = (pointA, pointB) => {
  const pointAMinutes = dayjs(pointA.dateTo).diff(
    dayjs(pointA.dateFrom),
    'minute'
  );
  const pointBMinutes = dayjs(pointB.dateTo).diff(
    dayjs(pointB.dateFrom),
    'minute'
  );
  return pointAMinutes === pointBMinutes;
};

const isPriceEqual = (priceA, priceB) => priceA === priceB;
const isEventPresent = (dateFrom, dateTo) =>
  dayjs().diff(dateFrom) > 0 && dayjs().diff(dateTo) < 0;
const isEventPast = (dateTo) => dayjs().diff(dateTo) > 0;
const isEventFuture = (dateFrom) => dayjs().diff(dateFrom) < 0;

const filterPoints = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => isEventFuture(point.dateFrom)),
  [FilterType.PAST]: (points) =>
    points.filter((point) => isEventPast(point.dateTo)),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) => isEventPresent(point.dateFrom, point.dateTo)),
};

export {
  filterPoints,
  isPriceEqual,
  isEventFuture,
  isEventPast,
  isEventPresent,
  isDurationEqual,
  isDatesEqual,
  sortPointsByPrice,
  sortPointsByDuration,
  sortPointsByDay,
  getDuration,
};
