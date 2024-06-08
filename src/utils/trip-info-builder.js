import dayjs from 'dayjs';
import { sortPointsByDay } from './utils';

export function buildTripInfo({ points, destinations, offers }) {
  const tripInfoData = {
    price: 0,
    tripDate: '',
    tripPath: '',
  };
  if (points.length === 0) {
    return tripInfoData;
  }
  const sortedPoints = [...points.sort(sortPointsByDay)];
  const pathDestinations = [];
  points.forEach((point) => {
    tripInfoData.price += point.basePrice;
    const offersOfCurrentType = offers.find(
      (offer) => offer.type === point.type
    ).offers;
    pathDestinations.push(
      destinations.find((dest) => dest.id === point.destination).name
    );
    point.offers.forEach(
      (offerID) =>
        (tripInfoData.price += offersOfCurrentType.find(
          (offer) => offer.id === offerID
        ).price)
    );
  });
  tripInfoData.tripDate = createTripDate(sortedPoints);
  tripInfoData.tripPath = createTripPath(pathDestinations);
  return tripInfoData;
}

function createTripDate(points) {
  const formattedDate = dayjs(points[0].dateFrom)
    .format('DD MMM')
    .concat(
      ' &nbsp; &mdash; &nbsp; ',
      dayjs(points[points.length - 1].dateTo).format('DD MMM')
    );
  if (formattedDate.slice(3, 6) === formattedDate.slice(32, 35)) {
    return formattedDate
      .slice(3, 7)
      .toUpperCase()
      .concat(
        formattedDate.slice(0, 2),
        ' &nbsp; &mdash; &nbsp; ',
        formattedDate.slice(29, 31)
      );
  }
  return formattedDate;
}

function createTripPath(destinations) {
  if (destinations.length > 3) {
    return destinations[0].concat(
      ' &mdash; ... &mdash; ',
      destinations[destinations.length - 1]
    );
  }
  let path = '';
  destinations.forEach(
    (destination) => (path += destination.concat(' &mdash; '))
  );

  return path.slice(0, path.length - 9);
}
