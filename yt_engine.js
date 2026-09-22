// yt_engine.js - Ultra-Lightweight 144p Video Playback & Precision Ad-Skip Engine (2026)
(function() {
    if (window.__YT_LIGHTWEIGHT_ENGINE_ACTIVE__) return;
    window.__YT_LIGHTWEIGHT_ENGINE_ACTIVE__ = true;
    console.log("[YT Engine] Ultra-Lightweight 144p Mode Active");

    // Injeksi CSS sekali saja untuk menyembunyikan komentar & rekomendasi (0% CPU JavaScript)
    try {
        var style = document.createElement('style');
        style.id = 'yt-lightweight-css';
        style.textContent = '#comments, #related, #secondary, ytd-merch-shelf-renderer, #chat, ytd-engagement-panel-section-list-renderer, ytd-banner-promo-renderer, ytd-statement-banner-renderer, tp-yt-iron-overlay-backdrop, ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog#dialog, .eom-v1-dialog { display: none !important; }';
        document.documentElement.appendChild(style);
    } catch(e) {}

    // Cookie Google consent
    try {
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "CONSENT=PENDING+999; domain=.youtube.com; path=/; max-age=31536000";
    } catch(e) {}

    // Kunci preferensi kualitas ke 144p (tiny) agar CPU sangat dingin dan hemat bandwidth
    try {
        localStorage.setItem('yt-player-quality', JSON.stringify({
            data: 'tiny',
            expiration: Date.now() + 864000000,
            creation: Date.now()
        }));
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

    var qualitySet = false;

    function processYouTube() {
        try {
            // 1. Tutup pop-up consent jika muncul
            var consentBtn = document.querySelector('button[aria-label*="Accept" i], button[aria-label*="Agree" i], button[aria-label*="Setuju" i], button[aria-label*="Terima" i], ytd-button-renderer#dismiss-button button, tp-yt-paper-button#dismiss-button, #dismiss-button, form[action*="consent"] button');
            if (consentBtn) {
                clickEl(consentBtn);
            }

            if (document.body && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
            }

            // 2. Kontrol Player & Skip Iklan
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                // Kunci resolusi 144p/tiny agar tidak membebani CPU komputer
                if (!qualitySet) {
                    try {
                        if (typeof player.setPlaybackQualityRange === 'function') {
                            player.setPlaybackQualityRange('tiny', 'tiny');
                            qualitySet = true;
                        } else if (typeof player.setPlaybackQuality === 'function') {
                            player.setPlaybackQuality('tiny');
                            qualitySet = true;
                        }
                    } catch(qErr) {}
                }

                var isAd = player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting');
                if (typeof player.isAdShowing === 'function' && player.isAdShowing()) {
                    isAd = true;
                }

                if (isAd) {
                    // Skip iklan melalui API
                    if (typeof player.skipAd === 'function') {
                        try { player.skipAd(); } catch(e) {}
                    }
                    if (typeof player.cancelPlayback === 'function') {
                        try { player.cancelPlayback(); } catch(e) {}
                    }

                    // Klik tombol skip jika ada
                    var skipBtn = player.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button-modern, button.ytp-skip-ad-button, .ytp-ad-skip-button-container button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id^="skip-button:"] button, button[class*="skip-button"], button[class*="ytp-ad-skip"], .ytp-ad-overlay-close-button');
                    if (skipBtn) {
                        clickEl(skipBtn);
                    }

                    // Percepat iklan unskippable
                    if (isFinite(v.duration) && v.duration > 0 && v.duration < 180) {
                        v.muted = true;
                        v.playbackRate = 16.0;
                        if (v.currentTime < v.duration) {
                            v.currentTime = v.duration;
                        }
                        if (v.paused) v.play().catch(function(){});
                    }
                } else {
                    // Video Utama: Kecepatan strictly 1.0x normal
                    if (v.playbackRate !== 1.0) {
                        v.playbackRate = 1.0;
                    }

                    // Auto-Play: Klik tombol Play jika ada
                    var bigPlay = player.querySelector('button.ytp-large-play-button');
                    if (bigPlay && (bigPlay.offsetWidth > 0 || bigPlay.offsetHeight > 0)) {
                        clickEl(bigPlay);
                    }

                    // Auto-Play: Pastikan video berputar
                    if (v.paused) {
                        if (typeof player.playVideo === 'function') {
                            try { player.playVideo(); } catch(e) {}
                        }
                        v.play().catch(function(){});
                    }

                    // Tutup pop-up "Lanjutkan menonton"
                    var confirmBtn = document.querySelector('yt-confirm-dialog-renderer #confirm-button button');
                    if (confirmBtn) {
                        clickEl(confirmBtn);
                    }
                }
            }
        } catch(err) {}
    }

    // Interval 1000ms (1 detik sekali) - sangat hemat CPU
    setInterval(processYouTube, 1000);
    processYouTube();
})();