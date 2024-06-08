import TripInfoPresenter from './presenter/trip-info-presenter.js';
import BoardPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './api/points-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';
import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic e2c3a4d8e7dfg5df4FDG564Dgfd546g';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

export const filterContainer = document.querySelector(
  '.trip-controls__filters'
);
const tripInfoContainer = document.querySelector('.trip-main');
const boardContainer = document.querySelector('.trip-events');
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION),
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION),
});
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  container: boardContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});
const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel,
});
const tripInfoPresenter = new TripInfoPresenter({
  container: tripInfoContainer,
  points: pointsModel,
  destinations: destinationsModel,
  offers: offersModel,
});
const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

async function initModels() {
  await destinationsModel.init();

  await offersModel.init();
  await pointsModel.init();
  render(newPointButtonComponent, tripInfoContainer);
}
boardPresenter.init();
filterPresenter.init();
tripInfoPresenter.init();
initModels();
