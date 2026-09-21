/* ============================================================
   CRIMSON INDEX — Theme JavaScript
   ============================================================ */

(function () {
  'use strict';

  const PROMO_VIDEO_PARAM = 'promo_video';
  const promoVideo = new URLSearchParams(location.search).get(PROMO_VIDEO_PARAM);
  const PROMO_GREYSCALE = promoVideo === 'mock' || promoVideo === 'unattended';
  document.documentElement.classList.toggle('is-promo-greyscale', PROMO_GREYSCALE);
  document.body.classList.toggle('is-promo-greyscale', PROMO_GREYSCALE);

  function propagatePromoVideoParam() {
    if (!promoVideo) return;

    const updateLink = (link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      url.searchParams.set(PROMO_VIDEO_PARAM, promoVideo);
      link.href = url.toString();
    };

    const updateForm = (form) => {
      const method = (form.getAttribute('method') || 'get').toLowerCase();
      if (method !== 'get' || form.querySelector(`[name="${PROMO_VIDEO_PARAM}"]`)) return;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = PROMO_VIDEO_PARAM;
      input.value = promoVideo;
      form.appendChild(input);
    };

    const updateNode = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('a[href]')) updateLink(node);
      if (node.matches('form')) updateForm(node);
      node.querySelectorAll('a[href]').forEach(updateLink);
      node.querySelectorAll('form').forEach(updateForm);
    };

    document.querySelectorAll('a[href]').forEach(updateLink);
    document.querySelectorAll('form').forEach(updateForm);

    new MutationObserver((records) => {
      records.forEach(record => record.addedNodes.forEach(updateNode));
    }).observe(document.body, { childList: true, subtree: true });
  }

  function applyCollectionPromoBlurb(title, cta) {
    const collectionBlurb = document.querySelector('.collection-header .text-muted');
    if (!collectionBlurb) return;
    if (!/clerk|just say what you need|always replies|shoppers browse|came to buy/i.test(collectionBlurb.textContent)) return;

    collectionBlurb.replaceChildren();

    const headline = document.createElement('span');
    headline.textContent = title;
    collectionBlurb.appendChild(headline);

    const line = document.createElement('button');
    line.type = 'button';
    line.className = 'hero__title-cta';
    line.setAttribute('data-open-voice-clerk', '');
    line.textContent = cta;
    collectionBlurb.appendChild(line);
  }

  function applyPlainPromoHero(eyebrow, title, cta) {
    const subtitle = document.querySelector('.hero__subtitle');
    const titleLine = document.querySelector('.hero__title-line');
    const ctaEl = document.querySelector('.hero__title-cta');

    if (subtitle) {
      subtitle.classList.remove('hero__subtitle--mark');
      subtitle.removeAttribute('aria-label');
      subtitle.textContent = eyebrow;
    }
    if (titleLine) {
      titleLine.removeAttribute('data-hero-redefine');
      titleLine.removeAttribute('aria-label');
      titleLine.textContent = title;
    }
    if (ctaEl) ctaEl.textContent = cta;

    applyCollectionPromoBlurb(title, cta);
  }

  function applyUnattendedLandingCopy() {
    const eyebrow = document.querySelector('.hero-voice__eyebrow');
    const heading = document.querySelector('.hero-voice__heading');
    if (eyebrow) eyebrow.textContent = 'NO CLERK. NO CHAT.';
    if (heading) heading.textContent = 'They figure it out alone.';
  }

  function applyPromoVideoHero() {
    if (promoVideo === 'mock') {
      applyPlainPromoHero(
        'YOUR STORE, WITH A TYPICAL CHATBOT.',
        'It always replies.',
        'It never sells.'
      );
      return;
    }

    if (promoVideo === 'unattended') {
      applyPlainPromoHero(
        'YOUR STORE, UNATTENDED.',
        'Shoppers browse.',
        'Nobody sells.'
      );
      applyUnattendedLandingCopy();
    }
  }

  const PROMO_FLIP_KNOB_MS = 200;
  const PROMO_FLIP_BURST_MS = 600;
  const PROMO_FLIP_HOLD_MS = 1350;
  const PROMO_PITCH_LOGO_HOLD_MS = 900;
  const PROMO_PITCH_LOGO_OUT_MS = 420;
  const PROMO_PITCH_WORD_STAGGER_MS = 100;
  const PROMO_PITCH_WORD_IN_MS = 420;
  const PROMO_PITCH_REDEFINE_HOLD_MS = 480;
  const PROMO_PITCH_STRIKE_MS = 420;
  const PROMO_PITCH_STRIKE_HOLD_MS = 200;
  const PROMO_PITCH_MORPH_MS = 720;
  const PROMO_PITCH_REPLACE_PAUSE_MS = 920;
  const PROMO_PITCH_WORD_OUT_MS = 400;
  const PROMO_PITCH_WORD_OUT_STAGGER_MS = [0, 140, 70];
  const PROMO_AVATAR_MAX_SCALE = 2.3;
  const PROMO_AVATAR_CANVAS_WIDTH_PX = 720;
  const PROMO_PITCH_REPLACE_GAP_MS = 180;
  const PROMO_PITCH_HERO_IN_MS = 400;
  const PROMO_PITCH_HERO_HOLD_MS = 240;
  const PROMO_PITCH_HERO_OUT_MS = 340;
  const PROMO_PITCH_HERO_OVERLAP_MS = 160;
  const PROMO_PITCH_SELL_HOLD_MS = 2000;
  const PROMO_PITCH_SETTLE_MS = 700;
  const PROMO_SEE_HOLD_MS = 700;
  const PROMO_SEE_ROW_AT_MS = 900;
  const PROMO_SEE_ROULETTE_AT_MS = 1000;
  const PROMO_SEE_ROULETTE_MS = 1800;
  const PROMO_SEE_LAND_HOLD_MS = 600;
  const PROMO_SEE_TICK_CLASS_MS = 50;
  const PROMO_SEE_TICK_MIN_MS = 60;
  const PROMO_SEE_TICK_MAX_MS = 280;
  const PROMO_SEE_REDUCED_HOLD_MS = 1000;
  const PROMO_SEE_PASSES = 2;
  const PROMO_DEPART_MS = 1100;
  const BIZMIS_ORANGE = '#f9a353';
  const PROMO_BIZMIS_MESH_COLORS = {
    UPPERBODY_Top: BIZMIS_ORANGE,
    HEAD_Hat: BIZMIS_ORANGE,
  };
  const PROMO_BIZMIS_STAMP_SCALE = 0.76;
  const PROMO_BIZMIS_AVATAR_MODEL_URL = 'https://cdn.bizmis.ai/common/avatars/models/yusuke.glb';
  const PROMO_WIDGET_REMOUNT_MS = 280;
  const PROMO_WIDGET_FADE_MS = 480;
  const PROMO_OPENING_WAVE_AFTER_PARK_MS = 180;
  const PROMO_COVER_HOLD_MS = 600;
  const PROMO_COVER_FADE_MS = 500;
  const PROMO_REDUCED_NAV_MS = 400;
  let promoStoreUnlocked = promoVideo === 'true';
  const PROMO_TYPE_QUERY = 'I want a portable laptop with long battery life for coding.';
  const PROMO_TYPE_AFTER_MS = 8000;
  const PROMO_TYPE_CHAR_MS = 55;
  const PROMO_TYPE_FIND_MS = 15000;

  function createPromoWidgetBridge() {
    let originalInit = null;
    let originalDestroy = null;
    let storeConfig = null;
    let wrapped = false;
    let solidStampUrl = null;
    let stampReady = false;
    const stampWaiters = [];

    function isOpening() {
      return promoSearchParams().get(PROMO_VIDEO_PARAM) === 'opening';
    }

    function lookForPromo(config) {
      const next = applyPromoLighting(config);
      if (!isOpening()) return next;
      const stamp = solidStampUrl
        || document.documentElement.getAttribute('data-promo-bizmis-stamp');
      return Object.assign({}, next, {
        avatarModelUrl: PROMO_BIZMIS_AVATAR_MODEL_URL,
        avatarMeshColors: Object.assign({}, next.avatarMeshColors || {}, PROMO_BIZMIS_MESH_COLORS),
        shirtStampUrl: stamp || next.shirtStampUrl,
        shirtStampScale: PROMO_BIZMIS_STAMP_SCALE,
        canvasWidth: PROMO_AVATAR_CANVAS_WIDTH_PX,
        themeColor: BIZMIS_ORANGE,
        secondaryColor: BIZMIS_ORANGE,
      });
    }

    function parseLightingQuery(raw) {
      if (raw == null || raw === '') return null;
      if (raw === 'default' || raw === 'studio') return raw;
      if (raw.charAt(0) === '{') {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
      return null;
    }

    function applyPromoLighting(config) {
      const fromQuery = parseLightingQuery(promoSearchParams().get('lighting'));
      if (fromQuery != null) {
        return Object.assign({}, config, { lighting: fromQuery });
      }
      if (config && config.lighting != null) return config;
      const mode = promoSearchParams().get(PROMO_VIDEO_PARAM);
      if (mode === 'opening' || mode === 'true') {
        return Object.assign({}, config, { lighting: 'studio' });
      }
      return config;
    }

    const whiteStamps = new Map();

    function hardenStamp(url, isGate) {
      if (!url) {
        if (isGate) {
          stampReady = true;
          stampWaiters.splice(0).forEach((run) => run());
        }
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = image.data;
        for (let i = 0; i < px.length; i += 4) {
          if (!px[i + 3]) continue;
          px[i] = 255;
          px[i + 1] = 255;
          px[i + 2] = 255;
          px[i + 3] = 255;
        }
        ctx.putImageData(image, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        whiteStamps.set(url, dataUrl);
        if (isGate) {
          solidStampUrl = dataUrl;
          stampReady = true;
          stampWaiters.splice(0).forEach((run) => run());
        }
      };
      img.onerror = () => {
        whiteStamps.set(url, url);
        if (isGate) {
          solidStampUrl = url;
          stampReady = true;
          stampWaiters.splice(0).forEach((run) => run());
        }
      };
      img.src = url;
    }

    function whiteStampFor(url) {
      return whiteStamps.get(url) || url;
    }

    function preloadStoreStamps(stores) {
      const seen = new Set();
      (stores || []).forEach((store) => {
        if (!store || !store.stamp || seen.has(store.stamp)) return;
        seen.add(store.stamp);
        hardenStamp(store.stamp, false);
      });
    }

    function applyStoreLook(look) {
      const api = window.AvatarVoicechat;
      if (!look || !api || typeof api.setAppearance !== 'function') return;
      const scale = typeof look.stampScale === 'number'
        ? look.stampScale
        : PROMO_BIZMIS_STAMP_SCALE;
      api.setAppearance({
        avatarMeshColors: look.meshColors || {},
        shirtStampUrl: whiteStampFor(look.stamp) || null,
        shirtStampScale: scale,
      });
    }

    if (promoVideo === 'opening') {
      hardenStamp(document.documentElement.getAttribute('data-promo-bizmis-stamp'), true);
    } else {
      stampReady = true;
    }

    function wrap() {
      const api = window.AvatarVoicechat;
      if (!api || wrapped || typeof api.init !== 'function') return false;
      originalInit = api.init.bind(api);
      originalDestroy = typeof api.destroy === 'function' ? api.destroy.bind(api) : null;
      api.init = function (config) {
        storeConfig = config;
        const start = () => originalInit(lookForPromo(config));
        if (!isOpening() || stampReady) return start();
        stampWaiters.push(start);
      };
      wrapped = true;
      return true;
    }

    function hide() {
      document.documentElement.classList.add('is-promo-widget-hidden');
      document.documentElement.classList.remove('is-promo-widget-entering');
    }

    function show() {
      document.documentElement.classList.add('is-promo-widget-entering');
      document.documentElement.classList.remove('is-promo-widget-hidden');
      window.setTimeout(() => {
        document.documentElement.classList.remove('is-promo-widget-entering');
      }, PROMO_WIDGET_FADE_MS);
    }

    function remountForStore() {
      hide();
      if (!originalInit || !storeConfig) {
        window.setTimeout(show, PROMO_WIDGET_REMOUNT_MS);
        return;
      }
      if (originalDestroy) originalDestroy('bizmis-avatar-embed');
      window.setTimeout(() => {
        originalInit(applyPromoLighting(storeConfig));
        show();
      }, PROMO_WIDGET_REMOUNT_MS);
    }

    function arm() {
      if (wrap()) return;
      let tries = 0;
      const tick = () => {
        if (wrap() || tries > 80) return;
        tries += 1;
        window.setTimeout(tick, 80);
      };
      tick();
    }

    return { arm, hide, remountForStore, applyStoreLook, preloadStoreStamps };
  }

  let openingWaveStarted = false;
  let openingWavePlayed = false;

  function waveOpeningAvatar() {
    if (openingWavePlayed) return true;
    const embed = document.getElementById('bizmis-avatar-embed');
    if (!embed) return false;
    const target = embed.querySelector('.bizmis-desktop-lite-chat [role="button"]')
      || embed.querySelector('.bizmis-desktop-lite-chat')
      || embed.querySelector('canvas');
    if (!target) return false;
    openingWavePlayed = true;
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    return true;
  }

  function armOpeningWave() {
    if (openingWaveStarted) return;
    openingWaveStarted = true;
    let tries = 0;
    const run = () => {
      if (waveOpeningAvatar()) return;
      tries += 1;
      if (tries < 50) window.setTimeout(run, 100);
    };
    run();
  }

  const promoWidget = createPromoWidgetBridge();
  promoWidget.arm();

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function promoSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  function loadPromoStores() {
    const node = document.getElementById('promo-opening-stores');
    if (!node) return [];
    try {
      const parsed = JSON.parse(node.textContent || '[]');
      return Array.isArray(parsed) ? parsed.filter((store) => store && store.slug) : [];
    } catch {
      return [];
    }
  }

  function landingStoreIndex(stores) {
    if (!stores.length) return 0;
    const raw = (promoSearchParams().get('store') || 'meridian').trim().toLowerCase();
    const match = stores.findIndex((store) => store.slug === raw);
    if (match >= 0) return match;
    const meridian = stores.findIndex((store) => store.slug === 'meridian');
    return meridian >= 0 ? meridian : 0;
  }

  function shufflePass(count, avoidFirst) {
    const order = [];
    for (let i = 0; i < count; i += 1) order.push(i);
    for (let i = count - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const hold = order[i];
      order[i] = order[j];
      order[j] = hold;
    }
    if (count > 1 && avoidFirst != null && order[0] === avoidFirst) {
      const swap = 1 + Math.floor(Math.random() * (count - 1));
      const hold = order[0];
      order[0] = order[swap];
      order[swap] = hold;
    }
    return order;
  }

  function rouletteWaits(storeCount) {
    const minWaits = Math.max(storeCount * PROMO_SEE_PASSES, 1);
    const waits = [];
    let elapsed = 0;
    while (waits.length < minWaits || elapsed < PROMO_SEE_ROULETTE_MS) {
      const progress = Math.min(1, elapsed / PROMO_SEE_ROULETTE_MS);
      const eased = 1 - (1 - progress) * (1 - progress);
      const wait = PROMO_SEE_TICK_MIN_MS + (PROMO_SEE_TICK_MAX_MS - PROMO_SEE_TICK_MIN_MS) * eased;
      waits.push(wait);
      elapsed += wait;
      if (waits.length > 48) break;
    }
    return waits;
  }

  function rouletteOrder(storeCount, landIndex, tickCount) {
    if (storeCount <= 0) return [0];
    if (storeCount === 1) return Array.from({ length: tickCount }, () => 0);
    const order = [];
    let last = -1;
    while (order.length < tickCount - 1) {
      const remaining = tickCount - 1 - order.length;
      if (remaining >= storeCount) {
        const pass = shufflePass(storeCount, last);
        order.push(...pass);
        last = pass[pass.length - 1];
      } else {
        let next;
        do {
          next = Math.floor(Math.random() * storeCount);
        } while (next === last);
        order.push(next);
        last = next;
      }
    }
    if (order.length > tickCount - 1) {
      order.length = tickCount - 1;
      last = order[order.length - 1];
    }
    if (last === landIndex) {
      let next;
      do {
        next = Math.floor(Math.random() * storeCount);
      } while (next === landIndex);
      order[order.length - 1] = next;
    }
    order.push(landIndex);
    return order;
  }

  function renderStoreCards(row, stores) {
    if (!row) return;
    row.replaceChildren();
    stores.forEach((store) => {
      const card = document.createElement('article');
      card.className = 'promo-opening__store';
      card.dataset.store = store.slug;
      card.style.setProperty('--promo-store-accent', store.accent || '#1d1d1f');
      const mark = document.createElement('img');
      mark.className = 'promo-opening__card-mark';
      mark.src = store.logo || store.stamp || '';
      mark.alt = '';
      const name = document.createElement('span');
      name.className = 'promo-opening__store-name';
      name.textContent = store.name || '';
      const sector = document.createElement('span');
      sector.className = 'promo-opening__store-sector';
      sector.textContent = store.sector || '';
      card.append(mark, name, sector);
      row.appendChild(card);
    });
  }

  function hasPromoCover() {
    return document.body.classList.contains('template-index')
      && promoVideo !== 'opening'
      && promoSearchParams().get('nocover') !== '1';
  }

  function whenImageReady(img) {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }

  class PromoOpening {
    constructor(root, onStoreReady) {
      this.root = root;
      this.onStoreReady = onStoreReady;
      this.toggle = root.querySelector('[data-promo-opening-toggle]');
      this.knob = root.querySelector('.promo-opening__knob');
      this.line = root.querySelector('[data-promo-pitch-line]');
      this.storesRow = root.querySelector('[data-promo-stores]');
      this.stores = loadPromoStores();
      this.landIndex = landingStoreIndex(this.stores);
      this.flipping = false;
      this.parkedEmbed = null;
      this.parkedParent = null;
      this.parkedNext = null;
      this.parkedStyle = null;
      this.parkTimer = 0;
      this.boundDock = () => this.fitOpeningLayout();
      this.toggle?.addEventListener('click', () => this.flip());
      renderStoreCards(this.storesRow, this.stores);
      promoWidget.preloadStoreStamps(this.stores);
      this.armAutoFlip();
    }

    armAutoFlip() {
      const raw = promoSearchParams().get('auto');
      if (raw == null || raw === '') return;
      const autoMs = Number(raw);
      if (!Number.isFinite(autoMs) || autoMs < 0) return;
      this.autoTimer = window.setTimeout(() => this.flip(), autoMs);
    }

    pinKnobOrigin() {
      if (!this.knob) return;
      const rect = this.knob.getBoundingClientRect();
      this.root.style.setProperty('--promo-knob-x', `${rect.left + rect.width / 2}px`);
      this.root.style.setProperty('--promo-knob-y', `${rect.top + rect.height / 2}px`);
    }

    fitOpeningType() {
      if (this.line) this.line.style.fontSize = '';
    }

    fitClerk() {
      const embed = this.parkedEmbed || document.getElementById('bizmis-avatar-embed');
      if (!embed || !embed.classList.contains('is-promo-widget-parked')) return;
      embed.style.setProperty('--promo-avatar-scale', String(PROMO_AVATAR_MAX_SCALE));
    }

    fitOpeningLayout() {
      this.fitOpeningType();
      this.fitClerk();
      this.dockLogo();
    }

    dockLogo() {
      const logo = this.root.querySelector('.promo-opening__logo');
      const target = this.root.querySelector('[data-promo-logo-target]');
      if (!logo || !target) return;

      const to = target.getBoundingClientRect();
      if (to.width < 4 || to.height < 4) return;

      this.root.style.setProperty('--promo-logo-left', `${to.left + to.width / 2}px`);
      this.root.style.setProperty('--promo-logo-top', `${to.top + to.height / 2}px`);
      this.root.style.setProperty('--promo-logo-w', `${to.width}px`);
      this.root.style.setProperty('--promo-logo-h', `${to.height}px`);
      this.root.classList.add('is-logo-docked');
    }

    parkWidget() {
      if (this.parkedEmbed) return;
      const slot = this.root.querySelector('[data-promo-widget]');
      const embed = document.getElementById('bizmis-avatar-embed');
      if (!slot || !embed) return;

      this.parkedEmbed = embed;
      this.parkedParent = embed.parentNode;
      this.parkedNext = embed.nextSibling;
      this.parkedStyle = embed.getAttribute('style');
      embed.removeAttribute('style');
      embed.classList.add('is-promo-widget-parked');
      slot.appendChild(embed);
      this.fitClerk();
      window.setTimeout(() => armOpeningWave(), PROMO_OPENING_WAVE_AFTER_PARK_MS);
    }

    restoreWidget() {
      window.clearTimeout(this.parkTimer);
      const embed = this.parkedEmbed;
      if (embed && this.parkedParent) {
        this.parkedParent.insertBefore(embed, this.parkedNext);
        if (this.parkedStyle != null) embed.setAttribute('style', this.parkedStyle);
        else embed.removeAttribute('style');
        embed.classList.remove('is-promo-widget-parked');
      }
      this.parkedEmbed = null;
      this.parkedParent = null;
      this.parkedNext = null;
      this.parkedStyle = null;
    }

    armPark() {
      let tries = 0;
      const run = () => {
        this.parkWidget();
        tries += 1;
        if (!this.parkedEmbed && tries < 40) this.parkTimer = window.setTimeout(run, 80);
      };
      run();
    }

    flip() {
      if (this.flipping) return;
      this.flipping = true;
      window.clearTimeout(this.autoTimer);
      if (this.toggle) {
        this.toggle.setAttribute('aria-pressed', 'true');
        this.toggle.disabled = true;
      }

      if (prefersReducedMotion()) {
        this.showReducedSee();
        return;
      }

      this.pinKnobOrigin();
      this.root.classList.add('is-on');
      window.setTimeout(() => this.burst(), PROMO_FLIP_KNOB_MS);
    }

    burst() {
      this.pinKnobOrigin();
      this.root.classList.add('is-bursting');
      window.setTimeout(() => this.hold(), PROMO_FLIP_BURST_MS);
    }

    hold() {
      this.root.classList.add('is-holding');
      window.setTimeout(() => this.pitch(), PROMO_FLIP_HOLD_MS);
    }

    async pitch() {
      document.documentElement.classList.add('is-promo-pitch');
      this.root.classList.add('is-pitch');
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => this.fitOpeningLayout());
      });
      window.addEventListener('resize', this.boundDock);
      this.armPark();
      window.setTimeout(() => {
        this.root.classList.add('is-logo-leaving');
        window.setTimeout(() => this.playPitchLine(), PROMO_PITCH_LOGO_OUT_MS);
      }, PROMO_PITCH_LOGO_HOLD_MS);
    }

    playHeroWords(toFace, onDone) {
      const words = toFace ? [...toFace.querySelectorAll('[data-promo-to-word]')] : [];
      if (!words.length) {
        onDone();
        return;
      }

      let index = 0;
      const showWord = () => {
        const word = words[index];
        word.classList.add('is-in');
        const isLast = index === words.length - 1;
        if (isLast) {
          window.setTimeout(onDone, PROMO_PITCH_HERO_IN_MS + PROMO_PITCH_SELL_HOLD_MS);
          return;
        }
        window.setTimeout(() => {
          word.classList.remove('is-in');
          word.classList.add('is-out');
          index += 1;
          window.setTimeout(
            showWord,
            Math.max(0, PROMO_PITCH_HERO_OUT_MS - PROMO_PITCH_HERO_OVERLAP_MS)
          );
        }, PROMO_PITCH_HERO_IN_MS + PROMO_PITCH_HERO_HOLD_MS);
      };
      showWord();
    }

    playPitchLine() {
      const line = this.line;
      const fromFace = this.root.querySelector('[data-promo-face-from]');
      const toFace = this.root.querySelector('[data-promo-face-to]');
      if (!line || !fromFace) {
        this.playSeeForYourself();
        return;
      }

      const fromWords = [...fromFace.querySelectorAll('[data-promo-from-word]')];
      fromWords.forEach((word, index) => {
        word.style.animationDelay = `${index * PROMO_PITCH_WORD_STAGGER_MS}ms`;
      });
      line.classList.add('is-revealing');

      const wordsInAt = (fromWords.length - 1) * PROMO_PITCH_WORD_STAGGER_MS + PROMO_PITCH_WORD_IN_MS;
      const strikeAt = wordsInAt + PROMO_PITCH_REDEFINE_HOLD_MS;
      const morphAt = strikeAt + PROMO_PITCH_STRIKE_MS + PROMO_PITCH_STRIKE_HOLD_MS;
      const morphDoneAt = morphAt + PROMO_PITCH_MORPH_MS;
      const replaceAt = morphDoneAt + PROMO_PITCH_REPLACE_PAUSE_MS;
      const from = line.querySelector('.promo-opening__from');
      const to = line.querySelector('.promo-opening__to');
      const outSpan = Math.max(...PROMO_PITCH_WORD_OUT_STAGGER_MS);
      const toInAt = replaceAt + PROMO_PITCH_WORD_OUT_MS + outSpan + PROMO_PITCH_REPLACE_GAP_MS;

      window.setTimeout(() => {
        if (from) from.style.width = `${from.getBoundingClientRect().width}px`;
        if (to) to.style.width = '0px';
        line.classList.add('is-striking');
      }, strikeAt);

      window.setTimeout(() => {
        const nextWidth = to ? to.scrollWidth : 0;
        line.classList.add('is-erasing', 'is-redefined');
        if (from) from.style.width = '0px';
        if (to) to.style.width = `${nextWidth}px`;
      }, morphAt);

      window.setTimeout(() => {
        line.classList.remove('is-striking', 'is-erasing');
        if (from) from.style.width = '0px';
        if (to) to.style.width = '';
      }, morphDoneAt);

      window.setTimeout(() => {
        fromWords.forEach((word, index) => {
          word.style.animationDelay = `${PROMO_PITCH_WORD_OUT_STAGGER_MS[index] || 0}ms`;
        });
        fromFace.classList.add('is-exiting');
      }, replaceAt);

      window.setTimeout(() => {
        line.classList.add('is-replaced');
        this.playHeroWords(toFace, () => this.playSeeForYourself());
      }, toInAt);
    }

    bizmisLook() {
      return {
        meshColors: PROMO_BIZMIS_MESH_COLORS,
        stamp: document.documentElement.getAttribute('data-promo-bizmis-stamp'),
        stampScale: PROMO_BIZMIS_STAMP_SCALE,
      };
    }

    resetSee() {
      this.root.classList.remove(
        'is-see',
        'is-see-in',
        'is-see-docked',
        'is-see-row',
        'is-see-landed'
      );
      this.storesRow?.classList.remove('tick');
      this.storesRow?.querySelectorAll('.promo-opening__store').forEach((card) => {
        card.classList.remove('is-on', 'is-land');
      });
    }

    highlightStore(index, landed) {
      const cards = this.storesRow
        ? [...this.storesRow.querySelectorAll('.promo-opening__store')]
        : [];
      cards.forEach((card, cardIndex) => {
        const on = cardIndex === index;
        card.classList.toggle('is-on', on);
        card.classList.toggle('is-land', Boolean(landed && on));
      });
      this.root.classList.toggle('is-see-landed', Boolean(landed));
    }

    snapSeeLanded() {
      this.root.classList.add('is-see', 'is-see-in', 'is-see-docked', 'is-see-row', 'is-see-landed');
      this.highlightStore(this.landIndex, true);
      const store = this.stores[this.landIndex];
      if (store) promoWidget.applyStoreLook(store);
    }

    showReducedSee() {
      document.documentElement.classList.add('is-promo-pitch');
      this.root.classList.add('is-on', 'is-bursting', 'is-holding', 'is-pitch', 'is-logo-leaving');
      window.requestAnimationFrame(() => this.fitOpeningLayout());
      this.armPark();
      this.snapSeeLanded();
      window.setTimeout(() => this.revealStore(), PROMO_SEE_REDUCED_HOLD_MS);
    }

    playSeeForYourself() {
      if (!this.stores.length) {
        window.setTimeout(() => this.depart(), PROMO_PITCH_SETTLE_MS);
        return;
      }

      if (prefersReducedMotion()) {
        this.snapSeeLanded();
        window.setTimeout(() => this.revealStore(), PROMO_SEE_REDUCED_HOLD_MS);
        return;
      }

      const sell = this.root.querySelector('.promo-opening__word--sell');
      sell?.classList.remove('is-in');
      sell?.classList.add('is-out');

      this.root.classList.add('is-see');
      window.requestAnimationFrame(() => {
        this.root.classList.add('is-see-in');
      });

      window.setTimeout(() => {
        this.root.classList.add('is-see-docked');
      }, PROMO_SEE_HOLD_MS);

      window.setTimeout(() => {
        this.root.classList.add('is-see-row');
      }, PROMO_SEE_ROW_AT_MS);

      window.setTimeout(() => {
        this.playStoreRoulette(() => {
          window.setTimeout(() => this.depart(), PROMO_SEE_LAND_HOLD_MS);
        });
      }, PROMO_SEE_ROULETTE_AT_MS);
    }

    playStoreRoulette(onDone) {
      const waits = rouletteWaits(this.stores.length);
      const order = rouletteOrder(this.stores.length, this.landIndex, waits.length + 1);
      let step = 0;

      const tick = () => {
        const index = order[step];
        const isLast = step === order.length - 1;
        this.highlightStore(index, isLast);
        const store = this.stores[index];
        if (store) promoWidget.applyStoreLook(store);
        if (this.storesRow) {
          this.storesRow.classList.add('tick');
          window.setTimeout(() => {
            this.storesRow?.classList.remove('tick');
          }, PROMO_SEE_TICK_CLASS_MS);
        }
        if (isLast) {
          onDone();
          return;
        }
        const wait = waits[step];
        step += 1;
        window.setTimeout(tick, wait);
      };
      tick();
    }

    depart() {
      window.removeEventListener('resize', this.boundDock);
      promoWidget.hide();
      this.restoreWidget();
      document.documentElement.classList.remove('is-promo-pitch');
      document.documentElement.classList.add('is-promo-depart');
      this.root.classList.add('is-depart');
      window.setTimeout(() => this.revealStore(), PROMO_DEPART_MS);
    }

    revealStore() {
      const url = new URL(window.location.href);
      url.searchParams.set(PROMO_VIDEO_PARAM, 'true');
      url.searchParams.delete('auto');
      window.history.replaceState({}, '', url.toString());
      promoStoreUnlocked = true;

      this.restoreWidget();
      document.documentElement.classList.remove('is-promo-opening', 'is-promo-pitch', 'is-promo-depart');
      this.root.remove();
      promoWidget.remountForStore();
      this.onStoreReady?.();
    }

    showExportFrame(name) {
      const root = this.root;
      const html = document.documentElement;
      const center = root.querySelector('.promo-opening__center');
      const logo = root.querySelector('.promo-opening__logo');
      const line = this.line;
      const fromFace = root.querySelector('[data-promo-face-from]');
      const toFace = root.querySelector('[data-promo-face-to]');
      const fromWords = fromFace ? [...fromFace.querySelectorAll('[data-promo-from-word]')] : [];
      const toWords = toFace ? [...toFace.querySelectorAll('[data-promo-to-word]')] : [];
      const from = line?.querySelector('.promo-opening__from');
      const to = line?.querySelector('.promo-opening__to');

      const resetText = () => {
        this.resetSee();
        line?.classList.remove('is-revealing', 'is-striking', 'is-erasing', 'is-redefined', 'is-replaced');
        fromFace?.classList.remove('is-exiting');
        if (fromFace) {
          fromFace.style.visibility = '';
          fromFace.style.opacity = '';
        }
        if (toFace) {
          toFace.style.visibility = '';
          toFace.style.opacity = '';
        }
        fromWords.forEach((word) => {
          word.style.opacity = '';
          word.style.animation = 'none';
          word.style.transform = 'none';
        });
        toWords.forEach((word) => {
          word.classList.remove('is-in', 'is-out');
          word.style.opacity = '';
          word.style.animation = 'none';
          word.style.transform = '';
        });
        if (from) {
          from.style.width = '';
          from.style.opacity = '';
        }
        if (to) {
          to.style.width = '';
          to.style.opacity = '';
        }
      };

      const hideToggle = () => {
        if (!center) return;
        center.style.visibility = 'hidden';
        center.style.opacity = '0';
      };

      const showToggle = () => {
        if (!center) return;
        center.style.visibility = '';
        center.style.opacity = '';
      };

      const enterPitch = () => {
        html.classList.add('is-promo-opening', 'is-promo-pitch');
        root.classList.add('is-on', 'is-bursting', 'is-holding', 'is-pitch');
        root.classList.remove('is-logo-leaving', 'is-depart');
        hideToggle();
        this.parkWidget();
        this.fitOpeningLayout();
        promoWidget.applyStoreLook(this.bizmisLook());
      };

      const hideCopy = () => {
        resetText();
        if (fromFace) fromFace.style.visibility = 'hidden';
        if (toFace) toFace.style.visibility = 'hidden';
        fromWords.forEach((word) => {
          word.style.opacity = '0';
        });
      };

      const showFromCount = (count) => {
        enterPitch();
        root.classList.add('is-logo-leaving');
        if (logo) {
          logo.style.opacity = '0';
          logo.style.visibility = 'hidden';
        }
        resetText();
        line?.classList.add('is-revealing');
        if (fromFace) {
          fromFace.style.visibility = 'visible';
          fromFace.style.opacity = '1';
        }
        if (toFace) {
          toFace.style.visibility = 'hidden';
          toFace.style.opacity = '0';
        }
        fromWords.forEach((word, index) => {
          word.style.opacity = index < count ? '1' : '0';
        });
      };

      const showHero = (index) => {
        enterPitch();
        root.classList.add('is-logo-leaving');
        if (logo) {
          logo.style.opacity = '0';
          logo.style.visibility = 'hidden';
        }
        resetText();
        line?.classList.add('is-replaced');
        if (fromFace) {
          fromFace.style.visibility = 'hidden';
          fromFace.style.opacity = '0';
        }
        if (toFace) {
          toFace.style.visibility = 'visible';
          toFace.style.opacity = '1';
        }
        toWords.forEach((word, wordIndex) => {
          word.classList.toggle('is-in', wordIndex === index);
          word.classList.toggle('is-out', wordIndex < index);
          word.style.opacity = wordIndex === index ? '1' : '0';
          word.style.transform = 'none';
          word.style.animation = 'none';
        });
      };

      const showSee = (phase) => {
        showHero(2);
        toWords.forEach((word) => {
          word.classList.remove('is-in');
          word.classList.add('is-out');
          word.style.opacity = '0';
        });
        root.classList.add('is-see', 'is-see-in');
        if (phase !== 'hero') root.classList.add('is-see-docked', 'is-see-row');
        if (phase === 'landed') root.classList.add('is-see-landed');

        const midIndex = Math.min(2, Math.max(0, this.stores.length - 1));
        const highlight = phase === 'hero'
          ? -1
          : phase === 'row'
            ? 0
            : phase === 'roulette'
              ? midIndex
              : this.landIndex;
        if (highlight >= 0) this.highlightStore(highlight, phase === 'landed');
        if (phase === 'roulette') this.storesRow?.classList.add('tick');

        if (phase === 'hero') {
          promoWidget.applyStoreLook(this.bizmisLook());
        } else {
          const store = this.stores[highlight];
          if (store) promoWidget.applyStoreLook(store);
        }
      };

      const rest = () => {
        html.classList.add('is-promo-opening');
        html.classList.remove('is-promo-pitch', 'is-promo-depart');
        root.classList.remove(
          'is-on',
          'is-bursting',
          'is-holding',
          'is-pitch',
          'is-logo-docked',
          'is-logo-leaving',
          'is-depart'
        );
        showToggle();
        if (logo) {
          logo.style.opacity = '';
          logo.style.visibility = '';
        }
        resetText();
      };

      const frames = {
        '01-toggle-rest': () => {
          rest();
          return 120;
        },
        '02-toggle-on': () => {
          rest();
          root.classList.add('is-on');
          return 120;
        },
        '03-orange-burst': () => {
          rest();
          this.pinKnobOrigin();
          root.classList.add('is-on', 'is-bursting');
          return 200;
        },
        '04-logo-docked': () => {
          enterPitch();
          root.classList.remove('is-logo-leaving');
          if (logo) {
            logo.style.opacity = '1';
            logo.style.visibility = 'visible';
          }
          hideCopy();
          this.fitOpeningLayout();
          return 240;
        },
        '05-logo-gone': () => {
          enterPitch();
          root.classList.add('is-logo-leaving');
          if (logo) {
            logo.style.opacity = '0';
            logo.style.visibility = 'hidden';
          }
          hideCopy();
          return 180;
        },
        '06-your': () => {
          showFromCount(1);
          return 180;
        },
        '07-your-store': () => {
          showFromCount(2);
          return 180;
        },
        '08-salesperson': () => {
          showFromCount(3);
          return 180;
        },
        '09-salesperson-struck': () => {
          showFromCount(3);
          line?.classList.add('is-striking');
          if (from) from.style.width = `${from.getBoundingClientRect().width}px`;
          if (to) {
            to.style.width = '0px';
            to.style.opacity = '0';
          }
          return 180;
        },
        '10-sales-agent': () => {
          showFromCount(3);
          line?.classList.add('is-redefined');
          if (from) {
            from.style.width = '0px';
            from.style.opacity = '0';
          }
          if (to) {
            to.style.width = '';
            to.style.opacity = '1';
          }
          return 180;
        },
        '11-built': () => {
          showHero(0);
          return 180;
        },
        '12-to': () => {
          showHero(1);
          return 180;
        },
        '13-sell': () => {
          showHero(2);
          return 180;
        },
        '14-sell-wave': () => {
          showHero(2);
          openingWavePlayed = false;
          openingWaveStarted = false;
          armOpeningWave();
          return 700;
        },
        '15-see-yourself': () => {
          showSee('hero');
          return 180;
        },
        '16-see-stores': () => {
          showSee('row');
          return 180;
        },
        '17-see-roulette': () => {
          showSee('roulette');
          return 120;
        },
        '18-see-meridian': () => {
          showSee('landed');
          return 220;
        },
      };

      const run = frames[name];
      if (!run) throw new Error(`Unknown promo opening frame: ${name}`);
      return run();
    }
  }

  class PromoCover {
    constructor(node, heroReveal, onReady) {
      this.node = node;
      this.heroReveal = heroReveal;
      this.onReady = onReady;
    }

    async start() {
      const img = document.querySelector('.hero__slide.is-active .hero__media img');
      if (img) img.loading = 'eager';
      await whenImageReady(img);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      if (prefersReducedMotion()) {
        this.finish();
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, PROMO_COVER_HOLD_MS));
      this.revealPage();
      this.node.classList.add('is-fading');
      window.setTimeout(() => this.finish(), PROMO_COVER_FADE_MS);
    }

    revealPage() {
      this.node.classList.add('is-held');
      document.documentElement.classList.remove('is-promo-cover');
      document.documentElement.style.background = '';
      document.body.style.background = '';
    }

    finish() {
      this.dismiss();
      this.heroReveal?.begin();
      this.onReady?.();
    }

    dismiss() {
      this.node.remove();
      document.documentElement.classList.remove('is-promo-cover');
      document.documentElement.style.background = '';
      document.body.style.background = '';
    }
  }

  /* --- Cart Lock (prevents concurrent cart API mutations) --- */
  const cartLock = {
    _locked: false,
    _queue: [],
    async acquire() {
      if (!this._locked) { this._locked = true; return; }
      return new Promise(r => this._queue.push(r));
    },
    release() {
      if (this._queue.length > 0) this._queue.shift()();
      else this._locked = false;
    }
  };

  /* --- Cart Sync Bus (keeps drawer + page + header badge in sync) --- */
  const cartBus = {
    _listeners: [],
    on(fn) { this._listeners.push(fn); },
    emit(cart) {
      const badge = document.querySelector('[data-cart-count]');
      if (badge) {
        badge.textContent = cart.item_count;
        badge.style.display = cart.item_count > 0 ? '' : 'none';
      }
      this._listeners.forEach(fn => fn(cart));
    }
  };

  /* --- Cart Drawer --- */
  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector('.cart-drawer');
      this.backdrop = document.querySelector('.cart-drawer__backdrop');
      if (!this.drawer) return;

      this.modal = this.drawer.querySelector('[data-remove-modal]');
      this.modalBackdrop = this.drawer.querySelector('[data-modal-backdrop]');
      this.pendingRemoveKey = null;
      this.debounceTimers = new Map();
      this.DEBOUNCE_MS = 400;

      this.bindEvents();
      this.bindCartItems();
      this.bindModal();
      cartBus.on(cart => this.refreshDrawer(cart));
    }

    bindEvents() {
      document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); this.toggle(); });
      });
      this.bindCloseControls();
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.modal?.style.display !== 'none') { this.hideModal(); return; }
          if (this.isOpen()) this.close();
        }
      });
    }

    bindCloseControls() {
      if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());
      this.drawer.querySelector('[data-cart-close]')?.addEventListener('click', () => this.close());
    }

    _itemId(el) {
      return (el.dataset.itemKey || el.dataset.variantId || '').trim();
    }

    bindCartItems() {
      this.drawer.querySelectorAll('[data-cart-item]').forEach(item => {
        const input = item.querySelector('[data-qty-input]');
        const minus = item.querySelector('[data-qty-minus]');
        const plus = item.querySelector('[data-qty-plus]');
        const remove = item.querySelector('[data-remove-item]');

        minus?.addEventListener('click', () => {
          const id = this._itemId(item);
          const val = parseInt(input.value, 10) - 1;
          if (val <= 0) { this.confirmRemove(id); return; }
          input.value = val;
          this.scheduleUpdate(id, val);
        });

        plus?.addEventListener('click', () => {
          const id = this._itemId(item);
          const val = Math.min(parseInt(input.value, 10) + 1, 99);
          input.value = val;
          this.scheduleUpdate(id, val);
        });

        input?.addEventListener('change', () => {
          const id = this._itemId(item);
          const val = parseInt(input.value, 10);
          if (isNaN(val) || val <= 0) { this.confirmRemove(id); input.value = 1; return; }
          input.value = Math.min(val, 99);
          this.scheduleUpdate(id, Math.min(val, 99));
        });

        remove?.addEventListener('click', () => this.confirmRemove(this._itemId(item)));
      });
    }

    bindModal() {
      this.drawer.querySelector('[data-modal-cancel]')?.addEventListener('click', () => this.hideModal());
      this.drawer.querySelector('[data-modal-confirm]')?.addEventListener('click', () => {
        if (this.pendingRemoveKey) this.removeItem(this.pendingRemoveKey);
        this.hideModal();
      });
      this.modalBackdrop?.addEventListener('click', () => this.hideModal());
    }

    confirmRemove(key) {
      this.pendingRemoveKey = key;
      if (this.modal) this.modal.style.display = '';
      if (this.modalBackdrop) this.modalBackdrop.style.display = '';
    }

    hideModal() {
      this.pendingRemoveKey = null;
      if (this.modal) this.modal.style.display = 'none';
      if (this.modalBackdrop) this.modalBackdrop.style.display = 'none';
    }

    removeItem(id) {
      const el = this.drawer.querySelector(`[data-item-key="${id}"]`)
        || this.drawer.querySelector(`[data-variant-id="${id}"]`);
      if (el) {
        el.style.transition = 'opacity 200ms ease, max-height 300ms ease';
        el.style.opacity = '0';
        el.style.maxHeight = el.offsetHeight + 'px';
        requestAnimationFrame(() => { el.style.maxHeight = '0'; el.style.overflow = 'hidden'; });
        setTimeout(() => el.remove(), 300);
      }

      const remaining = this.drawer.querySelectorAll('[data-cart-item]').length - 1;
      this.updateCartCount(remaining);

      this.updateCart(id, 0);
    }

    updateCartCount(count) {
      const title = this.drawer.querySelector('.cart-drawer__title');
      if (title) title.textContent = `${title.textContent.split('(')[0].trim()} (${count})`;
    }

    scheduleUpdate(key, quantity) {
      clearTimeout(this.debounceTimers.get(key));
      this.debounceTimers.set(key, setTimeout(() => this.updateCart(key, quantity), this.DEBOUNCE_MS));
    }

    async _cartChange(id, quantity) {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id, quantity })
      });
      const data = await res.json();
      if (data.items) return data;
      return null;
    }

    async updateCart(id, quantity) {
      await cartLock.acquire();
      try {
        let cart = await this._cartChange(id, quantity);
        if (!cart) {
          const freshCart = await (await fetch('/cart.js')).json();
          const match = freshCart.items?.find(i =>
            i.key === id || String(i.variant_id) === String(id)
          );
          if (match) cart = await this._cartChange(match.key, quantity);
        }
        if (cart) cartBus.emit(cart);
      } catch { /* network failure */ }
      finally { cartLock.release(); }
    }

    _findLineItem(cart, el) {
      const key = el.dataset.itemKey;
      const vid = el.dataset.variantId;
      return cart.items.find(i => i.key === key)
        || cart.items.find(i => String(i.key) === String(key))
        || cart.items.find(i => String(i.variant_id) === String(vid));
    }

    refreshDrawer(cart) {
      if (!this.drawer) return;
      this.updateCartCount(cart.item_count);

      if (cart.item_count === 0) {
        const items = this.drawer.querySelector('[data-cart-items]');
        const footer = this.drawer.querySelector('.cart-drawer__footer');
        const empty = this.drawer.querySelector('.cart-drawer__empty');
        if (items) items.remove();
        if (footer) footer.remove();
        if (empty) { empty.style.display = ''; }
        else {
          this.drawer.insertAdjacentHTML('beforeend',
            '<div class="cart-drawer__empty"><p>Your cart is empty</p><a href="/" class="btn btn--primary">Continue shopping</a></div>');
        }
        return;
      }

      this.drawer.querySelectorAll('[data-cart-item]').forEach(el => {
        const lineItem = this._findLineItem(cart, el);
        if (!lineItem) { el.remove(); return; }

        if (lineItem.key) el.dataset.itemKey = lineItem.key;

        const input = el.querySelector('[data-qty-input]');
        if (input) input.value = lineItem.quantity;

        const priceEl = el.querySelector('[data-line-price]');
        if (priceEl) {
          let html = formatMoney(lineItem.final_line_price);
          if (lineItem.original_line_price > lineItem.final_line_price) {
            html += ` <s class="cart-drawer__item-compare">${formatMoney(lineItem.original_line_price)}</s>`;
          }
          priceEl.innerHTML = html;
        }
      });

      const subtotalEl = this.drawer.querySelector('.cart-drawer__subtotal span:last-child');
      if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

      const savingsEl = this.drawer.querySelector('.cart-drawer__savings');
      let totalSavings = 0;
      for (const item of cart.items) {
        if (item.original_line_price > item.final_line_price) {
          totalSavings += item.original_line_price - item.final_line_price;
        }
      }
      if (savingsEl) {
        if (totalSavings > 0) {
          savingsEl.style.display = '';
          const savingsAmt = savingsEl.querySelector('span:last-child');
          if (savingsAmt) savingsAmt.textContent = `-${formatMoney(totalSavings)}`;
        } else {
          savingsEl.style.display = 'none';
        }
      }
    }

    isOpen() { return this.drawer.classList.contains('is-open'); }

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

    toggle() { this.isOpen() ? this.close() : this.open(); }

    async reload() {
      if (!this.drawer) return;
      try {
        const res = await fetch(window.location.pathname + window.location.search);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newDrawer = doc.querySelector('.cart-drawer');
        const newBackdrop = doc.querySelector('.cart-drawer__backdrop');
        if (!newDrawer) return;

        const wasOpen = this.isOpen();
        this.drawer.replaceWith(newDrawer);
        this.drawer = newDrawer;
        this.modal = this.drawer.querySelector('[data-remove-modal]');
        this.modalBackdrop = this.drawer.querySelector('[data-modal-backdrop]');
        this.bindCartItems();
        this.bindModal();

        if (newBackdrop) {
          if (this.backdrop) this.backdrop.replaceWith(newBackdrop);
          else document.body.prepend(newBackdrop);
          this.backdrop = newBackdrop;
        }
        this.bindCloseControls();
        if (wasOpen) this.open();
      } catch { /* keep existing drawer markup */ }
    }
  }

  /* --- Add to Cart (AJAX — stay on page, success feedback) --- */
  class AddToCart {
    constructor(cartDrawer) {
      this.cartDrawer = cartDrawer;
      this.SUCCESS_MS = 1800;
      this.PULSE_MS = 900;
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        const action = form.getAttribute('action') || '';
        if (!action.includes('/cart/add')) return;
        e.preventDefault();
        this.submit(form);
      });
    }

    async submit(form) {
      const submitBtn = form.querySelector('[type="submit"]');
      const stickyBtn = document.querySelector('.pdp-sticky-bar .btn--primary:not([disabled])');
      if (submitBtn) submitBtn.disabled = true;
      if (stickyBtn) stickyBtn.disabled = true;

      try {
        await cartLock.acquire();
        const root = window.Shopify?.routes?.root || '/';
        const res = await fetch(`${root}cart/add.js`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.description || data.message || 'Could not add to cart');
        }

        const cart = await (await fetch(`${root}cart.js`)).json();
        cartBus.emit(cart);
        this.playSuccess(submitBtn);
        if (stickyBtn && stickyBtn !== submitBtn) this.playSuccess(stickyBtn);
        this.pulseCartIcon();
        if (this.cartDrawer?.drawer) this.cartDrawer.reload();
      } catch (err) {
        window.alert(err.message || 'Could not add to cart');
        if (submitBtn) submitBtn.disabled = false;
        if (stickyBtn) stickyBtn.disabled = false;
      } finally {
        cartLock.release();
      }
    }

    playSuccess(btn) {
      if (!btn) return;
      clearTimeout(btn._addedTimer);
      const label = window.themeStrings?.addedToCart || 'Added to cart';
      const isIcon = btn.classList.contains('btn--icon');
      if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
      btn.classList.add('is-added-to-cart');
      btn.disabled = true;
      if (isIcon) {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
      } else {
        btn.textContent = label;
      }
      btn._addedTimer = setTimeout(() => {
        btn.classList.remove('is-added-to-cart');
        btn.innerHTML = btn.dataset.originalHtml;
        delete btn.dataset.originalHtml;
        btn.disabled = false;
      }, this.SUCCESS_MS);
    }

    pulseCartIcon() {
      const toggle = document.querySelector('[data-cart-toggle]');
      const badge = document.querySelector('[data-cart-count]');
      if (!toggle) return;
      toggle.classList.remove('is-cart-pulse');
      badge?.classList.remove('is-cart-count-pop');
      void toggle.offsetWidth;
      toggle.classList.add('is-cart-pulse');
      badge?.classList.add('is-cart-count-pop');
      clearTimeout(this._pulseTimer);
      this._pulseTimer = setTimeout(() => {
        toggle.classList.remove('is-cart-pulse');
        badge?.classList.remove('is-cart-count-pop');
      }, this.PULSE_MS);
    }
  }

  /* --- Cart Page (AJAX qty updates for /cart) --- */
  class CartPage {
    constructor() {
      this.section = document.querySelector('.main-cart-section');
      this.form = this.section?.querySelector('[data-cart-form]');
      if (!this.form) return;

      this.debounceTimers = new Map();
      this.DEBOUNCE_MS = 500;
      this.bindInputs();
      cartBus.on(cart => this.refreshPage(cart));
    }

    _itemId(el) {
      return (el.dataset.itemKey || el.dataset.variantId || '').trim();
    }

    bindInputs() {
      this.form.querySelectorAll('[data-cart-page-item]').forEach(row => {
        const selector = row.querySelector('.qty-selector');
        const input = selector?.querySelector('[data-qty-input]');
        if (!input) return;

        const minus = selector.querySelector('[data-qty-minus]');
        const plus = selector.querySelector('[data-qty-plus]');

        minus?.addEventListener('click', (e) => {
          e.preventDefault();
          const val = Math.max(parseInt(input.value, 10) - 1, 0);
          input.value = val;
          this.scheduleUpdate(this._itemId(row), val);
        });

        plus?.addEventListener('click', (e) => {
          e.preventDefault();
          const val = Math.min(parseInt(input.value, 10) + 1, 99);
          input.value = val;
          this.scheduleUpdate(this._itemId(row), val);
        });

        input.addEventListener('change', () => {
          const val = Math.max(0, Math.min(parseInt(input.value, 10) || 0, 99));
          input.value = val;
          this.scheduleUpdate(this._itemId(row), val);
        });
      });
    }

    scheduleUpdate(id, quantity) {
      clearTimeout(this.debounceTimers.get(id));
      this.debounceTimers.set(id, setTimeout(() => this.updateItem(id, quantity), this.DEBOUNCE_MS));
    }

    async _cartChange(id, quantity) {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id, quantity })
      });
      const data = await res.json();
      if (data.items) return data;
      return null;
    }

    async updateItem(id, quantity) {
      await cartLock.acquire();
      try {
        let cart = await this._cartChange(id, quantity);
        if (!cart) {
          const freshCart = await (await fetch('/cart.js')).json();
          const match = freshCart.items?.find(i =>
            i.key === id || String(i.variant_id) === String(id)
          );
          if (match) cart = await this._cartChange(match.key, quantity);
        }
        if (cart) cartBus.emit(cart);
      } catch { /* network failure */ }
      finally { cartLock.release(); }
    }

    _findItem(cart, el) {
      const key = (el.dataset.itemKey || '').trim();
      const vid = (el.dataset.variantId || '').trim();
      return cart.items.find(i => i.key === key)
        || cart.items.find(i => String(i.key) === String(key))
        || cart.items.find(i => String(i.variant_id) === String(vid));
    }

    refreshPage(cart) {
      if (!this.form) return;
      if (cart.item_count === 0) {
        window.location.reload();
        return;
      }

      this.form.querySelectorAll('[data-cart-page-item]').forEach(row => {
        const lineItem = this._findItem(cart, row);
        if (!lineItem) { row.remove(); return; }

        if (lineItem.key) row.dataset.itemKey = lineItem.key;

        const input = row.querySelector('[data-qty-input]');
        if (input) input.value = lineItem.quantity;

        const totalEl = row.querySelector('[data-line-total]');
        if (totalEl) {
          let html = `<span style="font-weight: 700;">${formatMoney(lineItem.final_line_price)}</span>`;
          if (lineItem.original_line_price > lineItem.final_line_price) {
            html += `<br><s class="text-muted" style="font-size: 0.8125rem;">${formatMoney(lineItem.original_line_price)}</s>`;
          }
          totalEl.innerHTML = html;
        }
      });

      const subtotalEl = this.form.querySelector('[data-cart-page-subtotal]');
      if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

      const savingsRow = this.form.querySelector('[data-cart-page-savings]');
      let totalSavings = 0;
      for (const item of cart.items) {
        if (item.original_line_price > item.final_line_price) {
          totalSavings += item.original_line_price - item.final_line_price;
        }
      }
      if (savingsRow) {
        if (totalSavings > 0) {
          savingsRow.style.display = '';
          const amt = savingsRow.querySelector('[data-savings-amount]');
          if (amt) amt.textContent = `-${formatMoney(totalSavings)}`;
        } else {
          savingsRow.style.display = 'none';
        }
      }
    }
  }

  /* --- Desktop Navigation (mega menus driven by menu links) --- */
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
      this.bindKeyboard();
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

        const trigger = item.querySelector('.header__nav-link');
        trigger?.addEventListener('click', (e) => {
          if (window.innerWidth < 990) return;
          const isActive = item.classList.contains('is-mega-active');
          if (isActive) {
            this.hideMega();
          } else {
            e.preventDefault();
            this.showMega(item);
          }
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

    bindKeyboard() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeMega) {
          const trigger = this.activeMega.querySelector('.header__nav-link');
          this.hideMega();
          trigger?.focus();
        }
      });
    }

    showMega(item) {
      if (this.activeMega && this.activeMega !== item) {
        this.setExpanded(this.activeMega, false);
      }
      this.setExpanded(item, true);
      this.activeMega = item;
    }

    hideMega() {
      if (this.activeMega) {
        this.setExpanded(this.activeMega, false);
        this.activeMega = null;
      }
    }

    setExpanded(item, expanded) {
      item.classList.toggle('is-mega-active', expanded);
      const trigger = item.querySelector('[aria-expanded]');
      if (trigger) trigger.setAttribute('aria-expanded', String(expanded));
    }
  }

  /* --- Nav overflow: move items that don't fit into "More" dropdown --- */
  class NavOverflow {
    constructor() {
      this.nav = document.querySelector('[data-header] .header__nav');
      this.list = document.querySelector('[data-nav-list]');
      if (!this.nav || !this.list) return;

      this.moreItem = this.list.querySelector('[data-more]');
      this.moreContent = this.list.querySelector('[data-more-content]');
      this.moreTrigger = this.list.querySelector('[data-more-trigger]');
      if (!this.moreItem || !this.moreContent || !this.moreTrigger) return;

      this.items = () => Array.from(this.list.querySelectorAll('[data-nav-item]:not([data-more])'));
      this.overflowClass = 'header__nav-item--overflow';
      this.moreActiveClass = 'header__nav-item--more-active';

      this.moreTrigger.addEventListener('click', (e) => {
        if (window.innerWidth < 990) return;
        e.preventDefault();
        this.toggleMore();
      });
      this.moreItem.addEventListener('mouseenter', () => this.openMore());
      this.moreItem.addEventListener('mouseleave', () => this.closeMore());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeMore();
      });

      this.resizeObserver = new ResizeObserver(() => this.update());
      this.resizeObserver.observe(this.nav);
      this.update();
      // Re-measure once the web font is in: fallback-font widths at
      // DOMContentLoaded are narrower and skip the collapse.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this.update());
      }
      window.addEventListener('load', () => this.update());
    }

    update() {
      if (window.innerWidth < 990) {
        this.moreItem.setAttribute('aria-hidden', 'true');
        this.moreItem.classList.remove(this.moreActiveClass);
        this.items().forEach(el => el.classList.remove(this.overflowClass));
        return;
      }

      // Reveal everything before measuring: hidden items report 0 width.
      const itemEls = this.items();
      itemEls.forEach(el => el.classList.remove(this.overflowClass));
      this.moreItem.removeAttribute('aria-hidden');

      const listWidth = this.list.getBoundingClientRect().width;
      const moreWidth = this.moreItem.getBoundingClientRect().width;
      const available = listWidth - moreWidth - 8;

      let total = 0;
      let overflowStart = itemEls.length;

      for (let i = 0; i < itemEls.length; i++) {
        const w = itemEls[i].getBoundingClientRect().width;
        if (total + w > available) {
          overflowStart = i;
          break;
        }
        total += w;
      }

      if (overflowStart >= itemEls.length) {
        this.moreItem.setAttribute('aria-hidden', 'true');
        this.moreItem.classList.remove(this.moreActiveClass);
        this.moreContent.innerHTML = '';
        itemEls.forEach(el => el.classList.remove(this.overflowClass));
        return;
      }

      itemEls.forEach((el, i) => {
        el.classList.toggle(this.overflowClass, i >= overflowStart);
      });
      this.buildMoreContent(itemEls.slice(overflowStart));
      this.moreItem.removeAttribute('aria-hidden');
    }

    buildMoreContent(overflowItems) {
      const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const parts = [];
      overflowItems.forEach(item => {
        const link = item.querySelector('.header__nav-link');
        const tiles = item.querySelectorAll('.mega-menu__tile');
        const href = escape(link?.getAttribute('href') || '#');
        const title = escape(link?.textContent?.trim() || '');
        if (tiles.length > 0) {
          parts.push(`<div class="header__more-group"><a href="${href}" class="header__more-link header__more-link--parent">${title}</a>`);
          tiles.forEach(tile => {
            const tHref = escape(tile.getAttribute('href') || '#');
            const tTitle = escape(tile.querySelector('.mega-menu__tile-title')?.textContent?.trim() || tile.textContent?.trim() || '');
            parts.push(`<a href="${tHref}" class="header__more-link header__more-link--child" role="menuitem">${tTitle}</a>`);
          });
          parts.push('</div>');
        } else {
          parts.push(`<a href="${href}" class="header__more-link" role="menuitem">${title}</a>`);
        }
      });
      this.moreContent.innerHTML = parts.join('');
    }

    openMore() {
      if (this.moreContent.innerHTML) this.moreItem.classList.add(this.moreActiveClass);
      const trigger = this.moreTrigger;
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    closeMore() {
      this.moreItem.classList.remove(this.moreActiveClass);
      const trigger = this.moreTrigger;
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    toggleMore() {
      if (this.moreItem.classList.contains(this.moreActiveClass)) this.closeMore();
      else this.openMore();
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
      if (!this.track) return;

      this.prevBtn = container.querySelector('[data-carousel-prev]');
      this.nextBtn = container.querySelector('[data-carousel-next]');

      this.prevBtn?.addEventListener('click', () => this.scroll(-1));
      this.nextBtn?.addEventListener('click', () => this.scroll(1));

      this.track.addEventListener('scroll', () => this.updateArrows(), { passive: true });
      this.updateArrows();

      this.initDrag();
    }

    scroll(direction) {
      const slide = this.track.querySelector('.carousel__slide');
      if (!slide) return;
      const gap = parseFloat(getComputedStyle(this.track).gap) || 16;
      this.track.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: 'smooth' });
    }

    updateArrows() {
      const { scrollLeft, scrollWidth, clientWidth } = this.track;
      const atStart = scrollLeft <= 2;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
      if (this.prevBtn) this.prevBtn.classList.toggle('is-hidden', atStart);
      if (this.nextBtn) this.nextBtn.classList.toggle('is-hidden', atEnd);
    }

    initDrag() {
      const DRAG_THRESHOLD_PX = 8;
      const SNAP_THRESHOLD_PX = 30;
      let isPointerDown = false;
      let hasDragged = false;
      let startX = 0;
      let scrollStart = 0;
      let activePointerId = null;

      const endDrag = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;
        this.track.style.scrollSnapType = '';
        this.track.style.cursor = '';

        if (hasDragged && activePointerId != null) {
          try {
            this.track.releasePointerCapture(activePointerId);
          } catch (_) { /* already released */ }

          const dx = e.clientX - startX;
          if (Math.abs(dx) > SNAP_THRESHOLD_PX) {
            this.scroll(dx < 0 ? 1 : -1);
          }
        }

        activePointerId = null;
      };

      this.track.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isPointerDown = true;
        hasDragged = false;
        startX = e.clientX;
        scrollStart = this.track.scrollLeft;
        activePointerId = e.pointerId;
      });

      this.track.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;

        const dx = e.clientX - startX;
        if (!hasDragged) {
          if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
          hasDragged = true;
          this.track.style.scrollSnapType = 'none';
          this.track.style.cursor = 'grabbing';
          this.track.setPointerCapture(e.pointerId);
        }

        this.track.scrollLeft = scrollStart - dx;
      });

      this.track.addEventListener('pointerup', endDrag);
      this.track.addEventListener('pointercancel', endDrag);

      // Only suppress link/button activation after a real drag, not on a tap/click.
      this.track.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
        }
      }, true);
    }
  }

  /* --- Sticky Header --- */
  /* Transparent over the hero, solid chrome once it scrolls past. On pages
     without a hero the header is just a solid sticky bar. */
  class StickyHeader {
    constructor() {
      this.header = document.querySelector('.header');
      if (!this.header) return;

      this.section = this.header.closest('.header-section');
      this.promo = document.querySelector('.announcement-bar-section');
      this.hero = document.querySelector('.hero-section');
      this.heroExitOffset = 100;
      this.scrollThreshold = 50;

      this.update = this.update.bind(this);
      this.update();
      window.addEventListener('scroll', this.update, { passive: true });
      window.addEventListener('resize', this.update, { passive: true });
    }

    update() {
      const scrollY = window.pageYOffset;

      if (this.hero) {
        const inHero = scrollY < this.hero.offsetHeight - this.heroExitOffset;
        if (this.section) this.section.classList.toggle('is-pinned', !inHero);
        if (this.promo) this.promo.classList.toggle('is-pinned', !inHero);
        this.header.classList.toggle('is-transparent', inHero);
        this.header.classList.toggle('scrolled', !inHero);
      } else {
        this.header.classList.toggle('scrolled', scrollY > this.scrollThreshold);
      }
    }
  }

  /* --- Bizmis voice demo (snippets/bizmis-voice-demo.liquid) ---
     Cycles the shopper "say this" prompts. The benefit pills hold steady across
     same-benefit slides while the sub-benefit + enabling feature fade in with
     each one, mirroring the coachmark. Pauses on hover so a prompt can be read. */
  class VoiceDemo {
    constructor(root) {
      this.root = root;
      this.slides = Array.from(root.querySelectorAll('[data-voice-demo-slide]'));
      if (!this.slides.length) return;

      const sceneScope = root.closest('[data-voice-demo-scope]') || document;
      this.scenes = Array.from(sceneScope.querySelectorAll('[data-voice-demo-scene]'));

      this.benefitPills = Array.from(root.querySelectorAll('[data-benefit-pill]'));
      this.subEl = root.querySelector('[data-voice-demo-sub]');
      this.featureEl = root.querySelector('[data-voice-demo-feature]');
      this.askEl = root.querySelector('[data-voice-demo-ask]');
      this.dotsWrap = root.querySelector('[data-voice-demo-dots]');
      this.index = 0;
      this.timer = null;
      this.paused = false;
      this.showMs = 3600;
      this.fadeMs = 600;
      this.gapMs = 250;
      this.wordMs = 340;
      this.askDelayMs = 550;
      this.wordTimers = [];

      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.dots = this.buildDots();
      this.bindBenefitPills();

      this.show();

      if (!this.reduceMotion && this.slides.length > 1) {
        root.addEventListener('mouseenter', () => this.pause());
        root.addEventListener('mouseleave', () => this.resume());
      }
    }

    /* Benefit badges act as tabs: jump to the first sub-benefit of that branch. */
    bindBenefitPills() {
      this.benefitPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const type = pill.getAttribute('data-benefit-pill');
          const idx = this.slides.findIndex(s => s.getAttribute('data-benefit-type') === type);
          if (idx >= 0) this.jumpTo(idx);
        });
      });
    }

    buildDots() {
      if (!this.dotsWrap) return [];
      return this.slides.map((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'voice-demo__dot';
        dot.setAttribute('aria-label', `Show example ${i + 1} of ${this.slides.length}`);
        dot.addEventListener('click', () => this.jumpTo(i));
        this.dotsWrap.appendChild(dot);
        return dot;
      });
    }

    setScene(i) {
      if (!this.scenes.length) return;
      this.scenes.forEach((scene, k) => scene.classList.toggle('is-active', k === i));
    }

    updateDots(slide) {
      if (!this.dots.length) return;
      const isSupport = slide.getAttribute('data-benefit-type') === 'support';
      this.dots.forEach((dot, i) => {
        const active = i === this.index;
        dot.classList.toggle('is-active', active);
        dot.classList.toggle('is-support', active && isSupport);
      });
    }

    clearTimer() {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    }

    jumpTo(i) {
      if (i === this.index && this.timer) return;
      this.clearWordTimers();
      this.clearTimer();
      const current = this.slides[this.index];
      current.classList.remove('is-active');
      current.querySelectorAll('.voice-demo__word').forEach(w => w.classList.remove('is-current'));
      if (this.askEl) this.askEl.classList.remove('is-shown');
      if (this.subEl) this.subEl.classList.remove('is-shown');
      if (this.featureEl) this.featureEl.classList.remove('is-shown');
      this.index = i;
      this.paused = false;
      this.show();
    }

    showEyebrow(slide) {
      const sub = slide.getAttribute('data-sub') || '';
      const benefitType = slide.getAttribute('data-benefit-type');

      this.benefitPills.forEach(pill => {
        pill.classList.toggle('is-active', pill.getAttribute('data-benefit-pill') === benefitType);
      });

      if (this.subEl) {
        this.subEl.textContent = sub;
        this.subEl.hidden = !sub;
        this.subEl.classList.toggle('is-support', benefitType === 'support');
        this.subEl.classList.add('is-shown');
      }

      if (this.featureEl) {
        const feature = slide.getAttribute('data-feature') || '';
        this.featureEl.textContent = feature;
        this.featureEl.hidden = !feature;
        this.featureEl.classList.toggle('is-support', benefitType === 'support');
        this.featureEl.classList.add('is-shown');
      }
    }

    clearWordTimers() {
      this.wordTimers.forEach(t => window.clearTimeout(t));
      this.wordTimers = [];
    }

    /* Sweep the red highlight chip across the phrase one word at a time. */
    runKaraoke(words) {
      this.clearWordTimers();
      if (!words.length) return;

      const step = (i) => {
        words.forEach(w => w.classList.remove('is-current'));
        if (i >= words.length) return;
        words[i].classList.add('is-current');
        this.wordTimers.push(window.setTimeout(() => step(i + 1), this.wordMs));
      };
      step(0);
    }

    /* Staggered reveal: the outcome (sub-benefit + feature) lands first, then
       the ask ("Just say" + use case phrase) follows and the karaoke starts. */
    show() {
      this.clearTimer();
      const slide = this.slides[this.index];
      this.showEyebrow(slide);
      this.updateDots(slide);
      this.setScene(this.index);
      this.slides.forEach(s => s.classList.remove('is-active'));
      if (this.askEl) this.askEl.classList.remove('is-shown');

      const revealAsk = () => {
        slide.classList.add('is-active');
        if (this.askEl) this.askEl.classList.add('is-shown');
        const words = slide.querySelectorAll('.voice-demo__word');
        this.runKaraoke(words);
        const dwell = Math.max(this.showMs, words.length * this.wordMs + 1400);
        if (!this.reduceMotion && this.slides.length > 1) {
          this.timer = window.setTimeout(this.hide, dwell);
        }
      };

      if (this.reduceMotion) {
        revealAsk();
      } else {
        this.timer = window.setTimeout(revealAsk, this.askDelayMs);
      }
    }

    hide() {
      if (this.paused) return;
      this.clearWordTimers();
      this.clearTimer();
      const current = this.slides[this.index];
      current.querySelectorAll('.voice-demo__word').forEach(w => w.classList.remove('is-current'));
      current.classList.remove('is-active');
      if (this.askEl) this.askEl.classList.remove('is-shown');
      if (this.subEl) this.subEl.classList.remove('is-shown');
      if (this.featureEl) this.featureEl.classList.remove('is-shown');

      this.timer = window.setTimeout(() => {
        this.timer = null;
        if (this.paused) return;
        this.index = (this.index + 1) % this.slides.length;
        this.show();
      }, this.fadeMs + this.gapMs);
    }

    /* Pause/resume always restart the current slide cleanly so the rotation can
       never get stranded mid-fade with no active slide. */
    pause() {
      this.paused = true;
      this.clearWordTimers();
      this.clearTimer();
    }

    resume() {
      if (!this.paused) return;
      this.paused = false;
      this.show();
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
      this.stickyPrice = document.querySelector('[data-sticky-price]');
      this.stickyCompare = document.querySelector('[data-sticky-compare]');
      this.stickyBadge = document.querySelector('[data-sticky-badge]');

      this.initFromUrl();
      this.pills.forEach(pill => pill.addEventListener('click', () => this.onPillClick(pill)));
      this.interceptProductLinkClicks();
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
        if (group.querySelector('[data-product-link-group]')) return;
        const targetValue = variant.options[optionIdx];
        if (targetValue) {
          group.querySelectorAll('.variant-pill').forEach(p => {
            p.classList.toggle('is-active', p.dataset.optionValue === targetValue);
          });
        }
        optionIdx++;
      });
    }

    interceptProductLinkClicks() {
      const links = this.form.querySelectorAll('[data-product-link]');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const activeOption = this.getSelectedNonLinkOption();
          if (!activeOption) return;
          e.preventDefault();
          const url = new URL(link.href, window.location.origin);
          url.searchParams.set('size', activeOption);
          window.location.href = url.toString();
        });
      });
    }

    getSelectedNonLinkOption() {
      const groups = this.form.querySelectorAll('.pdp__variants');
      for (const group of groups) {
        if (group.querySelector('[data-product-link-group]')) continue;
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

      let onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
      let displayPrice = variant.price_formatted;
      let strikePrice = variant.compare_at_price_formatted;
      let salePct = 0;

      if (onSale) {
        salePct = Math.round((variant.compare_at_price - variant.price) / variant.compare_at_price * 100);
      }

      if (this.priceEl) {
        this.priceEl.textContent = displayPrice;
        this.priceEl.classList.toggle('pdp__price--sale', onSale);
      }
      if (this.compareEl) {
        this.compareEl.textContent = onSale ? strikePrice : '';
        this.compareEl.style.display = onSale ? '' : 'none';
      }
      if (this.badgeEl) {
        this.badgeEl.textContent = onSale ? `-${salePct}%` : '';
        this.badgeEl.style.display = onSale ? '' : 'none';
      }

      if (this.addBtn) {
        if (variant.available) {
          this.addBtn.disabled = false;
          this.addBtn.textContent = this.addBtn.dataset.addText || 'Add to Cart';
        } else {
          this.addBtn.disabled = true;
          this.addBtn.textContent = 'Sold Out';
        }
      }

      if (this.stickyPrice) this.stickyPrice.textContent = displayPrice;
      if (this.stickyCompare) {
        this.stickyCompare.textContent = onSale ? strikePrice : '';
        this.stickyCompare.style.display = onSale ? '' : 'none';
      }
      if (this.stickyBadge) {
        this.stickyBadge.textContent = onSale ? `-${salePct}%` : '';
        this.stickyBadge.style.display = onSale ? '' : 'none';
      }

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

  /* --- Hero Slideshow --- */
  class HeroSlideshow {
    constructor(el) {
      this.el = el;
      this.slides = el.querySelectorAll('[data-hero-slide]');
      this.dots = el.querySelectorAll('[data-hero-dot]');
      this.current = 0;
      this.total = this.slides.length;
      this.interval = parseInt(el.dataset.autoplayInterval, 10) || 6000;
      this.timer = null;
      this.paused = false;

      if (this.total <= 1) return;

      this.bindControls();
      this.startAutoplay();
    }

    bindControls() {
      this.el.querySelector('[data-hero-prev]')?.addEventListener('click', () => this.prev());
      this.el.querySelector('[data-hero-next]')?.addEventListener('click', () => this.next());
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => this.goTo(parseInt(dot.dataset.heroDot, 10)));
      });

      // No hover pause: the hero is fullscreen, so the cursor is almost always
      // over it and pausing made the slideshow look stuck. Focus pause stays
      // so keyboard users can operate the controls.
      this.el.addEventListener('focusin', () => this.pause());
      this.el.addEventListener('focusout', () => this.resume());

      this.bindSwipe();
    }

    // Touch devices hide the nav pill (base.css), so a horizontal swipe is
    // the way to change slides there.
    bindSwipe() {
      const SWIPE_MIN_PX = 48;
      let startX = null;
      let startY = null;

      this.el.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      this.el.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        startX = null;
        startY = null;
        // Mostly-horizontal gestures only; let vertical scrolling through.
        if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) this.next(); else this.prev();
      }, { passive: true });
    }

    goTo(index) {
      if (index === this.current) return;
      this.slides[this.current].classList.remove('is-active');
      this.dots[this.current]?.classList.remove('is-active');
      this.current = (index + this.total) % this.total;
      this.slides[this.current].classList.add('is-active');
      this.dots[this.current]?.classList.add('is-active');
      this.resetAutoplay();
    }

    next() { this.goTo(this.current + 1); }
    prev() { this.goTo(this.current - 1); }

    startAutoplay() {
      this.timer = setInterval(() => {
        if (!this.paused) this.next();
      }, this.interval);
    }

    resetAutoplay() {
      clearInterval(this.timer);
      this.startAutoplay();
    }

    pause() { this.paused = true; }
    resume() { this.paused = false; }
  }

  /* --- Hero copy intro ---
     Word-by-word fade on the shared overlay: eyebrow, then headline, then
     the red line. The underline paints after the last red-line word lands.
     Starts once the page loader is out of the way. */
  const HERO_WORD_STAGGER_MS = 150;
  const HERO_LINE_PAUSE_MS = 420;
  const HERO_REDEFINE_HOLD_MS = 640;
  const HERO_REDEFINE_STRIKE_MS = 640;
  const HERO_REDEFINE_STRIKE_HOLD_MS = 260;
  const HERO_REDEFINE_MORPH_MS = 920;
  const HERO_REDEFINE_SETTLE_MS = 280;
  const HERO_REDEFINE_TOTAL_MS =
    HERO_REDEFINE_HOLD_MS
    + HERO_REDEFINE_STRIKE_MS
    + HERO_REDEFINE_STRIKE_HOLD_MS
    + HERO_REDEFINE_MORPH_MS
    + HERO_REDEFINE_SETTLE_MS;
  const HERO_LINE_UNDERLINE_MS = 400;

  class HeroCopyReveal {
    constructor(slideshow) {
      this.root = slideshow.querySelector('.hero__content');
      this.cta = null;
      this.titleLine = null;
      this.underlineAt = 0;
      this.redefineAt = 0;
      this.started = false;
      if (!this.root) return;
      requestAnimationFrame(() => this.prepare());
    }

    prepare() {
      this.cta = this.root.querySelector('.hero__title-cta');
      this.titleLine = this.root.querySelector('.hero__title-line');
      const intro = [
        this.root.querySelector('.hero__subtitle'),
        this.titleLine
      ].filter(Boolean);

      if (!intro.length && !this.cta) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (this.cta) {
          this.ensureCtaInk(this.cta);
          this.wrapWords(this.cta.querySelector('.hero__title-cta-ink') || this.cta);
        }
        this.titleLine?.classList.add('is-redefined');
        this.root.classList.add('is-hero-animated');
        this.root.classList.add('is-revealing');
        this.groupCtaLines();
        this.cta?.classList.add('is-underlined');
        this.cta?.querySelectorAll('.hero__title-cta-line').forEach((line) => {
          line.classList.add('is-underlined');
        });
        return;
      }

      intro.forEach((line) => this.wrapWords(line));
      if (this.cta) {
        this.ensureCtaInk(this.cta);
        this.wrapWords(this.cta.querySelector('.hero__title-cta-ink') || this.cta);
      }

      let delay = 140;
      intro.forEach((line) => {
        const words = line.querySelectorAll('.hero__word');
        words.forEach((word, wordIndex) => {
          word.style.animationDelay = `${delay + wordIndex * HERO_WORD_STAGGER_MS}ms`;
        });
        const lineEnd = delay + Math.max(words.length - 1, 0) * HERO_WORD_STAGGER_MS;
        delay = lineEnd + HERO_WORD_STAGGER_MS + HERO_LINE_PAUSE_MS;
      });

      if (this.titleLine?.hasAttribute('data-hero-redefine')) {
        const titleEnd = delay - HERO_WORD_STAGGER_MS - HERO_LINE_PAUSE_MS;
        this.redefineAt = titleEnd + HERO_REDEFINE_HOLD_MS;
        delay = titleEnd + HERO_REDEFINE_TOTAL_MS + HERO_LINE_PAUSE_MS;
      }

      if (this.cta) {
        const words = this.cta.querySelectorAll('.hero__word');
        words.forEach((word, wordIndex) => {
          word.style.animationDelay = `${delay + wordIndex * HERO_WORD_STAGGER_MS}ms`;
        });
        const lineEnd = delay + Math.max(words.length - 1, 0) * HERO_WORD_STAGGER_MS;
        this.underlineAt = lineEnd + 280;
      }

      this.root.classList.add('is-hero-animated');
      requestAnimationFrame(() => this.groupCtaLines());
      this.armStart();
    }

    wrapWords(el) {
      const existing = el.querySelectorAll('.hero__word');
      if (existing.length) {
        existing.forEach((word) => word.setAttribute('aria-hidden', 'true'));
        return existing.length;
      }

      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return 0;

      el.setAttribute('aria-label', text);
      el.textContent = '';

      const words = text.split(' ');
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'hero__word';
        span.textContent = word;
        span.setAttribute('aria-hidden', 'true');
        el.appendChild(span);
        if (index < words.length - 1) el.appendChild(document.createTextNode(' '));
      });

      return words.length;
    }

    ensureCtaInk(el) {
      if (!el || el.querySelector(':scope > .hero__title-cta-ink')) return;
      const ink = document.createElement('span');
      ink.className = 'hero__title-cta-ink';
      while (el.firstChild) ink.appendChild(el.firstChild);
      el.appendChild(ink);
    }

    groupCtaLines() {
      const ink = this.cta?.querySelector('.hero__title-cta-ink');
      if (!ink || ink.querySelector('.hero__title-cta-line')) return;

      const words = [...ink.querySelectorAll('.hero__word')];
      if (!words.length) return;

      const buckets = [];
      words.forEach((word, index) => {
        const top = Math.round(word.getBoundingClientRect().top);
        let bucket = buckets.find((entry) => Math.abs(entry.top - top) < 6);
        if (!bucket) {
          bucket = { top, nodes: [] };
          buckets.push(bucket);
        }
        bucket.nodes.push(word);
        const nextWord = words[index + 1];
        const space = word.nextSibling;
        if (
          nextWord
          && space
          && space.nodeType === Node.TEXT_NODE
          && Math.abs(Math.round(nextWord.getBoundingClientRect().top) - top) < 6
        ) {
          bucket.nodes.push(space);
        }
      });

      buckets.forEach((bucket) => {
        const line = document.createElement('span');
        line.className = 'hero__title-cta-line';
        bucket.nodes[0].parentNode.insertBefore(line, bucket.nodes[0]);
        bucket.nodes.forEach((node) => line.appendChild(node));
        const rule = document.createElement('span');
        rule.className = 'hero__title-cta-rule';
        rule.setAttribute('aria-hidden', 'true');
        line.appendChild(rule);
      });
    }

    playCtaUnderline() {
      if (!this.cta) return;
      this.groupCtaLines();
      this.cta.classList.add('is-underlined');
      const lines = [...this.cta.querySelectorAll('.hero__title-cta-line')];
      lines.forEach((line, index) => {
        window.setTimeout(() => line.classList.add('is-underlined'), index * HERO_LINE_UNDERLINE_MS);
      });
    }

    playRedefine(line) {
      if (!line || line.classList.contains('is-redefined')) return;

      const from = line.querySelector('.hero__redefine-from');
      const to = line.querySelector('.hero__redefine-to');
      if (!from || !to) {
        line.classList.add('is-redefined');
        return;
      }

      from.style.width = `${from.getBoundingClientRect().width}px`;
      to.style.width = '0px';
      line.classList.add('is-striking');

      const morphAt = HERO_REDEFINE_STRIKE_MS + HERO_REDEFINE_STRIKE_HOLD_MS;
      window.setTimeout(() => {
        const nextWidth = to.scrollWidth;
        line.classList.add('is-erasing', 'is-redefined');
        from.style.width = '0px';
        to.style.width = `${nextWidth}px`;
      }, morphAt);

      window.setTimeout(() => {
        line.classList.remove('is-striking', 'is-erasing');
        from.style.width = '';
        to.style.width = '';
      }, morphAt + HERO_REDEFINE_MORPH_MS);
    }

    begin() {
      if (this.started) return;
      this.started = true;
      this.root.classList.add('is-revealing');
      if (this.cta) {
        window.setTimeout(() => this.playCtaUnderline(), this.underlineAt);
      }
      if (this.redefineAt) {
        window.setTimeout(() => this.playRedefine(this.titleLine), this.redefineAt);
      }
    }

    armStart() {
      if (promoVideo === 'opening' || hasPromoCover()) return;

      const loader = document.getElementById('page-loader');
      if (!loader || loader.classList.contains('is-hidden')) {
        this.begin();
        return;
      }

      loader.addEventListener('transitionend', (event) => {
        if (event.target === loader) this.begin();
      });
      window.addEventListener('load', () => window.setTimeout(() => this.begin(), 520), { once: true });
    }
  }

  /* --- Money Formatter --- */
  function formatMoney(cents) {
    const fmt = window.Shopify?.money_format || '${{amount}}';
    const raw = (cents / 100).toFixed(2);
    const withCommas = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const noDecimals = Math.round(cents / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return fmt
      .replace('{{amount_with_comma_separator}}', raw.replace('.', ','))
      .replace('{{amount_no_decimals_with_comma_separator}}', Math.round(cents / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
      .replace('{{amount_no_decimals}}', noDecimals)
      .replace('{{amount}}', withCommas);
  }

  /* --- Newsletter Confetti --- */
  function fireConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#D1001A';
    const gravity = 0.32;
    const drag = 0.006;
    const duration = 2600;
    const originX = canvas.width / 2;
    const originY = canvas.height * 0.35;

    const particles = Array.from({ length: 150 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 11;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 6 + Math.random() * 6,
        color: primary,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
      };
    });

    const start = performance.now();

    const frame = (now) => {
      const elapsed = now - start;
      const life = Math.max(0, 1 - elapsed / duration);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.vy += gravity;
        p.vx *= (1 - drag);
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        window.removeEventListener('resize', resize);
        canvas.remove();
      }
    };

    requestAnimationFrame(frame);
  }

  /* --- Subscription celebration ---
     After a successful subscribe, Shopify reloads with ?customer_posted=true
     and the form id as the fragment (e.g. #footer-newsletter). Auto-scroll to
     that section, then fire confetti once the scroll has settled. */
  function whenScrollSettles(callback) {
    let done = false;
    let idle;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idle);
      clearTimeout(safety);
      callback();
    };
    const onScroll = () => {
      clearTimeout(idle);
      idle = setTimeout(finish, 140);
    };
    const safety = setTimeout(finish, 2000);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initSubscriptionCelebration() {
    const successEl = document.querySelector('[data-newsletter-success]');
    if (!successEl) return;

    const hashId = window.location.hash.length > 1
      ? decodeURIComponent(window.location.hash.slice(1))
      : null;
    const target = (hashId && document.getElementById(hashId))
      || successEl.closest('section, .footer__newsletter-banner')
      || successEl;

    const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
    const centerMargin = Math.max(0, (window.innerHeight - target.offsetHeight) / 2);
    const targetY = Math.max(0, absoluteTop - centerMargin);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || Math.abs(window.scrollY - targetY) < 4) {
      window.scrollTo(0, targetY);
      fireConfetti();
      return;
    }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    whenScrollSettles(fireConfetti);
    requestAnimationFrame(() => window.scrollTo({ top: targetY, behavior: 'smooth' }));
  }

  /* --- Bizmis voice clerk trigger ---
     "Talk to the clerk" starts a voicechat through the widget's imperative API
     (window.AvatarVoicechat.startVoicechat). Older widget builds without that
     API fall back to surfacing + pulsing the floating widget. */
  const VOICE_WIDGET_SELECTORS = ['#bizmis-avatar-embed', '.bizmis-avatar-widget-root', '#avatar-root', '[data-avatar-widget]'];

  function findVoiceWidget() {
    for (let i = 0; i < VOICE_WIDGET_SELECTORS.length; i++) {
      const el = document.querySelector(VOICE_WIDGET_SELECTORS[i]);
      if (el) return el;
    }
    return document.getElementById('bizmis-shopify-avatar-widget');
  }

  function isPromoTrueHome() {
    return promoStoreUnlocked && document.body.classList.contains('template-index');
  }

  function promoTypeAfterMs() {
    const raw = promoSearchParams().get('type_after');
    if (raw == null || raw === '') return PROMO_TYPE_AFTER_MS;
    const ms = Number(raw);
    return Number.isFinite(ms) && ms >= 0 ? ms : PROMO_TYPE_AFTER_MS;
  }

  class PromoQueryTypewriter {
    constructor() {
      this.input = null;
      this.timer = 0;
      this.aborted = false;
    }

    schedule() {
      if (!isPromoTrueHome()) return;
      window.setTimeout(() => this.begin(), promoTypeAfterMs());
    }

    begin() {
      this.findInput().then((input) => {
        if (!input || this.aborted) return;
        this.input = input;
        this.watchAbort();
        input.focus({ preventScroll: true });
        if (prefersReducedMotion()) {
          this.setValue(PROMO_TYPE_QUERY);
          return;
        }
        this.type(0);
      });
    }

    findInput() {
      const deadline = Date.now() + PROMO_TYPE_FIND_MS;
      return new Promise((resolve) => {
        const tick = () => {
          const input = this.locateInput();
          if (input) {
            resolve(input);
            return;
          }
          if (Date.now() >= deadline) {
            resolve(null);
            return;
          }
          window.setTimeout(tick, 120);
        };
        tick();
      });
    }

    locateInput() {
      const widget = findVoiceWidget();
      if (!widget) return null;
      const candidates = widget.querySelectorAll('textarea, .bizmis-chat-input-bar input');
      for (let i = 0; i < candidates.length; i++) {
        if (this.isUsable(candidates[i])) return candidates[i];
      }
      return null;
    }

    isUsable(el) {
      if (!el || el.disabled || el.value) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 8 && rect.height > 8;
    }

    watchAbort() {
      const abort = (event) => {
        if (!event.isTrusted) return;
        this.aborted = true;
        window.clearTimeout(this.timer);
      };
      this.input.addEventListener('keydown', abort);
      this.input.addEventListener('pointerdown', abort);
    }

    type(index) {
      if (this.aborted) return;
      this.setValue(PROMO_TYPE_QUERY.slice(0, index));
      if (index >= PROMO_TYPE_QUERY.length) return;
      this.timer = window.setTimeout(() => this.type(index + 1), PROMO_TYPE_CHAR_MS);
    }

    followCaret() {
      const input = this.input;
      if (!input) return;
      const len = input.value.length;
      input.focus({ preventScroll: true });
      try {
        input.setSelectionRange(len, len);
      } catch {
        /* some input types reject selection */
      }
      input.scrollLeft = input.scrollWidth;
      input.scrollTop = input.scrollHeight;
    }

    setValue(value) {
      const proto = this.input.tagName === 'TEXTAREA'
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(this.input, value);
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.followCaret();
      requestAnimationFrame(() => {
        this.followCaret();
        requestAnimationFrame(() => this.followCaret());
      });
    }
  }

  function openVoiceClerk() {
    const api = window.AvatarVoicechat;
    if (api && typeof api.startVoicechat === 'function' && api.startVoicechat()) return;

    const widget = findVoiceWidget();
    if (!widget) return;

    widget.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    widget.classList.add('bizmis-widget-pulse');
    window.setTimeout(() => widget.classList.remove('bizmis-widget-pulse'), 1800);
  }

  function initVoiceClerkTriggers() {
    document.querySelectorAll('[data-open-voice-clerk]').forEach(btn => {
      btn.addEventListener('click', openVoiceClerk);
    });
  }

  /* Measure the demo promo bar so the index header floats just below it (and the
     hero fills exactly the remaining viewport). Handles wrapping on small screens. */
  function initPromoBar() {
    const bar = document.querySelector('.promo-bar');
    if (!bar) {
      document.documentElement.style.setProperty('--promo-height', '28px');
      document.body.style.setProperty('--promo-height', '28px');
      return;
    }
    const apply = () => document.body.style.setProperty('--promo-height', `${bar.offsetHeight}px`);
    apply();
    window.addEventListener('resize', apply, { passive: true });
    window.addEventListener('load', apply);
  }

  /* --- Initialize --- */
  function init() {
    const cartDrawer = new CartDrawer();
    new AddToCart(cartDrawer);
    new CartPage();
    new CollectionFilters();
    new SearchInfiniteScroll();
    new DesktopNav();
    new NavOverflow();
    new SupportDropdown();
    new LocaleSelector();
    new MobileMenu();
    new SearchOverlay();
    new StickyHeader();

    document.querySelectorAll('[data-tabs]').forEach(el => new Tabs(el));
    document.querySelectorAll('[data-accordion]').forEach(el => new Accordion(el));
    document.querySelectorAll('.pdp__gallery').forEach(el => new ProductGallery(el));
    document.querySelectorAll('.qty-selector:not(.cart-drawer .qty-selector):not(.main-cart-section .qty-selector)').forEach(el => new QuantitySelector(el));
    document.querySelectorAll('.carousel').forEach(el => new Carousel(el));
    applyPromoVideoHero();
    let heroReveal = null;
    document.querySelectorAll('[data-hero-slideshow]').forEach(el => {
      new HeroSlideshow(el);
      heroReveal = new HeroCopyReveal(el);
    });
    const promoTypewriter = new PromoQueryTypewriter();
    const startPromoTypewriter = () => promoTypewriter.schedule();
    if (promoVideo === 'opening') {
      const opening = document.querySelector('[data-promo-opening]');
      if (opening) {
        const openingController = new PromoOpening(opening, () => {
          heroReveal?.begin();
          startPromoTypewriter();
        });
        window.__promoOpeningFrames = openingController;
      }
    } else if (hasPromoCover()) {
      const cover = document.querySelector('[data-promo-cover]');
      if (cover) new PromoCover(cover, heroReveal, startPromoTypewriter).start();
      else startPromoTypewriter();
    } else {
      startPromoTypewriter();
    }
    document.querySelectorAll('[data-voice-demo]').forEach(el => new VoiceDemo(el));
    initVoiceClerkTriggers();
    initPromoBar();
    propagatePromoVideoParam();
    document.querySelectorAll('[data-variant-selector]').forEach(el => {
      new VariantSelector(el);
    });
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

  window.addEventListener('load', () => {
    dismissLoader();
    // Wait out the loader fade so the scroll and confetti are not hidden behind it.
    setTimeout(initSubscriptionCelebration, 600);
  });
})();
