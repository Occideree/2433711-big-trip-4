/* eslint-disable camelcase */
import { EMPTY_POINT } from '../const';
import { createPointEditTemplate } from '../template/point-edit-template.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';
export default class PointEditView extends AbstractStatefulView {
  #pointDestinations;
  #pointOffers;
  #handleFormSubmit = null;
  #handleCancelClick;
  #handleDeleteClick;
  #datepickerFrom = null;
  #datepickerTo = null;
  constructor({
    point = EMPTY_POINT,
    pointDestination,
    pointOffers,
    onFormSubmit,
    OnCancelClick,
    onDeleteClick,
  }) {
    super();

    this.#pointDestinations = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleFormSubmit = onFormSubmit;
    this._setState(
      PointEditView.parsePointToState(point, pointDestination, pointOffers)
    );
    this.#handleCancelClick = OnCancelClick;
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      pointDestination: this.#pointDestinations,
      pointOffers: this.#pointOffers,
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCancelHandler);
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.#setFlatpickrs();
  }

  #setFlatpickrs = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      }
    );
  };

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #pointTypeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: parseInt(evt.target.value, 10),
    });
  };

  #offersChangeHandler = () => {
    const selectedOffers = Array.from(
      this.element.querySelectorAll('.event__offer-checkbox:checked')
    ).map(({ id }) => id.split('-').slice(2).join('-'));
    this._setState({
      offers: selectedOffers,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #destinationChangeHandler = (evt) => {
    this.updateElement({
      destination: this.#pointDestinations.find(
        (destination) => destination.name === evt.target.value
      ).id,
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isDeleting;
    delete point.isSaving;
    return point;
  }
}
