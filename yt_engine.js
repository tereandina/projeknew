// yt_engine.js - Universal Anti-Bot Bypass, 144p Quality Lock & Ad-Skip Engine (2026)
(function() {
    if (window.__YT_ENGINE_V2_ACTIVE__) return;
    window.__YT_ENGINE_V2_ACTIVE__ = true;
    console.log("[YT Engine] Anti-Bot & 144p Playback Engine Initialized");

    // 1. Injeksi Cookie Google & Consent Header
    try {
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "CONSENT=PENDING+999; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube-nocookie.com; path=/; max-age=31536000";
    } catch(e) {}

    // 2. Kunci preferensi kualitas ke 144p (tiny) agar CPU sangat dingin
    try {
        localStorage.setItem('yt-player-quality', JSON.stringify({
            data: 'tiny',
            expiration: Date.now() + 864000000,
            creation: Date.now()
        }));
    } catch(e) {}

    // 3. Injeksi CSS sekali saja untuk menyembunyikan elemen berat (0% beban CPU JS)
    try {
        var style = document.createElement('style');
        style.id = 'yt-lightweight-css';
        style.textContent = '#comments, #related, #secondary, ytd-merch-shelf-renderer, #chat, ytd-engagement-panel-section-list-renderer, ytd-banner-promo-renderer, ytd-statement-banner-renderer, tp-yt-iron-overlay-backdrop, ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog#dialog, .eom-v1-dialog { display: none !important; }';
        document.documentElement.appendChild(style);
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
            // A. Deteksi & Atasi Blokir "Sign in to confirm you're not a bot"
            var botBlock = document.querySelector('ytd-enforcement-message-view-model, #player-error-message-container, [aria-label*="Sign in to confirm you\'re not a bot" i]');
            var pageText = document.body ? (document.body.innerText || '') : '';
            if (botBlock || pageText.indexOf("Sign in to confirm you're not a bot") >= 0 || pageText.indexOf("Sign in to confirm youâ€™re not a bot") >= 0) {
                var vMatch = window.location.href.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
                if (vMatch && vMatch[1]) {
                    console.log("[YT Engine] Bot block detected! Redirecting to Embed Player...");
                    window.location.replace("https://www.youtube-nocookie.com/embed/" + vMatch[1] + "?autoplay=1&mute=0&controls=1");
                    return;
                }
            }

            // B. Tutup pop-up consent Google jika muncul
            var consentBtn = document.querySelector('button[aria-label*="Accept" i], button[aria-label*="Agree" i], button[aria-label*="Setuju" i], button[aria-label*="Terima" i], ytd-button-renderer#dismiss-button button, tp-yt-paper-button#dismiss-button, #dismiss-button, form[action*="consent"] button');
            if (consentBtn) {
                clickEl(consentBtn);
            }

            if (document.body && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
            }

            // C. Kontrol Player & Skip Iklan (Kompatibel Standard & Embed)
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                // Kunci resolusi 144p (tiny)
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

                    // Klik tombol skip
                    var skipBtn = player.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button-modern, button.ytp-skip-ad-button, .ytp-ad-skip-button-container button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id^="skip-button:"] button, button[class*="skip-button"], button[class*="ytp-ad-skip"], .ytp-ad-overlay-close-button');
                    if (skipBtn) {
                        clickEl(skipBtn);
                    }

                    // Fast forward iklan unskippable
                    if (isFinite(v.duration) && v.duration > 0 && v.duration < 180) {
                        v.muted = true;
                        v.playbackRate = 16.0;
                        if (v.currentTime < v.duration) {
                            v.currentTime = v.duration;
                        }
                        if (v.paused) v.play().catch(function(){});
                    }
                } else {
                    // Video Utama: Kecepatan 1.0x normal
                    if (v.playbackRate !== 1.0) {
                        v.playbackRate = 1.0;
                    }

                    // Auto-Play: Klik tombol Play besar jika ada
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

                    // Tutup pop-up konfirmasi
                    var confirmBtn = document.querySelector('yt-confirm-dialog-renderer #confirm-button button');
                    if (confirmBtn) {
                        clickEl(confirmBtn);
                    }
                }
            }
        } catch(err) {}
    }

    setInterval(processYouTube, 1000);
    processYouTube();
})();