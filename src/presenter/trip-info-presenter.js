import { RenderPosition, render, remove } from '../framework/render';
import { buildTripInfo } from '../utils/trip-info-builder';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #container = null;
  #points = null;
  #destinations;
  #offers;
  #tripInfoComponent;
  constructor({ container, points, destinations, offers }) {
    this.#container = container;
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#points.addObserver(this.#handleDataChange);
  }

  init() {
    this.#rerenderTripInfoView();
  }

  #rerenderTripInfoView() {
    const previousTripInfo = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView({
      tripInfoData: buildTripInfo({
        points: this.#points.points,
        destinations: this.#destinations.destinations,
        offers: this.#offers.offers,
      }),
    });
    if (previousTripInfo) {
      remove(previousTripInfo);
    }
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleDataChange = () => {
    this.#rerenderTripInfoView();
  };
}
