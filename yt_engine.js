// yt_engine.js - Universal 144p Auto-Play, Pop-up Destroyer & Ad-Skipper (2026)
(function() {
    if (window.__YT_PERFECT_ENGINE__) return;
    window.__YT_PERFECT_ENGINE__ = true;
    console.log("[YT Engine] Auto-Play & Instant Ad-Skip Active");

    // Cookie Google & Consent
    try {
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "CONSENT=PENDING+999; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube-nocookie.com; path=/; max-age=31536000";
    } catch(e) {}

    // Kunci kualitas ke 144p (tiny)
    try {
        localStorage.setItem('yt-player-quality', JSON.stringify({
            data: 'tiny',
            expiration: Date.now() + 864000000,
            creation: Date.now()
        }));
    } catch(e) {}

    // Injeksi CSS agresif: Sembunyikan sidebar rekomendasi, komentar, pop-up Premium
    try {
        var style = document.createElement('style');
        style.id = 'yt-perfect-css';
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

    var qualityDone = false;

    // Loop Cepat (200ms) untuk Skip Iklan & Tutup Popup Premium
    function fastLoop() {
        try {
            // A. Tutup pop-up "YouTube Premium - No thanks / Batal"
            var premiumDismiss = document.querySelectorAll('ytd-mealbar-promo-renderer #dismiss-button button, ytd-mealbar-promo-renderer button[aria-label*="No thanks" i], tp-yt-paper-dialog #dismiss-button button, ytd-button-renderer#dismiss-button button, button[aria-label*="No thanks" i], button[aria-label*="Tidak" i], button[aria-label*="Batal" i]');
            for (var i = 0; i < premiumDismiss.length; i++) {
                clickEl(premiumDismiss[i]);
            }

            // B. Tutup dialog persetujuan Google / consent
            var consentBtn = document.querySelector('button[aria-label*="Accept" i], button[aria-label*="Agree" i], button[aria-label*="Setuju" i], button[aria-label*="Terima" i], form[action*="consent"] button');
            if (consentBtn) { clickEl(consentBtn); }

            // C. Skip Iklan YouTube
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                var isAd = player.classList.contains('ad-showing') || 
                           player.classList.contains('ad-interrupting') || 
                           document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay, .ytp-ad-preview-container');

                if (isAd) {
                    if (typeof player.skipAd === 'function') { try { player.skipAd(); } catch(e) {} }
                    if (typeof player.cancelPlayback === 'function') { try { player.cancelPlayback(); } catch(e) {} }

                    var skipButtons = document.querySelectorAll('.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button-modern, button.ytp-skip-ad-button, .ytp-ad-skip-button-container button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id^="skip-button:"] button, button[class*="skip-button"], button[class*="ytp-ad-skip"], .ytp-ad-overlay-close-button');
                    for (var s = 0; s < skipButtons.length; s++) {
                        clickEl(skipButtons[s]);
                    }

                    if (isFinite(v.duration) && v.duration > 0 && v.duration < 300) {
                        v.muted = true;
                        v.playbackRate = 16.0;
                        if (v.currentTime < v.duration) {
                            v.currentTime = v.duration;
                        }
                    }
                } else {
                    if (v.playbackRate !== 1.0) { v.playbackRate = 1.0; }
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

    // Loop Normal (1000ms) untuk Kunci 144p
    function normalLoop() {
        try {
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
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
        } catch(e) {}
    }

    setInterval(fastLoop, 200);
    setInterval(normalLoop, 1000);
    fastLoop();
    normalLoop();
})();