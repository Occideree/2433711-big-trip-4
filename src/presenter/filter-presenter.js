import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { FilterType, UpdateType } from '../const.js';
import { filterPoints } from '../utils/utils.js';

const isFilterDisabled = {
  [FilterType.EVERYTHING]: false,
  [FilterType.FUTURE]: false,
  [FilterType.PRESENT]: false,
  [FilterType.PAST]: false,
};
export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filterPoints[type](points).length,
    }));
  }

  init() {
    const filters = this.filters;
    filters.forEach(
      (filter) => (isFilterDisabled[filter.type] = filter.count === 0)
    );
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({
      isFilterDisabled: isFilterDisabled,
      filters: filters,
      currentFilter: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
