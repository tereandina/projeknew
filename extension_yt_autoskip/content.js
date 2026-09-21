// content.js - Runs in Isolated World (DOM manipulation, clicks, events)
console.log("[YT Bot Engine] DOM and Event Controller Active");

function fireClick(el) {
    if (!el) return false;
    try {
        const rect = el.getBoundingClientRect();
        const x = rect.left + (rect.width > 0 ? rect.width / 2 : 10);
        const y = rect.top + (rect.height > 0 ? rect.height / 2 : 10);
        const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
            el.dispatchEvent(new MouseEvent(evt, opts));
        });
        el.click();
        return true;
    } catch(e) {
        try { el.click(); return true; } catch(err){ return false; }
    }
}

function queryDeep(selector, root = document) {
    let results = [];
    try {
        if (root.querySelectorAll) {
            results = Array.from(root.querySelectorAll(selector));
            const allElements = root.querySelectorAll('*');
            for (const el of allElements) {
                if (el.shadowRoot) {
                    results = results.concat(queryDeep(selector, el.shadowRoot));
                }
            }
        }
    } catch(e) {}
    return results;
}

let lastHumanScroll = Date.now();

function domScanAndHandle() {
    try {
        // 1. Consent dialogs (Google / YouTube)
        const consentButtons = queryDeep('button, [role="button"], form input[type="submit"]');
        for (const btn of consentButtons) {
            const txt = (btn.innerText || btn.getAttribute('aria-label') || btn.value || '').trim().toLowerCase();
            if (txt === 'accept all' || txt === 'setuju semua' || txt === 'terima semua' || 
                txt === 'i agree' || txt === 'saya setuju' || txt === 'agree' || txt === 'setuju' ||
                txt === 'reject all' || txt === 'tolak semua') {
                if (btn.offsetWidth > 0 || btn.offsetHeight > 0) {
                    fireClick(btn);
                    return;
                }
            }
        }

        const dismissPopups = queryDeep('#dismiss-button, tp-yt-paper-button#dismiss-button, yt-button-renderer#confirm-button button');
        for (const pop of dismissPopups) {
            if (pop.offsetWidth > 0 || pop.offsetHeight > 0) {
                fireClick(pop);
            }
        }

        // 2. Video Player & Ads
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        const v = document.querySelector('video');
        if (!player || !v) return;

        const isAd = player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting');

        if (isAd) {
            // Shadow DOM skip buttons
            const skipSelectors = [
                '.ytp-skip-ad-button',
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-modern',
                'button.ytp-ad-skip-button-modern',
                'button.ytp-skip-ad-button',
                '.ytp-ad-skip-button-container button',
                '.ytp-ad-skip-button-slot button',
                '.ytp-ad-skip-button-slot',
                '.videoAdUiSkipButton',
                '[id^="skip-button:"] button',
                'button[class*="skip-button"]',
                'button[class*="ytp-ad-skip"]',
                '.ytp-ad-overlay-close-button',
                'button[aria-label*="Skip" i]',
                'button[aria-label*="Lewati" i]'
            ];

            for (const sel of skipSelectors) {
                const btns = queryDeep(sel);
                for (const b of btns) {
                    if (b && (b.offsetWidth > 0 || b.offsetHeight > 0)) {
                        fireClick(b);
                    }
                }
            }

            for (const btn of consentButtons) {
                const txt = (btn.innerText || btn.getAttribute('aria-label') || '').toLowerCase();
                if (txt.includes('skip ad') || txt.includes('skip ads') || txt.includes('lewati iklan') || 
                   (txt.startsWith('skip') && txt.length < 15) || (txt.startsWith('lewati') && txt.length < 15)) {
                    if (btn.offsetWidth > 0 || btn.offsetHeight > 0) {
                        fireClick(btn);
                    }
                }
            }

            if (isFinite(v.duration) && v.duration > 0 && v.duration < 120) {
                v.muted = true;
                v.playbackRate = 16.0;
                if (v.currentTime < v.duration) {
                    v.currentTime = v.duration;
                }
                if (v.paused) v.play().catch(()=>{});
            }
        } else {
            // Main video
            if (v.playbackRate !== 1.0) {
                v.playbackRate = 1.0;
            }

            // Big play button in center
            const bigPlay = queryDeep('button.ytp-large-play-button')[0];
            if (bigPlay && (bigPlay.offsetWidth > 0 || bigPlay.offsetHeight > 0)) {
                fireClick(bigPlay);
            }

            if (v.paused) {
                v.play().catch(()=>{});
            }

            const confirmBtn = queryDeep('yt-confirm-dialog-renderer #confirm-button button')[0];
            if (confirmBtn && (confirmBtn.offsetWidth > 0 || confirmBtn.offsetHeight > 0)) {
                fireClick(confirmBtn);
            }
        }

        // 3. Human scrolling
        if (Date.now() - lastHumanScroll > 15000) {
            window.scrollBy({ top: (Math.random() * 120) - 60, behavior: 'smooth' });
            lastHumanScroll = Date.now();
        }
    } catch (e) {}
}

setInterval(domScanAndHandle, 100);

try {
    const observer = new MutationObserver(() => {
        domScanAndHandle();
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
} catch(e) {}