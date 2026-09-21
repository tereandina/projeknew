// main_world.js - Runs directly in YouTube page context (MAIN world)
(function() {
    console.log("[YT Bot Engine] Main World Controller Active");

    function enforcePlaybackAndSkipAds() {
        try {
            const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
            const v = document.querySelector('video');
            if (!player) return;

            const isAd = (player.classList && (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting'))) ||
                         (typeof player.isAdShowing === 'function' && player.isAdShowing());

            if (isAd) {
                // Skip via Player API
                if (typeof player.skipAd === 'function') {
                    try { player.skipAd(); } catch(e) {}
                }
                if (typeof player.cancelPlayback === 'function') {
                    try { player.cancelPlayback(); } catch(e) {}
                }
                // Accelerate ad to finish instantly
                if (v && isFinite(v.duration) && v.duration > 0 && v.duration < 120) {
                    v.muted = true;
                    v.playbackRate = 16.0;
                    if (v.currentTime < v.duration) {
                        v.currentTime = v.duration;
                    }
                    if (v.paused) v.play().catch(()=>{});
                }
            } else {
                // Main video playback
                if (v) {
                    if (v.playbackRate !== 1.0) {
                        v.playbackRate = 1.0;
                    }
                    if (v.paused) {
                        if (typeof player.playVideo === 'function') {
                            try { player.playVideo(); } catch(e) {}
                        }
                        v.play().catch(()=>{});
                    }
                }
            }
        } catch(err) {}
    }

    setInterval(enforcePlaybackAndSkipAds, 100);
})();