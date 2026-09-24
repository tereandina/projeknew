// yt_engine.js - High-Performance Auto-Play, 144p Quality & Ad-Skipper Engine (2026)
(function() {
    if (window.__YT_ENGINE_PRO_ACTIVE__) return;
    window.__YT_ENGINE_PRO_ACTIVE__ = true;
    console.log("[YT Engine Pro] Active - Auto-Play, 144p, & Instant Ad-Skip enabled");

    // 1. Google Cookie & Consent Bypass
    try {
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "CONSENT=PENDING+999; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube-nocookie.com; path=/; max-age=31536000";
    } catch(e) {}

    // 2. Kunci kualitas 144p (tiny) agar ringan dan hemat CPU
    try {
        localStorage.setItem('yt-player-quality', JSON.stringify({
            data: 'tiny',
            expiration: Date.now() + 864000000,
            creation: Date.now()
        }));
    } catch(e) {}

    // 3. CSS Injeksi untuk menyembunyikan komentar & rekomendasi samping (menghemat 70% beban render CPU)
    try {
        var style = document.createElement('style');
        style.id = 'yt-pro-light-css';
        style.textContent = '#comments, #related, #secondary, #below, ytd-merch-shelf-renderer, #chat, ytd-engagement-panel-section-list-renderer, ytd-banner-promo-renderer, ytd-statement-banner-renderer, tp-yt-iron-overlay-backdrop, ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog#dialog, .eom-v1-dialog { display: none !important; }';
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

    function handlePlayer() {
        try {
            // A. Deteksi bot-block "Sign in to confirm you're not a bot" -> alihkan otomatis ke embed
            var botErr = document.querySelector('ytd-enforcement-message-view-model, #player-error-message-container, .ytp-error');
            if (botErr) {
                var m = window.location.href.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
                if (m && m[1] && window.location.href.indexOf('/embed/') === -1) {
                    console.log("[YT Engine] Bot check detected! Redirecting to clean Embed Player...");
                    window.location.replace("https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&mute=0&controls=1");
                    return;
                }
            }

            // B. Tutup pop-up persetujuan Google jika muncul
            var consentBtn = document.querySelector('button[aria-label*="Accept" i], button[aria-label*="Agree" i], button[aria-label*="Setuju" i], button[aria-label*="Terima" i], ytd-button-renderer#dismiss-button button, tp-yt-paper-button#dismiss-button, #dismiss-button, form[action*="consent"] button');
            if (consentBtn) { clickEl(consentBtn); }

            if (document.body && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
            }

            // C. Kontrol Pemutar & Skip Iklan
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                // Kunci resolusi ke 144p (tiny)
                if (!qualityDone) {
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

                // Cek apakah iklan sedang tayang
                var isAd = player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting');
                if (typeof player.isAdShowing === 'function' && player.isAdShowing()) {
                    isAd = true;
                }

                if (isAd) {
                    // 1. Skip via API
                    if (typeof player.skipAd === 'function') { try { player.skipAd(); } catch(e) {} }
                    if (typeof player.cancelPlayback === 'function') { try { player.cancelPlayback(); } catch(e) {} }

                    // 2. Klik tombol skip iklan secara instan
                    var skipBtn = player.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button-modern, button.ytp-skip-ad-button, .ytp-ad-skip-button-container button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id^="skip-button:"] button, button[class*="skip-button"], button[class*="ytp-ad-skip"], .ytp-ad-overlay-close-button');
                    if (skipBtn) { clickEl(skipBtn); }

                    // 3. Percepat iklan yang tidak bisa di-skip (unskippable) 16x
                    if (isFinite(v.duration) && v.duration > 0 && v.duration < 180) {
                        v.muted = true;
                        v.playbackRate = 16.0;
                        if (v.currentTime < v.duration) {
                            v.currentTime = v.duration;
                        }
                        if (v.paused) v.play().catch(function(){});
                    }
                } else {
                    // Video Utama: Kecepatan strictly 1.0x kecepatan normal
                    if (v.playbackRate !== 1.0) {
                        v.playbackRate = 1.0;
                    }

                    // Auto-Play: Klik tombol Play besar jika ada
                    var bigPlay = player.querySelector('button.ytp-large-play-button');
                    if (bigPlay && (bigPlay.offsetWidth > 0 || bigPlay.offsetHeight > 0)) {
                        clickEl(bigPlay);
                    }

                    // Auto-Play: Pastikan video berputar otomatis
                    if (v.paused) {
                        if (typeof player.playVideo === 'function') {
                            try { player.playVideo(); } catch(e) {}
                        }
                        v.play().catch(function(){});
                    }

                    // Tutup pop-up "Lanjutkan menonton"
                    var confirmBtn = document.querySelector('yt-confirm-dialog-renderer #confirm-button button');
                    if (confirmBtn) { clickEl(confirmBtn); }
                }
            }
        } catch(err) {}
    }

    setInterval(handlePlayer, 1000);
    handlePlayer();
})();