import { VIEWPORT_S } from '../utils/constants';

export default class {
  constructor($el) {
    // local state
    this.navState = 'close';
    
    // selectors
    this.$el = $el;
    this.$btn = $el.querySelector('.navigation__toggle');
    this.$menu = $el.querySelector('.navigation__list');
    this.$icon = this.$btn.querySelector('i');

    // bind methods
    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.restoreNavOnBiggerDevice = this.restoreNavOnBiggerDevice.bind(this);
  }

  restoreNavOnBiggerDevice() {
    if (this.navState === 'open' && window.matchMedia(`(min-width: ${VIEWPORT_S}px)`).matches) {
      this.closeMenu();
    }
  }

  toggleNavigation() {
    if(this.navState === 'close') {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.navState = 'open';

    this.$icon.classList.add('icon-cross');
    this.$icon.classList.remove('icon-menu');

    this.$btn.classList.add('navigation__toggle--on');
    this.$menu.classList.add('navigation__list--isopen');
  }

  closeMenu() {
    this.navState = 'close';
      
    this.$icon.classList.add('icon-menu');
    this.$icon.classList.remove('icon-cross');

    this.$btn.classList.remove('navigation__toggle--on');
    this.$menu.classList.remove('navigation__list--isopen');
  }

  // init component
  init() {
    this.$btn.addEventListener('click', this.toggleNavigation);
    window.addEventListener('resize', this.restoreNavOnBiggerDevice);
  }
}