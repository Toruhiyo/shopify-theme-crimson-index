/*
 * The Bizmis demo film in the hero (snippets/bizmis-film.liquid), with bizmis.ai's film player behaviour:
 * - idle:    the hero as it is, with a play button. Nothing of the film loads before the first press.
 * - playing: the film over the hero, edge to edge under the header, with sound; the bar hides while the pointer rests.
 * - paused:  a click on the film or the bar's button holds the frame.
 * - ended:   the closing frame stays and its "Install now" becomes a real button, in place.
 * A click outside the film, Escape or the close button returns to the hero; play then resumes where it stopped.
 * HLS through hls.js (loaded on the first play), or natively where the browser plays HLS itself (Safari).
 */
(function () {
  'use strict';

  var IDLE_MS = 2500;
  var PEAK_OVER_AVERAGE = 2.5; // auto quality judges a rendition by its peak; cap it at this many times its average

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function init(root) {
    var hero = root.closest('.hero') || root.parentElement;
    var header = document.querySelector('.header-section');
    var stage = root.querySelector('[data-film-stage]');
    var video = root.querySelector('[data-film-video]');
    var openBtn = root.querySelector('[data-film-open]');
    var toggleBtn = root.querySelector('[data-film-toggle]');
    var muteBtn = root.querySelector('[data-film-mute]');
    var ccBtn = root.querySelector('[data-film-cc]');
    var fsBtn = root.querySelector('[data-film-fullscreen]');
    var closeBtn = root.querySelector('[data-film-close]');
    var track = root.querySelector('[data-film-track]');
    var played = root.querySelector('[data-film-played]');
    var buffered = root.querySelector('[data-film-buffered]');
    var timeEl = root.querySelector('[data-film-time]');
    var spinner = root.querySelector('[data-film-spinner]');
    var endCta = root.querySelector('[data-film-end-cta]');
    var src = root.getAttribute('data-src');
    var endBox = (root.getAttribute('data-end-cta') || '').split(',').map(Number);
    // a film that fades out ends this many seconds early, on its last clean frame (the closing CTA)
    var endHold = Number(root.getAttribute('data-end-hold')) || 0;
    var phase = 'idle';
    var hls = null;
    var ready = null;
    var hideTimer = 0;
    var waitTimer = 0;
    var scrubbing = false;

    function setPhase(p) {
      phase = p;
      root.setAttribute('data-phase', p);
      document.documentElement.classList.toggle('bizmis-film-open', p !== 'idle');
      toggleBtn.setAttribute('aria-label', p === 'playing' ? 'Pause' : p === 'ended' ? 'Watch again' : 'Play');
      endCta.hidden = p !== 'ended';
      if (p === 'ended') placeEndCta();
    }

    // the stage starts under the floating header, so the header never covers the film
    function placeStage() {
      var top = 0;
      if (header) {
        var h = header.getBoundingClientRect();
        var r = hero.getBoundingClientRect();
        if (h.bottom > r.top && h.top < r.bottom) top = Math.max(0, h.bottom - r.top);
      }
      stage.style.top = top + 'px';
    }

    // the film's picture inside the stage (letterboxed), so the end button sits exactly on the film's title
    function placeEndCta() {
      if (endBox.length !== 4) return;
      var w = video.clientWidth;
      var h = video.clientHeight;
      var aspect = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
      var pw = Math.min(w, h * aspect);
      var ph = pw / aspect;
      var left = video.offsetLeft + (w - pw) / 2;
      var top = video.offsetTop + (h - ph) / 2;
      var padX = pw * 0.018;
      var padY = ph * 0.03;
      endCta.style.left = left + endBox[0] * pw - padX + 'px';
      endCta.style.top = top + endBox[1] * ph - padY + 'px';
      endCta.style.width = endBox[2] * pw + 2 * padX + 'px';
      endCta.style.height = endBox[3] * ph + 2 * padY + 'px';
    }

    function capToPlayer() {
      if (!hls || !hls.levels || !hls.levels.length) return;
      var scale = Math.min(window.devicePixelRatio || 1, 2) * 1.25;
      var needW = video.clientWidth * scale;
      var needH = video.clientHeight * scale;
      var fit = -1;
      for (var i = 0; i < hls.levels.length; i++) {
        if (hls.levels[i].width >= needW && hls.levels[i].height >= needH) { fit = i; break; }
      }
      hls.autoLevelCapping = fit === -1 ? hls.levels.length - 1 : fit;
    }

    function ensureSource() {
      if (ready) return ready;
      var isHls = /\.m3u8(\?|$)/.test(src);
      // hls.js wherever Media Source exists (it picks the rendition by the player's size); native HLS otherwise (iOS)
      var mse = window.MediaSource || window.ManagedMediaSource;
      if (!isHls || !mse) {
        video.src = src;
        ready = Promise.resolve();
        return ready;
      }
      ready = (window.Hls ? Promise.resolve() : loadScript(root.getAttribute('data-hls-js'))).then(function () {
        var Hls = window.Hls;
        if (!Hls || !Hls.isSupported()) { video.src = src; return; }
        hls = new Hls({ maxBufferLength: 20, maxMaxBufferLength: 40, abrEwmaDefaultEstimate: 3000000 });
        return new Promise(function (resolve) {
          hls.once(Hls.Events.MANIFEST_PARSED, function () {
            hls.levels.forEach(function (l) {
              if (l.averageBitrate && l.bitrate > l.averageBitrate * PEAK_OVER_AVERAGE) l.bitrate = Math.round(l.averageBitrate * PEAK_OVER_AVERAGE);
            });
            capToPlayer();
            resolve();
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        });
      });
      return ready;
    }

    function wake() {
      root.classList.add('is-awake');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        if (!scrubbing && phase === 'playing') root.classList.remove('is-awake');
      }, IDLE_MS);
    }

    function play() {
      placeStage();
      stage.hidden = false;
      setPhase('playing');
      wake();
      ensureSource().then(function () {
        var p = video.play();
        if (p && p.catch) p.catch(function () { setPhase('paused'); });
      });
      stage.focus({ preventScroll: true });
    }

    function pause() {
      video.pause();
      setPhase('paused');
      wake();
    }

    function replay() {
      video.currentTime = 0;
      play();
    }

    function close() {
      if (phase === 'idle') return;
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      video.pause();
      stage.hidden = true;
      setPhase('idle');
      openBtn.focus({ preventScroll: true });
    }

    function toggle() {
      if (phase === 'playing') pause();
      else if (phase === 'ended') replay();
      else play();
    }

    function seekFraction(clientX) {
      var r = track.getBoundingClientRect();
      var f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (isFinite(video.duration)) {
        video.currentTime = f * video.duration;
        if (phase === 'ended' && f < 1) setPhase('paused');
      }
    }

    openBtn.addEventListener('click', function () {
      if (phase === 'ended') replay();
      else play();
    });
    toggleBtn.addEventListener('click', toggle);
    closeBtn.addEventListener('click', close);
    video.addEventListener('click', toggle);
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      root.classList.toggle('is-muted', video.muted);
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    });
    if (ccBtn) {
      ccBtn.addEventListener('click', function () {
        var t = video.textTracks && video.textTracks[0];
        if (!t) return;
        var on = t.mode !== 'showing';
        t.mode = on ? 'showing' : 'disabled';
        ccBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    fsBtn.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      else if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {});
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS Safari: only the <video> goes fullscreen
    });

    track.addEventListener('pointerdown', function (e) {
      scrubbing = true;
      track.setPointerCapture(e.pointerId);
      seekFraction(e.clientX);
    });
    track.addEventListener('pointermove', function (e) { if (scrubbing) seekFraction(e.clientX); });
    track.addEventListener('pointerup', function () { scrubbing = false; wake(); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + (e.key === 'ArrowRight' ? 5 : -5)));
      }
    });

    stage.addEventListener('pointermove', wake);
    stage.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'k') { if (e.target === stage || e.target === video) { e.preventDefault(); toggle(); } }
    });

    video.addEventListener('timeupdate', function () {
      var d = video.duration;
      if (endHold && phase === 'playing' && isFinite(d) && video.currentTime >= d - endHold) {
        video.pause();
        video.currentTime = d - endHold;
        setPhase('ended');
        root.classList.add('is-awake');
      }
      var pct = isFinite(d) && d > 0 ? (video.currentTime / d) * 100 : 0;
      played.style.width = pct + '%';
      track.setAttribute('aria-valuenow', String(Math.round(pct)));
      timeEl.textContent = fmt(video.currentTime) + ' / ' + (isFinite(d) ? fmt(d) : timeEl.textContent.split(' / ')[1]);
    });
    video.addEventListener('progress', function () {
      var d = video.duration;
      if (video.buffered.length && isFinite(d) && d > 0) buffered.style.width = (video.buffered.end(video.buffered.length - 1) / d) * 100 + '%';
    });
    video.addEventListener('ended', function () {
      setPhase('ended');
      root.classList.add('is-awake');
    });
    video.addEventListener('waiting', function () {
      clearTimeout(waitTimer);
      waitTimer = setTimeout(function () { spinner.hidden = false; }, 250);
    });
    ['playing', 'canplay', 'pause'].forEach(function (ev) {
      video.addEventListener(ev, function () { clearTimeout(waitTimer); spinner.hidden = true; });
    });
    video.addEventListener('loadedmetadata', function () { if (phase === 'ended') placeEndCta(); });

    // the end CTA follows the picture when the stage resizes; auto quality follows the player's size
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        capToPlayer();
        if (phase === 'ended') placeEndCta();
      }).observe(video);
    }
    window.addEventListener('resize', function () { if (phase !== 'idle') placeStage(); });

    document.addEventListener('pointerdown', function (e) {
      if (phase === 'idle' || document.fullscreenElement) return;
      if (!stage.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && phase !== 'idle' && !document.fullscreenElement) close();
    });

    setPhase('idle');
  }

  function boot() {
    document.querySelectorAll('[data-bizmis-film]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
