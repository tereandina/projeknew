// yt_engine.js - Universal 144p Auto-Play, Pop-up Destroyer & Ultra-Accurate Ad-Skipper (2026)
(function() {
    if (window.__YT_ENGINE_INITIALIZED__) return;
    window.__YT_ENGINE_INITIALIZED__ = true;
    console.log("[YT Engine] Initialized - Auto-Play, 144p, Ad-Skip, Pop-up Blocker Active");

    // 1. Cookies & Consent Bypass
    try {
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "CONSENT=PENDING+999; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube-nocookie.com; path=/; max-age=31536000";
    } catch(e) {}

    // 2. Lock Quality to 144p (tiny) in LocalStorage
    try {
        localStorage.setItem('yt-player-quality', JSON.stringify({
            data: 'tiny',
            expiration: Date.now() + 864000000,
            creation: Date.now()
        }));
    } catch(e) {}

    // 3. Inject CSS to hide heavy distracting elements and popups
    try {
        var style = document.createElement('style');
        style.id = 'yt-clean-ui-css';
        style.textContent = `
            #secondary, #related, #comments, #below, 
            ytd-watch-next-secondary-results-renderer, 
            ytd-watch-grid #secondary, ytd-merch-shelf-renderer, 
            #chat, ytd-engagement-panel-section-list-renderer, 
            ytd-banner-promo-renderer, ytd-statement-banner-renderer, 
            tp-yt-iron-overlay-backdrop, ytd-consent-bump-v2-lightbox, 
            tp-yt-paper-dialog, ytd-mealbar-promo-renderer,
            .ytd-mealbar-promo-renderer, ytd-action-companion-ad-renderer,
            #premium-splash-button, ytd-popup-container ytd-mealbar-promo-renderer { 
                display: none !important; 
                visibility: hidden !important; 
                opacity: 0 !important; 
                height: 0px !important;
                pointer-events: none !important; 
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    } catch(e) {}

    function clickEl(el) {
        if (!el) return false;
        try {
            el.click();
            return true;
        } catch(e) {
            try {
                var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                el.dispatchEvent(evt);
                return true;
            } catch(err) { return false; }
        }
    }

    // Helper: Cek apakah saat ini BENAR-BENAR ada iklan yang aktif
    function isRealAdActive(player) {
        if (!player) return false;
        if (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) {
            return true;
        }
        var adText = document.querySelector('.ytp-ad-text');
        if (adText && (adText.offsetWidth > 0 || adText.offsetHeight > 0)) {
            return true;
        }
        return false;
    }

    var qualityDone = false;

    // Loop Cepat (250ms) untuk Skip Iklan & Handle Popups
    function fastLoop() {
        try {
            // A. Tutup pop-up "YouTube Premium - No thanks / Batal / Dismiss"
            var premiumDismiss = document.querySelectorAll('ytd-mealbar-promo-renderer #dismiss-button button, ytd-mealbar-promo-renderer button[aria-label*="No thanks" i], tp-yt-paper-dialog #dismiss-button button, ytd-button-renderer#dismiss-button button, button[aria-label*="No thanks" i], button[aria-label*="Tidak" i], button[aria-label*="Batal" i]');
            for (var i = 0; i < premiumDismiss.length; i++) {
                clickEl(premiumDismiss[i]);
            }

            // B. Tutup dialog persetujuan Google / consent
            var consentBtn = document.querySelector('button[aria-label*="Accept" i], button[aria-label*="Agree" i], button[aria-label*="Setuju" i], button[aria-label*="Terima" i], form[action*="consent"] button');
            if (consentBtn) { clickEl(consentBtn); }

            // C. Handle YouTube Player & Video
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                var isAd = isRealAdActive(player);

                if (isAd) {
                    if (typeof player.skipAd === 'function') { try { player.skipAd(); } catch(e) {} }

                    var skipButtons = document.querySelectorAll('.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button-modern, button.ytp-skip-ad-button, .ytp-ad-skip-button-container button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id^="skip-button:"] button, button[class*="skip-button"], button[class*="ytp-ad-skip"], .ytp-ad-overlay-close-button');
                    for (var s = 0; s < skipButtons.length; s++) {
                        if (skipButtons[s].offsetWidth > 0 || skipButtons[s].offsetHeight > 0) {
                            clickEl(skipButtons[s]);
                        }
                    }

                    // Percepat Iklan saja
                    v.muted = true;
                    v.playbackRate = 8.0;
                } else {
                    // VIDEO UTAMA - JALANKAN NORMAL 1.0x SPEED
                    if (v.playbackRate !== 1.0) {
                        v.playbackRate = 1.0;
                    }

                    // Auto Play jika terhenti
                    var bigPlay = player.querySelector('button.ytp-large-play-button');
                    if (bigPlay && (bigPlay.offsetWidth > 0 || bigPlay.offsetHeight > 0)) {
                        clickEl(bigPlay);
                    }
                    if (v.paused) {
                        if (typeof player.playVideo === 'function') { try { player.playVideo(); } catch(e) {} }
                        v.play().catch(function(){});
                    }
                }
            }
        } catch(e) {}
    }

    // Loop Normal (1000ms) untuk Kunci 144p & Hitung Waktu Tonton Nyata
    window.__YT_WATCHED_SECONDS__ = 0;
    function normalLoop() {
        try {
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && !qualityDone) {
                try {
                    if (typeof player.setPlaybackQualityRange === 'function') {
                        player.setPlaybackQualityRange('tiny', 'tiny');
                        qualityDone = true;
                    } else if (typeof player.setPlaybackQuality === 'function') {
                        player.setPlaybackQuality('tiny');
                        qualityDone = true;
                    }
                } catch(q) {}
            }

            if (player && v && !v.paused && !isRealAdActive(player) && v.readyState >= 2) {
                window.__YT_WATCHED_SECONDS__ += 1;
            }
        } catch(e) {}
    }

    setInterval(fastLoop, 250);
    setInterval(normalLoop, 1000);
    fastLoop();
    normalLoop();
})();