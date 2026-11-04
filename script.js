(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    document.documentElement.classList.add("js-ready");

    /* ---------- 1. Mobile navigation ---------- */
    const menuToggle = $("#menuToggle");
    const navLinks = $("#navLinks");
    const iconMenu = menuToggle ? menuToggle.querySelector(".icon-menu") : null;
    const iconClose = menuToggle ? menuToggle.querySelector(".icon-close") : null;

    const setMenu = (open) => {
        if (!menuToggle || !navLinks) return;
        navLinks.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        if (iconMenu) iconMenu.style.display = open ? "none" : "block";
        if (iconClose) iconClose.style.display = open ? "block" : "none";
        document.body.classList.toggle("menu-open", open);
    };

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            setMenu(!navLinks.classList.contains("active"));
        });

        $$("#navLinks a").forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) setMenu(false);
        });
    }

    /* ---------- 2. Interactive Project Tabs (Switchable) ---------- */
    const tabButtons = $$(".tab-btn");
    const panels = $$(".showcase-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add("active");
        });
    });

    /* ---------- 3. Scroll Progress Bar ---------- */
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    let scrollTicking = false;
    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
                progress.style.transform = `scaleX(${Math.min(100, Math.max(0, percent)) / 100})`;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    /* ---------- 4. Scroll Reveal Animations ---------- */
    const revealItems = $$(".rv");
    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("in"));
    }

    /* ---------- 5. Smooth Anchor Navigation ---------- */
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.getElementById(decodeURIComponent(href.slice(1)));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        });
    });

    /* ---------- 6. Back-to-top Button ---------- */
    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("visible", window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    /* ---------- 7. Video Progress Bar & 10-Second Trim Loop ---------- */
    const reelVideo = document.getElementById('hero-reel-video');
    const videoProgress = document.getElementById('video-progress');
    const TRIM_DURATION = 10.0; // Loops every 10 seconds

    if (reelVideo && videoProgress) {
        reelVideo.addEventListener('loadedmetadata', () => {
            reelVideo.currentTime = 0;
        });

        reelVideo.addEventListener('timeupdate', () => {
            if (reelVideo.currentTime >= TRIM_DURATION) {
                reelVideo.currentTime = 0;
            }
            const percent = (reelVideo.currentTime / TRIM_DURATION) * 100;
            videoProgress.style.width = `${percent}%`;
        });
    }

    /* ---------- 8. Poster Lightbox ---------- */
    window.openLightbox = function(imageSrc) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
        lightboxEl.addEventListener('click', (e) => {
            if (e.target === lightboxEl) {
                window.closeLightbox();
            }
        });
    }

    /* ---------- 9. Video Modal Logic ---------- */
    window.openVideoModal = function() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('teachVideo');

        if (modal && video) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevents background scrolling

            // Optional: Starts playing immediately when opened
            video.play();
        }
    }

    window.closeVideoModal = function() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('teachVideo');

        if (modal && video) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restores scrolling

            // Stops the video and resets it to the beginning
            video.pause();
            video.currentTime = 0;
        }
    }

    // Close modal if user clicks outside the video
    const videoModalEl = document.getElementById('videoModal');
    if (videoModalEl) {
        videoModalEl.addEventListener('click', (e) => {
            if (e.target === videoModalEl) {
                window.closeVideoModal();
            }
        });
    }

})();