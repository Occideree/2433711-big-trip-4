/* eslint-disable indent */
import dayjs from 'dayjs';
import { getDuration } from '../utils/utils';

const createOffersList = (offers) =>
  offers
    ? offers
        .map(
          (offer) =>
            `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
  </li>`
        )
        .join('')
    : '';

export const createPointTemplate = ({
  point,
  pointDestination,
  pointOffers,
}) => {
  const { basePrice, dateFrom, dateTo, isFavorite, type, destination, offers } =
    point;

  const offersOfThisType = pointOffers.find(
    (offer) => offer.type === type
  ).offers;
  const selectedOffers = offers.flatMap((currentOffer) =>
    offersOfThisType.filter((typedOffer) => currentOffer === typedOffer.id)
  );
  const pointDest = pointDestination.find((d) => destination === d.id);
  const timeBetween = getDuration(dateFrom, dateTo);
  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${dateFrom}>${dayjs(dateFrom).format(
    'MMM DD'
  )}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${pointDest.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${dateFrom}>${dayjs(
    dateFrom
  ).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime=${dateTo}>${dayjs(
    dateTo
  ).format('HH:mm')}</time>
        </p>
        <p class="event__duration">${timeBetween}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersList(selectedOffers)}
      </ul>
      <button class="event__favorite-btn ${
        isFavorite ? 'event__favorite-btn--active' : ''
      }" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
