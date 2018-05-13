import { VIEWPORT_S } from '../utils/constants';

export default class {
  constructor($el) {
    // local state
    this.listState = 'close';

    // selectors
    this.$btn = $el.querySelector('.downloads__btn');
    this.$downloadsList = $el.querySelector('.downloads__list');

    // bind methods
    this.toggleDownloadsList = this.toggleDownloadsList.bind(this);
    this.restoreNavOnBiggerDevice = this.restoreNavOnBiggerDevice.bind(this);
  }

  toggleDownloadsList() {
    if(this.listState === 'close') {
      this.openDownloadsList();
    } else {
      this.closeDownloadsList();
    }
  }
  
  openDownloadsList() {
    this.listState = 'open';
    this.$downloadsList.classList.add('downloads__list--is-visible');
  }

  closeDownloadsList() {
    this.listState = 'close';
    this.$downloadsList.classList.remove('downloads__list--is-visible');
  }

  restoreNavOnBiggerDevice() {
    if (this.listState === 'open' && window.matchMedia(`(min-width: ${VIEWPORT_S}px)`).matches) {
      this.closeDownloadsList();
    }
  }

  // init component
  init() {
    this.$btn.addEventListener('click', this.toggleDownloadsList);
    window.addEventListener('resize', this.restoreNavOnBiggerDevice);
  }
}