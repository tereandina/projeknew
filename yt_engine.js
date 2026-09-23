// yt_engine.js - Zero-CPU Ultra-Lightweight YouTube Player & Ad-Skipper (2026)
(function() {
    if (window.__YT_ZERO_CPU_ENGINE__) return;
    window.__YT_ZERO_CPU_ENGINE__ = true;

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

    // Injeksi CSS sekali untuk menyembunyikan semua elemen berat
    try {
        var style = document.createElement('style');
        style.id = 'yt-ultra-light-css';
        style.textContent = '#comments, #related, #secondary, ytd-merch-shelf-renderer, #chat, ytd-engagement-panel-section-list-renderer, ytd-banner-promo-renderer, ytd-statement-banner-renderer, tp-yt-iron-overlay-backdrop, ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog#dialog, .eom-v1-dialog { display: none !important; }';
        (document.head || document.documentElement).appendChild(style);
    } catch(e) {}

    function clickEl(el) {
        if (!el) return;
        try { el.click(); } catch(e) {}
    }

    var qualityDone = false;

    function runEngine() {
        try {
            // A. Deteksi bot-block cepat via selector spesifik (tanpa innerText reflow)
            var botErr = document.querySelector('ytd-enforcement-message-view-model, #player-error-message-container, .ytp-error');
            if (botErr) {
                var m = window.location.href.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
                if (m && m[1] && window.location.href.indexOf('/embed/') === -1) {
                    window.location.replace("https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&mute=1");
                    return;
                }
            }

            // B. Tutup consent dialog jika ada
            var consentBtn = document.querySelector('ytd-button-renderer#dismiss-button button, form[action*="consent"] button, button[aria-label*="Agree" i]');
            if (consentBtn) { clickEl(consentBtn); }

            // C. Kontrol Player & Skip Iklan
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                // Kunci 144p sekali saja
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

                var isAd = player.classList.contains('ad-showing') || (typeof player.isAdShowing === 'function' && player.isAdShowing());

                if (isAd) {
                    if (typeof player.skipAd === 'function') { try { player.skipAd(); } catch(e) {} }
                    var skipBtn = player.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button, button.ytp-ad-skip-button-modern');
                    if (skipBtn) { clickEl(skipBtn); }

                    if (isFinite(v.duration) && v.duration > 0 && v.duration < 180) {
                        v.muted = true;
                        v.playbackRate = 16.0;
                        if (v.currentTime < v.duration) { v.currentTime = v.duration; }
                    }
                } else {
                    if (v.playbackRate !== 1.0) { v.playbackRate = 1.0; }
                    if (v.paused) {
                        var playBtn = player.querySelector('button.ytp-large-play-button');
                        if (playBtn) { clickEl(playBtn); }
                        if (typeof player.playVideo === 'function') { try { player.playVideo(); } catch(e) {} }
                        v.play().catch(function(){});
                    }
                }
            }
        } catch(err) {}
    }

    // Interval 2 detik (2000ms) - sangat dingin untuk prosesor dual-core
    setInterval(runEngine, 2000);
    runEngine();
})();