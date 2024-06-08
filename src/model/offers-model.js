export default class OffersModel {
  #offers = [];
  #offersApiService;
  constructor({ offersApiService }) {
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch (err) {
      this.#offers = [];
    }
  }

  get offers() {
    return this.#offers;
  }
}
