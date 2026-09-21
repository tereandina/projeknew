// yt_engine.js - Guaranteed Normal 1.0x Video Playback, Consent Destroyer & Ad-Skipper (2026)
(function() {
    if (window.__YT_LIGHTWEIGHT_ENGINE_ACTIVE__) return;
    window.__YT_LIGHTWEIGHT_ENGINE_ACTIVE__ = true;
    console.log("[YT Engine] Normal Speed 1.0x & Precision Ad-Skipper Active");

    // 1. Set Google Consent Cookie
    try {
        document.cookie = "SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; domain=.youtube.com; path=/; max-age=31536000";
        document.cookie = "CONSENT=PENDING+999; domain=.youtube.com; path=/; max-age=31536000";
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
            // 2. Tutup Pop-up Consent ("Before you continue to YouTube")
            var selectors = [
                'ytd-consent-bump-v2-lightbox button',
                'tp-yt-paper-dialog#dialog button',
                'tp-yt-paper-dialog button',
                '.eom-v1-dialog button',
                'yt-interstitial-view-model button',
                'form[action*="consent"] button',
                'button[aria-label*="Accept" i]',
                'button[aria-label*="Agree" i]',
                'button[aria-label*="Reject" i]',
                'button[aria-label*="Setuju" i]',
                'button[aria-label*="Terima" i]',
                'button[aria-label*="Tolak" i]',
                'button[aria-label*="Dismiss" i]',
                '#dismiss-button button',
                'ytd-button-renderer#confirm-button button',
                'tp-yt-paper-button#dismiss-button'
            ];
            var btns = document.querySelectorAll(selectors.join(', '));
            for (var i = 0; i < btns.length; i++) {
                var btn = btns[i];
                var t = (btn.innerText || btn.getAttribute('aria-label') || '').toLowerCase();
                if (t.includes('accept') || t.includes('agree') || t.includes('setuju') || 
                    t.includes('terima') || t.includes('reject') || t.includes('tolak') || 
                    t.includes('dismiss') || t.includes('continue') || t.includes('lanjut') ||
                    btn.closest('form[action*="consent"]')) {
                    clickEl(btn);
                }
            }

            // Hapus overlay dialog jika masih ada
            var dialogs = document.querySelectorAll('ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog#dialog, .eom-v1-dialog, yt-interstitial-view-model');
            if (dialogs.length > 0) {
                for (var d = 0; d < dialogs.length; d++) {
                    dialogs[d].style.display = 'none';
                    try { dialogs[d].remove(); } catch(e) {}
                }
                var backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
                for (var b = 0; b < backdrops.length; b++) {
                    backdrops[b].style.display = 'none';
                    try { backdrops[b].remove(); } catch(e) {}
                }
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
            }

            // 3. Sembunyikan elemen berat (komentar & rekomendasi)
            var heavy = document.querySelectorAll('#comments, #related, #secondary, ytd-merch-shelf-renderer, #chat');
            for (var h = 0; h < heavy.length; h++) {
                if (heavy[h].style.display !== 'none') {
                    heavy[h].style.display = 'none';
                }
            }

            // 4. Kontrol Video Player & Skip Iklan Akurat
            var player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            var v = player ? player.querySelector('video') : document.querySelector('video');

            if (player && v) {
                // Optimasi resolusi ringan (240p/small)
                if (!qualitySet) {
                    try {
                        if (typeof player.setPlaybackQualityRange === 'function') {
                            player.setPlaybackQualityRange('small', 'small');
                            qualitySet = true;
                        } else if (typeof player.setPlaybackQuality === 'function') {
                            player.setPlaybackQuality('small');
                            qualitySet = true;
                        }
                    } catch(qErr) {}
                }

                // Cek apakah SAAT INI benar-benar sedang memutar iklan
                var isAdActive = false;
                if (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) {
                    isAdActive = true;
                } else if (typeof player.isAdShowing === 'function' && player.isAdShowing()) {
                    isAdActive = true;
                }

                if (isAdActive) {
                    // SAAT IKLAN BERJALAN:
                    // A. Klik tombol Skip Iklan
                    var skipBtn = player.querySelector(
                        '.ytp-skip-ad-button, ' +
                        '.ytp-ad-skip-button, ' +
                        '.ytp-ad-skip-button-modern, ' +
                        'button.ytp-ad-skip-button-modern, ' +
                        'button.ytp-skip-ad-button, ' +
                        '.ytp-ad-skip-button-container button, ' +
                        '.ytp-ad-skip-button-slot button, ' +
                        '.videoAdUiSkipButton, ' +
                        '[id^="skip-button:"] button, ' +
                        'button[class*="skip-button"], ' +
                        'button[class*="ytp-ad-skip"], ' +
                        '.ytp-ad-overlay-close-button'
                    );
                    if (skipBtn) {
                        clickEl(skipBtn);
                    }

                    // B. Panggil API YouTube untuk skip iklan
                    if (typeof player.skipAd === 'function') {
                        try { player.skipAd(); } catch(e) {}
                    }

                    // C. Lewati durasi iklan jika durasi iklan pendek
                    if (isFinite(v.duration) && v.duration > 0 && v.duration < 180) {
                        try {
                            if (v.currentTime < (v.duration - 0.2)) {
                                v.currentTime = v.duration;
                            }
                        } catch(e) {}
                    }
                } else {
                    // SAAT VIDEO UTAMA (BUKAN IKLAN):
                    // WAJIB KECEPATAN NORMAL 1.0x (Tidak dipercepat!)
                    if (v.playbackRate !== 1.0) {
                        v.playbackRate = 1.0;
                    }
                    if (v.defaultPlaybackRate !== 1.0) {
                        v.defaultPlaybackRate = 1.0;
                    }

                    // Klik tombol Play besar di tengah jika belum berputar
                    var bigPlay = player.querySelector('button.ytp-large-play-button');
                    if (bigPlay && (bigPlay.offsetWidth > 0 || bigPlay.offsetHeight > 0)) {
                        clickEl(bigPlay);
                    }

                    // Auto-Play: Pastikan video utama berputar normal
                    if (v.paused) {
                        if (typeof player.playVideo === 'function') {
                            try { player.playVideo(); } catch(e) {}
                        }
                        var pPromise = v.play();
                        if (pPromise !== undefined) {
                            pPromise.catch(function() {
                                v.play().catch(function(){});
                            });
                        }
                    }
                }
            }
        } catch(e) {}
    }

    // Jalankan pemeriksaan setiap 500ms
    setInterval(processYouTube, 500);
    processYouTube();
})();
