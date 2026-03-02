/* ============================================================
   VANTOR — Theme JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Cart Drawer --- */
  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector('.cart-drawer');
      this.backdrop = document.querySelector('.cart-drawer__backdrop');
      if (!this.drawer) return;

      this.bindEvents();
    }

    bindEvents() {
      document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      });

      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.close());
      }

      this.drawer.querySelector('[data-cart-close]')?.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });
    }

    isOpen() {
      return this.drawer.classList.contains('is-open');
    }

    open() {
      this.drawer.classList.add('is-open');
      this.backdrop?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.drawer.querySelector('[data-cart-close]')?.focus();
    }

    close() {
      this.drawer.classList.remove('is-open');
      this.backdrop?.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle() {
      this.isOpen() ? this.close() : this.open();
    }
  }

  /* --- Desktop Navigation (mega menus on primary nav items) --- */
  class DesktopNav {
    constructor() {
      this.header = document.querySelector('[data-header]');
      if (!this.header) return;

      this.megaItems = this.header.querySelectorAll('[data-nav-mega]');
      this.activeMega = null;
      this.hoverTimeout = null;
      this.leaveTimeout = null;

      this.bindMegaItems();
      this.bindHeaderLeave();
    }

    bindMegaItems() {
      this.megaItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          clearTimeout(this.leaveTimeout);
          clearTimeout(this.hoverTimeout);
          this.hoverTimeout = setTimeout(() => this.showMega(item), 80);
        });

        item.addEventListener('mouseleave', () => {
          clearTimeout(this.hoverTimeout);
          this.leaveTimeout = setTimeout(() => this.hideMega(), 150);
        });
      });
    }

    bindHeaderLeave() {
      this.header.addEventListener('mouseleave', () => {
        clearTimeout(this.hoverTimeout);
        this.leaveTimeout = setTimeout(() => this.hideMega(), 200);
      });

      this.header.addEventListener('mouseenter', () => {
        clearTimeout(this.leaveTimeout);
      });
    }

    showMega(item) {
      if (this.activeMega && this.activeMega !== item) {
        this.activeMega.classList.remove('is-mega-active');
      }
      item.classList.add('is-mega-active');
      this.activeMega = item;
    }

    hideMega() {
      if (this.activeMega) {
        this.activeMega.classList.remove('is-mega-active');
        this.activeMega = null;
      }
    }
  }

  /* --- More Dropdown (overflow collections) --- */
  class MoreDropdown {
    constructor() {
      this.el = document.querySelector('[data-more-dropdown]');
      if (!this.el) return;

      this.timeout = null;

      this.el.addEventListener('mouseenter', () => {
        clearTimeout(this.timeout);
        this.el.classList.add('is-open');
      });

      this.el.addEventListener('mouseleave', () => {
        this.timeout = setTimeout(() => this.el.classList.remove('is-open'), 150);
      });

      this.el.querySelector('.header__more-trigger')?.addEventListener('click', () => {
        this.el.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!this.el.contains(e.target)) {
          this.el.classList.remove('is-open');
        }
      });
    }
  }

  /* --- Support Dropdown --- */
  class SupportDropdown {
    constructor() {
      this.el = document.querySelector('[data-support-dropdown]');
      if (!this.el) return;

      this.timeout = null;

      this.el.addEventListener('mouseenter', () => {
        clearTimeout(this.timeout);
        this.el.classList.add('is-open');
      });

      this.el.addEventListener('mouseleave', () => {
        this.timeout = setTimeout(() => this.el.classList.remove('is-open'), 150);
      });

      this.el.querySelector('.header__support-trigger')?.addEventListener('click', () => {
        this.el.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!this.el.contains(e.target)) {
          this.el.classList.remove('is-open');
        }
      });
    }
  }

  /* --- Locale Selector --- */
  class LocaleSelector {
    constructor() {
      document.querySelectorAll('[data-locale-selector]').forEach(el => {
        const trigger = el.querySelector('.locale-selector__trigger');
        if (!trigger) return;

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('[data-locale-selector].is-open').forEach(other => {
            if (other !== el) other.classList.remove('is-open');
          });
          const open = el.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', open);
          el.querySelector('.locale-selector__dropdown')?.setAttribute('aria-hidden', !open);
        });
      });

      document.addEventListener('click', () => {
        document.querySelectorAll('[data-locale-selector].is-open').forEach(el => {
          el.classList.remove('is-open');
          el.querySelector('.locale-selector__trigger')?.setAttribute('aria-expanded', 'false');
          el.querySelector('.locale-selector__dropdown')?.setAttribute('aria-hidden', 'true');
        });
      });
    }
  }

  /* --- Mobile Menu --- */
  class MobileMenu {
    constructor() {
      this.menu = document.querySelector('.mobile-menu');
      if (!this.menu) return;

      this.bindEvents();
      this.initAccordions();
    }

    bindEvents() {
      document.querySelectorAll('[data-menu-toggle]').forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });

      this.menu.querySelector('[data-menu-close]')?.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });
    }

    initAccordions() {
      this.menu.querySelectorAll('[data-mobile-accordion-trigger]').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const parent = trigger.closest('[data-mobile-accordion]');
          const content = parent?.querySelector('[data-mobile-accordion-content]');
          if (!content) return;

          const isOpen = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', String(!isOpen));
          content.setAttribute('aria-hidden', String(isOpen));

          if (isOpen) {
            content.style.maxHeight = '0';
          } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            this.updateParentHeights(content);
          }
        });
      });
    }

    updateParentHeights(el) {
      let parent = el.parentElement?.closest('[data-mobile-accordion-content]');
      while (parent) {
        parent.style.maxHeight = parent.scrollHeight + el.scrollHeight + 'px';
        parent = parent.parentElement?.closest('[data-mobile-accordion-content]');
      }
    }

    isOpen() {
      return this.menu.classList.contains('is-open');
    }

    open() {
      this.menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle() {
      this.isOpen() ? this.close() : this.open();
    }
  }

  /* --- Search Overlay --- */
  class SearchOverlay {
    constructor() {
      this.overlay = document.querySelector('.search-overlay');
      if (!this.overlay) return;

      this.input = this.overlay.querySelector('.search-overlay__input');
      this.bindEvents();
    }

    bindEvents() {
      document.querySelectorAll('[data-search-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      });

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
        if (e.key === '/' && !this.isOpen() && !isInputFocused()) {
          e.preventDefault();
          this.open();
        }
      });
    }

    isOpen() {
      return this.overlay.classList.contains('is-open');
    }

    open() {
      this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => this.input?.focus(), 100);
    }

    close() {
      this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle() {
      this.isOpen() ? this.close() : this.open();
    }
  }

  /* --- Tabs --- */
  class Tabs {
    constructor(container) {
      this.container = container;
      this.tabs = container.querySelectorAll('.tabs__tab');
      this.panels = container.querySelectorAll('.tabs__panel');

      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => this.activate(tab.dataset.tab));
      });
    }

    activate(id) {
      this.tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === id));
      this.panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === id));
    }
  }

  /* --- Accordion --- */
  class Accordion {
    constructor(container) {
      this.items = container.querySelectorAll('.accordion__item');

      this.items.forEach(item => {
        const trigger = item.querySelector('.accordion__trigger');
        const content = item.querySelector('.accordion__content');

        trigger?.addEventListener('click', () => {
          const isOpen = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', !isOpen);
          content.setAttribute('aria-hidden', isOpen);

          if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = '0';
          }
        });
      });
    }
  }

  /* --- Product Gallery --- */
  class ProductGallery {
    constructor(container) {
      this.main = container.querySelector('.pdp__gallery-main img');
      this.thumbs = container.querySelectorAll('.pdp__gallery-thumb');

      this.thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          this.thumbs.forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
          if (this.main) {
            this.main.src = thumb.querySelector('img').dataset.fullSrc || thumb.querySelector('img').src;
          }
        });
      });
    }
  }

  /* --- Quantity Selector --- */
  class QuantitySelector {
    constructor(container) {
      this.input = container.querySelector('input');
      const minus = container.querySelector('[data-qty-minus]');
      const plus = container.querySelector('[data-qty-plus]');

      minus?.addEventListener('click', () => this.update(-1));
      plus?.addEventListener('click', () => this.update(1));
    }

    update(delta) {
      const current = parseInt(this.input.value) || 1;
      const min = parseInt(this.input.min) || 1;
      const max = parseInt(this.input.max) || 99;
      this.input.value = Math.min(Math.max(current + delta, min), max);
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /* --- Carousel --- */
  class Carousel {
    constructor(container) {
      this.track = container.querySelector('.carousel__track');
      const prevBtn = container.querySelector('[data-carousel-prev]');
      const nextBtn = container.querySelector('[data-carousel-next]');

      prevBtn?.addEventListener('click', () => this.scroll(-1));
      nextBtn?.addEventListener('click', () => this.scroll(1));
    }

    scroll(direction) {
      if (!this.track) return;
      const slide = this.track.querySelector('.carousel__slide');
      if (!slide) return;
      const scrollAmount = slide.offsetWidth + 16;
      this.track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  }

  /* --- Sticky Header --- */
  class StickyHeader {
    constructor() {
      this.header = document.querySelector('.header');
      if (!this.header) return;

      this.lastScroll = 0;
      this.threshold = 100;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > this.threshold && currentScroll > this.lastScroll) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }

      this.lastScroll = currentScroll;
    }
  }

  /* --- Variant Selector --- */
  class VariantSelector {
    constructor(container) {
      this.form = container;
      this.idInput = container.querySelector('[data-variant-id-input]');
      this.variants = JSON.parse(
        (container.querySelector('[data-product-variants]') || {}).textContent || '[]'
      );
      this.pills = container.querySelectorAll('.variant-pill');
      this.priceEl = document.querySelector('.pdp__price');
      this.compareEl = document.querySelector('.pdp__compare-price');
      this.badgeEl = document.querySelector('.pdp__price-row .badge--sale');
      this.addBtn = container.querySelector('[type="submit"]');
      this.mainImage = document.getElementById('pdp-main-image');
      this.stickyPrice = document.querySelector('.pdp-sticky-bar__price');

      this.initFromUrl();
      this.pills.forEach(pill => pill.addEventListener('click', () => this.onPillClick(pill)));
      this.interceptSiblingClicks();
    }

    initFromUrl() {
      const params = new URLSearchParams(window.location.search);

      const variantId = parseInt(params.get('variant'), 10);
      if (variantId) {
        const variant = this.variants.find(v => v.id === variantId);
        if (variant) {
          this.selectVariantPills(variant);
          this.updateVariant(variant);
          return;
        }
      }

      const size = params.get('size');
      if (size && this.variants.length > 0) {
        const variant = this.variants.find(v =>
          v.available && v.options.some(o => o === size)
        ) || this.variants.find(v => v.options.some(o => o === size));
        if (variant) {
          this.selectVariantPills(variant);
          this.updateVariant(variant);
        }
      }
    }

    selectVariantPills(variant) {
      const groups = this.form.querySelectorAll('.pdp__variants');
      let optionIdx = 0;
      groups.forEach(group => {
        if (group.querySelector('[data-color-siblings]')) return;
        const targetValue = variant.options[optionIdx];
        if (targetValue) {
          group.querySelectorAll('.variant-pill').forEach(p => {
            p.classList.toggle('is-active', p.dataset.optionValue === targetValue);
          });
        }
        optionIdx++;
      });
    }

    interceptSiblingClicks() {
      const siblingLinks = this.form.querySelectorAll('[data-sibling-link]');
      siblingLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const activeSize = this.getSelectedNonColorOption();
          if (!activeSize) return;
          e.preventDefault();
          const url = new URL(link.href, window.location.origin);
          url.searchParams.set('size', activeSize);
          window.location.href = url.toString();
        });
      });
    }

    getSelectedNonColorOption() {
      const groups = this.form.querySelectorAll('.pdp__variants');
      for (const group of groups) {
        if (group.querySelector('[data-color-siblings]')) continue;
        const active = group.querySelector('.variant-pill.is-active');
        if (active) return active.dataset.optionValue;
      }
      return null;
    }

    onPillClick(pill) {
      const group = pill.closest('.pdp__variants');
      group.querySelectorAll('.variant-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      const selectedOptions = [];
      this.form.querySelectorAll('.pdp__variants').forEach(g => {
        const active = g.querySelector('.variant-pill.is-active');
        if (active) selectedOptions.push(active.dataset.optionValue);
      });

      const variant = this.variants.find(v =>
        v.options.length === selectedOptions.length &&
        v.options.every((opt, i) => opt === selectedOptions[i])
      );

      if (variant) this.updateVariant(variant);
    }

    updateVariant(variant) {
      if (this.idInput) this.idInput.value = variant.id;

      const url = new URL(window.location);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);

      if (this.priceEl) {
        this.priceEl.textContent = variant.price_formatted;
        this.priceEl.classList.toggle(
          'pdp__price--sale',
          variant.compare_at_price && variant.compare_at_price > variant.price
        );
      }

      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        const savings = Math.round((variant.compare_at_price - variant.price) / variant.compare_at_price * 100);
        if (this.compareEl) {
          this.compareEl.textContent = variant.compare_at_price_formatted;
          this.compareEl.style.display = '';
        }
        if (this.badgeEl) {
          this.badgeEl.textContent = `-${savings}%`;
          this.badgeEl.style.display = '';
        }
      } else {
        if (this.compareEl) this.compareEl.style.display = 'none';
        if (this.badgeEl) this.badgeEl.style.display = 'none';
      }

      if (this.addBtn) {
        if (variant.available) {
          this.addBtn.disabled = false;
          this.addBtn.innerHTML = `${this.addBtn.textContent.split('—')[0].trim()} &mdash; ${variant.price_formatted}`;
        } else {
          this.addBtn.disabled = true;
          this.addBtn.textContent = 'Sold Out';
        }
      }

      if (this.stickyPrice) this.stickyPrice.textContent = variant.price_formatted;

      if (variant.featured_image && this.mainImage) {
        this.mainImage.src = variant.featured_image;
      }
    }
  }

  /* --- Collection Filters --- */
  class CollectionFilters {
    constructor() {
      this.section = document.querySelector('[data-collection-section]');
      if (!this.section) return;

      this.drawer = this.section.querySelector('[data-filter-drawer]');
      this.overlay = this.section.querySelector('[data-filter-overlay]');
      this.form = this.section.querySelector('[data-filter-form]');
      this.productsContainer = this.section.querySelector('[data-collection-products]');
      this.badgesContainer = this.section.querySelector('[data-filter-badges]');
      this.sortSelect = this.section.querySelector('#sort-by');
      this.sectionId = this.section.dataset.sectionId;

      this.debounceTimer = null;
      this.bindEvents();
    }

    bindEvents() {
      this.section.querySelectorAll('[data-filter-toggle]').forEach(btn =>
        btn.addEventListener('click', () => this.openDrawer())
      );
      this.section.querySelector('[data-filter-close]')?.addEventListener('click', () => this.closeDrawer());
      this.overlay?.addEventListener('click', () => this.closeDrawer());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer?.classList.contains('is-open')) this.closeDrawer();
      });

      this.form?.addEventListener('change', () => this.onFilterChange());

      this.section.querySelectorAll('[data-filter-remove]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.applyUrl(link.href);
        });
      });

      this.section.querySelector('[data-filter-clear]')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.applyUrl(e.currentTarget.href);
        this.closeDrawer();
      });

      this.sortSelect?.addEventListener('change', () => {
        const url = new URL(window.location.href);
        url.searchParams.set('sort_by', this.sortSelect.value);
        this.applyUrl(url.toString());
      });

      this.section.querySelectorAll('[data-price-min], [data-price-max]').forEach(input => {
        input.addEventListener('change', () => this.onFilterChange());
      });
    }

    openDrawer() {
      this.drawer?.classList.add('is-open');
      this.overlay?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    closeDrawer() {
      this.drawer?.classList.remove('is-open');
      this.overlay?.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    onFilterChange() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const formData = new FormData(this.form);
        const url = new URL(window.location.href);

        const filterParams = Array.from(url.searchParams.entries())
          .filter(([key]) => key.startsWith('filter.') || key === 'page');
        filterParams.forEach(([key]) => url.searchParams.delete(key));

        for (const [key, value] of formData.entries()) {
          if (value !== '') url.searchParams.append(key, value);
        }

        url.searchParams.delete('page');
        this.applyUrl(url.toString());
      }, 300);
    }

    async applyUrl(urlString) {
      const url = new URL(urlString);
      url.searchParams.set('sections', this.sectionId);

      history.replaceState({}, '', urlString);
      this.section.classList.add('is-loading');

      try {
        const res = await fetch(url.toString());
        const data = await res.json();
        const html = data[this.sectionId];
        if (!html) return;

        const doc = new DOMParser().parseFromString(html, 'text/html');

        const newProducts = doc.querySelector('[data-collection-products]');
        if (newProducts && this.productsContainer) {
          this.productsContainer.innerHTML = newProducts.innerHTML;
        }

        const newBadges = doc.querySelector('[data-filter-badges]');
        if (newBadges && this.badgesContainer) {
          this.badgesContainer.innerHTML = newBadges.innerHTML;
          this.badgesContainer.querySelectorAll('[data-filter-remove]').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              this.applyUrl(link.href);
            });
          });
        }

        const newForm = doc.querySelector('[data-filter-form]');
        if (newForm && this.form) {
          this.form.innerHTML = newForm.innerHTML;
          this.section.querySelectorAll('[data-price-min], [data-price-max]').forEach(input => {
            input.addEventListener('change', () => this.onFilterChange());
          });
        }

        const newCount = doc.querySelector('[data-products-count]');
        const currentCount = this.section.querySelector('[data-products-count]');
        if (newCount && currentCount) {
          currentCount.textContent = newCount.textContent;
        }

        const newSort = doc.querySelector('#sort-by');
        if (newSort && this.sortSelect) {
          this.sortSelect.value = newSort.value;
        }
      } catch {
        window.location = urlString;
      } finally {
        this.section.classList.remove('is-loading');
      }
    }
  }

  /* --- Search Infinite Scroll --- */
  class SearchInfiniteScroll {
    constructor() {
      this.section = document.querySelector('[data-search-section]');
      if (!this.section) return;

      this.grid = this.section.querySelector('[data-search-results]');
      this.sentinel = this.section.querySelector('[data-search-load-more]');
      if (!this.grid || !this.sentinel) return;

      this.loading = false;
      this.observer = new IntersectionObserver(
        (entries) => {
          if (this.loading) return;
          if (entries[0].isIntersecting) this.loadNext();
        },
        { rootMargin: '200px', threshold: 0 }
      );
      this.observer.observe(this.sentinel);
    }

    getFetchUrl() {
      const nextUrl = this.sentinel.dataset.nextUrl;
      if (!nextUrl) return null;
      const sectionId = this.section.dataset.sectionId;
      if (!sectionId) return null;
      const sep = nextUrl.includes('?') ? '&' : '?';
      const base = window.Shopify?.routes?.root ?? '/';
      const path = nextUrl.startsWith('/') ? nextUrl : base + nextUrl;
      return `${path}${sep}sections=${encodeURIComponent(sectionId)}`;
    }

    async loadNext() {
      const url = this.getFetchUrl();
      if (!url) return;

      this.loading = true;
      this.sentinel.classList.add('is-loading');

      try {
        const res = await fetch(url);
        const data = await res.json();
        const sectionId = this.section.dataset.sectionId;
        const html = data[sectionId];
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newGrid = doc.querySelector('[data-search-results]');
        const newSentinel = doc.querySelector('[data-search-load-more]');

        if (newGrid) {
          while (newGrid.firstChild) {
            this.grid.appendChild(newGrid.firstChild);
          }
        }

        if (newSentinel?.dataset.nextUrl) {
          this.sentinel.dataset.nextUrl = newSentinel.dataset.nextUrl;
        } else {
          this.sentinel.remove();
          this.observer.disconnect();
        }
      } catch {
        this.sentinel.classList.remove('is-loading');
      } finally {
        this.loading = false;
        this.sentinel.classList.remove('is-loading');
      }
    }
  }

  /* --- Helpers --- */
  function isInputFocused() {
    const el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  /* --- Initialize --- */
  function init() {
    new CartDrawer();
    new CollectionFilters();
    new SearchInfiniteScroll();
    new DesktopNav();
    new MoreDropdown();
    new SupportDropdown();
    new LocaleSelector();
    new MobileMenu();
    new SearchOverlay();
    new StickyHeader();

    document.querySelectorAll('[data-tabs]').forEach(el => new Tabs(el));
    document.querySelectorAll('[data-accordion]').forEach(el => new Accordion(el));
    document.querySelectorAll('.pdp__gallery').forEach(el => new ProductGallery(el));
    document.querySelectorAll('.qty-selector').forEach(el => new QuantitySelector(el));
    document.querySelectorAll('.carousel').forEach(el => new Carousel(el));
    document.querySelectorAll('[data-variant-selector]').forEach(el => new VariantSelector(el));
  }

  function dismissLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', dismissLoader);
})();
